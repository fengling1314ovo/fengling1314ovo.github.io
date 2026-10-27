// ===== 雷诺曼收藏 =====
let bpLenormandFilter='single';
function bpFilterLenormand(cat){
  bpLenormandFilter=cat;
  document.querySelectorAll('#bpLenormandTabs .bp-cat-tab').forEach(t=>t.classList.remove('active'));
  try{event.target.classList.add('active');}catch(e){}
  const grid=document.getElementById('bpLenormandGrid');
  const tip=document.getElementById('bpLenormandHideTip');
  if(grid){grid.style.display='grid';}
  if(tip){tip.style.display='none';}
  const hideBtn=document.querySelector('#bpLenormandTabs .bp-hide-btn');
  if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
  bpRenderLenormand();
}
function bpRenderLenormand(){
  const cards=lsGet('backpack_lenormand',[]);
  const filtered=bpLenormandFilter==='all'?cards:
    bpLenormandFilter==='single'?cards.filter(c=>c.spread===1):
    cards.filter(c=>c.spread===3);
  const grid=document.getElementById('bpLenormandGrid');
  if(!grid)return;
  if(filtered.length===0){
    grid.innerHTML='<div class="bp-empty" style="grid-column:1/-1;">还没有雷诺曼牌，去百宝箱抽牌试试吧！</div>';
    return;
  }
  // 合并重复项，按牌编号分组统计数量
  const lenormandMap={};
  filtered.forEach(c=>{
    const key=c.num;
    if(!lenormandMap[key])lenormandMap[key]={...c,count:0};
    lenormandMap[key].count++;
  });
  const mergedLenormand=Object.values(lenormandMap).sort((a,b)=>b.count-a.count);
  grid.innerHTML=mergedLenormand.map(c=>{
    return '<div class="bp-lenormand-card" style="position:relative;cursor:pointer;" onclick="bpShowLenormandDetail('+c.num+')">'+
      (c.count>1?'<div style="position:absolute;top:4px;right:4px;background:#8b5cf6;color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:bold;">x'+c.count+'</div>':'')+
      '<div class="bl-num">'+c.num+'</div>'+
      '<div class="bl-icon">'+c.icon+'</div>'+
      '<div class="bl-name">'+c.name+'</div>'+
      '<div class="bl-mode">'+(c.spread===1?'单牌':'三牌')+'</div>'+
    '</div>';
  }).join('');
}

