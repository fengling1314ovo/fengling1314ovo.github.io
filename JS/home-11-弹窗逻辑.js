// ==================== 弹窗逻辑 ====================
const HEADER_FAV_HIDE_KEY = 'qqtool_hide_header_fav_star';
function applyHeaderFavoriteHide(hidden){
  document.documentElement.classList.toggle('hide-header-favorite-star', hidden);
  const toggle = document.getElementById('headerFavShowToggle');
  if(toggle) toggle.setAttribute('aria-checked', String(!hidden));
}
function toggleHeaderFavoriteShow(){
  const hidden = document.getElementById('headerFavShowToggle').getAttribute('aria-checked') !== 'true';
  try{ localStorage.setItem(HEADER_FAV_HIDE_KEY, hidden ? '1' : '0'); }catch(e){}
  applyHeaderFavoriteHide(hidden);
}
try{ applyHeaderFavoriteHide(localStorage.getItem(HEADER_FAV_HIDE_KEY) !== '0'); }
catch(e){ applyHeaderFavoriteHide(true); }

const BACK_PARENT_SHOW_KEY = 'qqtool_show_back_parent';
function applyBackParentShow(show){
  document.documentElement.classList.toggle('show-back-parent',show);
  const toggle = document.getElementById('backParentShowToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(show));
}
function toggleBackParentShow(){
  const show = document.getElementById('backParentShowToggle').getAttribute('aria-checked') === 'true';
  try{ localStorage.setItem(BACK_PARENT_SHOW_KEY,show ? '1' : '0'); }catch(e){}
  applyBackParentShow(show);
}
try{ applyBackParentShow(localStorage.getItem(BACK_PARENT_SHOW_KEY) === '1'); }
catch(e){ applyBackParentShow(false); }

const BREADCRUMB_GUARD_KEY = 'qqtool_breadcrumb_guard';
function applyBreadcrumbGuard(enabled){
  window.flBreadcrumbGuardEnabled = enabled;
  const toggle = document.getElementById('breadcrumbGuardToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(enabled));
  if(!enabled) window.flDismissBreadcrumbConfirm?.();
}
function toggleBreadcrumbGuard(){
  const enabled = document.getElementById('breadcrumbGuardToggle').getAttribute('aria-checked') === 'true';
  try{ localStorage.setItem(BREADCRUMB_GUARD_KEY,enabled ? '1' : '0'); }catch(e){}
  applyBreadcrumbGuard(enabled);
}
try{ applyBreadcrumbGuard(localStorage.getItem(BREADCRUMB_GUARD_KEY) !== '0'); }
catch(e){ applyBreadcrumbGuard(true); }

const ADDRESS_BAR_HIDE_KEY = 'qqtool_hide_address_bar';
function applyAddressBarHide(hidden){
  const nav = document.querySelector('body > .sticky-nav.chest-float-nav');
  const previousHeight = nav?.offsetHeight || 0;
  document.documentElement.classList.toggle('address-bar-hidden',hidden);
  window.flResetBreadcrumbAutoHide?.();
  const toggle = document.getElementById('addressBarHideToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(hidden));
  window.flSyncLiftedStickyNavHeight?.(previousHeight);
}
function toggleAddressBarHide(){
  const hidden = document.getElementById('addressBarHideToggle').getAttribute('aria-checked') === 'true';
  try{ localStorage.setItem(ADDRESS_BAR_HIDE_KEY,hidden?'1':'0'); }catch(e){}
  applyAddressBarHide(hidden);
}
try{ applyAddressBarHide(localStorage.getItem(ADDRESS_BAR_HIDE_KEY) === '1'); }
catch(e){ applyAddressBarHide(false); }
const CARD_MATERIAL_KEY = 'qqtool_card_material';
function applyCardMaterial(enabled){
  document.documentElement.classList.toggle('card-material-disabled',!enabled);
  const toggle = document.getElementById('cardMaterialToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(enabled));
}
function toggleCardMaterial(){
  const enabled = document.getElementById('cardMaterialToggle').getAttribute('aria-checked') === 'true';
  try{ localStorage.setItem(CARD_MATERIAL_KEY,enabled ? '1' : '0'); }catch(e){}
  applyCardMaterial(enabled);
}
try{ applyCardMaterial(localStorage.getItem(CARD_MATERIAL_KEY) !== '0'); }
catch(e){ applyCardMaterial(true); }

const CARD_DESCRIPTION_KEY = 'qqtool_card_descriptions';
function applyCardDescriptions(enabled){
  document.documentElement.classList.toggle('card-descriptions-hidden',!enabled);
  const toggle = document.getElementById('cardDescriptionToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(enabled));
}
function toggleCardDescriptions(){
  const enabled = document.getElementById('cardDescriptionToggle').getAttribute('aria-checked') === 'true';
  try{ localStorage.setItem(CARD_DESCRIPTION_KEY,enabled ? '1' : '0'); }catch(e){}
  applyCardDescriptions(enabled);
}
try{ applyCardDescriptions(localStorage.getItem(CARD_DESCRIPTION_KEY) !== '0'); }
catch(e){ applyCardDescriptions(true); }

const MODAL_PROGRESSIVE_BLUR_DISABLE_KEY = 'qqtool_disable_modal_progressive_blur';
function applyModalProgressiveBlurDisabled(disabled){
  document.documentElement.classList.toggle('modal-progressive-blur-disabled',disabled);
  const toggle = document.getElementById('modalProgressiveBlurDisableToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(disabled));
}
function toggleModalProgressiveBlurDisabled(){
  const disabled = document.getElementById('modalProgressiveBlurDisableToggle').getAttribute('aria-checked') === 'true';
  try{ localStorage.setItem(MODAL_PROGRESSIVE_BLUR_DISABLE_KEY,disabled ? '1' : '0'); }catch(e){}
  applyModalProgressiveBlurDisabled(disabled);
}
try{ applyModalProgressiveBlurDisabled(localStorage.getItem(MODAL_PROGRESSIVE_BLUR_DISABLE_KEY) === '1'); }
catch(e){ applyModalProgressiveBlurDisabled(false); }

const MODAL_BACKDROP_SHAKE_KEY = 'qqtool_modal_backdrop_shake';
function applyModalBackdropShake(enabled){
  document.documentElement.classList.toggle('modal-backdrop-shake-disabled',!enabled);
  const toggle = document.getElementById('modalBackdropShakeToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(enabled));
}
function toggleModalBackdropShake(){
  const enabled = document.getElementById('modalBackdropShakeToggle').getAttribute('aria-checked') === 'true';
  try{ localStorage.setItem(MODAL_BACKDROP_SHAKE_KEY,enabled?'1':'0'); }catch(e){}
  applyModalBackdropShake(enabled);
}
try{ applyModalBackdropShake(localStorage.getItem(MODAL_BACKDROP_SHAKE_KEY) !== '0'); }
catch(e){ applyModalBackdropShake(true); }

const TOPBAR_BLUR_ENABLED_KEY = 'qqtool_topbar_blur_enabled';
const TOPBAR_BLUR_AMOUNT_KEY = 'qqtool_topbar_blur_amount';
function clampTopbarBlur(value){
  const parsed = Number(value);
  return Math.round(Math.max(0,Math.min(24,Number.isFinite(parsed) ? parsed : 4)));
}
function applyTopbarBlur(enabled,amount){
  const blur = clampTopbarBlur(amount);
  const hasBlur = enabled && blur > 0;
  document.documentElement.style.setProperty('--fl-topbar-blur',(hasBlur ? blur : 0)+'px');
  document.documentElement.style.setProperty('--fl-topbar-background',hasBlur ? 'linear-gradient(180deg,rgba(248,250,255,0.82),rgba(248,250,255,0.72))' : 'rgb(248,250,255)');
  const toggle = document.getElementById('headerBlurToggle');
  const panel = document.getElementById('headerBlurPanel');
  const range = document.getElementById('headerBlurRange');
  const valueLabel = document.getElementById('headerBlurValue');
  if(toggle) toggle.setAttribute('aria-checked',String(enabled));
  if(panel){
    panel.classList.toggle('is-open',enabled);
    panel.setAttribute('aria-hidden',String(!enabled));
    panel.inert = !enabled;
  }
  if(range){
    range.value = String(blur);
    range.setAttribute('aria-valuetext',blur+'px');
    window.flUpdateRangeControl?.(range);
  }
  if(valueLabel) valueLabel.textContent = blur+'px';
  const blurLevels = [0,4,12,18,24];
  const activeLevel = blurLevels.reduce((nearest,level)=>Math.abs(blur-level)<Math.abs(blur-nearest)?level:nearest,blurLevels[0]);
  document.querySelectorAll('#headerBlurLevels [data-blur]').forEach(label=>{
    label.classList.toggle('is-active',Number(label.dataset.blur)===activeLevel);
  });
}
function toggleTopbarBlur(){
  const enabled = document.getElementById('headerBlurToggle')?.getAttribute('aria-checked') === 'true';
  const range = document.getElementById('headerBlurRange');
  const amount = clampTopbarBlur(range?.value);
  try{ localStorage.setItem(TOPBAR_BLUR_ENABLED_KEY,enabled?'1':'0'); }catch(e){}
  applyTopbarBlur(enabled,amount);
}
function updateTopbarBlurFromRange(persist){
  const enabled = document.getElementById('headerBlurToggle')?.getAttribute('aria-checked') === 'true';
  const amount = clampTopbarBlur(document.getElementById('headerBlurRange')?.value);
  if(persist){
    try{ localStorage.setItem(TOPBAR_BLUR_AMOUNT_KEY,String(amount)); }
    catch(e){ if(typeof window.showToast==='function') window.showToast('模糊度保存失败'); }
  }
  applyTopbarBlur(enabled,amount);
}
const headerBlurRange = document.getElementById('headerBlurRange');
if(headerBlurRange){
  headerBlurRange.addEventListener('input',()=>updateTopbarBlurFromRange(false));
  headerBlurRange.addEventListener('change',()=>updateTopbarBlurFromRange(true));
}
let savedTopbarBlurEnabled = null;
let savedTopbarBlurAmount = 4;
try{
  savedTopbarBlurEnabled = localStorage.getItem(TOPBAR_BLUR_ENABLED_KEY);
  const storedAmount = localStorage.getItem(TOPBAR_BLUR_AMOUNT_KEY);
  if(storedAmount !== null) savedTopbarBlurAmount = clampTopbarBlur(storedAmount);
}catch(e){}
applyTopbarBlur(savedTopbarBlurEnabled === null ? true : savedTopbarBlurEnabled === '1',savedTopbarBlurAmount);

const TOPBAR_PROGRESSIVE_BLUR_KEY = 'qqtool_topbar_progressive_blur';
const TOPBAR_PROGRESSIVE_BLUR_PREVIOUS_KEY = 'qqtool_topbar_progressive_blur_previous';
function applyTopbarProgressiveBlur(enabled){
  document.documentElement.classList.toggle('topbar-progressive-blur',enabled);
  const toggle = document.getElementById('topbarProgressiveBlurToggle');
  const blurToggle = document.getElementById('headerBlurToggle');
  const addressToggle = document.getElementById('addressBarHideToggle');
  if(toggle) toggle.setAttribute('aria-checked',String(enabled));
  if(blurToggle){ blurToggle.disabled=enabled; blurToggle.setAttribute('aria-disabled',String(enabled)); }
  if(addressToggle){ addressToggle.disabled=enabled; addressToggle.setAttribute('aria-disabled',String(enabled)); }
}
function currentTopbarProgressiveCompanionSettings(){
  return {
    topbarBlurEnabled: document.getElementById('headerBlurToggle')?.getAttribute('aria-checked') === 'true',
    addressBarHidden: document.getElementById('addressBarHideToggle')?.getAttribute('aria-checked') === 'true'
  };
}
function enableTopbarProgressiveBlur(){
  const previous = currentTopbarProgressiveCompanionSettings();
  const amount = clampTopbarBlur(document.getElementById('headerBlurRange')?.value ?? savedTopbarBlurAmount);
  try{
    localStorage.setItem(TOPBAR_PROGRESSIVE_BLUR_PREVIOUS_KEY,JSON.stringify(previous));
    localStorage.setItem(TOPBAR_PROGRESSIVE_BLUR_KEY,'1');
    localStorage.setItem(TOPBAR_BLUR_ENABLED_KEY,'0');
    localStorage.setItem(ADDRESS_BAR_HIDE_KEY,'1');
  }catch(e){}
  applyTopbarProgressiveBlur(true);
  applyTopbarBlur(false,amount);
  applyAddressBarHide(true);
}
function disableTopbarProgressiveBlur(){
  let previous = null;
  try{
    const stored = localStorage.getItem(TOPBAR_PROGRESSIVE_BLUR_PREVIOUS_KEY);
    if(stored) previous = JSON.parse(stored);
  }catch(e){}
  if(!previous) previous = {topbarBlurEnabled:true,addressBarHidden:false};
  try{
    localStorage.setItem(TOPBAR_PROGRESSIVE_BLUR_KEY,'0');
    localStorage.setItem(TOPBAR_BLUR_ENABLED_KEY,previous.topbarBlurEnabled?'1':'0');
    localStorage.setItem(ADDRESS_BAR_HIDE_KEY,previous.addressBarHidden?'1':'0');
    localStorage.removeItem(TOPBAR_PROGRESSIVE_BLUR_PREVIOUS_KEY);
  }catch(e){}
  applyTopbarProgressiveBlur(false);
  const amount = clampTopbarBlur(document.getElementById('headerBlurRange')?.value ?? savedTopbarBlurAmount);
  applyTopbarBlur(previous.topbarBlurEnabled === true,amount);
  applyAddressBarHide(previous.addressBarHidden === true);
}
function closeTopbarProgressiveBlurPrompt(){
  const modal = document.getElementById('topbarProgressiveBlurConfirmModal');
  if(!modal || modal.style.display === 'none') return;
  modal.classList.add('closing');
  setTimeout(()=>{ modal.style.display='none'; modal.classList.remove('closing'); },200);
}
function openTopbarProgressiveBlurPrompt(){
  const modal = document.getElementById('topbarProgressiveBlurConfirmModal');
  const toggle = document.getElementById('topbarProgressiveBlurToggle');
  if(toggle) toggle.setAttribute('aria-checked','false');
  if(!modal) return;
  modal.classList.remove('closing');
  modal.style.display='flex';
  requestAnimationFrame(()=>document.getElementById('topbarProgressiveBlurConfirm')?.focus({preventScroll:true}));
}
function toggleTopbarProgressiveBlur(){
  const enabled = document.getElementById('topbarProgressiveBlurToggle')?.getAttribute('aria-checked') === 'true';
  if(enabled) openTopbarProgressiveBlurPrompt();
  else disableTopbarProgressiveBlur();
}
function confirmTopbarProgressiveBlur(){
  closeTopbarProgressiveBlurPrompt();
  enableTopbarProgressiveBlur();
}
function cancelTopbarProgressiveBlur(){
  closeTopbarProgressiveBlurPrompt();
  document.getElementById('topbarProgressiveBlurToggle')?.setAttribute('aria-checked','false');
  requestAnimationFrame(()=>document.getElementById('topbarProgressiveBlurToggle')?.focus({preventScroll:true}));
}
document.getElementById('topbarProgressiveBlurConfirm')?.addEventListener('click',confirmTopbarProgressiveBlur);
document.getElementById('topbarProgressiveBlurCancel')?.addEventListener('click',cancelTopbarProgressiveBlur);
document.addEventListener('keydown',event=>{
  const modal = document.getElementById('topbarProgressiveBlurConfirmModal');
  if(event.key === 'Escape' && modal?.style.display === 'flex'){
    event.preventDefault();
    event.stopPropagation();
    cancelTopbarProgressiveBlur();
  }
});
let topbarProgressiveBlurEnabled = false;
try{ topbarProgressiveBlurEnabled = localStorage.getItem(TOPBAR_PROGRESSIVE_BLUR_KEY) === '1'; }catch(e){}
applyTopbarProgressiveBlur(topbarProgressiveBlurEnabled);
if(topbarProgressiveBlurEnabled){
  try{
    localStorage.setItem(TOPBAR_BLUR_ENABLED_KEY,'0');
    localStorage.setItem(ADDRESS_BAR_HIDE_KEY,'1');
  }catch(e){}
  applyTopbarBlur(false,savedTopbarBlurAmount);
  applyAddressBarHide(true);
}

function syncPersonalDataSettingSwitches(){
  document.querySelectorAll('button.fl-ios-switch[data-setting]').forEach(function(button){
    try{ button.setAttribute('aria-checked',String(localStorage.getItem(button.dataset.setting)==='1')); }
    catch(e){ button.setAttribute('aria-checked','false'); }
  });
}
syncPersonalDataSettingSwitches();
function syncMillisecondsSettingVisibility(){
  const homeClockEnabled = document.getElementById('homeClockToggle')?.getAttribute('aria-checked') === 'true';
  const panel = document.getElementById('millisecondsSettingPanel');
  if(panel){
    panel.classList.toggle('is-open',homeClockEnabled);
    panel.setAttribute('aria-hidden',String(!homeClockEnabled));
    panel.inert = !homeClockEnabled;
  }
}
syncMillisecondsSettingVisibility();

// 全站设置开关：按住时圆点拉长，可拖动；松开时按最终位置切换。
let flActiveSwitch = null;
const flSwitchPointerClicks = new WeakSet();
function flSetSwitch(button, checked){
  if((button.getAttribute('aria-checked') === 'true') === checked) return;
  button.setAttribute('aria-checked', String(checked));
  button.dispatchEvent(new Event('change', {bubbles:true}));
}
function flResetSwitchPress(button){
  button.classList.remove('is-pressing','is-preview-on');
  button.style.removeProperty('--fl-switch-press-x');
}
function flCancelActiveSwitch(){
  if(!flActiveSwitch) return;
  flResetSwitchPress(flActiveSwitch.button);
  flActiveSwitch = null;
}
document.addEventListener('pointerdown', event=>{
  const button = event.target.closest?.('button.fl-ios-switch');
  if(flActiveSwitch && flActiveSwitch.pointerId !== event.pointerId) flCancelActiveSwitch();
  if(!button || flActiveSwitch || (event.pointerType === 'mouse' && event.button !== 0)) return;
  const checked = button.getAttribute('aria-checked') === 'true';
  const travel = button.clientWidth - button.clientHeight - 8;
  const offset = checked ? travel : 0;
  const bounds = button.getBoundingClientRect();
  const grabOffset = event.clientX - (bounds.left + 4 + offset + button.clientHeight/2);
  flActiveSwitch = {button, pointerId:event.pointerId, startX:event.clientX, checked, travel, offset, grabOffset, dragged:false};
  button.style.setProperty('--fl-switch-press-x',flActiveSwitch.offset+'px');
  button.classList.add('is-pressing');
  button.classList.toggle('is-preview-on',checked);
  try{ button.setPointerCapture(event.pointerId); }catch(e){}
});
document.addEventListener('pointermove', event=>{
  const press = flActiveSwitch;
  if(!press || event.pointerId !== press.pointerId) return;
  if(Math.abs(event.clientX - press.startX) > 8) press.dragged = true;
  if(!press.dragged) return;
  const bounds = press.button.getBoundingClientRect();
  press.offset = Math.max(0,Math.min(press.travel,event.clientX - bounds.left - 4 - press.button.clientHeight/2 - press.grabOffset));
  press.button.style.setProperty('--fl-switch-press-x',press.offset+'px');
  press.button.classList.toggle('is-preview-on',event.clientX > press.startX);
});
document.addEventListener('pointerup', event=>{
  const press = flActiveSwitch;
  if(!press || event.pointerId !== press.pointerId) return;
  flActiveSwitch = null;
  flResetSwitchPress(press.button);
  const bounds = press.button.getBoundingClientRect();
  const deltaX = event.clientX - press.startX;
  const dragged = Math.abs(deltaX) > 8;
  if(!dragged && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) return;
  const checked = dragged ? deltaX > 0 : !press.checked;
  flSwitchPointerClicks.add(press.button);
  setTimeout(()=>flSwitchPointerClicks.delete(press.button),0);
  flSetSwitch(press.button,checked);
});
['pointercancel','lostpointercapture'].forEach(type=>document.addEventListener(type,event=>{
  if(!flActiveSwitch || event.pointerId !== flActiveSwitch.pointerId) return;
  flCancelActiveSwitch();
}));
window.addEventListener('blur',flCancelActiveSwitch);
document.addEventListener('visibilitychange',()=>{ if(document.hidden) flCancelActiveSwitch(); });
document.addEventListener('click',event=>{
  const button = event.target.closest?.('button.fl-ios-switch');
  if(!button) return;
  if(flSwitchPointerClicks.has(button)){
    flSwitchPointerClicks.delete(button);
    event.preventDefault();
    return;
  }
  if(event.detail === 0) flSetSwitch(button,button.getAttribute('aria-checked') !== 'true');
});
document.addEventListener('contextmenu',event=>{
  if(event.target.closest?.('button.fl-ios-switch')) event.preventDefault();
});
document.addEventListener('change',event=>{
  if(event.target.id === 'soundToggleBtn') toggleSound();
  else if(event.target.id === 'bgFlowToggleBtn') toggleBgFlow();
  else if(event.target.id === 'headerFavShowToggle') toggleHeaderFavoriteShow();
  else if(event.target.id === 'backParentShowToggle') toggleBackParentShow();
  else if(event.target.id === 'breadcrumbGuardToggle') toggleBreadcrumbGuard();
  else if(event.target.id === 'addressBarHideToggle') toggleAddressBarHide();
  else if(event.target.id === 'cardMaterialToggle') toggleCardMaterial();
  else if(event.target.id === 'cardDescriptionToggle') toggleCardDescriptions();
  else if(event.target.id === 'modalProgressiveBlurDisableToggle') toggleModalProgressiveBlurDisabled();
  else if(event.target.id === 'modalBackdropShakeToggle') toggleModalBackdropShake();
  else if(event.target.id === 'headerBlurToggle') toggleTopbarBlur();
  else if(event.target.id === 'topbarProgressiveBlurToggle') toggleTopbarProgressiveBlur();
  else if(event.target.matches?.('button.fl-ios-switch[data-setting]')){
    try{ localStorage.setItem(event.target.dataset.setting,event.target.getAttribute('aria-checked')==='true'?'1':'0'); }
    catch(e){ if(typeof window.showToast==='function') window.showToast('设置保存失败'); }
    if(event.target.dataset.setting === 'clock_show') syncMillisecondsSettingVisibility();
    if(typeof window.flUpdateHomeClock==='function') window.flUpdateHomeClock();
  }
});

// 顶栏按钮轻拖跟手，松开后回弹；拖动完成时拦截点击，避免误触导航。
const flTopbarDragSelector = '.home-sticky-nav #homeFavoritesBtn, .home-sticky-nav #homeAccountBtn, .sticky-nav .tool-header > button.back-btn';
const flTopbarDragClickSuppress = new WeakMap();
let flActiveTopbarDrag = null;
function flResetTopbarDrag(button,dx=0,dy=0,wasDragged=false,suppressClick=wasDragged){
  if(!button) return;
  button.classList.remove('fl-topbar-button-dragging','fl-topbar-button-long-press');
  if(!wasDragged){
    button.style.removeProperty('--fl-topbar-drag-x');
    button.style.removeProperty('--fl-topbar-drag-y');
    return;
  }
  if(suppressClick) flTopbarDragClickSuppress.set(button,performance.now()+500);
  button.classList.add('fl-topbar-button-returning');
  button.style.setProperty('--fl-topbar-drag-x',dx+'px');
  button.style.setProperty('--fl-topbar-drag-y',dy+'px');
  button.getBoundingClientRect();
  button.style.setProperty('--fl-topbar-drag-x','0px');
  button.style.setProperty('--fl-topbar-drag-y','0px');
  window.setTimeout(()=>{
    button.classList.remove('fl-topbar-button-returning');
    button.style.removeProperty('--fl-topbar-drag-x');
    button.style.removeProperty('--fl-topbar-drag-y');
  },360);
}
document.addEventListener('pointerdown',event=>{
  const button=event.target.closest?.(flTopbarDragSelector);
  if(!button || event.isPrimary===false || (event.pointerType==='mouse' && event.button!==0)) return;
  flTopbarDragClickSuppress.delete(button);
  const drag={button,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,x:0,y:0,moved:false,pressTimer:null};
  flActiveTopbarDrag=drag;
  drag.pressTimer=window.setTimeout(()=>{
    if(flActiveTopbarDrag===drag && !drag.moved) button.classList.add('fl-topbar-button-long-press');
  },360);
  try{button.setPointerCapture(event.pointerId);}catch(e){}
},true);
document.addEventListener('pointermove',event=>{
  const drag=flActiveTopbarDrag;
  if(!drag || event.pointerId!==drag.pointerId) return;
  const rawX=event.clientX-drag.startX,rawY=event.clientY-drag.startY;
  if(!drag.moved && Math.hypot(rawX,rawY)<3) return;
  drag.moved=true;
  if(drag.pressTimer) window.clearTimeout(drag.pressTimer);
  drag.button.classList.remove('fl-topbar-button-long-press');
  drag.x=Math.max(-6,Math.min(6,rawX*.4));
  drag.y=Math.max(-4,Math.min(4,rawY*.4));
  drag.button.classList.add('fl-topbar-button-dragging');
  drag.button.style.setProperty('--fl-topbar-drag-x',drag.x+'px');
  drag.button.style.setProperty('--fl-topbar-drag-y',drag.y+'px');
  event.preventDefault();
},{capture:true,passive:false});
function flFinishTopbarPointer(event){
  const drag=flActiveTopbarDrag;
  if(!drag || event.pointerId!==drag.pointerId) return;
  flActiveTopbarDrag=null;
  if(drag.pressTimer) window.clearTimeout(drag.pressTimer);
  flResetTopbarDrag(drag.button,drag.x,drag.y,drag.moved,event.type==='pointerup'&&drag.moved);
}
document.addEventListener('pointerup',flFinishTopbarPointer,true);
document.addEventListener('pointercancel',flFinishTopbarPointer,true);
window.addEventListener('blur',()=>{
  if(!flActiveTopbarDrag) return;
  const drag=flActiveTopbarDrag;flActiveTopbarDrag=null;
  if(drag.pressTimer) window.clearTimeout(drag.pressTimer);
  flResetTopbarDrag(drag.button,drag.x,drag.y,drag.moved,false);
});
document.addEventListener('click',event=>{
  const button=event.target.closest?.(flTopbarDragSelector);
  const suppressUntil=button ? flTopbarDragClickSuppress.get(button) : null;
  if(!button || !suppressUntil) return;
  flTopbarDragClickSuppress.delete(button);
  if(event.detail===0 || performance.now()>suppressUntil) return;
  event.preventDefault();event.stopImmediatePropagation();
},true);
const modalMask = document.getElementById('modalMask');
const openModalBtn = document.getElementById('openModalBtn');
const modalDismissBtn = modalMask.querySelector('.personal-modal-dismiss');
const modalConfirmBtn = modalMask.querySelector('#personalModalConfirm');
const personalModalScroll = modalMask.querySelector('.personal-modal-scroll');
const personalModalHeader = modalMask.querySelector('.personal-modal-header');
const modalBackdropShakeAnimations = new WeakMap();
function flHandleModalBackdropClick(event){
  const overlay = event.target;
  if(!(overlay instanceof Element) || !overlay.matches('.modal-mask,.bp-modal-overlay,.ty-result-overlay')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if(document.documentElement.classList.contains('modal-backdrop-shake-disabled') || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const panel = overlay.querySelector(':scope > .personal-modal-box,:scope > .modal-box,:scope > .pin-rule-card,:scope > .bp-modal-content,:scope > .ty-result-card')
    || overlay.querySelector('.personal-modal-box,.modal-box,.pin-rule-card,.bp-modal-content,.ty-result-card')
    || overlay.firstElementChild;
  if(!panel?.animate) return;
  modalBackdropShakeAnimations.get(panel)?.cancel();
  const animation = panel.animate([
    {translate:'0 0'},
    {translate:'-8px 0'},
    {translate:'8px 0'},
    {translate:'-5px 0'},
    {translate:'5px 0'},
    {translate:'-2px 0'},
    {translate:'0 0'}
  ],{duration:380,easing:'cubic-bezier(.36,.07,.19,.97)'});
  modalBackdropShakeAnimations.set(panel,animation);
}
window.addEventListener('click',flHandleModalBackdropClick,true);
const updatePersonalModalHeader = ()=>{
  personalModalHeader.classList.toggle('is-scrolled', personalModalScroll.scrollTop > 2);
};
personalModalScroll.addEventListener('scroll', updatePersonalModalHeader, {passive:true});
openModalBtn.onclick = ()=>{ updatePersonalModalHeader(); modalMask.classList.remove('closing'); modalMask.style.display='flex'; document.body.style.overflow='hidden'; };
const closePersonalModal = ()=>{
  if(modalMask.classList.contains('closing')) return;
  closeModalAnimated(modalMask);
};
if(modalDismissBtn) modalDismissBtn.onclick = closePersonalModal;
if(modalConfirmBtn) modalConfirmBtn.onclick = closePersonalModal;

