// 所有可调滑块共用音频转换页的轨道样式和填充比例。
(function(){
  'use strict';

  function flUpdateRangeControl(input){
    if(!input?.matches?.('input[type="range"]')) return;
    const minimum = input.hasAttribute('min') ? Number(input.min) : 0;
    const maximum = input.hasAttribute('max') ? Number(input.max) : 100;
    const value = Number(input.value);
    const percent = Number.isFinite(minimum) && Number.isFinite(maximum) && maximum > minimum
      ? Math.max(0,Math.min(100,(value-minimum)/(maximum-minimum)*100))
      : 0;
    input.style.setProperty('--fl-range-fill',percent+'%');
  }

  function flInitRangeControls(root = document){
    if(root.matches?.('input[type="range"]')) flUpdateRangeControl(root);
    root.querySelectorAll?.('input[type="range"]').forEach(flUpdateRangeControl);
  }

  const flRangeEdgeFrames = new WeakMap();
  const flRangeEdgeReturnTimers = new WeakMap();
  const flRangePointerDrags = new Map();
  function flClearRangeEdge(input){
    flClearRangeEdgeReturn(input);
    input.style.removeProperty('--fl-range-thumb-shift');
  }
  function flClearRangeEdgeReturn(input){
    const timer = flRangeEdgeReturnTimers.get(input);
    if(timer) clearTimeout(timer);
    flRangeEdgeReturnTimers.delete(input);
    input.classList.remove('fl-range-edge-return');
    input.style.removeProperty('--fl-range-edge-return-start');
    input.style.removeProperty('--fl-range-edge-return-peak');
    input.style.removeProperty('--fl-range-edge-return-rebound');
  }
  function flStartRangeEdgeReturn(input,wasDragged){
    const shift = parseFloat(input.style.getPropertyValue('--fl-range-thumb-shift')) || 0;
    const minimum = input.hasAttribute('min') ? Number(input.min) : 0;
    const maximum = input.hasAttribute('max') ? Number(input.max) : 100;
    const value = Number(input.value);
    const direction = value >= maximum - .000001 ? 1 : value <= minimum + .000001 ? -1 : 0;
    input.style.removeProperty('--fl-range-thumb-shift');
    input.classList.remove('fl-range-edge-left','fl-range-edge-right');
    if(!direction || (Math.abs(shift)<.5 && !wasDragged)) return false;
    flClearRangeEdgeReturn(input);
    const startShift = Math.abs(shift)<.5 ? 0 : shift;
    const peakShift = Math.abs(shift)<.5 ? direction*9 : startShift+direction*2;
    input.style.setProperty('--fl-range-edge-return-start',startShift.toFixed(2)+'px');
    input.style.setProperty('--fl-range-edge-return-peak',peakShift.toFixed(2)+'px');
    input.style.setProperty('--fl-range-edge-return-rebound',(-direction*1.5)+'px');
    input.classList.add('fl-range-edge-return');
    flRangeEdgeReturnTimers.set(input,setTimeout(function(){
      flClearRangeEdgeReturn(input);
    },460));
    return true;
  }
  function flUpdateRangeEdge(input,state){
    if(!input.isConnected || !flRangePointerDrags.has(state.pointerId)) return;
    const minimum = input.hasAttribute('min') ? Number(input.min) : 0;
    const maximum = input.hasAttribute('max') ? Number(input.max) : 100;
    const value = Number(input.value);
    if(!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum <= minimum || input.disabled){
      flClearRangeEdge(input);
      return;
    }
    let side = '';
    let overflow = 0;
    const endpointTolerance = .000001;
    const thumbCenter = state.clientX-state.grabOffset;
    if(value <= minimum + endpointTolerance && thumbCenter < state.startX){
      side = 'left';
      overflow = state.startX - thumbCenter;
    }else if(value >= maximum - endpointTolerance && thumbCenter > state.endX){
      side = 'right';
      overflow = thumbCenter - state.endX;
    }
    if(!side || overflow <= 0){
      input.style.removeProperty('--fl-range-thumb-shift');
      return;
    }
    // 阻尼拉伸：手指越过端点时，滑块最多多移 12px，松开后带弹性回位。
    const extension = Math.min(12,overflow*.52);
    const signedExtension = side === 'right' ? extension : -extension;
    input.style.setProperty('--fl-range-thumb-shift',signedExtension.toFixed(2)+'px');
  }
  function flScheduleRangeEdge(input,state){
    const previous = flRangeEdgeFrames.get(input);
    if(previous !== undefined) cancelAnimationFrame(previous);
    flRangeEdgeFrames.set(input,requestAnimationFrame(function(){
      flRangeEdgeFrames.delete(input);
      flUpdateRangeEdge(input,state);
    }));
  }
  function flIsRangeThumbHit(input,clientX){
    const rect=input.getBoundingClientRect();
    const style=getComputedStyle(input);
    const insetStart=(parseFloat(style.borderLeftWidth)||0)+(parseFloat(style.paddingLeft)||0);
    const insetEnd=(parseFloat(style.borderRightWidth)||0)+(parseFloat(style.paddingRight)||0);
    const minimum=input.hasAttribute('min')?Number(input.min):0;
    const maximum=input.hasAttribute('max')?Number(input.max):100;
    const value=Number(input.value);
    const ratio=Number.isFinite(minimum)&&Number.isFinite(maximum)&&maximum>minimum
      ?Math.max(0,Math.min(1,(value-minimum)/(maximum-minimum))):0;
    const startX=rect.left+insetStart+22;
    const endX=rect.right-insetEnd-22;
    const thumbCenter=startX+Math.max(0,endX-startX)*ratio;
    return Math.abs(clientX-thumbCenter)<=25;
  }
  function flStartRangeTouch(event){
    const input=event.target;
    const touch=event.changedTouches?.[0];
    if(!input?.matches?.('input[type="range"]')||input.disabled||!touch) return;
    if(!flIsRangeThumbHit(input,touch.clientX)&&event.cancelable) event.preventDefault();
  }
  function flStartRangePointer(event){
    const input = event.target;
    if(!input?.matches?.('input[type="range"]') || input.disabled || event.button > 0) return;
    flClearRangeEdge(input);
    const rect = input.getBoundingClientRect();
    const style = getComputedStyle(input);
    const insetStart = (parseFloat(style.borderLeftWidth) || 0) + (parseFloat(style.paddingLeft) || 0);
    const insetEnd = (parseFloat(style.borderRightWidth) || 0) + (parseFloat(style.paddingRight) || 0);
    const minimum = input.hasAttribute('min') ? Number(input.min) : 0;
    const maximum = input.hasAttribute('max') ? Number(input.max) : 100;
    const ratio = Number.isFinite(minimum) && Number.isFinite(maximum) && maximum > minimum
      ? Math.max(0,Math.min(1,(Number(input.value)-minimum)/(maximum-minimum)))
      : 0;
    const trackStartX = rect.left+insetStart;
    const trackEndX = rect.right-insetEnd;
    const thumbHalfWidth = 22;
    const thumbTravel = Math.max(0,trackEndX-trackStartX-thumbHalfWidth*2);
    const startX = trackStartX+thumbHalfWidth;
    const endX = trackEndX-thumbHalfWidth;
    const thumbCenter = startX+thumbTravel*ratio;
    const pointerOffset = Math.abs(event.clientX-thumbCenter)<=thumbHalfWidth+3 ? event.clientX-thumbCenter : 0;
    const isThumbPress = Math.abs(event.clientX-thumbCenter)<=thumbHalfWidth+3;
    if(!isThumbPress){
      // 轨道空白处只负责显示进度，不响应点击跳转；需从白色滑块本体开始拖动。
      event.preventDefault();
      return;
    }
    const state = {
      input,
      pointerId:event.pointerId,
      startX,
      endX,
      clientX:event.clientX,
      startClientX:event.clientX,
      grabOffset:pointerOffset
    };
    if(state.endX <= state.startX) return;
    flRangePointerDrags.set(event.pointerId,state);
  }
  function flMoveRangePointer(event){
    const state = flRangePointerDrags.get(event.pointerId);
    if(!state) return;
    state.clientX = event.clientX;
    flScheduleRangeEdge(state.input,state);
  }
  function flEndRangePointer(event){
    const state = flRangePointerDrags.get(event.pointerId);
    if(!state) return;
    state.clientX = event.clientX;
    const frame = flRangeEdgeFrames.get(state.input);
    if(frame !== undefined) cancelAnimationFrame(frame);
    flRangeEdgeFrames.delete(state.input);
    flUpdateRangeEdge(state.input,state);
    flRangePointerDrags.delete(event.pointerId);
    flStartRangeEdgeReturn(state.input,Math.abs(state.clientX-state.startClientX)>2);
  }
  window.flUpdateRangeControl = flUpdateRangeControl;
  window.flInitRangeControls = flInitRangeControls;
  document.addEventListener('input',function(event){
    flUpdateRangeControl(event.target);
  },true);
  document.addEventListener('change',function(event){
    const input = event.target;
    if(!input?.matches?.('input[type="range"]')) return;
    const isReturningFromEdge = input.classList.contains('fl-range-edge-return');
    if(!isReturningFromEdge) flClearRangeEdge(input);
    flUpdateRangeControl(input);
  });
  document.addEventListener('touchstart',flStartRangeTouch,{capture:true,passive:false});
  document.addEventListener('pointerdown',flStartRangePointer,true);
  document.addEventListener('pointermove',flMoveRangePointer,true);
  document.addEventListener('pointerup',flEndRangePointer,true);
  document.addEventListener('pointercancel',flEndRangePointer,true);
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',function(){ flInitRangeControls(); },{once:true});
  }else{
    flInitRangeControls();
  }
})();
