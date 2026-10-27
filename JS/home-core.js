/* 全站动态脚本加载缓存与顶部下载状态提示。 */
(function(){
  const active = new Map();
  let hideTimer = null;
  let removeTimer = null;
  let noticeElement = null;
  function getNotice(){
    if(!noticeElement) noticeElement = document.getElementById('flScriptDownloadNotice');
    return noticeElement;
  }
  function getFileName(value){
    try{
      const pathname = new URL(value, document.baseURI).pathname;
      return decodeURIComponent(pathname.split('/').pop()) || value;
    }catch(e){
      return String(value).split('/').pop() || String(value);
    }
  }
  function getToolName(value){
    return getFileName(value)
      .replace(/\.js$/i,'')
      .replace(/^(?:home|toolbox)-\d+-/i,'')
      .trim();
  }
  function getLoadingText(){
    const names = Array.from(active.values());
    return names.length ? '正在载入：' + names.join('、') : '正在载入';
  }
  function showNotice(){
    const notice = getNotice();
    const container = document.getElementById('toastContainer');
    if(!notice) return null;
    clearTimeout(removeTimer);
    if(container && notice.parentNode !== container){
      while(container.children.length >= 3){
        container.removeChild(container.firstElementChild);
      }
      notice.classList.add('toast');
      container.appendChild(notice);
    }
    notice.classList.add('is-visible');
    return notice;
  }
  function setNotice(text, state){
    const notice = showNotice();
    if(!notice) return;
    const label = notice.querySelector('.fl-script-download-notice__text');
    if(label) label.textContent = text;
    notice.classList.remove('is-done','is-error');
    if(state) notice.classList.add(state);
  }
  function scheduleHide(delay){
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function(){
      const notice = getNotice();
      if(!notice) return;
      notice.classList.remove('is-visible');
      clearTimeout(removeTimer);
      removeTimer = setTimeout(function(){
        const container = document.getElementById('toastContainer');
        if(container && notice.parentNode === container) container.removeChild(notice);
      }, 250);
    }, delay);
  }
  window.flScriptLoadStarted = function(url){
    clearTimeout(hideTimer);
    active.set(url, getToolName(url));
    setNotice(getLoadingText(), '');
  };
  window.flScriptLoadFinished = function(url, failed){
    const name = active.get(url) || getToolName(url);
    active.delete(url);
    if(failed){
      const stillLoading = Array.from(active.values());
      setNotice(stillLoading.length
        ? '⚠️ 载入失败：' + name + '；仍在载入：' + stillLoading.join('、')
        : '⚠️ JS 载入失败：' + name, 'is-error');
      scheduleHide(2600);
      return;
    }
    const stillLoading = Array.from(active.values());
    if(stillLoading.length){
      setNotice(getLoadingText(), '');
      return;
    }
    setNotice('✅ 载入完成', 'is-done');
    scheduleHide(900);
  };
})();
const FL_JS_RESOURCE_STORAGE_KEY = 'fl-js-resource-cache-records-v1';
window.__flLoadedJsResources = window.__flLoadedJsResources || new Set();
const flLoadedJsResources = window.__flLoadedJsResources;
function flGetSavedJsResourceNames(savedRecords){
  let names = [];
  if(Array.isArray(savedRecords)) names = savedRecords;
  else if(savedRecords && typeof savedRecords === 'object'){
    ['fengling','github'].forEach(function(source){
      if(Array.isArray(savedRecords[source])) names.push.apply(names, savedRecords[source]);
    });
  }
  return names.filter(function(name){ return typeof name === 'string' && name.toLowerCase().endsWith('.js'); });
}
try{
  const savedResourceRecords = JSON.parse(localStorage.getItem(FL_JS_RESOURCE_STORAGE_KEY) || '[]');
  flGetSavedJsResourceNames(savedResourceRecords).forEach(function(name){ flLoadedJsResources.add(name); });
}catch(error){}
function flRecordJsResourceLoad(source){
  let fileName = '';
  let sourceId = 'fengling';
  try{
    const loadedUrl = new URL(source, document.baseURI);
    const path = decodeURIComponent(loadedUrl.pathname);
    const jsFolder = path.lastIndexOf('/js/');
    if(jsFolder < 0) return;
    fileName = path.slice(jsFolder + 4).split('/')[0];
    if(!fileName.toLowerCase().endsWith('.js')) return;
    if(typeof window.flGetJsResourceSourceForUrl === 'function') sourceId = window.flGetJsResourceSourceForUrl(loadedUrl.href);
    else if(loadedUrl.hostname.toLowerCase() === 'fengling1314ovo.github.io') sourceId = 'github';
  }catch(error){
    return;
  }
  flLoadedJsResources.add(fileName);
  try{
    const savedResourceRecords = JSON.parse(localStorage.getItem(FL_JS_RESOURCE_STORAGE_KEY) || '[]');
    const savedNames = flGetSavedJsResourceNames(savedResourceRecords);
    savedNames.push(fileName);
    localStorage.setItem(FL_JS_RESOURCE_STORAGE_KEY, JSON.stringify(Array.from(new Set(savedNames))));
  }catch(error){}
  window.dispatchEvent(new CustomEvent('fl-js-resource-loaded', {detail:{fileName:fileName, source:sourceId}}));
}
window.flLoadScriptOnce = window.flLoadScriptOnce || function (source) {
  // 通用工具加载固定使用当前枫铃站点地址；资源页的预加载另行解析下载源。
  const url = new URL(source, document.baseURI).href;
  const cache = window.__flScriptPromiseCache || (window.__flScriptPromiseCache = new Map());
  if (cache.has(url)) return cache.get(url);
  const script = document.createElement('script');
  script.async = false;
  script.src = url;
  const pending = new Promise(function (resolve, reject) {
    if(typeof window.flScriptLoadStarted === 'function') window.flScriptLoadStarted(url);
    script.onload = function(){
      if(typeof window.flScriptLoadFinished === 'function') window.flScriptLoadFinished(url, false);
      flRecordJsResourceLoad(url);
      resolve();
    };
    script.onerror = function () {
      if(typeof window.flScriptLoadFinished === 'function') window.flScriptLoadFinished(url, true);
      script.remove();
    reject(new Error('脚本载入失败：' + url));
    };
    document.head.appendChild(script);
  }).catch(function (error) {
    cache.delete(url);
    throw error;
  });
  cache.set(url, pending);
  return pending;
};
/* 首页工具、共享路由与公共逻辑。 *//* 首页工具、共享路由与公共逻辑。 */

