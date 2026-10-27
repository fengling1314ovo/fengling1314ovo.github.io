// ==================== 全局搜索 ====================
const TOOL_INDEX = [
  // 首页 - 实用工具
  {name:'二维码生成',desc:'支持Logo、PNG/SVG下载、本地历史',cat:'实用工具',source:'home',page:'qrcode',icon:'📷'},
  {name:'条形码生成',desc:'支持8种格式、自定义颜色、PNG下载',cat:'实用工具',source:'home',page:'barcode',icon:'📊'},
  {name:'扫码识别',desc:'摄像头扫描/图片识别条码和二维码',cat:'实用工具',source:'home',page:'scanner',icon:'📷'},
  {name:'汇率换算',desc:'实时汇率，支持30+主流货币',cat:'实用工具',source:'home',page:'currency',icon:'💱'},
  {name:'IP查询',desc:'查询IP归属地、运营商',cat:'实用工具',source:'home',page:'iplookup',icon:'🌐'},
  {name:'查询服务器IP',desc:'查询网站域名IP、DNS记录',cat:'实用工具',source:'home',page:'dnsquery',icon:'🔍'},
  {name:'域名注册查询',desc:'查询域名是否已被注册',cat:'实用工具',source:'home',page:'domaincheck',icon:'🌐'},
  {name:'天气查询',desc:'查询城市实时天气、温度',cat:'实用工具',source:'home',page:'weather',icon:'🌤️'},
  {name:'AES加密',desc:'AES-GCM加密解密，支持256位',cat:'实用工具',source:'home',page:'aes',icon:'🔐'},
  {name:'天数计算',desc:'计算两个日期相差天数',cat:'实用工具',source:'home',page:'daycalc',icon:'📅'},
  {name:'视频提取音频',desc:'从视频中提取音轨并导出WAV',cat:'实用工具',source:'home',page:'videoaudio',icon:'🎵'},
  {name:'音频转换',desc:'转换、裁剪常见音频，并提取加密音频',cat:'实用工具',source:'home',page:'audioConvert',icon:'🎶'},
  {name:'网站状态检测',desc:'检测网站是否在线及响应速度',cat:'实用工具',source:'home',page:'sitecheck',icon:'🔍'},
  {name:'QQ快捷工具',desc:'打开QQ资料卡、发起聊天',cat:'实用工具',source:'home',page:'qq',icon:'👤'},
  {name:'QQ群快捷工具',desc:'唤起QQ群卡片、复制群协议',cat:'实用工具',source:'home',page:'qqgroup',icon:'👥'},
  {name:'文本处理',desc:'大小写、去空格、编码解码',cat:'实用工具',source:'home',page:'textutil',icon:'📝'},
  {name:'随机数生成',desc:'生成指定范围随机整数',cat:'实用工具',source:'home',page:'random',icon:'🎲'},
  {name:'Base64编解码',desc:'文本Base64编码解码',cat:'实用工具',source:'home',page:'base64',icon:'🔐'},
  {name:'密码生成器',desc:'可配置强度随机密码',cat:'实用工具',source:'home',page:'passwordPage',icon:'🔑'},
  {name:'体重计算器',desc:'BMI分级建议+状态记忆',cat:'实用工具',source:'home',page:'bmiPage',icon:'⚖️'},
  {name:'摩斯密码',desc:'文本↔摩斯密码互转',cat:'实用工具',source:'home',page:'morsePage',icon:'📡'},
  {name:'数字文本生成',desc:'序列/前缀后缀/补零/打乱',cat:'实用工具',source:'home',page:'numgen',icon:'🔢'},
  {name:'密码强度检测',desc:'实时评分+熵值+改进建议',cat:'实用工具',source:'home',page:'pwcheck',icon:'🛡️'},
  {name:'单位换算器',desc:'长度/重量/温度/面积等7类单位换算',cat:'实用工具',source:'home',page:'unitConverter',icon:'📐'},
  // 百宝箱 - 趣味
  {name:'掷骰子',desc:'多颗骰子随机点数+历史',cat:'趣味',source:'chest',page:'dicePage',icon:'🎲'},
  {name:'抛硬币',desc:'翻转动画+正反面统计',cat:'趣味',source:'chest',page:'coinPage',icon:'🪙'},
  {name:'今天吃什么',desc:'自定义美食列表',cat:'趣味',source:'chest',page:'eatPage',icon:'🍔'},
  {name:'是或否决策器',desc:'帮你拿主意+历史',cat:'趣味',source:'chest',page:'yesnoPage',icon:'🎯'},
  {name:'抽签',desc:'自定义签文随机抽取',cat:'趣味',source:'chest',page:'fortunePage',icon:'🎋'},
  {name:'抽卡模拟器',desc:'单抽/十连+SSR概率',cat:'趣味',source:'chest',page:'gachaPage',icon:'🎴'},
  {name:'石头剪刀布',desc:'人机对战+胜率统计',cat:'趣味',source:'chest',page:'rpsPage',icon:'✊'},
  {name:'魔法8球',desc:'摇动球获取答案',cat:'趣味',source:'chest',page:'magic8Page',icon:'🔮'},
  {name:'真心话大冒险',desc:'聚会破冰必玩',cat:'趣味',source:'chest',page:'truthDarePage',icon:'🎤'},
  {name:'冷笑话大全',desc:'随机冷段子',cat:'趣味',source:'chest',page:'jokesPage',icon:'🧊'},
  {name:'脑筋急转弯',desc:'考考你的脑洞',cat:'趣味',source:'chest',page:'riddlesPage',icon:'🤔'},
  {name:'24点',desc:'加减乘除凑24',cat:'趣味',source:'chest',page:'game24Page',icon:'➗'},
  {name:'成语接龙',desc:'接龙挑战词汇量',cat:'趣味',source:'chest',page:'idiomChainPage',icon:'🐲'},
  {name:'读心术',desc:'猜出你心里想的数',cat:'趣味',source:'chest',page:'mindReadingPage',icon:'🃏'},
  // 百宝箱 - 游戏
  {name:'扫雷',desc:'经典踩雷游戏',cat:'游戏',source:'chest',page:'minesweeperPage',icon:'💣'},
  {name:'井字棋',desc:'人机对战井字棋',cat:'游戏',source:'chest',page:'tttPage',icon:'⭕'},
  {name:'记忆翻牌',desc:'翻牌配对考验记忆',cat:'游戏',source:'chest',page:'memoryPage',icon:'🃏'},
  {name:'打地鼠',desc:'限时打地鼠计分',cat:'游戏',source:'chest',page:'whackPage',icon:'🔨'},
  {name:'猜数字',desc:'1-100猜数字游戏',cat:'游戏',source:'chest',page:'guessPage',icon:'🎯'},
  {name:'老虎机',desc:'旋转滚轮赢取金币',cat:'游戏',source:'chest',page:'slotPage',icon:'🎰'},
  {name:'俄罗斯方块',desc:'消行计分+速度递增',cat:'游戏',source:'chest',page:'tetrisPage',icon:'🧱'},
  {name:'五子棋',desc:'人机对战五子连珠',cat:'游戏',source:'chest',page:'gomokuPage',icon:'⚫'},
  {name:'2048',desc:'滑动合成数字',cat:'游戏',source:'chest',page:'game2048Page',icon:'🔢'},
  {name:'打砖块',desc:'挡板弹球消砖块',cat:'游戏',source:'chest',page:'breakoutPage',icon:'🏓'},
  {name:'打弹珠',desc:'经典弹珠台弹射得分',cat:'游戏',source:'chest',page:'pinballPage',icon:'🔮'},
  {name:'弹珠商店',desc:'购买各种颜色的弹珠',cat:'游戏',source:'chest',page:'pinballShopPage',icon:'🛒'},
  {name:'别踩白块',desc:'点击黑块别踩白',cat:'游戏',source:'chest',page:'pianoPage',icon:'🎹'},
  {name:'找不同',desc:'限时找出所有差异',cat:'游戏',source:'chest',page:'spotDiffPage',icon:'🔍'},
  {name:'消消乐',desc:'三消连线赢金币',cat:'游戏',source:'chest',page:'match3Page',icon:'🍎'},
  {name:'打字练习',desc:'练手速赢金币',cat:'游戏',source:'chest',page:'typingPage',icon:'⌨️'},
  {name:'连连看',desc:'配对连线消除',cat:'游戏',source:'chest',page:'linkGamePage',icon:'🔗'},
  // 百宝箱 - 测算
  {name:'今日运势',desc:'每日固定运势测算',cat:'测算',source:'chest',page:'fortuneTodayPage',icon:'🌟'},
  {name:'今日人品',desc:'每日人品值检测',cat:'测算',source:'chest',page:'jinriPage',icon:'🍀'},
  {name:'星座运势',desc:'12星座每日运势',cat:'测算',source:'chest',page:'zodiacPage',icon:'♈'},
  {name:'生肖配对',desc:'生肖契合度测算',cat:'测算',source:'chest',page:'zodiacMatchPage',icon:'🐉'},
  {name:'姓名配对',desc:'输入名字算缘分',cat:'测算',source:'chest',page:'nameMatchPage',icon:'💕'},
  {name:'心理年龄测试',desc:'测测你的心理年龄',cat:'测算',source:'chest',page:'mentalAgePage',icon:'🧠'},
  {name:'左右脑测试',desc:'测你是左脑还是右脑型',cat:'测算',source:'chest',page:'brainTestPage',icon:'🧩'},
  {name:'前世身份',desc:'输入名字测前世（纯娱乐）',cat:'测算',source:'chest',page:'pastLifePage',icon:'🏛️'},
  {name:'塔罗牌占卜',desc:'抽牌看运势（娱乐）',cat:'测算',source:'chest',page:'tarotPage',icon:'🔮'},
  {name:'周公解梦',desc:'输入梦境关键词查询',cat:'测算',source:'chest',page:'dreamPage',icon:'💤'},
  {name:'MBTI人格测试',desc:'测出你的16型人格',cat:'测算',source:'chest',page:'mbtiPage',icon:'🧬'},
  {name:'IQ智商测试',desc:'趣味智商小测验',cat:'测算',source:'chest',page:'iqPage',icon:'🧠'},
  {name:'血型配对',desc:'血型契合度测算',cat:'测算',source:'chest',page:'bloodMatchPage',icon:'🩸'},
  {name:'测字',desc:'一字测运势（娱乐）',cat:'测算',source:'chest',page:'charDivPage',icon:'🔤'},
  {name:'占星骰子',desc:'行星·星座·宫位三骰占卜',cat:'测算',source:'chest',page:'astrodicePage',icon:'🎲'},
  {name:'符文占卜',desc:'北欧卢恩符文抽牌解读',cat:'测算',source:'chest',page:'runePage',icon:'🪨'},
  {name:'灵摆占卜',desc:'输入问题看灵摆摆动方向',cat:'测算',source:'chest',page:'pendulumPage',icon:'🔮'},
  {name:'雷诺曼卡牌',desc:'36张牌简单直接的占卜',cat:'测算',source:'chest',page:'lenormandPage',icon:'🎴'},
  {name:'天使神谕卡',desc:'治愈系神谕卡指引',cat:'测算',source:'chest',page:'oraclePage',icon:'👼'},
  {name:'基博卡',desc:'德国传统生活卡牌占卜',cat:'测算',source:'chest',page:'kipperPage',icon:'🃏'},
  {name:'数字命理学',desc:'生日算生命数字运势',cat:'测算',source:'chest',page:'numerologyPage',icon:'🔢'},
  {name:'茶叶占卜',desc:'看茶杯底茶叶形状解读',cat:'测算',source:'chest',page:'tealeafPage',icon:'🍵'},
  {name:'水晶球占卜',desc:'凝视水晶球获取启示',cat:'测算',source:'chest',page:'crystalballPage',icon:'🔮'},
  // 百宝箱 - 生活
  {name:'亲戚称呼计算器',desc:'过年叫人不尴尬',cat:'生活',source:'home',page:'relativePage',icon:'👨‍👩‍👧'},
  {name:'年龄计算器',desc:'精确到天的年龄计算',cat:'生活',source:'home',page:'agePage',icon:'🎂'},
  {name:'幸运转盘',desc:'多转盘抽金币道具',cat:'游戏',source:'chest',page:'wheelPage',icon:'🎡'},
  // 百宝箱 - 文字
  {name:'藏头诗生成',desc:'输入字生成藏头诗',cat:'文字',source:'chest',page:'acrosticPage',icon:'📜'},
  // 百宝箱 - 福利
  {name:'每日任务',desc:'签到+做任务领金币',cat:'福利',source:'chest',page:'dailyTaskPage',icon:'📋'},
  {name:'扭蛋机',desc:'5金币一次',cat:'福利',source:'chest',page:'capsulePage',icon:'🥚'},
  {name:'成就徽章',desc:'达成领奖励',cat:'福利',source:'chest',page:'achievementPage',icon:'🏅'},
  // 首页 - 其他实用工具
  {name:'凯撒密码',desc:'文本加密解密',cat:'实用工具',source:'home',page:'caesarPage',icon:'🔏'},
  {name:'进制转换',desc:'2/8/10/16进制互转',cat:'实用工具',source:'home',page:'hexconvert',icon:'🔢'},
  {name:'UUID生成',desc:'批量生成UUID v4',cat:'实用工具',source:'home',page:'uuidgen',icon:'🆔'},
  {name:'JSON格式化',desc:'JSON美化/压缩/校验',cat:'实用工具',source:'home',page:'jsonfmt',icon:'📋'},
  {name:'时间戳转换',desc:'时间 ↔ 时间戳互转',cat:'实用工具',source:'home',page:'timestamp',icon:'⏱️'},
  {name:'刷新率测试',desc:'检测屏幕实际刷新率',cat:'实用工具',source:'home',page:'refreshrate',icon:'📺'},
  {name:'纪念日倒计时',desc:'添加纪念日本地保存',cat:'实用工具',source:'home',page:'anniversaryPage',icon:'📅'},
  {name:'排卵期计算器',desc:'排卵期安全期测算',cat:'实用工具',source:'home',page:'ovulationPage',icon:'🌸'},
  {name:'随机点名',desc:'输入名单随机抽取',cat:'实用工具',source:'home',page:'rollCallPage',icon:'📢'},
  {name:'随机分组',desc:'名单自动随机分组',cat:'实用工具',source:'home',page:'groupPage',icon:'👥'},
  {name:'文字反转',desc:'文字倒序/反转输出',cat:'实用工具',source:'home',page:'reverseTextPage',icon:'🔄'},
  {name:'卡路里计算器',desc:'每日所需热量计算',cat:'实用工具',source:'home',page:'caloriePage',icon:'🔥'},
  {name:'国庆头像生成',desc:'上传头像一键生成国庆装饰',cat:'图片',source:'home',page:'avatarMaker',icon:'🇨🇳'},
];

