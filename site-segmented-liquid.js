(function(){
  function prepare(control){
    if(control.id==='homeCategoryDock'||!control.querySelector('.fl-segmented-thumb'))return;
    control.classList.add('fl-liquid-segmented');
    control.querySelectorAll('.fl-segmented-option').forEach(function(option){
      if(option.querySelector('.fl-liquid-label'))return;
      const label=document.createElement('span');label.className='fl-liquid-label';
      while(option.firstChild)label.appendChild(option.firstChild);
      option.appendChild(label);
    });
  }
  function scan(node){
    if(node.nodeType!==1)return;
    if(node.matches('.fl-segmented-control'))prepare(node);
    node.querySelectorAll('.fl-segmented-control').forEach(prepare);
  }
  scan(document.documentElement);
  new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(scan);});}).observe(document.body,{childList:true,subtree:true});
  let current=null,pointer=null,lastX=0,timer=null;
  function reset(){if(timer!==null){clearTimeout(timer);timer=null;}if(current)current.style.removeProperty('--liquid-sway-x');}
  function finish(event){if(!current||event.pointerId!==pointer)return;reset();current.classList.remove('is-liquid-pressed');current=null;pointer=null;}
  document.addEventListener('pointerdown',function(event){
    const control=event.target.closest?.('.fl-liquid-segmented');
    if(!control||!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0)||current)return;
    current=control;pointer=event.pointerId;lastX=event.clientX;
    control.classList.add('is-liquid-pointer','is-liquid-pressed');
  },true);
  document.addEventListener('pointermove',function(event){
    if(!current||event.pointerId!==pointer)return;
    const delta=event.clientX-lastX;lastX=event.clientX;if(Math.abs(delta)<.5)return;
    current.style.setProperty('--liquid-sway-x',(Math.max(-1,Math.min(1,delta/8))*3).toFixed(2)+'px');
    if(timer!==null)clearTimeout(timer);timer=setTimeout(reset,140);
  },true);
  document.addEventListener('pointerup',finish,true);
  document.addEventListener('pointercancel',finish,true);
  document.addEventListener('lostpointercapture',finish,true);
  document.addEventListener('keydown',function(event){event.target.closest?.('.fl-liquid-segmented')?.classList.remove('is-liquid-pointer');},true);
})();
