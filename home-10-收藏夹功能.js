/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageFavorites", "<!-- pageFavorites -->\n<div class=\"tool-page\" id=\"pageFavorites\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" id=\"favBackBtn\" onclick=\"favPageBack()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px;\">\n      <h3>⭐ 我的收藏</h3>\n      <div class=\"home-buttons fav-grid\" id=\"favGrid\"></div>\n    </div>\n  </div>");
// ===== 收藏夹功能 =====
const favAnimCleanupTimers = new WeakMap();
let favPageRenderTimer = null;
const MOVED_MORE_FAVORITE_ROUTES = {pageHexconvert:'hexconvert',pageUuidgen:'uuidgen',pageJsonfmt:'jsonfmt',pageTimestamp:'timestamp',pageRefreshRate:'refreshrate'};
function getFavorites(){
  const saved = lsGet('favorites', []);
  if(!Array.isArray(saved)) return [];
  let changed = false;
  const seen = new Set();
  const favorites = [];
  saved.forEach(function(item){
    if(!item) return;
    const moved = item.source === 'more';
    if(moved) changed = true;
    const favorite = moved ? {...item,source:'home',page:MOVED_MORE_FAVORITE_ROUTES[item.page] || item.page} : item;
    const key = favorite.source + ':' + favorite.page;
    if(seen.has(key)){ changed = true; return; }
    seen.add(key);
    favorites.push(favorite);
  });
  if(changed) lsSet('favorites', favorites);
  return favorites;
}
function saveFavorites(list){ lsSet('favorites', list); }
function isFavorited(source, page){
  return getFavorites().some(f => f.source===source && f.page===page);
}
function playFavAnim(starEl, nowFaved){
  if(!starEl) return;
  // 跳过不可见元素（隐藏页面里的同步星星，避免粒子飘到屏幕左上角 0,0）
  const rect0 = starEl.getBoundingClientRect();
  if(rect0.width === 0 || rect0.height === 0) return;
   const oldCleanup = favAnimCleanupTimers.get(starEl);
   if(oldCleanup) clearTimeout(oldCleanup);
  // 清掉旧动画类，强制重排以重新触发
  starEl.classList.remove('anim-pop','anim-unpop');
  void starEl.offsetWidth;
  if(nowFaved){
    starEl.classList.add('anim-pop');
    // 取星星中心位置
    const rect = starEl.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    // 金色脉冲环
    const ring = document.createElement('div');
    ring.className = 'fav-pulse-ring';
    ring.style.left = cx + 'px';
    ring.style.top = cy + 'px';
    document.body.appendChild(ring);
    setTimeout(()=>ring.remove(), 700);
    // 8 个小粒子向外飞散
    const symbols = ['★','✨','⭐','✦','✧','★','✨','⭐'];
    const colors  = ['#f59e0b','#fbbf24','#fde68a','#f97316','#f59e0b','#fcd34d','#fbbf24','#f59e0b'];
    for(let i=0;i<8;i++){
      const p = document.createElement('span');
      p.className = 'fav-particle';
      p.textContent = symbols[i];
      p.style.color = colors[i];
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      const angle = (Math.PI*2*i)/8 + (Math.random()-0.5)*0.6;
      const dist = 34 + Math.random()*28;
      p.style.setProperty('--dx', Math.cos(angle)*dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle)*dist + 'px');
      document.body.appendChild(p);
      setTimeout(()=>p.remove(), 800);
    }
  } else {
    starEl.classList.add('anim-unpop');
    // 取消收藏也放一圈灰色波纹 + 灰色粒子，对称反馈
    const rect = starEl.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const ring = document.createElement('div');
    ring.className = 'fav-pulse-ring';
    ring.style.left = cx + 'px';
    ring.style.top = cy + 'px';
    ring.style.borderColor = '#94a3b8';
    ring.style.background = 'rgba(148,163,184,0.15)';
    document.body.appendChild(ring);
    setTimeout(()=>ring.remove(), 700);
    const symbols = ['✧','✦','·','✧','✦','·'];
    const colors  = ['#94a3b8','#cbd5e1','#e2e8f0','#94a3b8','#cbd5e1','#e2e8f0'];
    for(let i=0;i<6;i++){
      const p = document.createElement('span');
      p.className = 'fav-particle';
      p.textContent = symbols[i];
      p.style.color = colors[i];
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      const angle = (Math.PI*2*i)/6 + (Math.random()-0.5)*0.6;
      const dist = 28 + Math.random()*22;
      p.style.setProperty('--dx', Math.cos(angle)*dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle)*dist + 'px');
      document.body.appendChild(p);
      setTimeout(()=>p.remove(), 800);
    }
  }
  // 动画结束后清理类，避免和 hover 冲突
  const cleanupTimer = setTimeout(()=>{
    starEl.classList.remove('anim-pop','anim-unpop');
    favAnimCleanupTimers.delete(starEl);
  }, nowFaved?650:400);
  favAnimCleanupTimers.set(starEl, cleanupTimer);
}