const searchInput = document.getElementById('globalSearch');
const searchResults = document.getElementById('searchResults');
const searchClear = document.getElementById('searchClear');
let searchDebounceTimer = null;

searchInput.addEventListener('input', function(){
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(doSearch, 150);
});

searchInput.addEventListener('focus', function(){
  if(this.value.trim()) doSearch();
});

searchClear.addEventListener('click', function(){
  searchInput.value = '';
  searchResults.style.display = 'none';
  searchClear.style.display = 'none';
  searchInput.focus();
});

document.addEventListener('click', function(e){
  if(!e.target.closest('.search-wrap')){
    searchResults.style.display = 'none';
  }
});

function doSearch(){
  const q = searchInput.value.trim().toLowerCase();
  searchClear.style.display = q ? 'flex' : 'none';
  if(!q){
    searchResults.style.display = 'none';
    return;
  }
  const results = TOOL_INDEX.filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.desc.toLowerCase().includes(q) ||
    t.cat.toLowerCase().includes(q)
  ).slice(0, 12);

  if(results.length === 0){
    searchResults.innerHTML = '<div class="search-empty">🔍 没有找到相关工具，换个关键词试试</div>';
  } else {
    searchResults.innerHTML = results.map(t =>
      '<div class="search-result-item" data-source="'+t.source+'" data-page="'+t.page+'" data-name="'+t.name+'">' +
        '<span class="sr-icon">'+t.icon+'</span>' +
        '<div class="sr-info">' +
          '<div class="sr-title">'+t.name+'</div>' +
          '<div class="sr-desc">'+t.desc+'</div>' +
        '</div>' +
        '<span class="sr-cat">'+t.cat+'</span>' +
      '</div>'
    ).join('');
  }
  searchResults.style.display = 'block';

  searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', function(){
      const source = this.dataset.source;
      const page = this.dataset.page;
      const name = this.dataset.name;
      searchResults.style.display = 'none';
      searchInput.value = '';
      searchClear.style.display = 'none';
      if(source === 'home'){
        openPage(page);
      } else if(source === 'chest'){
        openChestTool(page, name);
      }
    });
  });
}

/* 统一吸顶导航：给所有工具页面的顶部导航包上 sticky-nav */
(function(){
  function wrapStickyNav(){
    document.querySelectorAll('.tool-page').forEach(function(page){
      if(page.querySelector(':scope > .sticky-nav')) return;
      var header = page.querySelector(':scope > .tool-header');
      if(!header) return;
      var wrap = document.createElement('div');
      wrap.className = 'sticky-nav';
      page.insertBefore(wrap, header);
      wrap.appendChild(header);
      // 收集该页面所有面包屑，全部收进吸顶栏（不论是否紧跟在 header 后）
      page.querySelectorAll(':scope > .breadcrumb').forEach(function(bc){
        wrap.appendChild(bc);
      });
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){
      wrapStickyNav();
      if(typeof _liftStickyNav === 'function') _liftStickyNav(pageHome);
    });
  } else {
    wrapStickyNav();
    if(typeof _liftStickyNav === 'function') _liftStickyNav(pageHome);
  }
})();

// 禁止移动端双击放大和双指缩放
(function(){
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function(e){
    var now = Date.now();
    if(now - lastTouchEnd <= 300){
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, {passive: false});
  document.addEventListener('gesturestart', function(e){
    e.preventDefault();
  });
})();

