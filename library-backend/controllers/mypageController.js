const Reservation        = require('../models/Reservation');
const Book               = require('../models/Book');
const Notification       = require('../models/Notification');
const Favorite           = require('../models/Favorite');
const RESERVATION_STATUS = require('../constants/reservationStatus');

// =============================================================
// API-07  GET /api/v1/users/:userId/mypage  （G06 対応）
//
// 指定利用者のマイページ集約データを返却する。
// 以下の3クエリを Promise.all で並列実行する。
//
//   currentReservations : status='RESERVED' の予約（reservedAt 降順）
//   history             : 全予約レコード（reservedAt 降順、最大 50 件）
//   favorites           : お気に入り登録書籍（createdAt 降順）
//   notifications       : 通知一覧（createdAt 降順、最大 50 件）
//
// レスポンス形式: 4層構造（result / messageCode / message / data）§8.2.2 準拠
// 成功: 200  { result:"success", messageCode:"I00", message:"OK", data:{ ... } }
// 失敗: 401 E09（セッション切れ）/ 403 E02（他ユーザーへのアクセス）/ 500 E10（DB例外）
// =============================================================
exports.getMyPage = async (req, res) => {
    const { userId } = req.params;

    const sessionUserId = req.session?.user?.userId;

    // -------------------------------------------------
    // 3. 本人確認（userId ≠ session.userId → 403 W03）
    // -------------------------------------------------
    const userIdNum = parseInt(userId, 10);

    if (userIdNum !== sessionUserId) {
        return res.status(400).json({
            result: 'error',
            messageCode: 'W02',
            message: '他者のリソースにはアクセスできません。',
            data: null
        });
    }

    try {
        // --------------------------------------------------
        // 1. 3テーブルを並列取得
        //    直列にすると応答時間が積み上がるため Promise.all を使用。
        //    ※ History モデルは使用しない。history は reservations テーブルから
        //      全件取得して構築する（§8.4.6 フィールド構成 2 参照）。
        // --------------------------------------------------
        const [reservationRows, allReservationRows, favoriteRows, notificationRows] = await Promise.all([

            // ---------- 1-1. 現在予約一覧 ----------
            // status='RESERVED' のみ取得（§8.4.6 フィールド構成 1）。
            // books テーブルを LEFT JOIN し title / author を付与する。
            // reservedAt 降順。
            Reservation.findAll({
                where: {
                    userId,
                    status: RESERVATION_STATUS.RESERVED,
                },
                include: [{
                    model: Book,
                    required: false,    // 書籍削除済みでも予約レコードを返す（LEFT JOIN）
                    attributes: ['title', 'author'],
                }],
                order: [['reservedAt', 'DESC']],
            }),

            // ---------- 1-2. 予約履歴 ----------
            // status 問わず全予約レコードを取得（RESERVED / CANCELLED / FULFILLED）。
            // books テーブルを LEFT JOIN し title を付与する。
            // reservedAt 降順、最大 50 件（§8.4.6 フィールド構成 2）。
            Reservation.findAll({
                where: { userId },
                include: [{
                    model: Book,
                    required: false,    // 書籍削除済みでも履歴を返す（LEFT JOIN）
                    attributes: ['title'],
                }],
                order: [['reservedAt', 'DESC']],
                limit: 50,
            }),

            // ---------- 1-3. お気に入り ----------
            // books テーブルを LEFT JOIN し書籍情報を付与する。
            // createdAt 降順（§8.4.6 フィールド構成 3）。
            Favorite.findAll({
                where: { userId },
                include: [{
                    model: Book,
                    required: false,    // 書籍削除済みでもお気に入りレコードを返す（LEFT JOIN）
                    attributes: ['title', 'author'],
                }],
                order: [['addedAt', 'DESC']],
            }),

            // ---------- 1-4. 通知一覧 ----------
            // createdAt 降順、最大 50 件（§8.4.6 フィールド構成 4）。
            // ※ 未読優先ソートは廃止。仕様書は createdAt 降順のみ規定。
            Notification.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
                limit: 50,
            }),
        ]);

        // --------------------------------------------------
        // 2. レスポンス整形
        //    モデルのフィールド名を §8.4.6 のフィールド名へマッピングする。
        //    書籍が削除済みの場合は Book が null になるため、
        //    オプショナルチェーン（?.）と null 合体演算子（??）で null を返す。
        // --------------------------------------------------

        // フィールド構成 1: currentReservations
        // status='RESERVED' 固定、pickupDeadline は含まない
        const currentReservations = reservationRows.map(r => ({
            reservationId: r.reservationId,
            bookId:        r.bookId,
            title:         r.Book?.title  ?? null,
            author:        r.Book?.author ?? null,
            status:        r.status,                    // RESERVED 固定
            reservedAt:    r.reservedAt,
        }));

        // フィールド構成 2: history
        // reservations テーブル全件。cancelledAt は CANCELLED の場合のみ非 null。
        const history = allReservationRows.map(r => ({
            reservationId: r.reservationId,
            bookId:        r.bookId,
            title:         r.Book?.title ?? null,
            status:        r.status,                    // RESERVED / CANCELLED / FULFILLED
            reservedAt:    r.reservedAt,
            cancelledAt:    r.status === RESERVATION_STATUS.CANCELLED ? (r.cancelledAt ?? null) : null,
        }));

        // フィールド構成 3: favorites
        // category / addedAt は仕様に含まれないため除外
        const favorites = favoriteRows.map(f => ({
            favoriteId: f.favoriteId,
            bookId:     f.bookId,
            title:      f.Book?.title   ?? null,
            author:     f.Book?.author  ?? null,
        }));

        // フィールド構成 4: notifications
        // type はモデルの type をそのまま使用（severity へのリネーム廃止）
        const notifications = notificationRows.map(n => ({
            notificationId: n.notificationId,
            type:           n.type,             // モデル: type → 仕様書: type（リネームなし）
            title:          n.title,
            body:           n.message,          // モデル: message → 仕様書: body
            isRead:         Boolean(n.isRead),  // 0/1 整数も boolean に正規化（§8.4.6 備考）
            createdAt:      n.createdAt,
        }));

        // --------------------------------------------------
        // 3. 4層構造でレスポンス返却（§8.2.2 / §8.4.6 v4.0a-rev1）
        //    result / messageCode / message をトップレベルに配置し、
        //    4配列はすべて data 配下にネストする。
        // --------------------------------------------------
        return res.status(200).json({
            result:      'success',
            messageCode: 'I00',
            message:     'OK',
            data: {
                currentReservations,
                history,
                favorites,
                notifications,
            },
        });

    } catch (err) {
        // DB例外（仕様書 §8.4.6 / §7.2.3 E10）
        return res.status(500).json({
            result:      'error',
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
            data:        null,
        });
    }
};