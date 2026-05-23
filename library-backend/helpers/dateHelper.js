'use strict';

// UTC の Date を Asia/Tokyo のローカル時刻文字列に変換するヘルパー
// 例: 2026-05-23T01:22:41.040Z → "2026-05-23T10:22:41+09:00"
function _toLocalISO(date) {
    if (!date) return null;
    return new Date(date).toLocaleString('sv-SE', {
        timeZone: 'Asia/Tokyo',
        hour12: false,
    }).replace(' ', 'T') + '+09:00';
}

module.exports = { _toLocalISO };