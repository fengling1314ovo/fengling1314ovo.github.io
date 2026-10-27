
/* 首页路由与百宝箱入口；工具脚本按页面载入。 */
const FL_CHEST_LAZY_ROUTES = new Set([
  'chestHome','backpack',
  'dicePage','coinPage','eatPage','yesnoPage','fortunePage','gachaPage','rpsPage','magic8Page',
  'fortuneTodayPage','jinriPage','slotPage','guessPage','minesweeperPage','tttPage','memoryPage','whackPage',
  'zodiacPage','zodiacMatchPage','nameMatchPage','mentalAgePage','brainTestPage','pastLifePage',
  'anniversaryPage','caloriePage','ovulationPage','rollCallPage','groupPage','acrosticPage','caesarPage','reverseTextPage',
  'tetrisPage','gomokuPage','game2048Page','breakoutPage','pinballPage','pinballShopPage','pianoPage',
  'truthDarePage','jokesPage','riddlesPage','game24Page','idiomChainPage','mindReadingPage',
  'tarotPage','dreamPage','mbtiPage','iqPage','bloodMatchPage','charDivPage','astrodicePage','runePage',
  'pendulumPage','lenormandPage','oraclePage','kipperPage','numerologyPage','tealeafPage','crystalballPage',
  'wheelPage','coinWheelPage','itemWheelPage','cardWheelPage','pinballWheelPage',
  'capsulePage','achievementPage','statusPage','foodShopPage','petSchoolPage','petPlayPage','petWorkPage',
  'dailyTaskPage','cleanShopPage','toyShopPage','superItemShopPage','warehousePage','mailboxPage',
  'usageStatsPage','collectionPage','collectionRecordPage',
  'spotDiffPage','match3Page','typingPage','linkGamePage','almanacPage','animalPersonalityPage',
  'faceScorePage','moralityPage','petDressPage','petSkillPage','petExplorePage','petDiaryPage'
]);
const FL_BREADCRUMB_AUTO_HIDE_DELAY = 2500;
const FL_BREADCRUMB_BLUR_DURATION = 120;
const FL_BREADCRUMB_FADE_DURATION = 180;
let flBreadcrumbAutoHideTimer = null;
let flBreadcrumbHidePhaseTimer = null;
let flBreadcrumbCollapseTimer = null;
function flResetBreadcrumbAutoHide(){
  if(flBreadcrumbAutoHideTimer !== null){
    clearTimeout(flBreadcrumbAutoHideTimer);
    flBreadcrumbAutoHideTimer = null;
  }
  if(flBreadcrumbHidePhaseTimer !== null){
    clearTimeout(flBreadcrumbHidePhaseTimer);
    flBreadcrumbHidePhaseTimer = null;
  }
  if(flBreadcrumbCollapseTimer !== null){
    clearTimeout(flBreadcrumbCollapseTimer);
    flBreadcrumbCollapseTimer = null;
  }
  document.documentElement.classList.remove('breadcrumb-blurring','breadcrumb-auto-hidden','breadcrumb-nav-collapsed');
}
function flShowBreadcrumbTemporarily(){
  const root = document.documentElement;
  if(root.classList.contains('address-bar-hidden')) return false;
  const nav = document.querySelector('body > .sticky-nav.chest-float-nav');
  const breadcrumb = nav?.querySelector('.breadcrumb');
  if(!nav || !breadcrumb?.textContent.trim()) return false;

  const wasCollapsed = root.classList.contains('breadcrumb-nav-collapsed');
  const previousHeight = nav.offsetHeight;
  flResetBreadcrumbAutoHide();
  if(wasCollapsed) window.flSyncLiftedStickyNavHeight?.(previousHeight);

  flBreadcrumbAutoHideTimer = setTimeout(function(){
    flBreadcrumbAutoHideTimer = null;
    const activeNav = document.querySelector('body > .sticky-nav.chest-float-nav');
    const activeBreadcrumb = activeNav?.querySelector('.breadcrumb');
    if(root.classList.contains('address-bar-hidden') || currentPageName === 'home' || !activeNav || !activeBreadcrumb?.textContent.trim()) return;
    root.classList.add('breadcrumb-blurring');
    flBreadcrumbHidePhaseTimer = setTimeout(function(){
      flBreadcrumbHidePhaseTimer = null;
      const latestNav = document.querySelector('body > .sticky-nav.chest-float-nav');
      const latestBreadcrumb = latestNav?.querySelector('.breadcrumb');
      if(root.classList.contains('address-bar-hidden') || currentPageName === 'home' || !root.classList.contains('breadcrumb-blurring') || !latestNav || !latestBreadcrumb?.textContent.trim()) return;
      root.classList.add('breadcrumb-auto-hidden');
      flBreadcrumbCollapseTimer = setTimeout(function(){
        flBreadcrumbCollapseTimer = null;
        const collapsedNav = document.querySelector('body > .sticky-nav.chest-float-nav');
        const collapsedBreadcrumb = collapsedNav?.querySelector('.breadcrumb');
        if(root.classList.contains('address-bar-hidden') || currentPageName === 'home' || !root.classList.contains('breadcrumb-auto-hidden') || !collapsedNav || !collapsedBreadcrumb?.textContent.trim()) return;
        const heightBeforeCollapse = collapsedNav.offsetHeight;
        root.classList.add('breadcrumb-nav-collapsed');
        window.flSyncLiftedStickyNavHeight?.(heightBeforeCollapse);
      },FL_BREADCRUMB_FADE_DURATION);
    },FL_BREADCRUMB_BLUR_DURATION);
  },FL_BREADCRUMB_AUTO_HIDE_DELAY);
  return true;
}
window.flResetBreadcrumbAutoHide = flResetBreadcrumbAutoHide;
function flKeepBreadcrumbVisibleForConfirm(){
  const root = document.documentElement;
  const nav = document.querySelector('body > .sticky-nav.chest-float-nav');
  const wasCollapsed = root.classList.contains('breadcrumb-nav-collapsed');
  const previousHeight = nav?.offsetHeight || 0;
  flResetBreadcrumbAutoHide();
  if(wasCollapsed && nav) window.flSyncLiftedStickyNavHeight?.(previousHeight);
}
window.flShowBreadcrumbTemporarily = flShowBreadcrumbTemporarily;
document.addEventListener('click',function(event){
  const nav = document.querySelector('body > .sticky-nav.chest-float-nav');
  const target = event.target instanceof Element ? event.target : event.target?.parentElement;
  if(!nav || !target || !nav.contains(target) || document.documentElement.classList.contains('address-bar-hidden')) return;
  if(target.closest('.breadcrumb,button,a,input,select,textarea,[role="button"],[role="switch"],[contenteditable="true"]')) return;
  flShowBreadcrumbTemporarily();
});
function flAfterTopbarExpansion(nav,pageName,callback){
  if(!nav?.classList.contains('breadcrumb-expand-pending')){
    callback();
    return;
  }
  let completed = false;
  let fallbackTimer = null;
  const finish = function(){
    if(completed) return;
    completed = true;
    if(fallbackTimer !== null) clearTimeout(fallbackTimer);
    nav.removeEventListener('transitionend',onTransitionEnd);
    requestAnimationFrame(function(){
      if(document.querySelector('body > .sticky-nav.chest-float-nav') !== nav || currentPageName !== pageName) return;
      callback();
    });
  };
  const onTransitionEnd = function(event){
    if(event.target === nav && event.propertyName === 'height') finish();
  };
  nav.addEventListener('transitionend',onTransitionEnd);
  fallbackTimer = setTimeout(finish,620);
}
function flClearBreadcrumbTransitionHiddenTargets(root=document){
  root.querySelectorAll('[data-fl-breadcrumb-transition-hidden],[data-fl-breadcrumb-entry-pending]').forEach(function(node){
    node.removeAttribute('data-fl-breadcrumb-transition-hidden');
    node.removeAttribute('data-fl-breadcrumb-entry-pending');
  });
}
function flClearBreadcrumbTransitionFrames(root=document){
  root.querySelectorAll('[data-fl-breadcrumb-transition-frame]').forEach(function(frame){ frame.remove(); });
}
let flChestLoadPromise = null;
function ensureFlChestScript(){
  if(window.__flChestScriptsLoaded) return Promise.resolve();
  if(flChestLoadPromise) return flChestLoadPromise;
  flChestLoadPromise = window.flLoadScriptOnce('./js/toolbox.js?v=20261022-chest-core')
    .then(function(){
      return Promise.resolve(window.__flChestModulesReady);
    })
    .then(function(){
      window.__flChestScriptsLoaded = true;
    })
    .catch(function(error){
      flChestLoadPromise = null;
      throw error;
    });
  return flChestLoadPromise;
}
function reportFlChestLoadError(error, route, retryAction){
  if(route && typeof window.flShowToolLoadFailure === 'function'){
    window.flShowToolLoadFailure(route, error, retryAction);
    return;
  }
  console.error(error);
  showToast('百宝箱脚本加载失败，请稍后重试');
}
function openChestTool(pageId, title){
  if(window.__flChestScriptsLoaded && typeof window.openChestToolLoaded === 'function'){
    return window.openChestToolLoaded(pageId, title);
  }
  ensureFlChestScript()
    .then(function(){ window.openChestToolLoaded(pageId, title); })
    .catch(function(error){ reportFlChestLoadError(error, pageId, function(){ openChestTool(pageId, title); }); });
}
const headerWidthAnimCleanups = new WeakMap();
function animateActiveBackButtonWidth(startWidth,onfinish){
  let callbackCalled = false;
  const finishCallback = function(){
    if(callbackCalled) return;
    callbackCalled = true;
    if(typeof onfinish === 'function') onfinish();
  };
  if(!startWidth){ finishCallback(); return; }
  const button = document.querySelector('.chest-float-nav .tool-header > .back-btn:not(.header-fav-star-btn):not(.header-fav-page-btn)');
  if(!button){ finishCallback(); return; }
  const oldCleanup = headerWidthAnimCleanups.get(button);
  if(oldCleanup) oldCleanup();
  const targetWidth = button.getBoundingClientRect().width;
  if(Math.abs(targetWidth - startWidth) < 1){ finishCallback(); return; }
  button.classList.add('header-width-transition');
  button.style.width = startWidth + 'px';
  void button.offsetWidth;
  let timer;
  let frameId = 0;
  let cleaned = false;
  const cleanup = function(){
    if(cleaned) return;
    cleaned = true;
    if(timer) clearTimeout(timer);
    if(frameId) cancelAnimationFrame(frameId);
    button.removeEventListener('transitionend', onTransitionEnd);
    button.style.width = '';
    button.classList.remove('header-width-transition');
    headerWidthAnimCleanups.delete(button);
    finishCallback();
  };
  const onTransitionEnd = function(event){
    if(event.propertyName === 'width') cleanup();
  };
  button.addEventListener('transitionend', onTransitionEnd);
  timer = setTimeout(cleanup, 320);
  headerWidthAnimCleanups.set(button, cleanup);
  frameId = requestAnimationFrame(function(){ frameId = 0; button.style.width = targetWidth + 'px'; });
}
let activeHomeBrandTransitionCleanup = null;
function releaseHomeHeaderFavStarEntrance(){
  window.__flDelayHeaderFavStarEntrance = false;
  const pending = window.__flPendingHeaderFavStarEntrance || [];
  window.__flPendingHeaderFavStarEntrance = [];
  pending.forEach(function(entry){
    if(typeof entry === 'function') entry();
    else if(entry && typeof entry.start === 'function') entry.start();
  });
}
function cancelHomeHeaderFavStarEntrance(){
  window.__flDelayHeaderFavStarEntrance = false;
  (window.__flPendingHeaderFavStarEntrance || []).forEach(function(entry){
    if(entry && typeof entry.cancel === 'function') entry.cancel();
  });
  window.__flPendingHeaderFavStarEntrance = [];
}
let activeHomeTitleBackCleanup = null;
function finishHomeTitleBackTransition(){
  if(activeHomeTitleBackCleanup) activeHomeTitleBackCleanup();
}
function captureHomeTitleBackSource(){
  const element = document.getElementById('homeBrandTitle');
  if(!element || !element.isConnected) return null;
  const rect = element.getBoundingClientRect();
  if(rect.width < 1 || rect.height < 1) return null;
  const clone = element.cloneNode(true);
  clone.removeAttribute('id');
  clone.querySelectorAll('[id]').forEach(function(node){ node.removeAttribute('id'); });
  return {clone:clone,rect:{left:rect.left,top:rect.top,width:rect.width,height:rect.height}};
}
function finishHomeBrandTransition(){
  if(activeHomeBrandTransitionCleanup) activeHomeBrandTransitionCleanup();
  cancelHomeHeaderFavStarEntrance();
  finishHomeTitleBackTransition();
}
function animateHeaderStarIntoBackButton(starSource,backSource){
  if(!starSource || !backSource || typeof Element.prototype.animate !== 'function' ||
     window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const duration = 1000;
  const absorbLeft = backSource.rect.left + backSource.rect.width - 5 - starSource.rect.width / 2;
  const absorbTop = backSource.rect.top + (backSource.rect.height - starSource.rect.height) / 2;
  const overlay = document.createElement('div');
  overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{
    position:'fixed',left:'0',top:'0',width:'100vw',height:'100vh',boxSizing:'border-box',
    pointerEvents:'none',zIndex:'1102',overflow:'visible'
  });
  const starFace = document.createElement('div');
  Object.assign(starFace.style,{
    position:'absolute',left:starSource.rect.left+'px',top:starSource.rect.top+'px',
    width:starSource.rect.width+'px',height:starSource.rect.height+'px',boxSizing:'border-box',
    display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',whiteSpace:'nowrap',
    pointerEvents:'none',transformOrigin:'center center',zIndex:'1',
    background:starSource.style.background,backgroundColor:starSource.style.backgroundColor,backdropFilter:starSource.style.backdropFilter,webkitBackdropFilter:starSource.style.webkitBackdropFilter,color:starSource.style.color,
    border:starSource.style.border,borderRadius:starSource.style.borderRadius,boxShadow:starSource.style.boxShadow,
    padding:starSource.style.padding,fontFamily:starSource.style.fontFamily,fontSize:starSource.style.fontSize,
    fontWeight:starSource.style.fontWeight,lineHeight:starSource.style.lineHeight
  });
  starFace.textContent = starSource.text;
  overlay.appendChild(starFace);
  document.body.appendChild(overlay);
  let cleaned = false;
  let fallbackTimer = null;
  let animation = null;
  const cleanup = function(){
    if(cleaned) return;
    cleaned = true;
    if(fallbackTimer !== null) clearTimeout(fallbackTimer);
    if(animation) animation.cancel();
    overlay.remove();
    if(activeHomeBrandTransitionCleanup === cleanup) activeHomeBrandTransitionCleanup = null;
  };
  activeHomeBrandTransitionCleanup = cleanup;
  try{
    animation = starFace.animate([
      {left:starSource.rect.left+'px',top:starSource.rect.top+'px',transform:'scale(1)',opacity:starSource.opacity,filter:'blur(0px)',offset:0},
      {left:starSource.rect.left+'px',top:starSource.rect.top+'px',transform:'scale(.96)',opacity:starSource.opacity,filter:'blur(1.5px)',offset:.12},
      {left:absorbLeft+'px',top:absorbTop+'px',transform:'scale(.35) rotate(-8deg)',opacity:.38,filter:'blur(2.5px)',offset:.34},
      {left:absorbLeft+'px',top:absorbTop+'px',transform:'scale(.24) rotate(-12deg)',opacity:0,filter:'blur(6px)',offset:.47},
      {left:absorbLeft+'px',top:absorbTop+'px',transform:'scale(.24) rotate(-12deg)',opacity:0,filter:'blur(6px)',offset:1}
    ],{duration:duration,easing:'cubic-bezier(.25,.8,.25,1)',fill:'both'});
    animation.onfinish = cleanup;
    fallbackTimer = setTimeout(cleanup,duration+140);
  }catch(error){
    cleanup();
  }
}
let activeHeaderButtonMorphCleanup = null;
let activeHomeFavoriteAbsorbCleanup = null;
let activeHomeFavoriteReturnCleanup = null;
let activeChestHelpTransitionCleanup = null;
function captureHeaderButtonSnapshot(button){
  if(!button || !button.isConnected) return null;
  const rect = button.getBoundingClientRect();
  const style = getComputedStyle(button);
  if(rect.width < 1 || rect.height < 1 || style.visibility === 'hidden' || Number(style.opacity) === 0) return null;
  return {
    rect:{left:rect.left,top:rect.top,width:rect.width,height:rect.height},
    text:button.textContent.trim(),
    style:{
      background:style.background,backgroundColor:style.backgroundColor,backdropFilter:style.backdropFilter || style.webkitBackdropFilter,webkitBackdropFilter:style.webkitBackdropFilter || style.backdropFilter,color:style.color,border:style.border,borderColor:style.borderColor,
      borderRadius:style.borderRadius,boxShadow:style.boxShadow,padding:style.padding,
      fontFamily:style.fontFamily,fontSize:style.fontSize,fontWeight:style.fontWeight,lineHeight:style.lineHeight
    }
  };
}
function finishHeaderButtonMorph(){
  if(activeHeaderButtonMorphCleanup) activeHeaderButtonMorphCleanup();
}
function finishHomeFavoriteAbsorb(){
  if(activeHomeFavoriteAbsorbCleanup) activeHomeFavoriteAbsorbCleanup();
  if(activeHomeFavoriteReturnCleanup) activeHomeFavoriteReturnCleanup();
  if(activeChestHelpTransitionCleanup) activeChestHelpTransitionCleanup();
}