// 首页与共享弹窗使用的通用关闭动画，不依赖百宝箱脚本。
function closeModalAnimated(maskOrId, delay){
  const mask = typeof maskOrId === 'string' ? document.getElementById(maskOrId) : maskOrId;
  if(!mask) return;
  mask.classList.add('closing');
  document.body.style.overflow='';
  setTimeout(()=>{
    mask.style.display='none';
    mask.classList.remove('closing');
  }, delay || 200);
}

// “关于本站”属于首页基础信息，不依赖账号管理脚本。
function flOpenAboutModal(){
  const start = new Date('2026-08-31T20:00:00');
  const now = new Date();
  const days = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
  const runDays = document.getElementById('flRunDays');
  if(runDays) runDays.textContent = days;
  const toggle = document.getElementById('aboutHideToggle');
  const slider = document.getElementById('aboutHideSlider');
  const dot = document.getElementById('aboutHideDot');
  if(toggle && slider && dot){
    const hidden = localStorage.getItem('hide_about_btn')==='1';
    toggle.checked = hidden;
    slider.style.background = hidden ? 'var(--primary)' : '#ccc';
    dot.style.transform = hidden ? 'translateX(18px)' : 'translateX(0)';
  }
  const modal = document.getElementById('flAboutModal');
  if(!modal) return;
  modal.classList.remove('closing');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
}
function toggleAboutHideFromModal(){
  const toggle = document.getElementById('aboutHideToggle');
  const slider = document.getElementById('aboutHideSlider');
  const dot = document.getElementById('aboutHideDot');
  if(!toggle) return;
  const hidden = toggle.checked;
  localStorage.setItem('hide_about_btn', hidden ? '1' : '0');
  if(slider) slider.style.background = hidden ? 'var(--primary)' : '#ccc';
  if(dot) dot.style.transform = hidden ? 'translateX(18px)' : 'translateX(0)';
  const btn = document.getElementById('flAboutBtn');
  if(btn) btn.style.display = hidden ? 'none' : '';
}
function refreshSite(){ location.reload(); }
function flCloseAboutModal(){ closeModalAnimated('flAboutModal'); }
function flOpenJsResourcesPage(){
  closeModalAnimated('flAboutModal');
  openPage('jsResourcesPage');
}
// ==================== 本地多账号系统（IIFE，必须在所有业务数据读取前执行） ====================
// 设计：每个账号 = localStorage 根级别的一份完整快照包。
// 启动时把当前账号快照"展开"到根级别；切换账号时把根级别"打包"回旧账号、再展开新账号。
// 业务代码里所有 lsGet/lsSet/直接 localStorage 调用无需改动，看到的根级别数据就是当前账号的数据。
(function(){
  const ACCT_KEY = 'fl_accounts';          // 账号列表
  const CUR_KEY  = 'fl_current_account'; // 当前账号 id
  const SAVE_PRE = 'fl_save_';            // 存档包前缀
  const CLOUD_TOKEN_KEY = 'fl_cloud_token'; // 云端登录token（全局，不随本地账号切换）
  const CLOUD_USER_KEY = 'fl_cloud_user';   // 云端用户信息（全局，不随本地账号切换）
  const RECENT_USERS_KEY = 'fl_recent_users'; // 最近登录账号（全局）
  function isAcctKey(k){
    return k===ACCT_KEY || k===CUR_KEY || k.indexOf(SAVE_PRE)===0
      || k===CLOUD_TOKEN_KEY || k===CLOUD_USER_KEY || k===RECENT_USERS_KEY
      || k==='profile_gender' || k==='profile_birthday' || k==='profile_province'
      || k==='rainbow_name';
  }
  // 把根级别（排除账号系统自身）数据打包成 {key: rawString}
  function packRoot(){
    const save = {};
    const ks = [];
    for(let i=0;i<localStorage.length;i++) ks.push(localStorage.key(i));
    ks.forEach(k=>{ if(!isAcctKey(k)) save[k] = localStorage.getItem(k); });
    return save;
  }
  // 清空根级别（排除账号系统自身）后写入快照
  function unpackRoot(save){
    const ks = [];
    for(let i=0;i<localStorage.length;i++) ks.push(localStorage.key(i));
    ks.forEach(k=>{ if(!isAcctKey(k)) localStorage.removeItem(k); });
    for(const k in save){ try{ localStorage.setItem(k, save[k]); }catch(e){} }
  }
  function getAccounts(){ try{ return JSON.parse(localStorage.getItem(ACCT_KEY))||[]; }catch(e){ return []; } }
  function setAccounts(list){ try{ localStorage.setItem(ACCT_KEY, JSON.stringify(list)); }catch(e){} }
  function genId(){ return 'a_' + Date.now().toString(36) + Math.random().toString(36).slice(2,8); }
  function coinFromSave(save){ try{ return Number(JSON.parse(save['backpack_coins']||'100'))||0; }catch(e){ return 0; } }
  window.__fl = {
    isAcctKey, packRoot, unpackRoot, getAccounts, setAccounts, genId, coinFromSave,
    SAVE_PRE, ACCT_KEY, CUR_KEY
  };
  let accounts = getAccounts();
  let currentId = localStorage.getItem(CUR_KEY);
  if(accounts.length === 0){
    // 首次运行：把现有根级别数据（或空数据）打包成第一个账号
    const save = packRoot();
    const id = genId();
    accounts.push({ id:id, name:'我的账号', avatar:'🙂', createdAt:Date.now(), lastActive:Date.now(), coin:coinFromSave(save), cloudCode:null, cloudTime:0 });
    try{ localStorage.setItem(SAVE_PRE+id, JSON.stringify(save)); }catch(e){}
    setAccounts(accounts);
    localStorage.setItem(CUR_KEY, id);
    // 根级别本来就是这份数据，无需清空重写
  } else {
    // 校验当前账号
    if(!accounts.find(a=>a.id===currentId)){
      currentId = accounts[0].id;
      localStorage.setItem(CUR_KEY, currentId);
    }
    // 【关键】启动时先把当前根级别（上次会话留下的实时数据）回存到当前账号快照。
    // 否则用户在两次刷新之间通过 lsSet 实时写进根级别的新进度，
    // 会被旧快照覆盖而丢失。回存后再展开，根级别保持一致。
    const liveSave = packRoot();
    try{ localStorage.setItem(SAVE_PRE+currentId, JSON.stringify(liveSave)); }catch(e){}
    unpackRoot(liveSave);
    const cur = accounts.find(a=>a.id===currentId);
    if(cur){ cur.lastActive = Date.now(); cur.coin = coinFromSave(liveSave); setAccounts(accounts); }
  }
})();
// ==================== 多账号系统结束 ====================

