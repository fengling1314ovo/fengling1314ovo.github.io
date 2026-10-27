
/* 全站导航状态、吸顶导航、关于按钮和首页时钟。 */
// 统一吸顶栏搬运：进入任意工具页时将该页的 .sticky-nav 移到 body 直属子级，离开时移回原位
(function(){
  let _liftedNav = null;
  let _placeholder = null;
  let _ownerPage = null;
  const heightAnimCleanups = new WeakMap();
  const pagePaddingAnimStates = new WeakMap();

  function animateNavHeight(nav, startHeight, targetHeight){
    // 只裁切顶栏背景高度；无论展开或收起，面包屑文字都不参与上下位移。
    if(!nav || !startHeight || Math.abs(targetHeight - startHeight) < 1) return;
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const breadcrumb = nav.querySelector(':scope > .breadcrumb');
    const delayBreadcrumbUntilExpanded = !nav.classList.contains('home-sticky-nav') &&
      !document.documentElement.classList.contains('address-bar-hidden') &&
      targetHeight > startHeight && !!breadcrumb?.textContent.trim();
    const previousCleanup = heightAnimCleanups.get(nav);
    if(previousCleanup) previousCleanup();
    if(delayBreadcrumbUntilExpanded) nav.classList.add('breadcrumb-expand-pending');

    nav.classList.add('header-height-transition');
    nav.style.boxSizing = 'border-box';
    nav.style.overflow = 'hidden';
    nav.style.transition = 'none';
    nav.style.height = startHeight + 'px';
    void nav.offsetHeight;

    nav.style.removeProperty('transition');
    void nav.offsetHeight;

    let timer;
    let frameId = 0;
    const cleanup = function(){
      if(timer) clearTimeout(timer);
      if(frameId) cancelAnimationFrame(frameId);
      nav.removeEventListener('transitionend', onTransitionEnd);
      nav.classList.remove('header-height-transition');
      nav.classList.remove('breadcrumb-expand-pending');
      nav.style.removeProperty('height');
      nav.style.removeProperty('box-sizing');
      nav.style.removeProperty('overflow');
      heightAnimCleanups.delete(nav);
    };
    const onTransitionEnd = function(event){
      if(event.propertyName === 'height') cleanup();
    };
    nav.addEventListener('transitionend', onTransitionEnd);
    timer = setTimeout(cleanup, 560);
    heightAnimCleanups.set(nav, cleanup);

    frameId = requestAnimationFrame(function(){
      frameId = 0;
      nav.style.height = targetHeight + 'px';
    });
  }

  function flSetBackButtonLabel(button,parentTitle){
    const arrow = document.createElement('span');
    arrow.textContent = '←';
    const label = document.createElement('span');
    label.textContent = '返回';
    const parent = document.createElement('span');
    parent.className = 'fl-back-parent-label';
    parent.textContent = parentTitle;
    label.appendChild(parent);
    button.replaceChildren(arrow,label);
    button.setAttribute('aria-label','返回' + parentTitle);
  }
  window.flSetBackButtonLabel = flSetBackButtonLabel;

  function syncStickyNavBackButton(nav){
    const breadcrumb = nav?.querySelector('.breadcrumb');
    const backButton = nav?.querySelector('.tool-header > .back-btn');
    if(!breadcrumb || !backButton) return;
    // Favorites entry points set a deliberate Back action before the nav is lifted.
    // Preserve that action instead of replacing it with the breadcrumb's default parent.
    if(backButton.dataset.flFavBackMode) return;
    const previousLink = Array.from(breadcrumb.querySelectorAll(':scope > a')).pop() || null;
    const previousTitle = previousLink?.textContent.trim() || '首页';
    const previousRoute = previousLink?.dataset.route || 'home';
    flSetBackButtonLabel(backButton,previousTitle);
    backButton.onclick = function(event){
      event?.preventDefault();
      if(previousRoute === 'home') window.goHome();
      else if(typeof window.flNavigateRoute === 'function') window.flNavigateRoute(previousRoute);
      else window.openPage(previousRoute);
    };
  }


  function animatePageTopPadding(page,targetHeight){
    const targetPadding = targetHeight + 10;
    const currentPadding = parseFloat(getComputedStyle(page).paddingTop) || 0;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let previousState = pagePaddingAnimStates.get(page);

    if(reducedMotion || Math.abs(currentPadding - targetPadding) < 1){
      if(previousState){
        clearTimeout(previousState.timer);
        page.removeEventListener('transitionend',previousState.onTransitionEnd);
        pagePaddingAnimStates.delete(page);
      }
      page.classList.remove('fl-topbar-padding-transition');
      page.style.setProperty('padding-top',targetPadding + 'px','important');
      return;
    }

    if(previousState){
      clearTimeout(previousState.timer);
      page.removeEventListener('transitionend',previousState.onTransitionEnd);
    }else{
      page.classList.add('fl-topbar-padding-transition');
      void page.offsetHeight;
    }

    const state = {timer:null,onTransitionEnd:null};
    const cleanup = function(){
      if(pagePaddingAnimStates.get(page) !== state) return;
      clearTimeout(state.timer);
      page.removeEventListener('transitionend',state.onTransitionEnd);
      page.classList.remove('fl-topbar-padding-transition');
      pagePaddingAnimStates.delete(page);
    };
    state.onTransitionEnd = function(event){
      if(event.propertyName === 'padding-top') cleanup();
    };
    state.timer = setTimeout(cleanup,560);
    pagePaddingAnimStates.set(page,state);
    page.addEventListener('transitionend',state.onTransitionEnd);
    page.style.setProperty('padding-top',targetPadding + 'px','important');
  }
  window.flSyncLiftedStickyNavHeight = function(previousHeight){
    const nav = _liftedNav;
    const page = _ownerPage;
    if(!nav || !page) return;
    const targetHeight = nav.offsetHeight;
    if(targetHeight <= 0) return;
    animatePageTopPadding(page,targetHeight);
    if(previousHeight) animateNavHeight(nav,previousHeight,targetHeight);
  };
  window._liftStickyNav = function(page, previousHeight){
    if(_liftedNav) _returnStickyNav();
    if(!page) return;
    const nav = page.querySelector(':scope > .sticky-nav');
    if(!nav) return;
    const placeholder = document.createElement('div');
    placeholder.style.cssText = 'display:none;height:' + (nav.offsetHeight || 62) + 'px;';
    _liftedNav = nav;
    _placeholder = placeholder;
    _ownerPage = page;
    nav.dataset.flOwnerPageId = page.id || '';
    nav.parentNode.insertBefore(placeholder, nav);
    nav.classList.add('chest-float-nav');
    document.body.appendChild(nav);
    syncStickyNavBackButton(nav);
    // 动态计算固定顶栏实际高度，让页面内容下移对应距离，避免标题被顶栏遮住
    const navH = nav.offsetHeight;
    if(navH > 0){
      page.style.setProperty('padding-top', (navH + 10) + 'px', 'important');
      // Animate whenever the outgoing and incoming headers have different heights.
      // Same-height route changes are already skipped inside animateNavHeight.
      animateNavHeight(nav, previousHeight, navH);
    }
  };

  window._returnStickyNav = function(){
    if(!_liftedNav) return;
    const nav = _liftedNav;
    delete nav.dataset.flOwnerPageId;
    const placeholder = _placeholder;
    const page = _ownerPage;
    nav.classList.remove('chest-float-nav');
    // 恢复页面默认 padding-top
    if(page){
      page.style.removeProperty('padding-top');
      if(page.style.length === 0) page.removeAttribute('style');
    }
    if(placeholder && placeholder.parentNode){
      placeholder.parentNode.insertBefore(nav, placeholder);
      placeholder.parentNode.removeChild(placeholder);
    } else if(page){
      page.insertBefore(nav, page.firstChild);
    }
    _liftedNav = null;
    _placeholder = null;
    _ownerPage = null;
  };
})();

