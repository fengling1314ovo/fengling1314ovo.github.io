// ===== 基博卡收藏 =====
let bpKipperFilter='single';
function bpFilterKipper(cat){
  bpKipperFilter=cat;
  document.querySelectorAll('#bpKipperTabs .bp-cat-tab').forEach(t=>t.classList.remove('active'));
  try{event.target.classList.add('active');}catch(e){}
  const grid=document.getElementById('bpKipperGrid');
  const tip=document.getElementById('bpKipperHideTip');
  if(grid){grid.style.display='grid';}
  if(tip){tip.style.display='none';}
  const hideBtn=document.querySelector('#bpKipperTabs .bp-hide-btn');
  if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
  bpRenderKipper();
}
function bpRenderKipper(){
  const cards=lsGet('backpack_kipper',[]);
  const filtered=bpKipperFilter==='all'?cards:
    bpKipperFilter==='single'?cards.filter(c=>c.spread===1):
    cards.filter(c=>c.spread===3);
  const grid=document.getElementById('bpKipperGrid');
  if(!grid)return;
  if(filtered.length===0){
    grid.innerHTML='<div class="bp-empty" style="grid-column:1/-1;">还没有基博卡，去百宝箱抽牌试试吧！</div>';
    return;
  }
  // 合并重复项，按牌编号分组统计数量
  const kipperMap={};
  filtered.forEach(c=>{
    const key=c.num;
    if(!kipperMap[key])kipperMap[key]={...c,count:0};
    kipperMap[key].count++;
  });
  const mergedKipper=Object.values(kipperMap).sort((a,b)=>b.count-a.count);
  grid.innerHTML=mergedKipper.map(c=>{
    return '<div class="bp-kipper-card" style="position:relative;cursor:pointer;" onclick="bpShowKipperDetail('+c.num+')">'+
      (c.count>1?'<div style="position:absolute;top:4px;right:4px;background:#ef4444;color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:bold;">x'+c.count+'</div>':'')+
      '<div class="bk-num">'+c.num+'</div>'+
      '<div class="bk-icon">'+c.icon+'</div>'+
      '<div class="bk-name">'+c.name+'</div>'+
      '<div class="bk-mode">'+(c.spread===1?'单牌':'三牌')+'</div>'+
    '</div>';
  }).join('');
}