// ==================== 全局禁止复制与双击缩放 ====================
// 判断是否为输入框元素
function isInputElement(el){
  return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
}
// 禁止复制
document.addEventListener('copy', function(e){
  if(isInputElement(e.target)) return; // 输入框允许复制
  e.preventDefault();
  return false;
});
// 禁止剪切
document.addEventListener('cut', function(e){
  if(isInputElement(e.target)) return;
  e.preventDefault();
  return false;
});
// 禁止右键菜单/长按菜单
document.addEventListener('contextmenu', function(e){
  if(isInputElement(e.target)) return;
  e.preventDefault();
  return false;
});
// 禁止文本选择
document.addEventListener('selectstart', function(e){
  if(isInputElement(e.target)) return;
  e.preventDefault();
  return false;
});
// 注：双击缩放已通过CSS的 touch-action: manipulation 禁止，无需JavaScript事件阻止
// 注：iOS手势缩放已通过CSS的 user-scalable=no 和 maximum-scale=1.0 禁止

// 移动端按钮极速响应：touchend时立即触发，消除300ms延迟，松手时才触发
let touchStartTarget = null;
let touchStartX = 0;
let touchStartY = 0;
let lastTouchEndTime = 0;
let lastTouchEndTarget = null;
const SWIPE_THRESHOLD = 10; // 滑动超过10px视为滑动，不触发点击