function showFavoriteToast(msg){
  const container = document.getElementById('toastContainer');
  if(!container) return;
  container.querySelectorAll('.favorite-toast').forEach(toast => toast.remove());
  while(container.children.length >= 3) container.removeChild(container.firstElementChild);
  const toast = document.createElement('div');
  toast.className = 'toast favorite-toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(()=>{ if(toast.parentNode) toast.remove(); }, 2550);
}
function toggleFavorite(source, page, name, icon, desc, animate = true){
  let favs = getFavorites();
  const idx = favs.findIndex(f => f.source===source && f.page===page);
  let nowFaved;
  if(idx >= 0){
    favs.splice(idx, 1);
    showFavoriteToast('已取消收藏');
    nowFaved = false;
  } else {
    favs.unshift({source, page, name, icon: icon||'🔧', desc: desc||''});
    showFavoriteToast('⭐ 已收藏');
    nowFaved = true;
  }
  saveFavorites(favs);
  // 如果在收藏页，刷新
  if(currentPageName === 'favoritesPage'){
    if(favPageRenderTimer !== null) clearTimeout(favPageRenderTimer);
    favPageRenderTimer = setTimeout(()=>{
      favPageRenderTimer = null;
      renderFavoritesPage();
    }, nowFaved ? 650 : 400);
  }
  // 如果弹窗开着，刷新弹窗
  const modal = document.getElementById('favModalMask');
  if(modal && modal.style.display === 'flex') renderFavoritesModal();
  // 同步更新所有卡片上的星星状态 + 播放动画
  document.querySelectorAll('.fav-star-btn').forEach(star => {
    if(star.dataset.source === source && star.dataset.page === page){
      star.classList.toggle('faved', nowFaved);
      star.textContent = nowFaved ? '★' : '☆';
      if(animate) playFavAnim(star, nowFaved);
    }
  });
  // 同步更新当前工具页 header 的星星
  document.querySelectorAll('.header-fav-star-btn').forEach(star => {
    if(star.dataset.source !== source || star.dataset.page !== page) return;
    let starIcon = star.querySelector('.header-fav-star-icon');
    if(!starIcon){
      starIcon = document.createElement('span');
      starIcon.className = 'header-fav-star-icon';
      starIcon.textContent = star.textContent;
      star.replaceChildren(starIcon);
    }
    starIcon.textContent = nowFaved ? '★' : '☆';
    star.style.color = nowFaved ? '#f59e0b' : 'var(--text-placeholder)';
    if(animate) playFavAnim(starIcon, nowFaved);
  });
  return nowFaved;
}
let favModalViewTransitioning = false;
let favModalViewTransitionToken = 0;
let favModalViewAnimations = [];
let favModalCloseTimer = null;
function setFavModalView(showPicker){
  const listHeader = document.getElementById('favListViewHeader');
  const pickHeader = document.getElementById('favPickViewHeader');
  const list = document.getElementById('favModalList');
  const picker = document.getElementById('favPickerList');
  const scroll = document.querySelector('#favModalMask .fav-modal-scroll');
  const confirmText = document.getElementById('favModalConfirmText');
  if(listHeader) listHeader.style.display = showPicker ? 'none' : 'flex';
  if(list) list.style.display = showPicker ? 'none' : 'flex';
  if(pickHeader) pickHeader.style.display = showPicker ? 'flex' : 'none';
  if(picker) picker.style.display = showPicker ? 'flex' : 'none';
  if(confirmText) confirmText.textContent = showPicker ? '完成' : '确认';
  if(scroll) scroll.scrollTop = 0;
}
function switchFavModalView(showPicker, animate = true, force = false){
  if(favModalViewTransitioning && !force) return false;
  favModalViewAnimations.forEach(animation => animation.cancel());
  favModalViewAnimations = [];
  const box = document.querySelector('#favModalMask .fav-modal-box');
  const confirmBtn = document.getElementById('favModalConfirm');
  const fromHeader = document.getElementById(showPicker ? 'favListViewHeader' : 'favPickViewHeader');
  const toHeader = document.getElementById(showPicker ? 'favPickViewHeader' : 'favListViewHeader');
  const scroll = document.querySelector('#favModalMask .fav-modal-scroll');
  const token = ++favModalViewTransitionToken;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!animate || !box || !scroll || typeof box.animate !== 'function' || typeof scroll.animate !== 'function' || reducedMotion){
    setFavModalView(showPicker);
    favModalViewTransitioning = false;
    if(confirmBtn) confirmBtn.disabled = false;
    return true;
  }

  favModalViewTransitioning = true;
  if(confirmBtn) confirmBtn.disabled = true;
  const oldHeight = box.getBoundingClientRect().height;
  const outgoing = [fromHeader, scroll].filter(Boolean).map(element => element.animate([
    {opacity:1,transform:'scale(1)'},
    {opacity:0,transform:'scale(.99)'}
  ], {duration:90,easing:'ease-in',fill:'forwards'}));
  favModalViewAnimations = outgoing;
  Promise.all(outgoing.map(animation => animation.finished.catch(()=>null))).then(()=>{
    if(token !== favModalViewTransitionToken) return;
    setFavModalView(showPicker);
    outgoing.forEach(animation => animation.cancel());
    const newHeight = box.getBoundingClientRect().height;
    const modalMorph = Math.abs(newHeight - oldHeight) > 1 ? box.animate([
      {transformOrigin:'center center',transform:`scaleY(${oldHeight / newHeight})`},
      {transformOrigin:'center center',transform:'scaleY(1)'}
    ], {duration:170,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'}) : null;
    const entering = [toHeader, scroll].filter(Boolean).map(element => element.animate([
      {opacity:0,transform:'scale(.99)'},
      {opacity:1,transform:'scale(1)'}
    ], {duration:150,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'}));
    favModalViewAnimations = modalMorph ? [...entering,modalMorph] : entering;
    return Promise.all(favModalViewAnimations.map(animation => animation.finished.catch(()=>null)));
  }).then(()=>{
    if(token !== favModalViewTransitionToken) return;
    favModalViewAnimations.forEach(animation => animation.cancel());
    favModalViewAnimations = [];
    favModalViewTransitioning = false;
    if(confirmBtn) confirmBtn.disabled = false;
  });
  return true;
}
function handleFavModalFooterAction(){
  if(favModalViewTransitioning) return;
  const pickHeader = document.getElementById('favPickViewHeader');
  if(pickHeader && pickHeader.style.display !== 'none') saveFavPicker();
  else closeFavoritesModal();
}
function openFavorites(){
  if(favModalCloseTimer !== null){
    clearTimeout(favModalCloseTimer);
    favModalCloseTimer = null;
  }
  const mask = document.getElementById('favModalMask');
  if(mask) mask.classList.remove('closing');
  switchFavModalView(false, false, true);
  renderFavoritesModal();
  if(mask) mask.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeFavoritesModal(){
  switchFavModalView(false, false, true);
  const mask = document.getElementById('favModalMask');
  if(!mask) return;
  if(favModalCloseTimer !== null) clearTimeout(favModalCloseTimer);
  mask.classList.add('closing');
  document.body.style.overflow = '';
  favModalCloseTimer = setTimeout(()=>{
    mask.style.display = 'none';
    mask.classList.remove('closing');
    favModalCloseTimer = null;
  },200);
}
function renderFavoritesModal(){
  const favs = getFavorites();
  const list = document.getElementById('favModalList');
  if(!favs.length){
    list.innerHTML = '<div class="fav-empty"><div class="fav-empty-icon">⭐</div>暂无收藏<br>在工具卡片上点击星星即可收藏</div>';
    return;
  }
  list.innerHTML = favs.map(f =>
    '<div class="fav-item" onclick="openFavTool(\''+f.source+'\',\''+f.page+'\',\''+f.name+'\')">'+
      '<div class="fav-icon">'+f.icon+'</div>'+
      '<div class="fav-info">'+
        '<div class="fav-name">'+f.name+'</div>'+
        '<div class="fav-desc">'+(f.desc||'')+'</div>'+
      '</div>'+
      '<button class="fav-remove" onclick="event.stopPropagation();toggleFavorite(\''+f.source+'\',\''+f.page+'\',\''+f.name+'\',\''+f.icon+'\',\'\',false)">✕</button>'+
    '</div>'
  ).join('');
}
function openFavoritesPage(){
  closeFavoritesModal();
  openPage('favoritesPage');
}
// 收藏页返回上一级
let favReturnFrom = 'home';
function favPageBack(){
  if(favReturnFrom && favReturnFrom !== 'favoritesPage'){
    if(favReturnFrom === 'home'){
      goHome();
    } else {
      openPage(favReturnFrom);
    }
  } else {
    goHome();
  }
}
function renderFavoritesPage(){
  const favs = getFavorites();
  const grid = document.getElementById('favGrid');
  if(!grid) return;
  if(!favs.length){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px 0;color:var(--text-secondary);"><div style="font-size:40px;margin-bottom:10px;">⭐</div>暂无收藏<br><span style="font-size:12px;">在工具卡片上点击星星即可收藏</span></div>';
    return;
  }
  grid.innerHTML = favs.map(f =>
    '<div class="home-btn" onclick="openFavTool(\''+f.source+'\',\''+f.page+'\',\''+f.name+'\')">'+
      '<span class="fav-star-btn faved" data-source="'+f.source+'" data-page="'+f.page+'" onclick="event.stopPropagation();toggleFavorite(\''+f.source+'\',\''+f.page+'\',\''+f.name+'\',\''+f.icon+'\')">★</span>'+
      '<div class="icon">'+f.icon+'</div>'+
      '<div class="title">'+f.name+'</div>'+
      '<div class="desc">'+(f.desc||'')+'</div>'+
    '</div>'
  ).join('');
}
// 从收藏页打开工具的标记
let openFromFavPage = false;
let favPagePendingRoute = null;
let openFromFavModal = false;
let favModalPendingRoute = null;
let favModalReturnRoute = 'home';
function isOpeningFavToolRoute(pageName){
  return openFromFavPage && (!favPagePendingRoute || pageName === favPagePendingRoute);
}
function openFavTool(source, page, name){
  // 判断是从弹窗还是从收藏页打开
  const modal = document.getElementById('favModalMask');
  const wasModal = modal && modal.style.display === 'flex';
  openFromFavPage = !wasModal; // 不是从弹窗打开的，就是从收藏页打开的
  favPagePendingRoute = openFromFavPage ? page : null;
  openFromFavModal = !!wasModal;
  favModalPendingRoute = openFromFavModal ? page : null;
  favModalReturnRoute = openFromFavModal ? (currentPageName || 'home') : 'home';
  closeFavoritesModal();
  if(source === 'home' || source === 'more'){
    openPage(page);
  } else if(source === 'chest'){
    openChestTool(page, name);
  }
}
// 从收藏页打开工具后，修改返回按钮
function applyFavPageReturn(pageEl, pageName){
  if(openFromFavModal){
    if(favModalPendingRoute && pageName && pageName !== favModalPendingRoute) return;
    const targetPage = pageEl || ((typeof allToolPages!=="undefined") ? allToolPages.find(p => p.style.display === "block") : null);
    if(!targetPage) return;
    const backBtn = targetPage.querySelector(".tool-header .back-btn");
    if(backBtn){
      if(backBtn.dataset.origOnclick === undefined){
        backBtn.dataset.origOnclick = backBtn.getAttribute("onclick") || "";
        backBtn.dataset.origHtml = backBtn.innerHTML;
      }
      backBtn.dataset.flFavBackMode = "modal";
      backBtn.setAttribute("onclick", "favModalBackToRouteParent()");
      window.flSetBackButtonLabel(backBtn,"收藏");
    }
    openFromFavModal = false;
    favModalPendingRoute = null;
    return;
  }
  const openingFromFavorites = openFromFavPage;
  if(openingFromFavorites && favPagePendingRoute && pageName && pageName !== favPagePendingRoute) return;
  const routeTrail = Array.isArray(window.flRouteTrail) ? window.flRouteTrail : [];
  const favoritesIndex = routeTrail.findIndex(function(item){ return item.id === 'favoritesPage'; });
  const targetIndex = routeTrail.findIndex(function(item){ return item.id === pageName; });
  const hasFavoritesParent = favoritesIndex >= 0 && targetIndex > favoritesIndex;
  if(!openingFromFavorites && !hasFavoritesParent) return;
  const targetPage = pageEl || ((typeof allToolPages!=="undefined") ? allToolPages.find(p => p.style.display === "block") : null);
  if(!targetPage) return;
  const backBtn = targetPage.querySelector(".tool-header .back-btn");
  if(backBtn){
    // 备份原始返回按钮状态（仅首次），供其他入口打开时恢复
    if(backBtn.dataset.origOnclick === undefined){
      backBtn.dataset.origOnclick = backBtn.getAttribute("onclick") || "";
      backBtn.dataset.origHtml = backBtn.innerHTML;
    }
    backBtn.dataset.flFavBackMode = "page";
    backBtn.setAttribute("onclick", "favPageBackToRouteParent()");
    const routeTrail = Array.isArray(window.flRouteTrail) ? window.flRouteTrail : [];
    const parentRoute = routeTrail.length > 1 ? routeTrail[routeTrail.length - 2] : null;
    const returnTitle = parentRoute?.title || parentRoute?.id || String.fromCharCode(25105,30340,25910,34255);
    window.flSetBackButtonLabel(backBtn,returnTitle);
  }
  openFromFavPage = false;
  favPagePendingRoute = null;
}
// 从工具页返回收藏页
function favPageBackToRouteParent(){
  openFromFavPage = false;
  favPagePendingRoute = null;
  const routeTrail = Array.isArray(window.flRouteTrail) ? window.flRouteTrail : [];
  const parentRoute = routeTrail.length > 1 ? routeTrail[routeTrail.length - 2] : null;
  const targetRoute = parentRoute?.id || 'favoritesPage';
  window.__flPreserveFavReturn = targetRoute === 'favoritesPage';
  if(targetRoute === 'home'){ goHome(); return; }
  openPage(targetRoute);
}
function favModalBackToRouteParent(){
  openFromFavModal = false;
  favModalPendingRoute = null;
  openFromFavPage = false;
  favPagePendingRoute = null;
  const targetRoute = favModalReturnRoute || 'home';
  if(targetRoute === 'home') goHome({history:'replace'});
  else openPage(targetRoute,{history:'replace'});
  openFavorites();
}

// 批量选择工具
let favPickTemp = {}; // 临时选择状态 key=source_page
function openFavPicker(){
  if(favModalViewTransitioning) return;
  // 初始化临时状态
  favPickTemp = {};
  getFavorites().forEach(f => { favPickTemp[f.source + '_' + f.page] = true; });
  renderFavPicker();
  switchFavModalView(true);
}
function closeFavPicker(){
  if(favModalViewTransitioning) return;
  switchFavModalView(false);
}
function renderFavPicker(){
  const box = document.getElementById('favPickerList');
  if(!box || typeof TOOL_INDEX === 'undefined'){ box.innerHTML = '<div class="fav-empty">工具列表加载中...</div>'; return; }
  // 按分类分组
  const cats = {};
  TOOL_INDEX.forEach(t => {
    if(!cats[t.cat]) cats[t.cat] = [];
    cats[t.cat].push(t);
  });
  let html = '';
  for(const cat in cats){
    html += '<div class="fav-pick-cat">'+cat+'</div>';
    cats[cat].forEach(t => {
      const key = t.source + '_' + t.page;
      const checked = favPickTemp[key] ? ' checked' : '';
      html += '<div class="fav-pick-item'+checked+'" data-key="'+key+'" data-source="'+t.source+'" data-page="'+t.page+'" data-name="'+t.name+'" data-icon="'+t.icon+'" data-desc="'+t.desc+'">'+
        '<div class="fp-icon">'+t.icon+'</div>'+
        '<div class="fp-name">'+t.name+'</div>'+
        '<div class="fp-check"></div>'+
      '</div>';
    });
  }
  box.innerHTML = html;
  // 绑定点击
  box.querySelectorAll('.fav-pick-item').forEach(item => {
    item.onclick = function(){
      const key = this.dataset.key;
      if(favPickTemp[key]) delete favPickTemp[key];
      else favPickTemp[key] = true;
      this.classList.toggle('checked');
    };
  });
}
function saveFavPicker(){
  if(favModalViewTransitioning) return;
  // 从临时状态生成新的收藏列表
  const favs = [];
  document.querySelectorAll('#favPickerList .fav-pick-item').forEach(item => {
    if(favPickTemp[item.dataset.key]){
      favs.push({
        source: item.dataset.source,
        page: item.dataset.page,
        name: item.dataset.name,
        icon: item.dataset.icon,
        desc: item.dataset.desc
      });
    }
  });
  saveFavorites(favs);
  renderFavoritesModal();
  closeFavPicker();
  injectFavStars(); // 刷新卡片上的星星状态
  showToast('✅ 收藏已更新，共'+favs.length+'个');
}

// 收藏弹窗点击遮罩关闭
function initFavoritesPage(){
  injectFavStars();
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initFavoritesPage, {once:true});
}else{
  initFavoritesPage();
}

// 给工具页 header 右上角加收藏按钮
const headerFavStarAnimations = new WeakMap();
const headerFavStarPendingEntrances = new WeakMap();
function animateHeaderFavStarFromBack(backBtn, starBtn, elapsed = 0){
  if(!backBtn || !starBtn || typeof starBtn.animate !== 'function') return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const previous = headerFavStarAnimations.get(starBtn);
  if(previous) previous.cancel();

  const backRect = backBtn.getBoundingClientRect();
  const starRect = starBtn.getBoundingClientRect();
  const splitX = backRect.right - 5 - (starRect.left + starRect.width / 2);
  const splitY = backRect.top + backRect.height / 2 - (starRect.top + starRect.height / 2);
  const starStyle = getComputedStyle(starBtn);
  const starBackground = starStyle.backgroundColor;
  const starShadow = starStyle.boxShadow;
  const animation = starBtn.animate([
    {opacity:0, backgroundColor:'transparent', boxShadow:'none', transform:`translate(${splitX}px, ${splitY}px) scale(.24) rotate(-12deg)`},
    {opacity:1, backgroundColor:'transparent', boxShadow:'none', transform:'translate(0, 0) scale(1.1) rotate(4deg)', offset:.68},
    {opacity:1, backgroundColor:starBackground, boxShadow:starShadow, transform:'translate(0, 0) scale(.96) rotate(-2deg)', offset:.86},
    {opacity:1, backgroundColor:starBackground, boxShadow:starShadow, transform:'translate(0, 0) scale(1) rotate(0deg)'}
  ], {duration:888, easing:'cubic-bezier(.2,.75,.25,1)', fill:'both'});
  if(elapsed > 0) animation.currentTime = Math.min(elapsed,887);
  headerFavStarAnimations.set(starBtn, animation);
  animation.onfinish = function(){
    if(headerFavStarAnimations.get(starBtn) !== animation) return;
    animation.cancel();
    headerFavStarAnimations.delete(starBtn);
  };
}

function queueHeaderFavStarEntrance(backBtn,starBtn,remaining = 0,elapsed = 0){
  const oldOpacity = starBtn.style.getPropertyValue('opacity');
  const oldOpacityPriority = starBtn.style.getPropertyPriority('opacity');
  const oldPointerEvents = starBtn.style.getPropertyValue('pointer-events');
  const oldPointerEventsPriority = starBtn.style.getPropertyPriority('pointer-events');
  let timerId = 0;
  let frameId = 0;
  let cancelled = false;
  let restored = false;
  const restore = function(){
    if(restored) return;
    restored = true;
    if(oldOpacity) starBtn.style.setProperty('opacity',oldOpacity,oldOpacityPriority);
    else starBtn.style.removeProperty('opacity');
    if(oldPointerEvents) starBtn.style.setProperty('pointer-events',oldPointerEvents,oldPointerEventsPriority);
    else starBtn.style.removeProperty('pointer-events');
  };
  starBtn.style.setProperty('opacity','0','important');
  starBtn.style.setProperty('pointer-events','none','important');
  const entry = {
    entranceAt:performance.now() + remaining,
    elapsed:elapsed,
    start:function(){
      if(cancelled || frameId) return;
      if(timerId){ clearTimeout(timerId); timerId = 0; }
      frameId = requestAnimationFrame(function(){
        frameId = 0;
        if(cancelled) return;
        headerFavStarPendingEntrances.delete(starBtn);
        restore();
        animateHeaderFavStarFromBack(backBtn,starBtn,elapsed);
      });
    },
    schedule:function(){
      const delay = Math.max(0,entry.entranceAt - performance.now());
      if(delay) timerId = setTimeout(entry.start,delay);
      else entry.start();
    },
    cancel:function(){
      if(cancelled) return;
      cancelled = true;
      if(timerId) clearTimeout(timerId);
      if(frameId) cancelAnimationFrame(frameId);
      if(headerFavStarPendingEntrances.get(starBtn) === entry) headerFavStarPendingEntrances.delete(starBtn);
      restore();
    }
  };
  headerFavStarPendingEntrances.set(starBtn,entry);
  return entry;
}

function injectHeaderFavBtn(pageEl, pageName, hasPreviousHeaderStar = false){
  if(!pageEl) return;
  // 非收藏来源时，恢复可能被"返回收藏"覆盖过的返回按钮
  if(!openFromFavPage){
    const _bb = pageEl.querySelector('.tool-header .back-btn');
    if(_bb && _bb.dataset.origOnclick !== undefined){
      _bb.setAttribute('onclick', _bb.dataset.origOnclick);
      _bb.innerHTML = _bb.dataset.origHtml;
      delete _bb.dataset.origOnclick;
      delete _bb.dataset.origHtml;
      delete _bb.dataset.flFavBackMode;
    }
  }
  // 百宝箱快捷入口：收藏按钮紧邻 store 按钮
  if(pageEl.id === 'pageChestHome'){
    const row = pageEl.querySelector('#chestQuickActions');
    if(row && !row.querySelector('.header-fav-btn')){
      const btn = document.createElement('button');
      btn.className = 'common-btn header-fav-btn';
      btn.style.cssText = 'padding:4px 10px;font-size:12px;';
      btn.textContent = document.getElementById('homeFavoritesBtn')?.textContent.trim() || '收藏';
      btn.onclick = function(e){ e.stopPropagation(); openPage('favoritesPage'); };
      row.appendChild(btn);
    }
    return;
  }
  const header = pageEl.querySelector('.tool-header');
  if(!header) return;
  // 1. 右上角：跳转到收藏页的按钮（保留）
  if(!header.querySelector('.header-fav-page-btn')){
    const btn = document.createElement('button');
    btn.className = 'back-btn header-fav-page-btn';
    btn.textContent = document.getElementById('homeFavoritesBtn')?.textContent.trim() || '收藏';
    btn.onclick = function(e){
      e.stopPropagation();
      openPage('favoritesPage');
    };
    const hasRightBtn = header.querySelector('[style*="margin-left:auto"]');
    if(!hasRightBtn){
      btn.style.marginLeft = 'auto';
    }
    header.appendChild(btn);
  }
  // 2. 返回按钮右边：收藏当前工具的星星按钮（☆/★）
  const favPageButton = header.querySelector('.header-fav-page-btn');
  const routeTrail = Array.isArray(window.flRouteTrail) ? window.flRouteTrail : [];
  const favoritesRouteIndex = routeTrail.findIndex(function(item){ return item.id === 'favoritesPage'; });
  const currentRouteIndex = routeTrail.findIndex(function(item){ return item.id === pageName; });
  const isFavoritesBranch = openFromFavPage || openFromFavModal || favoritesRouteIndex >= 0 && currentRouteIndex > favoritesRouteIndex;
  if(favPageButton) favPageButton.style.display = isFavoritesBranch ? 'none' : '';
  const backBtn = header.querySelector('.back-btn');
  if(backBtn && !backBtn.nextElementSibling?.classList?.contains('header-fav-star-btn')){
    // 用传入的 pageName 作为 page（openPage 传入的准确 page 名）
    const pageId = pageName || currentPageName;
    // 从 breadcrumb 或 h3 获取工具名
    const crumb = header.parentElement.querySelector('.breadcrumb .current');
    const h3 = pageEl.querySelector('h3');
    const toolName = (crumb?.textContent || h3?.textContent || pageId).trim();
    // 从 TOOL_INDEX 查找完整信息
    let tool = null;
    if(typeof TOOL_INDEX !== 'undefined'){
      tool = TOOL_INDEX.find(t => t.page === pageId);
    }
    const source = tool ? tool.source : (pageId.includes('Page') ? 'chest' : 'home');
    const icon = tool ? tool.icon : '🔧';
    const desc = tool ? tool.desc : '';
    const star = document.createElement('button');
    star.className = 'back-btn header-fav-star-btn';
    star.dataset.source = source;
    star.dataset.page = pageId;
    star.style.cssText = 'font-size:16px;width:36px;height:36px;padding:0;display:flex;align-items:center;justify-content:center;line-height:1;border-radius:12px;flex-shrink:0;';
    const faved = isFavorited(source, pageId);
    const starIcon = document.createElement('span');
    starIcon.className = 'header-fav-star-icon';
    starIcon.textContent = faved ? '★' : '☆';
    star.appendChild(starIcon);
    star.style.color = faved ? '#f59e0b' : 'var(--text-placeholder)';
    star.onclick = function(e){
      e.stopPropagation();
      toggleFavorite(source, pageId, toolName, icon, desc);
    };
    backBtn.after(star);
  }
  const currentStar = header.querySelector('.header-fav-star-btn');
  if(backBtn && currentStar){
    // 重访页面时清理旧动画，避免旧按钮的动画状态残留。
    const previousPending = headerFavStarPendingEntrances.get(currentStar);
    if(previousPending) previousPending.cancel();
    const previousEntrance = headerFavStarAnimations.get(currentStar);
    if(previousEntrance){
      previousEntrance.cancel();
      headerFavStarAnimations.delete(currentStar);
    }
    // 首页进入时等标题完成返回按钮过渡后，再从返回按钮边缘弹出收藏星标。
    if(window.__flDelayHeaderFavStarEntrance){
      const deferredEntrance = queueHeaderFavStarEntrance(backBtn,currentStar,1160);
      window.__flPendingHeaderFavStarEntrance = window.__flPendingHeaderFavStarEntrance || [];
      window.__flPendingHeaderFavStarEntrance.push(deferredEntrance);
    }else if(!hasPreviousHeaderStar){
      queueHeaderFavStarEntrance(backBtn,currentStar).schedule();
    }
    // 前后页都有星标时，由返回键的宽度过渡带动 flex 布局平移，无需重新弹出。
  }
}

// 自动给所有工具卡片注入收藏星星
function injectFavStars(){
  // 首页 home-btn
  document.querySelectorAll('.home-buttons .home-btn').forEach(btn => {
    if(btn.querySelector('.fav-star-btn')) return; // 已注入过
    const onclick = btn.getAttribute('onclick') || '';
    const match = onclick.match(/openPage\('([^']+)'\)/);
    if(!match) return;
    const page = match[1];
    const name = btn.querySelector('.title')?.textContent || '';
    const icon = btn.querySelector('.icon')?.textContent || '🔧';
    const desc = btn.querySelector('.desc')?.textContent || '';
    addFavStar(btn, 'home', page, name, icon, desc);
  });
  // 百宝箱 chest-card
  document.querySelectorAll('.chest-grid .chest-card').forEach(card => {
    if(card.querySelector('.fav-star-btn')) return;
    const onclick = card.getAttribute('onclick') || '';
    // 匹配 openChestTool('pageId','标题')
    let match = onclick.match(/openChestTool\('([^']+)','([^']+)'\)/);
    if(!match) {
      // 匹配 openToolWithReturn('pageId','return')
      match = onclick.match(/openToolWithReturn\('([^']+)','([^']+)'\)/);
      if(match) {
        var source = 'more';
        var page = match[1];
        var name = card.querySelector('.title')?.textContent || '';
      }
    } else {
      var source = 'chest';
      var page = match[1];
      var name = match[2];
    }
    if(!page) return;
    const icon = card.querySelector('.icon')?.textContent || '🎮';
    const desc = card.querySelector('.desc')?.textContent || '';
    addFavStar(card, source, page, name, icon, desc);
  });
}
function addFavStar(el, source, page, name, icon, desc){
  const star = document.createElement('span');
  const faved = isFavorited(source, page);
  star.className = 'fav-star-btn' + (faved ? ' faved' : '');
  star.textContent = faved ? '★' : '☆';
  star.dataset.source = source;
  star.dataset.page = page;
  star.dataset.name = name;
  star.dataset.icon = icon;
  star.dataset.desc = desc;
  star.onclick = function(e){
    e.stopPropagation();
    toggleFavorite(source, page, name, icon, desc);
  };
  el.appendChild(star);
}


