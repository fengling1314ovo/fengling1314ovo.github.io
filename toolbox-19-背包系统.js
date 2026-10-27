/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageBackpack", "<!-- pageBackpack -->\n<div class=\"tool-page\" id=\"pageBackpack\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px;\">\n      <h3>🎒 我的背包</h3>\n      <div class=\"bp-coins-bar\">\n        <span class=\"coin-icon\">💰</span>\n        <div>\n          <div class=\"coin-num\" id=\"bpCoins\">0</div>\n          <div class=\"coin-label\">金币余额</div>\n        </div>\n      </div>\n      <div class=\"bp-pinball-bar\">\n        <span class=\"pinball-icon\">🔮</span>\n        <div>\n          <div class=\"pinball-num\" id=\"bpPinballTotal\">0</div>\n          <div class=\"pinball-label\">弹珠总数</div>\n        </div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>🎴 卡牌收藏</h4>\n        <div class=\"bp-cat-tabs\" id=\"bpCardTabs\">\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterCards('all')\">全部<span class=\"count\" id=\"bpCountAll\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterCards('ssr')\">🌟 SSR<span class=\"count\" id=\"bpCountSsr\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterCards('sr')\">💎 SR<span class=\"count\" id=\"bpCountSr\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterCards('r')\">🔵 R<span class=\"count\" id=\"bpCountR\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterCards('n')\">⚪ N<span class=\"count\" id=\"bpCountN\">0</span></div>\n          <button class=\"bp-hide-btn\" onclick=\"bpToggleHide('bpCardGrid','bpCardHideTip',this)\">👁 显示</button>\n        </div>\n        <div class=\"bp-card-grid\" id=\"bpCardGrid\" style=\"display:none;\"></div>\n        <div class=\"bp-hide-tip\" id=\"bpCardHideTip\">已隐藏，查看请点全部按钮</div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>🔮 塔罗牌收藏</h4>\n        <div class=\"bp-cat-tabs\" id=\"bpTarotTabs\">\n          <div class=\"bp-cat-tab\" onclick=\"bpShowHide('bpTarotGrid','bpTarotHideTip');bpFilterTarot('all')\">全部<span class=\"count\" id=\"bpTarotCountAll\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterTarot('upright')\">☀️ 正位<span class=\"count\" id=\"bpTarotCountUp\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterTarot('reversed')\">🌙 逆位<span class=\"count\" id=\"bpTarotCountRev\">0</span></div>\n          <button class=\"bp-hide-btn\" onclick=\"bpToggleHide('bpTarotGrid','bpTarotHideTip',this)\">👁 显示</button>\n        </div>\n        <div class=\"bp-card-grid\" id=\"bpTarotGrid\" style=\"display:none;\"></div>\n        <div class=\"bp-hide-tip\" id=\"bpTarotHideTip\">已隐藏，查看请点全部按钮</div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>🪨 符文收藏</h4>\n        <div class=\"bp-cat-tabs\" id=\"bpRuneTabs\">\n          <div class=\"bp-cat-tab\" onclick=\"bpShowHide('bpRuneGrid','bpRuneHideTip');bpFilterRune('all')\">全部<span class=\"count\" id=\"bpRuneCountAll\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterRune('single')\">1️⃣ 单枚<span class=\"count\" id=\"bpRuneCountSingle\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterRune('triple')\">3️⃣ 三枚<span class=\"count\" id=\"bpRuneCountTriple\">0</span></div>\n          <button class=\"bp-hide-btn\" onclick=\"bpToggleHide('bpRuneGrid','bpRuneHideTip',this)\">👁 显示</button>\n        </div>\n        <div class=\"bp-card-grid\" id=\"bpRuneGrid\" style=\"display:none;\"></div>\n        <div class=\"bp-hide-tip\" id=\"bpRuneHideTip\">已隐藏，查看请点全部按钮</div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>🎴 雷诺曼收藏</h4>\n        <div class=\"bp-cat-tabs\" id=\"bpLenormandTabs\">\n          <div class=\"bp-cat-tab\" onclick=\"bpShowHide('bpLenormandGrid','bpLenormandHideTip');bpFilterLenormand('all')\">全部<span class=\"count\" id=\"bpLenormandCountAll\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterLenormand('single')\">1️⃣ 单牌<span class=\"count\" id=\"bpLenormandCountSingle\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterLenormand('triple')\">3️⃣ 三牌<span class=\"count\" id=\"bpLenormandCountTriple\">0</span></div>\n          <button class=\"bp-hide-btn\" onclick=\"bpToggleHide('bpLenormandGrid','bpLenormandHideTip',this)\">👁 显示</button>\n        </div>\n        <div class=\"bp-card-grid\" id=\"bpLenormandGrid\" style=\"display:none;\"></div>\n        <div class=\"bp-hide-tip\" id=\"bpLenormandHideTip\">已隐藏，查看请点全部按钮</div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>👼 神谕卡收藏</h4>\n        <div class=\"bp-cat-tabs\" id=\"bpOracleTabs\">\n          <div class=\"bp-cat-tab\" onclick=\"bpShowHide('bpOracleGrid','bpOracleHideTip');bpFilterOracle('all')\">全部<span class=\"count\" id=\"bpOracleCountAll\">0</span></div>\n          <button class=\"bp-hide-btn\" onclick=\"bpToggleHide('bpOracleGrid','bpOracleHideTip',this)\">👁 显示</button>\n        </div>\n        <div class=\"bp-card-grid\" id=\"bpOracleGrid\" style=\"display:none;\"></div>\n        <div class=\"bp-hide-tip\" id=\"bpOracleHideTip\">已隐藏，查看请点全部按钮</div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>🃏 基博卡收藏</h4>\n        <div class=\"bp-cat-tabs\" id=\"bpKipperTabs\">\n          <div class=\"bp-cat-tab\" onclick=\"bpShowHide('bpKipperGrid','bpKipperHideTip');bpFilterKipper('all')\">全部<span class=\"count\" id=\"bpKipperCountAll\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterKipper('single')\">1️⃣ 单牌<span class=\"count\" id=\"bpKipperCountSingle\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterKipper('triple')\">3️⃣ 三牌<span class=\"count\" id=\"bpKipperCountTriple\">0</span></div>\n          <button class=\"bp-hide-btn\" onclick=\"bpToggleHide('bpKipperGrid','bpKipperHideTip',this)\">👁 显示</button>\n        </div>\n        <div class=\"bp-card-grid\" id=\"bpKipperGrid\" style=\"display:none;\"></div>\n        <div class=\"bp-hide-tip\" id=\"bpKipperHideTip\">已隐藏，查看请点全部按钮</div>\n      </div>\n      <div class=\"bp-section\">\n        <h4 style=\"display:flex;align-items:center;justify-content:space-between;\">🎁 扭蛋机道具 <button onclick=\"openCapsuleRule()\" style=\"background:var(--primary);color:#fff;border:none;padding:4px 12px;border-radius:16px;font-size:12px;cursor:pointer;font-weight:600;\">? 规则</button></h4>\n        <div class=\"bp-cat-tabs\" id=\"bpItemTabs\">\n          <div class=\"bp-cat-tab\" onclick=\"bpShowHide('bpItemGrid','bpItemHideTip');bpFilterItems('all')\">全部<span class=\"count\" id=\"bpItemCountAll\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterItems('common')\">⚪ 普通<span class=\"count\" id=\"bpItemCountCommon\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterItems('rare')\">🟣 稀有<span class=\"count\" id=\"bpItemCountRare\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterItems('epic')\">🔵 史诗<span class=\"count\" id=\"bpItemCountEpic\">0</span></div>\n          <div class=\"bp-cat-tab\" onclick=\"bpFilterItems('legendary')\">🟡 传说<span class=\"count\" id=\"bpItemCountLegendary\">0</span></div>\n          <button class=\"bp-hide-btn showing\" onclick=\"bpToggleHide('bpItemGrid','bpItemHideTip',this)\">🙈 隐藏</button>\n        </div>\n        <div class=\"bp-card-grid\" id=\"bpItemGrid\" style=\"display:grid;\"></div>\n        <div class=\"bp-hide-tip\" id=\"bpItemHideTip\" style=\"display:none;\">已隐藏，查看请点全部按钮</div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>🏆 游戏收益统计</h4>\n        <div class=\"bp-stats-list\" id=\"bpStatsList\"></div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>💸 金币消耗统计</h4>\n        <div class=\"bp-stats-list\" id=\"bpSpentList\"></div>\n      </div>\n      <div class=\"bp-section\">\n        <h4>📦 数据管理</h4>\n        <div style=\"display:flex;gap:10px;flex-wrap:wrap;\">\n          <button onclick=\"exportAllData()\" style=\"flex:1;min-width:120px;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;border:none;padding:12px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(16,185,129,0.3);\">\n            📤 导出数据\n          </button>\n          <button onclick=\"document.getElementById('importFileInput').click()\" style=\"flex:1;min-width:120px;background:linear-gradient(135deg,#6366f1,#818cf8);color:#fff;border:none;padding:12px;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 2px 8px rgba(99,102,241,0.3);\">\n            📥 导入数据\n          </button>\n          <input type=\"file\" id=\"importFileInput\" accept=\".json\" style=\"display:none;\" onchange=\"importAllData(this)\">\n        </div>\n        <p style=\"font-size:12px;color:var(--text-placeholder);margin-top:10px;text-align:center;\">导出会保存所有金币、卡牌、宠物等数据；导入将覆盖当前所有数据，请谨慎操作~</p>\n      </div>\n    </div>\n  </div>");
// ==================== 背包系统 ====================
const BP_CARD_NAMES={
  ssr:['传说之剑','神龙宝珠','时空沙漏','凤凰之羽','星辰王冠','永恒钻石','混沌之心','神圣圣杯'],
  sr:['魔法卷轴','精灵之弓','暗影匕首','圣光护甲','烈焰法杖','寒冰戒指','风暴之靴','生命护符'],
  r:['铁剑','皮甲','治疗药水','魔法水晶','探险地图','幸运硬币','指南针','望远镜'],
  n:['木棍','面包','水壶','麻绳','火把','铜币','羽毛','石头']
};
const BP_CARD_ICONS={ssr:'🌟',sr:'💎',r:'🔵',n:'⚪'};
const BP_GAME_NAMES={
  slot:'🎰 老虎机', gacha:'🎴 抽卡模拟器', minesweeper:'💣 扫雷',
  ttt:'⭕ 井字棋', memory:'🃏 记忆翻牌', whack:'🔨 打地鼠', guess:'🎯 猜数字', rps:'✊ 石头剪刀布',
  game24:'➗ 24点', idiomChain:'🐲 成语接龙', checkin:'📅 每日签到', wheel:'🎡 幸运转盘'
};
const BP_SPENT_NAMES={
  gacha:'🎴 抽卡模拟器', slot:'🎰 老虎机', tarot:'🔮 塔罗牌', rune:'🪨 符文占卜',
  lenormand:'🎴 雷诺曼卡牌', oracle:'👼 天使神谕卡', kipper:'🃏 基博卡', capsule:'🥚 扭蛋机',
  numerology:'🔢 数字命理学', tealeaf:'🍵 茶叶占卜', crystalball:'🔮 水晶球占卜'
};