// touchstart时记录目标元素和触摸位置
document.addEventListener('touchstart', function(e){
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  
  let target = e.target;
  touchStartTarget = null;
  while(target && target !== document.body){
    if(target.tagName === 'BUTTON' || target.tagName === 'A' || 
       target.onclick || target.getAttribute('onclick') ||
       target.classList.contains('common-btn') ||
       target.style.cursor === 'pointer'){
      touchStartTarget = target;
      break;
    }
    target = target.parentElement;
  }
}, {passive: true});

// touchend时立即触发点击（松手时才触发，无300ms延迟）
document.addEventListener('touchend', function(e){
  if(!touchStartTarget) return;
  
  const touch = e.changedTouches[0];
  
  // 检查滑动距离：如果滑动超过阈值，视为滑动操作，不触发点击
  const deltaX = Math.abs(touch.clientX - touchStartX);
  const deltaY = Math.abs(touch.clientY - touchStartY);
  if(deltaX > SWIPE_THRESHOLD || deltaY > SWIPE_THRESHOLD){
    touchStartTarget = null;
    return;
  }
  
  // 检查松手位置是否还在同一个元素上（用户没有滑走）
  const elAtPoint = document.elementFromPoint(touch.clientX, touch.clientY);
  let stillOnTarget = false;
  let checkEl = elAtPoint;
  while(checkEl && checkEl !== document.body){
    if(checkEl === touchStartTarget){
      stillOnTarget = true;
      break;
    }
    checkEl = checkEl.parentElement;
  }
  
  if(!stillOnTarget){
    touchStartTarget = null;
    return;
  }
  
  // 防抖：150ms内同一元素不重复触发
  const now = Date.now();
  if(now - lastTouchEndTime < 150 && lastTouchEndTarget === touchStartTarget){
    e.preventDefault();
    touchStartTarget = null;
    return;
  }
  lastTouchEndTime = now;
  lastTouchEndTarget = touchStartTarget;
  
  // 立即触发点击（松手时触发，无延迟）
  const target = touchStartTarget;
  touchStartTarget = null;
  target.click();
  e.preventDefault();
}, {passive: false});

