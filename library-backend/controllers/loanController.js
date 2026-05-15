'use strict';

const sequelize = require('../db/connection');

const Loan = require('../models/Loan');
const Reservation = require('../models/Reservation');
const Audit = require('../models/Audit');
const History = require('../models/History');
const Notification = require('../models/Notification');
const RESERVATION_STATUS = require('../constants/reservationStatus');
const LOAN_STATUS = require('../constants/loanStatus');

// =============================================================
// handleLoanEvent
// POST /api/v1/loans/events  (API-09, §8.4.15)
//
// 外部貸出管理システムから貸出・返却イベントを受信し、
// loans テーブルおよび予約状態を整合します（§13.1）。
//
// LOAN イベント:
//   1. Loan レコードを新規作成する。
//   2. 同一 userId+bookId の RESERVED 予約を物理削除する
//      （窓口貸出等で予約なしの場合はスキップ）。
//   3. History / Audit / Notification を記録する。
//
// RETURN イベント:
//   1. 未返却の Loan（returnDate IS NULL）に返却日を記録する。
//   2. 同一 bookId の最古の WAITING 予約を RESERVED に昇格する。
//   3. History / Audit / Notification を記録する。
//
// すべての DB 書き込みは単一の IMMEDIATE トランザクションで実行（§20.3）。
// =============================================================
exports.handleLoanEvent = async (req, res) => {
    // -------------------------------------------------
    // 1. バリデーション（E04）
    // -------------------------------------------------
    const { eventType, userId, bookId, loanedAt, dueDate } = req.body;

    const isValidDate = (value) => value && !isNaN(Date.parse(value));

    const isValidId = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

    const isValidRequest =
        [LOAN_STATUS.LOAN, LOAN_STATUS.RETURN].includes(eventType) &&
        isValidId(userId) &&
        isValidId(bookId) &&
        isValidDate(loanedAt) &&
        isValidDate(dueDate);

    if (!isValidRequest) {
        return res.status(400).json({
            result: 'error',
            messageCode: 'E04',
            message: '入力に誤りがあります。',
            data: null,
        });
    }

    let affectedReservations = 0;
    let loanId = null;

    try {
        await sequelize.transaction({
            type: sequelize.Sequelize
                ? sequelize.Sequelize.Transaction.TYPES.IMMEDIATE
                : 'IMMEDIATE',
        }, async (t) => {

            if (eventType === LOAN_STATUS.LOAN) {
                // ----------------------------------------------------------
                // LOAN イベント処理
                // ----------------------------------------------------------

                // 1. Loan レコード作成
                const loan = await Loan.create({
                    userId,
                    bookId,
                    loanDate: loanedAt.slice(0, 10), // DATEONLY: 日付部分のみ
                    dueDate: dueDate.slice(0, 10),
                    returnDate: null,
                }, { transaction: t });

                loanId = loan.loanId;

                // 2. 同一 userId+bookId の RESERVED 予約を物理削除
                //    貸出中の書籍は Reservation には存在せず Loan に存在するという前提のため
                const deletedCount = await Reservation.destroy({
                    where: { userId, bookId, status: RESERVATION_STATUS.RESERVED },
                    transaction: t,
                });

                affectedReservations = deletedCount;

                // 3. History 記録
                await History.create({
                    userId,
                    bookId,
                    eventType: LOAN_STATUS.LOAN,
                    eventAt: new Date(loanedAt),
                    detail: JSON.stringify({ loanId: loan.loanId, dueDate }),
                }, { transaction: t });

                // Audit 記録
                await Audit.create({
                    level: 'INFO',
                    eventType: LOAN_STATUS.LOAN,
                    userId,
                    message: `貸出イベント受信: bookId=${bookId}, loanId=${loan.loanId}`,
                }, { transaction: t });

                // 借出者への通知
                await Notification.create({
                    userId,
                    type: 'LOAN_CONFIRMED',
                    title: '貸出処理完了',
                    message: `貸出が完了しました。返却期限: ${dueDate.slice(0, 10)}`,
                    isRead: false,
                }, { transaction: t });

            } else {
                // ----------------------------------------------------------
                // RETURN イベント処理
                // ----------------------------------------------------------

                // 1. 未返却の Loan に返却日を記録
                const loan = await Loan.findOne({
                    where: { userId, bookId, returnDate: null },
                    transaction: t,
                });

                if (loan) {
                    loan.returnDate = new Date().toISOString().slice(0, 10);
                    await loan.save({ transaction: t });
                    loanId = loan.loanId;
                }
                // 対応する貸出レコードが見つからない場合も
                // 予約昇格は続行する（防衛的設計）

                // 2. 最古の WAITING 予約を RESERVED に昇格
                const waitingReservation = await Reservation.findOne({
                    where: { bookId, status: RESERVATION_STATUS.WAITING },
                    order: [['queueNo', 'ASC'], ['reservationId', 'ASC']],
                    transaction: t,
                });

                if (waitingReservation) {
                    waitingReservation.status = RESERVATION_STATUS.RESERVED;
                    waitingReservation.reservedAt = new Date().toISOString();
                    await waitingReservation.save({ transaction: t });
                    affectedReservations = 1;

                    // 昇格した予約者への通知
                    await Notification.create({
                        userId: waitingReservation.userId,
                        type: 'RESERVATION_CONFIRMED',
                        title: '予約確定',
                        message: '予約していた書籍が返却されました。受け取り準備が整いました。',
                        isRead: false,
                    }, { transaction: t });
                }

                // 3. 返却者への通知（waitingReservation の有無にかかわらず送信）
                await Notification.create({
                    userId,
                    type: 'RETURN_COMPLETED',
                    title: '返却完了',
                    message: '書籍の返却が完了しました。',
                    isRead: false,
                }, { transaction: t });

                // 4. History 記録
                await History.create({
                    userId,
                    bookId,
                    eventType: 'RETURN',
                    eventAt: new Date(),
                    detail: JSON.stringify({ loanId }),
                }, { transaction: t });

                // Audit 記録
                await Audit.create({
                    level: 'INFO',
                    eventType: 'RETURN',
                    userId,
                    message: `返却イベント受信: bookId=${bookId}, loanId=${loanId}`,
                }, { transaction: t });
            }
        });

        return res.status(200).json({
            result: 'success',
            messageCode: 'I00',
            message: 'OK',
            data: {
                affectedReservations,
                loanId,
            },
        });

    } catch (err) {
        console.error('❌ API-09 loans/events error:', err);
        return res.status(500).json({
            result: 'error',
            messageCode: 'E10',
            message: 'システムエラーが発生しました。',
            data: null,
        });
    }
};