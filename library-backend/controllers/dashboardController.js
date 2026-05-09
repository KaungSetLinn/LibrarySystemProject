const { Op, literal } = require('sequelize');
const Reservation    = require('../models/Reservation');
const Book           = require('../models/Book');
const Notification   = require('../models/Notification');

// =============================================================
// API-03  GET /api/users/:userId/dashboard  （G02 対応）
//
// 指定利用者のダッシュボード集約データを返却する。
// 以下のデータを1リクエストで一括取得し、Promise.all で並列実行する。
//
//   reservations   : CANCELLED 以外の有効な予約（最大3件、pickupDeadline 昇順）
//   unreadCount    : 未読通知件数
//   notifications  : 直近通知（最大5件、未読優先・新しい順）
//
// 成功: 200 { result, messageCode, message, data: { reservations,
//             reservationCount, remainingQuota, unreadCount, notifications } }
// 失敗: 403 E02（他ユーザーへのアクセス）/ 500 E10（DB例外）
// 認証: requireLogin ミドルウェアが 401 E09 を処理済み
// =============================================================

// 予約上限数。仕様書 §8.4.3 および reservationController.js と同値。
// TODO: 将来的には system_config テーブルの maxReservations を参照する（§20.2）。
const MAX_RESERVATIONS = 3;

exports.getDashboard = async (req, res) => {
    const { userId } = req.params;

    try {
        // --------------------------------------------------
        // 1. 3クエリを並列取得
        //    直列にすると応答時間が積み上がるため Promise.all を使用。
        //    変数名に Rows サフィックスを付け、後工程の整形済み変数と区別する。
        // --------------------------------------------------
        const [reservationRows, unreadCount, notificationRows] = await Promise.all([

            // ---------- 1-1. 現在予約一覧（最大3件） ----------
            // CANCELLED を除いた有効な予約を取得。
            // books テーブルを LEFT JOIN し title / author を付与する。
            // pickupDeadline の NULL・空文字は CASE 式で末尾に配置し、
            // それ以外は昇順（期限が近い順）でソートする。
            // limit を MAX_RESERVATIONS に設定し、上限件数のみ取得する。
            Reservation.findAll({
                where: {
                    userId,
                    status: { [Op.ne]: 'CANCELLED' },
                },
                include: [{
                    model: Book,
                    required: false,        // 書籍削除済みでも予約レコードを返す（LEFT JOIN）
                    attributes: ['title', 'author'],
                }],
                order: [
                    [
                        literal(`CASE WHEN "Reservation"."pickupDeadline" IS NULL
                                       OR "Reservation"."pickupDeadline" = ''
                                  THEN 1 ELSE 0 END`),
                        'ASC',              // NULL・空文字を末尾へ
                    ],
                    ['pickupDeadline', 'ASC'],  // 期限が近い順
                ],
                limit: MAX_RESERVATIONS,    // G02 は最大3件のみ表示
            }),

            // ---------- 1-2. 未読通知件数 ----------
            // G02 のヘッダバッジ表示用。SELECT COUNT のみ実行し行データは取得しない。
            Notification.count({
                where: { userId, isRead: false },
            }),

            // ---------- 1-3. 直近通知（最大5件） ----------
            // 未読（isRead=false）を先頭に表示し、
            // 同一既読区分内では新しい通知を先に表示する。
            // G02 のサマリ表示用のため limit 5 に制限する。
            // 全件が必要な場合は API-07 /mypage を参照。
            Notification.findAll({
                where: { userId },
                order: [
                    ['isRead',    'ASC'],       // false(0) → true(1) の順
                    ['createdAt', 'DESC'],       // 新しい順
                ],
                limit: 5,
            }),
        ]);

        // --------------------------------------------------
        // 2. レスポンス整形
        //    モデルのフィールド名を仕様書のフィールド名へマッピングする。
        //    ・Notification : type→severity / message→body
        //    書籍が削除済みの場合は Book が null になるため、
        //    オプショナルチェーン（?.）と null 合体演算子（??）で null を返す。
        // --------------------------------------------------
        const reservationCount = reservationRows.length;

        const reservations = reservationRows.map(r => ({
            reservationId:  r.reservationId,
            bookId:         r.bookId,
            title:          r.Book?.title  ?? null,
            author:         r.Book?.author ?? null,
            status:         r.status,
            reservedAt:     r.reservedAt,
            pickupDeadline: r.pickupDeadline,
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
        //    remainingQuota は負数にならないよう Math.max で 0 を下限とする。
        //    万が一 reservationCount が MAX_RESERVATIONS を超えるデータが
        //    存在しても、フロントに負数を返さないための安全策。
        // --------------------------------------------------
        return res.status(200).json({
            result:      'success',
            messageCode: 'I02',
            message:     'ダッシュボード情報を取得しました。',
            data: {
                reservations,
                reservationCount,
                remainingQuota: Math.max(0, MAX_RESERVATIONS - reservationCount),
                unreadCount,
                notifications,
            },
        });

    } catch (err) {
        // DB例外（仕様書 §7.2.3 E10）
        return res.status(500).json({
            messageCode: 'E10',
            message:     'システムエラーが発生しました。',
        });
    }
};