// ==================== 全局工具函数 ====================
// Toast 轻量提示
function showToast(msg, duration){
  const container = document.getElementById('toastContainer');
  if(!container) return;
  while(container.children.length >= 3){
    container.removeChild(container.firstElementChild);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(()=>{ if(toast.parentNode) toast.parentNode.removeChild(toast); }, (duration||2500)+50);
}
// localStorage 安全读写
function lsGet(key, def){ try{ const v = localStorage.getItem(key); return v===null?def:JSON.parse(v); }catch(e){ return def; } }
function lsSet(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} }

// 导出所有数据
function exportAllData(){
  try{
    const data = {};
    for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i);
      data[key] = localStorage.getItem(key);
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0');
    a.href = url;
    a.download = '工具箱数据备份_' + dateStr + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('✅ 数据导出成功！共' + Object.keys(data).length + '项数据');
  }catch(e){
    showToast('❌ 导出失败：' + e.message);
  }
}

// 导入所有数据
function importAllData(input){
  const file = input.files[0];
  if(!file) return;
  if(!confirm('⚠️ 导入将覆盖当前所有数据（金币、卡牌、宠物等），确定继续吗？')){
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const data = JSON.parse(e.target.result);
      if(typeof data !== 'object' || data === null){
        throw new Error('文件格式不正确');
      }
      // 清空现有数据
      localStorage.clear();
      // 写入新数据
      let count = 0;
      for(const key in data){
        localStorage.setItem(key, data[key]);
        count++;
      }
      showToast('✅ 导入成功！共' + count + '项数据，页面即将刷新...');
      setTimeout(function(){ location.reload(); }, 1500);
    }catch(err){
      showToast('❌ 导入失败：' + err.message);
      input.value = '';
    }
  };
  reader.readAsText(file);
}
// 复制文本
async function copyText(text){
  try{ await navigator.clipboard.writeText(text); return true; }
  catch(e){
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try{ document.execCommand('copy'); document.body.removeChild(ta); return true; }
    catch(err){ document.body.removeChild(ta); return false; }
  }
}
// 当前时间字符串
function nowTimeStr(){
  const d = new Date();
  return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0');
}