function bpAddCard(rarity){
  const cards=lsGet('backpack_cards',[]);
  const names=BP_CARD_NAMES[rarity]||BP_CARD_NAMES.n;
  const name=names[Math.floor(Math.random()*names.length)];
  cards.push({rarity,name,icon:BP_CARD_ICONS[rarity]||'⚪',time:Date.now()});
  lsSet('backpack_cards',cards);
  if(pageBackpack&&pageBackpack.style.display==='block')bpRender();
  return name;
}
let bpCurrentFilter='ssr';
function bpFilterCards(cat){
  bpCurrentFilter=cat;
  document.querySelectorAll('#bpCardTabs .bp-cat-tab').forEach(t=>t.classList.remove('active'));
  try{event.target.classList.add('active');}catch(e){}
  const grid=document.getElementById('bpCardGrid');
  const tip=document.getElementById('bpCardHideTip');
  if(grid){grid.style.display='grid';}
  if(tip){tip.style.display='none';}
  const hideBtn=document.querySelector('#bpCardTabs .bp-hide-btn');
  if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
  bpRenderCards();
}
function bpRenderCards(){
  const cards=lsGet('backpack_cards',[]);
  const filtered=bpCurrentFilter==='all'?cards:cards.filter(c=>c.rarity===bpCurrentFilter);
  const grid=document.getElementById('bpCardGrid');
  if(!grid)return;
  if(filtered.length===0){
    grid.innerHTML='<div class="bp-empty" style="grid-column:1/-1;">还没有卡牌，去抽卡模拟器试试手气吧！</div>';
    return;
  }
  // 合并重复项，按牌名分组统计数量
  const cardMap={};
  filtered.forEach(c=>{
    const key=c.name;
    if(!cardMap[key])cardMap[key]={...c,count:0};
    cardMap[key].count++;
  });
  const mergedCards=Object.values(cardMap).sort((a,b)=>b.count-a.count);
  grid.innerHTML=mergedCards.map(c=>{
    return '<div class="bp-card '+c.rarity+'" style="position:relative;cursor:pointer;" onclick="bpShowCardDetail(\''+c.name+'\')">'+
      (c.count>1?'<div style="position:absolute;top:4px;right:4px;background:var(--primary);color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:bold;">x'+c.count+'</div>':'')+
      '<div class="bp-icon">'+c.icon+'</div><div class="bp-name">'+c.name+'</div><div class="bp-time">'+c.rarity.toUpperCase()+'</div></div>';
  }).join('');
}


