window.flSetDockVisible=(function(){
  const timers=new WeakMap();
  return function(dock,visible){
    const previous=timers.get(dock);
    if(visible){
      if(previous!==undefined){clearTimeout(previous);timers.delete(dock);}
      dock.classList.remove('is-exiting');dock.inert=false;dock.hidden=false;
      return;
    }
    if(dock.hidden||previous!==undefined)return;
    dock.inert=true;
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){dock.hidden=true;return;}
    dock.classList.add('is-exiting');
    const timer=setTimeout(function(){dock.hidden=true;dock.classList.remove('is-exiting');timers.delete(dock);},320);
    timers.set(dock,timer);
  };
})();
(function(){
  const control=document.getElementById('homeCategoryDock');
  const home=document.querySelector('.page-home');
  const grid=document.querySelector('.page-home > .home-buttons');
  const dock=control&&control.closest('.home-category-dock');
  if(!control||!home||!grid||!dock||typeof window.flInitSegmentedControl!=='function')return;
  function syncVisibility(){
    const visible=getComputedStyle(home).display!=='none';
    window.flSetDockVisible(dock,visible);
    if(visible)requestAnimationFrame(function(){control.flSegmentedSync?.(control.querySelector('.is-active')?.dataset.value||'all');});
  }
  new MutationObserver(syncVisibility).observe(home,{attributes:true,attributeFilter:['style','class']});
  syncVisibility();
  dock.addEventListener('pointerdown',function(){dock.classList.add('is-pointer');},{capture:true});
  dock.addEventListener('keydown',function(){dock.classList.remove('is-pointer');},{capture:true});
  let swayPointer=null, swayLastX=0, swayTimer=null;
  function resetSway(){
    if(swayTimer!==null){clearTimeout(swayTimer);swayTimer=null;}
    control.style.removeProperty('--dock-sway-x');
  }
  control.addEventListener('pointerdown',function(event){
    if(!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0))return;
    swayPointer=event.pointerId;swayLastX=event.clientX;resetSway();
  });
  control.addEventListener('pointermove',function(event){
    if(event.pointerId!==swayPointer||!control.classList.contains('is-dragging'))return;
    const delta=event.clientX-swayLastX;swayLastX=event.clientX;
    if(Math.abs(delta)<.5)return;
    const strength=Math.max(-1,Math.min(1,delta/8));
    control.style.setProperty('--dock-sway-x',(strength*3).toFixed(2)+'px');
    if(swayTimer!==null)clearTimeout(swayTimer);
    swayTimer=setTimeout(resetSway,140);
  });
  function stopSway(event){if(event.pointerId!==swayPointer)return;swayPointer=null;resetSway();}
  control.addEventListener('pointerup',stopSway);
  control.addEventListener('pointercancel',stopSway);
  control.addEventListener('lostpointercapture',stopSway);
  const network=new Set(['currency','iplookup','dnsquery','domaincheck','weather','translate','sitecheck','oilprice','videoparse','imghost','qq','qqgroup']);
  const text=new Set(['aes','textutil','random','base64','passwordPage','morsePage','numgen','pwcheck','caesarPage','hexconvert','uuidgen','jsonfmt','timestamp','reverseTextPage']);
  function filter(category){
    grid.querySelectorAll('.home-btn').forEach(function(card){
      const match=(card.getAttribute('onclick')||'').match(/openPage\(['"]([^'"]+)['"]\)/);
      const route=match&&match[1];
      const group=network.has(route)?'network':text.has(route)?'text':'life';
      card.style.display=category==='all'||category===group?'':'none';
    });
  }
  window.flInitSegmentedControl(control,{
    getValue:function(){return control.querySelector('.is-active')?.dataset.value||'all';},
    getOptionValue:function(button){return button.dataset.value;},
    handleClick:true,
    onChange:filter
  });
  window.addEventListener('fl:tool-page-enter',function(event){if(event.detail&&event.detail.name==='home')control.flSegmentedSync?.(control.querySelector('.is-active')?.dataset.value||'all');});
})();