// 页面滚动位置记忆
const pageScrollPositions = {};
let currentPageName = 'home';

// 首页时钟
(function(){
  let holidayCache=null;
  let holidayCacheTime=0;

  // 从后端API加载节假日数据
  async function loadHolidays(){
    const now=Date.now();
    if(holidayCache && now-holidayCacheTime<86400000) return holidayCache;
    try{
      const cached=localStorage.getItem('holiday_data');
      const cachedTime=parseInt(localStorage.getItem('holiday_data_time')||'0');
      if(cached && now-cachedTime<86400000){
        holidayCache=JSON.parse(cached);
        holidayCacheTime=cachedTime;
        return holidayCache;
      }
    }catch(e){}
    const year=new Date().getFullYear();
    let list=[];
    try{
      const [r1,r2]=await Promise.all([
        fetch('https://api.fengling1314ovo.top/api/holidays?year='+year).then(r=>r.json()),
        fetch('https://api.fengling1314ovo.top/api/holidays?year='+(year+1)).then(r=>r.json())
      ]);
      if(r1&&r1.ok&&r1.data) list=list.concat(r1.data);
      if(r2&&r2.ok&&r2.data) list=list.concat(r2.data);
      holidayCache=list.map(h=>({name:h.name,date:h.date}));
      holidayCache.sort((a,b)=>a.date.localeCompare(b.date));
      holidayCacheTime=now;
      try{
        localStorage.setItem('holiday_data',JSON.stringify(holidayCache));
        localStorage.setItem('holiday_data_time',String(now));
      }catch(e){}
    }catch(e){
      holidayCache=[];
      holidayCacheTime=now;
    }
    return holidayCache;
  }
  loadHolidays();

  function nextHoliday(){
    const now=new Date();now.setHours(0,0,0,0);
    const list=holidayCache||[];
    for(const h of list){
      const d=new Date(h.date+'T00:00:00');
      if(d>=now) return {name:h.name,days:Math.ceil((d-now)/86400000)};
    }
    return null;
  }
  let homeClockFrame=0;
  function updateHomeClock(){
    homeClockFrame=0;
    const el=document.getElementById('homeClock');
    if(!el) return;
    const showClock=localStorage.getItem('clock_show')==='1';
    const showMs=localStorage.getItem('clock_ms')==='1';
    const showHoliday=localStorage.getItem('show_holiday')==='1';
    if(!showClock&&!showHoliday){ el.style.display='none'; return; }
    el.style.display='block';
    let timeStr='';
    if(showClock){
      const d=new Date();
      const h=String(d.getHours()).padStart(2,'0');
      const m=String(d.getMinutes()).padStart(2,'0');
      const s=String(d.getSeconds()).padStart(2,'0');
      timeStr=h+':'+m+':'+s;
      if(showMs) timeStr+='.'+String(d.getMilliseconds()).padStart(3,'0');
    }
    let holidayStr='';
    if(showHoliday){
      const nh=nextHoliday();
      if(nh){
        holidayStr=nh.name+(nh.days===0?'今天':' '+nh.days+'天');
      }
    }
    el.innerHTML='<span style="white-space:nowrap;font-size:13px;">'+timeStr+'</span>'+(holidayStr?' <span style="white-space:nowrap;font-size:12px;">· '+holidayStr+'</span>':'');
    homeClockFrame=requestAnimationFrame(updateHomeClock);
  }
  window.flUpdateHomeClock=function(){
    if(homeClockFrame) cancelAnimationFrame(homeClockFrame);
    homeClockFrame=0;
    updateHomeClock();
  };
  updateHomeClock();
})();