const FL_HOME_ENTRY_SPEED_FACTOR = 1;
function animateHomeFavoriteAbsorb(source,target){
  if(!source || !target || typeof Element.prototype.animate !== 'function' || window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  finishHomeFavoriteAbsorb();
  // 收拢到账号按钮靠近收藏按钮的一侧。
  const sourceCenter = source.rect.left + source.rect.width / 2;
  const targetCenter = target.rect.left + target.rect.width / 2;
  const targetEdge = sourceCenter <= targetCenter ? target.rect.left : target.rect.left + target.rect.width;
  const targetLeft = targetEdge - source.rect.width / 2;
  const targetTop = target.rect.top + (target.rect.height - source.rect.height) / 2;
  const overlay = document.createElement('div');
  overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{
    position:'fixed',left:source.rect.left+'px',top:source.rect.top+'px',
    width:source.rect.width+'px',height:source.rect.height+'px',boxSizing:'border-box',
    display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',whiteSpace:'nowrap',
    transformOrigin:'center center',pointerEvents:'none',zIndex:'1101',
    background:source.style.background,backgroundColor:source.style.backgroundColor,backdropFilter:source.style.backdropFilter,webkitBackdropFilter:source.style.webkitBackdropFilter,color:source.style.color,
    border:source.style.border,borderRadius:source.style.borderRadius,boxShadow:source.style.boxShadow,
    padding:source.style.padding,fontFamily:source.style.fontFamily,fontSize:source.style.fontSize,
    fontWeight:source.style.fontWeight,lineHeight:source.style.lineHeight
  });
  overlay.textContent = source.text;
  document.body.appendChild(overlay);
  const animation = overlay.animate([
    {left:source.rect.left+'px',top:source.rect.top+'px',transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:0},
    {left:source.rect.left+'px',top:source.rect.top+'px',transform:'scale(1.06)',opacity:1,filter:'blur(.5px)',offset:.14},
    {left:targetLeft+'px',top:targetTop+'px',transform:'scale(.72)',opacity:0,filter:'blur(4px)',offset:1}
  ],{duration:650/FL_HOME_ENTRY_SPEED_FACTOR,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
  let cleaned = false;
  const cleanup = function(){
    if(cleaned) return;
    cleaned = true;
    animation.cancel();
    overlay.remove();
    if(activeHomeFavoriteAbsorbCleanup === cleanup) activeHomeFavoriteAbsorbCleanup = null;
  };
  activeHomeFavoriteAbsorbCleanup = cleanup;
  animation.onfinish = cleanup;
}
function animateHomeFavoriteReturnFly(favorite,fromRect,onfinish,duration){
  if(!favorite || !fromRect || typeof Element.prototype.animate !== 'function') return null;
  const animationDuration = duration || 650;
  const startLeft = fromRect.left + (fromRect.width - favorite.rect.width) / 2;
  const startTop = fromRect.top + (fromRect.height - favorite.rect.height) / 2;
  const overlay = document.createElement('div');
  overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{
    position:'fixed',left:startLeft+'px',top:startTop+'px',width:favorite.rect.width+'px',height:favorite.rect.height+'px',
    boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',whiteSpace:'nowrap',
    transformOrigin:'center center',pointerEvents:'none',zIndex:'1101',
    background:favorite.style.background,backgroundColor:favorite.style.backgroundColor,backdropFilter:favorite.style.backdropFilter,webkitBackdropFilter:favorite.style.webkitBackdropFilter,color:favorite.style.color,
    border:favorite.style.border,borderRadius:favorite.style.borderRadius,boxShadow:favorite.style.boxShadow,
    padding:favorite.style.padding,fontFamily:favorite.style.fontFamily,fontSize:favorite.style.fontSize,
    fontWeight:favorite.style.fontWeight,lineHeight:favorite.style.lineHeight
  });
  overlay.textContent = favorite.text;
  document.body.appendChild(overlay);
  const animation = overlay.animate([
    {left:startLeft+'px',top:startTop+'px',transform:'scale(.72)',opacity:.55,filter:'blur(4px)',offset:0},
    {left:startLeft+'px',top:startTop+'px',transform:'scale(.82)',opacity:1,filter:'blur(2px)',offset:.16},
    {left:favorite.rect.left+'px',top:favorite.rect.top+'px',transform:'scale(1.06)',opacity:1,filter:'blur(.5px)',offset:.86},
    {left:favorite.rect.left+'px',top:favorite.rect.top+'px',transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:1}
  ],{duration:animationDuration,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
  let cleaned = false;
  const cleanup = function(){
    if(cleaned) return;
    cleaned = true;
    animation.cancel();
    overlay.remove();
    if(activeHomeFavoriteReturnCleanup === cleanup) activeHomeFavoriteReturnCleanup = null;
    if(typeof onfinish === 'function') onfinish();
  };
  activeHomeFavoriteReturnCleanup = cleanup;
  animation.onfinish = cleanup;
  return cleanup;
}
function animateHeaderFavoriteReturnGrow(button){
  if(!button || !button.isConnected || typeof button.animate !== 'function' || window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const animation = button.animate([
    {transform:'scale(.1)',opacity:0,filter:'blur(5px)',offset:0},
    {transform:'scale(.87)',opacity:.55,filter:'blur(2.8px)',offset:.42},
    {transform:'scale(.97)',opacity:.92,filter:'blur(.8px)',offset:.82},
    {transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:1}
  ],{duration:650,easing:'cubic-bezier(.2,.7,.25,1)',fill:'both'});
  animation.onfinish = function(){ animation.cancel(); };
}

function animateHeaderFavoriteClickShrink(snapshot){
  if(!snapshot || typeof Element.prototype.animate !== 'function' || window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const rect = snapshot.rect;
  const overlay = document.createElement('div');
  overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{
    position:'fixed',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',
    boxSizing:'border-box',pointerEvents:'none',zIndex:'1203',overflow:'visible'
  });
  document.body.appendChild(overlay);
  const face = document.createElement('div');
  Object.assign(face.style,{
    position:'absolute',inset:'0',boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'center',
    whiteSpace:'nowrap',background:snapshot.style.background,backgroundColor:snapshot.style.backgroundColor,backdropFilter:snapshot.style.backdropFilter,webkitBackdropFilter:snapshot.style.webkitBackdropFilter,color:snapshot.style.color,
    border:snapshot.style.border,borderRadius:snapshot.style.borderRadius,boxShadow:snapshot.style.boxShadow,
    padding:snapshot.style.padding,fontFamily:snapshot.style.fontFamily,fontSize:snapshot.style.fontSize,
    fontWeight:snapshot.style.fontWeight,lineHeight:snapshot.style.lineHeight
  });
  face.textContent = snapshot.text;
  overlay.appendChild(face);
  face.animate([
    {transform:'scale(1)',opacity:1,filter:'blur(0px)'},
    {transform:'scale(.97)',opacity:.92,filter:'blur(.8px)',offset:.18},
    {transform:'scale(.87)',opacity:.55,filter:'blur(2.8px)',offset:.58},
    {transform:'scale(.1)',opacity:0,filter:'blur(5px)'}
  ],{duration:650,easing:'cubic-bezier(.25,.1,.45,1)',fill:'forwards'});
  setTimeout(function(){ overlay.remove(); },700);
}

function animateChestStatusReturnPop(button){
  if(!button || typeof Element.prototype.animate !== 'function' || window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const oldVisibility = button.style.getPropertyValue('visibility');
  const oldVisibilityPriority = button.style.getPropertyPriority('visibility');
  button.style.setProperty('visibility','hidden','important');
  requestAnimationFrame(function(){
    const animation = button.animate([
      {transform:'scale(.78)',opacity:0,filter:'blur(2px)',offset:0},
      {transform:'scale(1.09)',opacity:1,filter:'blur(.6px)',offset:.72},
      {transform:'scale(.96)',opacity:1,filter:'blur(.15px)',offset:.88},
      {transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:1}
    ],{duration:560,easing:'cubic-bezier(.25,.8,.25,1)',fill:'both'});
    requestAnimationFrame(function(){
      if(oldVisibility) button.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
      else button.style.removeProperty('visibility');
    });
    let cleaned = false;
    const cleanup = function(){
      if(cleaned) return;
      cleaned = true;
      animation.cancel();
      if(oldVisibility) button.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
      else button.style.removeProperty('visibility');
    };
    animation.onfinish = cleanup;
    setTimeout(cleanup,760);
  });
}
function animateChestHelpSpring(helpSnapshot,statusRect,direction,helpButton){
  if(!helpSnapshot || !statusRect || typeof Element.prototype.animate !== 'function' || window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(activeChestHelpTransitionCleanup) activeChestHelpTransitionCleanup();
  const returning=direction==='return';
  const startRect=returning
    ? {left:statusRect.left+(statusRect.width-helpSnapshot.rect.width)/2,top:statusRect.top+(statusRect.height-helpSnapshot.rect.height)/2}
    : helpSnapshot.rect;
  const endRect=returning
    ? helpSnapshot.rect
    : {left:statusRect.left+(statusRect.width-helpSnapshot.rect.width)/2,top:statusRect.top+(statusRect.height-helpSnapshot.rect.height)/2};
  const oldVisibility=returning&&helpButton?helpButton.style.getPropertyValue('visibility'):'';
  const oldVisibilityPriority=returning&&helpButton?helpButton.style.getPropertyPriority('visibility'):'';
  if(returning&&helpButton)helpButton.style.setProperty('visibility','hidden','important');
  const overlay=document.createElement('div');
  overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{
    position:'fixed',left:startRect.left+'px',top:startRect.top+'px',width:helpSnapshot.rect.width+'px',height:helpSnapshot.rect.height+'px',
    boxSizing:'border-box',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',whiteSpace:'nowrap',
    transformOrigin:'center center',pointerEvents:'none',zIndex:'1102',
    background:helpSnapshot.style.background,backgroundColor:helpSnapshot.style.backgroundColor,backdropFilter:helpSnapshot.style.backdropFilter,webkitBackdropFilter:helpSnapshot.style.webkitBackdropFilter,color:helpSnapshot.style.color,
    border:helpSnapshot.style.border,borderRadius:helpSnapshot.style.borderRadius,boxShadow:helpSnapshot.style.boxShadow,
    padding:helpSnapshot.style.padding,fontFamily:helpSnapshot.style.fontFamily,fontSize:helpSnapshot.style.fontSize,
    fontWeight:helpSnapshot.style.fontWeight,lineHeight:helpSnapshot.style.lineHeight
  });
  overlay.textContent=helpSnapshot.text;
  document.body.appendChild(overlay);
  const lerp=(start,end,amount)=>start+(end-start)*amount;
  const keyframes=returning?[
    {left:startRect.left+'px',top:startRect.top+'px',transform:'scale(.45)',opacity:.16,filter:'blur(4px)',offset:0},
    {left:lerp(startRect.left,endRect.left,.12)+'px',top:lerp(startRect.top,endRect.top,.12)+'px',transform:'scale(.62)',opacity:.72,filter:'blur(3.6px)',offset:.18},
    {left:lerp(startRect.left,endRect.left,.86)+'px',top:lerp(startRect.top,endRect.top,.86)+'px',transform:'scale(.94)',opacity:1,filter:'blur(2.5px)',offset:.7},
    {left:(endRect.left+5)+'px',top:(endRect.top-3)+'px',transform:'scale(1.1)',opacity:1,filter:'blur(1.2px)',offset:.84},
    {left:(endRect.left-1)+'px',top:(endRect.top+1)+'px',transform:'scale(.96)',opacity:1,filter:'blur(.35px)',offset:.93},
    {left:endRect.left+'px',top:endRect.top+'px',transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:1}
  ]:[
    {left:startRect.left+'px',top:startRect.top+'px',transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:0},
    {left:startRect.left+'px',top:startRect.top+'px',transform:'scale(.96)',opacity:1,filter:'blur(2.8px)',offset:.1},
    {left:lerp(startRect.left,endRect.left,.72)+'px',top:lerp(startRect.top,endRect.top,.72)+'px',transform:'scale(.82)',opacity:1,filter:'blur(2.4px)',offset:.62},
    {left:endRect.left+'px',top:endRect.top+'px',transform:'scale(.62)',opacity:.94,filter:'blur(3.1px)',offset:.8},
    {left:(endRect.left+5)+'px',top:(endRect.top-3)+'px',transform:'scale(.72)',opacity:.76,filter:'blur(3.5px)',offset:.89},
    {left:(endRect.left-1)+'px',top:(endRect.top+1)+'px',transform:'scale(.48)',opacity:.42,filter:'blur(3.8px)',offset:.96},
    {left:endRect.left+'px',top:endRect.top+'px',transform:'scale(.45)',opacity:0,filter:'blur(4px)',offset:1}
  ];
  const animation=overlay.animate(keyframes,{duration:660,easing:'cubic-bezier(.32,.86,.28,1)',fill:'both'});
  let cleaned=false;
  let fallbackTimer=null;
  const cleanup=function(){
    if(cleaned)return;
    cleaned=true;
    if(fallbackTimer!==null)clearTimeout(fallbackTimer);
    animation.cancel();
    overlay.remove();
    if(returning&&helpButton){
      if(oldVisibility)helpButton.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
      else helpButton.style.removeProperty('visibility');
    }
    if(activeChestHelpTransitionCleanup===cleanup)activeChestHelpTransitionCleanup=null;
  };
  activeChestHelpTransitionCleanup=cleanup;
  animation.onfinish=cleanup;
  fallbackTimer=setTimeout(cleanup,820);
}
function animateChestHelpFlyout(helpButton,helpSnapshot,statusSnapshot){
  if(!helpButton||!helpSnapshot||!statusSnapshot||typeof helpButton.animate!=='function'||window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return null;
  if(activeChestHelpTransitionCleanup)activeChestHelpTransitionCleanup();
  const oldVisibility=helpButton.style.getPropertyValue('visibility');
  const oldVisibilityPriority=helpButton.style.getPropertyPriority('visibility');
  const startX=statusSnapshot.rect.left-(helpSnapshot.rect.left+helpSnapshot.rect.width/2);
  let animation=null;
  let cleaned=false;
  let timer=null;
  const cleanup=function(){
    if(cleaned)return;
    cleaned=true;
    if(timer!==null)clearTimeout(timer);
    if(animation)animation.cancel();
    if(oldVisibility)helpButton.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
    else helpButton.style.removeProperty('visibility');
    if(activeChestHelpTransitionCleanup===cleanup)activeChestHelpTransitionCleanup=null;
  };
  helpButton.style.setProperty('visibility','hidden','important');
  activeChestHelpTransitionCleanup=cleanup;
  // 如果状态按钮无法完成过渡，仍恢复问号按钮。
  timer=setTimeout(cleanup,2000);
  return function(){
    if(cleaned||!helpButton.isConnected){cleanup();return;}
    try{
      animation=helpButton.animate([
        {transform:'translateX('+startX+'px) scale(.18,.7)',opacity:0,offset:0},
        {transform:'translateX('+(startX*.65)+'px) scale(.55,.9)',opacity:.85,offset:.2},
        {transform:'translateX(-6px) scale(1.15,.85)',opacity:1,offset:.65},
        {transform:'translateX(2px) scale(.94,1.06)',opacity:1,offset:.82},
        {transform:'translateX(0) scale(1)',opacity:1,offset:1}
      ],{duration:650,easing:'cubic-bezier(.22,.8,.3,1)',fill:'both'});
      if(oldVisibility)helpButton.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
      else helpButton.style.removeProperty('visibility');
      animation.onfinish=cleanup;
    }catch(error){cleanup();}
  };
}
function animateHomeTitleToBackButton(source){
  if(!source || typeof Element.prototype.animate !== 'function' ||
     window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const target = document.querySelector('body > .sticky-nav.chest-float-nav .tool-header > .back-btn:not(.header-fav-star-btn):not(.header-fav-page-btn)');
  if(!target || !target.isConnected) return;
  finishHomeTitleBackTransition();

  const start = source.rect;
  const endRect = target.getBoundingClientRect();
  if(endRect.width < 1 || endRect.height < 1) return;
  const end = {left:endRect.left,top:endRect.top,width:endRect.width,height:endRect.height};
  const titleGhost = source.clone;
  titleGhost.setAttribute('aria-hidden','true');
  Object.assign(titleGhost.style,{
    position:'fixed',left:start.left+'px',top:start.top+'px',width:'max-content',maxWidth:start.width+'px',height:start.height+'px',
    flex:'none',minWidth:'0',alignItems:'flex-start',margin:'0',zIndex:'1104',pointerEvents:'none',transformOrigin:'center center'
  });

  const buttonGhost = target.cloneNode(true);
  buttonGhost.removeAttribute('id');
  buttonGhost.removeAttribute('onclick');
  buttonGhost.onclick = null;
  buttonGhost.setAttribute('aria-hidden','true');
  buttonGhost.tabIndex = -1;
  const targetStyle = getComputedStyle(target);
  Object.assign(buttonGhost.style,{
    position:'fixed',left:end.left+'px',top:end.top+'px',width:end.width+'px',height:end.height+'px',
    boxSizing:'border-box',margin:'0',zIndex:'1104',pointerEvents:'none',transformOrigin:'center center',
    display:targetStyle.display,alignItems:targetStyle.alignItems,justifyContent:targetStyle.justifyContent,
    gap:targetStyle.gap,background:targetStyle.background,border:targetStyle.border,
    borderRadius:targetStyle.borderRadius,boxShadow:targetStyle.boxShadow,color:targetStyle.color,
    padding:targetStyle.padding,fontFamily:targetStyle.fontFamily,fontSize:targetStyle.fontSize,
    fontWeight:targetStyle.fontWeight,lineHeight:targetStyle.lineHeight
  });

  const oldOpacity = target.style.getPropertyValue('opacity');
  const oldOpacityPriority = target.style.getPropertyPriority('opacity');
  const oldPointerEvents = target.style.getPropertyValue('pointer-events');
  const oldPointerEventsPriority = target.style.getPropertyPriority('pointer-events');
  // 保留透明的真实按钮作为点击目标，动画替身只负责显示效果。
  target.style.setProperty('opacity','0','important');
  target.style.setProperty('pointer-events','auto','important');
  document.body.append(titleGhost,buttonGhost);

  const animations = [];
  let cleaned = false;
  let fallbackTimer = null;
  const cleanup = function(){
    if(cleaned) return;
    cleaned = true;
    if(fallbackTimer !== null) clearTimeout(fallbackTimer);
    animations.forEach(function(animation){ animation.cancel(); });
    titleGhost.remove();
    buttonGhost.remove();
    if(oldOpacity) target.style.setProperty('opacity',oldOpacity,oldOpacityPriority);
    else target.style.removeProperty('opacity');
    if(oldPointerEvents) target.style.setProperty('pointer-events',oldPointerEvents,oldPointerEventsPriority);
    else target.style.removeProperty('pointer-events');
    if(activeHomeTitleBackCleanup === cleanup) activeHomeTitleBackCleanup = null;
  };
  activeHomeTitleBackCleanup = cleanup;
  try{
    const duration = 1400;
    const titleAnimation = titleGhost.animate([
      {left:start.left+'px',top:start.top+'px',transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:0},
      {left:start.left+'px',top:start.top+'px',transform:'scale(.92)',opacity:.96,filter:'blur(1.8px)',offset:.14},
      {left:start.left+'px',top:start.top+'px',transform:'scale(.35)',opacity:.42,filter:'blur(5px)',offset:.35},
      {left:start.left+'px',top:start.top+'px',transform:'scale(.35)',opacity:0,filter:'blur(7px)',offset:.47},
      {left:start.left+'px',top:start.top+'px',transform:'scale(.35)',opacity:0,filter:'blur(7px)',offset:1}
    ],{duration:duration,easing:'cubic-bezier(.22,.78,.2,1)',fill:'both'});
    const buttonAnimation = buttonGhost.animate([
      {opacity:0,transform:'scale(.74)',filter:'blur(8px)',offset:.34},
      {opacity:.16,transform:'scale(.82)',filter:'blur(6px)',offset:.43},
      {opacity:.82,transform:'scale(1.04)',filter:'blur(2px)',offset:.76},
      {opacity:1,transform:'scale(.985)',filter:'blur(.45px)',offset:.93},
      {opacity:1,transform:'scale(1)',filter:'blur(0px)',offset:1}
    ],{duration:duration,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
    animations.push(titleAnimation,buttonAnimation);
    titleAnimation.onfinish = cleanup;
    fallbackTimer = setTimeout(cleanup,duration+180);
  }catch(error){
    cleanup();
  }
}
function animateBackButtonToHomeTitle(backSource,titleSource){
  if(!backSource || !backSource.clone || !titleSource || typeof Element.prototype.animate !== 'function' ||
     window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const titleElement = document.getElementById('homeBrandTitle');
  if(!titleElement || !titleElement.isConnected) return;
  finishHomeTitleBackTransition();

  const backRect = backSource.rect;
  const titleRect = titleSource.rect;
  const backGhost = backSource.clone;
  const backStyle = backSource.style || {};
  Object.assign(backGhost.style,{
    position:'fixed',left:backRect.left+'px',top:backRect.top+'px',width:backRect.width+'px',height:backRect.height+'px',
    boxSizing:'border-box',margin:'0',zIndex:'1104',pointerEvents:'none',transformOrigin:'center center',whiteSpace:'nowrap',
    display:backStyle.display || 'flex',alignItems:backStyle.alignItems || 'center',justifyContent:backStyle.justifyContent || 'center',
    background:backStyle.backgroundColor,border:backStyle.border,
    borderRadius:backStyle.borderRadius,boxShadow:backStyle.boxShadow,color:backStyle.color,
    padding:backStyle.padding,fontFamily:backStyle.fontFamily,fontSize:backStyle.fontSize,
    fontWeight:backStyle.fontWeight,lineHeight:backStyle.lineHeight
  });

  const titleGhost = titleSource.clone;
  titleGhost.setAttribute('aria-hidden','true');
  Object.assign(titleGhost.style,{
    position:'fixed',left:titleRect.left+'px',top:titleRect.top+'px',width:'max-content',maxWidth:titleRect.width+'px',height:titleRect.height+'px',
    flex:'none',minWidth:'0',alignItems:'flex-start',margin:'0',zIndex:'1104',pointerEvents:'none',transformOrigin:'center center',
    opacity:'0',transform:'scale(.35)',filter:'blur(7px)'
  });

  const oldVisibility = titleElement.style.getPropertyValue('visibility');
  const oldVisibilityPriority = titleElement.style.getPropertyPriority('visibility');
  titleElement.style.setProperty('visibility','hidden','important');
  document.body.append(backGhost,titleGhost);

  const animations = [];
  let cleaned = false;
  let fallbackTimer = null;
  const cleanup = function(){
    if(cleaned) return;
    cleaned = true;
    if(fallbackTimer !== null) clearTimeout(fallbackTimer);
    animations.forEach(function(animation){ animation.cancel(); });
    backGhost.remove();
    titleGhost.remove();
    if(oldVisibility) titleElement.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
    else titleElement.style.removeProperty('visibility');
    if(activeHomeTitleBackCleanup === cleanup) activeHomeTitleBackCleanup = null;
  };
  activeHomeTitleBackCleanup = cleanup;
  try{
    const duration = 1000;
    const backAnimation = backGhost.animate([
      {left:backRect.left+'px',top:backRect.top+'px',transform:'scale(1)',opacity:1,filter:'blur(0px)',offset:0},
      {left:backRect.left+'px',top:backRect.top+'px',transform:'scale(.92)',opacity:.96,filter:'blur(1.8px)',offset:.14},
      {left:backRect.left+'px',top:backRect.top+'px',transform:'scale(.35)',opacity:.42,filter:'blur(5px)',offset:.35},
      {left:backRect.left+'px',top:backRect.top+'px',transform:'scale(.35)',opacity:0,filter:'blur(7px)',offset:.47},
      {left:backRect.left+'px',top:backRect.top+'px',transform:'scale(.35)',opacity:0,filter:'blur(7px)',offset:1}
    ],{duration:duration,easing:'cubic-bezier(.22,.78,.2,1)',fill:'both'});
    const titleAnimation = titleGhost.animate([
      {opacity:0,transform:'scale(.35)',filter:'blur(7px)',offset:0},
      {opacity:0,transform:'scale(.35)',filter:'blur(7px)',offset:.34},
      {opacity:.16,transform:'scale(.5)',filter:'blur(6px)',offset:.43},
      {opacity:.82,transform:'scale(.92)',filter:'blur(2px)',offset:.76},
      {opacity:1,transform:'scale(1.04)',filter:'blur(.45px)',offset:.93},
      {opacity:1,transform:'scale(1)',filter:'blur(0px)',offset:1}
    ],{duration:duration,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
    animations.push(backAnimation,titleAnimation);
    backAnimation.onfinish = cleanup;
    fallbackTimer = setTimeout(cleanup,duration+180);
  }catch(error){
    cleanup();
  }
}
function animateHeaderButtonMorph(source,target,duration,onfinish,startDelay){
  if(!source || !target || !target.isConnected || typeof Element.prototype.animate !== 'function') return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const animationDuration = duration || 650;
  const morphDelay = Math.max(0,Number(startDelay) || 0);
  finishHeaderButtonMorph();

  const targetRect = target.getBoundingClientRect();
  if(!targetRect.width || !targetRect.height) return;
  const targetStyle = getComputedStyle(target);
  const to = {
    rect:{left:targetRect.left,top:targetRect.top,width:targetRect.width,height:targetRect.height},
    text:target.textContent.trim(),
    style:{
      background:targetStyle.background,backgroundColor:targetStyle.backgroundColor,backdropFilter:targetStyle.backdropFilter || targetStyle.webkitBackdropFilter,webkitBackdropFilter:targetStyle.webkitBackdropFilter || targetStyle.backdropFilter,color:targetStyle.color,border:targetStyle.border,
      borderRadius:targetStyle.borderRadius,boxShadow:targetStyle.boxShadow,padding:targetStyle.padding,
      fontFamily:targetStyle.fontFamily,fontSize:targetStyle.fontSize,fontWeight:targetStyle.fontWeight,lineHeight:targetStyle.lineHeight
    }
  };
  const oldVisibility = target.style.getPropertyValue('visibility');
  const oldVisibilityPriority = target.style.getPropertyPriority('visibility');
  target.style.setProperty('visibility','hidden','important');

  const overlay = document.createElement('div');
  overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{
    position:'fixed',left:source.rect.left+'px',top:source.rect.top+'px',
    width:source.rect.width+'px',height:source.rect.height+'px',boxSizing:'border-box',
    display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',whiteSpace:'nowrap',transformOrigin:'center center',
    pointerEvents:'none',zIndex:'1100',background:source.style.background,backgroundColor:source.style.backgroundColor,backdropFilter:source.style.backdropFilter,webkitBackdropFilter:source.style.webkitBackdropFilter,color:source.style.color,
    border:source.style.border,borderRadius:source.style.borderRadius,boxShadow:source.style.boxShadow,
    padding:source.style.padding,fontFamily:source.style.fontFamily,fontSize:source.style.fontSize,
    fontWeight:source.style.fontWeight,lineHeight:source.style.lineHeight
  });
  // Switch from the visible source label to the destination label when the morph starts.
  const toLabel = document.createElement('span');
  Object.assign(toLabel.style,{
    position:'absolute',inset:'0',display:'flex',alignItems:'center',justifyContent:'center',
    whiteSpace:'nowrap',pointerEvents:'none'
  });
  toLabel.textContent = morphDelay ? source.text : to.text;
  overlay.appendChild(toLabel);
  document.body.appendChild(overlay);

  const animations = [];
  let cleaned = false;
  let labelSwapTimer = null;
  const cleanup = function(){
    if(cleaned) return;
    cleaned = true;
    if(labelSwapTimer !== null) clearTimeout(labelSwapTimer);
    animations.forEach(function(animation){ animation.cancel(); });
    if(oldVisibility) target.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
    else target.style.removeProperty('visibility');
    overlay.remove();
    if(activeHeaderButtonMorphCleanup === cleanup) activeHeaderButtonMorphCleanup = null;
  };
  activeHeaderButtonMorphCleanup = cleanup;
  const morph = overlay.animate([
    {
      left:source.rect.left+'px',top:source.rect.top+'px',width:source.rect.width+'px',height:source.rect.height+'px',
      backgroundColor:source.style.backgroundColor,color:source.style.color,border:source.style.border,backdropFilter:source.style.backdropFilter,
      borderRadius:source.style.borderRadius,boxShadow:source.style.boxShadow,padding:source.style.padding,
      fontSize:source.style.fontSize,fontWeight:source.style.fontWeight
    },
    {
      left:to.rect.left+'px',top:to.rect.top+'px',width:to.rect.width+'px',height:to.rect.height+'px',
      backgroundColor:to.style.backgroundColor,color:to.style.color,border:to.style.border,backdropFilter:to.style.backdropFilter,
      borderRadius:to.style.borderRadius,boxShadow:to.style.boxShadow,padding:to.style.padding,
      fontSize:to.style.fontSize,fontWeight:to.style.fontWeight,transform:'scale(1.08)',offset:.76
    },
    {
      left:to.rect.left+'px',top:to.rect.top+'px',width:to.rect.width+'px',height:to.rect.height+'px',
      backgroundColor:to.style.backgroundColor,color:to.style.color,border:to.style.border,backdropFilter:to.style.backdropFilter,
      borderRadius:to.style.borderRadius,boxShadow:to.style.boxShadow,padding:to.style.padding,
      fontSize:to.style.fontSize,fontWeight:to.style.fontWeight,transform:'scale(1)'
    }
  ],{duration:animationDuration,delay:morphDelay,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
  animations.push(morph);
  if(morphDelay){
    labelSwapTimer = window.setTimeout(function(){
      labelSwapTimer = null;
      if(!cleaned) toLabel.textContent = to.text;
    },morphDelay);
  }

  morph.onfinish = function(){
    cleanup();
    if(typeof onfinish === 'function') onfinish();
  };
}
// 快速切页时冻结顶栏当前帧，再把这一帧接到新页面的按钮位置。
function freezeBreadcrumbPart(element,layer){
  if(!element) return null;
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const opacity = Number(style.opacity);
  if(style.visibility === 'hidden' || opacity < .015 || rect.width < 1 || rect.height < 1) return null;
  if(!element.textContent.trim() && style.backgroundColor === 'rgba(0, 0, 0, 0)' &&
     style.boxShadow === 'none' && style.borderStyle === 'none') return null;
  const holder = document.createElement('div');
  Object.assign(holder.style,{
    position:'absolute',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',
    boxSizing:'border-box',transformOrigin:'top left',opacity:String(opacity),pointerEvents:'none',
    overflow:'visible'
  });
  const copy = element.cloneNode(true);
  copy.querySelectorAll('[id]').forEach(function(node){ node.removeAttribute('id'); });
  copy.removeAttribute('id');
  const naturalWidth = Math.max(1,parseFloat(style.width) || element.offsetWidth || rect.width);
  const naturalHeight = Math.max(1,parseFloat(style.height) || element.offsetHeight || rect.height);
  Object.assign(copy.style,{
    position:'absolute',left:'0',top:'0',margin:'0',width:naturalWidth+'px',height:naturalHeight+'px',
    boxSizing:style.boxSizing,display:style.display,alignItems:style.alignItems,
    justifyContent:style.justifyContent,gap:style.gap,overflow:style.overflow,
    background:style.background,backgroundColor:style.backgroundColor,backdropFilter:style.backdropFilter,webkitBackdropFilter:style.webkitBackdropFilter,color:style.color,
    border:style.border,borderRadius:style.borderRadius,boxShadow:style.boxShadow,
    padding:style.padding,font:style.font,lineHeight:style.lineHeight,
    opacity:'1',filter:style.filter,transformOrigin:'top left',
    transform:'scale('+rect.width/naturalWidth+','+rect.height/naturalHeight+')',pointerEvents:'none'
  });
  const originals = element.querySelectorAll('*');
  const copies = copy.querySelectorAll('*');
  originals.forEach(function(child,index){
    const childStyle = getComputedStyle(child);
    copies[index].style.opacity = childStyle.opacity;
    copies[index].style.filter = childStyle.filter;
    copies[index].style.transform = childStyle.transform;
  });
  copy.querySelectorAll('.current').forEach(function(node){
    node.style.setProperty('visibility','hidden','important');
  });
  holder.appendChild(copy);
  layer.appendChild(holder);
  return holder;
}
const breadcrumbTypingAnimations = new WeakMap();
function finishBreadcrumbTyping(current){
  const state = current && breadcrumbTypingAnimations.get(current);
  if(!state) return;
  if(state.timer) clearTimeout(state.timer);
  (state.animations || []).forEach(function(animation){ animation.cancel(); });
  if(state.layer) state.layer.remove();
  current.textContent = state.text;
  if(state.visibility) current.style.setProperty('visibility',state.visibility,state.visibilityPriority);
  else current.style.removeProperty('visibility');
  breadcrumbTypingAnimations.delete(current);
}
function animateBreadcrumbCurrentArrival(nav,delay = 0,blurArrival = false){
  const current = nav?.querySelector('.breadcrumb .current');
  if(!current) return;
  finishBreadcrumbTyping(current);
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const text = current.textContent;
  const letters = Array.from(text);
  if(!letters.length) return;
  const state = {
    text,animations:[],layer:null,timer:null,
    visibility:current.style.getPropertyValue('visibility'),
    visibilityPriority:current.style.getPropertyPriority('visibility')
  };
  breadcrumbTypingAnimations.set(current,state);
  if(delay > 0) current.style.setProperty('visibility','hidden','important');
  const startTyping = function(){
    if(breadcrumbTypingAnimations.get(current) !== state) return;
    state.timer = null;
    if(blurArrival){
      if(state.visibility) current.style.setProperty('visibility',state.visibility,state.visibilityPriority);
      else current.style.removeProperty('visibility');
      const animation = current.animate([
        {filter:'blur(1px)'},
        {filter:'blur(0px)'}
      ],{duration:600,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
      state.animations.push(animation);
      animation.onfinish = function(){
        if(breadcrumbTypingAnimations.get(current) === state) finishBreadcrumbTyping(current);
      };
      return;
    }
    current.textContent = '';
    const word = document.createElement('span');
    word.className = 'fl-crumb-word';
    current.appendChild(word);
    if(state.visibility) current.style.setProperty('visibility',state.visibility,state.visibilityPriority);
    else current.style.removeProperty('visibility');
    const animations = state.animations;
    let pendingAnimations = letters.length;
    letters.forEach(function(letter,index){
      const span = document.createElement('span');
      span.className = 'fl-crumb-char';
      span.textContent = letter;
      span.style.opacity = '0';
      word.appendChild(span);
      const animation = span.animate([
        {opacity:0,filter:'blur(1px)',transform:'translateY(5px) scale(.98)'},
        {opacity:1,filter:'blur(0px)',transform:'translateY(0) scale(1)'}
      ],{duration:150,delay:index*180,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
      animations.push(animation);
      animation.onfinish = function(){
        if(breadcrumbTypingAnimations.get(current) !== state) return;
        pendingAnimations -= 1;
        if(pendingAnimations === 0) finishBreadcrumbTyping(current);
      };
    });
  };
  if(delay > 0) state.timer = setTimeout(startTyping,delay);
  else startTyping();
}
let activeBreadcrumbCurrentCleanup = null;
function makeBreadcrumbScatterParticle(layer,letter,rect,opacity,index,color,font){
    if(opacity < .025 || rect.width < 1) return;
    const glyph = document.createElement('span');
    glyph.textContent = letter;
    Object.assign(glyph.style,{
      position:'absolute',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',
      color,whiteSpace:'pre',font,opacity:String(opacity),pointerEvents:'none'
    });
    layer.appendChild(glyph);
    glyph.animate([
      {opacity,transform:'translate(0px,0px) scale(1)',filter:'blur(0px)'},
      {opacity:opacity*.7,transform:'translate('+((index%3-1)*5)+'px,9px) scale(.8)',offset:.35},
      {opacity:0,transform:'translate('+((index%3-1)*15)+'px,'+(24+index%4*5)+'px) scale(.22)',filter:'blur(2px)'}
    ],{duration:480,delay:index%4*18,easing:'cubic-bezier(.18,.7,.35,1)',fill:'both'});
    for(let dot=0;dot<2;dot++){
      const spark = document.createElement('i');
      Object.assign(spark.style,{
        position:'absolute',left:(rect.left+rect.width*(dot ? .72 : .28))+'px',
        top:(rect.top+rect.height*.55)+'px',width:'2px',height:'2px',borderRadius:'50%',
        backgroundColor:color,opacity:String(opacity*.8)
      });
      layer.appendChild(spark);
      spark.animate([
        {opacity:opacity*.8,transform:'translate(0px,0px) scale(1)'},
        {opacity:0,transform:'translate('+((dot ? 1 : -1)*(7+index%3*3))+'px,'+(17+index%4*5)+'px) scale(.3)'}
      ],{duration:420,delay:35+index%4*18,easing:'ease-out',fill:'both'});
    }
}
function scatterBreadcrumbText(current,scatterWhenHidden=false){
  if(!current) return;
  const breadcrumb = current.closest('.breadcrumb');
  if(breadcrumb && !flIsBreadcrumbVisible(breadcrumb) && !scatterWhenHidden){
    finishBreadcrumbTyping(current);
    return;
  }
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.setAttribute('aria-hidden','true');
  Object.assign(layer.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:'1108'});
  const currentStyle = getComputedStyle(current);
  const color = currentStyle.color;
  const font = currentStyle.font;
  const node = current.firstChild;
  if(node?.nodeType === Node.TEXT_NODE){
    let offset = 0;
    Array.from(node.textContent).forEach(function(letter,index){
      const range = document.createRange();
      range.setStart(node,offset);
      offset += letter.length;
      range.setEnd(node,offset);
      makeBreadcrumbScatterParticle(layer,letter,range.getBoundingClientRect(),1,index,color,font);
    });
  }
  if(layer.children.length){
    document.body.appendChild(layer);
    setTimeout(function(){ layer.remove(); },570);
  }
  finishBreadcrumbTyping(current);
}
// 进入子页面时，若旧的当前项会保留在新面包屑中，把它冻结在原位置，
// 用作“黑色当前项 → 蓝色链接”的过渡，而不是播放散落粒子。
function scatterBreadcrumbCurrent(nav,scatterWhenHidden=false){
  scatterBreadcrumbText(nav?.querySelector('.breadcrumb .current'),scatterWhenHidden);
}
function scatterBreadcrumbPrefix(nav,scatterWhenHidden=false){
  const breadcrumb = nav?.querySelector('.breadcrumb');
  if(!breadcrumb) return;
  breadcrumb.querySelectorAll(':scope > a, :scope > .sep').forEach(function(part){
    scatterBreadcrumbText(part,scatterWhenHidden);
  });
}
function flIsBreadcrumbVisible(navOrBreadcrumb){
  const breadcrumb = navOrBreadcrumb?.matches?.('.breadcrumb') ? navOrBreadcrumb : navOrBreadcrumb?.querySelector('.breadcrumb');
  if(!breadcrumb) return false;
  const style = getComputedStyle(breadcrumb);
  const rect = breadcrumb.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .015 && rect.width > 0 && rect.height > 0;
}
function takeBreadcrumbCurrentFrame(current){
  if(!current || window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const breadcrumb = current.closest('.breadcrumb');
  if(breadcrumb && !flIsBreadcrumbVisible(breadcrumb)) return null;
  const layer = document.createElement('div');
  layer.dataset.flBreadcrumbTransitionFrame = 'true';
  layer.setAttribute('aria-hidden','true');
  Object.assign(layer.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:'1108'});
  const source = freezeBreadcrumbPart(current,layer);
  if(!source) return null;
  document.body.appendChild(layer);
  return {layer,source};
}
function takeBreadcrumbLinkTextFrame(link,allowWhenHidden=false){
  if(!link || window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  const breadcrumb = link.closest('.breadcrumb');
  if(!allowWhenHidden && breadcrumb && !flIsBreadcrumbVisible(breadcrumb)) return null;
  const revealWithTopbar = !!(breadcrumb && !flIsBreadcrumbVisible(breadcrumb));
  const range = document.createRange();
  range.selectNodeContents(link);
  const rect = range.getBoundingClientRect();
  if(rect.width < 1 || rect.height < 1) return null;

  const style = getComputedStyle(link);
  const layer = document.createElement('div');
  layer.dataset.flBreadcrumbTransitionFrame = 'true';
  layer.setAttribute('aria-hidden','true');
  Object.assign(layer.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:'1108'});
  const source = document.createElement('span');
  source.textContent = link.textContent;
  Object.assign(source.style,{
    position:'absolute',left:rect.left+'px',top:rect.top+'px',width:rect.width+'px',height:rect.height+'px',
    display:'inline-flex',alignItems:'center',justifyContent:'flex-start',boxSizing:'border-box',
    margin:'0',padding:'0',fontFamily:style.fontFamily,fontSize:style.fontSize,fontWeight:style.fontWeight,
    fontStyle:style.fontStyle,lineHeight:style.lineHeight,letterSpacing:style.letterSpacing,
    color:style.color,opacity:style.opacity,whiteSpace:'pre',pointerEvents:'none',transformOrigin:'top left'
  });
  layer.appendChild(source);
  document.body.appendChild(layer);
  return {layer,source,revealWithTopbar};
}
function playRetainedBreadcrumbCurrentTransition(frame,retainedText=''){
  const target = document.querySelector('body > .sticky-nav.chest-float-nav .breadcrumb');
  const targetLink = Array.from(target?.querySelectorAll(':scope > a') || []).find(function(link){
    return link.textContent.trim() === retainedText;
  });
  if(!frame?.source || !targetLink){ frame?.layer.remove(); return; }

  const source = frame.source;
  const sourceText = source.firstElementChild;
  const destinationStyle = getComputedStyle(targetLink);
  const sourceStyle = getComputedStyle(sourceText || source);
  const sourceRect = source.getBoundingClientRect();
  const destinationRange = document.createRange();
  destinationRange.selectNodeContents(targetLink);
  const destinationTextRect = destinationRange.getBoundingClientRect();
  const destinationRect = destinationTextRect.width && destinationTextRect.height
    ? destinationTextRect
    : targetLink.getBoundingClientRect();
  const deltaX = destinationRect.left - sourceRect.left;
  const deltaY = destinationRect.top - sourceRect.top;
  const scaleX = destinationRect.width / Math.max(1,sourceRect.width);
  const scaleY = destinationRect.height / Math.max(1,sourceRect.height);
  const originalVisibility = targetLink.style.getPropertyValue('visibility');
  const originalVisibilityPriority = targetLink.style.getPropertyPriority('visibility');
  const animations = [];
  let finishTimer = null;
  let done = false;

  targetLink.style.setProperty('visibility','hidden','important');
  const movement = source.animate([
    {transform:'translate3d(0px,0px,0) scale(1,1)',opacity:1,filter:'blur(0px)'},
    {transform:'translate3d('+deltaX+'px,'+deltaY+'px,0) scale('+scaleX+','+scaleY+')',opacity:1,filter:'blur(0px)'}
  ],{duration:460,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
  animations.push(movement);
  if(sourceText){
    animations.push(sourceText.animate([
      {color:sourceStyle.color},
      {color:destinationStyle.color}
    ],{duration:460,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'}));
  }
  const cleanup = function(){
    if(done) return;
    done = true;
    if(finishTimer) clearTimeout(finishTimer);
    if(originalVisibility) targetLink.style.setProperty('visibility',originalVisibility,originalVisibilityPriority);
    else targetLink.style.removeProperty('visibility');
    animations.forEach(function(animation){ animation.cancel(); });
    frame.layer.remove();
    if(activeBreadcrumbCurrentCleanup === cleanup) activeBreadcrumbCurrentCleanup = null;
  };
  activeBreadcrumbCurrentCleanup = cleanup;
  movement.onfinish = cleanup;
  finishTimer = setTimeout(cleanup,520);
}
// 面包屑名称优先读取当前 JS 页面标题，访问轨迹决定显示的路径顺序。
function playBreadcrumbAncestorReturnTransition(frame){
  const target = document.querySelector('body > .sticky-nav.chest-float-nav .breadcrumb');
  const targetCurrent = target?.querySelector(':scope > .current');
  if(!frame?.source || !targetCurrent){ frame?.layer.remove(); return false; }

  const source = frame.source;
  const sourceText = source.firstElementChild || source;
  const destinationStyle = getComputedStyle(targetCurrent);
  const sourceStyle = getComputedStyle(sourceText || source);
  const sourceRect = source.getBoundingClientRect();
  const destinationRange = document.createRange();
  destinationRange.selectNodeContents(targetCurrent);
  const destinationTextRect = destinationRange.getBoundingClientRect();
  const destinationRect = destinationTextRect.width && destinationTextRect.height
    ? destinationTextRect
    : targetCurrent.getBoundingClientRect();
  const deltaX = destinationRect.left - sourceRect.left;
  const deltaY = destinationRect.top - sourceRect.top;
  const scaleX = destinationRect.width / Math.max(1,sourceRect.width);
  const scaleY = destinationRect.height / Math.max(1,sourceRect.height);
  const originalVisibility = targetCurrent.style.getPropertyValue('visibility');
  const originalVisibilityPriority = targetCurrent.style.getPropertyPriority('visibility');
  const animations = [];
  let finishTimer = null;
  let done = false;

  targetCurrent.style.setProperty('visibility','hidden','important');
  const movement = source.animate([
    {transform:'translate3d(0px,0px,0) scale(1,1)',opacity:1,filter:'blur(0px)'},
    {transform:'translate3d('+deltaX+'px,'+deltaY+'px,0) scale('+scaleX+','+scaleY+')',opacity:1,filter:'blur(0px)'}
  ],{duration:460,easing:'cubic-bezier(.2,.75,.25,1)',fill:'both'});
  animations.push(movement);
  if(sourceText){
    animations.push(sourceText.animate([
      {color:sourceStyle.color},
      {color:destinationStyle.color}
    ],{duration:460,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'}));
  }
  const cleanup = function(){
    if(done) return;
    done = true;
    if(finishTimer) clearTimeout(finishTimer);
    if(originalVisibility) targetCurrent.style.setProperty('visibility',originalVisibility,originalVisibilityPriority);
    else targetCurrent.style.removeProperty('visibility');
    animations.forEach(function(animation){ animation.cancel(); });
    frame.layer.remove();
    if(activeBreadcrumbCurrentCleanup === cleanup) activeBreadcrumbCurrentCleanup = null;
  };
  activeBreadcrumbCurrentCleanup = cleanup;
  movement.onfinish = cleanup;
  finishTimer = setTimeout(cleanup,520);
  return true;
}
const FL_DEFAULT_DOCUMENT_TITLE = document.title.trim() || '枫铃2026 - 工具箱';
const FL_ROUTE_TITLE_FALLBACKS = Object.freeze({"home":"首页","introPage":"说明","introManual":"说明书","introHot":"今日热搜","introSteam":"Steam游戏特惠","introHistory":"历史上的今天","introFestival":"节日专属页面","introOldVersions":"老旧版本","introQrManual":"二维码生成说明书","introQqManual":"QQ快捷工具说明书","introQqGroupManual":"QQ群快捷工具说明书","introAesManual":"AES加密说明书","introOtherManual":"其他说明书","achievementPage":"成就徽章","acrosticPage":"藏头诗生成","aes":"AES加密","agePage":"年龄计算器","almanacPage":"今日宜忌","animalPersonalityPage":"动物性格测试","anniversaryPage":"纪念日倒计时","astrodicePage":"占星骰子","audioConvert":"音频转换","avatarMaker":"国庆头像生成","backpack":"🎒 背包","barcode":"条形码生成","base64":"Base64编解码","bloodMatchPage":"血型配对","bmiPage":"体重计算器","brainTestPage":"左右脑测试","breakoutPage":"打砖块","caesarPage":"凯撒密码","caloriePage":"卡路里计算器","capsulePage":"扭蛋机","cardWheelPage":"卡牌转盘","charDivPage":"测字","chestHome":"百宝箱","cleanShopPage":"清洁商店","coinPage":"抛硬币","coinWheelPage":"金币转盘","collectionPage":"全部展柜","collectionRecordPage":"获得记录","crystalballPage":"水晶球占卜","currency":"汇率换算","dailyTaskPage":"每日任务","daycalc":"天数计算","dicePage":"掷骰子","dnsquery":"查询服务器IP","domaincheck":"域名注册查询","dreamPage":"周公解梦","eatPage":"今天吃什么","encqrcode":"加密二维码","encscan":"扫码导入","faceScorePage":"颜值打分器","favoritesPage":"收藏夹","jsResourcesPage":"JS资源下载","foodShopPage":"食物商店","fortunePage":"抽签","fortuneTodayPage":"今日运势","gachaPage":"抽卡模拟器","game2048Page":"2048","game24Page":"24点","gomokuPage":"五子棋","groupPage":"随机分组","guessPage":"猜数字","hexconvert":"进制转换","idiomChainPage":"成语接龙","imghost":"图床上传","iplookup":"IP 查询","iqPage":"IQ智商测试","itemWheelPage":"道具转盘","jinriPage":"今日人品","jokesPage":"冷笑话大全","jsonfmt":"JSON格式化","kipperPage":"基博卡","lenormandPage":"雷诺曼卡牌","linkGamePage":"连连看","magic8Page":"魔法8球","mailboxPage":"校长信箱","match3Page":"消消乐","mbtiPage":"MBTI人格测试","memoryPage":"记忆翻牌","mentalAgePage":"心理年龄测试","mindReadingPage":"读心术","minesweeperPage":"扫雷","moralityPage":"人品计算器","morsePage":"摩斯密码","nameMatchPage":"姓名配对","numerologyPage":"数字命理学","numgen":"数字文本生成","oilprice":"油价查询","oraclePage":"天使神谕卡","ovulationPage":"排卵期计算器","passwordPage":"密码生成器","pastLifePage":"前世身份","pendulumPage":"灵摆占卜","petDiaryPage":"宠物日记","petDressPage":"宠物装扮","petExplorePage":"宠物探险","petPlayPage":"出去玩","petSchoolPage":"出门上学","petSkillPage":"宠物技能","petWorkPage":"出门打工","pianoPage":"别踩白块","pinballPage":"打弹珠","pinballShopPage":"弹珠商店","pinballWheelPage":"弹珠转盘","pwcheck":"密码强度检测","qq":"QQ快捷工具","qqgroup":"QQ群快捷工具","qrcode":"二维码生成","random":"随机数生成","refreshrate":"刷新率测试","relativePage":"亲戚称呼计算器","reverseTextPage":"文字反转","riddlesPage":"脑筋急转弯","rollCallPage":"随机点名","rpsPage":"石头剪刀布","runePage":"符文占卜","scanner":"扫码识别","sitecheck":"网站状态检测","slotPage":"老虎机","spotDiffPage":"找不同","statusPage":"个人状态","superItemShopPage":"超级道具商店","tarotPage":"塔罗牌占卜","tealeafPage":"茶叶占卜","tetrisPage":"俄罗斯方块","textutil":"文本处理","timestamp":"时间戳转换","toyShopPage":"猫咪用品商店","translate":"在线翻译","truthDarePage":"真心话大冒险","tttPage":"井字棋","typingPage":"打字通","unitConverter":"单位换算器","usageStatsPage":"统计信息","uuidgen":"UUID生成","videoaudio":"视频提取音频","videoparse":"短视频去水印","warehousePage":"宠物仓库","weather":"天气查询","whackPage":"打地鼠","wheelPage":"幸运转盘","yesnoPage":"是或否决策器","zodiacMatchPage":"生肖配对","zodiacPage":"星座运势"});
window.flRouteDefinitions = FL_ROUTE_TITLE_FALLBACKS;

const flRouteRegistry = new Map(
  Object.entries(FL_ROUTE_TITLE_FALLBACKS).map(function(entry){
    const routeId = entry[0];
    const title = entry[1];
    return [routeId,{id:routeId,title,parents:[],page:null}];
  })
);
window.flRouteRegistry = flRouteRegistry;
let flRouteRestoringTarget = null;

function flRouteGetBreadcrumb(page){
  if(!page) return null;
  const localBreadcrumb = page.querySelector(':scope > .sticky-nav > .breadcrumb') || page.querySelector('.breadcrumb');
  if(localBreadcrumb) return localBreadcrumb;
  if(!page.id) return null;
  const liftedNav = document.querySelector('body > .sticky-nav.chest-float-nav');
  return liftedNav?.dataset.flOwnerPageId === page.id ? liftedNav.querySelector('.breadcrumb') : null;
}
function flRouteReadPageTitle(page){
  if(!page) return '';
  const headings = Array.from(page.querySelectorAll('h1,h2,h3')).filter(function(heading){
    const ownerPage = heading.closest('.tool-page');
    return !ownerPage || ownerPage === page;
  });
  for(const heading of headings){
    let title = heading.getAttribute('data-breadcrumb-title') || heading.textContent || '';
    title = title.replace(/\s+/g,' ').trim().replace(/^[^\p{L}\p{N}]+/u,'').trim();
    if(title) return title;
  }
  return '';
}
function flRouteEnsure(routeId,page){
  const fallbackTitle = FL_ROUTE_TITLE_FALLBACKS[routeId] || routeId;
  const route = flRouteRegistry.get(routeId) || {id:routeId,title:routeId,parents:[],page:null};
  route.title = routeId === 'home' ? '首页' : routeId.startsWith('intro') ? fallbackTitle : flRouteReadPageTitle(page) || fallbackTitle;
  route.parents = [];
  route.page = page || route.page;
  flRouteRegistry.set(routeId,route);
  return route;
}

let flRouteTrail = [{id:'home',title:'首页'}];
window.flRouteTrail = flRouteTrail;
function flRouteSetTrail(nextTrail){
  flRouteTrail = nextTrail;
  window.flRouteTrail = flRouteTrail;
}
let flBreadcrumbConfirm = null;
function flRemoveBreadcrumbConfirm(state){
  if(state.removeTimer) clearTimeout(state.removeTimer);
  state.closeAnimation?.cancel();
  state.closeAnimation = null;
  state.controller.abort();
  state.bubble.remove();
  if(flBreadcrumbConfirm === state) flBreadcrumbConfirm = null;
  if(state.resumeBreadcrumbAutoHide && state.pageName === currentPageName) flShowBreadcrumbTemporarily();
}
function flDismissBreadcrumbConfirm(restoreFocus = false){
  const state = flBreadcrumbConfirm;
  if(!state || state.closing) return;
  state.closing = true;
  const bubble = state.bubble;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion:reduce)').matches;
  const fromStyle = getComputedStyle(bubble);
  const fromTransform = fromStyle.transform === 'none' ? 'translate3d(0px,0px,0) scale(1,1)' : fromStyle.transform;
  const fromOpacity = fromStyle.opacity;
  const width = bubble.offsetWidth;
  const height = bubble.offsetHeight;
  const left = Number.parseFloat(bubble.style.left);
  const top = Number.parseFloat(bubble.style.top);
  const baseLeft = Number.isFinite(left) ? left : bubble.getBoundingClientRect().left;
  const baseTop = Number.isFinite(top) ? top : bubble.getBoundingClientRect().top;
  let targetTransform = 'translate3d(0px,0px,0) scale(.82,.82)';
  const anchor = state.anchorRect;
  if(anchor && width > 0 && height > 0){
    const dx = anchor.left + anchor.width/2 - (baseLeft + width/2);
    const dy = anchor.top + anchor.height/2 - (baseTop + height/2);
    const scaleX = Math.max(.14,Math.min(.55,anchor.width/width));
    const scaleY = Math.max(.14,Math.min(.45,anchor.height/height));
    targetTransform = 'translate3d('+dx+'px,'+dy+'px,0) scale('+scaleX+','+scaleY+')';
    bubble.style.setProperty('--fl-breadcrumb-enter-x',dx+'px');
    bubble.style.setProperty('--fl-breadcrumb-enter-y',dy+'px');
    bubble.style.setProperty('--fl-breadcrumb-enter-scale-x',String(scaleX));
    bubble.style.setProperty('--fl-breadcrumb-enter-scale-y',String(scaleY));
  }else{
    bubble.style.setProperty('--fl-breadcrumb-enter-x','0px');
    bubble.style.setProperty('--fl-breadcrumb-enter-y','0px');
    bubble.style.setProperty('--fl-breadcrumb-enter-scale-x','.82');
    bubble.style.setProperty('--fl-breadcrumb-enter-scale-y','.82');
  }
  bubble.setAttribute('aria-hidden','true');
  if(restoreFocus && state.link.isConnected) state.link.focus({preventScroll:true});
  if(reducedMotion){ flRemoveBreadcrumbConfirm(state); return; }
  if(typeof bubble.animate === 'function'){
    bubble.classList.add('is-closing');
    bubble.classList.remove('is-visible','is-initializing');
    const animation = bubble.animate([
      {transform:fromTransform,opacity:fromOpacity},
      {transform:targetTransform,opacity:0}
    ],{duration:360,easing:'cubic-bezier(.18,.9,.22,1)',fill:'forwards'});
    state.closeAnimation = animation;
    animation.onfinish = function(){ flRemoveBreadcrumbConfirm(state); };
    state.removeTimer = setTimeout(function(){ flRemoveBreadcrumbConfirm(state); },420);
  }else{
    bubble.classList.add('is-initializing');
    bubble.classList.remove('is-visible');
    state.removeTimer = setTimeout(function(){ flRemoveBreadcrumbConfirm(state); },420);
  }
}
window.flDismissBreadcrumbConfirm = flDismissBreadcrumbConfirm;
function flPositionBreadcrumbConfirm(state,keepPosition = false){
  const {bubble,link} = state;
  if(state.closing) return;
  if(!link.isConnected){ flDismissBreadcrumbConfirm(); return; }
  const viewport = window.visualViewport;
  const viewLeft = viewport?.offsetLeft || 0;
  const viewTop = viewport?.offsetTop || 0;
  const viewWidth = viewport?.width || document.documentElement.clientWidth;
  const viewHeight = viewport?.height || window.innerHeight;
  const anchor = link.getBoundingClientRect();
  state.anchorRect = {left:anchor.left,top:anchor.top,width:anchor.width,height:anchor.height};
  const boxWidth = bubble.offsetWidth;
  const boxHeight = bubble.offsetHeight;
  const minLeft = viewLeft + 12;
  const maxLeft = Math.max(minLeft,viewLeft + viewWidth - boxWidth - 12);
  const anchorX = anchor.left + anchor.width/2;
  let left = keepPosition ? parseFloat(bubble.style.left) : NaN;
  if(!Number.isFinite(left)) left = anchorX - boxWidth/2;
  if(keepPosition){
    if(anchorX - left < 16) left = anchorX - 16;
    else if(anchorX - left > boxWidth - 16) left = anchorX - boxWidth + 16;
  }
  left = Math.min(Math.max(left,minLeft),maxLeft);
  const sameRow = keepPosition && Number.isFinite(state.anchorTop) && Math.abs(anchor.top - state.anchorTop) < 12;
  if(!sameRow){
    const below = anchor.bottom + 12;
    const above = anchor.top - boxHeight - 12;
    const placeAbove = below + boxHeight > viewTop + viewHeight - 12 && above >= viewTop + 12;
    const top = placeAbove ? above : Math.min(below,Math.max(viewTop + 12,viewTop + viewHeight - boxHeight - 12));
    bubble.dataset.placement = placeAbove ? 'above' : 'below';
    bubble.style.top = top + 'px';
  }
  state.anchorTop = anchor.top;
  bubble.style.left = left + 'px';
  const arrowX = Math.max(16,Math.min(boxWidth - 16,anchorX - left));
  const bubbleTop = parseFloat(bubble.style.top) || 0;
  bubble.style.setProperty('--fl-breadcrumb-arrow-x',arrowX + 'px');
  bubble.style.setProperty('--fl-breadcrumb-enter-x',(anchorX - left - boxWidth/2) + 'px');
  bubble.style.setProperty('--fl-breadcrumb-enter-y',(anchor.top + anchor.height/2 - bubbleTop - boxHeight/2) + 'px');
  bubble.style.setProperty('--fl-breadcrumb-enter-scale-x',Math.max(.14,Math.min(.55,anchor.width/boxWidth)));
  bubble.style.setProperty('--fl-breadcrumb-enter-scale-y',Math.max(.14,Math.min(.45,anchor.height/boxHeight)));
}
function flShowBreadcrumbConfirm(link,routeId,title){
  flKeepBreadcrumbVisibleForConfirm();
  // 切换面包屑时复用气泡，保持展开状态，只更新目标和箭头位置。
  const existing = flBreadcrumbConfirm;
  if(existing){
    if(existing.removeTimer){ clearTimeout(existing.removeTimer); existing.removeTimer = null; }
    existing.closeAnimation?.cancel();
    existing.closeAnimation = null;
    existing.bubble.classList.remove('is-closing');
    existing.bubble.style.removeProperty('display');
    existing.bubble.style.removeProperty('visibility');
    existing.closing = false;
    existing.pageName = currentPageName;
    existing.resumeBreadcrumbAutoHide = true;
    existing.bubble.classList.remove('is-initializing');
    existing.link = link;
    existing.routeId = routeId;
    existing.title.textContent = '前往「' + title + '」？';
    existing.bubble.removeAttribute('aria-hidden');
    existing.bubble.classList.add('is-visible');
    flPositionBreadcrumbConfirm(existing,true);
    existing.cancel.focus({preventScroll:true});
    return;
  }
  const bubble = document.createElement('div');
  bubble.className = 'fl-breadcrumb-confirm is-initializing';
  bubble.setAttribute('role','dialog');
  bubble.setAttribute('aria-labelledby','flBreadcrumbConfirmTitle');
  bubble.innerHTML = '<div class="fl-breadcrumb-confirm-title" id="flBreadcrumbConfirmTitle"></div><div class="fl-breadcrumb-confirm-hint">确认后切换页面</div><div class="fl-breadcrumb-confirm-actions"><button class="fl-breadcrumb-confirm-cancel" type="button">取消</button><button class="fl-breadcrumb-confirm-go" type="button">确认</button></div>';
  const heading = bubble.querySelector('.fl-breadcrumb-confirm-title');
  heading.textContent = '前往「' + title + '」？';
  const cancel = bubble.querySelector('.fl-breadcrumb-confirm-cancel');
  const confirm = bubble.querySelector('.fl-breadcrumb-confirm-go');
  const controller = new AbortController();
  const state = {bubble,link,routeId,title:heading,cancel,controller,closing:false,removeTimer:null,closeAnimation:null,anchorRect:null,anchorTop:NaN,pageName:currentPageName,resumeBreadcrumbAutoHide:true};
  flBreadcrumbConfirm = state;
  document.body.appendChild(bubble);
  flPositionBreadcrumbConfirm(state);
  requestAnimationFrame(function(){
    if(flBreadcrumbConfirm !== state || state.closing) return;
    bubble.classList.add('is-visible');
    requestAnimationFrame(function(){
      if(flBreadcrumbConfirm === state) bubble.classList.remove('is-initializing');
    });
  });
  cancel.addEventListener('click',function(){ flDismissBreadcrumbConfirm(true); });
  confirm.addEventListener('click',function(){
    if(state.closing) return;
    const targetRoute = state.routeId;
    state.resumeBreadcrumbAutoHide = false;
    flDismissBreadcrumbConfirm();
    flNavigateRoute(targetRoute,{routeAction:'breadcrumb'});
  });
  const blockBubbleScroll = function(event){ event.preventDefault(); };
  bubble.addEventListener('touchmove',blockBubbleScroll,{passive:false,signal:controller.signal});
  bubble.addEventListener('wheel',blockBubbleScroll,{passive:false,signal:controller.signal});
  bubble.addEventListener('transitionend',function(event){
    if(event.target === bubble && event.propertyName === 'transform' && state.closing) flRemoveBreadcrumbConfirm(state);
  },{signal:controller.signal});
  document.addEventListener('pointerdown',function(event){
    if(bubble.contains(event.target) || event.target.closest?.('.breadcrumb a')) return;
    flDismissBreadcrumbConfirm();
  },{capture:true,signal:controller.signal});
  document.addEventListener('keydown',function(event){
    if(event.key === 'Escape'){ event.preventDefault(); flDismissBreadcrumbConfirm(true); }
  },{signal:controller.signal});
  window.addEventListener('resize',function(){ flPositionBreadcrumbConfirm(state); },{signal:controller.signal});
  window.addEventListener('scroll',function(){ flDismissBreadcrumbConfirm(); },{capture:true,passive:true,signal:controller.signal});
  window.visualViewport?.addEventListener('resize',function(){ flPositionBreadcrumbConfirm(state); },{signal:controller.signal});
  cancel.focus({preventScroll:true});
}
function flRouteUpdateTrail(routeId,page){
  const route = flRouteEnsure(routeId,page);
  if(routeId === 'home'){
    flRouteSetTrail([{id:'home',title:'首页'}]);
    return flRouteTrail;
  }
  const nextItem = {id:route.id,title:route.title};
  const existingIndex = flRouteTrail.findIndex(function(item){ return item.id === route.id; });
  let nextTrail;
  if(existingIndex >= 0){
    nextTrail = flRouteTrail.slice(0,existingIndex + 1);
    nextTrail[existingIndex] = nextItem;
  }else{
    nextTrail = flRouteTrail.length && flRouteTrail[0].id === 'home'
      ? flRouteTrail.slice()
      : [{id:'home',title:'首页'}];
    nextTrail.push(nextItem);
  }
  flRouteSetTrail(nextTrail);
  return flRouteTrail;
}
function flRouteRenderBreadcrumb(routeId,page){
  if(routeId === 'home'){
    document.title = FL_DEFAULT_DOCUMENT_TITLE;
    return flRouteGetBreadcrumb(page);
  }
  const breadcrumb = flRouteGetBreadcrumb(page);
  if(!breadcrumb) return null;
  const trail = flRouteUpdateTrail(routeId,page);
  const fragment = document.createDocumentFragment();
  trail.slice(0,-1).forEach(function(item,index){
    const link = document.createElement('a');
    link.href = '#/' + trail.slice(0,index + 1).map(function(trailItem){ return encodeURIComponent(trailItem.id); }).join('/');
    link.dataset.route = item.id;
    link.textContent = item.title;
    link.addEventListener('click',function(event){
      event.preventDefault();
      if(window.flBreadcrumbGuardEnabled === false) flNavigateRoute(item.id,{routeAction:'breadcrumb'});
      else flShowBreadcrumbConfirm(link,item.id,item.title);
    });
    fragment.appendChild(link);
    const separator = document.createElement('span');
    separator.className = 'sep';
    separator.textContent = '/';
    fragment.appendChild(separator);
  });
  const currentItem = trail[trail.length - 1];
  document.title = currentItem.title || FL_DEFAULT_DOCUMENT_TITLE;
  const current = document.createElement('span');
  current.className = 'current';
  current.setAttribute('aria-current','page');
  current.textContent = currentItem.title;
  fragment.appendChild(current);
  breadcrumb.replaceChildren(fragment);
  breadcrumb.dataset.route = routeId;
  breadcrumb.dataset.trail = trail.map(function(item){ return item.id; }).join('/');
  return breadcrumb;
}
function flRouteReadTrailLocation(){
  const rawSegments = location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  if(!rawSegments.length) return [];
  const routeIds = rawSegments.map(function(segment){
    try{return decodeURIComponent(segment);}catch(error){return '';}
  }).filter(Boolean);
  if(routeIds[0] !== 'home') routeIds.unshift('home');
  return routeIds.filter(function(routeId){ return routeId !== 'morePage'; });
}
function flRouteRestoreTrailFromLocation(){
  const routeIds = flRouteReadTrailLocation();
  if(!routeIds.length) return;
  const trail = routeIds.map(function(routeId){
    const registered = flRouteRegistry.get(routeId);
    return {
      id:routeId,
      title:routeId === 'home'
        ? '首页'
        : registered?.title || FL_ROUTE_TITLE_FALLBACKS[routeId] || routeId
    };
  });
  flRouteSetTrail(trail);
}
function flRouteReadLocation(){
  const routeIds = flRouteReadTrailLocation();
  return routeIds[routeIds.length - 1] || '';
}
function flRouteCommit(routeId,routeOptions){
  const mode = routeOptions?.history || 'push';
  if(mode === 'silent' || mode === 'none') return;
  const routeIds = flRouteTrail.map(function(item){ return item.id; });
  if(!routeIds.length || routeIds[routeIds.length - 1] !== routeId) routeIds.push(routeId);
  const hash = '#/' + routeIds.map(encodeURIComponent).join('/');
  const url = location.pathname + location.search + hash;
  const state = {flRoute:routeId,flRouteTrail:routeIds};
  try{
    if(mode === 'replace') history.replaceState(state,'',url);
    else if(location.hash !== hash) history.pushState(state,'',url);
    else if(!history.state?.flRoute) history.replaceState(state,'',url);
  }catch(error){
    if(location.hash !== hash) location.hash = hash;
  }
}
function flNavigateRoute(routeId,routeOptions){
  const target = routeId || 'home';
  if(target === 'morePage') return window.goHome ? window.goHome({history:'replace'}) : goHome({history:'replace'});
  if(target === 'home') return window.goHome ? window.goHome(routeOptions) : goHome(routeOptions);
  return typeof window.openPage === 'function'
    ? window.openPage(target,routeOptions)
    : openPage(target,routeOptions);
}
window.flNavigateRoute = flNavigateRoute;

function openPage(name,routeOptions){
  if(name === 'morePage') return goHome({history:'replace'});
  flDismissBreadcrumbConfirm();
  if(FL_CHEST_LAZY_ROUTES.has(name) && !window.__flChestScriptsLoaded){
    ensureFlChestScript().then(function(){ openPage(name,routeOptions); }).catch(function(error){ reportFlChestLoadError(error, name); });
    return;
  }
  flClearBreadcrumbTransitionHiddenTargets();
  if(activeBreadcrumbCurrentCleanup) activeBreadcrumbCurrentCleanup();
  flClearBreadcrumbTransitionFrames();
  finishHeaderButtonMorph();
  finishHomeFavoriteAbsorb();
  finishHomeBrandTransition();
  // 以当前可见状态判断是否从首页进入，避免 currentPageName 与实际显示页短暂不同步时漏播。
  const isEnteringFromHome = currentPageName === 'home';
  const homeTitleBackSource = isEnteringFromHome ? captureHomeTitleBackSource() : null;
  window.__flDelayHeaderFavStarEntrance = isEnteringFromHome;
  window.__flPendingHeaderFavStarEntrance = [];
  const accountMorphSource = captureHeaderButtonSnapshot(document.getElementById('homeAccountBtn'));
  const chestStatusMorphSource = currentPageName === 'chestHome'
    ? captureHeaderButtonSnapshot(document.querySelector('body > .sticky-nav.chest-float-nav .chest-status-btn'))
    : null;
  const chestHelpMorphSource = currentPageName === 'chestHome'
    ? captureHeaderButtonSnapshot(document.querySelector('body > .sticky-nav.chest-float-nav .chest-help-btn'))
    : null;
  const chestHomeRouteIndex = Array.isArray(flRouteTrail) ? flRouteTrail.findIndex(function(item){ return item.id === 'chestHome'; }) : -1;
  const currentRouteIndexForChestReturn = Array.isArray(flRouteTrail) ? flRouteTrail.findIndex(function(item){ return item.id === currentPageName; }) : -1;
  const returningToChestHome = name === 'chestHome' && currentPageName !== 'home' && currentPageName !== 'chestHome' && chestHomeRouteIndex >= 0 && (currentRouteIndexForChestReturn > chestHomeRouteIndex || routeOptions?.history === 'silent' || routeOptions?.history === 'replace');
  const enteringFavoritesPage = name === 'favoritesPage' && currentPageName !== 'favoritesPage';
  const returningFromFavoritesPage = currentPageName === 'favoritesPage' && name !== 'favoritesPage';
  const favoritesPageExitMorphSource = enteringFavoritesPage
    ? captureHeaderButtonSnapshot(document.querySelector('body > .sticky-nav.chest-float-nav .header-fav-page-btn'))
    : null;

  const homeFavoriteSource = captureHeaderButtonSnapshot(document.getElementById('homeFavoritesBtn'));
  const previousBackBtn = currentPageName === 'home' ? null : document.querySelector('.chest-float-nav .tool-header > .back-btn:not(.header-fav-star-btn):not(.header-fav-page-btn)');
  const previousBackWidth = previousBackBtn ? previousBackBtn.getBoundingClientRect().width : 0;
  const hasPreviousHeaderStar = !!(previousBackBtn && previousBackBtn.parentElement.querySelector('.header-fav-star-btn'));
  const previousHeaderStar = (name === 'favoritesPage' || returningToChestHome) && previousBackBtn
    ? previousBackBtn.parentElement.querySelector('.header-fav-star-btn')
    : null;
  let favoriteExitClone = previousHeaderStar ? previousHeaderStar.cloneNode(true) : null;
  if(favoriteExitClone){
    favoriteExitClone.removeAttribute('id');
    favoriteExitClone.removeAttribute('onclick');
    favoriteExitClone.onclick = null;
    favoriteExitClone.setAttribute('aria-hidden','true');
    favoriteExitClone.tabIndex = -1;
    favoriteExitClone.style.pointerEvents = 'none';
    favoriteExitClone.style.opacity = '1';
    favoriteExitClone.querySelectorAll('.anim-pop,.anim-unpop').forEach(function(element){
      element.classList.remove('anim-pop','anim-unpop');
    });
  }
  // On narrow screens the outgoing sticky header can remain painted while the
  // destination header is lifted. Keep only the inert visual clone for this exit.
  if(returningToChestHome && previousHeaderStar) previousHeaderStar.remove();
  let favoriteExitCloneMounted = false;
  function mountFavoriteExitClone(){
    if((name !== 'favoritesPage' && !returningToChestHome) || !favoriteExitClone || favoriteExitCloneMounted) return;
    const targetBackButton = document.querySelector('body > .sticky-nav.chest-float-nav .tool-header > .back-btn:not(.header-fav-star-btn):not(.header-fav-page-btn)');
    if(!targetBackButton) return;
    targetBackButton.insertAdjacentElement('afterend',favoriteExitClone);
    favoriteExitCloneMounted = true;
  }
  function finishFavoriteExitClone(){
    if(!favoriteExitClone) return;
    const clone = favoriteExitClone;
    favoriteExitClone = null;
    favoriteExitCloneMounted = false;
    const backButton = clone.previousElementSibling;
    if(!backButton || !clone.isConnected || typeof clone.animate !== 'function' ||
       window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      clone.remove();
      return;
    }
    const backRect = backButton.getBoundingClientRect();
    const starRect = clone.getBoundingClientRect();
    if(backRect.width < 1 || starRect.width < 1){
      clone.remove();
      return;
    }
    const splitX = backRect.right - 5 - (starRect.left + starRect.width / 2);
    const splitY = backRect.top + backRect.height / 2 - (starRect.top + starRect.height / 2);
    const starStyle = getComputedStyle(clone);
    const starBackground = starStyle.backgroundColor;
    const starShadow = starStyle.boxShadow;
    void clone.offsetWidth;
    let animation;
    try{
      animation = clone.animate([
        {opacity:1,backgroundColor:starBackground,boxShadow:starShadow,transform:'translate(0,0) scale(1) rotate(0deg)',offset:0},
        {opacity:1,backgroundColor:starBackground,boxShadow:starShadow,transform:'translate(0,0) scale(.96) rotate(-2deg)',offset:.14},
        {opacity:1,backgroundColor:'transparent',boxShadow:'none',transform:'translate(0,0) scale(1.1) rotate(4deg)',offset:.32},
        {opacity:0,backgroundColor:'transparent',boxShadow:'none',transform:'translate('+splitX+'px,'+splitY+'px) scale(.24) rotate(-12deg)'}
      ],{duration:888,easing:'cubic-bezier(.75,0,.8,.25)',fill:'both'});
    }catch(error){
      clone.remove();
      return;
    }
    let cleaned = false;
    let fallbackTimer = null;
    const cleanup = function(){
      if(cleaned) return;
      cleaned = true;
      if(fallbackTimer !== null) clearTimeout(fallbackTimer);
      animation.cancel();
      clone.remove();
    };
    animation.onfinish = cleanup;
    fallbackTimer = setTimeout(cleanup,1000);
  }
  const previousNav = document.querySelector('body > .sticky-nav.chest-float-nav');
  const previousHeaderHeight = previousNav ? previousNav.getBoundingClientRect().height : 0;
  // 只有从首页进入工具页时，才为蓝色路径建立入场转场快照；工具页之间切换时保留蓝色路径静止不动。
  const map = {
    qq:pageQq, qqgroup:pageQqGroup, qrcode:pageQrcode, barcode:pageBarcode, scanner:pageScanner, encqrcode:pageEncQr, encscan:pageEncScan, currency:pageCurrency, iplookup:pageIplookup, dnsquery:pageDnsquery, domaincheck:pageDomainCheck, weather:pageWeather, translate:pageTranslate, aes:pageAes, daycalc:pageDayCalc, videoaudio:pageVideoAudio, audioConvert:pageAudioConverter, sitecheck:pageSiteCheck, oilprice:pageOilPrice, videoparse:pageVideoParse, imghost:pageImghost, refreshrate:pageRefreshRate, timestamp:pageTimestamp,
    textutil:pageTextutil, random:pageRandom, jsonfmt:pageJsonfmt, base64:pageBase64,
    hexconvert:pageHexconvert, uuidgen:pageUuidgen, chestHome:pageChestHome, backpack:pageBackpack,
    dicePage:pageDicePage, coinPage:pageCoinPage, eatPage:pageEatPage,
    yesnoPage:pageYesnoPage, bmiPage:pageBmiPage,
    fortunePage:pageFortunePage, passwordPage:pagePasswordPage,
    gachaPage:pageGachaPage, rpsPage:pageRpsPage, magic8Page:pageMagic8Page,
    fortuneTodayPage:pageFortuneTodayPage, jinriPage:pageJinriPage,
    slotPage:pageSlotPage, guessPage:pageGuessPage,
    minesweeperPage:pageminesweeperPage, tttPage:pagetttPage, memoryPage:pagememoryPage, whackPage:pagewhackPage, zodiacPage:pagezodiacPage, zodiacMatchPage:pagezodiacMatchPage, nameMatchPage:pagenameMatchPage, mentalAgePage:pagementalAgePage, brainTestPage:pagebrainTestPage, pastLifePage:pagepastLifePage, relativePage:pagerelativePage, agePage:pageagePage, anniversaryPage:pageanniversaryPage, caloriePage:pagecaloriePage, ovulationPage:pageovulationPage, rollCallPage:pagerollCallPage, groupPage:pagegroupPage, acrosticPage:pageacrosticPage, caesarPage:pagecaesarPage, morsePage:pagemorsePage, reverseTextPage:pagereverseTextPage, numgen:pageNumgen, pwcheck:pagePwcheck, unitConverter:pageUnitConverter, tetrisPage:pageTetris, gomokuPage:pageGomoku, game2048Page:pageGame2048, breakoutPage:pageBreakout, pinballPage:pagePinball, pinballShopPage:pagePinballShop, pianoPage:pagePiano, truthDarePage:pageTruthDarePage, jokesPage:pageJokesPage, riddlesPage:pageRiddlesPage, game24Page:pageGame24Page, idiomChainPage:pageIdiomChainPage, mindReadingPage:pageMindReadingPage, tarotPage:pageTarotPage, dreamPage:pageDreamPage, mbtiPage:pageMbtiPage, iqPage:pageIqPage, bloodMatchPage:pageBloodMatchPage, charDivPage:pageCharDivPage, astrodicePage:pageAstrodicePage, runePage:pageRunePage, pendulumPage:pagePendulumPage, lenormandPage:pageLenormandPage, oraclePage:pageOraclePage, kipperPage:pageKipperPage, numerologyPage:pageNumerologyPage, tealeafPage:pageTealeafPage, crystalballPage:pageCrystalballPage, wheelPage:pageWheelPage, coinWheelPage:pageCoinWheelPage, itemWheelPage:pageItemWheelPage, cardWheelPage:pageCardWheelPage, pinballWheelPage:pagePinballWheelPage, capsulePage:pageCapsulePage, achievementPage:pageAchievementPage, statusPage:pageStatusPage, foodShopPage:pageFoodShopPage, petSchoolPage:pagePetSchoolPage, petPlayPage:pagePetPlayPage, petWorkPage:pagePetWorkPage, dailyTaskPage:pageDailyTaskPage, cleanShopPage:pageCleanShopPage, toyShopPage:pageToyShopPage, superItemShopPage:pageSuperItemShopPage, warehousePage:pageWarehousePage, mailboxPage:pageMailboxPage, usageStatsPage:pageUsageStatsPage, collectionPage:pageCollectionPage, collectionRecordPage:pageCollectionRecordPage,
    spotDiffPage:pageSpotDiffPage, match3Page:pageMatch3Page, typingPage:pageTypingPage, linkGamePage:pageLinkGamePage,
    almanacPage:pageAlmanacPage, animalPersonalityPage:pageAnimalPersonalityPage, faceScorePage:pageFaceScorePage, moralityPage:pageMoralityPage,
    petDressPage:pagePetDressPage, petSkillPage:pagePetSkillPage,
    petExplorePage:pagePetExplorePage, petDiaryPage:pagePetDiaryPage,
    favoritesPage:pageFavorites,
    jsResourcesPage:pageJsResources, introPage:pageIntroPage, introManual:pageIntroPage, introHot:pageIntroPage, introSteam:pageIntroPage, introHistory:pageIntroPage, introFestival:pageIntroPage, introOldVersions:pageIntroPage, introQrManual:pageIntroPage, introQqManual:pageIntroPage, introQqGroupManual:pageIntroPage, introAesManual:pageIntroPage, introOtherManual:pageIntroPage,
    avatarMaker:pageAvatarMaker
  };
  const previousCurrent = previousNav?.querySelector('.breadcrumb .current');
  const previousCurrentText = previousCurrent?.textContent.trim() || '';
  // Some routes (notably the intro sections) reuse one page and breadcrumb.
  // Capture the outgoing title before rendering replaces its DOM nodes.
  const sharesBreadcrumb = !!(previousNav && map[name] &&
    flRouteGetBreadcrumb(map[name]) === previousNav.querySelector('.breadcrumb'));
  if(sharesBreadcrumb) finishBreadcrumbTyping(previousCurrent);
  const sharedBreadcrumbCurrentFrame = sharesBreadcrumb
    ? takeBreadcrumbCurrentFrame(previousCurrent)
    : null;
  // 目标页在切换前先按路径实体重绘，下面的动画读取的已是统一路由状态。
  // Reparent a tool opened from Favorites so its breadcrumb and Back target agree.
  const openingFavoriteTool = typeof isOpeningFavToolRoute === 'function' && isOpeningFavToolRoute(name);
  const favoritesTrailIndex = flRouteTrail.findIndex(function(item){ return item.id === 'favoritesPage'; });
  const currentTrailIndex = flRouteTrail.findIndex(function(item){ return item.id === currentPageName; });
  const allowHiddenBreadcrumbScatter = currentTrailIndex > 1;
  const existingTargetIndex = flRouteTrail.findIndex(function(item){ return item.id === name; });
  const currentIsAfterFavorites = favoritesTrailIndex >= 0 && currentTrailIndex > favoritesTrailIndex;
  const isBreadcrumbNavigation = routeOptions?.routeAction === 'breadcrumb';
  const isHistoryRestore = routeOptions?.history === 'silent' || routeOptions?.history === 'replace';
  const movingRouteAfterFavorites = !isBreadcrumbNavigation && !isHistoryRestore && existingTargetIndex >= 0 &&
    (openingFavoriteTool || currentIsAfterFavorites && existingTargetIndex < favoritesTrailIndex);
  if(movingRouteAfterFavorites){
    // Preserve the Favorites branch and move only the duplicate route to the end.
    flRouteSetTrail(flRouteTrail.filter(function(item){ return item.id !== name; }));
  }
  const previousAncestorLink = Array.from(previousNav?.querySelectorAll('.breadcrumb > a') || [])
    .find(function(link){ return link.dataset.route === name; });
  const ancestorLinkFrame = previousAncestorLink ? takeBreadcrumbLinkTextFrame(previousAncestorLink,allowHiddenBreadcrumbScatter) : null;
  const targetBreadcrumb = map[name] ? flRouteRenderBreadcrumb(name,map[name],routeOptions) : null;
  const retainedCurrentText = previousCurrentText && Array.from(targetBreadcrumb?.querySelectorAll(':scope > a') || [])
    .some(function(link){ return link.textContent.trim() === previousCurrentText; })
    ? previousCurrentText
    : '';
  const targetCurrentText = targetBreadcrumb?.querySelector(':scope > .current')?.textContent.trim() || '';
  if(movingRouteAfterFavorites && targetCurrentText){
    const replacedAncestorLink = Array.from(previousNav?.querySelectorAll('.breadcrumb > a') || [])
      .find(function(link){ return link.textContent.trim() === targetCurrentText; });
    if(replacedAncestorLink) scatterBreadcrumbText(replacedAncestorLink,allowHiddenBreadcrumbScatter);
  }
  const returningToAncestorTitle = !(openingFavoriteTool || movingRouteAfterFavorites) && !!(previousAncestorLink || (targetCurrentText && Array.from(previousNav?.querySelectorAll('.breadcrumb > a') || [])
    .some(function(link){ return link.textContent.trim() === targetCurrentText; })));
  let retainedCurrentFrame = sharesBreadcrumb ? sharedBreadcrumbCurrentFrame : null;
  if(retainedCurrentText){
    if(!sharesBreadcrumb){
      finishBreadcrumbTyping(previousCurrent);
      retainedCurrentFrame = takeBreadcrumbCurrentFrame(previousCurrent);
    }
  }else{
    if(sharesBreadcrumb){
      scatterBreadcrumbText(sharedBreadcrumbCurrentFrame?.source.firstElementChild);
      sharedBreadcrumbCurrentFrame?.layer.remove();
      retainedCurrentFrame = null;
    }else{
      scatterBreadcrumbCurrent(previousNav,allowHiddenBreadcrumbScatter);
    }
  }
  const breadcrumbReturnFrame = returningToAncestorTitle ? (ancestorLinkFrame || retainedCurrentFrame) : null;
  if(returningToAncestorTitle && ancestorLinkFrame && retainedCurrentFrame) retainedCurrentFrame.layer.remove();
  if(!returningToAncestorTitle) ancestorLinkFrame?.layer.remove();
  let breadcrumbTransitionHiddenTarget = null;
  if(breadcrumbReturnFrame?.source){
    breadcrumbTransitionHiddenTarget = targetBreadcrumb?.querySelector(':scope > .current') || null;
  }else if(retainedCurrentFrame?.source && retainedCurrentText){
    breadcrumbTransitionHiddenTarget = Array.from(targetBreadcrumb?.querySelectorAll(':scope > a') || [])
      .find(function(link){ return link.textContent.trim() === retainedCurrentText; }) || null;
  }
  breadcrumbTransitionHiddenTarget?.setAttribute('data-fl-breadcrumb-transition-hidden','');
  const breadcrumbCurrent = targetBreadcrumb?.querySelector(':scope > .current');
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const usesAncestorReturnFrame = returningToAncestorTitle && !!breadcrumbReturnFrame?.source;
  if(breadcrumbCurrent && !reducedMotion && !usesAncestorReturnFrame){
    breadcrumbCurrent.setAttribute('data-fl-breadcrumb-entry-pending','');
  }
  const finishBreadcrumbArrival = function(incomingNav){
    const frameToReveal = breadcrumbReturnFrame?.source ? breadcrumbReturnFrame : retainedCurrentFrame;
    let revealFrameId = 0;
    let revealActive = false;
    const stopTopbarReveal = function(){
      if(revealFrameId) cancelAnimationFrame(revealFrameId);
      revealFrameId = 0;
      if(frameToReveal?.layer){
        frameToReveal.layer.style.removeProperty('clip-path');
        frameToReveal.layer.style.removeProperty('-webkit-clip-path');
      }
    };
    const syncTopbarReveal = function(){
      if(!revealActive || !frameToReveal?.layer || !incomingNav) return;
      const bottomInset = Math.max(0,document.documentElement.clientHeight - incomingNav.getBoundingClientRect().bottom);
      const clip = 'inset(0px 0px '+bottomInset+'px 0px)';
      frameToReveal.layer.style.setProperty('clip-path',clip);
      frameToReveal.layer.style.setProperty('-webkit-clip-path',clip);
      if(incomingNav.classList.contains('breadcrumb-expand-pending')){
        revealFrameId = requestAnimationFrame(syncTopbarReveal);
      }else{
        revealFrameId = 0;
      }
    };
    const finish = function(){
      stopTopbarReveal();
      flClearBreadcrumbTransitionHiddenTargets(incomingNav || document);
      const breadcrumbReturnTransitionStarted = returningToAncestorTitle
        ? playBreadcrumbAncestorReturnTransition(breadcrumbReturnFrame)
        : false;
      if(!returningToAncestorTitle) playRetainedBreadcrumbCurrentTransition(retainedCurrentFrame,retainedCurrentText);
      if(!breadcrumbReturnTransitionStarted) animateBreadcrumbCurrentArrival(incomingNav,0,returningToAncestorTitle);
      flShowBreadcrumbTemporarily();
    };
    if(breadcrumbReturnFrame?.source || (retainedCurrentFrame?.source && retainedCurrentText)){
      if(frameToReveal?.revealWithTopbar && incomingNav?.classList.contains('breadcrumb-expand-pending')){
        revealActive = true;
        syncTopbarReveal();
      }
      flAfterTopbarExpansion(incomingNav,name,finish);
    }else{
      finish();
    }
  };
  cleanupBeforePageSwitch();
  // 保存当前页面滚动位置
  pageScrollPositions[currentPageName] = window.scrollY;
  // 离开当前工具页时把吸顶栏移回原位
  _returnStickyNav();
  pageHome.style.display='none';
  allToolPages.forEach(p=>p.style.display='none');
  flResetBreadcrumbAutoHide();
  if(map[name]){
    map[name].style.display='block';
    if(name==='audioConvert' && typeof window.flLoadAudioTool==='function') window.flLoadAudioTool();
    // 重新触发页面淡入动画（每次打开都播放）
    const pageEl = map[name];
    pageEl.style.animation = 'none';
    void pageEl.offsetWidth; // 强制重排，重置动画状态
    if(window.__flShowLoadErrorShellFor === name){
      _liftStickyNav(map[name], previousHeaderHeight);
      animateHomeTitleToBackButton(homeTitleBackSource);
      pageEl.style.animation = '';
      const incomingNav = document.querySelector('body > .sticky-nav.chest-float-nav');
      finishBreadcrumbArrival(incomingNav);
      mountFavoriteExitClone();
      animateActiveBackButtonWidth(previousBackWidth,finishFavoriteExitClone);
      const shellScroll = pageScrollPositions[name] || 0;
      window.scrollTo({top:shellScroll,behavior:'instant'});
      currentPageName = name;
      if(flRouteRestoringTarget === name) flRouteRestoringTarget = null;
      flRouteCommit(name,routeOptions);
      return;
    }
    window.dispatchEvent(new CustomEvent('fl:tool-page-enter',{detail:{name}}));
    if(name==='daycalc' && typeof loadHolidayList==='function') loadHolidayList();
    if(name==='iplookup'){ setTimeout(queryIp, 300); }
    if(name==='chestHome'){ updateChestProgress(); }
    if(name==='gomokuPage')gomokuInit();
    if(name==='game2048Page')game2048Init();
    if(name==='pianoPage')pianoInit();
    if(name==='capsulePage')capsuleRender();
    if(name==='sitecheck')renderSiteCheckHistory();
    if(name==='achievementPage')achievementRender();
    if(name==='statusPage')updateStatusPage();
    if(name==='foodShopPage')initFoodShop();
    if(name==='petSchoolPage')initPetSchool();
    if(name==='petPlayPage')updatePlayUI();
    if(name==='petWorkPage')initPetWork();
    if(name==='dailyTaskPage'){
      // 记录来源页面，用于返回按钮
      window._dailyTaskFrom = currentPageName || 'chestHome';
      renderDailyTasks();
      // 每次打开每日任务都回到顶部
      setTimeout(function(){ window.scrollTo(0,0); }, 30);
    }
    if(name==='cleanShopPage')initCleanShop();
    if(name==='toyShopPage')initToyShop();
    if(name==='superItemShopPage')initSuperItemShop();
    if(name==='warehousePage')initWarehouse();
    if(name==='mailboxPage')initMailbox();
    if(name==='usageStatsPage')initUsageStats();
    if(name==='collectionPage')renderAllCollections();
    if(name==='collectionRecordPage')renderCollectionHistory();
    if(name==='spotDiffPage')initSpotDiff();
    if(name==='match3Page')initMatch3();
    if(name==='typingPage')initTyping();
    if(name==='linkGamePage')initLinkGame();
    if(name==='almanacPage')initAlmanac();
    if(name==='animalPersonalityPage')initAnimalPersonality();
    if(name==='faceScorePage')initFaceScore();
    if(name==='moralityPage')initMorality();
    if(name==='petDressPage')initPetDress();
    if(name==='petSkillPage')initPetSkill();
    if(name==='petExplorePage')initPetExplore();
    if(name==='petDiaryPage')initPetDiary();
    if(name==='coinWheelPage'){initWheel('coin');renderWheel('coin');}
    if(name==='itemWheelPage'){initWheel('item');renderWheel('item');}
    if(name==='cardWheelPage'){initWheel('card');renderWheel('card');}
    if(name==='pinballWheelPage'){initWheel('pinball');renderWheel('pinball');}
    if(name==='favoritesPage'){ if(!window.__flPreserveFavReturn) favReturnFrom = currentPageName; window.__flPreserveFavReturn = false; renderFavoritesPage(); }
    if(name==='chestHome')injectFavStars();
    // 给工具页右上角加收藏按钮
    if(name !== 'favoritesPage') injectHeaderFavBtn(map[name], name, hasPreviousHeaderStar);
    if(typeof applyFavPageReturn === 'function') applyFavPageReturn(map[name], name);
    // 先把导航栏移出页面动画容器，再启动整页动画。
    _liftStickyNav(map[name], previousHeaderHeight);
      animateHomeTitleToBackButton(homeTitleBackSource);
    pageEl.style.animation = '';

    const incomingNav = document.querySelector('body > .sticky-nav.chest-float-nav');
    finishBreadcrumbArrival(incomingNav);
    mountFavoriteExitClone();
    animateActiveBackButtonWidth(previousBackWidth,finishFavoriteExitClone);
    if(isEnteringFromHome) releaseHomeHeaderFavStarEntrance();
    if(accountMorphSource){
      const headerMorphTarget = name === 'chestHome'
        ? document.querySelector('body > .sticky-nav.chest-float-nav .chest-status-btn')
        : document.querySelector('body > .sticky-nav.chest-float-nav .header-fav-page-btn');
      const chestStatusSnapshot = name === 'chestHome' ? captureHeaderButtonSnapshot(headerMorphTarget) : null;
      if(headerMorphTarget){
        const favoriteAbsorbTarget = accountMorphSource;
        animateHomeFavoriteAbsorb(homeFavoriteSource,favoriteAbsorbTarget);
      }
      let startChestHelpFlyout = null;
      if(name === 'chestHome'){
        const chestHelpButton=document.querySelector('body > .sticky-nav.chest-float-nav .chest-help-btn');
        const chestHelpSnapshot=captureHeaderButtonSnapshot(chestHelpButton);
        startChestHelpFlyout=animateChestHelpFlyout(chestHelpButton,chestHelpSnapshot,chestStatusSnapshot);
      }
      animateHeaderButtonMorph(accountMorphSource,headerMorphTarget,650/FL_HOME_ENTRY_SPEED_FACTOR,startChestHelpFlyout,isEnteringFromHome ? 150/FL_HOME_ENTRY_SPEED_FACTOR : 0);
    } else if(chestStatusMorphSource && name !== 'favoritesPage'){
      const headerFavTarget = document.querySelector('body > .sticky-nav.chest-float-nav .header-fav-page-btn');
      const headerFavSnapshot = captureHeaderButtonSnapshot(headerFavTarget);
      if(headerFavSnapshot){
        animateHeaderButtonMorph(chestStatusMorphSource,headerFavTarget,650);
        animateChestHelpSpring(chestHelpMorphSource,chestStatusMorphSource.rect,'absorb');
      }
    } else if(favoritesPageExitMorphSource && enteringFavoritesPage){
      animateHeaderFavoriteClickShrink(favoritesPageExitMorphSource);
    } else if(returningToChestHome){
      const chestStatusTarget = document.querySelector('body > .sticky-nav.chest-float-nav .chest-status-btn');
      const chestStatusTargetSnapshot = captureHeaderButtonSnapshot(chestStatusTarget);
      if(chestStatusTargetSnapshot){
        animateChestStatusReturnPop(chestStatusTarget);
        const chestHelpTarget=document.querySelector('body > .sticky-nav.chest-float-nav .chest-help-btn');
        const chestHelpTargetSnapshot=captureHeaderButtonSnapshot(chestHelpTarget);
        animateChestHelpSpring(chestHelpTargetSnapshot,chestStatusTargetSnapshot.rect,'return',chestHelpTarget);
      }
    }
    if(returningFromFavoritesPage){
      animateHeaderFavoriteReturnGrow(document.querySelector('body > .sticky-nav.chest-float-nav .header-fav-page-btn'));
    }
    // 恢复目标页面滚动位置，新页面则回到顶部
    const savedPos = pageScrollPositions[name] || 0;
    window.scrollTo({top:savedPos,behavior:'instant'});
    currentPageName = name;
    if(flRouteRestoringTarget === name) flRouteRestoringTarget = null;
    flRouteCommit(name,routeOptions);
    // 每日任务：记录使用了不同工具（排除首页/百宝箱/状态等导航页）
    if(typeof recordDailyToolUse === 'function' && !['chestHome','backpack','statusPage'].includes(name)){
      recordDailyToolUse(name);
    }
    // 每日任务：玩游戏（打开游戏页面即记录）
    const gamePages = ['minesweeperPage','tttPage','memoryPage','whackPage','tetrisPage','gomokuPage','game2048Page','breakoutPage','pinballPage','pianoPage','dicePage','coinPage','eatPage','yesnoPage','rpsPage','magic8Page','slotPage','guessPage','gachaPage','spotDiffPage','match3Page','typingPage','linkGamePage'];
    if(typeof updateDailyTask === 'function' && gamePages.includes(name)){
      updateDailyTask('daily_play_game', 1);
    }
  }
}
function goHome(routeOptions){
  flDismissBreadcrumbConfirm();
  flClearBreadcrumbTransitionHiddenTargets();
  const breadcrumbNav = document.querySelector('body > .sticky-nav.chest-float-nav');
  if(activeBreadcrumbCurrentCleanup) activeBreadcrumbCurrentCleanup();
  flClearBreadcrumbTransitionFrames();
  const currentRouteTrailIndex = flRouteTrail.findIndex(function(item){ return item.id === currentPageName; });
  const allowHiddenBreadcrumbScatter = currentRouteTrailIndex > 1;
  if(flIsBreadcrumbVisible(breadcrumbNav) || allowHiddenBreadcrumbScatter){
    scatterBreadcrumbCurrent(breadcrumbNav,allowHiddenBreadcrumbScatter);
    scatterBreadcrumbPrefix(breadcrumbNav,allowHiddenBreadcrumbScatter);
  }else{
    finishBreadcrumbTyping(breadcrumbNav?.querySelector('.breadcrumb .current'));
  }

  const leavingStar = document.querySelector('body > .sticky-nav.chest-float-nav .header-fav-star-btn');
  const leavingStarSnapshot = captureHeaderButtonSnapshot(leavingStar);
  if(leavingStarSnapshot) leavingStarSnapshot.opacity = getComputedStyle(leavingStar).opacity;
  finishHeaderButtonMorph();
  finishHomeFavoriteAbsorb();
  finishHomeBrandTransition();
  const leavingBack = document.querySelector('body > .sticky-nav.chest-float-nav .tool-header > .back-btn:not(.header-fav-star-btn):not(.header-fav-page-btn)');
  const leavingBackSnapshot = captureHeaderButtonSnapshot(leavingBack);
  if(leavingBackSnapshot && leavingBack){
    leavingBackSnapshot.clone = leavingBack.cloneNode(true);
    leavingBackSnapshot.clone.removeAttribute('id');
    leavingBackSnapshot.clone.removeAttribute('onclick');
    leavingBackSnapshot.clone.onclick = null;
    leavingBackSnapshot.clone.setAttribute('aria-hidden','true');
    leavingBackSnapshot.clone.tabIndex = -1;
  }
  const chestStatusMorphSource = currentPageName === 'chestHome'
    ? captureHeaderButtonSnapshot(document.querySelector('.chest-float-nav .tool-header > .chest-status-btn'))
    : null;
  const favoriteMorphSource = currentPageName === 'home' || currentPageName === 'chestHome'
    ? null
    : captureHeaderButtonSnapshot(document.querySelector('.chest-float-nav .tool-header > .header-fav-page-btn'));
  const headerMorphSource = chestStatusMorphSource || favoriteMorphSource;
  const previousNav = document.querySelector('body > .sticky-nav.chest-float-nav');
  const previousHeaderHeight = previousNav ? previousNav.getBoundingClientRect().height : 0;
  cleanupBeforePageSwitch();
  // 保存当前页面滚动位置
  pageScrollPositions[currentPageName] = window.scrollY;
  // 离开当前工具页时把吸顶栏移回原位
  _returnStickyNav();
  pageHome.style.display='block';
  allToolPages.forEach(p=>p.style.display='none');
  // 先隐藏原页面再清除收起状态，让顶栏从实际60px直接过渡到首页高度。
  flResetBreadcrumbAutoHide();
  const savedPos = pageScrollPositions['home'] || 0;
  window.scrollTo({top:savedPos,behavior:'instant'});
  // 首页顶栏也固定到顶部
  _liftStickyNav(pageHome, previousHeaderHeight);

  const homeTitleReturnSource = captureHomeTitleBackSource();
  animateBackButtonToHomeTitle(leavingBackSnapshot,homeTitleReturnSource);
  animateHeaderStarIntoBackButton(leavingStarSnapshot,leavingBackSnapshot);
  const homeAccountButton = document.getElementById('homeAccountBtn');
  const homeFavoriteButton = document.getElementById('homeFavoritesBtn');
  const homeAccountTarget = captureHeaderButtonSnapshot(homeAccountButton);
  const homeFavoriteTarget = captureHeaderButtonSnapshot(homeFavoriteButton);
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(headerMorphSource && homeAccountTarget && homeFavoriteTarget && typeof Element.prototype.animate === 'function' && !reducedMotion){
    const oldVisibility = homeFavoriteButton.style.getPropertyValue('visibility');
    const oldVisibilityPriority = homeFavoriteButton.style.getPropertyPriority('visibility');
    let visibilityRestored = false;
    let favoriteFlyTimer = null;
    const restoreFavoriteVisibility = function(){
      if(visibilityRestored) return;
      visibilityRestored = true;
      if(favoriteFlyTimer !== null){
        clearTimeout(favoriteFlyTimer);
        favoriteFlyTimer = null;
      }
      if(oldVisibility) homeFavoriteButton.style.setProperty('visibility',oldVisibility,oldVisibilityPriority);
      else homeFavoriteButton.style.removeProperty('visibility');
      if(activeHomeFavoriteReturnCleanup === restoreFavoriteVisibility) activeHomeFavoriteReturnCleanup = null;
    };
    homeFavoriteButton.style.setProperty('visibility','hidden','important');
    activeHomeFavoriteReturnCleanup = restoreFavoriteVisibility;
    animateHeaderButtonMorph(headerMorphSource,homeAccountButton,650);
    favoriteFlyTimer = window.setTimeout(function(){
      favoriteFlyTimer = null;
      if(activeHomeFavoriteReturnCleanup !== restoreFavoriteVisibility) return;
      animateHomeFavoriteReturnFly(homeFavoriteTarget,homeAccountTarget.rect,restoreFavoriteVisibility);
    },150);
  }else if(headerMorphSource){
    animateHeaderButtonMorph(headerMorphSource,homeAccountButton,650);
  }

  currentPageName = 'home';
  document.title = FL_DEFAULT_DOCUMENT_TITLE;
  flRouteSetTrail([{id:'home',title:'首页'}]);
  if(flRouteRestoringTarget === 'home') flRouteRestoringTarget = null;
  flRouteEnsure('home',pageHome);
  flRouteCommit('home',routeOptions);
  toolReturnTarget = null;
}

// 工具页返回落点：从其他工具页进入时记录，返回时回到来源页
let toolReturnTarget = null;
function openToolWithReturn(name, returnTarget){
  toolReturnTarget = returnTarget;
  openPage(name);
}
function backFromTool(){
  if(flRouteTrail.length > 1){
    const previous = flRouteTrail[flRouteTrail.length - 2];
    toolReturnTarget = null;
    flNavigateRoute(previous.id);
  }else if(toolReturnTarget){
    const t = toolReturnTarget;
    toolReturnTarget = null;
    flNavigateRoute(t);
  }else{
    goHome();
  }
}

// 让地址栏、浏览器前进/后退与页面实体保持同一条路径状态。
(function initFlRouteHistory(){
  function restoreRouteFromLocation(routeOptions){
    flRouteRestoreTrailFromLocation();
    const routeId = flRouteReadLocation();
    if(location.hash.split('/').includes('morePage')) flRouteCommit(routeId || 'home',{history:'replace'});
    if(!routeId || routeId === currentPageName || flRouteRestoringTarget === routeId) return;
    flRouteRestoringTarget = routeId;
    flNavigateRoute(routeId,routeOptions || {history:'silent'});
  }
  window.addEventListener('popstate',restoreRouteFromLocation);
  window.addEventListener('hashchange',restoreRouteFromLocation);
  setTimeout(function(){
    flRouteEnsure('home',pageHome);
    flRouteRestoreTrailFromLocation();
    const initialRoute = flRouteReadLocation();
    if(initialRoute && initialRoute !== 'home') restoreRouteFromLocation({history:'replace'});
    else flRouteCommit('home',{history:'replace'});
  },0);
})();