/* 背包专属样式与详情弹窗由背包模块维护；全站弹窗材质仍沿用 index.html 的公共规则。 */
(function installBackpackPageStyles(){
  if(document.getElementById('flBackpackPageStyles')) return;
  /* Styles moved to css/toolbox-19-背包系统.css. */
})();

(function mountBackpackDetailModals(){
  if(!document.body) return;
  if(!document.getElementById('runeDetailModal')) document.body.insertAdjacentHTML('beforeend', `
<div class="bp-modal-overlay" id="runeDetailModal">
  <div class="bp-modal-content">
    <div class="bp-modal-header">
      <span id="runeDetailTitle">符文详情</span>
      <button class="bp-modal-close" onclick="bpCloseRuneDetail()">✕</button>
    </div>
    <div class="bp-modal-body" id="runeDetailBody"></div>
  </div>
</div>`);
  if(!document.getElementById('cardDetailModal')) document.body.insertAdjacentHTML('beforeend', `
<div class="bp-modal-overlay" id="cardDetailModal">
  <div class="bp-modal-content">
    <div class="bp-modal-header">
      <span id="cardDetailTitle">卡牌详情</span>
      <button class="bp-modal-close" onclick="bpCloseCardDetail()">✕</button>
    </div>
    <div class="bp-modal-body" id="cardDetailBody"></div>
  </div>
</div>`);
})();

window.addEventListener('fl:tool-page-enter',function(event){
  if(event.detail?.name==='backpack' && typeof bpRender==='function') bpRender();
});