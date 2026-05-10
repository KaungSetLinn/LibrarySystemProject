const { Op, literal } = require('sequelize');
const Reservation  = require('../models/Reservation');
const Book         = require('../models/Book');
const History      = require('../models/History');
const Notification = require('../models/Notification');
const Favorite     = require('../models/Favorite');

// =============================================================
// API-07  GET /api/users/:userId/mypage  （G06 対応）
//
// 指定利用者のマイページ集約データを返却する。
// 以下の4配列を1リクエストで一括取得し、Promise.all で並列実行する。
//
//   currentReservations : CANCELLED 以外の有効な予約（pickupDeadline 昇順）
//   history             : 予約操作履歴（新しい順）
//   favorites           : お気に入り登録書籍（登録日降順）
//   notifications       : 通知一覧（未読優先・新しい順）
//
// 成功: 200 { currentReservations, history, favorites, notifications }
// 失敗: 403 E02（他ユーザーへのアクセス）/ 500 E10（DB例外）
// =============================================================
exports.getMyPage = async (req, res) => {
    const { userId } = req.params;

    try {
        // --------------------------------------------------
        // 1. 4テーブルを並列取得
        //    直列にすると応答時間が積み上がるため Promise.all を使用。
        //    変数名に Raw サフィックスを付け、後工程の整形済み変数と区別する。
        // --------------------------------------------------
        const [reservationRows, historyRows, favoriteRows, notificationRows] = await Promise.all([

            // ---------- 1-1. 現在予約一覧 ----------
            // CANCELLED を除いた有効な予約を取得。
            // books テーブルを LEFT JOIN し title / author を付与する。
            // pickupDeadline の NULL・空文字は CASE 式で末尾に配置し、
            // それ以外は昇順（期限が近い順）でソートする。
            Reservation.findAll({
                where: {
                    userId,
                    status: { [Op.ne]: 'CANCELLED' },
                },
                include: [{
                    model: Book,
                    required: false,    // 書籍削除済みでも予約レコードを返す（LEFT JOIN）
                    attributes: ['title', 'author'],
                }],
                order: [
                    [
                        literal(`CASE WHEN "Reservation"."pickupDeadline" IS NULL
                                       OR "Reservation"."pickupDeadline" = ''
                                  THEN 1 ELSE 0 END`),
                        'ASC',
                    ],
                    ['pickupDeadline', 'ASC'],  // 期限が近い順
                ],
            }),

            // ---------- 1-2. 予約操作履歴 ----------
            // History.eventType が仕様書の action、
            // History.eventAt が actionAt、History.detail が note に対応。
            // books テーブルを LEFT JOIN し bookTitle を付与する。
            History.findAll({
                where: { userId },
                include: [{
                    model: Book,
                    required: false,    // 書籍削除済みでも履歴を返す（LEFT JOIN)
                    attributes: ['title'],
                }],
                order: [['eventAt', 'DESC']],
            }),

            // ---------- 1-3. お気に入り ----------
            // books テーブルを LEFT JOIN し書籍情報を付与する。
            Favorite.findAll({
                where: { userId },
                include: [{
                    model: Book,
                    required: false,    // 書籍削除済みでもお気に入りレコードを返す（LEFT JOIN）
                    attributes: ['title', 'author', 'category'],
                }],
                order: [['addedAt', 'DESC']],
            }),

            // ---------- 1-4. 通知一覧 ----------
            // 未読（isRead=false）を先頭に表示し、
            // 同一既読区分内では新しい通知を先に表示する。
            Notification.findAll({
                where: { userId },
                order: [
                    ['isRead',    'ASC'],   // false(0) → true(1) の順
                    ['createdAt', 'DESC'],  // 新しい順
                ],
            }),
        ]);

        // --------------------------------------------------
        // 2. レスポンス整形
        //    モデルのフィールド名を仕様書のフィールド名へマッピングする。
        //    ・History : eventType→action / eventAt→actionAt / detail→note
        //    ・Notification : type→severity / message→body
        //    書籍が削除済みの場合は Book が null になるため、
        //    オプショナルチェーン（?.）と null 合体演算子（??）で null を返す。
        // --------------------------------------------------
        const currentReservations = reservationRows.map(r => ({
            reservationId:  r.reservationId,
            bookId:         r.bookId,
            title:          r.Book?.title  ?? null,
            author:         r.Book?.author ?? null,
            status:         r.status,
            reservedAt:     r.reservedAt,
            pickupDeadline: r.pickupDeadline,
        }));

        const history = historyRows.map(h => ({
            historyId: h.historyId,
            action:    h.eventType,          // モデル: eventType → 仕様書: action
            actionAt:  h.eventAt,            // モデル: eventAt   → 仕様書: actionAt
            bookTitle: h.Book?.title ?? null,
            note:      h.detail,             // モデル: detail    → 仕様書: note
        }));

        const favorites = favoriteRows.map(f => ({
            favoriteId: f.favoriteId,
            bookId:     f.bookId,
            title:      f.Book?.title    ?? null,
            author:     f.Book?.author   ?? null,
            category:   f.Book?.category ?? null,
            addedAt:    f.addedAt,
        }));

        const notifications = notificationRows.map(n => ({
            notificationId: n.notificationId,
            severity:       n.type,          // モデル: type    → 仕様書: severity
            title:          n.title,
            body:           n.message,       // モデル: message → 仕様書: body
            createdAt:      n.createdAt,
            isRead:         n.isRead,
        }));

        // --------------------------------------------------
        // 3. レスポンス返却
        // --------------------------------------------------
        return res.json({ currentReservations, history, favorites, notifications });

    } catch (err) {
        // DB例外（仕様書 §7.2.3 E10）
        return res.status(500).json({
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
        });
    }
};