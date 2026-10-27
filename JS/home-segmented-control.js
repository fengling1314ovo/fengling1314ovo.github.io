
/* 全站共用的分段玻璃滑块。用 fl-segmented-control / fl-segmented-thumb / fl-segmented-option 组合，并调用 window.flInitSegmentedControl 初始化拖动。 */
window.flInitSegmentedControl=function(control,settings){
  if(!(control instanceof Element))return null;
  const thumb=control.querySelector('.fl-segmented-thumb');
  if(!thumb)return null;
  const controller=control.__flSegmentedControl||(control.__flSegmentedControl={settings:null,state:null});
  controller.settings=settings||controller.settings||{};
  const getOptions=()=>Array.from(control.querySelectorAll('.fl-segmented-option'));
  const getValue=option=>controller.settings.getOptionValue
    ?controller.settings.getOptionValue(option)
    :(option.dataset.value||option.dataset.type||option.id||'');
  const measure=()=>{
    const options=getOptions();
    if(!options.length||!control.offsetWidth||!control.offsetHeight)return null;
    const controlRect=control.getBoundingClientRect();
    const firstRect=options[0].getBoundingClientRect();
    const scaleX=controlRect.width/control.offsetWidth||1;
    const scaleY=controlRect.height/control.offsetHeight||1;
    thumb.style.left=((firstRect.left-controlRect.left)/scaleX-control.clientLeft)+'px';
    thumb.style.top=((firstRect.top-controlRect.top)/scaleY-control.clientTop)+'px';
    thumb.style.width=(firstRect.width/scaleX)+'px';
    thumb.style.height=(firstRect.height/scaleY)+'px';
    return {options,firstRect,scaleX,scaleY,offsets:options.map(option=>(option.getBoundingClientRect().left-firstRect.left)/scaleX)};
  };
  const nearestOption=(offset,metrics)=>{
    if(!metrics||!metrics.options.length)return null;
    let nearest=metrics.options[0],distance=Infinity;
    metrics.options.forEach((option,index)=>{
      const next=Math.abs(metrics.offsets[index]-offset);
      if(next<distance){distance=next;nearest=option;}
    });
    return nearest;
  };
  const setActive=option=>{
    getOptions().forEach(item=>{
      const active=item===option;
      item.classList.toggle('is-active',active);
      item.classList.toggle('active',active);
      item.setAttribute('aria-pressed',String(active));
    });
  };
  const previewOption=option=>{
    if(!option)return;
    setActive(option);
    const onPreview=controller.settings.onPreview;
    if(typeof onPreview==='function')onPreview(getValue(option),option);
  };
  const offsetOfValue=(value,metrics)=>{
    const options=metrics.options;
    let index=options.findIndex(option=>getValue(option)===value);
    if(index<0)index=Math.max(0,options.findIndex(option=>option.classList.contains('is-active')||option.classList.contains('active')));
    return metrics.offsets[index]||0;
  };
  controller.sync=value=>{
    const metrics=measure();
    if(!metrics)return;
    const option=metrics.options.find(item=>getValue(item)===value)||nearestOption(offsetOfValue(value,metrics),metrics);
    if(!option)return;
    setActive(option);
    thumb.style.translate=(metrics.offsets[metrics.options.indexOf(option)]||0)+'px 0';
  };
  controller.preview=value=>{
    const metrics=measure();
    if(!metrics)return;
    const option=metrics.options.find(item=>getValue(item)===value);
    if(!option)return;
    const offset=metrics.offsets[metrics.options.indexOf(option)]||0;
    thumb.style.translate=offset+'px 0';
    previewOption(option);
  };
  control.flSegmentedSync=value=>controller.sync(value);
  control.flSegmentedPreview=value=>controller.preview(value);
  const initialValue=typeof controller.settings.getValue==='function'?controller.settings.getValue():null;
  if(initialValue!==null&&initialValue!==undefined)controller.sync(initialValue);
  if(controller.ready)return control;
  controller.ready=true;
  control.addEventListener('click',event=>{
    if(control.dataset.flSegmentedSuppressClick==='true'){
      delete control.dataset.flSegmentedSuppressClick;
      clearTimeout(controller.suppressClickTimer);
      event.preventDefault();event.stopImmediatePropagation();
      return;
    }
    if(controller.settings.handleClick!==true)return;
    const option=event.target.closest&&event.target.closest('.fl-segmented-option');
    if(!option||!control.contains(option))return;
    event.preventDefault();event.stopImmediatePropagation();
    const metrics=measure();
    const index=metrics?metrics.options.indexOf(option):-1;
    if(index>=0)thumb.style.translate=(metrics.offsets[index]||0)+'px 0';
    previewOption(option);
    const onChange=controller.settings.onChange;
    if(typeof onChange==='function')onChange(getValue(option),option);
  },true);
  control.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||(event.pointerType==='mouse'&&event.button!==0)||controller.state)return;
    const metrics=measure();
    if(!metrics||metrics.options.length<2)return;
    const pressed=event.target.closest&&event.target.closest('.fl-segmented-option');
    const currentTranslate=getComputedStyle(thumb).translate;
    const parsedOffset=parseFloat(currentTranslate);
    const currentOffset=Number.isFinite(parsedOffset)?parsedOffset:offsetOfValue(controller.settings.getValue?.(),metrics);
    const thumbRect=thumb.getBoundingClientRect();
    const onThumb=event.clientX>=thumbRect.left&&event.clientX<=thumbRect.right&&event.clientY>=thumbRect.top&&event.clientY<=thumbRect.bottom;
    const firstCenter=metrics.firstRect.left+metrics.firstRect.width/2;
    const targetOffset=Math.max(0,Math.min(metrics.offsets.at(-1),(event.clientX-firstCenter)/metrics.scaleX));
    const startOffset=onThumb?currentOffset:targetOffset;
    const state={pointerId:event.pointerId,startX:event.clientX,startOffset,offset:startOffset,scaleX:metrics.scaleX,didDrag:false,pressedOption:pressed&&control.contains(pressed)?pressed:null};
    controller.state=state;
    control.classList.add('is-dragging');
    if(!onThumb){
      thumb.style.translate=startOffset+'px 0';
      previewOption(nearestOption(startOffset,metrics));
    }
    event.preventDefault();
    try{control.setPointerCapture(event.pointerId);}catch(_error){}
  });
  control.addEventListener('pointermove',event=>{
    const state=controller.state;
    if(!state||event.pointerId!==state.pointerId)return;
    const delta=(event.clientX-state.startX)/state.scaleX;
    if(!state.didDrag&&Math.abs(delta)<3)return;
    state.didDrag=true;
    control.classList.add('is-moving');
    const metrics=measure();
    if(!metrics)return;
    state.offset=Math.max(0,Math.min(metrics.offsets.at(-1),state.startOffset+delta));
    thumb.style.translate=state.offset+'px 0';
    previewOption(nearestOption(state.offset,metrics));
    event.preventDefault();
  });
  const finish=(event,cancelled)=>{
    const state=controller.state;
    if(!state||event.pointerId!==state.pointerId)return;
    const delta=(event.clientX-state.startX)/state.scaleX;
    if(!cancelled&&!state.didDrag&&Math.abs(delta)>=3)state.didDrag=true;
    if(!cancelled&&state.didDrag){
      const metrics=measure();
      if(metrics)state.offset=Math.max(0,Math.min(metrics.offsets.at(-1),state.startOffset+delta));
    }
    if(state.didDrag&&!cancelled){
      const metrics=measure();
      const option=nearestOption(state.offset,metrics);
      if(option){
        const index=metrics.options.indexOf(option);
        thumb.style.translate=(metrics.offsets[index]||0)+'px 0';
        previewOption(option);
        control.dataset.flSegmentedSuppressClick='true';
        clearTimeout(controller.suppressClickTimer);
        controller.suppressClickTimer=setTimeout(()=>{delete control.dataset.flSegmentedSuppressClick;},500);
        const onChange=controller.settings.onChange;
        if(typeof onChange==='function')onChange(getValue(option),option);
      }
    }else if(cancelled){
      const value=typeof controller.settings.getValue==='function'?controller.settings.getValue():null;
      if(value!==null&&value!==undefined)controller.sync(value);
    }else{
      const metrics=measure();
      const option=state.pressedOption||nearestOption(state.offset,metrics);
      if(option){
        const index=metrics?metrics.options.indexOf(option):-1;
        if(index>=0)thumb.style.translate=(metrics.offsets[index]||0)+'px 0';
        previewOption(option);
        control.dataset.flSegmentedSuppressClick='true';
        clearTimeout(controller.suppressClickTimer);
        controller.suppressClickTimer=setTimeout(()=>{delete control.dataset.flSegmentedSuppressClick;},500);
        const onChange=controller.settings.onChange;
        if(typeof onChange==='function')onChange(getValue(option),option);
        option.focus({preventScroll:true});
      }
    }
    controller.state=null;
    control.classList.remove('is-dragging','is-moving');
  };
  control.addEventListener('pointerup',event=>finish(event,false));
  control.addEventListener('pointercancel',event=>finish(event,true));
  control.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    const options=getOptions();
    const current=options.indexOf(event.target.closest&&event.target.closest('.fl-segmented-option'));
    if(current<0)return;
    const index=event.key==='Home'?0:event.key==='End'?options.length-1:Math.max(0,Math.min(options.length-1,current+(event.key==='ArrowRight'?1:-1)));
    event.preventDefault();
    const option=options[index];
    const metrics=measure();
    if(metrics)thumb.style.translate=(metrics.offsets[index]||0)+'px 0';
    previewOption(option);
    const onChange=controller.settings.onChange;
    if(typeof onChange==='function')onChange(getValue(option),option);
    option.focus({preventScroll:true});
  });
  if(typeof ResizeObserver==='function'){
    controller.resizeObserver=new ResizeObserver(()=>{
      if(controller.state)return;
      const value=typeof controller.settings.getValue==='function'?controller.settings.getValue():null;
      if(value!==null&&value!==undefined)controller.sync(value);
    });
    controller.resizeObserver.observe(control);
  }
  return control;
};
