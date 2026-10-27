
/* 页面级按需加载：首次打开某个工具页时才请求该页的业务脚本。 */
(function () {
  const VENDOR = {
    qr: "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js",
    barcode: "https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.6/JsBarcode.all.min.js",
    scanner: "https://cdnjs.cloudflare.com/ajax/libs/html5-qrcode/2.3.8/html5-qrcode.min.js",
    mp3: "https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js"
  };
  const HOME = {
    videoaudio: [VENDOR.mp3, "./js/home-01-视频提取音频.js?v=20261022-videoaudio-css-module"],
    audioConvert: [VENDOR.mp3, "./js/fl.js"],
    sitecheck: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-02-网站状态检测.js"],
    oilprice: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-03-油价查询.js"],
    videoparse: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-04-短视频去水印.js", "./js/home-05-从视频提取音频（ffmpeg.wasm）.js"],
    imghost: ["./js/home-06-图床上传（极速图床）.js?v=20261026-more-to-home"],
    avatarMaker: ["./js/home-07-国庆头像生成器.js"],
    numgen: ["./js/home-08-数字文本生成器.js"],
    pwcheck: ["./js/home-09-密码强度检测.js"],
    qq: ["./js/home-15-QQ好友工具.js?v=20261027-soft-button-material"],
    qqgroup: ["./js/home-16-QQ群工具.js?v=20261027-soft-button-material"],
    qrcode: [VENDOR.qr, "./js/home-17-二维码生成.js"],
    barcode: [VENDOR.barcode, "./js/home-18-条形码生成.js"],
    scanner: [VENDOR.scanner, "./js/home-19-扫码识别.js?v=20261027-scanner-page-styles"],
    currency: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-20-汇率换算.js?v=20261027-currency-page-styles"],
    iplookup: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-21-IP-查询.js?v=20261027-ip-dns-weather-styles"],
    dnsquery: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-21-IP-查询.js?v=20261027-ip-dns-weather-styles", "./js/home-22-域名解析.js?v=20261027-ip-dns-weather-styles"],
    domaincheck: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-21-IP-查询.js?v=20261027-ip-dns-weather-styles", "./js/home-22-域名解析.js?v=20261027-ip-dns-weather-styles"],
    weather: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-23-天气查询.js?v=20261027-ip-dns-weather-styles"],
    refreshrate: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-24-刷新率测试.js?v=20261026-more-to-home"],
    aes: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-25-AES加密.js"],
    translate: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-44-在线翻译.js"],
    daycalc: ["./js/home-tool-form-styles.js?v=20261027-tool-form-styles-v2", "./js/home-43-天数计算.js"],
    encqrcode: [VENDOR.qr, "./js/home-25-AES加密.js"],
    encscan: [VENDOR.qr, VENDOR.scanner, "./js/home-25-AES加密.js"],
    timestamp: ["./js/home-26-时间戳转换.js?v=20261026-more-to-home"],
    textutil: ["./js/home-27-文本工具.js"],
    random: ["./js/home-28-随机数.js"],
    jsonfmt: ["./js/home-29-JSON格式化.js?v=20261026-more-to-home"],
    base64: ["./js/home-30-Base64.js"],
    hexconvert: ["./js/home-31-进制转换.js?v=20261026-more-to-home"],
    uuidgen: ["./js/home-32-UUID.js?v=20261026-more-to-home"],
    passwordPage: ["./js/home-33-百宝箱：密码生成器.js"],
    relativePage: ["./js/home-34-百宝箱：亲戚称呼计算器.js"],
    agePage: ["./js/toolbox-32-百宝箱：星座运势.js", "./js/home-35-百宝箱：年龄计算器.js"],
    morsePage: ["./js/home-36-百宝箱：摩斯密码.js"],
    unitConverter: ["./js/home-38-单位换算器.js"],
    jsResourcesPage: ["./js/home-99-JS资源下载页.js?v=20261027-tool-form-styles"],
    introPage: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introManual: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introHot: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introSteam: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introHistory: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introFestival: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introOldVersions: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introQrManual: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introQqManual: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introQqGroupManual: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introAesManual: ["./js/intro-page.js?v=20261025-top-overlay-layer"],
    introOtherManual: ["./js/intro-page.js?v=20261025-top-overlay-layer"]
  };

  // 功能脚本间的共享依赖；只在进入相关工具时递归加载。
  const T = {
    chestCore: "toolbox-chest-core.js",
    wallet: "toolbox-wallet.js",
    chestHome: "toolbox-chest-home.js?v=20261027-gacha-home-card-styles",
    dice: "toolbox-10-百宝箱：掷骰子.js",
    coin: "toolbox-11-百宝箱：抛硬币.js?v=20261027-coin-style-module",
    eat: "toolbox-12-百宝箱：今天吃什么.js",
    yesno: "toolbox-13-百宝箱：是或否决策器.js",
    gacha: "toolbox-14-百宝箱：抽卡模拟器.js?v=20261027-gacha-css-module",
    rps: "toolbox-15-百宝箱：石头剪刀布.js",
    magic8: "toolbox-16-百宝箱：魔法8球.js",
    todayFortune: "toolbox-17-百宝箱：今日运势.js",
    todayHonor: "toolbox-18-百宝箱：今日人品.js?v=20261022-keyboard-stable",
    backpack: "toolbox-19-背包系统.js",
    tarotCollection: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    runeCollection: "toolbox-21-符文收藏.js",
    lenormandCollection: "toolbox-22-雷诺曼收藏.js",
    oracleCollection: "toolbox-23-神谕卡收藏.js",
    cardHub: "toolbox-24-基博卡收藏.js",
    slot: "toolbox-25-百宝箱：老虎机.js",
    guess: "toolbox-26-百宝箱：猜数字.js",
    chestFilter: "toolbox-27-百宝箱分类筛选.js?v=20261025-segmented-popup-match",
    mines: "toolbox-28-百宝箱：扫雷.js",
    ttt: "toolbox-29-百宝箱：井字棋.js",
    memory: "toolbox-30-百宝箱：记忆翻牌.js",
    whack: "toolbox-31-百宝箱：打地鼠.js",
    zodiac: "toolbox-32-百宝箱：星座运势.js",
    zodiacMatch: "toolbox-33-百宝箱：生肖配对.js",
    nameMatch: "toolbox-34-百宝箱：姓名配对.js",
    mentalAge: "toolbox-35-百宝箱：心理年龄测试.js",
    brainTest: "toolbox-36-百宝箱：左右脑测试.js",
    pastLife: "toolbox-37-百宝箱：前世身份.js",
    anniversary: "toolbox-38-百宝箱：纪念日倒计时.js?v=20261026-more-to-home",
    calorie: "toolbox-39-百宝箱：卡路里计算器.js?v=20261026-more-to-home",
    ovulation: "toolbox-40-百宝箱：排卵期计算器.js?v=20261026-more-to-home",
    rollCall: "toolbox-41-百宝箱：随机点名.js?v=20261026-more-to-home",
    group: "toolbox-42-百宝箱：随机分组.js?v=20261026-more-to-home",
    acrostic: "toolbox-43-百宝箱：藏头诗生成.js",
    caesar: "toolbox-44-百宝箱：凯撒密码.js?v=20261026-more-to-home",
    reverseText: "toolbox-45-百宝箱：文字反转.js?v=20261026-qq-global-style",
    truthDare: "toolbox-46-新增工具：真心话大冒险.js",
    jokes: "toolbox-47-新增工具：冷笑话大全.js",
    riddles: "toolbox-48-新增工具：脑筋急转弯.js",
    game24: "toolbox-49-新增工具：24点.js",
    idiomChain: "toolbox-50-新增工具：成语接龙.js",
    mindReading: "toolbox-51-新增工具：读心术.js",
    tarotOptimized: "toolbox-53-塔罗牌占卜（优化版）.js?v=20261026-tarot-merge",
    astrodice: "toolbox-54-占星骰子.js",
    rune: "toolbox-55-符文占卜.js?v=20261027-rune-styles",
    pendulum: "toolbox-56-灵摆占卜.js?v=20261027-pendulum-styles",
    lenormand: "toolbox-57-雷诺曼卡牌.js",
    oracle: "toolbox-58-天使神谕卡.js",
    kipper: "toolbox-59-基博卡.js",
    dream: "toolbox-60-新增工具：周公解梦.js",
    mbti: "toolbox-61-新增工具：MBTI人格测试.js",
    iq: "toolbox-62-新增工具：IQ智商测试.js",
    bloodMatch: "toolbox-63-新增工具：血型配对.js",
    charDiv: "toolbox-64-新增工具：测字.js",
    wheel: "toolbox-65-新增工具：幸运转盘（多转盘版）.js",
    checkin: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    capsule: "toolbox-67-新增工具：扭蛋机.js?v=20261027-capsule-rule-modal",
    items: "toolbox-68-扭蛋机道具系统.js",
    achievement: "toolbox-69-新增工具：成就徽章.js",
    gameAchievements: "toolbox-70-打工相关成就.js",
    dailyAchievements: "toolbox-71-每日任务相关成就.js",
    petAchievements: "toolbox-72-宠物相关成就.js",
    numerology: "toolbox-73-数字命理学.js",
    tealeaf: "toolbox-74-茶叶占卜.js",
    crystalball: "toolbox-75-水晶球占卜.js?v=20261027-crystal-styles",
    status: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    school: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    work: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    dailyTasks: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    mailbox: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    cleanShop: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    toyShop: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    superItems: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    usage: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    playItems: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    warehouse: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    phone: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    batch: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    itemUse: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    tetris: "toolbox-02-俄罗斯方块.js",
    gomoku: "toolbox-03-五子棋.js",
    game2048: "toolbox-04-2048.js",
    breakout: "toolbox-05-打砖块.js",
    piano: "toolbox-06-别踩白块.js",
    pinball: "toolbox-07-打弹珠.js?v=20261026-pin-rule-modal",
    pinballShop: "toolbox-08-弹珠库存与商店.js?v=20261026-pin-rule-modal",
    fortune: "toolbox-107-百宝箱：抽签.js",
    spotDiff: "toolbox-92-1.-找不同-spotDiff.js?v=20261027-game-style-module",
    match3: "toolbox-93-2.-消消乐-match3.js?v=20261027-game-style-module",
    typing: "toolbox-94-3.-打字通-typing.js?v=20261027-typing-result-styles",
    linkGame: "toolbox-95-4.-连连看-linkGame.js?v=20261027-game-style-module",    publicTools: "toolbox-98-新增工具组B：公共工具.js",
    almanac: "toolbox-99-今日宜忌.js",
    animal: "toolbox-100-动物性格测试.js",
    faceScore: "toolbox-101-颜值打分器.js",
    morality: "toolbox-102-人品计算器.js",
    petDress: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    petSkill: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    petExplore: "toolbox-76-状态系统.js?v=20261027-batch-use-modal",
    petDiary: "toolbox-76-状态系统.js?v=20261027-batch-use-modal"
  };

  // 功能脚本间的共享依赖；只在进入相关工具时递归加载。
  const CHEST_DEPENDENCIES = {
    "toolbox-02-俄罗斯方块.js": ["toolbox-wallet.js"],
    "toolbox-03-五子棋.js": ["toolbox-wallet.js"],
    "toolbox-04-2048.js": ["toolbox-wallet.js"],
    "toolbox-05-打砖块.js": ["toolbox-wallet.js"],
    "toolbox-06-别踩白块.js": ["toolbox-wallet.js"],
    "toolbox-08-弹珠库存与商店.js?v=20261026-pin-rule-modal": ["toolbox-07-打弹珠.js?v=20261026-pin-rule-modal","toolbox-wallet.js"],
    "toolbox-100-动物性格测试.js": ["toolbox-98-新增工具组B：公共工具.js"],
    "toolbox-101-颜值打分器.js": ["toolbox-17-百宝箱：今日运势.js","toolbox-98-新增工具组B：公共工具.js"],
    "toolbox-102-人品计算器.js": ["toolbox-17-百宝箱：今日运势.js","toolbox-98-新增工具组B：公共工具.js"],
    "toolbox-14-百宝箱：抽卡模拟器.js": ["toolbox-19-背包系统.js","toolbox-76-状态系统.js?v=20261027-batch-use-modal","toolbox-wallet.js"],
    "toolbox-15-百宝箱：石头剪刀布.js": ["toolbox-wallet.js"],
    "toolbox-18-百宝箱：今日人品.js?v=20261022-keyboard-stable": ["toolbox-17-百宝箱：今日运势.js","toolbox-76-状态系统.js?v=20261027-batch-use-modal","toolbox-wallet.js"],
    "toolbox-19-背包系统.js": ["toolbox-24-基博卡收藏.js"],
    "toolbox-21-符文收藏.js": ["toolbox-24-基博卡收藏.js"],
    "toolbox-22-雷诺曼收藏.js": ["toolbox-24-基博卡收藏.js"],
    "toolbox-23-神谕卡收藏.js": ["toolbox-24-基博卡收藏.js"],
    "toolbox-24-基博卡收藏.js": ["toolbox-19-背包系统.js","toolbox-76-状态系统.js?v=20261027-batch-use-modal","toolbox-21-符文收藏.js","toolbox-22-雷诺曼收藏.js","toolbox-23-神谕卡收藏.js","toolbox-68-扭蛋机道具系统.js","toolbox-wallet.js"],
    "toolbox-25-百宝箱：老虎机.js": ["toolbox-wallet.js"],
    "toolbox-26-百宝箱：猜数字.js": ["toolbox-wallet.js"],
    "toolbox-28-百宝箱：扫雷.js": ["toolbox-wallet.js"],
    "toolbox-29-百宝箱：井字棋.js": ["toolbox-wallet.js"],
    "toolbox-30-百宝箱：记忆翻牌.js": ["toolbox-wallet.js"],
    "toolbox-31-百宝箱：打地鼠.js": ["toolbox-wallet.js"],
    "toolbox-32-百宝箱：星座运势.js": ["toolbox-17-百宝箱：今日运势.js"],
    "toolbox-34-百宝箱：姓名配对.js": ["toolbox-17-百宝箱：今日运势.js"],
    "toolbox-37-百宝箱：前世身份.js": ["toolbox-17-百宝箱：今日运势.js"],
    "toolbox-49-新增工具：24点.js": ["toolbox-wallet.js"],
    "toolbox-50-新增工具：成语接龙.js": ["toolbox-wallet.js"],
    "toolbox-53-塔罗牌占卜（优化版）.js?v=20261026-tarot-merge": ["toolbox-wallet.js"],
    "toolbox-55-符文占卜.js?v=20261027-rune-styles": ["toolbox-wallet.js"],
    "toolbox-57-雷诺曼卡牌.js": ["toolbox-divination-card-styles.js","toolbox-wallet.js"],
    "toolbox-58-天使神谕卡.js": ["toolbox-wallet.js"],
    "toolbox-59-基博卡.js": ["toolbox-divination-card-styles.js","toolbox-wallet.js"],
    "toolbox-64-新增工具：测字.js": ["toolbox-17-百宝箱：今日运势.js"],
    "toolbox-65-新增工具：幸运转盘（多转盘版）.js": ["toolbox-68-扭蛋机道具系统.js","toolbox-wallet.js"],
    "toolbox-67-新增工具：扭蛋机.js?v=20261027-capsule-rule-modal": ["toolbox-19-背包系统.js","toolbox-68-扭蛋机道具系统.js","toolbox-76-状态系统.js?v=20261027-batch-use-modal","toolbox-wallet.js"],
    "toolbox-68-扭蛋机道具系统.js": ["toolbox-76-状态系统.js?v=20261027-batch-use-modal"],
    "toolbox-69-新增工具：成就徽章.js": ["toolbox-76-状态系统.js?v=20261027-batch-use-modal","toolbox-wallet.js"],
    "toolbox-72-宠物相关成就.js": ["toolbox-wallet.js"],
    "toolbox-73-数字命理学.js": ["toolbox-wallet.js"],
    "toolbox-74-茶叶占卜.js": ["toolbox-wallet.js"],
    "toolbox-75-水晶球占卜.js?v=20261027-crystal-styles": ["toolbox-wallet.js"],
    "toolbox-94-3.-打字通-typing.js?v=20261027-typing-result-styles": ["toolbox-wallet.js"],
    "toolbox-99-今日宜忌.js": ["toolbox-17-百宝箱：今日运势.js","toolbox-98-新增工具组B：公共工具.js"],
    "toolbox-wallet.js": ["toolbox-76-状态系统.js?v=20261027-batch-use-modal"],
    "toolbox-76-状态系统.js?v=20261027-batch-use-modal": ["toolbox-wallet.js","toolbox-24-基博卡收藏.js","toolbox-17-百宝箱：今日运势.js","toolbox-68-扭蛋机道具系统.js"],
    "toolbox-92-1.-找不同-spotDiff.js?v=20261027-game-style-module": ["toolbox-wallet.js"],
    "toolbox-93-2.-消消乐-match3.js?v=20261027-game-style-module": ["toolbox-wallet.js"],
    "toolbox-95-4.-连连看-linkGame.js?v=20261027-game-style-module": ["toolbox-wallet.js"],
  };

  const CHEST = {
    chestHome: [T.wallet, T.chestCore, T.pinballShop, T.chestHome, T.chestFilter],
    backpack: [T.wallet, T.backpack, T.tarotCollection, T.runeCollection, T.lenormandCollection, T.oracleCollection, T.cardHub, T.items, T.dailyTasks, T.itemUse],
    dicePage: [T.dice, T.wallet], coinPage: [T.coin, T.wallet], eatPage: [T.eat, T.wallet],
    yesnoPage: [T.yesno, T.wallet], fortunePage: [T.fortune], gachaPage: [T.gacha, T.backpack, T.wallet, T.dailyTasks],
    rpsPage: [T.rps, T.wallet], magic8Page: [T.magic8], fortuneTodayPage: [T.todayFortune], jinriPage: [T.todayHonor, T.todayFortune, T.wallet, T.phone, T.status, T.school],
    slotPage: [T.slot, T.wallet], guessPage: [T.guess, T.wallet], minesweeperPage: [T.mines, T.wallet], tttPage: [T.ttt, T.wallet],
    memoryPage: [T.memory, T.wallet], whackPage: [T.whack, T.wallet], zodiacPage: [T.zodiac, T.todayFortune],
    zodiacMatchPage: [T.zodiacMatch], nameMatchPage: [T.nameMatch, T.todayFortune], mentalAgePage: [T.mentalAge],
    brainTestPage: [T.brainTest], pastLifePage: [T.pastLife, T.todayFortune], anniversaryPage: [T.anniversary],
    caloriePage: [T.calorie], ovulationPage: [T.ovulation], rollCallPage: [T.rollCall], groupPage: [T.group],
    acrosticPage: [T.acrostic], caesarPage: [T.caesar], reverseTextPage: [T.reverseText],
    tetrisPage: [T.tetris, T.wallet], gomokuPage: [T.gomoku, T.wallet], game2048Page: [T.game2048, T.wallet],
    breakoutPage: [T.breakout, T.wallet], pinballPage: [T.pinball, T.pinballShop, T.wallet], pinballShopPage: [T.pinballShop, T.wallet], pianoPage: [T.piano, T.wallet],
    truthDarePage: [T.truthDare], jokesPage: [T.jokes], riddlesPage: [T.riddles], game24Page: [T.game24, T.wallet],
    idiomChainPage: [T.idiomChain, T.wallet], mindReadingPage: [T.mindReading], tarotPage: [T.tarotOptimized, T.wallet],
    dreamPage: [T.dream], mbtiPage: [T.mbti], iqPage: [T.iq], bloodMatchPage: [T.bloodMatch], charDivPage: [T.charDiv, T.todayFortune],
    astrodicePage: [T.astrodice], runePage: [T.rune, T.wallet], pendulumPage: [T.pendulum], lenormandPage: [T.lenormand, T.wallet],
    oraclePage: [T.oracle, T.wallet], kipperPage: [T.kipper, T.wallet], numerologyPage: [T.numerology, T.wallet],
    tealeafPage: [T.tealeaf, T.wallet], crystalballPage: [T.crystalball, T.wallet],
    wheelPage: [T.wheel, T.wallet, T.items], coinWheelPage: [T.wheel, T.wallet, T.items], itemWheelPage: [T.wheel, T.wallet, T.items],
    cardWheelPage: [T.wheel, T.wallet, T.items], pinballWheelPage: [T.wheel, T.pinballShop, T.wallet, T.items],
    capsulePage: [T.capsule, T.items, T.itemUse, T.backpack, T.wallet, T.dailyTasks],
    achievementPage: [T.achievement, T.checkin, T.gameAchievements, T.dailyAchievements, T.petAchievements, T.wallet],
    statusPage: [T.status, T.school, T.work, T.dailyTasks, T.mailbox, T.cleanShop, T.toyShop, T.superItems, T.usage, T.playItems, T.warehouse, T.phone, T.batch, T.itemUse, T.wallet, T.items, T.checkin, T.achievement],
    foodShopPage: [T.status, T.cleanShop, T.toyShop, T.batch, T.school, T.warehouse, T.wallet],
    petSchoolPage: [T.school, T.superItems, T.playItems, T.dailyTasks, T.mailbox, T.usage, T.batch, T.wallet],
    petPlayPage: [T.school, T.playItems, T.superItems, T.dailyTasks, T.usage, T.wallet],
    petWorkPage: [T.work, T.school, T.dailyTasks, T.mailbox, T.wallet],
    dailyTaskPage: [T.checkin, T.dailyTasks, T.todayFortune, T.wallet],
    cleanShopPage: [T.cleanShop, T.toyShop, T.batch, T.status, T.school, T.warehouse, T.wallet],
    toyShopPage: [T.toyShop, T.cleanShop, T.batch, T.status, T.school, T.warehouse, T.wallet],
    superItemShopPage: [T.superItems, T.school, T.playItems, T.usage, T.wallet],
    warehousePage: [T.warehouse, T.school, T.status, T.cleanShop, T.toyShop, T.dailyTasks, T.usage, T.batch, T.wallet, T.mailbox],
    mailboxPage: [T.mailbox, T.warehouse, T.wallet], usageStatsPage: [T.usage, T.playItems],
    collectionPage: [T.tarotCollection, T.runeCollection, T.lenormandCollection, T.oracleCollection, T.cardHub, T.school, T.backpack, T.wallet, T.items, T.itemUse],
    collectionRecordPage: [T.usage, T.school],
    spotDiffPage: [T.spotDiff, T.wallet], match3Page: [T.match3, T.wallet],
    typingPage: [T.typing, T.wallet], linkGamePage: [T.linkGame, T.wallet],
    almanacPage: [T.almanac, T.publicTools, T.todayFortune], animalPersonalityPage: [T.animal, T.publicTools],
    faceScorePage: [T.faceScore, T.publicTools, T.todayFortune], moralityPage: [T.morality, T.publicTools, T.todayFortune],
    petDressPage: [T.petDress, T.wallet], petSkillPage: [T.petSkill, T.petDress],
    petExplorePage: [T.petExplore, T.petDiary, T.school, T.wallet], petDiaryPage: [T.petDiary],
    bmiPage: [T.publicTools]
  };

  const routePromises = new Map();
  const chestRoutesReady = new Set();
  let navigationVersion = 0;
  const originalOpenPage = window.openPage;
  const originalGoHome = window.goHome;

  function loadSequentially(sources) {
    return sources.reduce(function (chain, source) {
      return chain.then(function () { return window.flLoadScriptOnce(source); });
    }, Promise.resolve());
  }

  function expandChestDependencies(files) {
    const ordered = [];
    const loaded = new Set();
    function visit(file) {
      if (loaded.has(file)) return;
      loaded.add(file);
      (CHEST_DEPENDENCIES[file] || []).forEach(visit);
      ordered.push(file);
    }
    files.forEach(visit);
    return ordered;
  }

function ensureHomeRoute(route) {
    const sources = HOME[route];
    if (!sources || !sources.length) return Promise.resolve();
    const key = "home:" + route;
    if (!routePromises.has(key)) {
      const externalSources = sources.filter(function (source) { return /^https?:\/\//i.test(source); });
      const localSources = sources.filter(function (source) { return !/^https?:\/\//i.test(source); });
      const externalLoads = Promise.all(externalSources.map(function (source) {
        return window.flLoadScriptOnce(source).then(function () { return null; }).catch(function (error) {
          return { source: source, error: error };
        });
      }));
      routePromises.set(key, Promise.all([loadSequentially(localSources), externalLoads]).then(function (results) {
        const failures = results[1].filter(Boolean);
        if (failures.length) {
          const failed = failures[0];
          throw failed.error || new Error("脚本加载失败：" + failed.source);
        }
      }).catch(function (error) {
        routePromises.delete(key);
        throw error;
      }));
    }
    return routePromises.get(key);
  }

  function ensureChestBootstrap() {
    return window.flLoadScriptOnce("./js/toolbox.js?v=20261022-chest-core")
      .then(function () {
        if (typeof window.flEnsureChestBase === "function") return window.flEnsureChestBase();
        return window.__flChestModulesReady || Promise.resolve();
      })
      .then(function () { window.__flChestScriptsLoaded = true; });
  }

  function ensureChestRoute(route) {
    if (chestRoutesReady.has(route)) return Promise.resolve();
    const key = "chest:" + route;
    if (!routePromises.has(key)) {
      const modules = expandChestDependencies(CHEST[route] || []);
      const sources = modules.map(function (file) { return "./js/" + file; });
      routePromises.set(key, ensureChestBootstrap().then(function () {
        return loadSequentially(sources);
      }).then(function () {
        chestRoutesReady.add(route);
      }).catch(function (error) {
        routePromises.delete(key);
        throw error;
      }));
    }
    return routePromises.get(key);
  }

  const FL_JS_RESOURCE_GITHUB_BASE = 'https://fengling1314ovo.github.io/';
  let flJsResourceSource = 'github';
  window.flGetJsResourceSource = function(){ return flJsResourceSource; };
  window.flSetJsResourceSource = function(source){
    flJsResourceSource = source === 'github' ? 'github' : 'fengling';
    window.dispatchEvent(new CustomEvent('fl-js-resource-source-changed', {detail:{source:flJsResourceSource}}));
    return flJsResourceSource;
  };
  window.flGetJsResourceSourceForUrl = function(source){
    try{
      const url = new URL(source, document.baseURI);
      return url.hostname.toLowerCase() === 'fengling1314ovo.github.io' ? 'github' : 'fengling';
    }catch(error){ return 'fengling'; }
  };
  window.flResolveJsResourceUrl = function(source, sourceOverride){
    const url = new URL(source, document.baseURI);
    const activeSource = sourceOverride === 'github' || sourceOverride === 'fengling' ? sourceOverride : flJsResourceSource;
    if(activeSource !== 'github') return url.href;
    const jsFolder = url.pathname.lastIndexOf('/js/');
    if(jsFolder < 0) return url.href;
    const mirrorUrl = new URL(url.pathname.slice(jsFolder + 1), FL_JS_RESOURCE_GITHUB_BASE);
    mirrorUrl.search = url.search;
    mirrorUrl.hash = url.hash;
    return mirrorUrl.href;
  };
  function flResourceFileName(source){
    try{
      const url = new URL(source, document.baseURI);
      return decodeURIComponent(url.pathname.split('/').pop() || '');
    }catch(error){
      return '';
    }
  }
  const resourcePreloadPromises = window.__flJsResourcePreloadPromises || (window.__flJsResourcePreloadPromises = new Map());
  function flPreloadScriptLink(url){
    if(resourcePreloadPromises.has(url)) return resourcePreloadPromises.get(url);
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = url;
    link.dataset.flJsResourcePreload = 'true';
    const pending = new Promise(function(resolve, reject){
      link.onload = function(){
        if(typeof window.flRecordJsResourceLoad === 'function') window.flRecordJsResourceLoad(url);
        resolve();
      };
      link.onerror = function(){
        link.remove();
        reject(new Error('脚本预加载失败：' + url));
      };
      document.head.appendChild(link);
    }).catch(function(error){
      resourcePreloadPromises.delete(url);
      throw error;
    });
    resourcePreloadPromises.set(url, pending);
    return pending;
  }
  function flPreloadOneScript(source, sourceOverride){
    const url = typeof window.flResolveJsResourceUrl === 'function'
      ? window.flResolveJsResourceUrl(source, sourceOverride)
      : new URL(source, document.baseURI).href;
    if(resourcePreloadPromises.has(url)) return resourcePreloadPromises.get(url);
    const scriptLoads = window.__flScriptPromiseCache;
    if(scriptLoads instanceof Map){
      const activeLoad = Array.from(scriptLoads.entries()).find(function(entry){
        return new URL(entry[0], document.baseURI).href === url;
      });
      if(activeLoad){
        const pending = Promise.resolve(activeLoad[1]).then(function(){
          if(typeof window.flRecordJsResourceLoad === 'function') window.flRecordJsResourceLoad(url);
        }).catch(function(){ return flPreloadScriptLink(url); });
        resourcePreloadPromises.set(url, pending);
        return pending;
      }
    }
    const existingScript = Array.from(document.scripts).some(function(script){
      if(!script.src) return false;
      try { return new URL(script.src, document.baseURI).href === url; } catch(error) { return false; }
    });
    if(existingScript){
      if(typeof window.flRecordJsResourceLoad === 'function') window.flRecordJsResourceLoad(url);
      return Promise.resolve();
    }
    return flPreloadScriptLink(url);
  }
  function flPreloadSourcesForResource(targetName){
    const homeRoutes = Object.keys(HOME).filter(function(route){
      return (HOME[route] || []).some(function(source){ return flResourceFileName(source) === targetName; });
    });
    if(homeRoutes.length){
      const homeSources = [];
      homeRoutes.forEach(function(route){ homeSources.push.apply(homeSources, HOME[route] || []); });
      return Array.from(new Set(homeSources));
    }
    if(targetName === 'toolbox.js'){
      return ['./js/toolbox.js?v=20261022-chest-core', './js/toolbox-chest-core.js'];
    }
    const chestModules = Array.from(new Set(Object.values(T).filter(function(source){
      return flResourceFileName('./js/' + source) === targetName;
    })));
    if(chestModules.length){
      const sources = ['./js/toolbox.js?v=20261022-chest-core', './js/toolbox-chest-core.js'];
      expandChestDependencies(chestModules).forEach(function(file){ sources.push('./js/' + file); });
      return Array.from(new Set(sources));
    }
    const staticScript = Array.from(document.scripts).find(function(script){
      return script.src && flResourceFileName(script.src) === targetName;
    });
    if(staticScript) return [staticScript.src];
    return ['./js/' + targetName];
  }
  window.flPreloadJsResource = function(fileName, options){
    const targetName = String(fileName || '').trim();
    if(!targetName) return Promise.reject(new Error('缺少 JS 文件名'));
    const sources = flPreloadSourcesForResource(targetName);
    const sourceOverride = options && (options.source === 'github' || options.source === 'fengling') ? options.source : undefined;
    return Promise.all(sources.map(function(source){ return flPreloadOneScript(source, sourceOverride); }));
  };
  function errorFileName(error) {
    const message = error && error.message ? error.message : String(error || "未知错误");
    const match = message.match(/([^/\\]+\.js)(?:$|[?#])/i);
    if (match) {
      try { return decodeURIComponent(match[1]); } catch (_) { return match[1]; }
    }
    return message.slice(0, 100);
  }

  const failedPageViews = new Map();

  function makeLoadErrorCard(message, detail, retryAction) {
    const card = document.createElement("div");
    card.className = "fl-tool-load-error";
    const heading = document.createElement("div");
    heading.className = "fl-tool-load-error__message";
    heading.textContent = message;
    card.appendChild(heading);
    if (detail) {
      const detailLine = document.createElement("div");
      detailLine.className = "fl-tool-load-error__detail";
      detailLine.textContent = detail;
      card.appendChild(detailLine);
    }
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "common-btn fl-tool-load-error__retry";
    retry.textContent = "重试加载";
    retry.addEventListener("click", function () {
      retry.disabled = true;
      retry.textContent = "正在重试…";
      if (typeof retryAction === "function") retryAction();
    });
    card.appendChild(retry);
    return card;
  }

  window.flRenderLoadErrorCard = makeLoadErrorCard;

  function restoreFailedPage(route) {
    const state = failedPageViews.get(route);
    if (!state) return;
    state.host.replaceChildren.apply(state.host, state.nodes);
    failedPageViews.delete(route);
  }

  function createRouteLoadErrorShell(route){
    const root = document.getElementById("toolPagesRoot");
    if(!root) return null;
    let shell = Array.from(root.querySelectorAll("[data-fl-load-error-route]")).find(function(page){ return page.dataset.flLoadErrorRoute === route; });
    if(shell) return shell;
    shell = document.createElement("section");
    shell.className = "tool-page fl-tool-load-error-shell";
    shell.id = "flLoadErrorShell-" + String(route).replace(/[^A-Za-z0-9_-]/g, "-");
    shell.dataset.flLoadErrorRoute = route;
    shell.style.display = "none";
    const header = document.createElement("div");
    header.className = "tool-header";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "back-btn";
    back.textContent = "← 返回首页";
    back.onclick = function(){ window.goHome(); };
    header.appendChild(back);
    const crumb = document.createElement("div");
    crumb.className = "breadcrumb";
    crumb.innerHTML = '<a onclick="goHome()">首页</a><span class="sep">/</span><span class="current"></span>';
    crumb.querySelector(".current").textContent = route;
    const content = document.createElement("div");
    content.className = "common-block fl-tool-load-error-shell__content";
    shell.append(header, crumb, content);
    if(typeof window.flNormalizeToolPageHeader === 'function') window.flNormalizeToolPageHeader(shell);
    root.appendChild(shell);
    if(typeof window.flRefreshToolPageReferences === "function") window.flRefreshToolPageReferences();
    return shell;
  }

  function showRouteShell(route, isChest) {
    if(!route) return;
    const previousNav = document.querySelector('body > .sticky-nav.chest-float-nav');
    const previousHeaderHeight = previousNav ? previousNav.getBoundingClientRect().height : 0;
    const previousChestState = window.__flChestScriptsLoaded;
    if(isChest && !previousChestState) window.__flChestScriptsLoaded = true;
    window.__flShowLoadErrorShellFor = route;
    try {
      if(typeof originalOpenPage === "function") originalOpenPage.call(window, route);
    } catch (error) {
      console.warn("Could not finish opening the tool shell:", error);
    } finally {
      window.__flShowLoadErrorShellFor = null;
      if(isChest && !previousChestState) window.__flChestScriptsLoaded = previousChestState;
    }
    const visiblePage = Array.from(document.querySelectorAll("#toolPagesRoot > .tool-page")).find(function(page){
      return window.getComputedStyle(page).display !== "none";
    });
    if(visiblePage) return;
    const shell = createRouteLoadErrorShell(route);
    if(!shell) return;
    const home = document.querySelector(".page-home");
    if(home) home.style.display = "none";
    Array.from(document.querySelectorAll("#toolPagesRoot > .tool-page")).forEach(function(page){ page.style.display = "none"; });
    shell.style.display = "block";
    if(typeof window._liftStickyNav === "function" ) window._liftStickyNav(shell, previousHeaderHeight);
    if(typeof currentPageName !== "undefined") currentPageName = route;
  }

  function showToolLoadFailure(route, error, isChest, retryAction) {
    console.error(error);
    showRouteShell(route, isChest);
    const page = Array.from(document.querySelectorAll(".tool-page")).find(function (candidate) {
      return window.getComputedStyle(candidate).display !== "none";
    });
    const host = page && (page.querySelector(".common-block") || page);
    if (!host) {
      if (typeof window.showToast === "function") window.showToast("工具脚本加载失败：" + errorFileName(error));
      return;
    }

    let state = failedPageViews.get(route);
    if (!state || state.host !== host) {
      state = { host: host, nodes: Array.from(host.childNodes) };
      failedPageViews.set(route, state);
    }
    const retry = retryAction || function () { window.openPage(route); };
    const card = makeLoadErrorCard("工具加载失败，请检查网络后重试。", errorFileName(error), retry);
    host.replaceChildren(card);
  }

  window.flShowToolLoadFailure = function (route, error, retryAction) {
    showToolLoadFailure(route, error, Object.prototype.hasOwnProperty.call(CHEST, route), retryAction);
  };

  function reportLoadFailure(error, isChest, route) {
    showToolLoadFailure(route, error, isChest);
  }

  function reportOpenFailure(error, isChest, route) {
    showToolLoadFailure(route, error, isChest);
  }

  window.flOpenMainSiteConfirmModal = function () {
    const modal = document.getElementById("flMainSiteConfirmMask");
    if (modal) modal.style.display = "flex";
  };
  window.flCloseMainSiteConfirmModal = function () {
    closeModalAnimated("flMainSiteConfirmMask");
  };
  window.flConfirmOpenMainSite = function () {
    window.open("https://fengling.co", "_blank", "noopener,noreferrer");
    window.flCloseMainSiteConfirmModal();
  };
  window.flOpenSourceConfirmModal = function () {
    const modal = document.getElementById("flOpenSourceConfirmMask");
    if (modal) modal.style.display = "flex";
  };
  window.flCloseSourceConfirmModal = function () {
    closeModalAnimated("flOpenSourceConfirmMask");
  };
  window.flConfirmOpenSource = function () {
    window.open("https://github.com/fengling1314ovo/fengling1314ovo.github.io", "_blank", "noopener,noreferrer");
    window.flCloseSourceConfirmModal();
  };
  window.flOpenRefreshConfirmModal = function () {
    const modal = document.getElementById("flRefreshConfirmMask");
    if (!modal) return;
    modal.classList.remove("closing");
    modal.style.display = "flex";
  };
  window.flCloseRefreshConfirmModal = function () {
    closeModalAnimated("flRefreshConfirmMask");
  };
  window.flConfirmRefreshSite = function () {
    window.flCloseRefreshConfirmModal();
    setTimeout(function () { refreshSite(); }, 220);
  };
  window.flOpenMysteryCodeModal = function () {
    if (typeof window.openCodeModal === "function") {
      window.openCodeModal();
      return;
    }
    ensureChestRoute("jinriPage").then(function () {
      if (typeof window.openCodeModal !== "function") throw new Error("神秘代码功能未就绪");
      window.openCodeModal();
    }).catch(function (error) {
      console.error(error);
      if (typeof window.showToast === "function") window.showToast("神秘代码加载失败，请重试");
    });
  };
  if (typeof originalOpenPage === "function") {
    window.openPage = function (route) {
      const version = ++navigationVersion;
      const args = arguments;
      const context = this;
      const isChest = Object.prototype.hasOwnProperty.call(CHEST, route);
      const files = HOME[route];
      if (!isChest && (!files || !files.length)) return originalOpenPage.apply(context, args);
      const load = isChest ? ensureChestRoute(route) : ensureHomeRoute(route);
      load.then(function () {
        if (version !== navigationVersion) return;
        try {
          restoreFailedPage(route);
          originalOpenPage.apply(context, args);
          const opened = Array.from(document.querySelectorAll("#toolPagesRoot > .tool-page")).find(function(page){ return window.getComputedStyle(page).display !== "none"; });
          if(!opened) throw new Error("工具页面模板尚未注册：" + route);
          const fallback = Array.from(document.querySelectorAll("#toolPagesRoot > [data-fl-load-error-route]")).find(function(page){ return page.dataset.flLoadErrorRoute === route; });
          if(fallback){ fallback.remove(); if(typeof window.flRefreshToolPageReferences === "function") window.flRefreshToolPageReferences(); }
        } catch (error) {
          reportOpenFailure(error, isChest, route);
          return;
        }

      }).catch(function (error) { reportLoadFailure(error, isChest, route); });
    };
  }

  if (typeof originalGoHome === "function") {
    window.goHome = function () {
      navigationVersion++;
      return originalGoHome.apply(this, arguments);
    };
  }
})();
