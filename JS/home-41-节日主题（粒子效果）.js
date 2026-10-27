// ==================== 节日主题（粒子效果） ====================
let festivalCanvas=null;
let festivalCtx=null;
let festivalParticles=[];
let festivalAnimId=null;
const festivalTypes=['snow','sakura','coin','love'];
const savedFestival=lsGet('festival_theme','snow');
let currentFestival=festivalTypes.includes(savedFestival)?savedFestival:'snow';
if(currentFestival!==savedFestival)lsSet('festival_theme',currentFestival);
let festivalEffectEnabled=lsGet('festival_effect_enabled',false)===true;
function initFestivalCanvas(){
  if(festivalCanvas)return;
  festivalCanvas=document.createElement('canvas');
  festivalCanvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;';
  document.body.appendChild(festivalCanvas);
  festivalCtx=festivalCanvas.getContext('2d');
  resizeFestivalCanvas();
  window.addEventListener('resize',resizeFestivalCanvas);
}
function resizeFestivalCanvas(){
  if(!festivalCanvas)return;
  festivalCanvas.width=window.innerWidth;
  festivalCanvas.height=window.innerHeight;
}
function createFestivalParticle(type){
  const w=festivalCanvas.width;
  if(type==='snow'){
    return{x:Math.random()*w,y:-10,r:Math.random()*2+1.5,speed:Math.random()*0.8+0.4,drift:Math.random()*0.3-0.15,opacity:Math.random()*0.3+0.3};
  }else if(type==='sakura'){
    return{x:Math.random()*w,y:-10,r:Math.random()*3+3,speed:Math.random()*1+0.6,drift:Math.random()*0.6-0.3,rotation:Math.random()*Math.PI*2,rotSpeed:Math.random()*0.03-0.015,opacity:Math.random()*0.3+0.4};
  }else if(type==='coin'){
    return{x:Math.random()*w,y:-10,r:Math.random()*4+4,speed:Math.random()*1.2+0.7,drift:Math.random()*0.5-0.25,rotation:0,rotSpeed:Math.random()*0.06-0.03,opacity:Math.random()*0.3+0.3};
  }else if(type==='love'){
    return{x:Math.random()*w,y:-20,emoji:'❤️',size:Math.random()*8+12,speed:Math.random()*0.8+0.4,drift:Math.random()*0.6-0.3,rotation:Math.random()*Math.PI*2,rotSpeed:Math.random()*0.03-0.015,opacity:Math.random()*0.3+0.6,sway:Math.random()*Math.PI*2,swaySpeed:Math.random()*0.025+0.01};
  }
}
function drawFestivalParticle(p,type){
  festivalCtx.save();
  festivalCtx.globalAlpha=p.opacity;
  festivalCtx.translate(p.x,p.y);
  if(type==='snow'){
    festivalCtx.fillStyle='#fff';
    festivalCtx.beginPath();
    festivalCtx.arc(0,0,p.r,0,Math.PI*2);
    festivalCtx.fill();
  }else if(type==='sakura'){
    festivalCtx.rotate(p.rotation);
    festivalCtx.fillStyle='#ffb7c5';
    for(let i=0;i<5;i++){
      festivalCtx.rotate(Math.PI*2/5);
      festivalCtx.beginPath();
      festivalCtx.ellipse(0,-p.r*0.6,p.r*0.4,p.r*0.7,0,0,Math.PI*2);
      festivalCtx.fill();
    }
  }else if(type==='coin'){
    festivalCtx.rotate(p.rotation);
    const grad=festivalCtx.createLinearGradient(-p.r,0,p.r,0);
    grad.addColorStop(0,'#f59e0b');
    grad.addColorStop(0.5,'#fbbf24');
    grad.addColorStop(1,'#d97706');
    festivalCtx.fillStyle=grad;
    festivalCtx.beginPath();
    festivalCtx.arc(0,0,p.r,0,Math.PI*2);
    festivalCtx.fill();
    festivalCtx.fillStyle='#92400e';
    festivalCtx.font='bold '+(p.r*1.2)+'px serif';
    festivalCtx.textAlign='center';
    festivalCtx.textBaseline='middle';
    festivalCtx.fillText('$',0,1);
  }else if(type==='love'){
    festivalCtx.rotate(p.rotation);
    festivalCtx.font=p.size+'px serif';
    festivalCtx.textAlign='center';
    festivalCtx.textBaseline='middle';
    festivalCtx.fillText(p.emoji,0,0);
  }
  festivalCtx.restore();
}
function festivalLoop(){
  if(!festivalCtx||!festivalEffectEnabled)return;
  festivalCtx.clearRect(0,0,festivalCanvas.width,festivalCanvas.height);
  if(Math.random()<0.06&&festivalParticles.length<35){
    festivalParticles.push(createFestivalParticle(currentFestival));
  }
  for(let i=festivalParticles.length-1;i>=0;i--){
    const p=festivalParticles[i];
    p.y+=p.speed;
    if(p.sway!==undefined){
      p.sway+=p.swaySpeed;
      p.x+=p.drift+Math.sin(p.sway)*0.5;
    }else{
      p.x+=p.drift;
    }
    if(p.rotation!==undefined)p.rotation+=p.rotSpeed;
    if(p.y>festivalCanvas.height+20||p.x<-20||p.x>festivalCanvas.width+20){
      festivalParticles.splice(i,1);
      continue;
    }
    drawFestivalParticle(p,currentFestival);
  }
  festivalAnimId=requestAnimationFrame(festivalLoop);
}
function setFestival(type){
  if(type==='none'){
    setFestivalEffectEnabled(false);
    return;
  }
  if(!festivalTypes.includes(type))type='snow';
  currentFestival=type;
  lsSet('festival_theme',type);
  festivalEffectEnabled=true;
  lsSet('festival_effect_enabled',true);
  updateFestivalControls();
  startFestivalEffect();
  playSound('click');
}
function updateFestivalControls(){
  const toggle=document.getElementById('festivalEffectToggle');
  const panel=document.getElementById('festivalOptionsWrap');
  const options=document.getElementById('festivalOptions');
  if(toggle)toggle.setAttribute('aria-checked',String(festivalEffectEnabled));
  if(panel){
    panel.classList.toggle('is-open',festivalEffectEnabled);
    panel.setAttribute('aria-hidden',String(!festivalEffectEnabled));
    panel.inert=!festivalEffectEnabled;
  }
  if(options){
    options.setAttribute('aria-disabled',String(!festivalEffectEnabled));
  }
  document.querySelectorAll('.festival-btn').forEach(button=>{
    button.disabled=!festivalEffectEnabled;
    button.classList.toggle('active',festivalEffectEnabled&&button.dataset.festival===currentFestival);
  });
}
function startFestivalEffect(){
  if(!festivalEffectEnabled)return;
  initFestivalCanvas();
  festivalParticles=[];
  if(festivalAnimId!==null)cancelAnimationFrame(festivalAnimId);
  festivalAnimId=null;
  festivalLoop();
}
function stopFestivalEffect(){
  if(festivalAnimId!==null){
    cancelAnimationFrame(festivalAnimId);
    festivalAnimId=null;
  }
  if(festivalCtx)festivalCtx.clearRect(0,0,festivalCanvas.width,festivalCanvas.height);
  festivalParticles=[];
}
function setFestivalEffectEnabled(enabled){
  festivalEffectEnabled=Boolean(enabled);
  lsSet('festival_effect_enabled',festivalEffectEnabled);
  if(festivalEffectEnabled){
    if(!festivalTypes.includes(currentFestival))currentFestival='snow';
    lsSet('festival_theme',currentFestival);
    startFestivalEffect();
  }else{
    stopFestivalEffect();
  }
  updateFestivalControls();
}
document.getElementById('festivalEffectToggle')?.addEventListener('change',event=>{
  setFestivalEffectEnabled(event.currentTarget.getAttribute('aria-checked')==='true');
});
updateFestivalControls();
if(festivalEffectEnabled)setTimeout(startFestivalEffect,500);

