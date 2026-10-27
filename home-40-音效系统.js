// ==================== 音效系统 ====================
let soundCtx=null;
let soundEnabled=lsGet('sound_enabled',true);
let soundVolume=lsGet('sound_volume',15)/100;
function initSound(){
  if(!soundCtx){
    try{soundCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}
  }
}
function playSound(type){
  if(!soundEnabled||!soundCtx)return;
  const now=soundCtx.currentTime;
  const vol=soundVolume*0.3;
  const osc=soundCtx.createOscillator();
  const gain=soundCtx.createGain();
  osc.connect(gain);gain.connect(soundCtx.destination);
  gain.gain.setValueAtTime(vol,now);
  switch(type){
    case 'click':
      osc.frequency.setValueAtTime(800,now);
      osc.frequency.exponentialRampToValueAtTime(600,now+0.08);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.1);
      osc.start(now);osc.stop(now+0.1);break;
    case 'success':
      osc.frequency.setValueAtTime(523,now);
      osc.frequency.setValueAtTime(659,now+0.1);
      osc.frequency.setValueAtTime(784,now+0.2);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.4);
      osc.start(now);osc.stop(now+0.4);break;
    case 'fail':
      osc.frequency.setValueAtTime(300,now);
      osc.frequency.exponentialRampToValueAtTime(150,now+0.3);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.3);
      osc.start(now);osc.stop(now+0.3);break;
    case 'coin':
      osc.frequency.setValueAtTime(988,now);
      osc.frequency.setValueAtTime(1319,now+0.08);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.2);
      osc.start(now);osc.stop(now+0.2);break;
    case 'gacha':
      osc.type='sine';
      osc.frequency.setValueAtTime(400,now);
      osc.frequency.exponentialRampToValueAtTime(800,now+0.2);
      osc.frequency.exponentialRampToValueAtTime(600,now+0.4);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.5);
      osc.start(now);osc.stop(now+0.5);break;
    case 'item':
      osc.type='triangle';
      osc.frequency.setValueAtTime(600,now);
      osc.frequency.setValueAtTime(800,now+0.1);
      osc.frequency.setValueAtTime(1000,now+0.2);
      osc.frequency.setValueAtTime(1200,now+0.3);
      gain.gain.exponentialRampToValueAtTime(0.001,now+0.5);
      osc.start(now);osc.stop(now+0.5);break;
  }
}
function toggleSound(){
  soundEnabled=!soundEnabled;
  lsSet('sound_enabled',soundEnabled);
  updateSoundControls();
  if(soundEnabled) initSound();
}
function updateSoundControls(){
  const btn=document.getElementById('soundToggleBtn');
  const panel=document.getElementById('soundVolumeWrap');
  if(btn)btn.setAttribute('aria-checked',String(soundEnabled));
  if(panel){
    panel.classList.toggle('is-open',soundEnabled);
    panel.setAttribute('aria-hidden',String(!soundEnabled));
    panel.inert=!soundEnabled;
  }
}
function setSoundVolume(val){
  soundVolume=val/100;
  lsSet('sound_volume',val);
  const text=document.getElementById('soundVolumeText');
  if(text)text.textContent=val+'%';
  window.flUpdateRangeControl(document.getElementById('soundVolume'));
}
updateSoundControls();
document.addEventListener('click',function(){initSound();},{once:true});

// 页面初始化时同步音效设置到UI
window.addEventListener('load',function(){
  setTimeout(function(){
    const savedVolume=lsGet('sound_volume',15);
    const volumeInput=document.getElementById('soundVolume');
    const volumeText=document.getElementById('soundVolumeText');
    if(volumeInput){
      volumeInput.value=savedVolume;
      window.flUpdateRangeControl(volumeInput);
    }
    if(volumeText)volumeText.textContent=savedVolume+'%';
    updateSoundControls();
  },100);
});

