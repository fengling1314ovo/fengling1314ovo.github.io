// ==================== 扭蛋机道具系统 ====================
const CAPSULE_ITEMS=[
  {id:'exp_potion',icon:'🌟',name:'经验药水',rarity:'common',desc:'恢复经验的神奇药水',color:'#6b7280'},
  {id:'coin_bag',icon:'💰',name:'金币袋',rarity:'common',desc:'装满金币的小袋子',color:'#6b7280'},
  {id:'lucky_charm',icon:'🍀',name:'幸运符',rarity:'rare',desc:'带来好运的四叶草',color:'#a855f7'},
  {id:'mystery_box',icon:'🎁',name:'神秘宝箱',rarity:'rare',desc:'里面藏着未知的惊喜',color:'#a855f7'},
  {id:'magic_scroll',icon:'📜',name:'魔法卷轴',rarity:'epic',desc:'记载着古老魔法的卷轴',color:'#3b82f6'},
  {id:'energy_crystal',icon:'💎',name:'能量水晶',rarity:'epic',desc:'蕴含强大能量的水晶',color:'#3b82f6'},
  {id:'time_hourglass',icon:'⏳',name:'时光沙漏',rarity:'legendary',desc:'可以倒流时间的神器',color:'#f59e0b'},
  {id:'star_fragment',icon:'⭐',name:'星星碎片',rarity:'legendary',desc:'从星空坠落的碎片',color:'#f59e0b'}
];
const ITEM_RARITY_NAMES={common:'普通',rare:'稀有',epic:'史诗',legendary:'传说'};
function bpGetItems(){return lsGet('backpack_items',[]);}
function bpAddItem(itemId){
  const items=bpGetItems();
  const item=CAPSULE_ITEMS.find(i=>i.id===itemId);
  if(!item)return null;
  items.push({...item,time:Date.now()});
  lsSet('backpack_items',items);
  return item;
}
function capsuleGetRandomItem(){
  const r=Math.random();
  let pool;
  if(r<0.50)pool=CAPSULE_ITEMS.filter(i=>i.rarity==='common');
  else if(r<0.80)pool=CAPSULE_ITEMS.filter(i=>i.rarity==='rare');
  else if(r<0.95)pool=CAPSULE_ITEMS.filter(i=>i.rarity==='epic');
  else pool=CAPSULE_ITEMS.filter(i=>i.rarity==='legendary');
  return pool[Math.floor(Math.random()*pool.length)];
}
let bpItemFilter='all';
function bpFilterItems(cat){
  bpItemFilter=cat;
  document.querySelectorAll('#bpItemTabs .bp-cat-tab').forEach(t=>t.classList.remove('active'));
  try{event.target.classList.add('active');}catch(e){}
  const grid=document.getElementById('bpItemGrid');
  const tip=document.getElementById('bpItemHideTip');
  if(grid){grid.style.display='grid';}
  if(tip){tip.style.display='none';}
  const hideBtn=document.querySelector('#bpItemTabs .bp-hide-btn');
  if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
  bpRenderItems();
}
function bpRenderItems(){
  const items=bpGetItems();
  const filtered=bpItemFilter==='all'?items:items.filter(i=>i.rarity===bpItemFilter);
  const grid=document.getElementById('bpItemGrid');
  if(!grid)return;
  // 更新计数
  const countAll=document.getElementById('bpItemCountAll');
  if(countAll)countAll.textContent=items.length;
  ['common','rare','epic','legendary'].forEach(r=>{
    const el=document.getElementById('bpItemCount'+r.charAt(0).toUpperCase()+r.slice(1));
    if(el)el.textContent=items.filter(i=>i.rarity===r).length;
  });
  if(filtered.length===0){
    grid.innerHTML='<div class="bp-empty" style="grid-column:1/-1;">还没有道具，去扭蛋机试试手气吧！</div>';
    return;
  }
  // 合并重复项，按道具名分组统计数量
  const itemMap={};
  filtered.forEach(it=>{
    const key=it.id;
    if(!itemMap[key])itemMap[key]={...it,count:0};
    itemMap[key].count++;
  });
  const mergedItems=Object.values(itemMap).sort((a,b)=>{
    const order={legendary:0,epic:1,rare:2,common:3};
    return order[a.rarity]-order[b.rarity];
  });
  grid.innerHTML=mergedItems.map(it=>
    '<div class="bp-card" style="border-color:'+it.color+';">'+
      '<div class="bp-icon">'+it.icon+'</div>'+
      '<div class="bp-name">'+it.name+'</div>'+
      '<div class="bp-time" style="color:'+it.color+';">'+ITEM_RARITY_NAMES[it.rarity]+' ×'+it.count+'</div>'+
      '<button class="common-btn" style="margin-top:8px;padding:4px 10px;font-size:11px;width:100%;" onclick="useItem(\''+it.id+'\')">✨ 使用</button>'+
    '</div>'
  ).join('');
}

