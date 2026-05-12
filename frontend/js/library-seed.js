/*
 * ----------------------------------------------------------------------------
 * ファイル名   : library-seed.js
 * 概要         : 図書予約システムの初期投入データ。
 *                添付SQL(create_database)の登録内容を予約システム用の
 *                初期表示データへ変換して保持する。
 * 作成者       : Y.Toyoda
 * 作成日       : 2026-04-17
 * ----------------------------------------------------------------------------
 */

// ブラウザから参照する初期データセットを定義する。
window.LIBRARY_SEED_DATA = {
  "users": [
    {
      "userId": "1",
      "userName": "佐藤翔太",
      "enabled": true
    },
    {
      "userId": "2",
      "userName": "鈴木蓮",
      "enabled": true
    },
    {
      "userId": "3",
      "userName": "高橋翔",
      "enabled": true
    },
    {
      "userId": "4",
      "userName": "田中陸",
      "enabled": true
    },
    {
      "userId": "5",
      "userName": "渡辺颯太",
      "enabled": true
    },
    {
      "userId": "6",
      "userName": "伊藤悠斗",
      "enabled": true
    },
    {
      "userId": "7",
      "userName": "山本大翔",
      "enabled": true
    },
    {
      "userId": "8",
      "userName": "中村樹",
      "enabled": true
    },
    {
      "userId": "9",
      "userName": "小林翼",
      "enabled": true
    },
    {
      "userId": "10",
      "userName": "加藤大和",
      "enabled": true
    },
    {
      "userId": "11",
      "userName": "吉田奏太",
      "enabled": true
    },
    {
      "userId": "12",
      "userName": "山田大輝",
      "enabled": true
    },
    {
      "userId": "13",
      "userName": "佐々木悠",
      "enabled": true
    },
    {
      "userId": "14",
      "userName": "山口隼人",
      "enabled": true
    },
    {
      "userId": "15",
      "userName": "松本大輔",
      "enabled": true
    },
    {
      "userId": "16",
      "userName": "井上健太",
      "enabled": true
    },
    {
      "userId": "17",
      "userName": "井上駿",
      "enabled": true
    },
    {
      "userId": "18",
      "userName": "斎藤優",
      "enabled": true
    },
    {
      "userId": "19",
      "userName": "木村陽斗",
      "enabled": true
    },
    {
      "userId": "20",
      "userName": "林悠人",
      "enabled": true
    }
  ],
  "books": [
    {
      "bookId": "1",
      "title": "小学生でもわかるスマホ&パソコンそもそも事典",
      "author": "秋田勘助",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-02"
    },
    {
      "bookId": "2",
      "title": "冥途のお客",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-03"
    },
    {
      "bookId": "3",
      "title": "螢草 下",
      "author": "葉室麟",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-04"
    },
    {
      "bookId": "4",
      "title": "螢草 上",
      "author": "葉室麟",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-05"
    },
    {
      "bookId": "5",
      "title": "真田騒動 下",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-06"
    },
    {
      "bookId": "6",
      "title": "真田騒動 上",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-07"
    },
    {
      "bookId": "7",
      "title": "さすらいの仏教語",
      "author": "玄侑宗久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-08"
    },
    {
      "bookId": "8",
      "title": "私が人生の旅で学んだこと",
      "author": "日野原重明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-09"
    },
    {
      "bookId": "9",
      "title": "夜の橋 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-10"
    },
    {
      "bookId": "10",
      "title": "短夜の髪 下",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-11"
    },
    {
      "bookId": "11",
      "title": "短夜の髪 上",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-12"
    },
    {
      "bookId": "12",
      "title": "御家人斬九郎 下",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-13"
    },
    {
      "bookId": "13",
      "title": "御家人斬九郎 上",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-14"
    },
    {
      "bookId": "14",
      "title": "翳りゆく夏 下",
      "author": "赤井三尋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-15"
    },
    {
      "bookId": "15",
      "title": "翳りゆく夏 上",
      "author": "赤井三尋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-16"
    },
    {
      "bookId": "16",
      "title": "あかんべえ 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-17"
    },
    {
      "bookId": "17",
      "title": "あかんべえ 中",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-18"
    },
    {
      "bookId": "18",
      "title": "あかんべえ 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-19"
    },
    {
      "bookId": "19",
      "title": "陰翳礼讃・吉野葛",
      "author": "谷崎潤一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-20"
    },
    {
      "bookId": "20",
      "title": "夜の小紋",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-21"
    },
    {
      "bookId": "21",
      "title": "ぶらり日本史散策 下",
      "author": "半藤一利",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-22"
    },
    {
      "bookId": "22",
      "title": "ぶらり日本史散策 上",
      "author": "半藤一利",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-23"
    },
    {
      "bookId": "23",
      "title": "殿様の通信簿 下",
      "author": "磯田道史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-24"
    },
    {
      "bookId": "24",
      "title": "殿様の通信簿 上",
      "author": "磯田道史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-25"
    },
    {
      "bookId": "25",
      "title": "第三の時効 下",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-26"
    },
    {
      "bookId": "26",
      "title": "第三の時効 上",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-27"
    },
    {
      "bookId": "27",
      "title": "月下の恋人 下",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-28"
    },
    {
      "bookId": "28",
      "title": "月下の恋人 上",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-29"
    },
    {
      "bookId": "29",
      "title": "平蔵の首 下",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-30"
    },
    {
      "bookId": "30",
      "title": "平蔵の首 上",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-31"
    },
    {
      "bookId": "31",
      "title": "院長の恋",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-01"
    },
    {
      "bookId": "32",
      "title": "花あらし 上",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-02"
    },
    {
      "bookId": "33",
      "title": "八丁堀育ち",
      "author": "風野真知雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-03"
    },
    {
      "bookId": "34",
      "title": "パンドラの匣 下",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-04"
    },
    {
      "bookId": "35",
      "title": "パンドラの匣 上",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-05"
    },
    {
      "bookId": "36",
      "title": "人間失格 下",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-06"
    },
    {
      "bookId": "37",
      "title": "人間失格 上",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-07"
    },
    {
      "bookId": "38",
      "title": "斜陽 下",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-08"
    },
    {
      "bookId": "39",
      "title": "斜陽 上",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-09"
    },
    {
      "bookId": "40",
      "title": "右大臣実朝 下",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-10"
    },
    {
      "bookId": "41",
      "title": "右大臣実朝 上",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-11"
    },
    {
      "bookId": "42",
      "title": "宮本武蔵 6下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-12"
    },
    {
      "bookId": "43",
      "title": "宮本武蔵 6上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-13"
    },
    {
      "bookId": "44",
      "title": "宮本武蔵 5下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-14"
    },
    {
      "bookId": "45",
      "title": "宮本武蔵 5上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-15"
    },
    {
      "bookId": "46",
      "title": "宮本武蔵 4下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-16"
    },
    {
      "bookId": "47",
      "title": "宮本武蔵 4上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-17"
    },
    {
      "bookId": "48",
      "title": "宮本武蔵 3下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-18"
    },
    {
      "bookId": "49",
      "title": "宮本武蔵 3上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-19"
    },
    {
      "bookId": "50",
      "title": "宮本武蔵 2下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-20"
    },
    {
      "bookId": "51",
      "title": "宮本武蔵 2上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-21"
    },
    {
      "bookId": "52",
      "title": "宮本武蔵 1下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-22"
    },
    {
      "bookId": "53",
      "title": "宮本武蔵 1上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-23"
    },
    {
      "bookId": "54",
      "title": "三国志 2下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-24"
    },
    {
      "bookId": "55",
      "title": "三国志 2上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-25"
    },
    {
      "bookId": "56",
      "title": "三国志 1下",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-26"
    },
    {
      "bookId": "57",
      "title": "三国志 1上",
      "author": "吉川英治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-27"
    },
    {
      "bookId": "58",
      "title": "障害者の読書と電子書籍",
      "author": "日本盲人社会福祉施設協議会情報サービス部会",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-28"
    },
    {
      "bookId": "59",
      "title": "必要のない人",
      "author": "内館牧子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-01"
    },
    {
      "bookId": "60",
      "title": "羊の歌 下",
      "author": "加藤周一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-02"
    },
    {
      "bookId": "61",
      "title": "羊の歌 上",
      "author": "加藤周一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-03"
    },
    {
      "bookId": "62",
      "title": "幕末浪漫剣 下",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-04"
    },
    {
      "bookId": "63",
      "title": "幕末浪漫剣 上",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-05"
    },
    {
      "bookId": "64",
      "title": "他力 下",
      "author": "五木寛之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-06"
    },
    {
      "bookId": "65",
      "title": "他力 上",
      "author": "五木寛之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-07"
    },
    {
      "bookId": "66",
      "title": "最後の藁",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-08"
    },
    {
      "bookId": "67",
      "title": "剣鬼 下",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-09"
    },
    {
      "bookId": "68",
      "title": "剣鬼 上",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-10"
    },
    {
      "bookId": "69",
      "title": "かもめの日 下",
      "author": "黒川創",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-11"
    },
    {
      "bookId": "70",
      "title": "かもめの日 上",
      "author": "黒川創",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-12"
    },
    {
      "bookId": "71",
      "title": "隠し剣孤影抄 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-13"
    },
    {
      "bookId": "72",
      "title": "隠し剣孤影抄 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-14"
    },
    {
      "bookId": "73",
      "title": "魚の棲む城 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-15"
    },
    {
      "bookId": "74",
      "title": "魚の棲む城 中",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-16"
    },
    {
      "bookId": "75",
      "title": "魚の棲む城 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-17"
    },
    {
      "bookId": "76",
      "title": "わたしの四季暦",
      "author": "宮尾登美子",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-18"
    },
    {
      "bookId": "77",
      "title": "養老訓",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-19"
    },
    {
      "bookId": "78",
      "title": "むこうだんばら亭 下",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-20"
    },
    {
      "bookId": "79",
      "title": "むこうだんばら亭 上",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-21"
    },
    {
      "bookId": "80",
      "title": "みのたけの春 下",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-22"
    },
    {
      "bookId": "81",
      "title": "みのたけの春 上",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-23"
    },
    {
      "bookId": "82",
      "title": "彦左衛門外記 下",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-24"
    },
    {
      "bookId": "83",
      "title": "彦左衛門外記 上",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-25"
    },
    {
      "bookId": "84",
      "title": "テロルの決算 下",
      "author": "沢木耕太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-26"
    },
    {
      "bookId": "85",
      "title": "テロルの決算 上",
      "author": "沢木耕太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-27"
    },
    {
      "bookId": "86",
      "title": "桜ハウス 下",
      "author": "藤堂志津子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-28"
    },
    {
      "bookId": "87",
      "title": "桜ハウス 上",
      "author": "藤堂志津子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-29"
    },
    {
      "bookId": "88",
      "title": "ココロの止まり木",
      "author": "河合隼雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-30"
    },
    {
      "bookId": "89",
      "title": "黒牛と妖怪 下",
      "author": "風野真知雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-31"
    },
    {
      "bookId": "90",
      "title": "黒牛と妖怪 上",
      "author": "風野真知雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-01"
    },
    {
      "bookId": "91",
      "title": "安土城の幽霊",
      "author": "加藤廣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-02"
    },
    {
      "bookId": "92",
      "title": "赤い月 下",
      "author": "なかにし礼",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-03"
    },
    {
      "bookId": "93",
      "title": "赤い月 中",
      "author": "なかにし礼",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-04"
    },
    {
      "bookId": "94",
      "title": "赤い月 上",
      "author": "なかにし礼",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-05"
    },
    {
      "bookId": "95",
      "title": "教えて伊藤先生!憲法改正って何",
      "author": "伊藤真",
      "category": "法律",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-06"
    },
    {
      "bookId": "96",
      "title": "あの〜、それは違法行為ですけど…",
      "author": "牧野二郎",
      "category": "法律",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-07"
    },
    {
      "bookId": "97",
      "title": "花はさくら木 下",
      "author": "辻原登",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-08"
    },
    {
      "bookId": "98",
      "title": "花はさくら木 上",
      "author": "辻原登",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-09"
    },
    {
      "bookId": "99",
      "title": "木骨記 下",
      "author": "市原麻里子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-10"
    },
    {
      "bookId": "100",
      "title": "木骨記 上",
      "author": "市原麻里子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-11"
    },
    {
      "bookId": "101",
      "title": "道連れ彦輔 下",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-12"
    },
    {
      "bookId": "102",
      "title": "道連れ彦輔 上",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-13"
    },
    {
      "bookId": "103",
      "title": "少女像(ブロンズ)は泣かなかった 下",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-14"
    },
    {
      "bookId": "104",
      "title": "少女像(ブロンズ)は泣かなかった 上",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-15"
    },
    {
      "bookId": "105",
      "title": "ナイン 下",
      "author": "川上健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-16"
    },
    {
      "bookId": "106",
      "title": "ナイン 中",
      "author": "川上健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-17"
    },
    {
      "bookId": "107",
      "title": "ナイン 上",
      "author": "川上健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-18"
    },
    {
      "bookId": "108",
      "title": "天下布武 4",
      "author": "安部龍太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-19"
    },
    {
      "bookId": "109",
      "title": "天下布武 3",
      "author": "安部龍太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-20"
    },
    {
      "bookId": "110",
      "title": "天下布武 2",
      "author": "安部龍太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-21"
    },
    {
      "bookId": "111",
      "title": "天下布武 1",
      "author": "安部龍太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-22"
    },
    {
      "bookId": "112",
      "title": "憑神 下",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-23"
    },
    {
      "bookId": "113",
      "title": "憑神 上",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-24"
    },
    {
      "bookId": "114",
      "title": "清陰星雨 下",
      "author": "中井久夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-25"
    },
    {
      "bookId": "115",
      "title": "清陰星雨 上",
      "author": "中井久夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-26"
    },
    {
      "bookId": "116",
      "title": "数学者の言葉では 下",
      "author": "藤原正彦",
      "category": "学術",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-27"
    },
    {
      "bookId": "117",
      "title": "数学者の言葉では 上",
      "author": "藤原正彦",
      "category": "学術",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-28"
    },
    {
      "bookId": "118",
      "title": "真田軍記",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-29"
    },
    {
      "bookId": "119",
      "title": "絹扇 下",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-30"
    },
    {
      "bookId": "120",
      "title": "絹扇 上",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-01"
    },
    {
      "bookId": "121",
      "title": "からだのままに",
      "author": "南木佳士",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-02"
    },
    {
      "bookId": "122",
      "title": "隠蔽捜査 下",
      "author": "今野敏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-03"
    },
    {
      "bookId": "123",
      "title": "隠蔽捜査 上",
      "author": "今野敏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-04"
    },
    {
      "bookId": "124",
      "title": "愛しいひと 下",
      "author": "明野照葉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-05"
    },
    {
      "bookId": "125",
      "title": "愛しいひと 上",
      "author": "明野照葉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-06"
    },
    {
      "bookId": "126",
      "title": "生きることの質",
      "author": "日野原重明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-07"
    },
    {
      "bookId": "127",
      "title": "明るい方へ 下",
      "author": "太田治子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-08"
    },
    {
      "bookId": "128",
      "title": "明るい方へ 上",
      "author": "太田治子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-09"
    },
    {
      "bookId": "129",
      "title": "視覚障害者と健常者が共に楽しめるスポーツ",
      "author": "桜雲会集",
      "category": "福祉",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-10"
    },
    {
      "bookId": "130",
      "title": "ベラルーシの林檎 下",
      "author": "岸惠子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-11"
    },
    {
      "bookId": "131",
      "title": "ベラルーシの林檎 上",
      "author": "岸惠子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-12"
    },
    {
      "bookId": "132",
      "title": "猫と庄造と二人のおんな",
      "author": "谷崎潤一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-13"
    },
    {
      "bookId": "133",
      "title": "錦 下",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-14"
    },
    {
      "bookId": "134",
      "title": "錦 上",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-15"
    },
    {
      "bookId": "135",
      "title": "怒濤のごとく 4",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-16"
    },
    {
      "bookId": "136",
      "title": "怒濤のごとく 3",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-17"
    },
    {
      "bookId": "137",
      "title": "怒濤のごとく 2",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-18"
    },
    {
      "bookId": "138",
      "title": "怒濤のごとく 1",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-19"
    },
    {
      "bookId": "139",
      "title": "杖下に死す 下",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-20"
    },
    {
      "bookId": "140",
      "title": "杖下に死す 中",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-21"
    },
    {
      "bookId": "141",
      "title": "杖下に死す 上",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-22"
    },
    {
      "bookId": "142",
      "title": "おそろし 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-23"
    },
    {
      "bookId": "143",
      "title": "おそろし 中",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-24"
    },
    {
      "bookId": "144",
      "title": "おそろし 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-25"
    },
    {
      "bookId": "145",
      "title": "いつか陽のあたる場所で 下",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-26"
    },
    {
      "bookId": "146",
      "title": "いつか陽のあたる場所で 上",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-27"
    },
    {
      "bookId": "147",
      "title": "大きな字だからスグ分かる!インターネット&メール入門",
      "author": "湯浅英夫",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-28"
    },
    {
      "bookId": "148",
      "title": "手塚治虫物語への招待 3",
      "author": "手塚治虫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-29"
    },
    {
      "bookId": "149",
      "title": "手塚治虫物語への招待 2",
      "author": "手塚治虫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-30"
    },
    {
      "bookId": "150",
      "title": "手塚治虫物語への招待 1",
      "author": "手塚治虫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-31"
    },
    {
      "bookId": "151",
      "title": "アホラ詩集",
      "author": "やなせたかし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-01"
    },
    {
      "bookId": "152",
      "title": "熟年離婚の相談室",
      "author": "岡野あつこ",
      "category": "法律",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-02"
    },
    {
      "bookId": "153",
      "title": "コンピューターおばあちゃんといっしょに学ぶはじめてのパソコン",
      "author": "大川加世子／協力",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-03"
    },
    {
      "bookId": "154",
      "title": "みんなで知っ得「助かる」「助ける」",
      "author": "",
      "category": "福祉",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-04"
    },
    {
      "bookId": "155",
      "title": "四文字の殺意 下",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-05"
    },
    {
      "bookId": "156",
      "title": "四文字の殺意 上",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-06"
    },
    {
      "bookId": "157",
      "title": "間宮林蔵 下",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-07"
    },
    {
      "bookId": "158",
      "title": "間宮林蔵 中",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-08"
    },
    {
      "bookId": "159",
      "title": "間宮林蔵 上",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-09"
    },
    {
      "bookId": "160",
      "title": "星への手紙",
      "author": "串田孫一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-10"
    },
    {
      "bookId": "161",
      "title": "大盗の夜 下",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-11"
    },
    {
      "bookId": "162",
      "title": "大盗の夜 上",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-12"
    },
    {
      "bookId": "163",
      "title": "素行調査官 下",
      "author": "笹本稜平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-13"
    },
    {
      "bookId": "164",
      "title": "素行調査官 中",
      "author": "笹本稜平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-14"
    },
    {
      "bookId": "165",
      "title": "素行調査官 上",
      "author": "笹本稜平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-15"
    },
    {
      "bookId": "166",
      "title": "賊将 下",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-16"
    },
    {
      "bookId": "167",
      "title": "賊将 上",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-17"
    },
    {
      "bookId": "168",
      "title": "水曜の朝、午前三時 下",
      "author": "蓮見圭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-18"
    },
    {
      "bookId": "169",
      "title": "水曜の朝、午前三時 上",
      "author": "蓮見圭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-19"
    },
    {
      "bookId": "170",
      "title": "司馬さんは夢の中 下",
      "author": "福田みどり",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-20"
    },
    {
      "bookId": "171",
      "title": "司馬さんは夢の中 上",
      "author": "福田みどり",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-21"
    },
    {
      "bookId": "172",
      "title": "獅子の系譜 下",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-22"
    },
    {
      "bookId": "173",
      "title": "獅子の系譜 中",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-23"
    },
    {
      "bookId": "174",
      "title": "獅子の系譜 上",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-24"
    },
    {
      "bookId": "175",
      "title": "銀座開化おもかげ草紙 下",
      "author": "松井今朝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-25"
    },
    {
      "bookId": "176",
      "title": "銀座開化おもかげ草紙 上",
      "author": "松井今朝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-26"
    },
    {
      "bookId": "177",
      "title": "オリンピックの身代金 4",
      "author": "奥田英朗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-27"
    },
    {
      "bookId": "178",
      "title": "オリンピックの身代金 3",
      "author": "奥田英朗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-28"
    },
    {
      "bookId": "179",
      "title": "オリンピックの身代金 2",
      "author": "奥田英朗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-29"
    },
    {
      "bookId": "180",
      "title": "オリンピックの身代金 1",
      "author": "奥田英朗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-30"
    },
    {
      "bookId": "181",
      "title": "麦屋町昼下がり 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-01"
    },
    {
      "bookId": "182",
      "title": "麦屋町昼下がり 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-02"
    },
    {
      "bookId": "183",
      "title": "平成大家族 下",
      "author": "中島京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-03"
    },
    {
      "bookId": "184",
      "title": "平成大家族 上",
      "author": "中島京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-04"
    },
    {
      "bookId": "185",
      "title": "平安妖異伝 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-05"
    },
    {
      "bookId": "186",
      "title": "平安妖異伝 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-06"
    },
    {
      "bookId": "187",
      "title": "大きな字ですぐわかるはじめてのCD/DVD",
      "author": "香山紀",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-07"
    },
    {
      "bookId": "188",
      "title": "大きな字ですぐわかるはじめてのウィンドウズ7",
      "author": "尾崎裕子",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-08"
    },
    {
      "bookId": "189",
      "title": "ひとりでできる家庭料理",
      "author": "",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-09"
    },
    {
      "bookId": "190",
      "title": "私の遺言 下",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-10"
    },
    {
      "bookId": "191",
      "title": "私の遺言 上",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-11"
    },
    {
      "bookId": "192",
      "title": "鱗光の剣 下",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-12"
    },
    {
      "bookId": "193",
      "title": "鱗光の剣 上",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-13"
    },
    {
      "bookId": "194",
      "title": "泥流地帯 下",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-14"
    },
    {
      "bookId": "195",
      "title": "泥流地帯 中",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-15"
    },
    {
      "bookId": "196",
      "title": "泥流地帯 上",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-16"
    },
    {
      "bookId": "197",
      "title": "椿山 下",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-17"
    },
    {
      "bookId": "198",
      "title": "椿山 上",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-18"
    },
    {
      "bookId": "199",
      "title": "小さき者へ 下",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-19"
    },
    {
      "bookId": "200",
      "title": "小さき者へ 上",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-20"
    },
    {
      "bookId": "201",
      "title": "それからの海舟 下",
      "author": "半藤一利",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-21"
    },
    {
      "bookId": "202",
      "title": "それからの海舟 上",
      "author": "半藤一利",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-22"
    },
    {
      "bookId": "203",
      "title": "佐渡流人行 下",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-23"
    },
    {
      "bookId": "204",
      "title": "佐渡流人行 上",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-24"
    },
    {
      "bookId": "205",
      "title": "五郎治殿御始末",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-25"
    },
    {
      "bookId": "206",
      "title": "大きな字ですぐわかるはじめてのハガキ作成",
      "author": "尾崎裕子",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-26"
    },
    {
      "bookId": "207",
      "title": "はなかげ 下",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-27"
    },
    {
      "bookId": "208",
      "title": "はなかげ 上",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-28"
    },
    {
      "bookId": "209",
      "title": "忘れかけていた大切なこと",
      "author": "渡辺和子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-29"
    },
    {
      "bookId": "210",
      "title": "めぐらし屋",
      "author": "堀江敏幸",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-30"
    },
    {
      "bookId": "211",
      "title": "脳と仮想 下",
      "author": "茂木健一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-31"
    },
    {
      "bookId": "212",
      "title": "脳と仮想 上",
      "author": "茂木健一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-01"
    },
    {
      "bookId": "213",
      "title": "辰巳八景 下",
      "author": "山本一力",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-02"
    },
    {
      "bookId": "214",
      "title": "辰巳八景 上",
      "author": "山本一力",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-03"
    },
    {
      "bookId": "215",
      "title": "高丘親王航海記 下",
      "author": "澁澤龍彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-04"
    },
    {
      "bookId": "216",
      "title": "高丘親王航海記 上",
      "author": "澁澤龍彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-05"
    },
    {
      "bookId": "217",
      "title": "絶海にあらず 4",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-06"
    },
    {
      "bookId": "218",
      "title": "絶海にあらず 3",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-07"
    },
    {
      "bookId": "219",
      "title": "絶海にあらず 2",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-08"
    },
    {
      "bookId": "220",
      "title": "絶海にあらず 1",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-09"
    },
    {
      "bookId": "221",
      "title": "重蔵始末 下",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-10"
    },
    {
      "bookId": "222",
      "title": "重蔵始末 上",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-11"
    },
    {
      "bookId": "223",
      "title": "食に知恵あり 下",
      "author": "小泉武夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-12"
    },
    {
      "bookId": "224",
      "title": "食に知恵あり 上",
      "author": "小泉武夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-13"
    },
    {
      "bookId": "225",
      "title": "渾身 下",
      "author": "川上健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-14"
    },
    {
      "bookId": "226",
      "title": "渾身 上",
      "author": "川上健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-15"
    },
    {
      "bookId": "227",
      "title": "喜娘 下",
      "author": "梓澤要",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-16"
    },
    {
      "bookId": "228",
      "title": "喜娘 上",
      "author": "梓澤要",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-17"
    },
    {
      "bookId": "229",
      "title": "消えた相続人 下",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-18"
    },
    {
      "bookId": "230",
      "title": "消えた相続人 上",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-19"
    },
    {
      "bookId": "231",
      "title": "かげろう",
      "author": "藤堂志津子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-20"
    },
    {
      "bookId": "232",
      "title": "大人の友情",
      "author": "河合隼雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-21"
    },
    {
      "bookId": "233",
      "title": "御書物同心日記 下",
      "author": "出久根達郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-22"
    },
    {
      "bookId": "234",
      "title": "御書物同心日記 上",
      "author": "出久根達郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-23"
    },
    {
      "bookId": "235",
      "title": "愛する源氏物語 下",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-24"
    },
    {
      "bookId": "236",
      "title": "愛する源氏物語 上",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-25"
    },
    {
      "bookId": "237",
      "title": "大きな字ですぐわかるはじめてのワード",
      "author": "尾崎裕子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-26"
    },
    {
      "bookId": "238",
      "title": "大きな活字の全訳漢辞海",
      "author": "戸川芳郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-27"
    },
    {
      "bookId": "239",
      "title": "大きな字ですぐわかるはじめてのエクセル",
      "author": "尾崎裕子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-28"
    },
    {
      "bookId": "240",
      "title": "はじめよう!ツイッター",
      "author": "日経PCビギナーズ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-29"
    },
    {
      "bookId": "241",
      "title": "使いこなしもバッチリ!無線LAN&Wi‐Fi完全理解",
      "author": "日経PCビギナーズ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-30"
    },
    {
      "bookId": "242",
      "title": "龍馬伝 4-3",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-31"
    },
    {
      "bookId": "243",
      "title": "龍馬伝 4-2",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-01"
    },
    {
      "bookId": "244",
      "title": "龍馬伝 4-1",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-02"
    },
    {
      "bookId": "245",
      "title": "春の数えかた",
      "author": "日高敏隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-03"
    },
    {
      "bookId": "246",
      "title": "はずれの記 下",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-04"
    },
    {
      "bookId": "247",
      "title": "はずれの記 上",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-05"
    },
    {
      "bookId": "248",
      "title": "灰の男 4",
      "author": "小杉健治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-06"
    },
    {
      "bookId": "249",
      "title": "灰の男 3",
      "author": "小杉健治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-07"
    },
    {
      "bookId": "250",
      "title": "灰の男 2",
      "author": "小杉健治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-08"
    },
    {
      "bookId": "251",
      "title": "灰の男 1",
      "author": "小杉健治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-09"
    },
    {
      "bookId": "252",
      "title": "瑠璃色の石",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-10"
    },
    {
      "bookId": "253",
      "title": "澪つくし 下",
      "author": "明野照葉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-11"
    },
    {
      "bookId": "254",
      "title": "澪つくし 上",
      "author": "明野照葉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-12"
    },
    {
      "bookId": "255",
      "title": "長さではない命の豊かさ",
      "author": "日野原重明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-13"
    },
    {
      "bookId": "256",
      "title": "長城のかげ 下",
      "author": "宮城谷昌光",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-14"
    },
    {
      "bookId": "257",
      "title": "長城のかげ 上",
      "author": "宮城谷昌光",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-15"
    },
    {
      "bookId": "258",
      "title": "寿司屋のかみさんおいしい話",
      "author": "佐川芳枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-16"
    },
    {
      "bookId": "259",
      "title": "ジョゼと虎と魚たち 下",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-17"
    },
    {
      "bookId": "260",
      "title": "ジョゼと虎と魚たち 上",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-18"
    },
    {
      "bookId": "261",
      "title": "子づれ兵法者 下",
      "author": "佐江衆一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-19"
    },
    {
      "bookId": "262",
      "title": "子づれ兵法者 上",
      "author": "佐江衆一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-20"
    },
    {
      "bookId": "263",
      "title": "駆けこみ交番 下",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-21"
    },
    {
      "bookId": "264",
      "title": "駆けこみ交番 上",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-22"
    },
    {
      "bookId": "265",
      "title": "陰の絵図 4",
      "author": "新宮正春",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-23"
    },
    {
      "bookId": "266",
      "title": "陰の絵図 3",
      "author": "新宮正春",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-24"
    },
    {
      "bookId": "267",
      "title": "陰の絵図 2",
      "author": "新宮正春",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-25"
    },
    {
      "bookId": "268",
      "title": "陰の絵図 1",
      "author": "新宮正春",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-26"
    },
    {
      "bookId": "269",
      "title": "海狼伝 下",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-27"
    },
    {
      "bookId": "270",
      "title": "海狼伝 中",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-28"
    },
    {
      "bookId": "271",
      "title": "海狼伝 上",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-29"
    },
    {
      "bookId": "272",
      "title": "英国に就て 下",
      "author": "吉田健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-30"
    },
    {
      "bookId": "273",
      "title": "英国に就て 上",
      "author": "吉田健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-01"
    },
    {
      "bookId": "274",
      "title": "仇討ち 下",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-02"
    },
    {
      "bookId": "275",
      "title": "仇討ち 上",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-03"
    },
    {
      "bookId": "276",
      "title": "1Q84 BOOK3-3",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-04"
    },
    {
      "bookId": "277",
      "title": "1Q84 BOOK3-2",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-05"
    },
    {
      "bookId": "278",
      "title": "1Q84 BOOK3-1",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-06"
    },
    {
      "bookId": "279",
      "title": "悼む人 3",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-07"
    },
    {
      "bookId": "280",
      "title": "悼む人 2",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-08"
    },
    {
      "bookId": "281",
      "title": "悼む人 1",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-09"
    },
    {
      "bookId": "282",
      "title": "1Q84 BOOK2-3",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-10"
    },
    {
      "bookId": "283",
      "title": "1Q84 BOOK2-2",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-11"
    },
    {
      "bookId": "284",
      "title": "1Q84 BOOK2-1",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-12"
    },
    {
      "bookId": "285",
      "title": "1Q84 BOOK1-3",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-13"
    },
    {
      "bookId": "286",
      "title": "1Q84 BOOK1-2",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-14"
    },
    {
      "bookId": "287",
      "title": "1Q84 BOOK1-1",
      "author": "村上春樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-15"
    },
    {
      "bookId": "288",
      "title": "ゲゲゲの女房 3",
      "author": "武良布枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-16"
    },
    {
      "bookId": "289",
      "title": "ゲゲゲの女房 2",
      "author": "武良布枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-17"
    },
    {
      "bookId": "290",
      "title": "ゲゲゲの女房 1",
      "author": "武良布枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-18"
    },
    {
      "bookId": "291",
      "title": "龍馬伝 3-3",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-19"
    },
    {
      "bookId": "292",
      "title": "龍馬伝 3-2",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-20"
    },
    {
      "bookId": "293",
      "title": "龍馬伝 3-1",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-21"
    },
    {
      "bookId": "294",
      "title": "告白 3",
      "author": "湊かなえ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-22"
    },
    {
      "bookId": "295",
      "title": "告白 2",
      "author": "湊かなえ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-23"
    },
    {
      "bookId": "296",
      "title": "告白 1",
      "author": "湊かなえ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-24"
    },
    {
      "bookId": "297",
      "title": "こいしり 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-25"
    },
    {
      "bookId": "298",
      "title": "こいしり 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-26"
    },
    {
      "bookId": "299",
      "title": "こいしり 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-27"
    },
    {
      "bookId": "300",
      "title": "龍馬伝 2-3",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-28"
    },
    {
      "bookId": "301",
      "title": "龍馬伝 2-2",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-29"
    },
    {
      "bookId": "302",
      "title": "龍馬伝 2-1",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-30"
    },
    {
      "bookId": "303",
      "title": "まんまこと 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-31"
    },
    {
      "bookId": "304",
      "title": "まんまこと 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-01"
    },
    {
      "bookId": "305",
      "title": "まんまこと 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-02"
    },
    {
      "bookId": "306",
      "title": "龍馬伝 1-3",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-03"
    },
    {
      "bookId": "307",
      "title": "龍馬伝 1-2",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-04"
    },
    {
      "bookId": "308",
      "title": "龍馬伝 1-1",
      "author": "福田靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-05"
    },
    {
      "bookId": "309",
      "title": "大きな活字のホトトギス新歳時記",
      "author": "稲畑汀子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-06"
    },
    {
      "bookId": "310",
      "title": "螺旋階段のアリス 下",
      "author": "加納朋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-07"
    },
    {
      "bookId": "311",
      "title": "螺旋階段のアリス 上",
      "author": "加納朋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-08"
    },
    {
      "bookId": "312",
      "title": "楽園後刻",
      "author": "甘糟幸子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-09"
    },
    {
      "bookId": "313",
      "title": "ひとり旅は楽し",
      "author": "池内紀",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-10"
    },
    {
      "bookId": "314",
      "title": "馬上少年過ぐ 下",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-11"
    },
    {
      "bookId": "315",
      "title": "馬上少年過ぐ 上",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-12"
    },
    {
      "bookId": "316",
      "title": "信長の棺 下",
      "author": "加藤廣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-13"
    },
    {
      "bookId": "317",
      "title": "信長の棺 中",
      "author": "加藤廣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-14"
    },
    {
      "bookId": "318",
      "title": "信長の棺 上",
      "author": "加藤廣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-15"
    },
    {
      "bookId": "319",
      "title": "遠い朝の本たち",
      "author": "須賀敦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-16"
    },
    {
      "bookId": "320",
      "title": "照柿 4",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-17"
    },
    {
      "bookId": "321",
      "title": "照柿 3",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-18"
    },
    {
      "bookId": "322",
      "title": "照柿 2",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-19"
    },
    {
      "bookId": "323",
      "title": "照柿 1",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-20"
    },
    {
      "bookId": "324",
      "title": "散りぎわの花 下",
      "author": "小沢昭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-21"
    },
    {
      "bookId": "325",
      "title": "散りぎわの花 上",
      "author": "小沢昭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-22"
    },
    {
      "bookId": "326",
      "title": "セント・メリーのリボン 下",
      "author": "稲見一良",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-23"
    },
    {
      "bookId": "327",
      "title": "セント・メリーのリボン 上",
      "author": "稲見一良",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-24"
    },
    {
      "bookId": "328",
      "title": "昭和史七つの謎 下",
      "author": "保阪正康",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-25"
    },
    {
      "bookId": "329",
      "title": "昭和史七つの謎 上",
      "author": "保阪正康",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-26"
    },
    {
      "bookId": "330",
      "title": "恋に散りぬ 下",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-27"
    },
    {
      "bookId": "331",
      "title": "恋に散りぬ 上",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-28"
    },
    {
      "bookId": "332",
      "title": "銀座諸事折々",
      "author": "鈴木真砂女",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-29"
    },
    {
      "bookId": "333",
      "title": "君を見上げて 下",
      "author": "山田太一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-30"
    },
    {
      "bookId": "334",
      "title": "君を見上げて 上",
      "author": "山田太一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-01"
    },
    {
      "bookId": "335",
      "title": "鬼女の鱗 下",
      "author": "泡坂妻夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-02"
    },
    {
      "bookId": "336",
      "title": "鬼女の鱗 上",
      "author": "泡坂妻夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-03"
    },
    {
      "bookId": "337",
      "title": "感動する脳",
      "author": "茂木健一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-04"
    },
    {
      "bookId": "338",
      "title": "牛込御門余時 下",
      "author": "竹田真砂子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-05"
    },
    {
      "bookId": "339",
      "title": "牛込御門余時 上",
      "author": "竹田真砂子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-06"
    },
    {
      "bookId": "340",
      "title": "榎本武揚 下",
      "author": "安部公房",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-07"
    },
    {
      "bookId": "341",
      "title": "榎本武揚 上",
      "author": "安部公房",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-08"
    },
    {
      "bookId": "342",
      "title": "ころころろ 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-09"
    },
    {
      "bookId": "343",
      "title": "ころころろ 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-10"
    },
    {
      "bookId": "344",
      "title": "ころころろ 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-11"
    },
    {
      "bookId": "345",
      "title": "沈まぬ太陽 5-3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-12"
    },
    {
      "bookId": "346",
      "title": "沈まぬ太陽 5-2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-13"
    },
    {
      "bookId": "347",
      "title": "沈まぬ太陽 5-1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-14"
    },
    {
      "bookId": "348",
      "title": "鬼平犯科帳 24-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-15"
    },
    {
      "bookId": "349",
      "title": "鬼平犯科帳 24-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-16"
    },
    {
      "bookId": "350",
      "title": "鬼平犯科帳 24-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-17"
    },
    {
      "bookId": "351",
      "title": "沈まぬ太陽 4-3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-18"
    },
    {
      "bookId": "352",
      "title": "沈まぬ太陽 4-2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-19"
    },
    {
      "bookId": "353",
      "title": "沈まぬ太陽 4-1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-20"
    },
    {
      "bookId": "354",
      "title": "いっちばん 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-21"
    },
    {
      "bookId": "355",
      "title": "いっちばん 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-22"
    },
    {
      "bookId": "356",
      "title": "いっちばん 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-23"
    },
    {
      "bookId": "357",
      "title": "沈まぬ太陽 3-3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-24"
    },
    {
      "bookId": "358",
      "title": "沈まぬ太陽 3-2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-25"
    },
    {
      "bookId": "359",
      "title": "沈まぬ太陽 3-1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-26"
    },
    {
      "bookId": "360",
      "title": "沈まぬ太陽 2-3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-27"
    },
    {
      "bookId": "361",
      "title": "沈まぬ太陽 2-2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-28"
    },
    {
      "bookId": "362",
      "title": "沈まぬ太陽 2-1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-29"
    },
    {
      "bookId": "363",
      "title": "大きな活字のコンサイスカタカナ語辞典",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-30"
    },
    {
      "bookId": "364",
      "title": "鬼平犯科帳 23-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-31"
    },
    {
      "bookId": "365",
      "title": "鬼平犯科帳 23-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-01"
    },
    {
      "bookId": "366",
      "title": "鬼平犯科帳 23-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-02"
    },
    {
      "bookId": "367",
      "title": "沈まぬ太陽 1-3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-03"
    },
    {
      "bookId": "368",
      "title": "沈まぬ太陽 1-2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-04"
    },
    {
      "bookId": "369",
      "title": "沈まぬ太陽 1-1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-05"
    },
    {
      "bookId": "370",
      "title": "火天の城 3",
      "author": "山本兼一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-06"
    },
    {
      "bookId": "371",
      "title": "火天の城 2",
      "author": "山本兼一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-07"
    },
    {
      "bookId": "372",
      "title": "火天の城 1",
      "author": "山本兼一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-08"
    },
    {
      "bookId": "373",
      "title": "花々と星々と 下",
      "author": "犬養道子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-09"
    },
    {
      "bookId": "374",
      "title": "花々と星々と 上",
      "author": "犬養道子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-10"
    },
    {
      "bookId": "375",
      "title": "私の古典詩選 下",
      "author": "大岡信",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-11"
    },
    {
      "bookId": "376",
      "title": "私の古典詩選 上",
      "author": "大岡信",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-12"
    },
    {
      "bookId": "377",
      "title": "ぼんくら 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-13"
    },
    {
      "bookId": "378",
      "title": "ぼんくら 中",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-14"
    },
    {
      "bookId": "379",
      "title": "ぼんくら 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-15"
    },
    {
      "bookId": "380",
      "title": "秘太刀馬の骨 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-16"
    },
    {
      "bookId": "381",
      "title": "秘太刀馬の骨 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-17"
    },
    {
      "bookId": "382",
      "title": "眠る鯉",
      "author": "伊集院静",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-18"
    },
    {
      "bookId": "383",
      "title": "東京少年 下",
      "author": "小林信彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-19"
    },
    {
      "bookId": "384",
      "title": "東京少年 上",
      "author": "小林信彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-20"
    },
    {
      "bookId": "385",
      "title": "男子の本懐 下",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-21"
    },
    {
      "bookId": "386",
      "title": "男子の本懐 上",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-22"
    },
    {
      "bookId": "387",
      "title": "生家へ 下",
      "author": "色川武大",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-23"
    },
    {
      "bookId": "388",
      "title": "生家へ 上",
      "author": "色川武大",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-24"
    },
    {
      "bookId": "389",
      "title": "周公旦",
      "author": "酒見賢一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-25"
    },
    {
      "bookId": "390",
      "title": "五人女捕物くらべ 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-26"
    },
    {
      "bookId": "391",
      "title": "五人女捕物くらべ 中",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-27"
    },
    {
      "bookId": "392",
      "title": "五人女捕物くらべ 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-28"
    },
    {
      "bookId": "393",
      "title": "こころの天気図",
      "author": "五木寛之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-29"
    },
    {
      "bookId": "394",
      "title": "救命センターからの手紙 下",
      "author": "浜辺祐一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-30"
    },
    {
      "bookId": "395",
      "title": "救命センターからの手紙 上",
      "author": "浜辺祐一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-31"
    },
    {
      "bookId": "396",
      "title": "硝子のハンマー 下",
      "author": "貴志祐介",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-01"
    },
    {
      "bookId": "397",
      "title": "硝子のハンマー 中",
      "author": "貴志祐介",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-02"
    },
    {
      "bookId": "398",
      "title": "硝子のハンマー 上",
      "author": "貴志祐介",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-03"
    },
    {
      "bookId": "399",
      "title": "お鳥見女房 下",
      "author": "諸田玲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-04"
    },
    {
      "bookId": "400",
      "title": "お鳥見女房 上",
      "author": "諸田玲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-05"
    },
    {
      "bookId": "401",
      "title": "江戸打入り 下",
      "author": "半村良",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-06"
    },
    {
      "bookId": "402",
      "title": "江戸打入り 上",
      "author": "半村良",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-07"
    },
    {
      "bookId": "403",
      "title": "ちんぷんかん 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-08"
    },
    {
      "bookId": "404",
      "title": "ちんぷんかん 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-09"
    },
    {
      "bookId": "405",
      "title": "ちんぷんかん 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-10"
    },
    {
      "bookId": "406",
      "title": "鬼平犯科帳 22-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-11"
    },
    {
      "bookId": "407",
      "title": "鬼平犯科帳 22-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-12"
    },
    {
      "bookId": "408",
      "title": "鬼平犯科帳 22-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-13"
    },
    {
      "bookId": "409",
      "title": "うそうそ 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-14"
    },
    {
      "bookId": "410",
      "title": "うそうそ 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-15"
    },
    {
      "bookId": "411",
      "title": "うそうそ 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-16"
    },
    {
      "bookId": "412",
      "title": "鷺と雪 3",
      "author": "北村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-17"
    },
    {
      "bookId": "413",
      "title": "鷺と雪 2",
      "author": "北村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-18"
    },
    {
      "bookId": "414",
      "title": "鷺と雪 1",
      "author": "北村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-19"
    },
    {
      "bookId": "415",
      "title": "暮らしのなかの視野",
      "author": "吉田雅子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-20"
    },
    {
      "bookId": "416",
      "title": "天地人 下[3]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-21"
    },
    {
      "bookId": "417",
      "title": "天地人 下[2]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-22"
    },
    {
      "bookId": "418",
      "title": "天地人 下[1]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-23"
    },
    {
      "bookId": "419",
      "title": "鬼平犯科帳 21-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-24"
    },
    {
      "bookId": "420",
      "title": "鬼平犯科帳 21-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-01"
    },
    {
      "bookId": "421",
      "title": "鬼平犯科帳 21-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-02"
    },
    {
      "bookId": "422",
      "title": "おまけのこ 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-03"
    },
    {
      "bookId": "423",
      "title": "おまけのこ 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-04"
    },
    {
      "bookId": "424",
      "title": "おまけのこ 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-05"
    },
    {
      "bookId": "425",
      "title": "天地人 中[3]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-06"
    },
    {
      "bookId": "426",
      "title": "天地人 中[2]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-07"
    },
    {
      "bookId": "427",
      "title": "天地人 中[1]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-08"
    },
    {
      "bookId": "428",
      "title": "おくりびと 下",
      "author": "百瀬しのぶ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-09"
    },
    {
      "bookId": "429",
      "title": "おくりびと 上",
      "author": "百瀬しのぶ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-10"
    },
    {
      "bookId": "430",
      "title": "関ケ原・敗者たちの勝算と誤算 下",
      "author": "武光誠",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-11"
    },
    {
      "bookId": "431",
      "title": "関ケ原・敗者たちの勝算と誤算 上",
      "author": "武光誠",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-12"
    },
    {
      "bookId": "432",
      "title": "霧笛荘夜話 下",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-13"
    },
    {
      "bookId": "433",
      "title": "霧笛荘夜話 上",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-14"
    },
    {
      "bookId": "434",
      "title": "無思想の発見",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-15"
    },
    {
      "bookId": "435",
      "title": "武家用心集 下",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-16"
    },
    {
      "bookId": "436",
      "title": "武家用心集 上",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-17"
    },
    {
      "bookId": "437",
      "title": "馬喰八十八伝 下",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-18"
    },
    {
      "bookId": "438",
      "title": "馬喰八十八伝 中",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-19"
    },
    {
      "bookId": "439",
      "title": "馬喰八十八伝 上",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-20"
    },
    {
      "bookId": "440",
      "title": "遠い日のこと 下",
      "author": "飯田龍太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-21"
    },
    {
      "bookId": "441",
      "title": "遠い日のこと 上",
      "author": "飯田龍太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-22"
    },
    {
      "bookId": "442",
      "title": "遠い幻影 下",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-23"
    },
    {
      "bookId": "443",
      "title": "遠い幻影 上",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-24"
    },
    {
      "bookId": "444",
      "title": "てのひらの闇 下",
      "author": "藤原伊織",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-25"
    },
    {
      "bookId": "445",
      "title": "てのひらの闇 中",
      "author": "藤原伊織",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-26"
    },
    {
      "bookId": "446",
      "title": "てのひらの闇 上",
      "author": "藤原伊織",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-27"
    },
    {
      "bookId": "447",
      "title": "中央構造帯 下",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-28"
    },
    {
      "bookId": "448",
      "title": "中央構造帯 中",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-29"
    },
    {
      "bookId": "449",
      "title": "中央構造帯 上",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-30"
    },
    {
      "bookId": "450",
      "title": "千曲川のスケッチ",
      "author": "島崎藤村",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-31"
    },
    {
      "bookId": "451",
      "title": "他人同士 下",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-01"
    },
    {
      "bookId": "452",
      "title": "他人同士 上",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-02"
    },
    {
      "bookId": "453",
      "title": "高山右近 下",
      "author": "加賀乙彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-03"
    },
    {
      "bookId": "454",
      "title": "高山右近 上",
      "author": "加賀乙彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-04"
    },
    {
      "bookId": "455",
      "title": "高瀬川女船歌 下",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-05"
    },
    {
      "bookId": "456",
      "title": "高瀬川女船歌 上",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-06"
    },
    {
      "bookId": "457",
      "title": "漱石夫人は占い好き",
      "author": "半藤末利子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-07"
    },
    {
      "bookId": "458",
      "title": "人生の四季に生きる",
      "author": "日野原重明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-08"
    },
    {
      "bookId": "459",
      "title": "一瞬の魔 下",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-09"
    },
    {
      "bookId": "460",
      "title": "一瞬の魔 上",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-10"
    },
    {
      "bookId": "461",
      "title": "天地人 上[3]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-11"
    },
    {
      "bookId": "462",
      "title": "天地人 上[2]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-12"
    },
    {
      "bookId": "463",
      "title": "天地人 上[1]",
      "author": "火坂雅志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-13"
    },
    {
      "bookId": "464",
      "title": "鬼平犯科帳 20-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-14"
    },
    {
      "bookId": "465",
      "title": "鬼平犯科帳 20-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-15"
    },
    {
      "bookId": "466",
      "title": "鬼平犯科帳 20-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-16"
    },
    {
      "bookId": "467",
      "title": "エコ生活のアイデアコツのコツ 4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-17"
    },
    {
      "bookId": "468",
      "title": "エコ生活のアイデアコツのコツ 3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-18"
    },
    {
      "bookId": "469",
      "title": "エコ生活のアイデアコツのコツ 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-19"
    },
    {
      "bookId": "470",
      "title": "エコ生活のアイデアコツのコツ 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-20"
    },
    {
      "bookId": "471",
      "title": "信長・秀吉・家康の研究 下",
      "author": "童門冬二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-21"
    },
    {
      "bookId": "472",
      "title": "信長・秀吉・家康の研究 上",
      "author": "童門冬二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-22"
    },
    {
      "bookId": "473",
      "title": "ねこのばば 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-23"
    },
    {
      "bookId": "474",
      "title": "ねこのばば 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-24"
    },
    {
      "bookId": "475",
      "title": "ねこのばば 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-25"
    },
    {
      "bookId": "476",
      "title": "瀬戸内寂聴随筆選 6",
      "author": "瀬戸内寂聴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-26"
    },
    {
      "bookId": "477",
      "title": "瀬戸内寂聴随筆選 5",
      "author": "瀬戸内寂聴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-27"
    },
    {
      "bookId": "478",
      "title": "瀬戸内寂聴随筆選 4",
      "author": "瀬戸内寂聴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-28"
    },
    {
      "bookId": "479",
      "title": "瀬戸内寂聴随筆選 3",
      "author": "瀬戸内寂聴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-01"
    },
    {
      "bookId": "480",
      "title": "瀬戸内寂聴随筆選 2",
      "author": "瀬戸内寂聴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-02"
    },
    {
      "bookId": "481",
      "title": "瀬戸内寂聴随筆選 1",
      "author": "瀬戸内寂聴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-03"
    },
    {
      "bookId": "482",
      "title": "まだ遠い光 3",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-04"
    },
    {
      "bookId": "483",
      "title": "まだ遠い光 2",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-05"
    },
    {
      "bookId": "484",
      "title": "まだ遠い光 1",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-06"
    },
    {
      "bookId": "485",
      "title": "巡礼者たち 3",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-07"
    },
    {
      "bookId": "486",
      "title": "巡礼者たち 2",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-08"
    },
    {
      "bookId": "487",
      "title": "巡礼者たち 1",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-09"
    },
    {
      "bookId": "488",
      "title": "著作権マニュアル 2008新版",
      "author": "全国視覚障害者情報提供施設協会サービス委員会著作権プロジェクト集",
      "category": "福祉",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-10"
    },
    {
      "bookId": "489",
      "title": "鬼平犯科帳 19-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-11"
    },
    {
      "bookId": "490",
      "title": "鬼平犯科帳 19-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-12"
    },
    {
      "bookId": "491",
      "title": "鬼平犯科帳 19-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-13"
    },
    {
      "bookId": "492",
      "title": "ぬしさまへ 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-14"
    },
    {
      "bookId": "493",
      "title": "ぬしさまへ 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-15"
    },
    {
      "bookId": "494",
      "title": "ぬしさまへ 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-16"
    },
    {
      "bookId": "495",
      "title": "鬼平犯科帳 18-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-17"
    },
    {
      "bookId": "496",
      "title": "鬼平犯科帳 18-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-18"
    },
    {
      "bookId": "497",
      "title": "鬼平犯科帳 18-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-19"
    },
    {
      "bookId": "498",
      "title": "しゃばけ 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-20"
    },
    {
      "bookId": "499",
      "title": "しゃばけ 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-21"
    },
    {
      "bookId": "500",
      "title": "しゃばけ 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-22"
    },
    {
      "bookId": "501",
      "title": "海神 下",
      "author": "安部龍太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-23"
    },
    {
      "bookId": "502",
      "title": "海神 上",
      "author": "安部龍太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-24"
    },
    {
      "bookId": "503",
      "title": "わたしのおせっかい談義",
      "author": "沢村貞子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-25"
    },
    {
      "bookId": "504",
      "title": "山の頂の向こうに",
      "author": "田部井淳子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-26"
    },
    {
      "bookId": "505",
      "title": "敗れざる者たち 下",
      "author": "沢木耕太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-27"
    },
    {
      "bookId": "506",
      "title": "敗れざる者たち 上",
      "author": "沢木耕太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-28"
    },
    {
      "bookId": "507",
      "title": "無宿人別帳 下",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-29"
    },
    {
      "bookId": "508",
      "title": "無宿人別帳 上",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-30"
    },
    {
      "bookId": "509",
      "title": "似せ者 下",
      "author": "松井今朝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-31"
    },
    {
      "bookId": "510",
      "title": "似せ者 上",
      "author": "松井今朝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-01"
    },
    {
      "bookId": "511",
      "title": "どくとるマンボウ青春記 下",
      "author": "北杜夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-02"
    },
    {
      "bookId": "512",
      "title": "どくとるマンボウ青春記 上",
      "author": "北杜夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-03"
    },
    {
      "bookId": "513",
      "title": "多甚古村",
      "author": "井伏鱒二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-04"
    },
    {
      "bookId": "514",
      "title": "新人生論ノート",
      "author": "木田元",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-05"
    },
    {
      "bookId": "515",
      "title": "諸葛孔明 4",
      "author": "陳舜臣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-06"
    },
    {
      "bookId": "516",
      "title": "諸葛孔明 3",
      "author": "陳舜臣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-07"
    },
    {
      "bookId": "517",
      "title": "諸葛孔明 2",
      "author": "陳舜臣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-08"
    },
    {
      "bookId": "518",
      "title": "諸葛孔明 1",
      "author": "陳舜臣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-09"
    },
    {
      "bookId": "519",
      "title": "昨日の恋",
      "author": "北原亞以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-10"
    },
    {
      "bookId": "520",
      "title": "絆 下",
      "author": "小杉健治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-11"
    },
    {
      "bookId": "521",
      "title": "絆 上",
      "author": "小杉健治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-12"
    },
    {
      "bookId": "522",
      "title": "家族善哉 下",
      "author": "島村洋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-13"
    },
    {
      "bookId": "523",
      "title": "家族善哉 上",
      "author": "島村洋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-14"
    },
    {
      "bookId": "524",
      "title": "送り火 下",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-15"
    },
    {
      "bookId": "525",
      "title": "送り火 上",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-16"
    },
    {
      "bookId": "526",
      "title": "いつか王子駅で",
      "author": "堀江敏幸",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-17"
    },
    {
      "bookId": "527",
      "title": "赤い影法師 下",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-18"
    },
    {
      "bookId": "528",
      "title": "赤い影法師 上",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-19"
    },
    {
      "bookId": "529",
      "title": "愛を乞うひと 下",
      "author": "下田治美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-20"
    },
    {
      "bookId": "530",
      "title": "愛を乞うひと 上",
      "author": "下田治美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-21"
    },
    {
      "bookId": "531",
      "title": "鬼平犯科帳 17-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-22"
    },
    {
      "bookId": "532",
      "title": "鬼平犯科帳 17-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-23"
    },
    {
      "bookId": "533",
      "title": "鬼平犯科帳 17-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-24"
    },
    {
      "bookId": "534",
      "title": "のぼうの城 3",
      "author": "和田竜",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-25"
    },
    {
      "bookId": "535",
      "title": "のぼうの城 2",
      "author": "和田竜",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-26"
    },
    {
      "bookId": "536",
      "title": "のぼうの城 1",
      "author": "和田竜",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-27"
    },
    {
      "bookId": "537",
      "title": "和宮お側日記 3",
      "author": "阿井景子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-28"
    },
    {
      "bookId": "538",
      "title": "和宮お側日記 2",
      "author": "阿井景子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-29"
    },
    {
      "bookId": "539",
      "title": "和宮お側日記 1",
      "author": "阿井景子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-30"
    },
    {
      "bookId": "540",
      "title": "ブラックペアン1988 3",
      "author": "海堂尊",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-01"
    },
    {
      "bookId": "541",
      "title": "ブラックペアン1988 2",
      "author": "海堂尊",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-02"
    },
    {
      "bookId": "542",
      "title": "ブラックペアン1988 1",
      "author": "海堂尊",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-03"
    },
    {
      "bookId": "543",
      "title": "鬼平犯科帳 16-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-04"
    },
    {
      "bookId": "544",
      "title": "鬼平犯科帳 16-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-05"
    },
    {
      "bookId": "545",
      "title": "鬼平犯科帳 16-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-06"
    },
    {
      "bookId": "546",
      "title": "こころげそう 3",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-07"
    },
    {
      "bookId": "547",
      "title": "こころげそう 2",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-08"
    },
    {
      "bookId": "548",
      "title": "こころげそう 1",
      "author": "畠中恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-09"
    },
    {
      "bookId": "549",
      "title": "鬼平犯科帳 15-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-10"
    },
    {
      "bookId": "550",
      "title": "鬼平犯科帳 15-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-11"
    },
    {
      "bookId": "551",
      "title": "鬼平犯科帳 15-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-12"
    },
    {
      "bookId": "552",
      "title": "福袋 3",
      "author": "角田光代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-13"
    },
    {
      "bookId": "553",
      "title": "福袋 2",
      "author": "角田光代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-14"
    },
    {
      "bookId": "554",
      "title": "福袋 1",
      "author": "角田光代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-15"
    },
    {
      "bookId": "555",
      "title": "青森ねぶた殺人事件 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-16"
    },
    {
      "bookId": "556",
      "title": "青森ねぶた殺人事件 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-17"
    },
    {
      "bookId": "557",
      "title": "青森ねぶた殺人事件 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-18"
    },
    {
      "bookId": "558",
      "title": "鬼平犯科帳 14-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-19"
    },
    {
      "bookId": "559",
      "title": "鬼平犯科帳 14-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-20"
    },
    {
      "bookId": "560",
      "title": "鬼平犯科帳 14-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-21"
    },
    {
      "bookId": "561",
      "title": "破軍の星 下",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-22"
    },
    {
      "bookId": "562",
      "title": "破軍の星 中",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-23"
    },
    {
      "bookId": "563",
      "title": "破軍の星 上",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-24"
    },
    {
      "bookId": "564",
      "title": "まわりみち極楽論 下",
      "author": "玄侑宗久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-25"
    },
    {
      "bookId": "565",
      "title": "まわりみち極楽論 上",
      "author": "玄侑宗久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-26"
    },
    {
      "bookId": "566",
      "title": "本多の狐 下",
      "author": "羽太雄平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-27"
    },
    {
      "bookId": "567",
      "title": "本多の狐 上",
      "author": "羽太雄平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-28"
    },
    {
      "bookId": "568",
      "title": "のちの思いに 下",
      "author": "辻邦生",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-29"
    },
    {
      "bookId": "569",
      "title": "のちの思いに 上",
      "author": "辻邦生",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-30"
    },
    {
      "bookId": "570",
      "title": "艶めき 下",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-31"
    },
    {
      "bookId": "571",
      "title": "艶めき 上",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-01"
    },
    {
      "bookId": "572",
      "title": "退屈姫君伝 下",
      "author": "米村圭伍",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-02"
    },
    {
      "bookId": "573",
      "title": "退屈姫君伝 上",
      "author": "米村圭伍",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-03"
    },
    {
      "bookId": "574",
      "title": "扇形のアリバイ 下",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-04"
    },
    {
      "bookId": "575",
      "title": "扇形のアリバイ 上",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-05"
    },
    {
      "bookId": "576",
      "title": "素人庖丁記",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-06"
    },
    {
      "bookId": "577",
      "title": "四十八歳の抵抗 下",
      "author": "石川達三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-07"
    },
    {
      "bookId": "578",
      "title": "四十八歳の抵抗 上",
      "author": "石川達三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-08"
    },
    {
      "bookId": "579",
      "title": "胡蝶の剣 下",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-09"
    },
    {
      "bookId": "580",
      "title": "胡蝶の剣 上",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-10"
    },
    {
      "bookId": "581",
      "title": "心で見る世界",
      "author": "島崎敏樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-11"
    },
    {
      "bookId": "582",
      "title": "芸づくし忠臣蔵 下",
      "author": "関容子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-12"
    },
    {
      "bookId": "583",
      "title": "芸づくし忠臣蔵 上",
      "author": "関容子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-13"
    },
    {
      "bookId": "584",
      "title": "藏 4",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-14"
    },
    {
      "bookId": "585",
      "title": "藏 3",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-15"
    },
    {
      "bookId": "586",
      "title": "藏 2",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-16"
    },
    {
      "bookId": "587",
      "title": "藏 1",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-17"
    },
    {
      "bookId": "588",
      "title": "おすず 下",
      "author": "杉本章子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-18"
    },
    {
      "bookId": "589",
      "title": "おすず 上",
      "author": "杉本章子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-19"
    },
    {
      "bookId": "590",
      "title": "相棒に気をつけろ 下",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-20"
    },
    {
      "bookId": "591",
      "title": "相棒に気をつけろ 上",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-21"
    },
    {
      "bookId": "592",
      "title": "幕末の尼将軍-篤姫 3",
      "author": "童門冬二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-22"
    },
    {
      "bookId": "593",
      "title": "幕末の尼将軍-篤姫 2",
      "author": "童門冬二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-23"
    },
    {
      "bookId": "594",
      "title": "幕末の尼将軍-篤姫 1",
      "author": "童門冬二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-24"
    },
    {
      "bookId": "595",
      "title": "ありがとう、夏休み。 下",
      "author": "どばしまさき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-25"
    },
    {
      "bookId": "596",
      "title": "ありがとう、夏休み。 上",
      "author": "どばしまさき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-26"
    },
    {
      "bookId": "597",
      "title": "太陽の塔 3",
      "author": "森見登美彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-27"
    },
    {
      "bookId": "598",
      "title": "太陽の塔 2",
      "author": "森見登美彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-28"
    },
    {
      "bookId": "599",
      "title": "太陽の塔 1",
      "author": "森見登美彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-29"
    },
    {
      "bookId": "600",
      "title": "鬼平犯科帳 13-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-30"
    },
    {
      "bookId": "601",
      "title": "鬼平犯科帳 13-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-01"
    },
    {
      "bookId": "602",
      "title": "鬼平犯科帳 13-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-02"
    },
    {
      "bookId": "603",
      "title": "窓の灯(あかり)",
      "author": "青山七恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-03"
    },
    {
      "bookId": "604",
      "title": "はじめての介護",
      "author": "主婦の友社",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-04"
    },
    {
      "bookId": "605",
      "title": "大きな活字の三省堂国語辞典",
      "author": "見坊豪紀",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-05"
    },
    {
      "bookId": "606",
      "title": "鬼平犯科帳 12-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-06"
    },
    {
      "bookId": "607",
      "title": "鬼平犯科帳 12-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-07"
    },
    {
      "bookId": "608",
      "title": "鬼平犯科帳 12-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-08"
    },
    {
      "bookId": "609",
      "title": "柳生三代記",
      "author": "嶋津義忠",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-09"
    },
    {
      "bookId": "610",
      "title": "パソコンのお引っ越し早わかり読本",
      "author": "日経PCビギナーズ",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-10"
    },
    {
      "bookId": "611",
      "title": "秋の牢獄 下",
      "author": "恒川光太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-11"
    },
    {
      "bookId": "612",
      "title": "秋の牢獄 上",
      "author": "恒川光太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-12"
    },
    {
      "bookId": "613",
      "title": "はじめて以前のすぐできおかず",
      "author": "主婦の友社",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-13"
    },
    {
      "bookId": "614",
      "title": "池波正太郎短篇ベストコレクション 6",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-14"
    },
    {
      "bookId": "615",
      "title": "池波正太郎短篇ベストコレクション 5",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-15"
    },
    {
      "bookId": "616",
      "title": "池波正太郎短篇ベストコレクション 4",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-16"
    },
    {
      "bookId": "617",
      "title": "池波正太郎短篇ベストコレクション 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-17"
    },
    {
      "bookId": "618",
      "title": "池波正太郎短篇ベストコレクション 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-18"
    },
    {
      "bookId": "619",
      "title": "鬼平犯科帳 11-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-19"
    },
    {
      "bookId": "620",
      "title": "鬼平犯科帳 11-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-20"
    },
    {
      "bookId": "621",
      "title": "鬼平犯科帳 11-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-21"
    },
    {
      "bookId": "622",
      "title": "街道をゆく 24[下]",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-22"
    },
    {
      "bookId": "623",
      "title": "街道をゆく 24[中]",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-23"
    },
    {
      "bookId": "624",
      "title": "街道をゆく 24[上]",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-24"
    },
    {
      "bookId": "625",
      "title": "破門 下",
      "author": "羽山信樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-25"
    },
    {
      "bookId": "626",
      "title": "破門 上",
      "author": "羽山信樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-26"
    },
    {
      "bookId": "627",
      "title": "町奉行日記 下",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-27"
    },
    {
      "bookId": "628",
      "title": "町奉行日記 上",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-28"
    },
    {
      "bookId": "629",
      "title": "マークスの山 4",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-29"
    },
    {
      "bookId": "630",
      "title": "マークスの山 3",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-30"
    },
    {
      "bookId": "631",
      "title": "マークスの山 2",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-31"
    },
    {
      "bookId": "632",
      "title": "マークスの山 1",
      "author": "高村薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-01"
    },
    {
      "bookId": "633",
      "title": "富豪刑事 下",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-02"
    },
    {
      "bookId": "634",
      "title": "富豪刑事 上",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-03"
    },
    {
      "bookId": "635",
      "title": "輓馬 下",
      "author": "鳴海章",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-04"
    },
    {
      "bookId": "636",
      "title": "輓馬 上",
      "author": "鳴海章",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-05"
    },
    {
      "bookId": "637",
      "title": "独酌余滴 下",
      "author": "多田富雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-06"
    },
    {
      "bookId": "638",
      "title": "独酌余滴 上",
      "author": "多田富雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-07"
    },
    {
      "bookId": "639",
      "title": "寺暮らし",
      "author": "森まゆみ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-08"
    },
    {
      "bookId": "640",
      "title": "智恵子飛ぶ 下",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-09"
    },
    {
      "bookId": "641",
      "title": "智恵子飛ぶ 上",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-10"
    },
    {
      "bookId": "642",
      "title": "戦鬼たちの海 下",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-11"
    },
    {
      "bookId": "643",
      "title": "戦鬼たちの海 中",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-12"
    },
    {
      "bookId": "644",
      "title": "戦鬼たちの海 上",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-13"
    },
    {
      "bookId": "645",
      "title": "スカウト 下",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-14"
    },
    {
      "bookId": "646",
      "title": "スカウト 中",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-15"
    },
    {
      "bookId": "647",
      "title": "スカウト 上",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-16"
    },
    {
      "bookId": "648",
      "title": "辛夷の花 下",
      "author": "秋山加代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-17"
    },
    {
      "bookId": "649",
      "title": "辛夷の花 上",
      "author": "秋山加代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-18"
    },
    {
      "bookId": "650",
      "title": "豪姫夢幻 下",
      "author": "中村彰彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-19"
    },
    {
      "bookId": "651",
      "title": "豪姫夢幻 中",
      "author": "中村彰彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-20"
    },
    {
      "bookId": "652",
      "title": "豪姫夢幻 上",
      "author": "中村彰彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-21"
    },
    {
      "bookId": "653",
      "title": "王朝懶夢譚",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-22"
    },
    {
      "bookId": "654",
      "title": "秋の猫 下",
      "author": "藤堂志津子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-23"
    },
    {
      "bookId": "655",
      "title": "秋の猫 上",
      "author": "藤堂志津子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-24"
    },
    {
      "bookId": "656",
      "title": "十津川警部二つの「金印」の謎 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-25"
    },
    {
      "bookId": "657",
      "title": "十津川警部二つの「金印」の謎 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-26"
    },
    {
      "bookId": "658",
      "title": "十津川警部二つの「金印」の謎 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-27"
    },
    {
      "bookId": "659",
      "title": "香山三紀のはじめて以前の庭づくり",
      "author": "香山三紀",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-28"
    },
    {
      "bookId": "660",
      "title": "図解中高年の「ひざ」の痛み",
      "author": "大森豪",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-29"
    },
    {
      "bookId": "661",
      "title": "鬼平犯科帳 10-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-30"
    },
    {
      "bookId": "662",
      "title": "鬼平犯科帳 10-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-31"
    },
    {
      "bookId": "663",
      "title": "鬼平犯科帳 10-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-01"
    },
    {
      "bookId": "664",
      "title": "乱雲 3",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-02"
    },
    {
      "bookId": "665",
      "title": "乱雲 2",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-03"
    },
    {
      "bookId": "666",
      "title": "乱雲 1",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-04"
    },
    {
      "bookId": "667",
      "title": "大きな字だからスグ分かる!パソコン入門 ビスタの基本編",
      "author": "Q&A編集部",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-05"
    },
    {
      "bookId": "668",
      "title": "中高年の坐骨神経痛",
      "author": "下出真法",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-06"
    },
    {
      "bookId": "669",
      "title": "ひとり日和 下",
      "author": "青山七恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-07"
    },
    {
      "bookId": "670",
      "title": "ひとり日和 上",
      "author": "青山七恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-08"
    },
    {
      "bookId": "671",
      "title": "遠謀 3",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-09"
    },
    {
      "bookId": "672",
      "title": "遠謀 2",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-10"
    },
    {
      "bookId": "673",
      "title": "遠謀 1",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-11"
    },
    {
      "bookId": "674",
      "title": "鬼平犯科帳 9-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-12"
    },
    {
      "bookId": "675",
      "title": "鬼平犯科帳 9-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-13"
    },
    {
      "bookId": "676",
      "title": "鬼平犯科帳 9-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-14"
    },
    {
      "bookId": "677",
      "title": "マザコン男は買いである 下",
      "author": "和田秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-15"
    },
    {
      "bookId": "678",
      "title": "マザコン男は買いである 上",
      "author": "和田秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-16"
    },
    {
      "bookId": "679",
      "title": "モルヒネ 下",
      "author": "安達千夏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-17"
    },
    {
      "bookId": "680",
      "title": "モルヒネ 上",
      "author": "安達千夏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-18"
    },
    {
      "bookId": "681",
      "title": "鬼平犯科帳 8-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-19"
    },
    {
      "bookId": "682",
      "title": "鬼平犯科帳 8-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-20"
    },
    {
      "bookId": "683",
      "title": "鬼平犯科帳 8-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-21"
    },
    {
      "bookId": "684",
      "title": "地獄宿 3",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-22"
    },
    {
      "bookId": "685",
      "title": "地獄宿 2",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-23"
    },
    {
      "bookId": "686",
      "title": "地獄宿 1",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-24"
    },
    {
      "bookId": "687",
      "title": "そのときは彼によろしく 3",
      "author": "市川拓司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-25"
    },
    {
      "bookId": "688",
      "title": "そのときは彼によろしく 2",
      "author": "市川拓司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-26"
    },
    {
      "bookId": "689",
      "title": "そのときは彼によろしく 1",
      "author": "市川拓司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-27"
    },
    {
      "bookId": "690",
      "title": "「般若心経」講義 下",
      "author": "紀野一義",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-28"
    },
    {
      "bookId": "691",
      "title": "「般若心経」講義 上",
      "author": "紀野一義",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-29"
    },
    {
      "bookId": "692",
      "title": "藩校早春賦 下",
      "author": "宮本昌孝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-30"
    },
    {
      "bookId": "693",
      "title": "藩校早春賦 上",
      "author": "宮本昌孝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-01"
    },
    {
      "bookId": "694",
      "title": "母の万年筆 下",
      "author": "太田治子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-02"
    },
    {
      "bookId": "695",
      "title": "母の万年筆 上",
      "author": "太田治子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-03"
    },
    {
      "bookId": "696",
      "title": "路地 下",
      "author": "三木卓",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-04"
    },
    {
      "bookId": "697",
      "title": "路地 上",
      "author": "三木卓",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-05"
    },
    {
      "bookId": "698",
      "title": "幽恋舟 下",
      "author": "諸田玲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-06"
    },
    {
      "bookId": "699",
      "title": "幽恋舟 上",
      "author": "諸田玲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-07"
    },
    {
      "bookId": "700",
      "title": "三屋清左衛門残日録 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-08"
    },
    {
      "bookId": "701",
      "title": "三屋清左衛門残日録 中",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-09"
    },
    {
      "bookId": "702",
      "title": "三屋清左衛門残日録 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-10"
    },
    {
      "bookId": "703",
      "title": "三十一文字のパレット",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-11"
    },
    {
      "bookId": "704",
      "title": "なじみの店",
      "author": "池内紀",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-12"
    },
    {
      "bookId": "705",
      "title": "遠き落日 4",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-13"
    },
    {
      "bookId": "706",
      "title": "遠き落日 3",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-14"
    },
    {
      "bookId": "707",
      "title": "遠き落日 2",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-15"
    },
    {
      "bookId": "708",
      "title": "遠き落日 1",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-16"
    },
    {
      "bookId": "709",
      "title": "長安牡丹花異聞 下",
      "author": "森福都",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-17"
    },
    {
      "bookId": "710",
      "title": "長安牡丹花異聞 上",
      "author": "森福都",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-18"
    },
    {
      "bookId": "711",
      "title": "戦いすんで日が暮れて 下",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-19"
    },
    {
      "bookId": "712",
      "title": "戦いすんで日が暮れて 上",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-20"
    },
    {
      "bookId": "713",
      "title": "三鬼の剣 下",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-21"
    },
    {
      "bookId": "714",
      "title": "三鬼の剣 上",
      "author": "鳥羽亮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-22"
    },
    {
      "bookId": "715",
      "title": "心のくすり箱 下",
      "author": "徳永進",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-23"
    },
    {
      "bookId": "716",
      "title": "心のくすり箱 上",
      "author": "徳永進",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-24"
    },
    {
      "bookId": "717",
      "title": "きのうの空 下",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-25"
    },
    {
      "bookId": "718",
      "title": "きのうの空 上",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-26"
    },
    {
      "bookId": "719",
      "title": "異人たちとの夏",
      "author": "山田太一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-27"
    },
    {
      "bookId": "720",
      "title": "あやし 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-28"
    },
    {
      "bookId": "721",
      "title": "あやし 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-29"
    },
    {
      "bookId": "722",
      "title": "年中行事コツのコツ 4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-30"
    },
    {
      "bookId": "723",
      "title": "年中行事コツのコツ 3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-31"
    },
    {
      "bookId": "724",
      "title": "年中行事コツのコツ 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-01"
    },
    {
      "bookId": "725",
      "title": "年中行事コツのコツ 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-02"
    },
    {
      "bookId": "726",
      "title": "秘剣乱舞 3",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-03"
    },
    {
      "bookId": "727",
      "title": "秘剣乱舞 2",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-04"
    },
    {
      "bookId": "728",
      "title": "秘剣乱舞 1",
      "author": "佐伯泰英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-05"
    },
    {
      "bookId": "729",
      "title": "鬼平犯科帳 7-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-06"
    },
    {
      "bookId": "730",
      "title": "鬼平犯科帳 7-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-07"
    },
    {
      "bookId": "731",
      "title": "鬼平犯科帳 7-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-08"
    },
    {
      "bookId": "732",
      "title": "松本清張自選短篇集 第4巻",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-09"
    },
    {
      "bookId": "733",
      "title": "松本清張自選短篇集 第3巻",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-10"
    },
    {
      "bookId": "734",
      "title": "松本清張自選短篇集 第2巻",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-11"
    },
    {
      "bookId": "735",
      "title": "松本清張自選短篇集 第1巻",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-12"
    },
    {
      "bookId": "736",
      "title": "著名人が語る<知の最前線> 8",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-13"
    },
    {
      "bookId": "737",
      "title": "著名人が語る<知の最前線> 7",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-14"
    },
    {
      "bookId": "738",
      "title": "著名人が語る<知の最前線> 6",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-15"
    },
    {
      "bookId": "739",
      "title": "著名人が語る<知の最前線> 5",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-16"
    },
    {
      "bookId": "740",
      "title": "著名人が語る<知の最前線> 4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-17"
    },
    {
      "bookId": "741",
      "title": "著名人が語る<知の最前線> 3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-18"
    },
    {
      "bookId": "742",
      "title": "著名人が語る<知の最前線> 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-19"
    },
    {
      "bookId": "743",
      "title": "著名人が語る<知の最前線> 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-20"
    },
    {
      "bookId": "744",
      "title": "命と向き合う",
      "author": "中川恵一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-21"
    },
    {
      "bookId": "745",
      "title": "信長と秀吉と家康 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-22"
    },
    {
      "bookId": "746",
      "title": "信長と秀吉と家康 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-23"
    },
    {
      "bookId": "747",
      "title": "信長と秀吉と家康 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-24"
    },
    {
      "bookId": "748",
      "title": "口語民法",
      "author": "高梨公之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-25"
    },
    {
      "bookId": "749",
      "title": "お手本なしの人生",
      "author": "木藤亜也",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-26"
    },
    {
      "bookId": "750",
      "title": "ザ・賢治",
      "author": "宮沢賢治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-27"
    },
    {
      "bookId": "751",
      "title": "鬼平犯科帳 6-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-28"
    },
    {
      "bookId": "752",
      "title": "鬼平犯科帳 6-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-29"
    },
    {
      "bookId": "753",
      "title": "鬼平犯科帳 6-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-30"
    },
    {
      "bookId": "754",
      "title": "涙",
      "author": "原田康子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-01"
    },
    {
      "bookId": "755",
      "title": "槍持ち佐五平の首 下",
      "author": "佐藤雅美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-02"
    },
    {
      "bookId": "756",
      "title": "槍持ち佐五平の首 上",
      "author": "佐藤雅美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-03"
    },
    {
      "bookId": "757",
      "title": "水鳥の関 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-04"
    },
    {
      "bookId": "758",
      "title": "水鳥の関 中",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-05"
    },
    {
      "bookId": "759",
      "title": "水鳥の関 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-06"
    },
    {
      "bookId": "760",
      "title": "炎流れる彼方 4",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-07"
    },
    {
      "bookId": "761",
      "title": "炎流れる彼方 3",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-08"
    },
    {
      "bookId": "762",
      "title": "炎流れる彼方 2",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-09"
    },
    {
      "bookId": "763",
      "title": "炎流れる彼方 1",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-10"
    },
    {
      "bookId": "764",
      "title": "峠越え 下",
      "author": "羽太雄平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-11"
    },
    {
      "bookId": "765",
      "title": "峠越え 上",
      "author": "羽太雄平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-12"
    },
    {
      "bookId": "766",
      "title": "人生論ノート",
      "author": "三木清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-13"
    },
    {
      "bookId": "767",
      "title": "30年の物語 下",
      "author": "岸惠子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-14"
    },
    {
      "bookId": "768",
      "title": "30年の物語 上",
      "author": "岸惠子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-15"
    },
    {
      "bookId": "769",
      "title": "孔子 下",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-16"
    },
    {
      "bookId": "770",
      "title": "孔子 中",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-17"
    },
    {
      "bookId": "771",
      "title": "孔子 上",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-18"
    },
    {
      "bookId": "772",
      "title": "旧約聖書入門 下",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-19"
    },
    {
      "bookId": "773",
      "title": "旧約聖書入門 上",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-20"
    },
    {
      "bookId": "774",
      "title": "ガラスの麒麟 下",
      "author": "加納朋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-21"
    },
    {
      "bookId": "775",
      "title": "ガラスの麒麟 上",
      "author": "加納朋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-22"
    },
    {
      "bookId": "776",
      "title": "鎌倉のおばさん 下",
      "author": "村松友視",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-23"
    },
    {
      "bookId": "777",
      "title": "鎌倉のおばさん 上",
      "author": "村松友視",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-24"
    },
    {
      "bookId": "778",
      "title": "動機 3",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-25"
    },
    {
      "bookId": "779",
      "title": "動機 2",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-26"
    },
    {
      "bookId": "780",
      "title": "動機 1",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-27"
    },
    {
      "bookId": "781",
      "title": "鬼平犯科帳 5-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-28"
    },
    {
      "bookId": "782",
      "title": "鬼平犯科帳 5-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-29"
    },
    {
      "bookId": "783",
      "title": "鬼平犯科帳 5-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-30"
    },
    {
      "bookId": "784",
      "title": "弱視者のための日本文学史",
      "author": "岡村文雄著",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-31"
    },
    {
      "bookId": "785",
      "title": "ALWAYS三丁目の夕日 3",
      "author": "西岸良平／原案",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-01"
    },
    {
      "bookId": "786",
      "title": "ALWAYS三丁目の夕日 2",
      "author": "西岸良平／原案",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-02"
    },
    {
      "bookId": "787",
      "title": "ALWAYS三丁目の夕日 1",
      "author": "西岸良平／原案",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-03"
    },
    {
      "bookId": "788",
      "title": "見えなくなってはじめに読む本",
      "author": "稲垣吉彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-04"
    },
    {
      "bookId": "789",
      "title": "行きずりの街 4",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-05"
    },
    {
      "bookId": "790",
      "title": "行きずりの街 3",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-06"
    },
    {
      "bookId": "791",
      "title": "行きずりの街 2",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-07"
    },
    {
      "bookId": "792",
      "title": "行きずりの街 1",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-08"
    },
    {
      "bookId": "793",
      "title": "浜町河岸の生き神様 3",
      "author": "佐藤雅美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-09"
    },
    {
      "bookId": "794",
      "title": "浜町河岸の生き神様 2",
      "author": "佐藤雅美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-10"
    },
    {
      "bookId": "795",
      "title": "浜町河岸の生き神様 1",
      "author": "佐藤雅美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-11"
    },
    {
      "bookId": "796",
      "title": "博士の愛した数式 3",
      "author": "小川洋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-12"
    },
    {
      "bookId": "797",
      "title": "博士の愛した数式 2",
      "author": "小川洋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-13"
    },
    {
      "bookId": "798",
      "title": "博士の愛した数式 1",
      "author": "小川洋子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-14"
    },
    {
      "bookId": "799",
      "title": "鬼平犯科帳 4-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-15"
    },
    {
      "bookId": "800",
      "title": "鬼平犯科帳 4-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-16"
    },
    {
      "bookId": "801",
      "title": "鬼平犯科帳 4-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-17"
    },
    {
      "bookId": "802",
      "title": "精霊探偵 4",
      "author": "梶尾真治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-18"
    },
    {
      "bookId": "803",
      "title": "精霊探偵 3",
      "author": "梶尾真治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-19"
    },
    {
      "bookId": "804",
      "title": "精霊探偵 2",
      "author": "梶尾真治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-20"
    },
    {
      "bookId": "805",
      "title": "精霊探偵 1",
      "author": "梶尾真治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-21"
    },
    {
      "bookId": "806",
      "title": "広き迷路 3",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-22"
    },
    {
      "bookId": "807",
      "title": "広き迷路 2",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-23"
    },
    {
      "bookId": "808",
      "title": "広き迷路 1",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-24"
    },
    {
      "bookId": "809",
      "title": "花あざ伝奇 下",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-25"
    },
    {
      "bookId": "810",
      "title": "花あざ伝奇 上",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-26"
    },
    {
      "bookId": "811",
      "title": "水無月の墓",
      "author": "小池真理子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-27"
    },
    {
      "bookId": "812",
      "title": "秘剣奔る 下",
      "author": "新宮正春",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-28"
    },
    {
      "bookId": "813",
      "title": "秘剣奔る 上",
      "author": "新宮正春",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-29"
    },
    {
      "bookId": "814",
      "title": "ノモンハンの夏 中",
      "author": "半藤一利",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-30"
    },
    {
      "bookId": "815",
      "title": "ノモンハンの夏 上",
      "author": "半藤一利",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-31"
    },
    {
      "bookId": "816",
      "title": "日本語の論理 下",
      "author": "外山滋比古",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-01"
    },
    {
      "bookId": "817",
      "title": "日本語の論理 上",
      "author": "外山滋比古",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-02"
    },
    {
      "bookId": "818",
      "title": "損料屋喜八郎始末控え 下",
      "author": "山本一力",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-03"
    },
    {
      "bookId": "819",
      "title": "損料屋喜八郎始末控え 上",
      "author": "山本一力",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-04"
    },
    {
      "bookId": "820",
      "title": "事件 下",
      "author": "大岡昇平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-05"
    },
    {
      "bookId": "821",
      "title": "事件 中",
      "author": "大岡昇平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-06"
    },
    {
      "bookId": "822",
      "title": "事件 上",
      "author": "大岡昇平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-07"
    },
    {
      "bookId": "823",
      "title": "食卓のつぶやき 下",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-08"
    },
    {
      "bookId": "824",
      "title": "食卓のつぶやき 上",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-09"
    },
    {
      "bookId": "825",
      "title": "交差点で石蹴り",
      "author": "群ようこ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-10"
    },
    {
      "bookId": "826",
      "title": "群青の湖 下",
      "author": "芝木好子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-11"
    },
    {
      "bookId": "827",
      "title": "群青の湖 中",
      "author": "芝木好子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-12"
    },
    {
      "bookId": "828",
      "title": "群青の湖 上",
      "author": "芝木好子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-13"
    },
    {
      "bookId": "829",
      "title": "浮かれ三亀松 中",
      "author": "吉川潮",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-14"
    },
    {
      "bookId": "830",
      "title": "石の来歴",
      "author": "奥泉光",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-15"
    },
    {
      "bookId": "831",
      "title": "逢わばや見ばや 下",
      "author": "出久根達郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-16"
    },
    {
      "bookId": "832",
      "title": "逢わばや見ばや 上",
      "author": "出久根達郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-17"
    },
    {
      "bookId": "833",
      "title": "遊びと日本人",
      "author": "多田道太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-18"
    },
    {
      "bookId": "834",
      "title": "秋草の渡し 下",
      "author": "伊藤桂一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-19"
    },
    {
      "bookId": "835",
      "title": "秋草の渡し 上",
      "author": "伊藤桂一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-20"
    },
    {
      "bookId": "836",
      "title": "思い出トランプ 下",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-21"
    },
    {
      "bookId": "837",
      "title": "思い出トランプ 上",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-22"
    },
    {
      "bookId": "838",
      "title": "氷葬 3",
      "author": "諸田玲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-23"
    },
    {
      "bookId": "839",
      "title": "氷葬 2",
      "author": "諸田玲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-24"
    },
    {
      "bookId": "840",
      "title": "氷葬 1",
      "author": "諸田玲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-01"
    },
    {
      "bookId": "841",
      "title": "すっきり収納コツのコツ 5",
      "author": "森田博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-02"
    },
    {
      "bookId": "842",
      "title": "すっきり収納コツのコツ 4",
      "author": "森田博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-03"
    },
    {
      "bookId": "843",
      "title": "すっきり収納コツのコツ 3",
      "author": "森田博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-04"
    },
    {
      "bookId": "844",
      "title": "すっきり収納コツのコツ 2",
      "author": "森田博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-05"
    },
    {
      "bookId": "845",
      "title": "すっきり収納コツのコツ 1",
      "author": "森田博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-06"
    },
    {
      "bookId": "846",
      "title": "暮らし上手なマナーコツのコツ 5",
      "author": "暮らしのマナー研究会著",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-07"
    },
    {
      "bookId": "847",
      "title": "暮らし上手なマナーコツのコツ 4",
      "author": "暮らしのマナー研究会著",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-08"
    },
    {
      "bookId": "848",
      "title": "暮らし上手なマナーコツのコツ 2",
      "author": "暮らしのマナー研究会著",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-09"
    },
    {
      "bookId": "849",
      "title": "暮らし上手なマナーコツのコツ 1",
      "author": "暮らしのマナー研究会著",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-10"
    },
    {
      "bookId": "850",
      "title": "対岸の彼女 3",
      "author": "角田光代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-11"
    },
    {
      "bookId": "851",
      "title": "対岸の彼女 2",
      "author": "角田光代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-12"
    },
    {
      "bookId": "852",
      "title": "対岸の彼女 1",
      "author": "角田光代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-13"
    },
    {
      "bookId": "853",
      "title": "鬼平犯科帳 3-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-14"
    },
    {
      "bookId": "854",
      "title": "鬼平犯科帳 3-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-15"
    },
    {
      "bookId": "855",
      "title": "鬼平犯科帳 3-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-16"
    },
    {
      "bookId": "856",
      "title": "私の食自慢・味自慢 8",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-17"
    },
    {
      "bookId": "857",
      "title": "私の食自慢・味自慢 7",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-18"
    },
    {
      "bookId": "858",
      "title": "私の食自慢・味自慢 6",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-19"
    },
    {
      "bookId": "859",
      "title": "私の食自慢・味自慢 5",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-20"
    },
    {
      "bookId": "860",
      "title": "私の食自慢・味自慢 4",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-21"
    },
    {
      "bookId": "861",
      "title": "私の食自慢・味自慢 3",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-22"
    },
    {
      "bookId": "862",
      "title": "私の食自慢・味自慢 2",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-23"
    },
    {
      "bookId": "863",
      "title": "私の食自慢・味自慢 1",
      "author": "嵐山光三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-24"
    },
    {
      "bookId": "864",
      "title": "心にひびく恋のうた愛のうた 第8巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-25"
    },
    {
      "bookId": "865",
      "title": "心にひびく恋のうた愛のうた 第7巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-26"
    },
    {
      "bookId": "866",
      "title": "心にひびく恋のうた愛のうた 第6巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-27"
    },
    {
      "bookId": "867",
      "title": "心にひびく恋のうた愛のうた 第5巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-28"
    },
    {
      "bookId": "868",
      "title": "心にひびく恋のうた愛のうた 第4巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-29"
    },
    {
      "bookId": "869",
      "title": "心にひびく恋のうた愛のうた 第3巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-30"
    },
    {
      "bookId": "870",
      "title": "心にひびく恋のうた愛のうた 第2巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-31"
    },
    {
      "bookId": "871",
      "title": "心にひびく恋のうた愛のうた 第1巻",
      "author": "正津勉集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-01"
    },
    {
      "bookId": "872",
      "title": "錆びる心 下",
      "author": "桐野夏生",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-02"
    },
    {
      "bookId": "873",
      "title": "錆びる心 上",
      "author": "桐野夏生",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-03"
    },
    {
      "bookId": "874",
      "title": "その日のまえに 3",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-04"
    },
    {
      "bookId": "875",
      "title": "その日のまえに 2",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-05"
    },
    {
      "bookId": "876",
      "title": "その日のまえに 1",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-06"
    },
    {
      "bookId": "877",
      "title": "ヴェテラン 下",
      "author": "海老沢泰久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-07"
    },
    {
      "bookId": "878",
      "title": "ヴェテラン 上",
      "author": "海老沢泰久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-08"
    },
    {
      "bookId": "879",
      "title": "冬の 下",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-09"
    },
    {
      "bookId": "880",
      "title": "冬の 上",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-10"
    },
    {
      "bookId": "881",
      "title": "ビタミンF 下",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-11"
    },
    {
      "bookId": "882",
      "title": "ビタミンF 上",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-12"
    },
    {
      "bookId": "883",
      "title": "兵庫頭の叛乱 下",
      "author": "神坂次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-13"
    },
    {
      "bookId": "884",
      "title": "兵庫頭の叛乱 上",
      "author": "神坂次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-14"
    },
    {
      "bookId": "885",
      "title": "日本語と私 下",
      "author": "大野晋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-15"
    },
    {
      "bookId": "886",
      "title": "日本語と私 上",
      "author": "大野晋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-16"
    },
    {
      "bookId": "887",
      "title": "夏目家の糠みそ 下",
      "author": "半藤末利子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-17"
    },
    {
      "bookId": "888",
      "title": "夏目家の糠みそ 上",
      "author": "半藤末利子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-18"
    },
    {
      "bookId": "889",
      "title": "取調室 下",
      "author": "笹沢左保",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-19"
    },
    {
      "bookId": "890",
      "title": "取調室 上",
      "author": "笹沢左保",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-20"
    },
    {
      "bookId": "891",
      "title": "浄瑠璃坂の仇討ち 下",
      "author": "高橋義夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-21"
    },
    {
      "bookId": "892",
      "title": "浄瑠璃坂の仇討ち 中",
      "author": "高橋義夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-22"
    },
    {
      "bookId": "893",
      "title": "浄瑠璃坂の仇討ち 上",
      "author": "高橋義夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-23"
    },
    {
      "bookId": "894",
      "title": "小説・十五世羽左衛門 下",
      "author": "竹田真砂子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-24"
    },
    {
      "bookId": "895",
      "title": "小説・十五世羽左衛門 上",
      "author": "竹田真砂子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-25"
    },
    {
      "bookId": "896",
      "title": "上海",
      "author": "林京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-26"
    },
    {
      "bookId": "897",
      "title": "江戸は廻灯籠 下",
      "author": "佐江衆一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-27"
    },
    {
      "bookId": "898",
      "title": "江戸は廻灯籠 上",
      "author": "佐江衆一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-28"
    },
    {
      "bookId": "899",
      "title": "医者がすすめる不養生 下",
      "author": "遠山高史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-01"
    },
    {
      "bookId": "900",
      "title": "医者がすすめる不養生 上",
      "author": "遠山高史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-02"
    },
    {
      "bookId": "901",
      "title": "浅草紅団 下",
      "author": "川端康成",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-03"
    },
    {
      "bookId": "902",
      "title": "浅草紅団 上",
      "author": "川端康成",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-04"
    },
    {
      "bookId": "903",
      "title": "鬼平犯科帳 2-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-05"
    },
    {
      "bookId": "904",
      "title": "鬼平犯科帳 2-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-06"
    },
    {
      "bookId": "905",
      "title": "鬼平犯科帳 2-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-07"
    },
    {
      "bookId": "906",
      "title": "モラルの罠 3",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-08"
    },
    {
      "bookId": "907",
      "title": "モラルの罠 2",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-09"
    },
    {
      "bookId": "908",
      "title": "モラルの罠 1",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-10"
    },
    {
      "bookId": "909",
      "title": "豆腐屋の四季 4",
      "author": "松下竜一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-11"
    },
    {
      "bookId": "910",
      "title": "豆腐屋の四季 3",
      "author": "松下竜一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-12"
    },
    {
      "bookId": "911",
      "title": "豆腐屋の四季 2",
      "author": "松下竜一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-13"
    },
    {
      "bookId": "912",
      "title": "豆腐屋の四季 1",
      "author": "松下竜一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-14"
    },
    {
      "bookId": "913",
      "title": "破獄 4",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-15"
    },
    {
      "bookId": "914",
      "title": "破獄 3",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-16"
    },
    {
      "bookId": "915",
      "title": "破獄 2",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-17"
    },
    {
      "bookId": "916",
      "title": "破獄 1",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-18"
    },
    {
      "bookId": "917",
      "title": "ロービジョンはここまで見える",
      "author": "ビル・チャプマン",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-19"
    },
    {
      "bookId": "918",
      "title": "ブランコのむこうで 下",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-20"
    },
    {
      "bookId": "919",
      "title": "ブランコのむこうで 上",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-21"
    },
    {
      "bookId": "920",
      "title": "鬼平犯科帳 1-3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-22"
    },
    {
      "bookId": "921",
      "title": "鬼平犯科帳 1-2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-23"
    },
    {
      "bookId": "922",
      "title": "鬼平犯科帳 1-1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-24"
    },
    {
      "bookId": "923",
      "title": "視覚障害者にかかわるしごと事典",
      "author": "黒崎恵津子",
      "category": "福祉",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-25"
    },
    {
      "bookId": "924",
      "title": "浮沈 下",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-26"
    },
    {
      "bookId": "925",
      "title": "浮沈 上",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-27"
    },
    {
      "bookId": "926",
      "title": "影踏み 3",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-28"
    },
    {
      "bookId": "927",
      "title": "影踏み 2",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-29"
    },
    {
      "bookId": "928",
      "title": "影踏み 1",
      "author": "横山秀夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-30"
    },
    {
      "bookId": "929",
      "title": "霊長類ヒト科動物図鑑 下",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-31"
    },
    {
      "bookId": "930",
      "title": "霊長類ヒト科動物図鑑 上",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-01"
    },
    {
      "bookId": "931",
      "title": "もどり橋 下",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-02"
    },
    {
      "bookId": "932",
      "title": "もどり橋 上",
      "author": "澤田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-03"
    },
    {
      "bookId": "933",
      "title": "燃えよ剣 5",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-04"
    },
    {
      "bookId": "934",
      "title": "燃えよ剣 4",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-05"
    },
    {
      "bookId": "935",
      "title": "燃えよ剣 3",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-06"
    },
    {
      "bookId": "936",
      "title": "燃えよ剣 2",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-07"
    },
    {
      "bookId": "937",
      "title": "燃えよ剣 1",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-08"
    },
    {
      "bookId": "938",
      "title": "冥途・旅順入城式 下",
      "author": "内田百間",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-09"
    },
    {
      "bookId": "939",
      "title": "冥途・旅順入城式 上",
      "author": "内田百間",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-10"
    },
    {
      "bookId": "940",
      "title": "明治の人物誌 下",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-11"
    },
    {
      "bookId": "941",
      "title": "明治の人物誌 中",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-12"
    },
    {
      "bookId": "942",
      "title": "法廷解剖学 下",
      "author": "和久峻三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-13"
    },
    {
      "bookId": "943",
      "title": "法廷解剖学 上",
      "author": "和久峻三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-14"
    },
    {
      "bookId": "944",
      "title": "デュアル・ライフ 下",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-15"
    },
    {
      "bookId": "945",
      "title": "デュアル・ライフ 中",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-16"
    },
    {
      "bookId": "946",
      "title": "デュアル・ライフ 上",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-17"
    },
    {
      "bookId": "947",
      "title": "深い河(ディープ・リバー) 下",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-18"
    },
    {
      "bookId": "948",
      "title": "深い河(ディープ・リバー) 上",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-19"
    },
    {
      "bookId": "949",
      "title": "崩れる 下",
      "author": "佐野洋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-20"
    },
    {
      "bookId": "950",
      "title": "崩れる 上",
      "author": "佐野洋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-21"
    },
    {
      "bookId": "951",
      "title": "おれは清海入道 下",
      "author": "東郷隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-22"
    },
    {
      "bookId": "952",
      "title": "おれは清海入道 中",
      "author": "東郷隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-23"
    },
    {
      "bookId": "953",
      "title": "おれは清海入道 上",
      "author": "東郷隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-24"
    },
    {
      "bookId": "954",
      "title": "100歳「元気生活」のススメ 下",
      "author": "日野原重明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-25"
    },
    {
      "bookId": "955",
      "title": "大きな活字の新明解国語辞典",
      "author": "山田忠雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-26"
    },
    {
      "bookId": "956",
      "title": "日本の伝承遊びコツのコツ 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-27"
    },
    {
      "bookId": "957",
      "title": "道具の使い方コツのコツ 5",
      "author": "ものづくり・道具愛好会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-28"
    },
    {
      "bookId": "958",
      "title": "道具の使い方コツのコツ 4",
      "author": "ものづくり・道具愛好会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-29"
    },
    {
      "bookId": "959",
      "title": "道具の使い方コツのコツ 3",
      "author": "ものづくり・道具愛好会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-30"
    },
    {
      "bookId": "960",
      "title": "道具の使い方コツのコツ 2",
      "author": "ものづくり・道具愛好会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-01"
    },
    {
      "bookId": "961",
      "title": "道具の使い方コツのコツ 1",
      "author": "ものづくり・道具愛好会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-02"
    },
    {
      "bookId": "962",
      "title": "深川安楽亭・三十ふり袖",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-03"
    },
    {
      "bookId": "963",
      "title": "泥棒と若殿・秋の駕籠・萱笠",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-04"
    },
    {
      "bookId": "964",
      "title": "あだこ・山茶花帖",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-05"
    },
    {
      "bookId": "965",
      "title": "かあちゃん・将監さまの細みち",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-06"
    },
    {
      "bookId": "966",
      "title": "日本SF・名作集成 第10巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-07"
    },
    {
      "bookId": "967",
      "title": "日本SF・名作集成 第8巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-08"
    },
    {
      "bookId": "968",
      "title": "日本SF・名作集成 第7巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-09"
    },
    {
      "bookId": "969",
      "title": "日本SF・名作集成 第6巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-10"
    },
    {
      "bookId": "970",
      "title": "日本SF・名作集成 第5巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-11"
    },
    {
      "bookId": "971",
      "title": "日本SF・名作集成 第4巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-12"
    },
    {
      "bookId": "972",
      "title": "日本SF・名作集成 第3巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-13"
    },
    {
      "bookId": "973",
      "title": "日本SF・名作集成 第2巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-14"
    },
    {
      "bookId": "974",
      "title": "日本SF・名作集成 第1巻",
      "author": "夢枕獏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-15"
    },
    {
      "bookId": "975",
      "title": "二十番斬り 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-16"
    },
    {
      "bookId": "976",
      "title": "二十番斬り 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-17"
    },
    {
      "bookId": "977",
      "title": "二十番斬り 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-18"
    },
    {
      "bookId": "978",
      "title": "男どき女どき 下",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-19"
    },
    {
      "bookId": "979",
      "title": "男どき女どき 上",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-20"
    },
    {
      "bookId": "980",
      "title": "むかしの味 下",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-21"
    },
    {
      "bookId": "981",
      "title": "むかしの味 上",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-22"
    },
    {
      "bookId": "982",
      "title": "たくさんのタブー 3",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-23"
    },
    {
      "bookId": "983",
      "title": "たくさんのタブー 2",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-24"
    },
    {
      "bookId": "984",
      "title": "たくさんのタブー 1",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-25"
    },
    {
      "bookId": "985",
      "title": "新編絵で見る介護",
      "author": "国立病院機構東京病院リハビリテーション科",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-26"
    },
    {
      "bookId": "986",
      "title": "いま、会いにゆきます 3",
      "author": "市川拓司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-27"
    },
    {
      "bookId": "987",
      "title": "いま、会いにゆきます 2",
      "author": "市川拓司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-28"
    },
    {
      "bookId": "988",
      "title": "いま、会いにゆきます 1",
      "author": "市川拓司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-29"
    },
    {
      "bookId": "989",
      "title": "暗殺者 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-30"
    },
    {
      "bookId": "990",
      "title": "暗殺者 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-31"
    },
    {
      "bookId": "991",
      "title": "暗殺者 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-01"
    },
    {
      "bookId": "992",
      "title": "武士(おとこ)の紋章 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-02"
    },
    {
      "bookId": "993",
      "title": "武士(おとこ)の紋章 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-03"
    },
    {
      "bookId": "994",
      "title": "武士(おとこ)の紋章 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-04"
    },
    {
      "bookId": "995",
      "title": "贈られた手 3",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-05"
    },
    {
      "bookId": "996",
      "title": "贈られた手 2",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-06"
    },
    {
      "bookId": "997",
      "title": "贈られた手 1",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-07"
    },
    {
      "bookId": "998",
      "title": "華やかな喪服 下",
      "author": "土屋隆夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-08"
    },
    {
      "bookId": "999",
      "title": "華やかな喪服 中",
      "author": "土屋隆夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-09"
    },
    {
      "bookId": "1000",
      "title": "華やかな喪服 上",
      "author": "土屋隆夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-10"
    },
    {
      "bookId": "1001",
      "title": "わが荷風 下",
      "author": "野口富士男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-11"
    },
    {
      "bookId": "1002",
      "title": "わが荷風 上",
      "author": "野口富士男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-12"
    },
    {
      "bookId": "1003",
      "title": "妖恋",
      "author": "皆川博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-13"
    },
    {
      "bookId": "1004",
      "title": "本所しぐれ町物語 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-14"
    },
    {
      "bookId": "1005",
      "title": "本所しぐれ町物語 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-15"
    },
    {
      "bookId": "1006",
      "title": "部長の大晩年 下",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-16"
    },
    {
      "bookId": "1007",
      "title": "部長の大晩年 上",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-17"
    },
    {
      "bookId": "1008",
      "title": "仁淀川 下",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-18"
    },
    {
      "bookId": "1009",
      "title": "仁淀川 上",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-19"
    },
    {
      "bookId": "1010",
      "title": "ナイン",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-20"
    },
    {
      "bookId": "1011",
      "title": "徳川千姫哀感",
      "author": "吉田知子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-21"
    },
    {
      "bookId": "1012",
      "title": "朱の丸御用船",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-22"
    },
    {
      "bookId": "1013",
      "title": "寂しい声 下",
      "author": "工藤美代子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-23"
    },
    {
      "bookId": "1014",
      "title": "寂しい声 上",
      "author": "工藤美代子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-24"
    },
    {
      "bookId": "1015",
      "title": "碁打秀行",
      "author": "藤沢秀行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-25"
    },
    {
      "bookId": "1016",
      "title": "暗い落日 下",
      "author": "結城昌治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-26"
    },
    {
      "bookId": "1017",
      "title": "暗い落日 上",
      "author": "結城昌治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-27"
    },
    {
      "bookId": "1018",
      "title": "女ざかり 下",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-28"
    },
    {
      "bookId": "1019",
      "title": "女ざかり 中",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-29"
    },
    {
      "bookId": "1020",
      "title": "小川未明童話集 下",
      "author": "小川未明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-30"
    },
    {
      "bookId": "1021",
      "title": "小川未明童話集 上",
      "author": "小川未明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-01"
    },
    {
      "bookId": "1022",
      "title": "江戸風狂伝 下",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-02"
    },
    {
      "bookId": "1023",
      "title": "江戸風狂伝 上",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-03"
    },
    {
      "bookId": "1024",
      "title": "イヌ・ネコ・ネズミ",
      "author": "戸川幸夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-04"
    },
    {
      "bookId": "1025",
      "title": "氷雨心中 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-05"
    },
    {
      "bookId": "1026",
      "title": "氷雨心中 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-06"
    },
    {
      "bookId": "1027",
      "title": "氷雨心中 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-07"
    },
    {
      "bookId": "1028",
      "title": "波紋 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-08"
    },
    {
      "bookId": "1029",
      "title": "波紋 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-09"
    },
    {
      "bookId": "1030",
      "title": "波紋 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-10"
    },
    {
      "bookId": "1031",
      "title": "死の壁 下",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-11"
    },
    {
      "bookId": "1032",
      "title": "死の壁 上",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-12"
    },
    {
      "bookId": "1033",
      "title": "沈黙 3",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-13"
    },
    {
      "bookId": "1034",
      "title": "沈黙 2",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-14"
    },
    {
      "bookId": "1035",
      "title": "沈黙 1",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-15"
    },
    {
      "bookId": "1036",
      "title": "十番斬り 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-16"
    },
    {
      "bookId": "1037",
      "title": "十番斬り 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-17"
    },
    {
      "bookId": "1038",
      "title": "十番斬り 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-18"
    },
    {
      "bookId": "1039",
      "title": "最高に笑える人生 2",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-19"
    },
    {
      "bookId": "1040",
      "title": "最高に笑える人生 1",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-20"
    },
    {
      "bookId": "1041",
      "title": "遭難者の夢 3",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-21"
    },
    {
      "bookId": "1042",
      "title": "遭難者の夢 2",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-22"
    },
    {
      "bookId": "1043",
      "title": "遭難者の夢 1",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-23"
    },
    {
      "bookId": "1044",
      "title": "あなたと読む恋の歌百首 下",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-24"
    },
    {
      "bookId": "1045",
      "title": "あなたと読む恋の歌百首 上",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-25"
    },
    {
      "bookId": "1046",
      "title": "挨拶・通知・案内・招待状の書き方",
      "author": "阿刀田稔子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-26"
    },
    {
      "bookId": "1047",
      "title": "勝負 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-27"
    },
    {
      "bookId": "1048",
      "title": "勝負 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-28"
    },
    {
      "bookId": "1049",
      "title": "勝負 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-29"
    },
    {
      "bookId": "1050",
      "title": "春の嵐 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-30"
    },
    {
      "bookId": "1051",
      "title": "春の嵐 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-31"
    },
    {
      "bookId": "1052",
      "title": "春の嵐 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-01"
    },
    {
      "bookId": "1053",
      "title": "待ち伏せ 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-02"
    },
    {
      "bookId": "1054",
      "title": "待ち伏せ 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-03"
    },
    {
      "bookId": "1055",
      "title": "待ち伏せ 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-04"
    },
    {
      "bookId": "1056",
      "title": "新編百科家庭の医学",
      "author": "主婦と生活社",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-05"
    },
    {
      "bookId": "1057",
      "title": "狂乱 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-06"
    },
    {
      "bookId": "1058",
      "title": "狂乱 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-07"
    },
    {
      "bookId": "1059",
      "title": "狂乱 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-08"
    },
    {
      "bookId": "1060",
      "title": "隠れ簑 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-09"
    },
    {
      "bookId": "1061",
      "title": "隠れ簑 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-10"
    },
    {
      "bookId": "1062",
      "title": "隠れ簑 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-11"
    },
    {
      "bookId": "1063",
      "title": "新妻 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-12"
    },
    {
      "bookId": "1064",
      "title": "新妻 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-13"
    },
    {
      "bookId": "1065",
      "title": "新妻 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-14"
    },
    {
      "bookId": "1066",
      "title": "展望車殺人事件 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-15"
    },
    {
      "bookId": "1067",
      "title": "展望車殺人事件 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-16"
    },
    {
      "bookId": "1068",
      "title": "展望車殺人事件 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-17"
    },
    {
      "bookId": "1069",
      "title": "白い鬼 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-18"
    },
    {
      "bookId": "1070",
      "title": "白い鬼 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-19"
    },
    {
      "bookId": "1071",
      "title": "白い鬼 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-20"
    },
    {
      "bookId": "1072",
      "title": "幻世(まぼろよ)の祈り 3",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-21"
    },
    {
      "bookId": "1073",
      "title": "幻世(まぼろよ)の祈り 2",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-22"
    },
    {
      "bookId": "1074",
      "title": "幻世(まぼろよ)の祈り 1",
      "author": "天童荒太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-23"
    },
    {
      "bookId": "1075",
      "title": "点訳・音訳・サービスのための著作権マニュアル",
      "author": "全国視覚障害者情報提供施設協会サービス委員会著作権プロジェクト集",
      "category": "福祉",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-24"
    },
    {
      "bookId": "1076",
      "title": "幸福な朝食 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-25"
    },
    {
      "bookId": "1077",
      "title": "幸福な朝食 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-26"
    },
    {
      "bookId": "1078",
      "title": "幸福な朝食 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-27"
    },
    {
      "bookId": "1079",
      "title": "祖谷・淡路殺意の旅 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-28"
    },
    {
      "bookId": "1080",
      "title": "祖谷・淡路殺意の旅 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-29"
    },
    {
      "bookId": "1081",
      "title": "祖谷・淡路殺意の旅 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-30"
    },
    {
      "bookId": "1082",
      "title": "誰か 5",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-31"
    },
    {
      "bookId": "1083",
      "title": "誰か 4",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-01"
    },
    {
      "bookId": "1084",
      "title": "誰か 3",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-02"
    },
    {
      "bookId": "1085",
      "title": "誰か 2",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-03"
    },
    {
      "bookId": "1086",
      "title": "誰か 1",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-04"
    },
    {
      "bookId": "1087",
      "title": "探偵倶楽部 3",
      "author": "東野圭吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-05"
    },
    {
      "bookId": "1088",
      "title": "探偵倶楽部 2",
      "author": "東野圭吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-06"
    },
    {
      "bookId": "1089",
      "title": "探偵倶楽部 1",
      "author": "東野圭吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-07"
    },
    {
      "bookId": "1090",
      "title": "豪華特急トワイライト殺人事件 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-08"
    },
    {
      "bookId": "1091",
      "title": "豪華特急トワイライト殺人事件 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-09"
    },
    {
      "bookId": "1092",
      "title": "豪華特急トワイライト殺人事件 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-10"
    },
    {
      "bookId": "1093",
      "title": "大活字三省堂反対語便覧",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-11"
    },
    {
      "bookId": "1094",
      "title": "中・高年の泌尿器の病気がすべてわかる本",
      "author": "東原英二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-12"
    },
    {
      "bookId": "1095",
      "title": "花の脇役 下",
      "author": "関容子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-13"
    },
    {
      "bookId": "1096",
      "title": "花の脇役 上",
      "author": "関容子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-14"
    },
    {
      "bookId": "1097",
      "title": "林蔵の貌 4",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-15"
    },
    {
      "bookId": "1098",
      "title": "林蔵の貌 3",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-16"
    },
    {
      "bookId": "1099",
      "title": "林蔵の貌 2",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-17"
    },
    {
      "bookId": "1100",
      "title": "林蔵の貌 1",
      "author": "北方謙三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-18"
    },
    {
      "bookId": "1101",
      "title": "星祭りの町 下",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-19"
    },
    {
      "bookId": "1102",
      "title": "星祭りの町 上",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-20"
    },
    {
      "bookId": "1103",
      "title": "風塵地帯 下",
      "author": "三好徹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-21"
    },
    {
      "bookId": "1104",
      "title": "風塵地帯 上",
      "author": "三好徹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-22"
    },
    {
      "bookId": "1105",
      "title": "仲蔵狂乱 下",
      "author": "松井今朝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-23"
    },
    {
      "bookId": "1106",
      "title": "仲蔵狂乱 上",
      "author": "松井今朝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-24"
    },
    {
      "bookId": "1107",
      "title": "長崎ぶらぶら節 下",
      "author": "なかにし礼",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-25"
    },
    {
      "bookId": "1108",
      "title": "長崎ぶらぶら節 上",
      "author": "なかにし礼",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-26"
    },
    {
      "bookId": "1109",
      "title": "長い道程 下",
      "author": "堀和久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-27"
    },
    {
      "bookId": "1110",
      "title": "長い道程 上",
      "author": "堀和久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-28"
    },
    {
      "bookId": "1111",
      "title": "珍品堂主人",
      "author": "井伏鱒二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-29"
    },
    {
      "bookId": "1112",
      "title": "血汐笛 中",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-30"
    },
    {
      "bookId": "1113",
      "title": "血汐笛 上",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-01"
    },
    {
      "bookId": "1114",
      "title": "しのびよる月 下",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-02"
    },
    {
      "bookId": "1115",
      "title": "しのびよる月 上",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-03"
    },
    {
      "bookId": "1116",
      "title": "舌鼓ところどころ 下",
      "author": "吉田健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-04"
    },
    {
      "bookId": "1117",
      "title": "舌鼓ところどころ 上",
      "author": "吉田健一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-05"
    },
    {
      "bookId": "1118",
      "title": "薩南示現流 下",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-06"
    },
    {
      "bookId": "1119",
      "title": "薩南示現流 上",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-07"
    },
    {
      "bookId": "1120",
      "title": "酒と博奕と喝采の日日 下",
      "author": "矢野誠一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-08"
    },
    {
      "bookId": "1121",
      "title": "酒と博奕と喝采の日日 上",
      "author": "矢野誠一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-09"
    },
    {
      "bookId": "1122",
      "title": "句あれば楽あり",
      "author": "小沢昭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-10"
    },
    {
      "bookId": "1123",
      "title": "あの世からのことづて",
      "author": "松谷みよ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-11"
    },
    {
      "bookId": "1124",
      "title": "特急「あさしお3号」殺人事件 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-12"
    },
    {
      "bookId": "1125",
      "title": "特急「あさしお3号」殺人事件 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-13"
    },
    {
      "bookId": "1126",
      "title": "特急「あさしお3号」殺人事件 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-14"
    },
    {
      "bookId": "1127",
      "title": "ひかり62号の殺意 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-15"
    },
    {
      "bookId": "1128",
      "title": "ひかり62号の殺意 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-16"
    },
    {
      "bookId": "1129",
      "title": "花盗人 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-17"
    },
    {
      "bookId": "1130",
      "title": "花盗人 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-18"
    },
    {
      "bookId": "1131",
      "title": "花盗人 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-19"
    },
    {
      "bookId": "1132",
      "title": "わが恋の墓標 3",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-20"
    },
    {
      "bookId": "1133",
      "title": "わが恋の墓標 2",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-21"
    },
    {
      "bookId": "1134",
      "title": "わが恋の墓標 1",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-22"
    },
    {
      "bookId": "1135",
      "title": "天魔 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-23"
    },
    {
      "bookId": "1136",
      "title": "天魔 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-24"
    },
    {
      "bookId": "1137",
      "title": "天魔 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-25"
    },
    {
      "bookId": "1138",
      "title": "魔術はささやく 4",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-26"
    },
    {
      "bookId": "1139",
      "title": "魔術はささやく 3",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-27"
    },
    {
      "bookId": "1140",
      "title": "魔術はささやく 2",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-28"
    },
    {
      "bookId": "1141",
      "title": "魔術はささやく 1",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-29"
    },
    {
      "bookId": "1142",
      "title": "陽炎の男 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-30"
    },
    {
      "bookId": "1143",
      "title": "陽炎の男 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-31"
    },
    {
      "bookId": "1144",
      "title": "陽炎の男 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-01"
    },
    {
      "bookId": "1145",
      "title": "辻斬り 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-02"
    },
    {
      "bookId": "1146",
      "title": "辻斬り 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-03"
    },
    {
      "bookId": "1147",
      "title": "辻斬り 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-04"
    },
    {
      "bookId": "1148",
      "title": "文学賞受賞・名作集成 10",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-05"
    },
    {
      "bookId": "1149",
      "title": "文学賞受賞・名作集成 9",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-06"
    },
    {
      "bookId": "1150",
      "title": "文学賞受賞・名作集成 8",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-07"
    },
    {
      "bookId": "1151",
      "title": "文学賞受賞・名作集成 7",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-08"
    },
    {
      "bookId": "1152",
      "title": "文学賞受賞・名作集成 6",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-09"
    },
    {
      "bookId": "1153",
      "title": "文学賞受賞・名作集成 5",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-10"
    },
    {
      "bookId": "1154",
      "title": "文学賞受賞・名作集成 4",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-11"
    },
    {
      "bookId": "1155",
      "title": "文学賞受賞・名作集成 3",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-12"
    },
    {
      "bookId": "1156",
      "title": "文学賞受賞・名作集成 2",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-13"
    },
    {
      "bookId": "1157",
      "title": "文学賞受賞・名作集成 1",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-14"
    },
    {
      "bookId": "1158",
      "title": "日本人の手紙 第10巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-15"
    },
    {
      "bookId": "1159",
      "title": "日本人の手紙 第9巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-16"
    },
    {
      "bookId": "1160",
      "title": "日本人の手紙 第8巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-17"
    },
    {
      "bookId": "1161",
      "title": "日本人の手紙 第7巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-18"
    },
    {
      "bookId": "1162",
      "title": "日本人の手紙 第6巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-19"
    },
    {
      "bookId": "1163",
      "title": "日本人の手紙 第5巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-20"
    },
    {
      "bookId": "1164",
      "title": "日本人の手紙 第4巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-21"
    },
    {
      "bookId": "1165",
      "title": "日本人の手紙 第3巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-22"
    },
    {
      "bookId": "1166",
      "title": "日本人の手紙 第2巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-23"
    },
    {
      "bookId": "1167",
      "title": "日本人の手紙 第1巻",
      "author": "紀田順一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-24"
    },
    {
      "bookId": "1168",
      "title": "淋しい狩人 3",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-25"
    },
    {
      "bookId": "1169",
      "title": "淋しい狩人 2",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-26"
    },
    {
      "bookId": "1170",
      "title": "淋しい狩人 1",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-27"
    },
    {
      "bookId": "1171",
      "title": "バカの壁 下",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-28"
    },
    {
      "bookId": "1172",
      "title": "バカの壁 上",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-29"
    },
    {
      "bookId": "1173",
      "title": "団欒 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-30"
    },
    {
      "bookId": "1174",
      "title": "団欒 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-01"
    },
    {
      "bookId": "1175",
      "title": "団欒 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-02"
    },
    {
      "bookId": "1176",
      "title": "十津川警部十年目の真実 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-03"
    },
    {
      "bookId": "1177",
      "title": "十津川警部十年目の真実 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-04"
    },
    {
      "bookId": "1178",
      "title": "十津川警部十年目の真実 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-05"
    },
    {
      "bookId": "1179",
      "title": "花散る頃の殺人 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-06"
    },
    {
      "bookId": "1180",
      "title": "花散る頃の殺人 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-07"
    },
    {
      "bookId": "1181",
      "title": "花散る頃の殺人 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-08"
    },
    {
      "bookId": "1182",
      "title": "災厄の「つばさ」121号 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-09"
    },
    {
      "bookId": "1183",
      "title": "災厄の「つばさ」121号 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-10"
    },
    {
      "bookId": "1184",
      "title": "災厄の「つばさ」121号 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-11"
    },
    {
      "bookId": "1185",
      "title": "大活字漢字辞典",
      "author": "伊藤文生",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-12"
    },
    {
      "bookId": "1186",
      "title": "箱根愛と死のラビリンス 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-13"
    },
    {
      "bookId": "1187",
      "title": "箱根愛と死のラビリンス 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-14"
    },
    {
      "bookId": "1188",
      "title": "箱根愛と死のラビリンス 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-15"
    },
    {
      "bookId": "1189",
      "title": "剣客商売 3",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-16"
    },
    {
      "bookId": "1190",
      "title": "剣客商売 2",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-17"
    },
    {
      "bookId": "1191",
      "title": "剣客商売 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-18"
    },
    {
      "bookId": "1192",
      "title": "来なけりゃいいのに 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-19"
    },
    {
      "bookId": "1193",
      "title": "来なけりゃいいのに 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-20"
    },
    {
      "bookId": "1194",
      "title": "来なけりゃいいのに 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-21"
    },
    {
      "bookId": "1195",
      "title": "八州廻り桑山十兵衛 下",
      "author": "佐藤雅美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-22"
    },
    {
      "bookId": "1196",
      "title": "八州廻り桑山十兵衛 上",
      "author": "佐藤雅美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-23"
    },
    {
      "bookId": "1197",
      "title": "リターンマッチ 下",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-24"
    },
    {
      "bookId": "1198",
      "title": "リターンマッチ 上",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-25"
    },
    {
      "bookId": "1199",
      "title": "やきもの師 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-26"
    },
    {
      "bookId": "1200",
      "title": "やきもの師 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-27"
    },
    {
      "bookId": "1201",
      "title": "仏教とは何か",
      "author": "山折哲雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-28"
    },
    {
      "bookId": "1202",
      "title": "ひとごろし 下",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-29"
    },
    {
      "bookId": "1203",
      "title": "ひとごろし 中",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-30"
    },
    {
      "bookId": "1204",
      "title": "ひとごろし 上",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-31"
    },
    {
      "bookId": "1205",
      "title": "翔べ麒麟 5",
      "author": "辻原登",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-01"
    },
    {
      "bookId": "1206",
      "title": "翔べ麒麟 4",
      "author": "辻原登",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-02"
    },
    {
      "bookId": "1207",
      "title": "翔べ麒麟 3",
      "author": "辻原登",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-03"
    },
    {
      "bookId": "1208",
      "title": "翔べ麒麟 2",
      "author": "辻原登",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-04"
    },
    {
      "bookId": "1209",
      "title": "翔べ麒麟 1",
      "author": "辻原登",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-05"
    },
    {
      "bookId": "1210",
      "title": "豆腐の如く",
      "author": "斎藤茂太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-06"
    },
    {
      "bookId": "1211",
      "title": "テロリストのパラソル 下",
      "author": "藤原伊織",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-07"
    },
    {
      "bookId": "1212",
      "title": "テロリストのパラソル 上",
      "author": "藤原伊織",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-08"
    },
    {
      "bookId": "1213",
      "title": "希望 下",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-09"
    },
    {
      "bookId": "1214",
      "title": "希望 中",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-10"
    },
    {
      "bookId": "1215",
      "title": "希望 上",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-11"
    },
    {
      "bookId": "1216",
      "title": "語りかける花 下",
      "author": "志村ふくみ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-12"
    },
    {
      "bookId": "1217",
      "title": "語りかける花 上",
      "author": "志村ふくみ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-13"
    },
    {
      "bookId": "1218",
      "title": "家族会議 下",
      "author": "横光利一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-14"
    },
    {
      "bookId": "1219",
      "title": "家族会議 上",
      "author": "横光利一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-15"
    },
    {
      "bookId": "1220",
      "title": "海路残照 下",
      "author": "森崎和江",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-16"
    },
    {
      "bookId": "1221",
      "title": "海路残照 上",
      "author": "森崎和江",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-17"
    },
    {
      "bookId": "1222",
      "title": "夫の始末",
      "author": "田中澄江",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-18"
    },
    {
      "bookId": "1223",
      "title": "生きてきた道",
      "author": "黒岩重吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-19"
    },
    {
      "bookId": "1224",
      "title": "世界の中心で、愛をさけぶ 3",
      "author": "片山恭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-20"
    },
    {
      "bookId": "1225",
      "title": "世界の中心で、愛をさけぶ 2",
      "author": "片山恭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-21"
    },
    {
      "bookId": "1226",
      "title": "世界の中心で、愛をさけぶ 1",
      "author": "片山恭一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-22"
    },
    {
      "bookId": "1227",
      "title": "堪忍箱 3",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-23"
    },
    {
      "bookId": "1228",
      "title": "堪忍箱 2",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-24"
    },
    {
      "bookId": "1229",
      "title": "堪忍箱 1",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-25"
    },
    {
      "bookId": "1230",
      "title": "幸せになりたい 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-26"
    },
    {
      "bookId": "1231",
      "title": "幸せになりたい 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-27"
    },
    {
      "bookId": "1232",
      "title": "幸せになりたい 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-28"
    },
    {
      "bookId": "1233",
      "title": "失踪 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-29"
    },
    {
      "bookId": "1234",
      "title": "失踪 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-30"
    },
    {
      "bookId": "1235",
      "title": "失踪 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-31"
    },
    {
      "bookId": "1236",
      "title": "薔薇盗人 3",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-01"
    },
    {
      "bookId": "1237",
      "title": "薔薇盗人 2",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-02"
    },
    {
      "bookId": "1238",
      "title": "薔薇盗人 1",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-03"
    },
    {
      "bookId": "1239",
      "title": "鯨の哭く海 4",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-04"
    },
    {
      "bookId": "1240",
      "title": "鯨の哭く海 3",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-05"
    },
    {
      "bookId": "1241",
      "title": "鯨の哭く海 2",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-06"
    },
    {
      "bookId": "1242",
      "title": "鯨の哭く海 1",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-07"
    },
    {
      "bookId": "1243",
      "title": "視覚障害者のための情報機器&サービス 2004",
      "author": "",
      "category": "福祉",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-08"
    },
    {
      "bookId": "1244",
      "title": "大活字春夏秋冬和歌・短歌歳時記",
      "author": "佐佐木幸綱",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-09"
    },
    {
      "bookId": "1245",
      "title": "初ものがたり 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-10"
    },
    {
      "bookId": "1246",
      "title": "初ものがたり 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-11"
    },
    {
      "bookId": "1247",
      "title": "わたしの脇役人生 下",
      "author": "沢村貞子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-12"
    },
    {
      "bookId": "1248",
      "title": "わたしの脇役人生 上",
      "author": "沢村貞子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-13"
    },
    {
      "bookId": "1249",
      "title": "理由はいらない 下",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-14"
    },
    {
      "bookId": "1250",
      "title": "理由はいらない 上",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-15"
    },
    {
      "bookId": "1251",
      "title": "落語への招待 下",
      "author": "江国滋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-16"
    },
    {
      "bookId": "1252",
      "title": "落語への招待 上",
      "author": "江国滋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-17"
    },
    {
      "bookId": "1253",
      "title": "沃野の伝説 4",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-18"
    },
    {
      "bookId": "1254",
      "title": "沃野の伝説 3",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-19"
    },
    {
      "bookId": "1255",
      "title": "沃野の伝説 2",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-20"
    },
    {
      "bookId": "1256",
      "title": "沃野の伝説 1",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-21"
    },
    {
      "bookId": "1257",
      "title": "槍ケ岳開山 下",
      "author": "新田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-22"
    },
    {
      "bookId": "1258",
      "title": "槍ケ岳開山 上",
      "author": "新田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-23"
    },
    {
      "bookId": "1259",
      "title": "山猫の夏 4",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-24"
    },
    {
      "bookId": "1260",
      "title": "山猫の夏 3",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-01"
    },
    {
      "bookId": "1261",
      "title": "山猫の夏 2",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-02"
    },
    {
      "bookId": "1262",
      "title": "山猫の夏 1",
      "author": "船戸与一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-03"
    },
    {
      "bookId": "1263",
      "title": "ヴェネツィアの宿 下",
      "author": "須賀敦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-04"
    },
    {
      "bookId": "1264",
      "title": "ヴェネツィアの宿 上",
      "author": "須賀敦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-05"
    },
    {
      "bookId": "1265",
      "title": "猫の縁談 下",
      "author": "出久根達郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-06"
    },
    {
      "bookId": "1266",
      "title": "猫の縁談 上",
      "author": "出久根達郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-07"
    },
    {
      "bookId": "1267",
      "title": "日曜日の夕刊 下",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-08"
    },
    {
      "bookId": "1268",
      "title": "日曜日の夕刊 上",
      "author": "重松清",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-09"
    },
    {
      "bookId": "1269",
      "title": "長崎ロシア遊女館 下",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-10"
    },
    {
      "bookId": "1270",
      "title": "長崎ロシア遊女館 上",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-11"
    },
    {
      "bookId": "1271",
      "title": "動物はなぜ動物になったか",
      "author": "日高敏隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-12"
    },
    {
      "bookId": "1272",
      "title": "『源氏物語』の男たち 下",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-13"
    },
    {
      "bookId": "1273",
      "title": "『源氏物語』の男たち 上",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-14"
    },
    {
      "bookId": "1274",
      "title": "狼奉行 下",
      "author": "高橋義夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-15"
    },
    {
      "bookId": "1275",
      "title": "狼奉行 上",
      "author": "高橋義夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-16"
    },
    {
      "bookId": "1276",
      "title": "わかりやすい日本語の作文技術",
      "author": "本多勝一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-17"
    },
    {
      "bookId": "1277",
      "title": "殺意の青函トンネル 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-18"
    },
    {
      "bookId": "1278",
      "title": "殺意の青函トンネル 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-19"
    },
    {
      "bookId": "1279",
      "title": "殺意の青函トンネル 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-20"
    },
    {
      "bookId": "1280",
      "title": "いまに語りつぐ日本民話集 [第3集]15",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-21"
    },
    {
      "bookId": "1281",
      "title": "いまに語りつぐ日本民話集 [第3集]14",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-22"
    },
    {
      "bookId": "1282",
      "title": "いまに語りつぐ日本民話集 [第3集]13",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-23"
    },
    {
      "bookId": "1283",
      "title": "いまに語りつぐ日本民話集 [第3集]12",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-24"
    },
    {
      "bookId": "1284",
      "title": "いまに語りつぐ日本民話集 [第3集]11",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-25"
    },
    {
      "bookId": "1285",
      "title": "いまに語りつぐ日本民話集 [第3集]10",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-26"
    },
    {
      "bookId": "1286",
      "title": "いまに語りつぐ日本民話集 [第3集]9",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-27"
    },
    {
      "bookId": "1287",
      "title": "いまに語りつぐ日本民話集 [第3集]8",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-28"
    },
    {
      "bookId": "1288",
      "title": "いまに語りつぐ日本民話集 [第3集]7",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-29"
    },
    {
      "bookId": "1289",
      "title": "いまに語りつぐ日本民話集 [第3集]6",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-30"
    },
    {
      "bookId": "1290",
      "title": "いまに語りつぐ日本民話集 [第3集]5",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-31"
    },
    {
      "bookId": "1291",
      "title": "いまに語りつぐ日本民話集 [第3集]4",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-01"
    },
    {
      "bookId": "1292",
      "title": "いまに語りつぐ日本民話集 [第3集]3",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-02"
    },
    {
      "bookId": "1293",
      "title": "いまに語りつぐ日本民話集 [第3集]2",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-03"
    },
    {
      "bookId": "1294",
      "title": "いまに語りつぐ日本民話集 [第3集]1",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-04"
    },
    {
      "bookId": "1295",
      "title": "中・高年の歯の病気がすべてわかる本",
      "author": "森山貴史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-05"
    },
    {
      "bookId": "1296",
      "title": "命 2",
      "author": "柳美里",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-06"
    },
    {
      "bookId": "1297",
      "title": "命 1",
      "author": "柳美里",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-07"
    },
    {
      "bookId": "1298",
      "title": "育てたように子は育つ",
      "author": "相田みつを／書",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-08"
    },
    {
      "bookId": "1299",
      "title": "簡単料理コツのコツ 5",
      "author": "やまはたのりこ",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-09"
    },
    {
      "bookId": "1300",
      "title": "簡単料理コツのコツ 4",
      "author": "やまはたのりこ",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-10"
    },
    {
      "bookId": "1301",
      "title": "簡単料理コツのコツ 3",
      "author": "やまはたのりこ",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-11"
    },
    {
      "bookId": "1302",
      "title": "簡単料理コツのコツ 2",
      "author": "やまはたのりこ",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-12"
    },
    {
      "bookId": "1303",
      "title": "簡単料理コツのコツ 1",
      "author": "やまはたのりこ",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-13"
    },
    {
      "bookId": "1304",
      "title": "不義にあらず 下",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-14"
    },
    {
      "bookId": "1305",
      "title": "不義にあらず 上",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-15"
    },
    {
      "bookId": "1306",
      "title": "中国畸人伝 下",
      "author": "陳舜臣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-16"
    },
    {
      "bookId": "1307",
      "title": "中国畸人伝 上",
      "author": "陳舜臣",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-17"
    },
    {
      "bookId": "1308",
      "title": "ダック・コール 下",
      "author": "稲見一良",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-18"
    },
    {
      "bookId": "1309",
      "title": "ダック・コール 上",
      "author": "稲見一良",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-19"
    },
    {
      "bookId": "1310",
      "title": "高村光太郎詩集",
      "author": "高村光太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-20"
    },
    {
      "bookId": "1311",
      "title": "スローカーブを、もう一球 下",
      "author": "山際淳司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-21"
    },
    {
      "bookId": "1312",
      "title": "スローカーブを、もう一球 上",
      "author": "山際淳司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-22"
    },
    {
      "bookId": "1313",
      "title": "最後の将軍 下",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-23"
    },
    {
      "bookId": "1314",
      "title": "こころの処方箋",
      "author": "河合隼雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-24"
    },
    {
      "bookId": "1315",
      "title": "恋する伊勢物語 下",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-25"
    },
    {
      "bookId": "1316",
      "title": "恋する伊勢物語 上",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-26"
    },
    {
      "bookId": "1317",
      "title": "九頭竜川 下",
      "author": "大島昌宏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-27"
    },
    {
      "bookId": "1318",
      "title": "九頭竜川 上",
      "author": "大島昌宏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-28"
    },
    {
      "bookId": "1319",
      "title": "絆",
      "author": "藤原てい",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-01"
    },
    {
      "bookId": "1320",
      "title": "加納大尉夫人",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-02"
    },
    {
      "bookId": "1321",
      "title": "風の中の子供",
      "author": "坪田譲治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-03"
    },
    {
      "bookId": "1322",
      "title": "汚名 下",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-04"
    },
    {
      "bookId": "1323",
      "title": "汚名 上",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-05"
    },
    {
      "bookId": "1324",
      "title": "絵合せ 下",
      "author": "庄野潤三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-06"
    },
    {
      "bookId": "1325",
      "title": "絵合せ 上",
      "author": "庄野潤三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-07"
    },
    {
      "bookId": "1326",
      "title": "生きること考えること",
      "author": "田中美知太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-08"
    },
    {
      "bookId": "1327",
      "title": "フラッシュライトの選び方・使い方",
      "author": "中村善晄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-09"
    },
    {
      "bookId": "1328",
      "title": "傑作捕物ワールド 第10巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-10"
    },
    {
      "bookId": "1329",
      "title": "傑作捕物ワールド 第9巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-11"
    },
    {
      "bookId": "1330",
      "title": "傑作捕物ワールド 第8巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-12"
    },
    {
      "bookId": "1331",
      "title": "傑作捕物ワールド 第7巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-13"
    },
    {
      "bookId": "1332",
      "title": "傑作捕物ワールド 第6巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-14"
    },
    {
      "bookId": "1333",
      "title": "傑作捕物ワールド 第5巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-15"
    },
    {
      "bookId": "1334",
      "title": "傑作捕物ワールド 第4巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-16"
    },
    {
      "bookId": "1335",
      "title": "傑作捕物ワールド 第3巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-17"
    },
    {
      "bookId": "1336",
      "title": "傑作捕物ワールド 第2巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-18"
    },
    {
      "bookId": "1337",
      "title": "傑作捕物ワールド 第1巻",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-19"
    },
    {
      "bookId": "1338",
      "title": "見えにくい人の初めてのEメール Outlook Express編",
      "author": "三宅洋信",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-20"
    },
    {
      "bookId": "1339",
      "title": "見えにくい人の初めてのEメール MMメール編",
      "author": "三宅洋信",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-21"
    },
    {
      "bookId": "1340",
      "title": "見えない・見えにくい人の便利グッズファイル",
      "author": "便利グッズサロン",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-22"
    },
    {
      "bookId": "1341",
      "title": "万華鏡 下",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-23"
    },
    {
      "bookId": "1342",
      "title": "万華鏡 上",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-24"
    },
    {
      "bookId": "1343",
      "title": "日の移ろい 下",
      "author": "島尾敏雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-25"
    },
    {
      "bookId": "1344",
      "title": "日の移ろい 上",
      "author": "島尾敏雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-26"
    },
    {
      "bookId": "1345",
      "title": "動物のこころを探る",
      "author": "小原秀雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-27"
    },
    {
      "bookId": "1346",
      "title": "遠い蛍 下",
      "author": "沢田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-28"
    },
    {
      "bookId": "1347",
      "title": "遠い蛍 上",
      "author": "沢田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-29"
    },
    {
      "bookId": "1348",
      "title": "楽しき熱帯 下",
      "author": "奥本大三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-30"
    },
    {
      "bookId": "1349",
      "title": "楽しき熱帯 上",
      "author": "奥本大三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-31"
    },
    {
      "bookId": "1350",
      "title": "抱きしめる、東京 下",
      "author": "森まゆみ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-01"
    },
    {
      "bookId": "1351",
      "title": "抱きしめる、東京 上",
      "author": "森まゆみ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-02"
    },
    {
      "bookId": "1352",
      "title": "酒とバラの日々 下",
      "author": "清水義範",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-03"
    },
    {
      "bookId": "1353",
      "title": "酒とバラの日々 上",
      "author": "清水義範",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-04"
    },
    {
      "bookId": "1354",
      "title": "空白の起点 下",
      "author": "笹沢左保",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-05"
    },
    {
      "bookId": "1355",
      "title": "空白の起点 上",
      "author": "笹沢左保",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-06"
    },
    {
      "bookId": "1356",
      "title": "霧の橋 下",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-07"
    },
    {
      "bookId": "1357",
      "title": "霧の橋 上",
      "author": "乙川優三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-08"
    },
    {
      "bookId": "1358",
      "title": "江戸切絵図貼交風 下",
      "author": "辻邦生",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-09"
    },
    {
      "bookId": "1359",
      "title": "江戸切絵図貼交風 上",
      "author": "辻邦生",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-10"
    },
    {
      "bookId": "1360",
      "title": "暗夜行路 後編下",
      "author": "志賀直哉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-11"
    },
    {
      "bookId": "1361",
      "title": "暗夜行路 後編上",
      "author": "志賀直哉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-12"
    },
    {
      "bookId": "1362",
      "title": "暗夜行路 前編下",
      "author": "志賀直哉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-13"
    },
    {
      "bookId": "1363",
      "title": "暗夜行路 前編上",
      "author": "志賀直哉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-14"
    },
    {
      "bookId": "1364",
      "title": "蒲生邸事件 6",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-15"
    },
    {
      "bookId": "1365",
      "title": "蒲生邸事件 5",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-16"
    },
    {
      "bookId": "1366",
      "title": "蒲生邸事件 4",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-17"
    },
    {
      "bookId": "1367",
      "title": "蒲生邸事件 3",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-18"
    },
    {
      "bookId": "1368",
      "title": "蒲生邸事件 2",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-19"
    },
    {
      "bookId": "1369",
      "title": "蒲生邸事件 1",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-20"
    },
    {
      "bookId": "1370",
      "title": "大活字言葉豊かに俳句類語辞典",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-21"
    },
    {
      "bookId": "1371",
      "title": "いまに語りつぐ日本民話集 [第2集]15",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-22"
    },
    {
      "bookId": "1372",
      "title": "いまに語りつぐ日本民話集 [第2集]14",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-23"
    },
    {
      "bookId": "1373",
      "title": "いまに語りつぐ日本民話集 [第2集]13",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-24"
    },
    {
      "bookId": "1374",
      "title": "いまに語りつぐ日本民話集 [第2集]12",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-25"
    },
    {
      "bookId": "1375",
      "title": "いまに語りつぐ日本民話集 [第2集]11",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-26"
    },
    {
      "bookId": "1376",
      "title": "いまに語りつぐ日本民話集 [第2集]10",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-27"
    },
    {
      "bookId": "1377",
      "title": "いまに語りつぐ日本民話集 [第2集]9",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-28"
    },
    {
      "bookId": "1378",
      "title": "いまに語りつぐ日本民話集 [第2集]8",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-29"
    },
    {
      "bookId": "1379",
      "title": "いまに語りつぐ日本民話集 [第2集]7",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-30"
    },
    {
      "bookId": "1380",
      "title": "いまに語りつぐ日本民話集 [第2集]6",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-01"
    },
    {
      "bookId": "1381",
      "title": "いまに語りつぐ日本民話集 [第2集]5",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-02"
    },
    {
      "bookId": "1382",
      "title": "いまに語りつぐ日本民話集 [第2集]4",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-03"
    },
    {
      "bookId": "1383",
      "title": "いまに語りつぐ日本民話集 [第2集]3",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-04"
    },
    {
      "bookId": "1384",
      "title": "いまに語りつぐ日本民話集 [第2集]2",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-05"
    },
    {
      "bookId": "1385",
      "title": "いまに語りつぐ日本民話集 [第2集]1",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-06"
    },
    {
      "bookId": "1386",
      "title": "夜明けを待ちながら 2",
      "author": "五木寛之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-07"
    },
    {
      "bookId": "1387",
      "title": "夜明けを待ちながら 1",
      "author": "五木寛之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-08"
    },
    {
      "bookId": "1388",
      "title": "石田波郷",
      "author": "山田みづえ・著",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-09"
    },
    {
      "bookId": "1389",
      "title": "喪われた道 3",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-10"
    },
    {
      "bookId": "1390",
      "title": "喪われた道 2",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-11"
    },
    {
      "bookId": "1391",
      "title": "喪われた道 1",
      "author": "内田康夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-12"
    },
    {
      "bookId": "1392",
      "title": "大きな活字の実用折り紙百科",
      "author": "小林一夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-13"
    },
    {
      "bookId": "1393",
      "title": "今夜もベルが鳴る 3",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-14"
    },
    {
      "bookId": "1394",
      "title": "今夜もベルが鳴る 2",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-15"
    },
    {
      "bookId": "1395",
      "title": "今夜もベルが鳴る 1",
      "author": "乃南アサ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-16"
    },
    {
      "bookId": "1396",
      "title": "ラブミーワールド 第10巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-17"
    },
    {
      "bookId": "1397",
      "title": "ラブミーワールド 第9巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-18"
    },
    {
      "bookId": "1398",
      "title": "ラブミーワールド 第8巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-19"
    },
    {
      "bookId": "1399",
      "title": "ラブミーワールド 第7巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-20"
    },
    {
      "bookId": "1400",
      "title": "ラブミーワールド 第6巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-21"
    },
    {
      "bookId": "1401",
      "title": "ラブミーワールド 第5巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-22"
    },
    {
      "bookId": "1402",
      "title": "ラブミーワールド 第4巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-23"
    },
    {
      "bookId": "1403",
      "title": "ラブミーワールド 第3巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-24"
    },
    {
      "bookId": "1404",
      "title": "ラブミーワールド 第2巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-25"
    },
    {
      "bookId": "1405",
      "title": "ラブミーワールド 第1巻",
      "author": "清原康正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-26"
    },
    {
      "bookId": "1406",
      "title": "家事のコツのコツ 5",
      "author": "生活向上委員会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-27"
    },
    {
      "bookId": "1407",
      "title": "家事のコツのコツ 4",
      "author": "生活向上委員会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-28"
    },
    {
      "bookId": "1408",
      "title": "家事のコツのコツ 3",
      "author": "生活向上委員会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-29"
    },
    {
      "bookId": "1409",
      "title": "家事のコツのコツ 1",
      "author": "生活向上委員会",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-30"
    },
    {
      "bookId": "1410",
      "title": "母 下",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-31"
    },
    {
      "bookId": "1411",
      "title": "母 上",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-01"
    },
    {
      "bookId": "1412",
      "title": "論語 下",
      "author": "桑原武夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-02"
    },
    {
      "bookId": "1413",
      "title": "論語 上",
      "author": "桑原武夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-03"
    },
    {
      "bookId": "1414",
      "title": "まりえの客 下",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-04"
    },
    {
      "bookId": "1415",
      "title": "まりえの客 上",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-05"
    },
    {
      "bookId": "1416",
      "title": "ふいに吹く風 下",
      "author": "南木佳士",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-06"
    },
    {
      "bookId": "1417",
      "title": "ふいに吹く風 上",
      "author": "南木佳士",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-07"
    },
    {
      "bookId": "1418",
      "title": "遠花火 下",
      "author": "伊藤桂一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-08"
    },
    {
      "bookId": "1419",
      "title": "遠花火 上",
      "author": "伊藤桂一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-09"
    },
    {
      "bookId": "1420",
      "title": "天涯の花 下",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-10"
    },
    {
      "bookId": "1421",
      "title": "天涯の花 中",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-11"
    },
    {
      "bookId": "1422",
      "title": "天涯の花 上",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-12"
    },
    {
      "bookId": "1423",
      "title": "しぐれ 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-13"
    },
    {
      "bookId": "1424",
      "title": "しぐれ 中",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-14"
    },
    {
      "bookId": "1425",
      "title": "しぐれ 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-15"
    },
    {
      "bookId": "1426",
      "title": "寿司屋のかみさんうちあけ話 下",
      "author": "佐川芳枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-16"
    },
    {
      "bookId": "1427",
      "title": "寿司屋のかみさんうちあけ話 上",
      "author": "佐川芳枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-17"
    },
    {
      "bookId": "1428",
      "title": "黒い雨 下",
      "author": "井伏鱒二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-18"
    },
    {
      "bookId": "1429",
      "title": "黒い雨 上",
      "author": "井伏鱒二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-19"
    },
    {
      "bookId": "1430",
      "title": "江戸職人綺譚 下",
      "author": "佐江衆一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-20"
    },
    {
      "bookId": "1431",
      "title": "江戸職人綺譚 上",
      "author": "佐江衆一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-21"
    },
    {
      "bookId": "1432",
      "title": "伊豆下賀茂で死んだ女 3",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-22"
    },
    {
      "bookId": "1433",
      "title": "伊豆下賀茂で死んだ女 2",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-23"
    },
    {
      "bookId": "1434",
      "title": "伊豆下賀茂で死んだ女 1",
      "author": "西村京太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-24"
    },
    {
      "bookId": "1435",
      "title": "アラスカ風のような物語 2",
      "author": "星野道夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-25"
    },
    {
      "bookId": "1436",
      "title": "アラスカ風のような物語 1",
      "author": "星野道夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-26"
    },
    {
      "bookId": "1437",
      "title": "老人力 2",
      "author": "赤瀬川原平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-27"
    },
    {
      "bookId": "1438",
      "title": "老人力 1",
      "author": "赤瀬川原平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-28"
    },
    {
      "bookId": "1439",
      "title": "大きな活字四字熟語辞典",
      "author": "グループタマル",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-29"
    },
    {
      "bookId": "1440",
      "title": "わが一期一会 下",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-30"
    },
    {
      "bookId": "1441",
      "title": "わが一期一会 上",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-01"
    },
    {
      "bookId": "1442",
      "title": "俳句鑑賞入門 下",
      "author": "山口誓子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-02"
    },
    {
      "bookId": "1443",
      "title": "俳句鑑賞入門 上",
      "author": "山口誓子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-03"
    },
    {
      "bookId": "1444",
      "title": "ユタとふしぎな仲間たち",
      "author": "三浦哲郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-04"
    },
    {
      "bookId": "1445",
      "title": "またたび回覧板 下",
      "author": "群ようこ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-05"
    },
    {
      "bookId": "1446",
      "title": "またたび回覧板 上",
      "author": "群ようこ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-06"
    },
    {
      "bookId": "1447",
      "title": "ひねくれ一茶 4",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-07"
    },
    {
      "bookId": "1448",
      "title": "ひねくれ一茶 2",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-08"
    },
    {
      "bookId": "1449",
      "title": "ひねくれ一茶 1",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-09"
    },
    {
      "bookId": "1450",
      "title": "動物紳士録",
      "author": "西丸震哉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-10"
    },
    {
      "bookId": "1451",
      "title": "定本千利休 下",
      "author": "桑田忠親",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-11"
    },
    {
      "bookId": "1452",
      "title": "定本千利休 上",
      "author": "桑田忠親",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-12"
    },
    {
      "bookId": "1453",
      "title": "その夜の雪 下",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-13"
    },
    {
      "bookId": "1454",
      "title": "その夜の雪 上",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-14"
    },
    {
      "bookId": "1455",
      "title": "青雲の鬼 下",
      "author": "山手樹一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-15"
    },
    {
      "bookId": "1456",
      "title": "青雲の鬼 上",
      "author": "山手樹一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-16"
    },
    {
      "bookId": "1457",
      "title": "黒いリボン",
      "author": "仁木悦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-17"
    },
    {
      "bookId": "1458",
      "title": "消えた人々 下",
      "author": "佐野洋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-18"
    },
    {
      "bookId": "1459",
      "title": "消えた人々 上",
      "author": "佐野洋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-19"
    },
    {
      "bookId": "1460",
      "title": "お供え",
      "author": "吉田知子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-20"
    },
    {
      "bookId": "1461",
      "title": "オサムの朝 下",
      "author": "森詠",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-21"
    },
    {
      "bookId": "1462",
      "title": "オサムの朝 上",
      "author": "森詠",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-22"
    },
    {
      "bookId": "1463",
      "title": "二人五脚 3",
      "author": "松井進",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-23"
    },
    {
      "bookId": "1464",
      "title": "二人五脚 2",
      "author": "松井進",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-24"
    },
    {
      "bookId": "1465",
      "title": "二人五脚 1",
      "author": "松井進",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-25"
    },
    {
      "bookId": "1466",
      "title": "新修広辞典",
      "author": "宇野哲人",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-26"
    },
    {
      "bookId": "1467",
      "title": "大文字レシピで作る旬の魚おかず",
      "author": "斉藤辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-27"
    },
    {
      "bookId": "1468",
      "title": "ではまた明日 3",
      "author": "西田英史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-28"
    },
    {
      "bookId": "1469",
      "title": "ではまた明日 2",
      "author": "西田英史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-29"
    },
    {
      "bookId": "1470",
      "title": "ではまた明日 1",
      "author": "西田英史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-30"
    },
    {
      "bookId": "1471",
      "title": "ご長寿おかず112",
      "author": "主婦と生活社",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-31"
    },
    {
      "bookId": "1472",
      "title": "ウメ子 3",
      "author": "阿川佐和子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-01"
    },
    {
      "bookId": "1473",
      "title": "ウメ子 2",
      "author": "阿川佐和子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-02"
    },
    {
      "bookId": "1474",
      "title": "ウメ子 1",
      "author": "阿川佐和子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-03"
    },
    {
      "bookId": "1475",
      "title": "怪奇・ホラーワールド 第15巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-04"
    },
    {
      "bookId": "1476",
      "title": "怪奇・ホラーワールド 第14巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-05"
    },
    {
      "bookId": "1477",
      "title": "怪奇・ホラーワールド 第13巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-06"
    },
    {
      "bookId": "1478",
      "title": "怪奇・ホラーワールド 第12巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-07"
    },
    {
      "bookId": "1479",
      "title": "怪奇・ホラーワールド 第11巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-08"
    },
    {
      "bookId": "1480",
      "title": "怪奇・ホラーワールド 第10巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-09"
    },
    {
      "bookId": "1481",
      "title": "怪奇・ホラーワールド 第9巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-10"
    },
    {
      "bookId": "1482",
      "title": "怪奇・ホラーワールド 第8巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-11"
    },
    {
      "bookId": "1483",
      "title": "怪奇・ホラーワールド 第7巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-12"
    },
    {
      "bookId": "1484",
      "title": "怪奇・ホラーワールド 第6巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-13"
    },
    {
      "bookId": "1485",
      "title": "怪奇・ホラーワールド 第5巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-14"
    },
    {
      "bookId": "1486",
      "title": "怪奇・ホラーワールド 第4巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-15"
    },
    {
      "bookId": "1487",
      "title": "怪奇・ホラーワールド 第3巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-16"
    },
    {
      "bookId": "1488",
      "title": "怪奇・ホラーワールド 第2巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-17"
    },
    {
      "bookId": "1489",
      "title": "怪奇・ホラーワールド 第1巻",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-18"
    },
    {
      "bookId": "1490",
      "title": "いまに語りつぐ日本民話集 [第1集]15",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-19"
    },
    {
      "bookId": "1491",
      "title": "いまに語りつぐ日本民話集 [第1集]14",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-20"
    },
    {
      "bookId": "1492",
      "title": "いまに語りつぐ日本民話集 [第1集]13",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-21"
    },
    {
      "bookId": "1493",
      "title": "いまに語りつぐ日本民話集 [第1集]12",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-22"
    },
    {
      "bookId": "1494",
      "title": "いまに語りつぐ日本民話集 [第1集]11",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-23"
    },
    {
      "bookId": "1495",
      "title": "いまに語りつぐ日本民話集 [第1集]10",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-24"
    },
    {
      "bookId": "1496",
      "title": "いまに語りつぐ日本民話集 [第1集]9",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-25"
    },
    {
      "bookId": "1497",
      "title": "いまに語りつぐ日本民話集 [第1集]8",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-26"
    },
    {
      "bookId": "1498",
      "title": "いまに語りつぐ日本民話集 [第1集]7",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-27"
    },
    {
      "bookId": "1499",
      "title": "いまに語りつぐ日本民話集 [第1集]6",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-28"
    },
    {
      "bookId": "1500",
      "title": "いまに語りつぐ日本民話集 [第1集]5",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-29"
    },
    {
      "bookId": "1501",
      "title": "いまに語りつぐ日本民話集 [第1集]4",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-30"
    },
    {
      "bookId": "1502",
      "title": "いまに語りつぐ日本民話集 [第1集]3",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-31"
    },
    {
      "bookId": "1503",
      "title": "いまに語りつぐ日本民話集 [第1集]2",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-01"
    },
    {
      "bookId": "1504",
      "title": "いまに語りつぐ日本民話集 [第1集]1",
      "author": "野村純一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-02"
    },
    {
      "bookId": "1505",
      "title": "天国までの百マイル 3",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-03"
    },
    {
      "bookId": "1506",
      "title": "天国までの百マイル 2",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-04"
    },
    {
      "bookId": "1507",
      "title": "天国までの百マイル 1",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-05"
    },
    {
      "bookId": "1508",
      "title": "大活字美しい日本語おしゃれ季語辞典",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-06"
    },
    {
      "bookId": "1509",
      "title": "遙かなるケンブリッジ 下",
      "author": "藤原正彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-07"
    },
    {
      "bookId": "1510",
      "title": "遙かなるケンブリッジ 上",
      "author": "藤原正彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-08"
    },
    {
      "bookId": "1511",
      "title": "花の棺 下",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-09"
    },
    {
      "bookId": "1512",
      "title": "花の棺 上",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-10"
    },
    {
      "bookId": "1513",
      "title": "洟をたらした神",
      "author": "吉野せい",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-11"
    },
    {
      "bookId": "1514",
      "title": "美味礼讃 下",
      "author": "海老沢泰久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-12"
    },
    {
      "bookId": "1515",
      "title": "美味礼讃 中",
      "author": "海老沢泰久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-13"
    },
    {
      "bookId": "1516",
      "title": "美味礼讃 上",
      "author": "海老沢泰久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-14"
    },
    {
      "bookId": "1517",
      "title": "百魚歳時記 下",
      "author": "岩満重孝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-15"
    },
    {
      "bookId": "1518",
      "title": "百魚歳時記 上",
      "author": "岩満重孝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-16"
    },
    {
      "bookId": "1519",
      "title": "父の帽子",
      "author": "森茉莉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-17"
    },
    {
      "bookId": "1520",
      "title": "蒼氓 下",
      "author": "石川達三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-18"
    },
    {
      "bookId": "1521",
      "title": "蒼氓 上",
      "author": "石川達三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-19"
    },
    {
      "bookId": "1522",
      "title": "砂の紋 下",
      "author": "清水一行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-20"
    },
    {
      "bookId": "1523",
      "title": "砂の紋 上",
      "author": "清水一行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-21"
    },
    {
      "bookId": "1524",
      "title": "心映えの記 下",
      "author": "太田治子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-22"
    },
    {
      "bookId": "1525",
      "title": "心映えの記 上",
      "author": "太田治子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-23"
    },
    {
      "bookId": "1526",
      "title": "心",
      "author": "高田好胤",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-24"
    },
    {
      "bookId": "1527",
      "title": "検事調書の余白 下",
      "author": "佐藤道夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-25"
    },
    {
      "bookId": "1528",
      "title": "検事調書の余白 上",
      "author": "佐藤道夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-26"
    },
    {
      "bookId": "1529",
      "title": "海鳴りやまず 下",
      "author": "藤井素介",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-27"
    },
    {
      "bookId": "1530",
      "title": "海鳴りやまず 上",
      "author": "藤井素介",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-28"
    },
    {
      "bookId": "1531",
      "title": "兵隊宿",
      "author": "竹西寛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-29"
    },
    {
      "bookId": "1532",
      "title": "見えにくい人の初めてのパソコン",
      "author": "北山恵美子",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-30"
    },
    {
      "bookId": "1533",
      "title": "げんだい時代小説 15",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-01"
    },
    {
      "bookId": "1534",
      "title": "げんだい時代小説 14",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-02"
    },
    {
      "bookId": "1535",
      "title": "げんだい時代小説 13",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-03"
    },
    {
      "bookId": "1536",
      "title": "げんだい時代小説 12",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-04"
    },
    {
      "bookId": "1537",
      "title": "げんだい時代小説 11",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-05"
    },
    {
      "bookId": "1538",
      "title": "げんだい時代小説 10",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-06"
    },
    {
      "bookId": "1539",
      "title": "げんだい時代小説 9",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-07"
    },
    {
      "bookId": "1540",
      "title": "げんだい時代小説 8",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-08"
    },
    {
      "bookId": "1541",
      "title": "げんだい時代小説 7",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-09"
    },
    {
      "bookId": "1542",
      "title": "げんだい時代小説 6",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-10"
    },
    {
      "bookId": "1543",
      "title": "げんだい時代小説 5",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-11"
    },
    {
      "bookId": "1544",
      "title": "げんだい時代小説 4",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-12"
    },
    {
      "bookId": "1545",
      "title": "げんだい時代小説 3",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-13"
    },
    {
      "bookId": "1546",
      "title": "げんだい時代小説 2",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-14"
    },
    {
      "bookId": "1547",
      "title": "げんだい時代小説 1",
      "author": "縄田一男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-15"
    },
    {
      "bookId": "1548",
      "title": "生きる心の糧 [第2期]13",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-16"
    },
    {
      "bookId": "1549",
      "title": "生きる心の糧 [第2期]12",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-17"
    },
    {
      "bookId": "1550",
      "title": "生きる心の糧 [第2期]11",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-18"
    },
    {
      "bookId": "1551",
      "title": "生きる心の糧 [第2期]10",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-19"
    },
    {
      "bookId": "1552",
      "title": "生きる心の糧 [第2期]9",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-20"
    },
    {
      "bookId": "1553",
      "title": "生きる心の糧 [第2期]8",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-21"
    },
    {
      "bookId": "1554",
      "title": "生きる心の糧 [第2期]6",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-22"
    },
    {
      "bookId": "1555",
      "title": "生きる心の糧 [第2期]5",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-23"
    },
    {
      "bookId": "1556",
      "title": "生きる心の糧 [第2期]4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-24"
    },
    {
      "bookId": "1557",
      "title": "生きる心の糧 [第2期]3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-25"
    },
    {
      "bookId": "1558",
      "title": "生きる心の糧 [第2期]2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-26"
    },
    {
      "bookId": "1559",
      "title": "生きる心の糧 [第2期]1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-27"
    },
    {
      "bookId": "1560",
      "title": "花を投げた女たち 下",
      "author": "永畑道子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-28"
    },
    {
      "bookId": "1561",
      "title": "花を投げた女たち 上",
      "author": "永畑道子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-29"
    },
    {
      "bookId": "1562",
      "title": "森のうた",
      "author": "岩城宏之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-30"
    },
    {
      "bookId": "1563",
      "title": "もう、きみには頼まない 下",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-31"
    },
    {
      "bookId": "1564",
      "title": "もう、きみには頼まない 上",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-01"
    },
    {
      "bookId": "1565",
      "title": "風塵抄 下",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-02"
    },
    {
      "bookId": "1566",
      "title": "風塵抄 上",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-03"
    },
    {
      "bookId": "1567",
      "title": "貧乏同心御用帳 下",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-04"
    },
    {
      "bookId": "1568",
      "title": "貧乏同心御用帳 上",
      "author": "柴田錬三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-05"
    },
    {
      "bookId": "1569",
      "title": "どうぶつ白話",
      "author": "戸川幸夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-06"
    },
    {
      "bookId": "1570",
      "title": "遠いリング 下",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-07"
    },
    {
      "bookId": "1571",
      "title": "遠いリング 中",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-08"
    },
    {
      "bookId": "1572",
      "title": "遠いリング 上",
      "author": "後藤正治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-09"
    },
    {
      "bookId": "1573",
      "title": "しぐさの日本文化",
      "author": "多田道太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-10"
    },
    {
      "bookId": "1574",
      "title": "これからの出来事",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-11"
    },
    {
      "bookId": "1575",
      "title": "小伝抄 下",
      "author": "星川清司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-12"
    },
    {
      "bookId": "1576",
      "title": "小伝抄 上",
      "author": "星川清司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-13"
    },
    {
      "bookId": "1577",
      "title": "五左衛門坂の敵討 下",
      "author": "中村彰彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-14"
    },
    {
      "bookId": "1578",
      "title": "五左衛門坂の敵討 上",
      "author": "中村彰彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-15"
    },
    {
      "bookId": "1579",
      "title": "幻色江戸ごよみ 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-16"
    },
    {
      "bookId": "1580",
      "title": "幻色江戸ごよみ 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-17"
    },
    {
      "bookId": "1581",
      "title": "北里大学病院24時 下",
      "author": "足立倫行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-18"
    },
    {
      "bookId": "1582",
      "title": "北里大学病院24時 上",
      "author": "足立倫行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-19"
    },
    {
      "bookId": "1583",
      "title": "女たちの海峡",
      "author": "笹倉明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-20"
    },
    {
      "bookId": "1584",
      "title": "腕くらべ",
      "author": "永井荷風",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-21"
    },
    {
      "bookId": "1585",
      "title": "一色一生 下",
      "author": "志村ふくみ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-22"
    },
    {
      "bookId": "1586",
      "title": "一色一生 上",
      "author": "志村ふくみ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-23"
    },
    {
      "bookId": "1587",
      "title": "拡大読書器であなたも読める!書ける!",
      "author": "森田茂樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-24"
    },
    {
      "bookId": "1588",
      "title": "絵で見る介護",
      "author": "国立療養所東京病院リハビリテーション科",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-25"
    },
    {
      "bookId": "1589",
      "title": "世界民族言語地図",
      "author": "R.E.アシャー",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-26"
    },
    {
      "bookId": "1590",
      "title": "別れ霜 下",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-27"
    },
    {
      "bookId": "1591",
      "title": "別れ霜 上",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-28"
    },
    {
      "bookId": "1592",
      "title": "ハイジ 下巻",
      "author": "J.シュピーリ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-29"
    },
    {
      "bookId": "1593",
      "title": "ハイジ 中巻",
      "author": "J.シュピーリ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-30"
    },
    {
      "bookId": "1594",
      "title": "ハイジ 上巻",
      "author": "J.シュピーリ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-01"
    },
    {
      "bookId": "1595",
      "title": "夢は枯野を 下",
      "author": "立原正秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-02"
    },
    {
      "bookId": "1596",
      "title": "夢は枯野を 上",
      "author": "立原正秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-03"
    },
    {
      "bookId": "1597",
      "title": "農協月へ行く 下",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-04"
    },
    {
      "bookId": "1598",
      "title": "農協月へ行く 上",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-05"
    },
    {
      "bookId": "1599",
      "title": "閃光の遺産 下",
      "author": "三好徹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-06"
    },
    {
      "bookId": "1600",
      "title": "閃光の遺産 上",
      "author": "三好徹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-07"
    },
    {
      "bookId": "1601",
      "title": "三界の家 下",
      "author": "林京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-08"
    },
    {
      "bookId": "1602",
      "title": "三界の家 上",
      "author": "林京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-09"
    },
    {
      "bookId": "1603",
      "title": "西鶴人情橋 下",
      "author": "吉村正一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-10"
    },
    {
      "bookId": "1604",
      "title": "西鶴人情橋 上",
      "author": "吉村正一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-11"
    },
    {
      "bookId": "1605",
      "title": "玄鳥",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-12"
    },
    {
      "bookId": "1606",
      "title": "月下の剣法者 下",
      "author": "伊藤桂一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-13"
    },
    {
      "bookId": "1607",
      "title": "月下の剣法者 上",
      "author": "伊藤桂一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-14"
    },
    {
      "bookId": "1608",
      "title": "寛永風雲録 下",
      "author": "南原幹雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-15"
    },
    {
      "bookId": "1609",
      "title": "寛永風雲録 上",
      "author": "南原幹雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-16"
    },
    {
      "bookId": "1610",
      "title": "亀八 下巻",
      "author": "舟崎靖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-17"
    },
    {
      "bookId": "1611",
      "title": "亀八 上巻",
      "author": "舟崎靖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-18"
    },
    {
      "bookId": "1612",
      "title": "お江戸の百太郎",
      "author": "那須正幹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-19"
    },
    {
      "bookId": "1613",
      "title": "ほっとミステリーワールド 15",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-20"
    },
    {
      "bookId": "1614",
      "title": "ほっとミステリーワールド 14",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-21"
    },
    {
      "bookId": "1615",
      "title": "ほっとミステリーワールド 13",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-22"
    },
    {
      "bookId": "1616",
      "title": "ほっとミステリーワールド 12",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-23"
    },
    {
      "bookId": "1617",
      "title": "ほっとミステリーワールド 11",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-24"
    },
    {
      "bookId": "1618",
      "title": "ほっとミステリーワールド 10",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-25"
    },
    {
      "bookId": "1619",
      "title": "ほっとミステリーワールド 9",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-26"
    },
    {
      "bookId": "1620",
      "title": "ほっとミステリーワールド 8",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-27"
    },
    {
      "bookId": "1621",
      "title": "ほっとミステリーワールド 7",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-28"
    },
    {
      "bookId": "1622",
      "title": "ほっとミステリーワールド 6",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-29"
    },
    {
      "bookId": "1623",
      "title": "ほっとミステリーワールド 5",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-30"
    },
    {
      "bookId": "1624",
      "title": "ほっとミステリーワールド 4",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-31"
    },
    {
      "bookId": "1625",
      "title": "ほっとミステリーワールド 3",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-01"
    },
    {
      "bookId": "1626",
      "title": "ほっとミステリーワールド 2",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-02"
    },
    {
      "bookId": "1627",
      "title": "ほっとミステリーワールド 1",
      "author": "二上洋一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-03"
    },
    {
      "bookId": "1628",
      "title": "大きな字の常用国語辞典",
      "author": "石井庄司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-04"
    },
    {
      "bookId": "1629",
      "title": "五体不満足 3",
      "author": "乙武洋匡",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-05"
    },
    {
      "bookId": "1630",
      "title": "五体不満足 2",
      "author": "乙武洋匡",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-06"
    },
    {
      "bookId": "1631",
      "title": "五体不満足 1",
      "author": "乙武洋匡",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-07"
    },
    {
      "bookId": "1632",
      "title": "もだん時代小説 15",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-08"
    },
    {
      "bookId": "1633",
      "title": "もだん時代小説 14",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-09"
    },
    {
      "bookId": "1634",
      "title": "もだん時代小説 13",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-10"
    },
    {
      "bookId": "1635",
      "title": "もだん時代小説 12",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-11"
    },
    {
      "bookId": "1636",
      "title": "もだん時代小説 11",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-12"
    },
    {
      "bookId": "1637",
      "title": "もだん時代小説 10",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-13"
    },
    {
      "bookId": "1638",
      "title": "もだん時代小説 9",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-14"
    },
    {
      "bookId": "1639",
      "title": "もだん時代小説 8",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-15"
    },
    {
      "bookId": "1640",
      "title": "もだん時代小説 7",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-16"
    },
    {
      "bookId": "1641",
      "title": "もだん時代小説 6",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-17"
    },
    {
      "bookId": "1642",
      "title": "もだん時代小説 5",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-18"
    },
    {
      "bookId": "1643",
      "title": "もだん時代小説 4",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-19"
    },
    {
      "bookId": "1644",
      "title": "もだん時代小説 3",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-20"
    },
    {
      "bookId": "1645",
      "title": "もだん時代小説 2",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-21"
    },
    {
      "bookId": "1646",
      "title": "もだん時代小説 1",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-22"
    },
    {
      "bookId": "1647",
      "title": "著名人が語る<学びのヒント> 10",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-23"
    },
    {
      "bookId": "1648",
      "title": "著名人が語る<学びのヒント> 9",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-24"
    },
    {
      "bookId": "1649",
      "title": "著名人が語る<学びのヒント> 8",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-25"
    },
    {
      "bookId": "1650",
      "title": "著名人が語る<学びのヒント> 7",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-26"
    },
    {
      "bookId": "1651",
      "title": "著名人が語る<学びのヒント> 6",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-27"
    },
    {
      "bookId": "1652",
      "title": "著名人が語る<学びのヒント> 5",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-28"
    },
    {
      "bookId": "1653",
      "title": "著名人が語る<学びのヒント> 4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-29"
    },
    {
      "bookId": "1654",
      "title": "著名人が語る<学びのヒント> 3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-30"
    },
    {
      "bookId": "1655",
      "title": "著名人が語る<学びのヒント> 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-31"
    },
    {
      "bookId": "1656",
      "title": "著名人が語る<学びのヒント> 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-01"
    },
    {
      "bookId": "1657",
      "title": "花森安治の仕事",
      "author": "酒井寛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-02"
    },
    {
      "bookId": "1658",
      "title": "我が老後",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-03"
    },
    {
      "bookId": "1659",
      "title": "横しぐれ 下",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-04"
    },
    {
      "bookId": "1660",
      "title": "横しぐれ 上",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-05"
    },
    {
      "bookId": "1661",
      "title": "巴里からの遺言 下",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-06"
    },
    {
      "bookId": "1662",
      "title": "巴里からの遺言 上",
      "author": "藤田宜永",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-07"
    },
    {
      "bookId": "1663",
      "title": "新門辰五郎事件帖 下",
      "author": "海渡英祐",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-08"
    },
    {
      "bookId": "1664",
      "title": "新門辰五郎事件帖 上",
      "author": "海渡英祐",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-09"
    },
    {
      "bookId": "1665",
      "title": "残映",
      "author": "杉本章子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-10"
    },
    {
      "bookId": "1666",
      "title": "銀幕の果てに 下",
      "author": "つかこうへい",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-11"
    },
    {
      "bookId": "1667",
      "title": "銀幕の果てに 中",
      "author": "つかこうへい",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-12"
    },
    {
      "bookId": "1668",
      "title": "銀幕の果てに 上",
      "author": "つかこうへい",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-13"
    },
    {
      "bookId": "1669",
      "title": "木に会う 下",
      "author": "高田宏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-14"
    },
    {
      "bookId": "1670",
      "title": "木に会う 上",
      "author": "高田宏",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-15"
    },
    {
      "bookId": "1671",
      "title": "カルテの余白 下",
      "author": "なだいなだ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-16"
    },
    {
      "bookId": "1672",
      "title": "カルテの余白 上",
      "author": "なだいなだ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-17"
    },
    {
      "bookId": "1673",
      "title": "からだの見方 下",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-18"
    },
    {
      "bookId": "1674",
      "title": "からだの見方 上",
      "author": "養老孟司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-19"
    },
    {
      "bookId": "1675",
      "title": "花実の森 下",
      "author": "保高みさ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-20"
    },
    {
      "bookId": "1676",
      "title": "花実の森 上",
      "author": "保高みさ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-21"
    },
    {
      "bookId": "1677",
      "title": "風祭 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-22"
    },
    {
      "bookId": "1678",
      "title": "風祭 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-23"
    },
    {
      "bookId": "1679",
      "title": "あんちゃん 下",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-24"
    },
    {
      "bookId": "1680",
      "title": "あんちゃん 中",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-01"
    },
    {
      "bookId": "1681",
      "title": "あんちゃん 上",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-02"
    },
    {
      "bookId": "1682",
      "title": "ヨメール物語",
      "author": "望月優",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-03"
    },
    {
      "bookId": "1683",
      "title": "大きな活字の三省堂故事ことわざ・慣用句辞典",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-04"
    },
    {
      "bookId": "1684",
      "title": "ももこの話",
      "author": "さくらももこ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-05"
    },
    {
      "bookId": "1685",
      "title": "玉人/歳月",
      "author": "宮城谷昌光",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-06"
    },
    {
      "bookId": "1686",
      "title": "母の言いぶん",
      "author": "高森和子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-07"
    },
    {
      "bookId": "1687",
      "title": "ロウソクの科学",
      "author": "ファラデー",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-08"
    },
    {
      "bookId": "1688",
      "title": "広島第二県女二年西組 下",
      "author": "関千枝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-09"
    },
    {
      "bookId": "1689",
      "title": "広島第二県女二年西組 上",
      "author": "関千枝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-10"
    },
    {
      "bookId": "1690",
      "title": "ネコの住所録",
      "author": "群ようこ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-11"
    },
    {
      "bookId": "1691",
      "title": "せまくても、わが家は花園",
      "author": "柳宗民",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-12"
    },
    {
      "bookId": "1692",
      "title": "山椒魚 下",
      "author": "井伏鱒二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-13"
    },
    {
      "bookId": "1693",
      "title": "山椒魚 上",
      "author": "井伏鱒二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-14"
    },
    {
      "bookId": "1694",
      "title": "恋忘れ草 下",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-15"
    },
    {
      "bookId": "1695",
      "title": "恋忘れ草 上",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-16"
    },
    {
      "bookId": "1696",
      "title": "勘三郎の天気",
      "author": "山川静夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-17"
    },
    {
      "bookId": "1697",
      "title": "考える葦",
      "author": "串田孫一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-18"
    },
    {
      "bookId": "1698",
      "title": "英語屋さん 下",
      "author": "源氏鶏太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-19"
    },
    {
      "bookId": "1699",
      "title": "英語屋さん 上",
      "author": "源氏鶏太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-20"
    },
    {
      "bookId": "1700",
      "title": "兄小林秀雄 下",
      "author": "高見沢潤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-21"
    },
    {
      "bookId": "1701",
      "title": "兄小林秀雄 上",
      "author": "高見沢潤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-22"
    },
    {
      "bookId": "1702",
      "title": "頭で勝つ法廷読本 下",
      "author": "和久峻三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-23"
    },
    {
      "bookId": "1703",
      "title": "頭で勝つ法廷読本 上",
      "author": "和久峻三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-24"
    },
    {
      "bookId": "1704",
      "title": "想い出よみがえる懐かしのうた 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-25"
    },
    {
      "bookId": "1705",
      "title": "愛でもくらえ",
      "author": "ビートたけし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-26"
    },
    {
      "bookId": "1706",
      "title": "げんだいミステリーワールド 15",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-27"
    },
    {
      "bookId": "1707",
      "title": "げんだいミステリーワールド 14",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-28"
    },
    {
      "bookId": "1708",
      "title": "げんだいミステリーワールド 13",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-29"
    },
    {
      "bookId": "1709",
      "title": "げんだいミステリーワールド 12",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-30"
    },
    {
      "bookId": "1710",
      "title": "げんだいミステリーワールド 11",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-31"
    },
    {
      "bookId": "1711",
      "title": "げんだいミステリーワールド 10",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-01"
    },
    {
      "bookId": "1712",
      "title": "げんだいミステリーワールド 9",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-02"
    },
    {
      "bookId": "1713",
      "title": "げんだいミステリーワールド 8",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-03"
    },
    {
      "bookId": "1714",
      "title": "げんだいミステリーワールド 7",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-04"
    },
    {
      "bookId": "1715",
      "title": "げんだいミステリーワールド 6",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-05"
    },
    {
      "bookId": "1716",
      "title": "げんだいミステリーワールド 5",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-06"
    },
    {
      "bookId": "1717",
      "title": "げんだいミステリーワールド 4",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-07"
    },
    {
      "bookId": "1718",
      "title": "げんだいミステリーワールド 3",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-08"
    },
    {
      "bookId": "1719",
      "title": "げんだいミステリーワールド 2",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-09"
    },
    {
      "bookId": "1720",
      "title": "げんだいミステリーワールド 1",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-10"
    },
    {
      "bookId": "1721",
      "title": "銀河鉄道の夜/ざしき童子のはなし/グスコーブドリの伝記",
      "author": "宮沢賢治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-11"
    },
    {
      "bookId": "1722",
      "title": "斜陽",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-12"
    },
    {
      "bookId": "1723",
      "title": "歴史の発見",
      "author": "木村尚三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-13"
    },
    {
      "bookId": "1724",
      "title": "りんごの涙 下",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-14"
    },
    {
      "bookId": "1725",
      "title": "りんごの涙 上",
      "author": "俵万智",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-15"
    },
    {
      "bookId": "1726",
      "title": "水なき雲 下",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-16"
    },
    {
      "bookId": "1727",
      "title": "水なき雲 中",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-17"
    },
    {
      "bookId": "1728",
      "title": "水なき雲 上",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-18"
    },
    {
      "bookId": "1729",
      "title": "幕末の暗殺者 下",
      "author": "船山馨",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-19"
    },
    {
      "bookId": "1730",
      "title": "幕末の暗殺者 上",
      "author": "船山馨",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-20"
    },
    {
      "bookId": "1731",
      "title": "眠る盃 下",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-21"
    },
    {
      "bookId": "1732",
      "title": "眠る盃 上",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-22"
    },
    {
      "bookId": "1733",
      "title": "ニコライ遭難 下",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-23"
    },
    {
      "bookId": "1734",
      "title": "ニコライ遭難 上",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-24"
    },
    {
      "bookId": "1735",
      "title": "管絃祭",
      "author": "竹西寛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-25"
    },
    {
      "bookId": "1736",
      "title": "神隠し 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-26"
    },
    {
      "bookId": "1737",
      "title": "神隠し 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-27"
    },
    {
      "bookId": "1738",
      "title": "帰りなん、いざ 下",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-28"
    },
    {
      "bookId": "1739",
      "title": "帰りなん、いざ 上",
      "author": "志水辰夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-01"
    },
    {
      "bookId": "1740",
      "title": "音楽を愛する人に 下",
      "author": "芥川也寸志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-02"
    },
    {
      "bookId": "1741",
      "title": "音楽を愛する人に 上",
      "author": "芥川也寸志",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-03"
    },
    {
      "bookId": "1742",
      "title": "お伽草紙 下",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-04"
    },
    {
      "bookId": "1743",
      "title": "お伽草紙 上",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-05"
    },
    {
      "bookId": "1744",
      "title": "明日泥棒 下",
      "author": "小松左京",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-06"
    },
    {
      "bookId": "1745",
      "title": "明日泥棒 上",
      "author": "小松左京",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-07"
    },
    {
      "bookId": "1746",
      "title": "お伽草紙",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-08"
    },
    {
      "bookId": "1747",
      "title": "ポピュラー時代小説 15",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-09"
    },
    {
      "bookId": "1748",
      "title": "ポピュラー時代小説 14",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-10"
    },
    {
      "bookId": "1749",
      "title": "ポピュラー時代小説 13",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-11"
    },
    {
      "bookId": "1750",
      "title": "ポピュラー時代小説 12",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-12"
    },
    {
      "bookId": "1751",
      "title": "ポピュラー時代小説 10",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-13"
    },
    {
      "bookId": "1752",
      "title": "ポピュラー時代小説 9",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-14"
    },
    {
      "bookId": "1753",
      "title": "ポピュラー時代小説 8",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-15"
    },
    {
      "bookId": "1754",
      "title": "ポピュラー時代小説 7",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-16"
    },
    {
      "bookId": "1755",
      "title": "ポピュラー時代小説 6",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-17"
    },
    {
      "bookId": "1756",
      "title": "ポピュラー時代小説 5",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-18"
    },
    {
      "bookId": "1757",
      "title": "ポピュラー時代小説 4",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-19"
    },
    {
      "bookId": "1758",
      "title": "ポピュラー時代小説 3",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-20"
    },
    {
      "bookId": "1759",
      "title": "ポピュラー時代小説 2",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-21"
    },
    {
      "bookId": "1760",
      "title": "ポピュラー時代小説 1",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-22"
    },
    {
      "bookId": "1761",
      "title": "読書権ってなあに 下",
      "author": "市橋正晴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-23"
    },
    {
      "bookId": "1762",
      "title": "読書権ってなあに 上",
      "author": "市橋正晴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-24"
    },
    {
      "bookId": "1763",
      "title": "富岳百景/走れメロス/ヴィヨンの妻/家庭の幸福/グッド・バイ",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-25"
    },
    {
      "bookId": "1764",
      "title": "あなたにもできる拡大写本入門",
      "author": "山内薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-26"
    },
    {
      "bookId": "1765",
      "title": "わが落語鑑賞 下",
      "author": "安藤鶴夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-27"
    },
    {
      "bookId": "1766",
      "title": "わが落語鑑賞 中",
      "author": "安藤鶴夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-28"
    },
    {
      "bookId": "1767",
      "title": "わが落語鑑賞 上",
      "author": "安藤鶴夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-29"
    },
    {
      "bookId": "1768",
      "title": "酔って候 下",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-30"
    },
    {
      "bookId": "1769",
      "title": "酔って候 上",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-31"
    },
    {
      "bookId": "1770",
      "title": "矢一筋 下",
      "author": "山手樹一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-01"
    },
    {
      "bookId": "1771",
      "title": "矢一筋 上",
      "author": "山手樹一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-02"
    },
    {
      "bookId": "1772",
      "title": "曲り角 下",
      "author": "神吉拓郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-03"
    },
    {
      "bookId": "1773",
      "title": "曲り角 上",
      "author": "神吉拓郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-04"
    },
    {
      "bookId": "1774",
      "title": "分身 下",
      "author": "東野圭吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-05"
    },
    {
      "bookId": "1775",
      "title": "分身 中",
      "author": "東野圭吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-06"
    },
    {
      "bookId": "1776",
      "title": "分身 上",
      "author": "東野圭吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-07"
    },
    {
      "bookId": "1777",
      "title": "一房の葡萄",
      "author": "有島武郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-08"
    },
    {
      "bookId": "1778",
      "title": "巴里の空はあかね雲 下",
      "author": "岸惠子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-09"
    },
    {
      "bookId": "1779",
      "title": "巴里の空はあかね雲 上",
      "author": "岸惠子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-10"
    },
    {
      "bookId": "1780",
      "title": "野 下",
      "author": "三浦哲郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-11"
    },
    {
      "bookId": "1781",
      "title": "野 上",
      "author": "三浦哲郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-12"
    },
    {
      "bookId": "1782",
      "title": "虹いくたび 下",
      "author": "川端康成",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-13"
    },
    {
      "bookId": "1783",
      "title": "虹いくたび 上",
      "author": "川端康成",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-14"
    },
    {
      "bookId": "1784",
      "title": "竹ノ御所鞠子",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-15"
    },
    {
      "bookId": "1785",
      "title": "生物の世界",
      "author": "今西錦司",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-16"
    },
    {
      "bookId": "1786",
      "title": "恋文",
      "author": "連城三紀彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-17"
    },
    {
      "bookId": "1787",
      "title": "かまいたち 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-18"
    },
    {
      "bookId": "1788",
      "title": "かまいたち 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-19"
    },
    {
      "bookId": "1789",
      "title": "運命",
      "author": "藤原てい",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-20"
    },
    {
      "bookId": "1790",
      "title": "おかあさん疲れたよ 4",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-21"
    },
    {
      "bookId": "1791",
      "title": "おかあさん疲れたよ 3",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-22"
    },
    {
      "bookId": "1792",
      "title": "おかあさん疲れたよ 2",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-23"
    },
    {
      "bookId": "1793",
      "title": "おかあさん疲れたよ 1",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-24"
    },
    {
      "bookId": "1794",
      "title": "岳物語 1",
      "author": "椎名誠",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-25"
    },
    {
      "bookId": "1795",
      "title": "人間失格",
      "author": "太宰治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-26"
    },
    {
      "bookId": "1796",
      "title": "鬼平犯科帳 1",
      "author": "池波正太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-27"
    },
    {
      "bookId": "1797",
      "title": "大きな活字の新明解四字熟語辞典",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-28"
    },
    {
      "bookId": "1798",
      "title": "花豆の煮えるまで",
      "author": "安房直子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-29"
    },
    {
      "bookId": "1799",
      "title": "花影の花 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-30"
    },
    {
      "bookId": "1800",
      "title": "花影の花 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-01"
    },
    {
      "bookId": "1801",
      "title": "夢判断 下",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-02"
    },
    {
      "bookId": "1802",
      "title": "夢判断 上",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-03"
    },
    {
      "bookId": "1803",
      "title": "夢の始末書 下",
      "author": "村松友視",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-04"
    },
    {
      "bookId": "1804",
      "title": "夢の始末書 上",
      "author": "村松友視",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-05"
    },
    {
      "bookId": "1805",
      "title": "百舌の叫ぶ夜 下",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-06"
    },
    {
      "bookId": "1806",
      "title": "百舌の叫ぶ夜 上",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-07"
    },
    {
      "bookId": "1807",
      "title": "武家女夫録",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-08"
    },
    {
      "bookId": "1808",
      "title": "人びとの岸辺 下",
      "author": "内海隆一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-09"
    },
    {
      "bookId": "1809",
      "title": "人びとの岸辺 上",
      "author": "内海隆一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-10"
    },
    {
      "bookId": "1810",
      "title": "トム・ソーヤーの冒険 下巻",
      "author": "マーク・トウェイン",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-11"
    },
    {
      "bookId": "1811",
      "title": "トム・ソーヤーの冒険 中巻",
      "author": "マーク・トウェイン",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-12"
    },
    {
      "bookId": "1812",
      "title": "トム・ソーヤーの冒険 上巻",
      "author": "マーク・トウェイン",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-13"
    },
    {
      "bookId": "1813",
      "title": "天山を越えて 下",
      "author": "胡桃沢耕史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-14"
    },
    {
      "bookId": "1814",
      "title": "天山を越えて 上",
      "author": "胡桃沢耕史",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-15"
    },
    {
      "bookId": "1815",
      "title": "寺町三丁目十一番地 下巻",
      "author": "渡辺茂男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-16"
    },
    {
      "bookId": "1816",
      "title": "寺町三丁目十一番地 上巻",
      "author": "渡辺茂男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-17"
    },
    {
      "bookId": "1817",
      "title": "三年坂",
      "author": "伊集院静",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-18"
    },
    {
      "bookId": "1818",
      "title": "きのね 4",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-19"
    },
    {
      "bookId": "1819",
      "title": "きのね 3",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-20"
    },
    {
      "bookId": "1820",
      "title": "きのね 2",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-21"
    },
    {
      "bookId": "1821",
      "title": "きのね 1",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-22"
    },
    {
      "bookId": "1822",
      "title": "碑・テニヤンの末日 下",
      "author": "中山義秀",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-23"
    },
    {
      "bookId": "1823",
      "title": "碑・テニヤンの末日 上",
      "author": "中山義秀",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-24"
    },
    {
      "bookId": "1824",
      "title": "アトラス伝説 下",
      "author": "井出孫六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-25"
    },
    {
      "bookId": "1825",
      "title": "アトラス伝説 上",
      "author": "井出孫六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-26"
    },
    {
      "bookId": "1826",
      "title": "鉄道員(ぽっぽや)*ラブ・レター",
      "author": "浅田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-27"
    },
    {
      "bookId": "1827",
      "title": "心にふるさとがある 18",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-28"
    },
    {
      "bookId": "1828",
      "title": "心にふるさとがある 17",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-29"
    },
    {
      "bookId": "1829",
      "title": "心にふるさとがある 16",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-30"
    },
    {
      "bookId": "1830",
      "title": "心にふるさとがある 15",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-31"
    },
    {
      "bookId": "1831",
      "title": "心にふるさとがある 14",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-01"
    },
    {
      "bookId": "1832",
      "title": "心にふるさとがある 13",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-02"
    },
    {
      "bookId": "1833",
      "title": "心にふるさとがある 12",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-03"
    },
    {
      "bookId": "1834",
      "title": "心にふるさとがある 11",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-04"
    },
    {
      "bookId": "1835",
      "title": "心にふるさとがある 10",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-05"
    },
    {
      "bookId": "1836",
      "title": "心にふるさとがある 9",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-06"
    },
    {
      "bookId": "1837",
      "title": "心にふるさとがある 8",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-07"
    },
    {
      "bookId": "1838",
      "title": "心にふるさとがある 6",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-08"
    },
    {
      "bookId": "1839",
      "title": "心にふるさとがある 5",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-09"
    },
    {
      "bookId": "1840",
      "title": "心にふるさとがある 4",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-10"
    },
    {
      "bookId": "1841",
      "title": "心にふるさとがある 3",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-11"
    },
    {
      "bookId": "1842",
      "title": "心にふるさとがある 2",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-12"
    },
    {
      "bookId": "1843",
      "title": "心にふるさとがある 1",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-13"
    },
    {
      "bookId": "1844",
      "title": "視覚障害者のためのパソコン講座",
      "author": "円山光正",
      "category": "情報科学",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-14"
    },
    {
      "bookId": "1845",
      "title": "もだんミステリーワールド 15",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-15"
    },
    {
      "bookId": "1846",
      "title": "もだんミステリーワールド 14",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-16"
    },
    {
      "bookId": "1847",
      "title": "もだんミステリーワールド 13",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-17"
    },
    {
      "bookId": "1848",
      "title": "もだんミステリーワールド 12",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-18"
    },
    {
      "bookId": "1849",
      "title": "もだんミステリーワールド 11",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-19"
    },
    {
      "bookId": "1850",
      "title": "もだんミステリーワールド 10",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-20"
    },
    {
      "bookId": "1851",
      "title": "もだんミステリーワールド 9",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-21"
    },
    {
      "bookId": "1852",
      "title": "もだんミステリーワールド 8",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-22"
    },
    {
      "bookId": "1853",
      "title": "もだんミステリーワールド 7",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-23"
    },
    {
      "bookId": "1854",
      "title": "もだんミステリーワールド 6",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-24"
    },
    {
      "bookId": "1855",
      "title": "もだんミステリーワールド 5",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-25"
    },
    {
      "bookId": "1856",
      "title": "もだんミステリーワールド 4",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-26"
    },
    {
      "bookId": "1857",
      "title": "もだんミステリーワールド 3",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-27"
    },
    {
      "bookId": "1858",
      "title": "もだんミステリーワールド 2",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-28"
    },
    {
      "bookId": "1859",
      "title": "もだんミステリーワールド 1",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-29"
    },
    {
      "bookId": "1860",
      "title": "くらしっく時代小説 14",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-30"
    },
    {
      "bookId": "1861",
      "title": "くらしっく時代小説 13",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-01"
    },
    {
      "bookId": "1862",
      "title": "くらしっく時代小説 12",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-02"
    },
    {
      "bookId": "1863",
      "title": "くらしっく時代小説 11",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-03"
    },
    {
      "bookId": "1864",
      "title": "くらしっく時代小説 10",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-04"
    },
    {
      "bookId": "1865",
      "title": "くらしっく時代小説 9",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-05"
    },
    {
      "bookId": "1866",
      "title": "くらしっく時代小説 8",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-06"
    },
    {
      "bookId": "1867",
      "title": "くらしっく時代小説 7",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-07"
    },
    {
      "bookId": "1868",
      "title": "くらしっく時代小説 6",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-08"
    },
    {
      "bookId": "1869",
      "title": "くらしっく時代小説 5",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-09"
    },
    {
      "bookId": "1870",
      "title": "くらしっく時代小説 4",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-10"
    },
    {
      "bookId": "1871",
      "title": "くらしっく時代小説 3",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-11"
    },
    {
      "bookId": "1872",
      "title": "くらしっく時代小説 2",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-12"
    },
    {
      "bookId": "1873",
      "title": "くらしっく時代小説 1",
      "author": "尾崎秀樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-13"
    },
    {
      "bookId": "1874",
      "title": "生きる心の糧 13",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-14"
    },
    {
      "bookId": "1875",
      "title": "生きる心の糧 12",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-15"
    },
    {
      "bookId": "1876",
      "title": "生きる心の糧 11",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-16"
    },
    {
      "bookId": "1877",
      "title": "生きる心の糧 10",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-17"
    },
    {
      "bookId": "1878",
      "title": "生きる心の糧 9",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-18"
    },
    {
      "bookId": "1879",
      "title": "生きる心の糧 8",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-19"
    },
    {
      "bookId": "1880",
      "title": "生きる心の糧 7",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-20"
    },
    {
      "bookId": "1881",
      "title": "生きる心の糧 6",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-21"
    },
    {
      "bookId": "1882",
      "title": "生きる心の糧 5",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-22"
    },
    {
      "bookId": "1883",
      "title": "生きる心の糧 4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-23"
    },
    {
      "bookId": "1884",
      "title": "生きる心の糧 3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-24"
    },
    {
      "bookId": "1885",
      "title": "生きる心の糧 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-25"
    },
    {
      "bookId": "1886",
      "title": "生きる心の糧 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-26"
    },
    {
      "bookId": "1887",
      "title": "著名人が語る<考えるヒント> 16",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-27"
    },
    {
      "bookId": "1888",
      "title": "著名人が語る<考えるヒント> 15",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-28"
    },
    {
      "bookId": "1889",
      "title": "著名人が語る<考えるヒント> 14",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-29"
    },
    {
      "bookId": "1890",
      "title": "著名人が語る<考えるヒント> 13",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-30"
    },
    {
      "bookId": "1891",
      "title": "著名人が語る<考えるヒント> 12",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-31"
    },
    {
      "bookId": "1892",
      "title": "著名人が語る<考えるヒント> 11",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-01"
    },
    {
      "bookId": "1893",
      "title": "著名人が語る<考えるヒント> 9",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-02"
    },
    {
      "bookId": "1894",
      "title": "著名人が語る<考えるヒント> 8",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-03"
    },
    {
      "bookId": "1895",
      "title": "著名人が語る<考えるヒント> 7",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-04"
    },
    {
      "bookId": "1896",
      "title": "著名人が語る<考えるヒント> 6",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-05"
    },
    {
      "bookId": "1897",
      "title": "著名人が語る<考えるヒント> 5",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-06"
    },
    {
      "bookId": "1898",
      "title": "著名人が語る<考えるヒント> 4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-07"
    },
    {
      "bookId": "1899",
      "title": "著名人が語る<考えるヒント> 3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-08"
    },
    {
      "bookId": "1900",
      "title": "著名人が語る<考えるヒント> 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-09"
    },
    {
      "bookId": "1901",
      "title": "著名人が語る<考えるヒント> 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-10"
    },
    {
      "bookId": "1902",
      "title": "鹿鳴館の系譜 下",
      "author": "磯田光一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-11"
    },
    {
      "bookId": "1903",
      "title": "鹿鳴館の系譜 上",
      "author": "磯田光一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-12"
    },
    {
      "bookId": "1904",
      "title": "乱世玉響 下",
      "author": "皆川博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-13"
    },
    {
      "bookId": "1905",
      "title": "乱世玉響 上",
      "author": "皆川博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-14"
    },
    {
      "bookId": "1906",
      "title": "茂吉の周辺 下",
      "author": "斎藤茂太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-15"
    },
    {
      "bookId": "1907",
      "title": "茂吉の周辺 上",
      "author": "斎藤茂太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-16"
    },
    {
      "bookId": "1908",
      "title": "ミッシェルの口紅",
      "author": "林京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-17"
    },
    {
      "bookId": "1909",
      "title": "まんがら茂平次 下",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-18"
    },
    {
      "bookId": "1910",
      "title": "まんがら茂平次 上",
      "author": "北原亜以子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-19"
    },
    {
      "bookId": "1911",
      "title": "氷壁 下",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-20"
    },
    {
      "bookId": "1912",
      "title": "氷壁 中",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-21"
    },
    {
      "bookId": "1913",
      "title": "氷壁 上",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-22"
    },
    {
      "bookId": "1914",
      "title": "遠いアメリカ",
      "author": "常盤新平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-23"
    },
    {
      "bookId": "1915",
      "title": "高杉晋作 4",
      "author": "古川薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-24"
    },
    {
      "bookId": "1916",
      "title": "高杉晋作 3",
      "author": "古川薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-25"
    },
    {
      "bookId": "1917",
      "title": "高杉晋作 2",
      "author": "古川薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-26"
    },
    {
      "bookId": "1918",
      "title": "高杉晋作 1",
      "author": "古川薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-27"
    },
    {
      "bookId": "1919",
      "title": "十年目の訪問 下",
      "author": "秋山ちえ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-28"
    },
    {
      "bookId": "1920",
      "title": "十年目の訪問 上",
      "author": "秋山ちえ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-29"
    },
    {
      "bookId": "1921",
      "title": "侏儒の言葉",
      "author": "芥川竜之介",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-30"
    },
    {
      "bookId": "1922",
      "title": "軍師竹中半兵衛 下",
      "author": "笹沢左保",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-31"
    },
    {
      "bookId": "1923",
      "title": "軍師竹中半兵衛 中",
      "author": "笹沢左保",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-01"
    },
    {
      "bookId": "1924",
      "title": "軍師竹中半兵衛 上",
      "author": "笹沢左保",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-02"
    },
    {
      "bookId": "1925",
      "title": "運転士",
      "author": "藤原智美",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-03"
    },
    {
      "bookId": "1926",
      "title": "阿寒に果つ 下",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-04"
    },
    {
      "bookId": "1927",
      "title": "阿寒に果つ 上",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-05"
    },
    {
      "bookId": "1928",
      "title": "わかっているようでわからない手紙の書き方",
      "author": "輪辻潔",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-06"
    },
    {
      "bookId": "1929",
      "title": "ポピュラーミステリーワールド 13",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-07"
    },
    {
      "bookId": "1930",
      "title": "ポピュラーミステリーワールド 12",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-08"
    },
    {
      "bookId": "1931",
      "title": "ポピュラーミステリーワールド 11",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-09"
    },
    {
      "bookId": "1932",
      "title": "ポピュラーミステリーワールド 10",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-10"
    },
    {
      "bookId": "1933",
      "title": "ポピュラーミステリーワールド 9",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-11"
    },
    {
      "bookId": "1934",
      "title": "ポピュラーミステリーワールド 7",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-12"
    },
    {
      "bookId": "1935",
      "title": "ポピュラーミステリーワールド 6",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-13"
    },
    {
      "bookId": "1936",
      "title": "ポピュラーミステリーワールド 4",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-14"
    },
    {
      "bookId": "1937",
      "title": "ポピュラーミステリーワールド 3",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-15"
    },
    {
      "bookId": "1938",
      "title": "大きな活字の漢字表記辞典",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-16"
    },
    {
      "bookId": "1939",
      "title": "本所深川ふしぎ草紙 下",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-17"
    },
    {
      "bookId": "1940",
      "title": "本所深川ふしぎ草紙 上",
      "author": "宮部みゆき",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-18"
    },
    {
      "bookId": "1941",
      "title": "ひつじが丘 下",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-19"
    },
    {
      "bookId": "1942",
      "title": "ひつじが丘 上",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-20"
    },
    {
      "bookId": "1943",
      "title": "陽のかなしみ 下",
      "author": "石牟礼道子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-21"
    },
    {
      "bookId": "1944",
      "title": "陽のかなしみ 中",
      "author": "石牟礼道子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-22"
    },
    {
      "bookId": "1945",
      "title": "陽のかなしみ 上",
      "author": "石牟礼道子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-23"
    },
    {
      "bookId": "1946",
      "title": "定本おかしな侍たち 4",
      "author": "神坂次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-24"
    },
    {
      "bookId": "1947",
      "title": "定本おかしな侍たち 3",
      "author": "神坂次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-25"
    },
    {
      "bookId": "1948",
      "title": "定本おかしな侍たち 2",
      "author": "神坂次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-26"
    },
    {
      "bookId": "1949",
      "title": "定本おかしな侍たち 1",
      "author": "神坂次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-27"
    },
    {
      "bookId": "1950",
      "title": "津軽の野づら 下",
      "author": "深田久弥",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-28"
    },
    {
      "bookId": "1951",
      "title": "津軽の野づら 上",
      "author": "深田久弥",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-29"
    },
    {
      "bookId": "1952",
      "title": "生のなかば 下",
      "author": "中野孝次",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-30"
    },
    {
      "bookId": "1953",
      "title": "生のなかば 上",
      "author": "中野孝次",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-01"
    },
    {
      "bookId": "1954",
      "title": "小説兜町(しま) 下",
      "author": "清水一行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-02"
    },
    {
      "bookId": "1955",
      "title": "小説兜町(しま) 上",
      "author": "清水一行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-03"
    },
    {
      "bookId": "1956",
      "title": "砂丘が動くように 下",
      "author": "日野啓三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-04"
    },
    {
      "bookId": "1957",
      "title": "砂丘が動くように 上",
      "author": "日野啓三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-05"
    },
    {
      "bookId": "1958",
      "title": "近代秀歌 下",
      "author": "木俣修",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-06"
    },
    {
      "bookId": "1959",
      "title": "近代秀歌 上",
      "author": "木俣修",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-07"
    },
    {
      "bookId": "1960",
      "title": "魚味礼讃",
      "author": "関谷文吉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-08"
    },
    {
      "bookId": "1961",
      "title": "女の学校",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-09"
    },
    {
      "bookId": "1962",
      "title": "おかめ笹",
      "author": "永井荷風",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-10"
    },
    {
      "bookId": "1963",
      "title": "居酒屋ゆうれい",
      "author": "山本昌代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-11"
    },
    {
      "bookId": "1964",
      "title": "家路の果て 下",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-12"
    },
    {
      "bookId": "1965",
      "title": "家路の果て 上",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-13"
    },
    {
      "bookId": "1966",
      "title": "はじめての仲人・媒酌人",
      "author": "織田麗子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-14"
    },
    {
      "bookId": "1967",
      "title": "絵のない絵本",
      "author": "H.C.アンデルセン",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-15"
    },
    {
      "bookId": "1968",
      "title": "大震災サバイバル・マニュアル 下",
      "author": "朝日新聞社",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-16"
    },
    {
      "bookId": "1969",
      "title": "大震災サバイバル・マニュアル 上",
      "author": "朝日新聞社",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-17"
    },
    {
      "bookId": "1970",
      "title": "新子流川柳入門 下",
      "author": "時実新子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-18"
    },
    {
      "bookId": "1971",
      "title": "新子流川柳入門 上",
      "author": "時実新子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-19"
    },
    {
      "bookId": "1972",
      "title": "著名人が語る<生きるヒント> 16",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-20"
    },
    {
      "bookId": "1973",
      "title": "著名人が語る<生きるヒント> 15",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-21"
    },
    {
      "bookId": "1974",
      "title": "著名人が語る<生きるヒント> 14",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-22"
    },
    {
      "bookId": "1975",
      "title": "著名人が語る<生きるヒント> 13",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-23"
    },
    {
      "bookId": "1976",
      "title": "著名人が語る<生きるヒント> 12",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-24"
    },
    {
      "bookId": "1977",
      "title": "著名人が語る<生きるヒント> 11",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-25"
    },
    {
      "bookId": "1978",
      "title": "著名人が語る<生きるヒント> 10",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-26"
    },
    {
      "bookId": "1979",
      "title": "著名人が語る<生きるヒント> 8",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-27"
    },
    {
      "bookId": "1980",
      "title": "著名人が語る<生きるヒント> 7",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-28"
    },
    {
      "bookId": "1981",
      "title": "著名人が語る<生きるヒント> 6",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-29"
    },
    {
      "bookId": "1982",
      "title": "著名人が語る<生きるヒント> 4",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-30"
    },
    {
      "bookId": "1983",
      "title": "著名人が語る<生きるヒント> 3",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-31"
    },
    {
      "bookId": "1984",
      "title": "著名人が語る<生きるヒント> 2",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-01"
    },
    {
      "bookId": "1985",
      "title": "著名人が語る<生きるヒント> 1",
      "author": "",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-02"
    },
    {
      "bookId": "1986",
      "title": "結婚式のスピーチ",
      "author": "清水良太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-03"
    },
    {
      "bookId": "1987",
      "title": "くらしっくミステリーワールド 15",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-04"
    },
    {
      "bookId": "1988",
      "title": "くらしっくミステリーワールド 14",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-05"
    },
    {
      "bookId": "1989",
      "title": "くらしっくミステリーワールド 13",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-06"
    },
    {
      "bookId": "1990",
      "title": "くらしっくミステリーワールド 12",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-07"
    },
    {
      "bookId": "1991",
      "title": "くらしっくミステリーワールド 11",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-08"
    },
    {
      "bookId": "1992",
      "title": "くらしっくミステリーワールド 10",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-09"
    },
    {
      "bookId": "1993",
      "title": "くらしっくミステリーワールド 9",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-10"
    },
    {
      "bookId": "1994",
      "title": "くらしっくミステリーワールド 8",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-11"
    },
    {
      "bookId": "1995",
      "title": "くらしっくミステリーワールド 7",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-12"
    },
    {
      "bookId": "1996",
      "title": "くらしっくミステリーワールド 6",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-13"
    },
    {
      "bookId": "1997",
      "title": "くらしっくミステリーワールド 5",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-14"
    },
    {
      "bookId": "1998",
      "title": "くらしっくミステリーワールド 4",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-15"
    },
    {
      "bookId": "1999",
      "title": "くらしっくミステリーワールド 3",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-16"
    },
    {
      "bookId": "2000",
      "title": "くらしっくミステリーワールド 2",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-17"
    },
    {
      "bookId": "2001",
      "title": "くらしっくミステリーワールド 1",
      "author": "中島河太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-18"
    },
    {
      "bookId": "2002",
      "title": "母の台所娘のキッチン 下",
      "author": "藤原房子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-19"
    },
    {
      "bookId": "2003",
      "title": "母の台所娘のキッチン 上",
      "author": "藤原房子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-20"
    },
    {
      "bookId": "2004",
      "title": "私のなかの東京",
      "author": "野口富士男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-21"
    },
    {
      "bookId": "2005",
      "title": "文車日記 下",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-22"
    },
    {
      "bookId": "2006",
      "title": "文車日記 上",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-23"
    },
    {
      "bookId": "2007",
      "title": "動物という文化",
      "author": "日高敏隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-24"
    },
    {
      "bookId": "2008",
      "title": "天皇の座布団 下",
      "author": "難波利三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-25"
    },
    {
      "bookId": "2009",
      "title": "天皇の座布団 上",
      "author": "難波利三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-26"
    },
    {
      "bookId": "2010",
      "title": "戦争はなかった 下",
      "author": "小松左京",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-27"
    },
    {
      "bookId": "2011",
      "title": "戦争はなかった 上",
      "author": "小松左京",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-28"
    },
    {
      "bookId": "2012",
      "title": "末っ子物語",
      "author": "尾崎一雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-29"
    },
    {
      "bookId": "2013",
      "title": "暗い流れ 下",
      "author": "和田芳恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-30"
    },
    {
      "bookId": "2014",
      "title": "暗い流れ 上",
      "author": "和田芳恵",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-01"
    },
    {
      "bookId": "2015",
      "title": "雁金屋草紙 下",
      "author": "鳥越碧",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-02"
    },
    {
      "bookId": "2016",
      "title": "雁金屋草紙 上",
      "author": "鳥越碧",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-03"
    },
    {
      "bookId": "2017",
      "title": "女の人差し指 下",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-04"
    },
    {
      "bookId": "2018",
      "title": "女の人差し指 上",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-05"
    },
    {
      "bookId": "2019",
      "title": "一匹や二匹 下",
      "author": "仁木悦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-06"
    },
    {
      "bookId": "2020",
      "title": "一匹や二匹 上",
      "author": "仁木悦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-07"
    },
    {
      "bookId": "2021",
      "title": "若き日の山",
      "author": "串田孫一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-08"
    },
    {
      "bookId": "2022",
      "title": "俳句とあそぶ法 下",
      "author": "江国滋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-09"
    },
    {
      "bookId": "2023",
      "title": "俳句とあそぶ法 上",
      "author": "江国滋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-10"
    },
    {
      "bookId": "2024",
      "title": "北京飯店旧館にて 下",
      "author": "中薗英助",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-11"
    },
    {
      "bookId": "2025",
      "title": "北京飯店旧館にて 上",
      "author": "中薗英助",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-12"
    },
    {
      "bookId": "2026",
      "title": "道鏡",
      "author": "坂口安吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-13"
    },
    {
      "bookId": "2027",
      "title": "韃靼疾風録 5",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-14"
    },
    {
      "bookId": "2028",
      "title": "韃靼疾風録 4",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-15"
    },
    {
      "bookId": "2029",
      "title": "韃靼疾風録 3",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-16"
    },
    {
      "bookId": "2030",
      "title": "韃靼疾風録 2",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-17"
    },
    {
      "bookId": "2031",
      "title": "韃靼疾風録 1",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-18"
    },
    {
      "bookId": "2032",
      "title": "たった一人の反乱 下",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-19"
    },
    {
      "bookId": "2033",
      "title": "たった一人の反乱 中",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-20"
    },
    {
      "bookId": "2034",
      "title": "たった一人の反乱 上",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-21"
    },
    {
      "bookId": "2035",
      "title": "小説新子 下",
      "author": "時実新子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-22"
    },
    {
      "bookId": "2036",
      "title": "小説新子 上",
      "author": "時実新子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-23"
    },
    {
      "bookId": "2037",
      "title": "質屋の女房 下",
      "author": "安岡章太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-24"
    },
    {
      "bookId": "2038",
      "title": "質屋の女房 上",
      "author": "安岡章太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-25"
    },
    {
      "bookId": "2039",
      "title": "狂人遺書",
      "author": "坂口安吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-26"
    },
    {
      "bookId": "2040",
      "title": "海の星座 下",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-27"
    },
    {
      "bookId": "2041",
      "title": "海の星座 上",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-28"
    },
    {
      "bookId": "2042",
      "title": "江戸雑記帳 下",
      "author": "村上元三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-29"
    },
    {
      "bookId": "2043",
      "title": "江戸雑記帳 上",
      "author": "村上元三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-30"
    },
    {
      "bookId": "2044",
      "title": "視覚障害被災者とボランティア",
      "author": "阪神大震災視覚障害被災者支援対策本部",
      "category": "福祉",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-31"
    },
    {
      "bookId": "2045",
      "title": "注文の多い料理店",
      "author": "宮沢賢治",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-01"
    },
    {
      "bookId": "2046",
      "title": "子供は地球のヒーローだ",
      "author": "ジョン・ギャスライト",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-02"
    },
    {
      "bookId": "2047",
      "title": "大往生",
      "author": "永六輔",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-03"
    },
    {
      "bookId": "2048",
      "title": "ギリシア神話を知っていますか 下",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-04"
    },
    {
      "bookId": "2049",
      "title": "ギリシア神話を知っていますか 上",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-05"
    },
    {
      "bookId": "2050",
      "title": "若き日の摂津守",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-06"
    },
    {
      "bookId": "2051",
      "title": "祭りの場",
      "author": "林京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-07"
    },
    {
      "bookId": "2052",
      "title": "ヒョコタンの山羊 下巻",
      "author": "長崎源之助",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-08"
    },
    {
      "bookId": "2053",
      "title": "ヒョコタンの山羊 上巻",
      "author": "長崎源之助",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-09"
    },
    {
      "bookId": "2054",
      "title": "日日平安",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-10"
    },
    {
      "bookId": "2055",
      "title": "津田梅子 下",
      "author": "大庭みな子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-11"
    },
    {
      "bookId": "2056",
      "title": "津田梅子 上",
      "author": "大庭みな子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-12"
    },
    {
      "bookId": "2057",
      "title": "鳥獣の寺 下",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-13"
    },
    {
      "bookId": "2058",
      "title": "鳥獣の寺 上",
      "author": "山村美紗",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-14"
    },
    {
      "bookId": "2059",
      "title": "壇の浦残花抄",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-15"
    },
    {
      "bookId": "2060",
      "title": "聖ヨハネ病院にて 下",
      "author": "上林暁",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-16"
    },
    {
      "bookId": "2061",
      "title": "聖ヨハネ病院にて 上",
      "author": "上林暁",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-17"
    },
    {
      "bookId": "2062",
      "title": "砂の妖精 下巻",
      "author": "E・ネズビット",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-18"
    },
    {
      "bookId": "2063",
      "title": "砂の妖精 中巻",
      "author": "E・ネズビット",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-19"
    },
    {
      "bookId": "2064",
      "title": "砂の妖精 上巻",
      "author": "E・ネズビット",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-20"
    },
    {
      "bookId": "2065",
      "title": "辛酸",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-21"
    },
    {
      "bookId": "2066",
      "title": "朱夏 4",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-22"
    },
    {
      "bookId": "2067",
      "title": "朱夏 3",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-23"
    },
    {
      "bookId": "2068",
      "title": "朱夏 2",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-24"
    },
    {
      "bookId": "2069",
      "title": "朱夏 1",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-25"
    },
    {
      "bookId": "2070",
      "title": "愁月記",
      "author": "三浦哲郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-26"
    },
    {
      "bookId": "2071",
      "title": "市塵 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-27"
    },
    {
      "bookId": "2072",
      "title": "市塵 中",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-28"
    },
    {
      "bookId": "2073",
      "title": "市塵 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-29"
    },
    {
      "bookId": "2074",
      "title": "鯉のいる村",
      "author": "岩崎京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-30"
    },
    {
      "bookId": "2075",
      "title": "欅通りの人びと 下",
      "author": "内海隆一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-01-31"
    },
    {
      "bookId": "2076",
      "title": "欅通りの人びと 上",
      "author": "内海隆一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-01"
    },
    {
      "bookId": "2077",
      "title": "ギヤマン ビードロ",
      "author": "林京子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-02"
    },
    {
      "bookId": "2078",
      "title": "生きるってすばらしい 19",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-03"
    },
    {
      "bookId": "2079",
      "title": "生きるってすばらしい 18",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-04"
    },
    {
      "bookId": "2080",
      "title": "生きるってすばらしい 17",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-05"
    },
    {
      "bookId": "2081",
      "title": "生きるってすばらしい 16",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-06"
    },
    {
      "bookId": "2082",
      "title": "生きるってすばらしい 15",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-07"
    },
    {
      "bookId": "2083",
      "title": "生きるってすばらしい 14",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-08"
    },
    {
      "bookId": "2084",
      "title": "生きるってすばらしい 13",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-09"
    },
    {
      "bookId": "2085",
      "title": "生きるってすばらしい 12",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-10"
    },
    {
      "bookId": "2086",
      "title": "生きるってすばらしい 11",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-11"
    },
    {
      "bookId": "2087",
      "title": "生きるってすばらしい 10",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-12"
    },
    {
      "bookId": "2088",
      "title": "生きるってすばらしい 9",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-13"
    },
    {
      "bookId": "2089",
      "title": "生きるってすばらしい 8",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-14"
    },
    {
      "bookId": "2090",
      "title": "生きるってすばらしい 7",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-15"
    },
    {
      "bookId": "2091",
      "title": "生きるってすばらしい 6",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-16"
    },
    {
      "bookId": "2092",
      "title": "生きるってすばらしい 5",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-17"
    },
    {
      "bookId": "2093",
      "title": "生きるってすばらしい 4",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-18"
    },
    {
      "bookId": "2094",
      "title": "生きるってすばらしい 3",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-19"
    },
    {
      "bookId": "2095",
      "title": "生きるってすばらしい 2",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-20"
    },
    {
      "bookId": "2096",
      "title": "生きるってすばらしい 1",
      "author": "作品社編集部集",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-21"
    },
    {
      "bookId": "2097",
      "title": "花も実もある話",
      "author": "西川勢津子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-22"
    },
    {
      "bookId": "2098",
      "title": "私の歎異抄 下",
      "author": "紀野一義",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-23"
    },
    {
      "bookId": "2099",
      "title": "私の歎異抄 上",
      "author": "紀野一義",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2026-02-24"
    },
    {
      "bookId": "2100",
      "title": "無明の蝶",
      "author": "出久根達郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-01"
    },
    {
      "bookId": "2101",
      "title": "妙高の秋",
      "author": "島村利正",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-02"
    },
    {
      "bookId": "2102",
      "title": "薔薇忌",
      "author": "皆川博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-03"
    },
    {
      "bookId": "2103",
      "title": "バビロンに行きて歌え 下",
      "author": "池沢夏樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-04"
    },
    {
      "bookId": "2104",
      "title": "バビロンに行きて歌え 上",
      "author": "池沢夏樹",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-05"
    },
    {
      "bookId": "2105",
      "title": "二条院ノ讃岐",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-06"
    },
    {
      "bookId": "2106",
      "title": "東京新大橋雨中図 下",
      "author": "杉本章子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-07"
    },
    {
      "bookId": "2107",
      "title": "東京新大橋雨中図 上",
      "author": "杉本章子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-08"
    },
    {
      "bookId": "2108",
      "title": "つゆのあとさき",
      "author": "永井荷風",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-09"
    },
    {
      "bookId": "2109",
      "title": "茶道の歴史 下",
      "author": "桑田忠親",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-10"
    },
    {
      "bookId": "2110",
      "title": "茶道の歴史 上",
      "author": "桑田忠親",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-11"
    },
    {
      "bookId": "2111",
      "title": "虚構の家 下",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-12"
    },
    {
      "bookId": "2112",
      "title": "虚構の家 上",
      "author": "曽野綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-13"
    },
    {
      "bookId": "2113",
      "title": "休日の断崖 下",
      "author": "黒岩重吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-14"
    },
    {
      "bookId": "2114",
      "title": "休日の断崖 上",
      "author": "黒岩重吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-15"
    },
    {
      "bookId": "2115",
      "title": "北の墓標",
      "author": "夏堀正元",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-16"
    },
    {
      "bookId": "2116",
      "title": "カディスの赤い星 4",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-17"
    },
    {
      "bookId": "2117",
      "title": "カディスの赤い星 3",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-18"
    },
    {
      "bookId": "2118",
      "title": "カディスの赤い星 2",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-19"
    },
    {
      "bookId": "2119",
      "title": "カディスの赤い星 1",
      "author": "逢坂剛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-20"
    },
    {
      "bookId": "2120",
      "title": "明日",
      "author": "井上光晴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-21"
    },
    {
      "bookId": "2121",
      "title": "藍の季節 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-22"
    },
    {
      "bookId": "2122",
      "title": "藍の季節 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-23"
    },
    {
      "bookId": "2123",
      "title": "四十八人目の男 下",
      "author": "大仏次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-24"
    },
    {
      "bookId": "2124",
      "title": "四十八人目の男 中",
      "author": "大仏次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-25"
    },
    {
      "bookId": "2125",
      "title": "四十八人目の男 上",
      "author": "大仏次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-26"
    },
    {
      "bookId": "2126",
      "title": "大和古寺風物誌",
      "author": "亀井勝一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-27"
    },
    {
      "bookId": "2127",
      "title": "宮武外骨 下",
      "author": "吉野孝雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-28"
    },
    {
      "bookId": "2128",
      "title": "宮武外骨 上",
      "author": "吉野孝雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-29"
    },
    {
      "bookId": "2129",
      "title": "砲撃のあとで 下",
      "author": "三木卓",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-30"
    },
    {
      "bookId": "2130",
      "title": "砲撃のあとで 上",
      "author": "三木卓",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-01-31"
    },
    {
      "bookId": "2131",
      "title": "ネコババのいる町で 下",
      "author": "滝沢美恵子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-01"
    },
    {
      "bookId": "2132",
      "title": "ネコババのいる町で 上",
      "author": "滝沢美恵子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-02"
    },
    {
      "bookId": "2133",
      "title": "天皇の料理番 下",
      "author": "杉森久英",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-03"
    },
    {
      "bookId": "2134",
      "title": "天皇の料理番 中",
      "author": "杉森久英",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-04"
    },
    {
      "bookId": "2135",
      "title": "天皇の料理番 上",
      "author": "杉森久英",
      "category": "生活",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-05"
    },
    {
      "bookId": "2136",
      "title": "たそがれ清兵衛 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-06"
    },
    {
      "bookId": "2137",
      "title": "たそがれ清兵衛 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-07"
    },
    {
      "bookId": "2138",
      "title": "大陸の細道 下",
      "author": "木山捷平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-08"
    },
    {
      "bookId": "2139",
      "title": "大陸の細道 上",
      "author": "木山捷平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-09"
    },
    {
      "bookId": "2140",
      "title": "戦争まで 下",
      "author": "中村光夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-10"
    },
    {
      "bookId": "2141",
      "title": "戦争まで 上",
      "author": "中村光夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-11"
    },
    {
      "bookId": "2142",
      "title": "山行 下",
      "author": "槇有恒",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-12"
    },
    {
      "bookId": "2143",
      "title": "山行 上",
      "author": "槇有恒",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-13"
    },
    {
      "bookId": "2144",
      "title": "幸福の絵 下",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-14"
    },
    {
      "bookId": "2145",
      "title": "幸福の絵 上",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-15"
    },
    {
      "bookId": "2146",
      "title": "歌舞伎十八番",
      "author": "戸板康二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-16"
    },
    {
      "bookId": "2147",
      "title": "応為坦坦録",
      "author": "山本昌代",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-17"
    },
    {
      "bookId": "2148",
      "title": "アカシヤの大連 下",
      "author": "清岡卓行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-18"
    },
    {
      "bookId": "2149",
      "title": "アカシヤの大連 上",
      "author": "清岡卓行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-19"
    },
    {
      "bookId": "2150",
      "title": "流星雨 下",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-20"
    },
    {
      "bookId": "2151",
      "title": "流星雨 上",
      "author": "津村節子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-21"
    },
    {
      "bookId": "2152",
      "title": "マリコ 下",
      "author": "柳田邦男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-22"
    },
    {
      "bookId": "2153",
      "title": "マリコ 上",
      "author": "柳田邦男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-23"
    },
    {
      "bookId": "2154",
      "title": "に手をかざして",
      "author": "石垣りん",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-24"
    },
    {
      "bookId": "2155",
      "title": "冬の花火 下",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-25"
    },
    {
      "bookId": "2156",
      "title": "冬の花火 上",
      "author": "渡辺淳一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-26"
    },
    {
      "bookId": "2157",
      "title": "漂泊者のアリア 下",
      "author": "古川薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-27"
    },
    {
      "bookId": "2158",
      "title": "漂泊者のアリア 上",
      "author": "古川薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-02-28"
    },
    {
      "bookId": "2159",
      "title": "二重唱(デュエット)",
      "author": "海老沢泰久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-01"
    },
    {
      "bookId": "2160",
      "title": "精神科の待合室",
      "author": "斎藤茂太",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-02"
    },
    {
      "bookId": "2161",
      "title": "古川柳おちぼひろい",
      "author": "田辺聖子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-03"
    },
    {
      "bookId": "2162",
      "title": "群棲 下",
      "author": "黒井千次",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-04"
    },
    {
      "bookId": "2163",
      "title": "群棲 上",
      "author": "黒井千次",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-05"
    },
    {
      "bookId": "2164",
      "title": "がらくた博物館",
      "author": "大庭みな子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-06"
    },
    {
      "bookId": "2165",
      "title": "女の心仕事 下",
      "author": "千代芳子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-07"
    },
    {
      "bookId": "2166",
      "title": "女の心仕事 上",
      "author": "千代芳子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-08"
    },
    {
      "bookId": "2167",
      "title": "裏声で歌へ君が代 下",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-09"
    },
    {
      "bookId": "2168",
      "title": "裏声で歌へ君が代 中",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-10"
    },
    {
      "bookId": "2169",
      "title": "裏声で歌へ君が代 上",
      "author": "丸谷才一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-11"
    },
    {
      "bookId": "2170",
      "title": "お庭番吹雪算長 4",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-12"
    },
    {
      "bookId": "2171",
      "title": "お庭番吹雪算長 3",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-13"
    },
    {
      "bookId": "2172",
      "title": "お庭番吹雪算長 2",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-14"
    },
    {
      "bookId": "2173",
      "title": "お庭番吹雪算長 1",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-15"
    },
    {
      "bookId": "2174",
      "title": "エヌ氏の遊園地 下",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-16"
    },
    {
      "bookId": "2175",
      "title": "エヌ氏の遊園地 上",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-17"
    },
    {
      "bookId": "2176",
      "title": "雨あがりの街 下",
      "author": "常盤新平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-18"
    },
    {
      "bookId": "2177",
      "title": "雨あがりの街 上",
      "author": "常盤新平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-19"
    },
    {
      "bookId": "2178",
      "title": "ひとすじの道 第1部",
      "author": "丸岡秀子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-20"
    },
    {
      "bookId": "2179",
      "title": "はまなす物語 下",
      "author": "三浦哲郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-21"
    },
    {
      "bookId": "2180",
      "title": "はまなす物語 上",
      "author": "三浦哲郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-22"
    },
    {
      "bookId": "2181",
      "title": "四十一番の少年",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-23"
    },
    {
      "bookId": "2182",
      "title": "幼年",
      "author": "大岡昇平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-24"
    },
    {
      "bookId": "2183",
      "title": "望郷 下",
      "author": "新田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-25"
    },
    {
      "bookId": "2184",
      "title": "望郷 上",
      "author": "新田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-26"
    },
    {
      "bookId": "2185",
      "title": "本屋通いのビタミン剤",
      "author": "井狩春男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-27"
    },
    {
      "bookId": "2186",
      "title": "夏の栞",
      "author": "佐多稲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-28"
    },
    {
      "bookId": "2187",
      "title": "天北原野 5",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-29"
    },
    {
      "bookId": "2188",
      "title": "天北原野 4",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-30"
    },
    {
      "bookId": "2189",
      "title": "天北原野 3",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-03-31"
    },
    {
      "bookId": "2190",
      "title": "天北原野 2",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-01"
    },
    {
      "bookId": "2191",
      "title": "天北原野 1",
      "author": "三浦綾子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-02"
    },
    {
      "bookId": "2192",
      "title": "秩父事件の女たち 下",
      "author": "保高みさ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-03"
    },
    {
      "bookId": "2193",
      "title": "秩父事件の女たち 上",
      "author": "保高みさ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-04"
    },
    {
      "bookId": "2194",
      "title": "父・夏目漱石 下",
      "author": "夏目伸六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-05"
    },
    {
      "bookId": "2195",
      "title": "父・夏目漱石 上",
      "author": "夏目伸六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-06"
    },
    {
      "bookId": "2196",
      "title": "袖すりあうも嫁姑",
      "author": "小林千登勢",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-07"
    },
    {
      "bookId": "2197",
      "title": "新短歌入門",
      "author": "土屋文明",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-08"
    },
    {
      "bookId": "2198",
      "title": "女のあしおと",
      "author": "宮尾登美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-09"
    },
    {
      "bookId": "2199",
      "title": "海明け 下",
      "author": "八木義徳",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-10"
    },
    {
      "bookId": "2200",
      "title": "海明け 中",
      "author": "八木義徳",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-11"
    },
    {
      "bookId": "2201",
      "title": "海明け 上",
      "author": "八木義徳",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-12"
    },
    {
      "bookId": "2202",
      "title": "頭医者事始",
      "author": "加賀乙彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-13"
    },
    {
      "bookId": "2203",
      "title": "大きな活字の英和辞典",
      "author": "三省堂編修所",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-14"
    },
    {
      "bookId": "2204",
      "title": "わが母の記",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-15"
    },
    {
      "bookId": "2205",
      "title": "りんごとバイオリン 下巻",
      "author": "今西祐行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-16"
    },
    {
      "bookId": "2206",
      "title": "りんごとバイオリン 上巻",
      "author": "今西祐行",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-17"
    },
    {
      "bookId": "2207",
      "title": "夜の光に追われて 下",
      "author": "津島佑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-18"
    },
    {
      "bookId": "2208",
      "title": "夜の光に追われて 中",
      "author": "津島佑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-19"
    },
    {
      "bookId": "2209",
      "title": "夜の光に追われて 上",
      "author": "津島佑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-20"
    },
    {
      "bookId": "2210",
      "title": "夢のつづき 下",
      "author": "神吉拓郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-21"
    },
    {
      "bookId": "2211",
      "title": "夢のつづき 上",
      "author": "神吉拓郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-22"
    },
    {
      "bookId": "2212",
      "title": "丸山蘭水楼の遊女たち 下",
      "author": "井上光晴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-23"
    },
    {
      "bookId": "2213",
      "title": "丸山蘭水楼の遊女たち 上",
      "author": "井上光晴",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-24"
    },
    {
      "bookId": "2214",
      "title": "冬のかたみに 下",
      "author": "立原正秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-25"
    },
    {
      "bookId": "2215",
      "title": "冬のかたみに 上",
      "author": "立原正秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-26"
    },
    {
      "bookId": "2216",
      "title": "豊臣家の人々 下",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-27"
    },
    {
      "bookId": "2217",
      "title": "豊臣家の人々 中",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-28"
    },
    {
      "bookId": "2218",
      "title": "豊臣家の人々 上",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-29"
    },
    {
      "bookId": "2219",
      "title": "隣りの女",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-04-30"
    },
    {
      "bookId": "2220",
      "title": "恋紅 下",
      "author": "皆川博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-01"
    },
    {
      "bookId": "2221",
      "title": "恋紅 上",
      "author": "皆川博子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-02"
    },
    {
      "bookId": "2222",
      "title": "夏行冬暦",
      "author": "上田三四二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-03"
    },
    {
      "bookId": "2223",
      "title": "黒馬物語 下巻",
      "author": "シュウエル",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-04"
    },
    {
      "bookId": "2224",
      "title": "黒馬物語 上巻",
      "author": "シュウエル",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-05"
    },
    {
      "bookId": "2225",
      "title": "風の砦 4",
      "author": "原田康子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-06"
    },
    {
      "bookId": "2226",
      "title": "風の砦 3",
      "author": "原田康子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-07"
    },
    {
      "bookId": "2227",
      "title": "風の砦 2",
      "author": "原田康子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-08"
    },
    {
      "bookId": "2228",
      "title": "風の砦 1",
      "author": "原田康子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-09"
    },
    {
      "bookId": "2229",
      "title": "海辺で 下",
      "author": "三木卓",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-10"
    },
    {
      "bookId": "2230",
      "title": "海辺で 上",
      "author": "三木卓",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-11"
    },
    {
      "bookId": "2231",
      "title": "反逆 4",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-12"
    },
    {
      "bookId": "2232",
      "title": "反逆 3",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-13"
    },
    {
      "bookId": "2233",
      "title": "反逆 2",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-14"
    },
    {
      "bookId": "2234",
      "title": "反逆 1",
      "author": "遠藤周作",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-15"
    },
    {
      "bookId": "2235",
      "title": "花千日の紅なく",
      "author": "阿井景子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-16"
    },
    {
      "bookId": "2236",
      "title": "山恋いの記 下",
      "author": "村井米子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-17"
    },
    {
      "bookId": "2237",
      "title": "山恋いの記 上",
      "author": "村井米子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-18"
    },
    {
      "bookId": "2238",
      "title": "漂雲",
      "author": "八木義徳",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-19"
    },
    {
      "bookId": "2239",
      "title": "悲愁中宮 下",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-20"
    },
    {
      "bookId": "2240",
      "title": "悲愁中宮 上",
      "author": "安西篤子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-21"
    },
    {
      "bookId": "2241",
      "title": "秘剣 下",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-22"
    },
    {
      "bookId": "2242",
      "title": "秘剣 上",
      "author": "白石一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-23"
    },
    {
      "bookId": "2243",
      "title": "中原中也詩集",
      "author": "中原中也",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-24"
    },
    {
      "bookId": "2244",
      "title": "食卓の微笑",
      "author": "戸板康二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-25"
    },
    {
      "bookId": "2245",
      "title": "死者と栄光への挽歌 下",
      "author": "結城昌治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-26"
    },
    {
      "bookId": "2246",
      "title": "死者と栄光への挽歌 上",
      "author": "結城昌治",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-27"
    },
    {
      "bookId": "2247",
      "title": "草の花 下",
      "author": "福永武彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-28"
    },
    {
      "bookId": "2248",
      "title": "草の花 上",
      "author": "福永武彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-29"
    },
    {
      "bookId": "2249",
      "title": "極光のかげに 下",
      "author": "高杉一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-30"
    },
    {
      "bookId": "2250",
      "title": "極光のかげに 上",
      "author": "高杉一郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-05-31"
    },
    {
      "bookId": "2251",
      "title": "虚航船団 下",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-01"
    },
    {
      "bookId": "2252",
      "title": "虚航船団 中",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-02"
    },
    {
      "bookId": "2253",
      "title": "虚航船団 上",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-03"
    },
    {
      "bookId": "2254",
      "title": "夜の蟻 下",
      "author": "高井有一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-04"
    },
    {
      "bookId": "2255",
      "title": "夜の蟻 上",
      "author": "高井有一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-05"
    },
    {
      "bookId": "2256",
      "title": "モロッコ革の本 下",
      "author": "栃折久美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-06"
    },
    {
      "bookId": "2257",
      "title": "モロッコ革の本 上",
      "author": "栃折久美子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-07"
    },
    {
      "bookId": "2258",
      "title": "遠い約束 下",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-08"
    },
    {
      "bookId": "2259",
      "title": "遠い約束 上",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-09"
    },
    {
      "bookId": "2260",
      "title": "深重の海 下",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-10"
    },
    {
      "bookId": "2261",
      "title": "深重の海 上",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-11"
    },
    {
      "bookId": "2262",
      "title": "写楽道行",
      "author": "フランキー堺",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-12"
    },
    {
      "bookId": "2263",
      "title": "近衛文麿 4",
      "author": "杉森久英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-13"
    },
    {
      "bookId": "2264",
      "title": "近衛文麿 3",
      "author": "杉森久英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-14"
    },
    {
      "bookId": "2265",
      "title": "近衛文麿 2",
      "author": "杉森久英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-15"
    },
    {
      "bookId": "2266",
      "title": "近衛文麿 1",
      "author": "杉森久英",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-16"
    },
    {
      "bookId": "2267",
      "title": "ことばの歳時記 下",
      "author": "山本健吉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-17"
    },
    {
      "bookId": "2268",
      "title": "ことばの歳時記 上",
      "author": "山本健吉",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-18"
    },
    {
      "bookId": "2269",
      "title": "北国物語 下",
      "author": "船山馨",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-19"
    },
    {
      "bookId": "2270",
      "title": "北国物語 上",
      "author": "船山馨",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-20"
    },
    {
      "bookId": "2271",
      "title": "危険信号 下",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-21"
    },
    {
      "bookId": "2272",
      "title": "危険信号 上",
      "author": "阿刀田高",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-22"
    },
    {
      "bookId": "2273",
      "title": "お天気博士の気象ノート 下",
      "author": "倉嶋厚",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-23"
    },
    {
      "bookId": "2274",
      "title": "お天気博士の気象ノート 上",
      "author": "倉嶋厚",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-24"
    },
    {
      "bookId": "2275",
      "title": "大晦日のローストビーフ 下",
      "author": "秋山ちえ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-25"
    },
    {
      "bookId": "2276",
      "title": "大晦日のローストビーフ 上",
      "author": "秋山ちえ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-26"
    },
    {
      "bookId": "2277",
      "title": "永代橋崩落 下",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-27"
    },
    {
      "bookId": "2278",
      "title": "永代橋崩落 上",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-28"
    },
    {
      "bookId": "2279",
      "title": "アラスカ物語 下",
      "author": "新田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-29"
    },
    {
      "bookId": "2280",
      "title": "アラスカ物語 中",
      "author": "新田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-06-30"
    },
    {
      "bookId": "2281",
      "title": "アラスカ物語 上",
      "author": "新田次郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-01"
    },
    {
      "bookId": "2282",
      "title": "青梅雨",
      "author": "永井竜男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-02"
    },
    {
      "bookId": "2283",
      "title": "我が炎死なず 下",
      "author": "黒岩重吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-03"
    },
    {
      "bookId": "2284",
      "title": "我が炎死なず 上",
      "author": "黒岩重吾",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-04"
    },
    {
      "bookId": "2285",
      "title": "落語のみなもと",
      "author": "宇井無愁",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-05"
    },
    {
      "bookId": "2286",
      "title": "夜の太鼓",
      "author": "石垣りん",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-06"
    },
    {
      "bookId": "2287",
      "title": "夢の島",
      "author": "日野啓三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-07"
    },
    {
      "bookId": "2288",
      "title": "夢の壁 下",
      "author": "加藤幸子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-08"
    },
    {
      "bookId": "2289",
      "title": "夢の壁 上",
      "author": "加藤幸子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-09"
    },
    {
      "bookId": "2290",
      "title": "娘と私の部屋",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-10"
    },
    {
      "bookId": "2291",
      "title": "三木助歳時記 下",
      "author": "安藤鶴夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-11"
    },
    {
      "bookId": "2292",
      "title": "三木助歳時記 中",
      "author": "安藤鶴夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-12"
    },
    {
      "bookId": "2293",
      "title": "三木助歳時記 上",
      "author": "安藤鶴夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-13"
    },
    {
      "bookId": "2294",
      "title": "天皇の帽子",
      "author": "今日出海",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-14"
    },
    {
      "bookId": "2295",
      "title": "十三匹の猫と哀妻と私",
      "author": "古川薫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-15"
    },
    {
      "bookId": "2296",
      "title": "この国は恐ろしい国",
      "author": "関千枝子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-16"
    },
    {
      "bookId": "2297",
      "title": "語源散策 下",
      "author": "岩淵悦太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-17"
    },
    {
      "bookId": "2298",
      "title": "語源散策 上",
      "author": "岩淵悦太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-18"
    },
    {
      "bookId": "2299",
      "title": "女と味噌汁",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-19"
    },
    {
      "bookId": "2300",
      "title": "おろしや国酔夢譚 下",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-20"
    },
    {
      "bookId": "2301",
      "title": "おろしや国酔夢譚 上",
      "author": "井上靖",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-21"
    },
    {
      "bookId": "2302",
      "title": "おせっかいな神々 下",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-22"
    },
    {
      "bookId": "2303",
      "title": "おせっかいな神々 上",
      "author": "星新一",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-23"
    },
    {
      "bookId": "2304",
      "title": "悦ちゃん 下",
      "author": "獅子文六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-24"
    },
    {
      "bookId": "2305",
      "title": "悦ちゃん 上",
      "author": "獅子文六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-25"
    },
    {
      "bookId": "2306",
      "title": "石狩川 下",
      "author": "本庄陸男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-26"
    },
    {
      "bookId": "2307",
      "title": "石狩川 中",
      "author": "本庄陸男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-27"
    },
    {
      "bookId": "2308",
      "title": "石狩川 上",
      "author": "本庄陸男",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-28"
    },
    {
      "bookId": "2309",
      "title": "あ・うん",
      "author": "向田邦子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-29"
    },
    {
      "bookId": "2310",
      "title": "白秋詩集 下",
      "author": "北原白秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-30"
    },
    {
      "bookId": "2311",
      "title": "白秋詩集 上",
      "author": "北原白秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-07-31"
    },
    {
      "bookId": "2312",
      "title": "落日燃ゆ 下",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-01"
    },
    {
      "bookId": "2313",
      "title": "落日燃ゆ 上",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-02"
    },
    {
      "bookId": "2314",
      "title": "モッキンポット師ふたたび 下",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-03"
    },
    {
      "bookId": "2315",
      "title": "モッキンポット師ふたたび 上",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-04"
    },
    {
      "bookId": "2316",
      "title": "蜜柑庄屋・金十郎 下",
      "author": "沢田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-05"
    },
    {
      "bookId": "2317",
      "title": "蜜柑庄屋・金十郎 上",
      "author": "沢田ふじ子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-06"
    },
    {
      "bookId": "2318",
      "title": "ねぼけ人生 下",
      "author": "水木しげる",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-07"
    },
    {
      "bookId": "2319",
      "title": "ねぼけ人生 上",
      "author": "水木しげる",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-08"
    },
    {
      "bookId": "2320",
      "title": "長い道 下",
      "author": "柏原兵三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-09"
    },
    {
      "bookId": "2321",
      "title": "長い道 上",
      "author": "柏原兵三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-10"
    },
    {
      "bookId": "2322",
      "title": "であいの旅",
      "author": "山根基世",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-11"
    },
    {
      "bookId": "2323",
      "title": "桜の橋 下",
      "author": "中薗英助",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-12"
    },
    {
      "bookId": "2324",
      "title": "桜の橋 上",
      "author": "中薗英助",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-13"
    },
    {
      "bookId": "2325",
      "title": "五弁の椿 下",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-14"
    },
    {
      "bookId": "2326",
      "title": "五弁の椿 上",
      "author": "山本周五郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-15"
    },
    {
      "bookId": "2327",
      "title": "子育てごっこ 下",
      "author": "三好京三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-16"
    },
    {
      "bookId": "2328",
      "title": "子育てごっこ 上",
      "author": "三好京三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-17"
    },
    {
      "bookId": "2329",
      "title": "海軍こぼれ話 下",
      "author": "阿川弘之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-18"
    },
    {
      "bookId": "2330",
      "title": "海軍こぼれ話 上",
      "author": "阿川弘之",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-19"
    },
    {
      "bookId": "2331",
      "title": "女帯 下",
      "author": "円地文子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-20"
    },
    {
      "bookId": "2332",
      "title": "女帯 中",
      "author": "円地文子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-21"
    },
    {
      "bookId": "2333",
      "title": "女帯 上",
      "author": "円地文子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-22"
    },
    {
      "bookId": "2334",
      "title": "黄金流砂 下",
      "author": "中津文彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-23"
    },
    {
      "bookId": "2335",
      "title": "黄金流砂 上",
      "author": "中津文彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-24"
    },
    {
      "bookId": "2336",
      "title": "私の東京地図 下",
      "author": "佐多稲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-25"
    },
    {
      "bookId": "2337",
      "title": "私の東京地図 上",
      "author": "佐多稲子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-26"
    },
    {
      "bookId": "2338",
      "title": "幼年",
      "author": "福永武彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-27"
    },
    {
      "bookId": "2339",
      "title": "夢の木坂分岐点 下",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-28"
    },
    {
      "bookId": "2340",
      "title": "夢の木坂分岐点 上",
      "author": "筒井康隆",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-29"
    },
    {
      "bookId": "2341",
      "title": "都に夜のある如く 下",
      "author": "高見順",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-30"
    },
    {
      "bookId": "2342",
      "title": "都に夜のある如く 上",
      "author": "高見順",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-08-31"
    },
    {
      "bookId": "2343",
      "title": "テングの庭",
      "author": "猪野省三",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-01"
    },
    {
      "bookId": "2344",
      "title": "旅路",
      "author": "藤原てい",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-02"
    },
    {
      "bookId": "2345",
      "title": "三郎物語 下",
      "author": "大原富枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-03"
    },
    {
      "bookId": "2346",
      "title": "三郎物語 上",
      "author": "大原富枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-04"
    },
    {
      "bookId": "2347",
      "title": "銀のスケート 下巻",
      "author": "M.M.ドッジ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-05"
    },
    {
      "bookId": "2348",
      "title": "銀のスケート 中巻",
      "author": "M.M.ドッジ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-06"
    },
    {
      "bookId": "2349",
      "title": "銀のスケート 上巻",
      "author": "M.M.ドッジ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-07"
    },
    {
      "bookId": "2350",
      "title": "帰路 下",
      "author": "立原正秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-08"
    },
    {
      "bookId": "2351",
      "title": "帰路 上",
      "author": "立原正秋",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-09"
    },
    {
      "bookId": "2352",
      "title": "風の果て 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-10"
    },
    {
      "bookId": "2353",
      "title": "風の果て 中",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-11"
    },
    {
      "bookId": "2354",
      "title": "風の果て 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-12"
    },
    {
      "bookId": "2355",
      "title": "風の旅",
      "author": "三浦哲郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-13"
    },
    {
      "bookId": "2356",
      "title": "幼ものがたり 下巻",
      "author": "石井桃子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-14"
    },
    {
      "bookId": "2357",
      "title": "幼ものがたり 上巻",
      "author": "石井桃子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-15"
    },
    {
      "bookId": "2358",
      "title": "秋の街",
      "author": "吉村昭",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-16"
    },
    {
      "bookId": "2359",
      "title": "半生の記",
      "author": "松本清張",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-17"
    },
    {
      "bookId": "2360",
      "title": "花はくれない 下",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-18"
    },
    {
      "bookId": "2361",
      "title": "花はくれない 上",
      "author": "佐藤愛子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-19"
    },
    {
      "bookId": "2362",
      "title": "花の結び目",
      "author": "時実新子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-20"
    },
    {
      "bookId": "2363",
      "title": "寄席紳士録",
      "author": "安藤鶴夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-21"
    },
    {
      "bookId": "2364",
      "title": "明治兜割り",
      "author": "津本陽",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-22"
    },
    {
      "bookId": "2365",
      "title": "娘と私 下",
      "author": "獅子文六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-23"
    },
    {
      "bookId": "2366",
      "title": "娘と私 中",
      "author": "獅子文六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-24"
    },
    {
      "bookId": "2367",
      "title": "娘と私 上",
      "author": "獅子文六",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-25"
    },
    {
      "bookId": "2368",
      "title": "風俗江戸物語",
      "author": "岡本綺堂",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-26"
    },
    {
      "bookId": "2369",
      "title": "風子 下",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-27"
    },
    {
      "bookId": "2370",
      "title": "風子 上",
      "author": "平岩弓枝",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-28"
    },
    {
      "bookId": "2371",
      "title": "苦い夏 下",
      "author": "中野孝次",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-29"
    },
    {
      "bookId": "2372",
      "title": "苦い夏 上",
      "author": "中野孝次",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-09-30"
    },
    {
      "bookId": "2373",
      "title": "新選組血風録 中",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-01"
    },
    {
      "bookId": "2374",
      "title": "新選組血風録 上",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-02"
    },
    {
      "bookId": "2375",
      "title": "時雨みち 下",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-03"
    },
    {
      "bookId": "2376",
      "title": "時雨みち 上",
      "author": "藤沢周平",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-04"
    },
    {
      "bookId": "2377",
      "title": "虎口からの脱出 下",
      "author": "景山民夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-05"
    },
    {
      "bookId": "2378",
      "title": "虎口からの脱出 上",
      "author": "景山民夫",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-06"
    },
    {
      "bookId": "2379",
      "title": "銀座の柳",
      "author": "車谷弘",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-07"
    },
    {
      "bookId": "2380",
      "title": "ある勝負師の生涯 下",
      "author": "木村義雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-08"
    },
    {
      "bookId": "2381",
      "title": "ある勝負師の生涯 上",
      "author": "木村義雄",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-09"
    },
    {
      "bookId": "2382",
      "title": "遙かな坂 4",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-10"
    },
    {
      "bookId": "2383",
      "title": "遙かな坂 3",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-11"
    },
    {
      "bookId": "2384",
      "title": "遙かな坂 2",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-12"
    },
    {
      "bookId": "2385",
      "title": "遙かな坂 1",
      "author": "夏樹静子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-13"
    },
    {
      "bookId": "2386",
      "title": "毎日が日曜日 下",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-14"
    },
    {
      "bookId": "2387",
      "title": "毎日が日曜日 中",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-15"
    },
    {
      "bookId": "2388",
      "title": "毎日が日曜日 上",
      "author": "城山三郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-16"
    },
    {
      "bookId": "2389",
      "title": "夏の花・鎮魂歌 下",
      "author": "原民喜",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-17"
    },
    {
      "bookId": "2390",
      "title": "夏の花・鎮魂歌 上",
      "author": "原民喜",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-18"
    },
    {
      "bookId": "2391",
      "title": "中村勘三郎楽屋ばなし 下",
      "author": "関容子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-19"
    },
    {
      "bookId": "2392",
      "title": "中村勘三郎楽屋ばなし 上",
      "author": "関容子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-20"
    },
    {
      "bookId": "2393",
      "title": "月なきみそらの天坊一座 下",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-21"
    },
    {
      "bookId": "2394",
      "title": "月なきみそらの天坊一座 上",
      "author": "井上ひさし",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-22"
    },
    {
      "bookId": "2395",
      "title": "終焉",
      "author": "杉本苑子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-23"
    },
    {
      "bookId": "2396",
      "title": "渋江抽斎 下",
      "author": "森外",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-24"
    },
    {
      "bookId": "2397",
      "title": "渋江抽斎 上",
      "author": "森外",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-25"
    },
    {
      "bookId": "2398",
      "title": "四季の歌恋の歌 下",
      "author": "大岡信",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-26"
    },
    {
      "bookId": "2399",
      "title": "四季の歌恋の歌 上",
      "author": "大岡信",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-27"
    },
    {
      "bookId": "2400",
      "title": "帰らざる夏 下",
      "author": "加賀乙彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-28"
    },
    {
      "bookId": "2401",
      "title": "帰らざる夏 中",
      "author": "加賀乙彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-29"
    },
    {
      "bookId": "2402",
      "title": "帰らざる夏 上",
      "author": "加賀乙彦",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-30"
    },
    {
      "bookId": "2403",
      "title": "海神丸",
      "author": "野上弥生子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-10-31"
    },
    {
      "bookId": "2404",
      "title": "海辺の光景 下",
      "author": "安岡章太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-01"
    },
    {
      "bookId": "2405",
      "title": "海辺の光景 上",
      "author": "安岡章太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-02"
    },
    {
      "bookId": "2406",
      "title": "会津おんな戦記",
      "author": "福本武久",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-03"
    },
    {
      "bookId": "2407",
      "title": "愛猿記 下",
      "author": "子母沢寛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-04"
    },
    {
      "bookId": "2408",
      "title": "愛猿記 上",
      "author": "子母沢寛",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-05"
    },
    {
      "bookId": "2409",
      "title": "不毛地帯 4 その4",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-06"
    },
    {
      "bookId": "2410",
      "title": "不毛地帯 4 その3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-07"
    },
    {
      "bookId": "2411",
      "title": "不毛地帯 4 その2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-08"
    },
    {
      "bookId": "2412",
      "title": "不毛地帯 4 その1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-09"
    },
    {
      "bookId": "2413",
      "title": "不毛地帯 3 その4",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-10"
    },
    {
      "bookId": "2414",
      "title": "不毛地帯 3 その3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-11"
    },
    {
      "bookId": "2415",
      "title": "不毛地帯 3 その2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-12"
    },
    {
      "bookId": "2416",
      "title": "不毛地帯 3 その1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-13"
    },
    {
      "bookId": "2417",
      "title": "不毛地帯 2 その4",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-14"
    },
    {
      "bookId": "2418",
      "title": "不毛地帯 2 その3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-15"
    },
    {
      "bookId": "2419",
      "title": "不毛地帯 2 その2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-16"
    },
    {
      "bookId": "2420",
      "title": "不毛地帯 2 その1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-17"
    },
    {
      "bookId": "2421",
      "title": "不毛地帯 1 その4",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-18"
    },
    {
      "bookId": "2422",
      "title": "不毛地帯 1 その3",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-19"
    },
    {
      "bookId": "2423",
      "title": "不毛地帯 1 その2",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-20"
    },
    {
      "bookId": "2424",
      "title": "不毛地帯 1 その1",
      "author": "山崎豊子",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-21"
    },
    {
      "bookId": "2425",
      "title": "大活字ことわざ辞典",
      "author": "山田光二",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-22"
    },
    {
      "bookId": "2426",
      "title": "竜馬がゆく 16",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-23"
    },
    {
      "bookId": "2427",
      "title": "竜馬がゆく 15",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-24"
    },
    {
      "bookId": "2428",
      "title": "竜馬がゆく 14",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-25"
    },
    {
      "bookId": "2429",
      "title": "竜馬がゆく 13",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-26"
    },
    {
      "bookId": "2430",
      "title": "竜馬がゆく 12",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-27"
    },
    {
      "bookId": "2431",
      "title": "竜馬がゆく 11",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-28"
    },
    {
      "bookId": "2432",
      "title": "竜馬がゆく 10",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-29"
    },
    {
      "bookId": "2433",
      "title": "竜馬がゆく 9",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-11-30"
    },
    {
      "bookId": "2434",
      "title": "竜馬がゆく 8",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-01"
    },
    {
      "bookId": "2435",
      "title": "竜馬がゆく 7",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-02"
    },
    {
      "bookId": "2436",
      "title": "竜馬がゆく 6",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-03"
    },
    {
      "bookId": "2437",
      "title": "竜馬がゆく 5",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-04"
    },
    {
      "bookId": "2438",
      "title": "竜馬がゆく 4",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-05"
    },
    {
      "bookId": "2439",
      "title": "竜馬がゆく 3",
      "author": "司馬遼太郎",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-06"
    },
    {
      "bookId": "2440",
      "title": "キリスト伝説集",
      "author": "ラーゲルレーヴ",
      "category": "文芸",
      "canReserve": true,
      "isDisabled": false,
      "arrivalDate": "2025-12-07"
    }
  ],
  "reservations": [],
  "reservationHistory": [],
  "loans": [
    {
      "loanId": "L-00001",
      "bookId": "100",
      "userId": "1",
      "dueDate": "2026-04-23",
      "status": "ON_LOAN"
    },
    {
      "loanId": "L-00002",
      "bookId": "101",
      "userId": "1",
      "dueDate": "2026-04-26",
      "status": "ON_LOAN"
    },
    {
      "loanId": "L-00003",
      "bookId": "102",
      "userId": "2",
      "dueDate": "2026-04-29",
      "status": "ON_LOAN"
    },
    {
      "loanId": "L-00004",
      "bookId": "103",
      "userId": "2",
      "dueDate": "2026-05-02",
      "status": "ON_LOAN"
    },
    {
      "loanId": "L-00005",
      "bookId": "104",
      "userId": "3",
      "dueDate": "2026-05-05",
      "status": "ON_LOAN"
    }
  ],
  "notifications": [
    {
      "notificationId": "N-00001",
      "userId": "1",
      "type": "INFO",
      "title": "お知らせ",
      "message": "書籍データを初期登録しました。書籍検索から予約を開始できます。",
      "createdAt": "2026-04-17T09:00:00",
      "isRead": false
    }
  ],
  "favorites": [],
  "auditLog": [
    {
      "logId": "A-00001",
      "level": "INFO",
      "eventType": "SEED_IMPORT",
      "userId": "SYSTEM",
      "message": "添付SQLから users=20, books=2440, loans=5 を初期化",
      "createdAt": "2026-04-17T09:00:00"
    }
  ]
};