// 符文详情弹窗
function bpShowRuneDetail(id){
  const runes=lsGet('backpack_runes',[]);
  const r=runes.find(x=>x.id===id);
  if(!r)return;
  const d=new Date(r.time);
  const timeStr=d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
  document.getElementById('runeDetailTitle').textContent=r.name;
  document.getElementById('runeDetailBody').innerHTML=
    '<div class="rune-detail-symbol">'+r.symbol+'</div>'+
    '<div class="rune-detail-name">'+r.name+'</div>'+
    '<div class="rune-detail-pos">'+(r.pos||'')+' · '+(r.mode===1?'单枚抽取':'三枚抽取')+'</div>'+
    '<div class="rune-detail-section">'+
      '<div class="rune-detail-label">关键词</div>'+
      '<div class="rune-detail-text">'+(r.kw||'')+'</div>'+
    '</div>'+
    '<div class="rune-detail-section">'+
      '<div class="rune-detail-label">符文解读</div>'+
      '<div class="rune-detail-text">'+(r.meaning||'')+'</div>'+
    '</div>'+
    '<div class="rune-detail-time">抽取时间：'+timeStr+'</div>';
  const rm=document.getElementById('runeDetailModal');rm.classList.remove('closing');rm.classList.add('show');document.body.style.overflow='hidden';
}
function bpCloseRuneDetail(){
  bpAnimateModalClose('runeDetailModal');
}
function bpCloseCardDetail(){
  bpAnimateModalClose('cardDetailModal');
}
// 弹窗带动画关闭：先播放淡出动画，结束后再隐藏
function bpAnimateModalClose(id){
  const m=document.getElementById(id);
  if(!m || !m.classList.contains('show') || m.classList.contains('closing')) return;
  m.classList.add('closing');
  document.body.style.overflow='';
  setTimeout(()=>{
    m.classList.remove('show');
    m.classList.remove('closing');
  },200);
}
// 抽卡模拟器卡牌详情
function bpShowCardDetail(name){
  const card=CARDS.find(c=>c.name===name);
  if(!card)return;
  const rarityText={ssr:'SSR 超稀有',sr:'SR 稀有',r:'R 普通',n:'N 常见'}[card.rarity]||card.rarity.toUpperCase();
  document.getElementById('cardDetailTitle').textContent=card.icon+' '+card.name;
  document.getElementById('cardDetailBody').innerHTML=
    '<div class="cd-icon">'+card.icon+'</div>'+
    '<div class="cd-name">'+card.name+'<span class="cd-count">'+rarityText+'</span></div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">卡牌描述</div>'+
      '<div class="cd-text">'+(card.desc||'暂无描述')+'</div>'+
    '</div>';
  const cm=document.getElementById('cardDetailModal');cm.classList.remove('closing');cm.classList.add('show');document.body.style.overflow='hidden';
}
// 塔罗牌详情
function bpShowTarotDetail(key){
  const parts=key.split('_');
  const num=parts[0];
  const reversed=parts[1]==='rev';
  const card=TAROT_CARDS.find(c=>c.num===num);
  if(!card)return;
  document.getElementById('cardDetailTitle').textContent=card.icon+' '+card.num+' '+card.name+(reversed?'（逆位）':'');
  document.getElementById('cardDetailBody').innerHTML=
    '<div class="cd-icon" style="'+(reversed?'transform:rotate(180deg);':'')+'">'+card.icon+'</div>'+
    '<div class="cd-name">'+card.name+'</div>'+
    '<div class="cd-meta">'+(reversed?'逆位':'正位')+' · 大阿卡纳</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">关键词</div>'+
      '<div class="cd-text">'+(reversed?card.kwReversed:card.kwUpright)+'</div>'+
    '</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">牌意解读</div>'+
      '<div class="cd-text">'+card.advice+'</div>'+
    '</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">💕 感情</div>'+
      '<div class="cd-text">'+(reversed?card.loveReversed:card.loveUpright)+'</div>'+
    '</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">💼 事业</div>'+
      '<div class="cd-text">'+(reversed?card.careerReversed:card.careerUpright)+'</div>'+
    '</div>';
  const cm=document.getElementById('cardDetailModal');cm.classList.remove('closing');cm.classList.add('show');document.body.style.overflow='hidden';
}
// 雷诺曼详情
function bpShowLenormandDetail(num){
  const card=LENORMAND_CARDS.find(c=>c.num===num);
  if(!card)return;
  document.getElementById('cardDetailTitle').textContent=card.icon+' '+card.num+' '+card.name;
  document.getElementById('cardDetailBody').innerHTML=
    '<div class="cd-icon">'+card.icon+'</div>'+
    '<div class="cd-name">'+card.name+'</div>'+
    '<div class="cd-meta">雷诺曼卡牌 · 第'+card.num+'张</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">关键词</div>'+
      '<div class="cd-text">'+card.kw+'</div>'+
    '</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">牌意解读</div>'+
      '<div class="cd-text">'+card.meaning+'</div>'+
    '</div>';
  const cm=document.getElementById('cardDetailModal');cm.classList.remove('closing');cm.classList.add('show');document.body.style.overflow='hidden';
}
// 神谕卡详情
function bpShowOracleDetail(name){
  const card=ORACLE_CARDS.find(c=>c.name===name);
  if(!card)return;
  document.getElementById('cardDetailTitle').textContent=card.icon+' '+card.name;
  document.getElementById('cardDetailBody').innerHTML=
    '<div class="cd-icon">'+card.icon+'</div>'+
    '<div class="cd-name">'+card.name+'</div>'+
    '<div class="cd-meta">天使神谕卡</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">关键词</div>'+
      '<div class="cd-text">'+card.kw+'</div>'+
    '</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">天使寄语</div>'+
      '<div class="cd-text">'+card.message+'</div>'+
    '</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">今日行动</div>'+
      '<div class="cd-text">✨ '+card.action+'</div>'+
    '</div>';
  const cm=document.getElementById('cardDetailModal');cm.classList.remove('closing');cm.classList.add('show');document.body.style.overflow='hidden';
}
// 基博卡详情
function bpShowKipperDetail(num){
  const card=KIPPER_CARDS.find(c=>c.num===num);
  if(!card)return;
  document.getElementById('cardDetailTitle').textContent=card.icon+' '+card.num+' '+card.name;
  document.getElementById('cardDetailBody').innerHTML=
    '<div class="cd-icon">'+card.icon+'</div>'+
    '<div class="cd-name">'+card.name+'</div>'+
    '<div class="cd-meta">基博卡 · 第'+card.num+'张</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">关键词</div>'+
      '<div class="cd-text">'+card.kw+'</div>'+
    '</div>'+
    '<div class="cd-section">'+
      '<div class="cd-label">牌意解读</div>'+
      '<div class="cd-text">'+card.meaning+'</div>'+
    '</div>';
  const cm=document.getElementById('cardDetailModal');cm.classList.remove('closing');cm.classList.add('show');document.body.style.overflow='hidden';
}
function bpToggleHide(gridId,tipId,btn){
  const grid=document.getElementById(gridId);
  const tip=document.getElementById(tipId);
  if(grid.style.display==='none'){
    grid.style.display='';
    tip.style.display='none';
    if(btn){btn.textContent='🙈 隐藏';btn.classList.add('showing');}
  }else{
    grid.style.display='none';
    tip.style.display='block';
    if(btn){
      btn.textContent='👁 显示';btn.classList.remove('showing');
      const tabs=btn.parentElement.querySelectorAll('.bp-cat-tab');
      tabs.forEach(t=>t.classList.remove('active'));
    }
  }
}
function bpShowHide(gridId,tipId){
  const grid=document.getElementById(gridId);
  const tip=document.getElementById(tipId);
  if(grid){grid.style.display='';}
  if(tip){tip.style.display='none';}
  // 找到对应的标签栏（卡片网格的前一个兄弟元素）
  if(grid){
    const tabsBar=grid.previousElementSibling;
    if(tabsBar){
      const allTabs=tabsBar.querySelectorAll('.bp-cat-tab');
      allTabs.forEach(t=>t.classList.remove('active'));
      if(allTabs.length>0)allTabs[0].classList.add('active');
      const hideBtn=tabsBar.querySelector('.bp-hide-btn');
      if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
    }
  }
}
function bpRender(){
  document.getElementById('bpCoins').textContent=bpGetCoins();
  // 弹珠总数
  const pinInv=lsGet('pinball_inventory',{});
  const pinTotal=Object.values(pinInv).reduce((a,b)=>a+b,0);
  document.getElementById('bpPinballTotal').textContent=pinTotal;
  const cards=lsGet('backpack_cards',[]);
  document.getElementById('bpCountAll').textContent=cards.length;
  document.getElementById('bpCountSsr').textContent=cards.filter(c=>c.rarity==='ssr').length;
  document.getElementById('bpCountSr').textContent=cards.filter(c=>c.rarity==='sr').length;
  document.getElementById('bpCountR').textContent=cards.filter(c=>c.rarity==='r').length;
  document.getElementById('bpCountN').textContent=cards.filter(c=>c.rarity==='n').length;
  bpRenderCards();
  // 塔罗牌收藏计数
  const tarotCards=lsGet('backpack_tarot',[]);
  document.getElementById('bpTarotCountAll').textContent=tarotCards.length;
  document.getElementById('bpTarotCountUp').textContent=tarotCards.filter(c=>!c.reversed).length;
  document.getElementById('bpTarotCountRev').textContent=tarotCards.filter(c=>c.reversed).length;
  bpRenderTarot();
  // 符文收藏计数
  const runeCards=lsGet('backpack_runes',[]);
  document.getElementById('bpRuneCountAll').textContent=runeCards.length;
  document.getElementById('bpRuneCountSingle').textContent=runeCards.filter(r=>r.mode===1).length;
  document.getElementById('bpRuneCountTriple').textContent=runeCards.filter(r=>r.mode===3).length;
  bpRenderRunes();
  // 雷诺曼收藏计数
  const lenormandCards=lsGet('backpack_lenormand',[]);
  document.getElementById('bpLenormandCountAll').textContent=lenormandCards.length;
  document.getElementById('bpLenormandCountSingle').textContent=lenormandCards.filter(c=>c.spread===1).length;
  document.getElementById('bpLenormandCountTriple').textContent=lenormandCards.filter(c=>c.spread===3).length;
  bpRenderLenormand();
  // 神谕卡收藏计数
  const oracleCards=lsGet('backpack_oracle',[]);
  document.getElementById('bpOracleCountAll').textContent=oracleCards.length;
  bpRenderOracle();
  // 基博卡收藏计数
  const kipperCards=lsGet('backpack_kipper',[]);
  document.getElementById('bpKipperCountAll').textContent=kipperCards.length;
  document.getElementById('bpKipperCountSingle').textContent=kipperCards.filter(c=>c.spread===1).length;
  document.getElementById('bpKipperCountTriple').textContent=kipperCards.filter(c=>c.spread===3).length;
  bpRenderKipper();
  // 扭蛋机道具计数
  const items=lsGet('backpack_items',[]);
  document.getElementById('bpItemCountAll').textContent=items.length;
  document.getElementById('bpItemCountCommon').textContent=items.filter(i=>i.rarity==='common').length;
  document.getElementById('bpItemCountRare').textContent=items.filter(i=>i.rarity==='rare').length;
  document.getElementById('bpItemCountEpic').textContent=items.filter(i=>i.rarity==='epic').length;
  document.getElementById('bpItemCountLegendary').textContent=items.filter(i=>i.rarity==='legendary').length;
  bpRenderItems();
  // 游戏收益统计
  const earned=lsGet('backpack_earned',{});
  const statsList=document.getElementById('bpStatsList');
  const entries=Object.entries(earned).filter(([g,v])=>v>0).sort((a,b)=>b[1]-a[1]);
  if(entries.length===0){
    statsList.innerHTML='<div class="bp-empty">还没有游戏收益，去百宝箱玩游戏赚金币吧！</div>';
  }else{
    statsList.innerHTML=entries.map(([g,v])=>{
      const name=BP_GAME_NAMES[g]||g;
      return '<div class="bp-stat-row"><span class="game-name">'+name+'</span><span class="game-coins">+'+v+' 💰</span></div>';
    }).join('');
  }
  // 金币消耗统计
  const spent=lsGet('backpack_spent',{});
  const spentList=document.getElementById('bpSpentList');
  if(spentList){
    const spentEntries=Object.entries(spent).filter(([g,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    if(spentEntries.length===0){
      spentList.innerHTML='<div class="bp-empty">还没有消耗记录，去百宝箱体验付费功能吧！</div>';
    }else{
      const totalSpent=spentEntries.reduce((sum,[,v])=>sum+v,0);
      spentList.innerHTML='<div class="bp-stat-row" style="font-weight:bold;border-top:1px solid #eee;padding-top:8px;margin-top:4px;"><span class="game-name">📊 累计消耗</span><span class="game-coins" style="color:#ef4444;">-'+totalSpent+' 💰</span></div>'+
        spentEntries.map(([g,v])=>{
          const name=BP_SPENT_NAMES[g]||g;
          return '<div class="bp-stat-row"><span class="game-name">'+name+'</span><span class="game-coins" style="color:#ef4444;">-'+v+' 💰</span></div>';
        }).join('');
    }
  }
}
bpUpdateHomeBadge();

// 百宝箱卡片排序：紫色(抽卡/塔罗/符文) -> 金色 -> 无色
(function sortChestCards(){
  const grid=document.getElementById('chestGrid');
  if(!grid)return;
  const cards=Array.from(grid.querySelectorAll('.chest-card'));
  // 紫色卡片的指定顺序
  const purpleOrder={'lenormandPage':0,'oraclePage':1,'kipperPage':2,'gachaPage':3,'tarotPage':4,'runePage':5};
  cards.sort((a,b)=>{
    const aRed=a.classList.contains('red');
    const bRed=b.classList.contains('red');
    const aPurple=a.classList.contains('gacha-highlight');
    const bPurple=b.classList.contains('gacha-highlight');
    const aGold=a.classList.contains('gold');
    const bGold=b.classList.contains('gold');
    // 计算权重：红色-1（置顶），紫色0-5，金色10，无色20
    let aWeight=aRed?-1:(aPurple?(purpleOrder[a.getAttribute('onclick').match(/'([^']+)'/)[1]]||3):(aGold?10:20));
    let bWeight=bRed?-1:(bPurple?(purpleOrder[b.getAttribute('onclick').match(/'([^']+)'/)[1]]||3):(bGold?10:20));
    return aWeight-bWeight;
  });
  cards.forEach(c=>grid.appendChild(c));
})();

