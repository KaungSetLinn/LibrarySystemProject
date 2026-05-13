// constants/reservationStatus.js

const RESERVATION_STATUS = Object.freeze({
    WAITING:   'WAITING',    // 予約待ち（貸出待ち）
    RESERVED:  'RESERVED',   // 予約確定（§8.4.6 currentReservations の対象）
    CANCELLED: 'CANCELLED',   // 取消済み（§8.4.6 history: canceledAt が非 null）
    FULFILLED: 'FULFILLED',  // 貸出完了（§8.4.6 history に含まれる）

    // NOTE: 旧定数 CANCELLED（L が2つ）は DB・仕様書の実値と異なるため廃止。
    //       既存コードで CANCELLED を参照している箇所は CANCELED へ置き換えること。
});

module.exports = RESERVATION_STATUS;