// ==================== 页面切换 ====================
const pageHome = document.querySelector('.page-home');
let pageAchievementPage = null;
let pageAes = null;
let pageAlmanacPage = null;
let pageAnimalPersonalityPage = null;
let pageAstrodicePage = null;
let pageAudioConverter = null;
let pageAvatarMaker = null;
let pageBackpack = null;
let pageBarcode = null;
let pageBase64 = null;
let pageBloodMatchPage = null;
let pageBmiPage = null;
let pageBreakout = null;
let pageCapsulePage = null;
let pageCardWheelPage = null;
let pageCharDivPage = null;
let pageChestHome = null;
let pageCleanShopPage = null;
let pageCoinPage = null;
let pageCoinWheelPage = null;
let pageCollectionPage = null;
let pageCollectionRecordPage = null;
let pageCrystalballPage = null;
let pageCurrency = null;
let pageDailyTaskPage = null;
let pageDayCalc = null;
let pageDicePage = null;
let pageDnsquery = null;
let pageDomainCheck = null;
let pageDreamPage = null;
let pageEatPage = null;
let pageEncQr = null;
let pageEncScan = null;
let pageFaceScorePage = null;
let pageFavorites = null;
let pageFoodShopPage = null;
let pageFortunePage = null;
let pageFortuneTodayPage = null;
let pageGachaPage = null;
let pageGame2048 = null;
let pageGame24Page = null;
let pageGomoku = null;
let pageGuessPage = null;
let pageHexconvert = null;
let pageIdiomChainPage = null;
let pageImghost = null;
let pageIplookup = null;
let pageIqPage = null;
let pageItemWheelPage = null;
let pageJinriPage = null;
let pageJokesPage = null;
let pageJsonfmt = null;
let pageKipperPage = null;
let pageLenormandPage = null;
let pageLinkGamePage = null;
let pageMagic8Page = null;
let pageMailboxPage = null;
let pageMatch3Page = null;
let pageMbtiPage = null;
let pageMindReadingPage = null;
let pageMoralityPage = null;
let pageNumerologyPage = null;
let pageNumgen = null;
let pageOilPrice = null;
let pageOraclePage = null;
let pagePasswordPage = null;
let pagePendulumPage = null;
let pagePetDiaryPage = null;
let pagePetDressPage = null;
let pagePetExplorePage = null;
let pagePetPlayPage = null;
let pagePetSchoolPage = null;
let pagePetSkillPage = null;
let pagePetWorkPage = null;
let pagePiano = null;
let pagePinball = null;
let pagePinballShop = null;
let pagePinballWheelPage = null;
let pagePwcheck = null;
let pageQq = null;
let pageQqGroup = null;
let pageQrcode = null;
let pageRandom = null;
let pageRefreshRate = null;
let pageRiddlesPage = null;
let pageRpsPage = null;
let pageRunePage = null;
let pageScanner = null;
let pageSiteCheck = null;
let pageSlotPage = null;
let pageSpotDiffPage = null;
let pageStatusPage = null;
let pageSuperItemShopPage = null;
let pageTarotPage = null;
let pageTealeafPage = null;
let pageTetris = null;
let pageTextutil = null;
let pageTimestamp = null;
let pageToyShopPage = null;
let pageTranslate = null;
let pageTruthDarePage = null;
let pageTypingPage = null;
let pageUnitConverter = null;
let pageUsageStatsPage = null;
let pageUuidgen = null;
let pageVideoAudio = null;
let pageVideoParse = null;
let pageWarehousePage = null;
let pageWeather = null;
let pageWheelPage = null;
let pageYesnoPage = null;
let pageacrosticPage = null;
let pageagePage = null;
let pageanniversaryPage = null;
let pagebrainTestPage = null;
let pagecaesarPage = null;
let pagecaloriePage = null;
let pagegroupPage = null;
let pagememoryPage = null;
let pagementalAgePage = null;
let pageminesweeperPage = null;
let pagemorsePage = null;
let pagenameMatchPage = null;
let pageovulationPage = null;
let pagepastLifePage = null;
let pagerelativePage = null;
let pagereverseTextPage = null;
let pagerollCallPage = null;
let pagetttPage = null;
let pagewhackPage = null;
let pagezodiacMatchPage = null;
let pagezodiacPage = null;
let pageJsResources = null;
let pageIntroPage = null;
let allToolPages = [];
function refreshToolPageReferences(){
  pageAchievementPage = document.getElementById('pageAchievementPage');
  pageAes = document.querySelector('.page-aes');
  pageAlmanacPage = document.getElementById('pageAlmanacPage');
  pageAnimalPersonalityPage = document.getElementById('pageAnimalPersonalityPage');
  pageAstrodicePage = document.getElementById('pageAstrodicePage');
  pageAudioConverter = document.getElementById('pageAudioConverter');
  pageAvatarMaker = document.getElementById('pageAvatarMaker');
  pageBackpack = document.getElementById('pageBackpack');
  pageBarcode = document.querySelector('.page-barcode');
  pageBase64 = document.getElementById('pageBase64');
  pageBloodMatchPage = document.getElementById('pageBloodMatchPage');
  pageBmiPage = document.getElementById('pageBmiPage');
  pageBreakout = document.getElementById('pageBreakout');
  pageCapsulePage = document.getElementById('pageCapsulePage');
  pageCardWheelPage = document.getElementById('pageCardWheelPage');
  pageCharDivPage = document.getElementById('pageCharDivPage');
  pageChestHome = document.getElementById('pageChestHome');
  pageCleanShopPage = document.getElementById('pageCleanShopPage');
  pageCoinPage = document.getElementById('pageCoinPage');
  pageCoinWheelPage = document.getElementById('pageCoinWheelPage');
  pageCollectionPage = document.getElementById("pageCollectionPage");
  pageCollectionRecordPage = document.getElementById("pageCollectionRecordPage");
  pageCrystalballPage = document.getElementById('pageCrystalballPage');
  pageCurrency = document.querySelector('.page-currency');
  pageDailyTaskPage = document.getElementById('pageDailyTaskPage');
  pageDayCalc = document.querySelector('.page-daycalc');
  pageDicePage = document.getElementById('pageDicePage');
  pageDnsquery = document.querySelector('.page-dnsquery');
  pageDomainCheck = document.getElementById('pageDomainCheck');
  pageDreamPage = document.getElementById('pageDreamPage');
  pageEatPage = document.getElementById('pageEatPage');
  pageEncQr = document.getElementById('pageEncQr');
  pageEncScan = document.getElementById('pageEncScan');
  pageFaceScorePage = document.getElementById('pageFaceScorePage');
  pageFavorites = document.getElementById('pageFavorites');
  pageJsResources = document.getElementById('pageJsResources');
  pageIntroPage = document.getElementById('pageIntroPage');
  pageFoodShopPage = document.getElementById('pageFoodShopPage');
  pageFortunePage = document.getElementById('pageFortunePage');
  pageFortuneTodayPage = document.getElementById('pageFortuneTodayPage');
  pageGachaPage = document.getElementById('pageGachaPage');
  pageGame2048 = document.getElementById('pageGame2048');
  pageGame24Page = document.getElementById('pageGame24Page');
  pageGomoku = document.getElementById('pageGomoku');
  pageGuessPage = document.getElementById('pageGuessPage');
  pageHexconvert = document.getElementById('pageHexconvert');
  pageIdiomChainPage = document.getElementById('pageIdiomChainPage');
  pageImghost = document.getElementById('pageImghost');
  pageIplookup = document.querySelector('.page-iplookup');
  pageIqPage = document.getElementById('pageIqPage');
  pageItemWheelPage = document.getElementById('pageItemWheelPage');
  pageJinriPage = document.getElementById('pageJinriPage');
  pageJokesPage = document.getElementById('pageJokesPage');
  pageJsonfmt = document.getElementById('pageJsonfmt');
  pageKipperPage = document.getElementById('pageKipperPage');
  pageLenormandPage = document.getElementById('pageLenormandPage');
  pageLinkGamePage = document.getElementById('pageLinkGamePage');
  pageMagic8Page = document.getElementById('pageMagic8Page');
  pageMailboxPage = document.getElementById("pageMailboxPage");
  pageMatch3Page = document.getElementById('pageMatch3Page');
  pageMbtiPage = document.getElementById('pageMbtiPage');
  pageMindReadingPage = document.getElementById('pageMindReadingPage');
  pageMoralityPage = document.getElementById('pageMoralityPage');
  pageNumerologyPage = document.getElementById('pageNumerologyPage');
  pageNumgen = document.getElementById('pageNumgen');
  pageOilPrice = document.getElementById('pageOilPrice');
  pageOraclePage = document.getElementById('pageOraclePage');
  pagePasswordPage = document.getElementById('pagePasswordPage');
  pagePendulumPage = document.getElementById('pagePendulumPage');
  pagePetDiaryPage = document.getElementById('pagePetDiaryPage');
  pagePetDressPage = document.getElementById('pagePetDressPage');
  pagePetExplorePage = document.getElementById('pagePetExplorePage');
  pagePetPlayPage = document.getElementById('pagePetPlayPage');
  pagePetSchoolPage = document.getElementById('pagePetSchoolPage');
  pagePetSkillPage = document.getElementById('pagePetSkillPage');
  pagePetWorkPage = document.getElementById('pagePetWorkPage');
  pagePiano = document.getElementById('pagePiano');
  pagePinball = document.getElementById('pagePinball');
  pagePinballShop = document.getElementById('pagePinballShop');
  pagePinballWheelPage = document.getElementById('pagePinballWheelPage');
  pagePwcheck = document.getElementById('pagePwcheck');
  pageQq = document.querySelector('.page-qq');
  pageQqGroup = document.querySelector('.page-qqgroup');
  pageQrcode = document.querySelector('.page-qrcode');
  pageRandom = document.getElementById('pageRandom');
  pageRefreshRate = document.querySelector('.page-refreshrate');
  pageRiddlesPage = document.getElementById('pageRiddlesPage');
  pageRpsPage = document.getElementById('pageRpsPage');
  pageRunePage = document.getElementById('pageRunePage');
  pageScanner = document.querySelector('.page-scanner');
  pageSiteCheck = document.getElementById('pageSiteCheck');
  pageSlotPage = document.getElementById('pageSlotPage');
  pageSpotDiffPage = document.getElementById('pageSpotDiffPage');
  pageStatusPage = document.getElementById('pageStatusPage');
  pageSuperItemShopPage = document.getElementById("pageSuperItemShopPage");
  pageTarotPage = document.getElementById('pageTarotPage');
  pageTealeafPage = document.getElementById('pageTealeafPage');
  pageTetris = document.getElementById('pageTetris');
  pageTextutil = document.getElementById('pageTextutil');
  pageTimestamp = document.getElementById('pageTimestamp');
  pageToyShopPage = document.getElementById("pageToyShopPage");
  pageTranslate = document.querySelector('.page-translate');
  pageTruthDarePage = document.getElementById('pageTruthDarePage');
  pageTypingPage = document.getElementById('pageTypingPage');
  pageUnitConverter = document.getElementById('pageUnitConverter');
  pageUsageStatsPage = document.getElementById("pageUsageStatsPage");
  pageUuidgen = document.getElementById('pageUuidgen');
  pageVideoAudio = document.getElementById('pageVideoAudio');
  pageVideoParse = document.getElementById('pageVideoParse');
  pageWarehousePage = document.getElementById("pageWarehousePage");
  pageWeather = document.querySelector('.page-weather');
  pageWheelPage = document.getElementById('pageWheelPage');
  pageYesnoPage = document.getElementById('pageYesnoPage');
  pageacrosticPage = document.getElementById('pageacrosticPage');
  pageagePage = document.getElementById('pageagePage');
  pageanniversaryPage = document.getElementById('pageanniversaryPage');
  pagebrainTestPage = document.getElementById('pagebrainTestPage');
  pagecaesarPage = document.getElementById('pagecaesarPage');
  pagecaloriePage = document.getElementById('pagecaloriePage');
  pagegroupPage = document.getElementById('pagegroupPage');
  pagememoryPage = document.getElementById('pagememoryPage');
  pagementalAgePage = document.getElementById('pagementalAgePage');
  pageminesweeperPage = document.getElementById('pageminesweeperPage');
  pagemorsePage = document.getElementById('pagemorsePage');
  pagenameMatchPage = document.getElementById('pagenameMatchPage');
  pageovulationPage = document.getElementById('pageovulationPage');
  pagepastLifePage = document.getElementById('pagepastLifePage');
  pagerelativePage = document.getElementById('pagerelativePage');
  pagereverseTextPage = document.getElementById('pagereverseTextPage');
  pagerollCallPage = document.getElementById('pagerollCallPage');
  pagetttPage = document.getElementById('pagetttPage');
  pagewhackPage = document.getElementById('pagewhackPage');
  pagezodiacMatchPage = document.getElementById('pagezodiacMatchPage');
  pagezodiacPage = document.getElementById('pagezodiacPage');
  allToolPages = Array.from(document.querySelectorAll('#toolPagesRoot > .tool-page'));
}
window.flRefreshToolPageReferences = refreshToolPageReferences;
function normalizeToolPageHeader(page){
  if(!page || page.querySelector(':scope > .sticky-nav')) return page;
  const header = page.querySelector(':scope > .tool-header');
  if(!header) return page;
  const next = header.nextElementSibling;
  const breadcrumb = next && next.classList.contains('breadcrumb') ? next : null;
  const nav = document.createElement('div');
  nav.className = 'sticky-nav';
  page.insertBefore(nav, header);
  nav.appendChild(header);
  if(breadcrumb) nav.appendChild(breadcrumb);
  return page;
}
window.flNormalizeToolPageHeader = normalizeToolPageHeader;
window.flRegisterToolPage = function flRegisterToolPage(pageId, markup){
  const root = document.getElementById('toolPagesRoot');
  if(!root) throw new Error('找不到工具页面容器 toolPagesRoot');
  const existing = document.getElementById(pageId);
  if(existing && existing.parentElement === root) return existing;
  root.insertAdjacentHTML('beforeend', markup);
  const page = document.getElementById(pageId);
  if(!page || !page.classList.contains('tool-page')) throw new Error('工具页面模板注册失败：' + pageId);
  normalizeToolPageHeader(page);
  refreshToolPageReferences();
  return page;
};
refreshToolPageReferences();
// 离开页面前清理定时器
function cleanupBeforePageSwitch(){
  if(typeof tetTimer!=='undefined'&&tetTimer){ clearInterval(tetTimer); tetTimer=null; }
  if(typeof brkTimer!=='undefined'&&brkTimer){ clearInterval(brkTimer); brkTimer=null; }
  if(typeof pianoTimer!=='undefined'&&pianoTimer){ clearInterval(pianoTimer); pianoTimer=null; }
}

