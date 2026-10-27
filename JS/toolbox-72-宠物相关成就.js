// 宠物成就数据与成就渲染逻辑
ACHIEVEMENTS.push(
{id:'pet1',icon:'💕',name:'亲密无间',desc:'小橘好感度达到100',bonus:25,check:()=>(lsGet('pet_affection',0)||0)>=100},
  {id:'pet2',icon:'⚔️',name:'战力新星',desc:'小橘战力达到100',bonus:30,check:()=>(lsGet('pet_power',0)||0)>=100},
  {id:'pet3',icon:'⚔️',name:'战力巅峰',desc:'小橘战力达到500',bonus:88,check:()=>(lsGet('pet_power',0)||0)>=500},
  {id:'pet4',icon:'🎓',name:'学霸猫',desc:'小橘大学毕业1次',bonus:40,check:()=>(lsGet('pet_school_counts',{}).university||0)>=1},
  {id:'pet5',icon:'🏆',name:'收藏大师',desc:'收集所有30种收藏品',bonus:88,check:()=>{const c=lsGet('pet_collections',{});return Object.keys(c).length>=30;}},
  {id:'pet6',icon:'🐱',name:'养猫达人',desc:'累计上学50次',bonus:50,check:()=>{const c=lsGet('pet_school_counts',{});let t=0;for(let k in c)t+=c[k];return t>=50;}}
);

function achievementRender(){
  const claimed=lsGet('achievements_claimed',[]);
  const listEl=document.getElementById('achievementList');
  if(!listEl)return;
  let html='<div style="display:flex;flex-wrap:wrap;gap:10px;">';
  ACHIEVEMENTS.forEach(a=>{
    const earned=a.check();
    const done=claimed.includes(a.id);
    let statusHtml='';
    if(!earned){
      statusHtml='<div style="margin-top:6px;font-size:11px;color:var(--text-placeholder);">未达成</div>';
    }else if(done){
      statusHtml='<div style="margin-top:6px;font-size:11px;color:#b45309;">✅ 已领取 +'+a.bonus+'</div>';
    }else{
      statusHtml='<button data-achievement-id="'+a.id+'" onclick="claimAchievement(this.dataset.achievementId)" style="margin-top:8px;padding:5px 12px;font-size:11px;border-radius:12px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;cursor:pointer;font-weight:600;box-shadow:0 2px 6px rgba(245,158,11,0.4);">🎁 领取 +'+a.bonus+'金币</button>';
    }
    html+='<div style="flex:1 1 140px;min-width:0;padding:14px;border-radius:14px;text-align:center;box-sizing:border-box;background:'+(earned?'linear-gradient(135deg,#fef3c7,#fde68a)':'var(--bg-input)')+';border:1px solid '+(earned?'#f59e0b':'var(--border-color)')+';'+(earned?'':'opacity:0.72;')+'">'+
      '<div style="font-size:30px;">'+(earned?a.icon:'🔒')+'</div>'+
      '<div style="font-weight:bold;font-size:14px;margin:6px 0;'+(earned?'color:#92400e;':'color:var(--text-secondary);')+'">'+a.name+'</div>'+
      '<div style="font-size:11.5px;color:var(--text-secondary);line-height:1.5;">'+a.desc+'</div>'+
      statusHtml+
      '</div>';
  });
  html+='</div>';
  listEl.innerHTML=html;
}

// 手动领取成就
function claimAchievement(id){
  const a=ACHIEVEMENTS.find(x=>x.id===id);
  if(!a)return;
  const claimed=lsGet('achievements_claimed',[]);
  if(claimed.includes(id))return;
  if(!a.check())return;
  claimed.push(id);
  lsSet('achievements_claimed',claimed);
  bpAddCoins(a.bonus,'achievement');
  // 弹出领取成功提示
  showAchievementClaimModal(a);
  achievementRender();
}

// 领取成功弹窗
function showAchievementClaimModal(a){
  const old=document.getElementById('achievementClaimModal');
  if(old)old.remove();
  const modal=document.createElement('div');
  modal.id='achievementClaimModal';
  modal.className='modal-mask';
  modal.style.cssText='display:flex;padding:20px;box-sizing:border-box;';
  const closeModal=function(){
    if(modal.classList.contains('closing'))return;
    modal.classList.add('closing');
    document.body.style.overflow='';
    setTimeout(()=>{modal.remove();},200);
  };
  modal.onclick=function(e){if(e.target===modal)closeModal();};
  modal.innerHTML='<div class="modal-box" style="padding:30px;text-align:center;max-width:320px;width:100%;">'+
    '<button class="modal-close-btn" type="button" aria-label="关闭成就奖励弹窗" style="position:absolute;top:12px;right:12px;">✕</button>'+
    '<div style="font-size:60px;margin-bottom:10px;">'+a.icon+'</div>'+
    '<div style="font-size:20px;font-weight:bold;color:#92400e;margin-bottom:6px;">'+a.name+'</div>'+
    '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">'+a.desc+'</div>'+
    '<div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:12px;margin-bottom:18px;">'+
      '<div style="font-size:12px;color:#b45309;">获得奖励</div>'+
      '<div style="font-size:24px;font-weight:bold;color:#d97706;">+'+a.bonus+' 💰</div>'+
    '</div>'+ 
  '</div>';
  document.body.appendChild(modal);
  document.body.style.overflow='hidden';
  const dismiss=modal.querySelector('.modal-close-btn');
  if(dismiss)dismiss.onclick=closeModal;
}


