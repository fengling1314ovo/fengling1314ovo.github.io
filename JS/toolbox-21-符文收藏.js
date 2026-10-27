// ===== 符文收藏 =====
let bpRuneFilter='single';
function bpFilterRune(cat){
  bpRuneFilter=cat;
  document.querySelectorAll('#bpRuneTabs .bp-cat-tab').forEach(t=>t.classList.remove('active'));
  try{event.target.classList.add('active');}catch(e){}
  const grid=document.getElementById('bpRuneGrid');
  const tip=document.getElementById('bpRuneHideTip');
  if(grid){grid.style.display='grid';}
  if(tip){tip.style.display='none';}
  const hideBtn=document.querySelector('#bpRuneTabs .bp-hide-btn');
  if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
  bpRenderRunes();
}
function bpRenderRunes(){
  const runes=lsGet('backpack_runes',[]);
  const filtered=bpRuneFilter==='all'?runes:
    bpRuneFilter==='single'?runes.filter(r=>r.mode===1):
    runes.filter(r=>r.mode===3);
  const grid=document.getElementById('bpRuneGrid');
  if(!grid)return;
  if(filtered.length===0){
    grid.innerHTML='<div class="bp-empty" style="grid-column:1/-1;">还没有符文，去百宝箱抽取符文试试吧！</div>';
    return;
  }
  // 合并重复项，按符文名分组统计数量
  const runeMap={};
  filtered.forEach(r=>{
    const key=r.name;
    if(!runeMap[key])runeMap[key]={...r,count:0};
    runeMap[key].count++;
  });
  const mergedRunes=Object.values(runeMap).sort((a,b)=>b.count-a.count);
  const runeColors=['rune-gold','rune-rose','rune-sky','rune-emerald','rune-violet','rune-orange','rune-teal'];
  grid.innerHTML=mergedRunes.map((r,idx)=>{
    const colorClass=runeColors[idx % runeColors.length];
    return '<div class="bp-rune-card '+colorClass+'" style="position:relative;" data-rune-id="'+r.id+'" onclick="bpShowRuneDetail(this.dataset.runeId)">'+
      (r.count>1?'<div style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.6);color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:bold;">x'+r.count+'</div>':'')+
      '<div class="br-symbol">'+r.symbol+'</div>'+
      '<div class="br-name">'+r.name.split(' ')[0]+'</div>'+
      '<div class="br-mode">'+(r.mode===1?'单枚':'三枚')+'</div>'+
    '</div>';
  }).join('');
}

