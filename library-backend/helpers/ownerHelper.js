'use strict';

/**
 * owner チェックヘルパー（W03）
 *
 * :userId パスパラメータがセッションの userId と一致するかを検証する。
 * 不一致の場合は 403 W03 をレスポンスして false を返すので、
 * 呼び出し元は戻り値が false なら即 return すること。
 *
 * @param {import('express').Request}  req       - Express リクエスト
 * @param {import('express').Response} res       - Express レスポンス
 * @param {number}                     userIdNum - parseInt 済みの :userId
 * @returns {boolean} 本人一致なら true、不一致なら false（403 送信済み）
 */
function _checkOwner(req, res, userIdNum) {
    const sessionUserId = req.session?.user?.userId;
    if (!sessionUserId || sessionUserId !== userIdNum) {
        res.status(403).json({
            result:      'error',
            messageCode: 'W03',
            message:     '他者のリソースにはアクセスできません。',
            data:        null,
        });
        return false;
    }
    return true;
}

module.exports = { _checkOwner };