// ==================== 背景流动 ====================
let bgFlowEnabled = false;
let bgFlowSpeed = 2;
let bgFlowTime = 0;
let bgFlowRafId = null;
let bgFlowSnapRafId = null;
const BG_FLOW_SPEED_MAP = [0, 0.0006, 0.0012, 0.002, 0.0035, 0.0055];
function getBgFlowRate(speed){
  const lower = Math.floor(speed);
  const upper = Math.min(5, lower + 1);
  const amount = speed - lower;
  return BG_FLOW_SPEED_MAP[lower] + (BG_FLOW_SPEED_MAP[upper] - BG_FLOW_SPEED_MAP[lower]) * amount;
}
function getCurrentThemeColors(){
  const saved = localStorage.getItem("qqtool_theme");
  if(saved){ try{ const t = JSON.parse(saved); return [t.p1, t.p2]; }catch(e){} }
  return ['#6366f1', '#818cf8'];
}
function applyBgFlowFrame(){
  const [c1, c2] = getCurrentThemeColors();
  const t = bgFlowTime;
  const sp = getBgFlowRate(bgFlowSpeed);
  // 更大的流动范围
  const x1 = 15 + Math.sin(t * sp) * 32;
  const y1 = 15 + Math.cos(t * sp * 0.7) * 22;
  const x2 = 85 + Math.cos(t * sp * 0.8) * 22;
  const y2 = 85 + Math.sin(t * sp * 0.9) * 30;
  const x3 = 50 + Math.sin(t * sp * 0.6) * 38;
  const y3 = 100 + Math.cos(t * sp * 0.5) * 20;
  // 颜色深浅随时间呼吸变化
  const a1 = 0.16 + Math.sin(t * sp * 0.5) * 0.10;
  const a2 = 0.14 + Math.cos(t * sp * 0.6) * 0.09;
  const a3 = 0.08 + Math.sin(t * sp * 0.4) * 0.06;
  const bg = 'radial-gradient(circle at '+x1+'% '+y1+'%,' + hexToRgba(c1, Math.max(0.02, a1)) + ',transparent 35%),' +
             'radial-gradient(circle at '+x2+'% '+y2+'%,' + hexToRgba(c2, Math.max(0.02, a2)) + ',transparent 35%),' +
             'radial-gradient(circle at '+x3+'% '+y3+'%,' + hexToRgba(c1, Math.max(0.01, a3)) + ',transparent 50%),' +
             'linear-gradient(160deg,#f8faff 0%,#eef1ff 50%,#eaf6ff 100%)';
  bodyEl.style.background = bg;
  bodyEl.style.backgroundAttachment = 'fixed';
}
function bgFlowLoop(){
  bgFlowTime += 16;
  applyBgFlowFrame();
  bgFlowRafId = requestAnimationFrame(bgFlowLoop);
}
function startBgFlow(){ if(bgFlowRafId) return; bgFlowTime = 0; bgFlowLoop(); }
function stopBgFlow(){
  if(bgFlowRafId){ cancelAnimationFrame(bgFlowRafId); bgFlowRafId = null; }
  const [c1, c2] = getCurrentThemeColors();
  setPrimary(c1, c2);
}
function toggleBgFlow(){
  const btn = document.getElementById('bgFlowToggleBtn');
  bgFlowEnabled = btn ? btn.getAttribute('aria-checked') === 'true' : !bgFlowEnabled;
  const panel = document.getElementById('bgFlowSpeedWrap');
  if(panel){
    panel.classList.toggle('is-open',bgFlowEnabled);
    panel.setAttribute('aria-hidden',String(!bgFlowEnabled));
    panel.inert = !bgFlowEnabled;
  }
  localStorage.setItem('qqtool_bgflow', bgFlowEnabled ? '1' : '0');
  if(bgFlowEnabled){ startBgFlow(); } else { stopBgFlow(); }
}
function updateBgFlowSpeedLabel(speed){
  const selectedSpeed = Math.round(Number(speed));
  document.querySelectorAll('.bg-flow-speed-labels [data-speed]').forEach(label=>{
    label.classList.toggle('is-active',Number(label.dataset.speed) === selectedSpeed);
  });
}
function setBgFlowSpeed(speed, snapToLevel = false, preserveThumbPosition = false){
  const rawSpeed = Number(speed);
  const clampedSpeed = Math.max(1,Math.min(5,Number.isFinite(rawSpeed) ? rawSpeed : 1));
  const nextSpeed = snapToLevel ? Math.round(clampedSpeed) : clampedSpeed;
  bgFlowSpeed = nextSpeed;
  const range = document.getElementById('bgFlowSpeedRange');
  if(range){
    if(snapToLevel && !preserveThumbPosition) range.value = String(nextSpeed);
    range.setAttribute('aria-valuetext',(Math.round(nextSpeed * 100) / 100)+'倍');
    if(!preserveThumbPosition) window.flUpdateRangeControl?.(range);
  }
  updateBgFlowSpeedLabel(nextSpeed);
  if(snapToLevel) localStorage.setItem('qqtool_bgflow_speed',String(nextSpeed));
}
function cancelBgFlowSpeedSnap(range=document.getElementById('bgFlowSpeedRange')){
  if(bgFlowSnapRafId !== null){
    cancelAnimationFrame(bgFlowSnapRafId);
    bgFlowSnapRafId = null;
  }
  if(range) delete range.dataset.flSnapAnimating;
}
function animateBgFlowSpeedSnap(speed){
  const range = document.getElementById('bgFlowSpeedRange');
  const rawSpeed = Number(speed);
  const start = Math.max(1,Math.min(5,Number.isFinite(rawSpeed) ? rawSpeed : 1));
  const target = Math.round(start);
  if(!range){ setBgFlowSpeed(target,true); return; }
  cancelBgFlowSpeedSnap(range);
  if(Math.abs(target-start) < 0.015){
    setBgFlowSpeed(target,true);
    return;
  }
  const startTime = performance.now();
  const duration = 280;
  range.dataset.flSnapAnimating = 'true';
  // 松手时立即应用最近档位，之后只动画滑块本身。
  setBgFlowSpeed(target,true,true);
  function animateFrame(now){
    const progress = Math.min(1,(now-startTime)/duration);
    const eased = progress*progress*(3-2*progress);
    range.value = String(start+(target-start)*eased);
    window.flUpdateRangeControl?.(range);
    if(progress < 1){
      bgFlowSnapRafId = requestAnimationFrame(animateFrame);
      return;
    }
    bgFlowSnapRafId = null;
    delete range.dataset.flSnapAnimating;
    range.value = String(target);
    window.flUpdateRangeControl?.(range);
  }
  bgFlowSnapRafId = requestAnimationFrame(animateFrame);
}
// 恢复背景流动设置
const _savedBgFlow = localStorage.getItem('qqtool_bgflow');
const _savedBgFlowSpeed = localStorage.getItem('qqtool_bgflow_speed');
const _parsedBgFlowSpeed = Number(_savedBgFlowSpeed);
if(Number.isFinite(_parsedBgFlowSpeed) && _parsedBgFlowSpeed >= 1 && _parsedBgFlowSpeed <= 5) bgFlowSpeed = Math.round(_parsedBgFlowSpeed);
const _bgFlowRange = document.getElementById('bgFlowSpeedRange');
if(_bgFlowRange){
  _bgFlowRange.step = '0.01';
  _bgFlowRange.addEventListener('pointerdown',()=>cancelBgFlowSpeedSnap(_bgFlowRange));
  _bgFlowRange.addEventListener('input',event=>{
    cancelBgFlowSpeedSnap(event.currentTarget);
    updateBgFlowSpeedLabel(event.currentTarget.value);
  });
  _bgFlowRange.addEventListener('change',event=>animateBgFlowSpeedSnap(event.currentTarget.value));
}
setBgFlowSpeed(bgFlowSpeed,true);
// 首次进入默认开启背景流动
const _shouldEnableBgFlow = (_savedBgFlow === null) ? true : (_savedBgFlow === '1');
const _bgFlowPanel = document.getElementById('bgFlowSpeedWrap');
if(_bgFlowPanel){
  _bgFlowPanel.classList.toggle('is-open',_shouldEnableBgFlow);
  _bgFlowPanel.setAttribute('aria-hidden',String(!_shouldEnableBgFlow));
  _bgFlowPanel.inert = !_shouldEnableBgFlow;
}
if(_shouldEnableBgFlow){
  bgFlowEnabled = true;
  if(_savedBgFlow === null){ localStorage.setItem('qqtool_bgflow','1'); }
  const _btn = document.getElementById('bgFlowToggleBtn');
  if(_btn) _btn.setAttribute('aria-checked','true');
  setTimeout(startBgFlow, 600);
}

