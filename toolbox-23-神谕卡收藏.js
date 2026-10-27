// ===== 神谕卡收藏 =====
let bpOracleFilter='all';
function bpFilterOracle(cat){
  bpOracleFilter=cat;
  document.querySelectorAll('#bpOracleTabs .bp-cat-tab').forEach(t=>t.classList.remove('active'));
  try{event.target.classList.add('active');}catch(e){}
  const grid=document.getElementById('bpOracleGrid');
  const tip=document.getElementById('bpOracleHideTip');
  if(grid){grid.style.display='grid';}
  if(tip){tip.style.display='none';}
  const hideBtn=document.querySelector('#bpOracleTabs .bp-hide-btn');
  if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
  bpRenderOracle();
}
function bpRenderOracle(){
  const cards=lsGet('backpack_oracle',[]);
  const grid=document.getElementById('bpOracleGrid');
  if(!grid)return;
  if(cards.length===0){
    grid.innerHTML='<div class="bp-empty" style="grid-column:1/-1;">还没有神谕卡，去百宝箱抽卡试试吧！</div>';
    return;
  }
  // 合并重复项，按牌名分组统计数量
  const oracleMap={};
  cards.forEach(c=>{
    const key=c.name;
    if(!oracleMap[key])oracleMap[key]={...c,count:0};
    oracleMap[key].count++;
  });
  const mergedOracle=Object.values(oracleMap).sort((a,b)=>b.count-a.count);
  grid.innerHTML=mergedOracle.map(c=>{
    return '<div class="bp-oracle-card" style="position:relative;cursor:pointer;" onclick="bpShowOracleDetail(\''+c.name+'\')">'+
      (c.count>1?'<div style="position:absolute;top:4px;right:4px;background:#c084fc;color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:bold;">x'+c.count+'</div>':'')+
      '<div class="bo-icon">'+c.icon+'</div>'+
      '<div class="bo-name">'+c.name+'</div>'+
      '<div class="bo-kw">'+c.kw+'</div>'+
    '</div>';
  }).join('');
}

