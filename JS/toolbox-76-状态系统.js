
/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageDailyTaskPage", "<!-- pageDailyTaskPage -->\n<div class=\"tool-page\" id=\"pageDailyTaskPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromDailyTask()\"><span>←</span> <span id=\"dailyTaskBackText\">返回</span></button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📋 每日任务</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">每天0点自动刷新，签到+做任务领金币~</div>\n      \n      <!-- 签到区域 -->\n      <div class=\"fortune-today-card\" style=\"text-align:center;margin-bottom:14px;\">\n        <div id=\"checkinStatus\" style=\"font-size:15px;margin:12px 0;\"></div>\n        <div id=\"checkinWeek\" style=\"display:flex;gap:8px;justify-content:center;margin:16px 0;flex-wrap:wrap;\"></div>\n        <button class=\"common-btn\" id=\"checkinBtn\" onclick=\"checkinDo()\">✅ 签到</button>\n        <div style=\"margin-top:14px;font-size:13px;color:var(--text-secondary);line-height:1.9;\">\n          连续签到第 <b id=\"checkinStreak\" style=\"color:var(--primary);\"></b> 天 · \n          累计签到 <b id=\"checkinTotal\" style=\"color:var(--primary);\"></b> 天 · \n          共获得 <b id=\"checkinCoins\" style=\"color:var(--primary);\"></b> 金币<br>\n          <span style=\"font-size:12px;color:var(--text-placeholder);\">基础10金币，连签越多奖励越多！</span>\n        </div>\n      </div>\n      \n      <!-- 任务进度概览 -->\n      <div style=\"background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:0 2px 12px rgba(245,158,11,0.15);\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <div>\n            <div style=\"font-size:14px;font-weight:700;color:#92400e;\">今日进度</div>\n            <div style=\"font-size:12px;color:#b45309;margin-top:2px;\" id=\"dailyTaskDate\">--</div>\n          </div>\n          <div style=\"text-align:right;\">\n            <div style=\"font-size:24px;font-weight:700;color:#d97706;\" id=\"dailyTaskProgress\">0/10</div>\n            <div style=\"font-size:11px;color:#b45309;\">已完成任务</div>\n          </div>\n        </div>\n        <div style=\"height:10px;background:rgba(255,255,255,0.5);border-radius:5px;overflow:hidden;margin-top:10px;\">\n          <div id=\"dailyTaskBar\" style=\"height:100%;background:linear-gradient(90deg,#f59e0b,#d97706);border-radius:5px;width:0%;transition:width 0.3s;\"></div>\n        </div>\n        <div style=\"display:flex;justify-content:space-between;margin-top:8px;\">\n          <span style=\"font-size:12px;color:#92400e;\">已领奖励：<span id=\"dailyTaskClaimed\">0</span> 💰</span>\n          <span style=\"font-size:12px;color:#92400e;\">可领奖励：<span id=\"dailyTaskTotal\">0</span> 💰</span>\n        </div>\n      </div>\n      \n      <!-- 任务列表 -->\n      <div id=\"dailyTaskList\" style=\"display:grid;gap:10px;\">\n        <!-- 任务由JS生成 -->\n      </div>\n    </div>\n  </div>");
// ==================== 新增工具：每日签到 ====================
function checkinGetData(){
  return lsGet('checkin_data',{days:[],coins:0});
}
function checkinStreak(days){
  let streak=0;
  const d=new Date();
  while(true){
    const ds=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
    if(days.includes(ds)){streak++;d.setDate(d.getDate()-1);}
    else break;
  }
  return streak;
}
function checkinRender(){
  const data=checkinGetData();
  const today=getTodaySeed();
  const done=data.days.includes(today);
  const streak=checkinStreak(data.days);
  const status=document.getElementById('checkinStatus');
  const btn=document.getElementById('checkinBtn');
  if(status){
    status.innerHTML=done?'✅ 今日已签到，明天再来吧！':'☀️ 今日尚未签到，点击下方按钮领取金币！';
  }
  if(btn)btn.disabled=done;
  const s=document.getElementById('checkinStreak'),t=document.getElementById('checkinTotal'),c=document.getElementById('checkinCoins');
  if(s)s.textContent=streak;
  if(t)t.textContent=data.days.length;
  if(c)c.textContent=data.coins;
  const weekEl=document.getElementById('checkinWeek');
  if(weekEl){
    const days=['日','一','二','三','四','五','六'];
    let html='';
    for(let i=6;i>=0;i--){
      const d=new Date();d.setDate(d.getDate()-i);
      const ds=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
      const isToday=(ds===today);
      const checked=data.days.includes(ds);
      html+='<div style="text-align:center;padding:8px 12px;background:'+(checked?'var(--primary)':'var(--bg-input)')+';border:1px solid '+(checked?'var(--primary)':'var(--border-color)')+';border-radius:10px;'+(isToday?'outline:2px solid var(--primary);outline-offset:2px;':'')+'">'+
        '<div style="font-size:11px;color:'+(checked?'#fff':'var(--text-secondary)')+';">周'+days[d.getDay()]+'</div>'+
        '<div style="font-size:17px;'+(checked?'color:#fff;':'color:var(--text-placeholder);')+'">'+(checked?'✓':'·')+'</div>'+
        '</div>';
    }
    weekEl.innerHTML=html;
  }
}
function checkinDo(){
  const data=checkinGetData();
  const today=getTodaySeed();
  if(data.days.includes(today)){showToast('今天已经签过到啦');return;}
  data.days.push(today);
  const streak=checkinStreak(data.days);
  const base=10;
  const bonus=Math.min(streak-1,5)*2;
  const reward=base+bonus;
  data.coins+=reward;
  lsSet('checkin_data',data);
  bpAddCoins(reward,'checkin');
  checkinRender();
  showToast('🎉 签到成功！连续'+streak+'天，获得'+reward+'金币');
  // 每日任务进度
  if(typeof updateDailyTask === 'function') updateDailyTask('daily_checkin', 1);
  // 如果当前在每日任务页面，刷新
  if(pageDailyTaskPage && pageDailyTaskPage.style.display === 'block' && typeof renderDailyTasks === 'function'){
    renderDailyTasks();
  }
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageToyShopPage", "<!-- pageToyShopPage -->\n<div class=\"tool-page\" id=\"pageToyShopPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🪶 猫咪用品商店</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">给小橘买玩具和用品，陪它玩耍提升好感度~ 点击物品购买后放入仓库，再从仓库使用！</div>\n      \n      <!-- 小橘状态 -->\n      <div class=\"fl-state-material-card\" style=\"padding:16px;margin-bottom:14px;\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <div style=\"display:flex;align-items:center;\">\n            <div style=\"font-size:48px;\" id=\"toyPetEmoji\">🐱</div>\n            <div style=\"margin-left:12px;\">\n              <div style=\"font-size:16px;font-weight:700;\">小橘</div>\n              <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"toyPetMood\">心情不错~</div>\n            </div>\n          </div>\n          <div style=\"text-align:right;flex-shrink:0;min-width:80px;\">\n            <div style=\"display:inline-block;background:#fce7f3;color:#ec4899;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;white-space:nowrap;\">\n              💕 <span id=\"toyPetAffection\">50</span>\n            </div>\n            <div style=\"font-size:11px;color:#666;margin-top:5px;white-space:nowrap;\">💰 <span id=\"toyCoins\">0</span></div>\n          </div>\n        </div>\n        <div style=\"margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;\">\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🍖 饱食</span>\n              <span id=\"toyHungerText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"toyHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🧼 清洁</span>\n              <span id=\"toyCleanText\">100/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"toyCleanBar\" style=\"height:100%;background:linear-gradient(90deg,#60a5fa,#34d399);border-radius:4px;width:100%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>💕 好感</span>\n              <span id=\"toyAffectionText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"toyAffectionBar\" style=\"height:100%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      \n      <!-- 玩具列表 -->\n      <div id=\"toyShopList\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 玩具列表由JS生成 -->\n      </div>\n    </div>\n  </div>");
// ==================== 猫咪用品商店系统 ====================
// 初始化猫咪用品商店页面
function initToyShop(){
  renderToyShopList();
  updateToyShopDisplay();
}

// 更新猫咪用品商店页面显示
function updateToyShopDisplay(){
  const hunger = lsGet('pet_hunger', 50);
  const hungerPercent = Math.max(0, Math.min(100, hunger));
  const clean = lsGet('pet_clean', 100);
  const cleanPercent = Math.max(0, Math.min(100, clean));
  const affection = lsGet('pet_affection', 50);
  const affectionPercent = Math.max(0, Math.min(100, affection));
  
  // 根据状态更新表情和心情
  let mood, emoji;
  if(hungerPercent >= 80 && cleanPercent >= 80){ mood='吃饱喝足，超级开心~'; emoji='😺'; }
  else if(hungerPercent >= 50 && cleanPercent >= 50){ mood='心情不错~'; emoji='🐱'; }
  else if(hungerPercent >= 20 && cleanPercent >= 20){ mood='有点饿了/该洗澡了...'; emoji='😿'; }
  else{ mood='快饿晕啦/脏死啦，快照顾我！'; emoji='😾'; }
  if(cleanPercent < 30){ emoji = '🥺'; mood = '脏死啦，快给我洗澡！'; }
  
  const elEmoji = document.getElementById('toyPetEmoji');
  const elMood = document.getElementById('toyPetMood');
  const elAffection = document.getElementById('toyPetAffection');
  const elCoins = document.getElementById('toyCoins');
  const elHungerText = document.getElementById('toyHungerText');
  const elHungerBar = document.getElementById('toyHungerBar');
  const elCleanText = document.getElementById('toyCleanText');
  const elCleanBar = document.getElementById('toyCleanBar');
  const elAffectionText = document.getElementById('toyAffectionText');
  const elAffectionBar = document.getElementById('toyAffectionBar');
  
  if(elEmoji) elEmoji.textContent = emoji;
  if(elMood) elMood.textContent = mood;
  if(elAffection) elAffection.textContent = affectionPercent;
  if(elCoins) elCoins.textContent = bpGetCoins();
  if(elHungerText) elHungerText.textContent = hungerPercent + '/100';
  if(elHungerBar) elHungerBar.style.width = hungerPercent + '%';
  if(elCleanText) elCleanText.textContent = cleanPercent + '/100';
  if(elCleanBar) elCleanBar.style.width = cleanPercent + '%';
  if(elAffectionText) elAffectionText.textContent = affectionPercent + '/100';
  if(elAffectionBar) elAffectionBar.style.width = affectionPercent + '%';
}

// 渲染玩具列表
function renderToyShopList(){
  const container = document.getElementById('toyShopList');
  if(!container) return;
  container.innerHTML = '';
  PET_TOYS.forEach(toy => {
    const div = document.createElement('div');
    div.className = 'fl-state-material-card';
      div.style.cssText = 'padding:16px;text-align:center;cursor:pointer;transition:transform 0.2s;';
    div.onmouseover = () => {div.style.transform='scale(1.03)';div.style.borderColor='#a78bfa';};
    div.onmouseout = () => {div.style.transform='scale(1)';div.style.borderColor='transparent';};
    div.onclick = () => showBuyQuantityModal(toy, 'toy');
    div.innerHTML = `
      <div style="font-size:36px;">${toy.emoji}</div>
      <div style="font-size:15px;font-weight:700;margin-top:8px;">${toy.name}</div>
      <div style="font-size:12px;color:#666;margin-top:4px;">+${toy.affection}好感度</div>
      <div style="margin-top:8px;display:inline-block;background:#fce7f3;color:#ec4899;padding:4px 12px;border-radius:12px;font-size:13px;font-weight:700;">
        💰 ${toy.cost}
      </div>
    `;
    container.appendChild(div);
  });
}





/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageCleanShopPage", "<!-- pageCleanShopPage -->\n<div class=\"tool-page\" id=\"pageCleanShopPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🧼 清洁商店</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">给小橘买清洁用品，保持干净~ 点击物品购买后放入仓库，再从仓库使用！</div>\n      \n      <!-- 小橘状态 -->\n      <div class=\"fl-state-material-card\" style=\"padding:16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;\">\n        <div style=\"display:flex;align-items:center;\">\n          <div style=\"font-size:48px;\" id=\"cleanPetEmoji\">🐱</div>\n          <div style=\"margin-left:12px;\">\n            <div style=\"font-size:16px;font-weight:700;\">小橘</div>\n            <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"cleanPetMood\">心情不错~</div>\n          </div>\n        </div>\n        <div style=\"text-align:right;flex-shrink:0;min-width:80px;\">\n          <div style=\"display:inline-block;background:#dbeafe;color:#3b82f6;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;white-space:nowrap;\">\n            🧼 <span id=\"cleanPetClean\">100</span>\n          </div>\n          <div style=\"font-size:11px;color:#666;margin-top:5px;white-space:nowrap;\">💰 <span id=\"cleanCoins\">0</span></div>\n        </div>\n      </div>\n      \n      <!-- 清洁用品列表 -->\n      <div id=\"cleanShopList\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 清洁用品列表由JS生成 -->\n      </div>\n    </div>\n  </div>");
// ==================== 清洁商店系统 ====================
// 初始化清洁商店页面
function initCleanShop(){
  renderCleanShopList();
  updateCleanShopDisplay();
}

// 更新清洁商店页面显示
function updateCleanShopDisplay(){
  const clean = lsGet('pet_clean', 100);
  const cleanPercent = Math.max(0, Math.min(100, clean));
  const hunger = lsGet('pet_hunger', 50);
  const hungerPercent = Math.max(0, Math.min(100, hunger));
  const affection = lsGet('pet_affection', 50);
  const affectionPercent = Math.max(0, Math.min(100, affection));
  
  // 根据状态更新表情和心情
  let mood, emoji;
  if(hungerPercent >= 80 && cleanPercent >= 80){ mood='吃饱喝足，超级开心~'; emoji='😺'; }
  else if(hungerPercent >= 50 && cleanPercent >= 50){ mood='心情不错~'; emoji='🐱'; }
  else if(hungerPercent >= 20 && cleanPercent >= 20){ mood='有点饿了/该洗澡了...'; emoji='😿'; }
  else{ mood='快饿晕啦/脏死啦，快照顾我！'; emoji='😾'; }
  if(cleanPercent < 30){ emoji = '🥺'; mood = '脏死啦，快给我洗澡！'; }
  
  const elEmoji = document.getElementById('cleanPetEmoji');
  const elMood = document.getElementById('cleanPetMood');
  const elClean = document.getElementById('cleanPetClean');
  const elCoins = document.getElementById('cleanCoins');
  const elAffection = document.getElementById('cleanPetAffection');
  if(elEmoji) elEmoji.textContent = emoji;
  if(elMood) elMood.textContent = mood;
  if(elClean) elClean.textContent = cleanPercent;
  if(elCoins) elCoins.textContent = bpGetCoins();
  if(elAffection) elAffection.textContent = affectionPercent;
}

// 渲染清洁用品列表
function renderCleanShopList(){
  const container = document.getElementById('cleanShopList');
  if(!container) return;
  container.innerHTML = '';
  PET_CLEAN_ITEMS.forEach(item => {
    const div = document.createElement('div');
    div.className = 'fl-state-material-card';
      div.style.cssText = 'padding:16px;text-align:center;cursor:pointer;transition:transform 0.2s;';
    div.onmouseover = () => {div.style.transform='scale(1.03)';div.style.borderColor='#3b82f6';};
    div.onmouseout = () => {div.style.transform='scale(1)';div.style.borderColor='transparent';};
    div.onclick = () => showBuyQuantityModal(item, 'clean');
    div.innerHTML = `
      <div style="font-size:36px;">${item.emoji}</div>
      <div style="font-size:15px;font-weight:700;margin-top:8px;">${item.name}</div>
      <div style="font-size:12px;color:#666;margin-top:4px;">+${item.clean}清洁值</div>
      <div style="margin-top:8px;display:inline-block;background:#dbeafe;color:#3b82f6;padding:4px 12px;border-radius:12px;font-size:13px;font-weight:700;">
        💰 ${item.cost}
      </div>
    `;
    container.appendChild(div);
  });
}





/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageCollectionRecordPage", "<!-- pageCollectionRecordPage -->\n<div class=\"tool-page\" id=\"pageCollectionRecordPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('petPlayPage')\"><span>←</span> 返回出去玩</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;\">\n        <h3 style=\"margin:0;\">📜 获得记录</h3>\n        <button onclick=\"clearCollectionHistory()\" style=\"background:#fee2e2;color:#dc2626;border:none;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;\">清空记录</button>\n      </div>\n      <div id=\"collectionHistoryContent\">\n        <!-- 获得记录由JS生成 -->\n      </div>\n    </div>\n  </div>");
window.flRegisterToolPage("pageUsageStatsPage", "<!-- pageUsageStatsPage -->\n<div class=\"tool-page\" id=\"pageUsageStatsPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📊 小橘使用统计</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">看看小橘一共用了哪些好吃的、好玩的~</div>\n      \n      <!-- 统计概览 -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px;margin-bottom:16px;\">\n        <div style=\"background:linear-gradient(135deg,#fee2e2,#fecaca);border-radius:12px;padding:14px;text-align:center;\">\n          <div style=\"font-size:28px;\">🍖</div>\n          <div style=\"font-size:12px;color:#991b1b;margin-top:4px;\">食物</div>\n          <div style=\"font-size:20px;font-weight:700;color:#dc2626;margin-top:2px;\" id=\"statsFoodCount\">0</div>\n        </div>\n        <div style=\"background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:12px;padding:14px;text-align:center;\">\n          <div style=\"font-size:28px;\">🧼</div>\n          <div style=\"font-size:12px;color:#1e40af;margin-top:4px;\">清洁用品</div>\n          <div style=\"font-size:20px;font-weight:700;color:#2563eb;margin-top:2px;\" id=\"statsCleanCount\">0</div>\n        </div>\n        <div style=\"background:linear-gradient(135deg,#fce7f3,#fbcfe8);border-radius:12px;padding:14px;text-align:center;\">\n          <div style=\"font-size:28px;\">🪶</div>\n          <div style=\"font-size:12px;color:#9d174d;margin-top:4px;\">玩具</div>\n          <div style=\"font-size:20px;font-weight:700;color:#db2777;margin-top:2px;\" id=\"statsToyCount\">0</div>\n        </div>\n        <div style=\"background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:14px;text-align:center;\">\n          <div style=\"font-size:28px;\">✨</div>\n          <div style=\"font-size:12px;color:#92400e;margin-top:4px;\">超级道具</div>\n          <div style=\"font-size:20px;font-weight:700;color:#d97706;margin-top:2px;\" id=\"statsSuperItemCount\">0</div>\n        </div>\n      </div>\n      \n      <!-- 详细使用记录 -->\n      <div class=\"fl-state-material-card\" style=\"padding:16px;\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;\">\n          <div style=\"font-size:15px;font-weight:700;\">📝 使用记录</div>\n          <button onclick=\"clearUsageHistory()\" style=\"background:#fef2f2;color:#ef4444;border:none;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;\">清空记录</button>\n        </div>\n        <div id=\"usageHistoryList\" style=\"display:flex;flex-direction:column;gap:8px;max-height:500px;overflow-y:auto;\">\n          <!-- 使用记录由JS生成 -->\n        </div>\n        <div id=\"usageHistoryEmpty\" style=\"display:none;text-align:center;padding:30px;color:#999;\">\n          <div style=\"font-size:48px;\">📭</div>\n          <div style=\"font-size:14px;margin-top:10px;\">还没有使用记录哦~</div>\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 使用记录系统 ====================
// 记录使用历史
function recordUsage(type, itemId, itemName, itemEmoji){
  const history = lsGet('pet_usage_history', []);
  const record = {
    id: 'usage_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: type, // food / clean / toy / superItem
    itemId: itemId,
    itemName: itemName,
    itemEmoji: itemEmoji,
    timestamp: Date.now()
  };
  history.unshift(record); // 最新的放最前面
  // 最多保留500条记录
  if(history.length > 500) history.length = 500;
  lsSet('pet_usage_history', history);
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageWarehousePage", "<!-- pageWarehousePage -->\n<div class=\"tool-page\" id=\"pageWarehousePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📦 宠物仓库</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">从商店购买的食物、清洁用品和猫咪玩具都存放在这里，点击物品即可使用~</div>\n      \n      <!-- 小橘状态 -->\n      <div class=\"fl-state-material-card\" style=\"padding:16px;margin-bottom:14px;\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <div style=\"display:flex;align-items:center;\">\n            <div style=\"font-size:48px;\" id=\"warehousePetEmoji\">🐱</div>\n            <div style=\"margin-left:12px;\">\n              <div style=\"font-size:16px;font-weight:700;\">小橘</div>\n              <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"warehousePetMood\">心情不错~</div>\n            </div>\n          </div>\n        </div>\n        <div style=\"margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;\">\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🍖 饱食</span>\n              <span id=\"warehouseHungerText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"warehouseHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:4px;width:50%;transition:width 0.3s;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🧼 清洁</span>\n              <span id=\"warehouseCleanText\">100/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"warehouseCleanBar\" style=\"height:100%;background:linear-gradient(90deg,#60a5fa,#34d399);border-radius:4px;width:100%;transition:width 0.3s;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>💕 好感</span>\n              <span id=\"warehouseAffectionText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"warehouseAffectionBar\" style=\"height:100%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:4px;width:50%;transition:width 0.3s;\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      \n      <!-- Tab切换 -->\n      <div style=\"display:flex;gap:8px;margin-bottom:14px;\">\n        <button id=\"warehouseTabFood\" onclick=\"switchWarehouseTab('food')\" style=\"flex:1;padding:10px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#ff9a9e,#fecfef);color:#fff;box-shadow:0 2px 8px rgba(255,154,158,0.3);\">\n          🍖 食物 <span id=\"warehouseFoodCount\" style=\"background:rgba(255,255,255,0.3);border-radius:8px;padding:1px 6px;font-size:11px;\">0</span>\n        </button>\n        <button id=\"warehouseTabClean\" onclick=\"switchWarehouseTab('clean')\" style=\"flex:1;padding:10px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;background:var(--bg-input);color:var(--text-secondary);\">\n          🧼 清洁 <span id=\"warehouseCleanCount\" style=\"background:rgba(0,0,0,0.08);border-radius:8px;padding:1px 6px;font-size:11px;\">0</span>\n        </button>\n        <button id=\"warehouseTabToy\" onclick=\"switchWarehouseTab('toy')\" style=\"flex:1;padding:10px;border:none;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;background:var(--bg-input);color:var(--text-secondary);\">\n          🪶 玩具 <span id=\"warehouseToyCount\" style=\"background:rgba(0,0,0,0.08);border-radius:8px;padding:1px 6px;font-size:11px;\">0</span>\n        </button>\n      </div>\n      \n      <!-- 食物列表 -->\n      <div id=\"warehouseFoodList\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 食物列表由JS生成 -->\n      </div>\n      \n      <!-- 清洁用品列表 -->\n      <div id=\"warehouseCleanList\" style=\"display:none;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 清洁用品列表由JS生成 -->\n      </div>\n      \n      <!-- 玩具列表 -->\n      <div id=\"warehouseToyList\" style=\"display:none;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 玩具列表由JS生成 -->\n      </div>\n      \n      <!-- 空状态 -->\n      <div id=\"warehouseEmpty\" style=\"display:none;text-align:center;padding:40px 20px;color:var(--text-placeholder);\">\n        <div style=\"font-size:48px;\">📭</div>\n        <div style=\"font-size:14px;margin-top:10px;\" id=\"warehouseEmptyText\">仓库空空如也，去商店买点东西吧~</div>\n        <div style=\"margin-top:14px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;\">\n          <button onclick=\"openPage('foodShopPage')\" style=\"padding:8px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#ff9a9e,#fecfef);color:#fff;font-size:13px;font-weight:600;cursor:pointer;\">去食物商店</button>\n          <button onclick=\"openPage('cleanShopPage')\" style=\"padding:8px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#60a5fa,#34d399);color:#fff;font-size:13px;font-weight:600;cursor:pointer;\">去清洁商店</button>\n          <button onclick=\"openPage('toyShopPage')\" style=\"padding:8px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#a78bfa,#f472b6);color:#fff;font-size:13px;font-weight:600;cursor:pointer;\">去猫咪用品商店</button>\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 宠物仓库系统 ====================
// 仓库数据结构: {foods: {fish: 2, meat: 1}, cleans: {towel: 3, soap: 1}}

// 获取仓库数据
function getWarehouse(){
  const wh = lsGet('pet_warehouse', null);
  if(!wh || typeof wh !== 'object'){
    return {foods:{}, cleans:{}, toys:{}};
  }
  if(!wh.foods) wh.foods = {};
  if(!wh.cleans) wh.cleans = {};
  if(!wh.toys) wh.toys = {};
  // 清理数据：把对象结构统一转换成数字结构
  ['foods','cleans','toys'].forEach(key => {
    for(let k in wh[key]){
      const item = wh[key][k];
      if(item && typeof item === 'object' && 'count' in item){
        wh[key][k] = parseInt(item.count) || 0;
      } else {
        wh[key][k] = parseInt(item) || 0;
      }
      if(wh[key][k] <= 0) delete wh[key][k];
    }
  });
  return wh;
}

// 保存仓库数据
function saveWarehouse(wh){
  lsSet('pet_warehouse', wh);
}

// 类型映射
function whTypeKey(type){
  if(type === 'food') return 'foods';
  if(type === 'clean') return 'cleans';
  if(type === 'toy') return 'toys';
  return 'foods';
}

// 添加物品到仓库
function addToWarehouse(type, id){
  const wh = getWarehouse();
  const key = whTypeKey(type);
  wh[key][id] = (wh[key][id] || 0) + 1;
  saveWarehouse(wh);
}

// 从仓库移除物品（返回是否成功）
function removeFromWarehouse(type, id){
  const wh = getWarehouse();
  const key = whTypeKey(type);
  const item = wh[key][id];
  if(!item) return false;
  
  let count = typeof item === 'object' ? (item.count || 0) : (item || 0);
  if(count <= 0) return false;
  
  count--;
  if(count <= 0) delete wh[key][id];
  else if(typeof item === 'object') wh[key][id].count = count;
  else wh[key][id] = count;
  
  saveWarehouse(wh);
  return true;
}

// 获取仓库某类物品总数
function getWarehouseTotal(type){
  const wh = getWarehouse();
  const key = whTypeKey(type);
  let total = 0;
  for(let k in wh[key]){
    const item = wh[key][k];
    if(item && typeof item === 'object' && 'count' in item){
      total += parseInt(item.count) || 0;
    } else {
      total += parseInt(item) || 0;
    }
  }
  return total;
}

// 获取仓库全部物品总数
function getWarehouseAllTotal(){
  return getWarehouseTotal('food') + getWarehouseTotal('clean') + getWarehouseTotal('toy');
}

// 更新仓库角标（个人状态页面按钮上的数字）
function updateWarehouseBadge(){
  const el = document.getElementById('warehouseBadge');
  if(el) el.textContent = getWarehouseAllTotal();
}

// 当前仓库Tab
let currentWarehouseTab = 'food';

// 初始化仓库页面
function initWarehouse(){
  currentWarehouseTab = 'food';
  switchWarehouseTab('food');
  updateWarehousePetDisplay();
  updateWarehouseBadge();
}

// 切换仓库Tab
function switchWarehouseTab(tab){
  currentWarehouseTab = tab;
  const tabFood = document.getElementById('warehouseTabFood');
  const tabClean = document.getElementById('warehouseTabClean');
  const tabToy = document.getElementById('warehouseTabToy');
  const listFood = document.getElementById('warehouseFoodList');
  const listClean = document.getElementById('warehouseCleanList');
  const listToy = document.getElementById('warehouseToyList');
  const empty = document.getElementById('warehouseEmpty');
  
  // 重置所有tab样式
  const tabs = [{el:tabFood, active:'linear-gradient(135deg,#ff9a9e,#fecfef)', shadow:'0 2px 8px rgba(255,154,158,0.3)'},
                {el:tabClean, active:'linear-gradient(135deg,#60a5fa,#34d399)', shadow:'0 2px 8px rgba(96,165,250,0.3)'},
                {el:tabToy, active:'linear-gradient(135deg,#a78bfa,#f472b6)', shadow:'0 2px 8px rgba(167,139,250,0.3)'}];
  const activeIdx = tab === 'food' ? 0 : tab === 'clean' ? 1 : 2;
  tabs.forEach((t, i) => {
    if(t.el){
      if(i === activeIdx){
        t.el.style.background = t.active;
        t.el.style.color = '#fff';
        t.el.style.boxShadow = t.shadow;
      } else {
        t.el.style.background = 'var(--bg-input)';
        t.el.style.color = 'var(--text-secondary)';
        t.el.style.boxShadow = 'none';
      }
    }
  });
  
  // 显示对应列表
  if(listFood) listFood.style.display = tab === 'food' ? 'grid' : 'none';
  if(listClean) listClean.style.display = tab === 'clean' ? 'grid' : 'none';
  if(listToy) listToy.style.display = tab === 'toy' ? 'grid' : 'none';
  
  // 渲染对应列表
  if(tab === 'food') renderWarehouseFoodList();
  else if(tab === 'clean') renderWarehouseCleanList();
  else if(tab === 'toy') renderWarehouseToyList();
  
  // 更新Tab上的数量
  const elFoodCount = document.getElementById('warehouseFoodCount');
  const elCleanCount = document.getElementById('warehouseCleanCount');
  const elToyCount = document.getElementById('warehouseToyCount');
  if(elFoodCount) elFoodCount.textContent = getWarehouseTotal('food');
  if(elCleanCount) elCleanCount.textContent = getWarehouseTotal('clean');
  if(elToyCount) elToyCount.textContent = getWarehouseTotal('toy');
  
  // 空状态判断
  const currentTotal = getWarehouseTotal(tab);
  const emptyTexts = {
    food: '食物仓库空空如也，去食物商店买点吧~',
    clean: '清洁用品仓库空空如也，去清洁商店买点吧~',
    toy: '玩具仓库空空如也，去猫咪用品商店买点吧~'
  };
  if(empty){
    if(currentTotal === 0){
      empty.style.display = 'block';
      const emptyText = document.getElementById('warehouseEmptyText');
      if(emptyText) emptyText.textContent = emptyTexts[tab] || '仓库空空如也~';
    } else {
      empty.style.display = 'none';
    }
  }
}

// 渲染仓库食物列表
function renderWarehouseFoodList(){
  const container = document.getElementById('warehouseFoodList');
  if(!container) return;
  container.innerHTML = '';
  const wh = getWarehouse();
  let hasItem = false;
  
  PHONE_FOODS.forEach(food => {
    const itemData = wh.foods[food.id];
    const count = typeof itemData === 'object' ? (itemData.count || 0) : (itemData || 0);
    if(count <= 0) return;
    hasItem = true;
    const div = document.createElement('div');
    div.className = 'fl-state-material-card';
    div.style.cssText = 'padding:16px;text-align:center;border:2px solid #fecfef;position:relative;';
    div.innerHTML = `
      <div style="position:absolute;top:8px;right:8px;background:#ff9a9e;color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;">x${count}</div>
      <div style="font-size:36px;">${food.emoji}</div>
      <div style="font-size:15px;font-weight:700;margin-top:8px;">${food.name}</div>
      <div style="font-size:12px;color:#666;margin-top:4px;">+${food.hunger}饱食度</div>
      <button onclick="useFoodFromWarehouse('${food.id}')" style="margin-top:10px;width:100%;background:linear-gradient(135deg,#ff9a9e,#fecfef);color:#fff;border:none;padding:8px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(255,154,158,0.3);">
        🍖 喂食
      </button>
    `;
    container.appendChild(div);
  });
  
  if(!hasItem){
    container.innerHTML = '';
  }
}

// 渲染仓库清洁用品列表
function renderWarehouseCleanList(){
  const container = document.getElementById('warehouseCleanList');
  if(!container) return;
  container.innerHTML = '';
  const wh = getWarehouse();
  let hasItem = false;
  
  PET_CLEAN_ITEMS.forEach(item => {
    const itemData = wh.cleans[item.id];
    const count = typeof itemData === 'object' ? (itemData.count || 0) : (itemData || 0);
    if(count <= 0) return;
    hasItem = true;
    const div = document.createElement('div');
    div.className = 'fl-state-material-card';
    div.style.cssText = 'padding:16px;text-align:center;border:2px solid #93c5fd;position:relative;';
    div.innerHTML = `
      <div style="position:absolute;top:8px;right:8px;background:#60a5fa;color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;">x${count}</div>
      <div style="font-size:36px;">${item.emoji}</div>
      <div style="font-size:15px;font-weight:700;margin-top:8px;">${item.name}</div>
      <div style="font-size:12px;color:#666;margin-top:4px;">+${item.clean}清洁值</div>
      <button onclick="useCleanFromWarehouse('${item.id}')" style="margin-top:10px;width:100%;background:linear-gradient(135deg,#60a5fa,#34d399);color:#fff;border:none;padding:8px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(96,165,250,0.3);">
        🧼 使用
      </button>
    `;
    container.appendChild(div);
  });
  
  if(!hasItem){
    container.innerHTML = '';
  }
}

// 渲染仓库玩具列表
function renderWarehouseToyList(){
  const container = document.getElementById('warehouseToyList');
  if(!container) return;
  container.innerHTML = '';
  const wh = getWarehouse();
  let hasItem = false;
  
  PET_TOYS.forEach(toy => {
    const itemData = wh.toys[toy.id];
    const count = typeof itemData === 'object' ? (itemData.count || 0) : (itemData || 0);
    if(count <= 0) return;
    hasItem = true;
    const div = document.createElement('div');
    div.className = 'fl-state-material-card';
    div.style.cssText = 'padding:16px;text-align:center;border:2px solid #c4b5fd;position:relative;';
    div.innerHTML = `
      <div style="position:absolute;top:8px;right:8px;background:#a78bfa;color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;">x${count}</div>
      <div style="font-size:36px;">${toy.emoji}</div>
      <div style="font-size:15px;font-weight:700;margin-top:8px;">${toy.name}</div>
      <div style="font-size:12px;color:#666;margin-top:4px;">+${toy.affection}好感度</div>
      <button onclick="useToyFromWarehouse('${toy.id}')" style="margin-top:10px;width:100%;background:linear-gradient(135deg,#a78bfa,#f472b6);color:#fff;border:none;padding:8px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(167,139,250,0.3);">
        🪶 玩耍
      </button>
    `;
    container.appendChild(div);
  });
  
  if(!hasItem){
    container.innerHTML = '';
  }
}

// 从仓库使用玩具（增加好感度）
function useToyFromWarehouse(toyId){
  const toy = PET_TOYS.find(t => t.id === toyId);
  if(!toy) return;
  
  // 检查仓库是否有该物品
  const wh = getWarehouse();
  if(!wh.toys[toyId] || wh.toys[toyId] <= 0){
    showToast('仓库里没有这个玩具了~');
    return;
  }
  
  // 检查好感度是否已满
  const affection = lsGet('pet_affection', 50);
  if(affection >= 100){
    showToast('小橘已经超级喜欢你啦，好感度已满~');
    return;
  }
  
  // 从仓库移除
  removeFromWarehouse('toy', toyId);
  
  // 记录使用
  recordUsage('toy', toy.id, toy.name, toy.emoji);
  
  // 增加好感度
  const newAffection = Math.min(100, affection + toy.affection);
  lsSet('pet_affection', newAffection);
  
  // 更新显示
  updateWarehousePetDisplay();
  updatePetDisplay();
  updatePetStatusDisplay();
  updateCleanShopDisplay();
  updateToyShopDisplay();
  updateWarehouseBadge();
  
  // 重新渲染列表
  if(currentWarehouseTab === 'toy'){
    renderWarehouseToyList();
    switchWarehouseTab('toy');
  }
  
  // 播放音效
  if(typeof playSound === 'function') playSound('success');
  
  showToast(`小橘玩${toy.emoji}${toy.name}玩得很开心，好感度+${toy.affection}！`);
  // 每日任务进度
  if(typeof updateDailyTask === 'function') updateDailyTask('daily_play_pet', 1);
}

// 从仓库使用食物（喂食）
function useFoodFromWarehouse(foodId){
  const food = PHONE_FOODS.find(f => f.id === foodId);
  if(!food) return;
  
  // 检查仓库是否有该物品
  const wh = getWarehouse();
  if(!wh.foods[foodId] || wh.foods[foodId] <= 0){
    showToast('仓库里没有这个食物了~');
    return;
  }
  
  // 检查饱食度是否已满
  const hunger = lsGet('pet_hunger', 50);
  if(hunger >= 100){
    showToast('小橘已经吃饱啦，不要再喂了~');
    return;
  }
  
  // 从仓库移除
  removeFromWarehouse('food', foodId);
  
  // 记录使用
  recordUsage('food', food.id, food.name, food.emoji);
  
  // 增加饱食度
  const newHunger = Math.min(100, hunger + food.hunger);
  lsSet('pet_hunger', newHunger);
  
  // 更新显示
  updateWarehousePetDisplay();
  updatePetDisplay();
  updatePetStatusDisplay();
  updateWarehouseBadge();
  
  // 重新渲染列表
  if(currentWarehouseTab === 'food'){
    renderWarehouseFoodList();
    switchWarehouseTab('food'); // 刷新空状态和计数
  }
  
  // 播放音效
  if(typeof playSound === 'function') playSound('success');
  
  showToast(`小橘吃掉了${food.emoji}${food.name}，饱食度+${food.hunger}！`);
  // 每日任务进度
  if(typeof updateDailyTask === 'function') updateDailyTask('daily_feed_pet', 1);
}

// 从仓库使用清洁用品
function useCleanFromWarehouse(itemId){
  const item = PET_CLEAN_ITEMS.find(i => i.id === itemId);
  if(!item) return;
  
  // 检查仓库是否有该物品
  const wh = getWarehouse();
  if(!wh.cleans[itemId] || wh.cleans[itemId] <= 0){
    showToast('仓库里没有这个清洁用品了~');
    return;
  }
  
  // 检查清洁值是否已满
  const clean = lsGet('pet_clean', 100);
  if(clean >= 100){
    showToast('小橘已经很干净啦，不需要再清洁了~');
    return;
  }
  
  // 从仓库移除
  removeFromWarehouse('clean', itemId);
  
  // 记录使用
  recordUsage('clean', item.id, item.name, item.emoji);
  
  // 增加清洁值
  const newClean = Math.min(100, clean + item.clean);
  lsSet('pet_clean', newClean);
  
  // 更新显示
  updateWarehousePetDisplay();
  updatePetDisplay();
  updatePetStatusDisplay();
  updateCleanShopDisplay();
  updateWarehouseBadge();
  
  // 重新渲染列表
  if(currentWarehouseTab === 'clean'){
    renderWarehouseCleanList();
    switchWarehouseTab('clean'); // 刷新空状态和计数
  }
  
  // 播放音效
  if(typeof playSound === 'function') playSound('success');
  
  showToast(`使用了${item.emoji}${item.name}，清洁值+${item.clean}！小橘变干净啦~`);
  // 每日任务进度
  if(typeof updateDailyTask === 'function') updateDailyTask('daily_clean_pet', 1);
}

// 更新仓库页面的宠物状态显示
function updateWarehousePetDisplay(){
  const hunger = lsGet('pet_hunger', 50);
  const hungerPercent = Math.max(0, Math.min(100, hunger));
  const clean = lsGet('pet_clean', 100);
  const cleanPercent = Math.max(0, Math.min(100, clean));
  const affection = lsGet('pet_affection', 50);
  const affectionPercent = Math.max(0, Math.min(100, affection));
  
  // 根据状态更新表情和心情
  let mood, emoji;
  if(hungerPercent >= 80 && cleanPercent >= 80){ mood='吃饱喝足，超级开心~'; emoji='😺'; }
  else if(hungerPercent >= 50 && cleanPercent >= 50){ mood='心情不错~'; emoji='🐱'; }
  else if(hungerPercent >= 20 && cleanPercent >= 20){ mood='有点饿了/该洗澡了...'; emoji='😿'; }
  else{ mood='快饿晕啦/脏死啦，快照顾我！'; emoji='😾'; }
  if(cleanPercent < 30){ emoji = '🥺'; mood = '脏死啦，快给我洗澡！'; }
  
  const elEmoji = document.getElementById('warehousePetEmoji');
  const elMood = document.getElementById('warehousePetMood');
  const elHungerText = document.getElementById('warehouseHungerText');
  const elHungerBar = document.getElementById('warehouseHungerBar');
  const elCleanText = document.getElementById('warehouseCleanText');
  const elCleanBar = document.getElementById('warehouseCleanBar');
  const elAffectionText = document.getElementById('warehouseAffectionText');
  const elAffectionBar = document.getElementById('warehouseAffectionBar');
  
  if(elEmoji) elEmoji.textContent = emoji;
  if(elMood) elMood.textContent = mood;
  if(elHungerText) elHungerText.textContent = hungerPercent + '/100';
  if(elHungerBar) elHungerBar.style.width = hungerPercent + '%';
  if(elCleanText) elCleanText.textContent = cleanPercent + '/100';
  if(elCleanBar) elCleanBar.style.width = cleanPercent + '%';
  if(elAffectionText) elAffectionText.textContent = affectionPercent + '/100';
  if(elAffectionBar) elAffectionBar.style.width = affectionPercent + '%';
}

function updateHungerDisplay(){
  const hunger = lsGet('pet_hunger', 50);
  const hungerPercent = Math.max(0, Math.min(100, hunger));
  
  const elDisplay = document.getElementById('phoneHungerDisplay');
  const elBar = document.getElementById('phoneHungerBar');
  const elText = document.getElementById('phoneHungerText');
  const elProgress = document.getElementById('phoneHungerProgress');
  const elMood = document.getElementById('phonePetMood');
  const elEmoji = document.getElementById('phonePetEmoji');
  
  if(elDisplay) elDisplay.textContent = hungerPercent + '/100';
  if(elBar) elBar.style.width = hungerPercent + '%';
  if(elText) elText.textContent = hungerPercent + '/100';
  if(elProgress) elProgress.style.width = hungerPercent + '%';
  
  // 根据饱食度更新心情
  if(elMood && elEmoji){
    if(hungerPercent >= 80){
      elMood.textContent = '吃饱啦，超级开心~';
      elEmoji.textContent = '😺';
    } else if(hungerPercent >= 50){
      elMood.textContent = '心情不错~';
      elEmoji.textContent = '🐱';
    } else if(hungerPercent >= 20){
      elMood.textContent = '有点饿了...';
      elEmoji.textContent = '😿';
    } else {
      elMood.textContent = '快饿晕啦，快喂我！';
      elEmoji.textContent = '😾';
    }
  }
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageMailboxPage", "<!-- pageMailboxPage -->\n<div class=\"tool-page\" id=\"pageMailboxPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>✉️ 校长信箱</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">小橘每次毕业后，校长都会寄来祝福信和小礼物~ 点击信件查看详情并领取奖励！</div>\n      \n      <!-- 邮件列表 -->\n      <div id=\"mailboxList\" style=\"display:flex;flex-direction:column;gap:12px;\">\n        <!-- 邮件列表由JS生成 -->\n      </div>\n      \n      <!-- 空状态 -->\n      <div id=\"mailboxEmpty\" style=\"display:none;text-align:center;padding:40px 20px;color:var(--text-placeholder);\">\n        <div style=\"font-size:48px;\">📭</div>\n        <div style=\"font-size:14px;margin-top:10px;\">还没有收到校长的信呢，让小橘去上学吧~</div>\n        <button onclick=\"openPage('petSchoolPage')\" style=\"margin-top:14px;padding:8px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:13px;font-weight:600;cursor:pointer;\">送小橘上学</button>\n      </div>\n    </div>\n  </div>");
// ==================== 校长信箱系统 ====================
// 校长祝福语文案库
const PRINCIPAL_MESSAGES = {
  normal: [
    '亲爱的小橘同学，今天在学校表现很棒！继续加油哦~',
    '小橘今天又学会了新东西，校长为你感到骄傲！',
    '认真学习的小橘最可爱啦，明天也要元气满满哦~',
    '小橘同学今天出勤准时，课堂表现积极，继续保持！',
    '看到小橘每天都在进步，校长真的很欣慰呢~'
  ],
  final: [
    '🎉 恭喜小橘同学顺利毕业！你已经掌握了本阶段所有知识，准备好迎接新的挑战了吗？',
    '🎓 毕业快乐！小橘同学在这段时间里成长了很多，校长相信你在更高的学府会更加出色！',
    '✨ 光荣毕业！小橘用努力证明了自己，带着这份自信去开启新的学习旅程吧！',
    '🌟 毕业啦！小橘同学的每一份努力都有了回报，未来可期，继续闪闪发光吧！'
  ]
};

// 获取/保存信箱
function getMailbox(){ return lsGet('pet_mailbox', []); }
function saveMailbox(mails){ lsSet('pet_mailbox', mails); }

// 生成校长邮件
function generateSchoolMail(school, graduationCount, isFinalGraduation){
  const messages = isFinalGraduation ? PRINCIPAL_MESSAGES.final : PRINCIPAL_MESSAGES.normal;
  const content = messages[Math.floor(Math.random() * messages.length)];
  
  // 根据学校等级生成奖励
  const schoolLevel = PET_SCHOOLS.findIndex(s => s.id === school.id);
  const rewards = {
    coins: 5 + schoolLevel * 5 + Math.floor(Math.random() * 5),
    foods: [],
    cleans: [],
    toys: []
  };
  
  // 随机食物奖励
  const foodItems = PHONE_FOODS;
  const randomFood = foodItems[Math.floor(Math.random() * Math.min(foodItems.length, schoolLevel + 2))];
  rewards.foods.push({id: randomFood.id, name: randomFood.name, emoji: randomFood.emoji, count: 1});
  
  // 随机清洁用品奖励
  const cleanItems = PET_CLEAN_ITEMS;
  const randomClean = cleanItems[Math.floor(Math.random() * Math.min(cleanItems.length, schoolLevel + 2))];
  rewards.cleans.push({id: randomClean.id, name: randomClean.name, emoji: randomClean.emoji, count: 1});
  
  // 随机玩具奖励（有概率）
  if(Math.random() < 0.5 + schoolLevel * 0.1){
    const toyItems = PET_TOYS;
    const randomToy = toyItems[Math.floor(Math.random() * Math.min(toyItems.length, schoolLevel + 2))];
    rewards.toys.push({id: randomToy.id, name: randomToy.name, emoji: randomToy.emoji, count: 1});
  }
  
  const mail = {
    id: 'mail_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    schoolId: school.id,
    schoolName: school.name,
    schoolEmoji: school.emoji,
    graduationCount: graduationCount,
    isFinalGraduation: isFinalGraduation,
    title: isFinalGraduation ? '🎓 毕业祝福信' : '✉️ 校长的日常问候',
    content: content,
    rewards: rewards,
    claimed: false,
    read: false,
    timestamp: Date.now()
  };
  
  const mails = getMailbox();
  mails.unshift(mail); // 最新的放最前面
  saveMailbox(mails);
  updateMailboxBadge();
  
  showToast('✉️ 收到校长的来信啦！');
}

// 更新未读邮件红点
function updateMailboxBadge(){
  const mails = getMailbox();
  const unreadCount = mails.filter(m => !m.read).length;
  const badge = document.getElementById('mailboxBadge');
  if(badge){
    if(unreadCount > 0){
      badge.style.display = 'inline-block';
      badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
    } else {
      badge.style.display = 'none';
    }
  }
}

// 渲染信箱列表
function renderMailbox(){
  const mails = getMailbox();
  const listEl = document.getElementById('mailboxList');
  const emptyEl = document.getElementById('mailboxEmpty');
  
  if(!listEl) return;
  
  if(mails.length === 0){
    listEl.style.display = 'none';
    if(emptyEl) emptyEl.style.display = 'block';
    return;
  }
  
  listEl.style.display = 'flex';
  if(emptyEl) emptyEl.style.display = 'none';
  
  listEl.innerHTML = mails.map(mail => {
    const date = new Date(mail.timestamp);
    const dateStr = `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    const rewardPreview = [];
    if(mail.rewards.coins) rewardPreview.push(`💰${mail.rewards.coins}`);
    mail.rewards.foods.forEach(f => rewardPreview.push(`${f.emoji}${f.name}`));
    mail.rewards.cleans.forEach(c => rewardPreview.push(`${c.emoji}${c.name}`));
    mail.rewards.toys.forEach(t => rewardPreview.push(`${t.emoji}${t.name}`));
    
    return `
      <div class="fl-state-material-card" onclick="openMailDetail('${mail.id}')" style="padding:14px;cursor:pointer;border-width:2px;border-color:${mail.read ? 'transparent' : '#fbbf24'};transition:all 0.2s;">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:24px;">${mail.schoolEmoji}</span>
            <div>
              <div style="font-size:14px;font-weight:700;color:#333;">${mail.title}</div>
              <div style="font-size:11px;color:#999;margin-top:2px;">${mail.schoolName} · 第${mail.graduationCount}次 · ${dateStr}</div>
            </div>
          </div>
          <div style="text-align:right;">
            ${!mail.read ? '<span style="display:inline-block;background:#ef4444;color:#fff;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;">未读</span>' : ''}
            ${mail.claimed ? '<span style="display:inline-block;background:#d1fae5;color:#059669;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;margin-top:4px;">已领取</span>' : '<span style="display:inline-block;background:#fef3c7;color:#d97706;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:700;margin-top:4px;">待领取</span>'}
          </div>
        </div>
        <div style="font-size:12px;color:#666;margin-top:8px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${mail.content}</div>
        <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
          ${rewardPreview.map(r => `<span style="background:#f3f4f6;border-radius:8px;padding:2px 8px;font-size:11px;color:#666;">${r}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// 打开邮件详情
let currentMailId = null;
function openMailDetail(mailId){
  const mails = getMailbox();
  const mail = mails.find(m => m.id === mailId);
  if(!mail) return;
  
  currentMailId = mailId;
  
  // 标记为已读
  mail.read = true;
  saveMailbox(mails);
  updateMailboxBadge();
  renderMailbox();
  
  const date = new Date(mail.timestamp);
  const dateStr = `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
  
  const rewardItems = [];
  if(mail.rewards.coins) rewardItems.push(`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:24px;">💰</span><span style="font-size:14px;">金币 ×${mail.rewards.coins}</span></div>`);
  mail.rewards.foods.forEach(f => rewardItems.push(`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:24px;">${f.emoji}</span><span style="font-size:14px;">${f.name} ×${f.count}</span></div>`));
  mail.rewards.cleans.forEach(c => rewardItems.push(`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:24px;">${c.emoji}</span><span style="font-size:14px;">${c.name} ×${c.count}</span></div>`));
  mail.rewards.toys.forEach(t => rewardItems.push(`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:24px;">${t.emoji}</span><span style="font-size:14px;">${t.name} ×${t.count}</span></div>`));
  
  // 显示弹窗
  const modalHtml = `
    <div class="modal-mask" id="mailDetailMask" style="display:flex;position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:1000;align-items:center;justify-content:center;margin:0;padding:0;">
      <div class="modal-box" style="max-width:420px;width:90%;padding:0;overflow:hidden;border-radius:20px;max-height:85vh;overflow-y:auto;">
        <div style="background:linear-gradient(135deg,#fbbf24,#f59e0b);padding:20px;text-align:center;position:relative;">
          <div style="font-size:48px;">${mail.schoolEmoji}</div>
          <div style="font-size:18px;font-weight:700;color:#fff;margin-top:8px;">${mail.title}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:4px;">${mail.schoolName}校长 · ${dateStr}</div>
          <button class="modal-close-btn" onclick="closeMailDetail()" aria-label="关闭邮件详情" style="position:absolute;top:12px;right:12px;">×</button>
        </div>
        <div style="padding:20px;">
          <div style="background:#fffbeb;border-radius:12px;padding:16px;font-size:14px;color:#78350f;line-height:1.8;">
            💌 ${mail.content}
          </div>
          <div style="margin-top:16px;">
            <div style="font-size:14px;font-weight:700;color:#333;margin-bottom:10px;">🎁 随信礼物</div>
            <div style="background:#f9fafb;border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px;">
              ${rewardItems.join('')}
            </div>
          </div>
          <div style="margin-top:16px;display:flex;gap:10px;">
            ${mail.claimed ? 
              '<button disabled style="flex:1;padding:12px;border:none;border-radius:12px;background:#d1fae5;color:#059669;font-size:14px;font-weight:700;cursor:not-allowed;">✅ 已领取</button>' :
              `<button onclick="claimMailReward('${mail.id}')" style="flex:1;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(245,158,11,0.3);">🎁 领取礼物</button>`
            }
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 移除已存在的弹窗
  const oldModal = document.getElementById('mailDetailMask');
  if(oldModal) oldModal.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow='hidden';
}

// 关闭邮件详情
function closeMailDetail(){
  const modal = document.getElementById('mailDetailMask');
  if(!modal) return;
  modal.classList.add('pet-modal-stationary','closing');
  document.body.style.overflow='';
  setTimeout(() => {
    if(modal.parentNode) modal.parentNode.removeChild(modal);
  }, 200);
  currentMailId = null;
}

// 领取邮件奖励
function claimMailReward(mailId){
  const mails = getMailbox();
  const mail = mails.find(m => m.id === mailId);
  if(!mail || mail.claimed) return;
  
  // 领取金币
  if(mail.rewards.coins){
    const coins = lsGet('backpack_coins', 0);
    lsSet('backpack_coins', coins + mail.rewards.coins);
  }
  
  // 领取食物入仓库
  mail.rewards.foods.forEach(f => {
    for(let i = 0; i < f.count; i++){
      addToWarehouse('food', f.id);
    }
  });
  
  // 领取清洁用品入仓库
  mail.rewards.cleans.forEach(c => {
    for(let i = 0; i < c.count; i++){
      addToWarehouse('clean', c.id);
    }
  });
  
  // 领取玩具入仓库
  mail.rewards.toys.forEach(t => {
    for(let i = 0; i < t.count; i++){
      addToWarehouse('toy', t.id);
    }
  });
  
  // 标记为已领取
  mail.claimed = true;
  saveMailbox(mails);
  
  showToast('🎁 礼物已领取！食物和用品已放入仓库~');
  
  // 刷新弹窗和列表
  closeMailDetail();
  renderMailbox();
  updateWarehouseBadge();
}

// 初始化信箱页面
function initMailbox(){
  renderMailbox();
  updateMailboxBadge();
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageSuperItemShopPage", "<!-- pageSuperItemShopPage -->\n<div class=\"tool-page\" id=\"pageSuperItemShopPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>✨ 超级道具商店</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">上学和出去玩神器！加速卡跳过时长，必出收藏品卡让你必定获得收藏品~</div>\n      \n      <!-- 小橘猫状态 -->\n      <div style=\"background:linear-gradient(180deg,#fef2f2,#fff);border-radius:16px;padding:16px;margin-bottom:16px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <div style=\"display:flex;align-items:center;gap:12px;\">\n            <div style=\"font-size:48px;\" id=\"superItemPetEmoji\">🐱</div>\n            <div style=\"text-align:left;\">\n              <div style=\"font-size:16px;font-weight:700;\" id=\"superItemPetName\">小橘</div>\n              <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"superItemPetStatus\">心情不错~</div>\n            </div>\n          </div>\n          <div style=\"text-align:right;flex-shrink:0;min-width:80px;\">\n            <div style=\"display:inline-block;background:#fee2e2;color:#ef4444;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;white-space:nowrap;\">\n              ⚔️ <span id=\"superItemPetPower\">0</span>\n            </div>\n            <div style=\"font-size:11px;color:#666;margin-top:5px;white-space:nowrap;\">💰 <span id=\"superItemCoins\">0</span></div>\n          </div>\n        </div>\n      </div>\n      \n      <!-- 道具列表 -->\n      <div id=\"superItemShopList\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 道具列表由JS生成 -->\n      </div>\n    </div>\n  </div>");
// ==================== 超级道具系统 ====================
// 道具配置
const SUPER_ITEMS = [
  {
    id: 'speedCard',
    name: '加速卡',
    emoji: '⏩',
    desc: '跳过50%上学剩余时长',
    cost: 20,
    type: 'speed',
    category: 'school'
  },
  {
    id: 'instantCard',
    name: '立即毕业卡',
    emoji: '⚡',
    desc: '直接毕业，获得全部奖励',
    cost: 50,
    type: 'instant',
    category: 'school'
  },
  {
    id: 'doublePowerCard',
    name: '双倍战力卡',
    emoji: '🌟',
    desc: '下次上学获得战力翻倍',
    cost: 30,
    type: 'doublePower',
    category: 'school'
  },
  {
    id: 'guaranteedCollectibleCard',
    name: '必出收藏品卡',
    emoji: '🎁',
    desc: '下次出去玩必定获得收藏品',
    cost: 25,
    type: 'guaranteedCollectible',
    category: 'play'
  },
  {
    id: 'playSpeedCard',
    name: '立即回家卡',
    emoji: '🏠',
    desc: '出去玩时立即结束，马上回家',
    cost: 15,
    type: 'playSpeed',
    category: 'play'
  }
];

// 获取/保存道具仓库
function getSuperItems(){ return lsGet('pet_super_items', {}); }
function saveSuperItems(items){ lsSet('pet_super_items', items); }

// 获取某道具数量
function getSuperItemCount(itemId){
  const items = getSuperItems();
  return items[itemId] || 0;
}

// 初始化超级道具商店
function initSuperItemShop(){
  renderSuperItemShopList();
  updateSuperItemShopDisplay();
}

// 渲染道具商店列表
function renderSuperItemShopList(){
  const container = document.getElementById('superItemShopList');
  if(!container) return;
  container.innerHTML = '';
  
  // 按分类分组
  const categories = [
    {id: 'school', name: '🎒 上学道具', color: '#667eea'},
    {id: 'play', name: '🌳 出去玩道具', color: '#10b981'}
  ];
  
  categories.forEach(cat => {
    const catItems = SUPER_ITEMS.filter(item => item.category === cat.id);
    if(catItems.length === 0) return;
    
    // 分类标题（占满整行）
    const titleDiv = document.createElement('div');
    titleDiv.style.cssText = `grid-column:1/-1;font-size:15px;font-weight:700;color:${cat.color};margin:16px 0 10px;padding-left:4px;`;
    titleDiv.textContent = cat.name;
    container.appendChild(titleDiv);
    
    // 道具网格（占满整行）
    const gridDiv = document.createElement('div');
    gridDiv.style.cssText = 'grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:12px;';
    
    catItems.forEach(item => {
      const count = getSuperItemCount(item.id);
      const div = document.createElement('div');
      div.className = 'fl-state-material-card';
      div.style.cssText = 'padding:16px;text-align:center;cursor:pointer;transition:transform 0.2s;position:relative;';
      div.onmouseover = () => {div.style.transform='scale(1.03)';div.style.borderColor='#f43f5e';};
      div.onmouseout = () => {div.style.transform='scale(1)';div.style.borderColor='transparent';};
      div.onclick = () => buySuperItem(item.id);
      div.innerHTML = `
        ${count > 0 ? `<div style="position:absolute;top:8px;right:8px;background:#f43f5e;color:#fff;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700;">×${count}</div>` : ''}
        <div style="font-size:36px;">${item.emoji}</div>
        <div style="font-size:15px;font-weight:700;margin-top:8px;">${item.name}</div>
        <div style="font-size:11px;color:#666;margin-top:4px;">${item.desc}</div>
        <div style="margin-top:10px;display:inline-block;background:#fee2e2;color:#ef4444;padding:4px 12px;border-radius:12px;font-size:13px;font-weight:700;">
          💰 ${item.cost}
        </div>
      `;
      gridDiv.appendChild(div);
    });
    
    container.appendChild(gridDiv);
  });
}

// 购买超级道具
function buySuperItem(itemId){
  const item = SUPER_ITEMS.find(i => i.id === itemId);
  if(!item) return;
  
  const coins = bpGetCoins();
  if(coins < item.cost){
    showToast('金币不足，去玩游戏赚金币吧~');
    return;
  }
  
  // 扣除金币
  lsSet('backpack_coins', coins - item.cost);
  
  // 加入道具仓库
  const items = getSuperItems();
  items[itemId] = (items[itemId] || 0) + 1;
  saveSuperItems(items);
  
  // 更新显示
  updateSuperItemShopDisplay();
  renderSuperItemShopList();
  if(typeof playSound === 'function') playSound('coin');
  
  showToast(`购买了${item.emoji}${item.name}，${item.category === 'play' ? '出去玩时可以使用~' : '上学时可以使用~'}`);
}

// 更新超级道具商店显示
function updateSuperItemShopDisplay(){
  const power = lsGet('pet_power', 0);
  const coins = bpGetCoins();
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  const affection = lsGet('pet_affection', 50);
  
  const powerEl = document.getElementById('superItemPetPower');
  const coinsEl = document.getElementById('superItemCoins');
  const emojiEl = document.getElementById('superItemPetEmoji');
  const statusEl = document.getElementById('superItemPetStatus');
  
  if(powerEl) powerEl.textContent = power;
  if(coinsEl) coinsEl.textContent = coins;
  
  // 更新emoji和状态
  let emoji = '🐱', status = '心情不错~';
  if(hunger < 20){ emoji = '😿'; status = '有点饿了...'; }
  else if(clean < 20){ emoji = '🥺'; status = '该洗澡了...'; }
  else if(affection < 20){ emoji = '😾'; status = '有点不开心...'; }
  else if(hunger < 50 || clean < 50 || affection < 50){ emoji = '😺'; status = '还可以~'; }
  
  if(emojiEl) emojiEl.textContent = emoji;
  if(statusEl) statusEl.textContent = status;
}

// 显示道具选择面板
function showSuperItemPanel(){
  const schoolData = lsGet('pet_school_data', null);
  if(!schoolData){
    showToast('小橘还没上学呢，先送小橘去上学吧~');
    return;
  }
  
  const items = getSuperItems();
  const schoolItems = SUPER_ITEMS.filter(item => item.category === 'school');
  const hasItems = schoolItems.some(item => (items[item.id] || 0) > 0);
  
  let itemsHtml = '';
  if(hasItems){
    schoolItems.forEach(item => {
      const count = items[item.id] || 0;
      if(count > 0){
        itemsHtml += `
          <div class="fl-state-material-card" onclick="useSuperItemAndClose('${item.id}')" style="padding:14px;cursor:pointer;text-align:center;transition:all 0.2s;" onmouseover="this.style.borderColor='#f43f5e'" onmouseout="this.style.borderColor='transparent'">
            <div style="font-size:32px;">${item.emoji}</div>
            <div style="font-size:14px;font-weight:700;margin-top:6px;">${item.name}</div>
            <div style="font-size:11px;color:#666;margin-top:2px;">${item.desc}</div>
            <div style="margin-top:6px;display:inline-block;background:#fee2e2;color:#ef4444;border-radius:10px;padding:2px 8px;font-size:12px;font-weight:700;">×${count}</div>
          </div>
        `;
      }
    });
  }
  
  const modalHtml = `
    <div class="modal-mask" id="superItemPanelMask" style="display:flex;position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:1000;align-items:center;justify-content:center;margin:0;padding:0;">
      <div class="modal-box" style="max-width:400px;width:90%;padding:20px;border-radius:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="font-size:18px;font-weight:700;">✨ 选择道具</div>
          <button class="modal-close-btn" onclick="closeSuperItemPanel()" aria-label="关闭超级道具弹窗">×</button>
        </div>
        ${hasItems ? 
          `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${itemsHtml}</div>` :
          `<div style="text-align:center;padding:30px 20px;color:#999;">
            <div style="font-size:48px;">📭</div>
            <div style="font-size:14px;margin-top:10px;">还没有道具哦~</div>
            <button onclick="closeSuperItemPanel();openPage('superItemShopPage')" style="margin-top:14px;padding:8px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#f43f5e,#f97316);color:#fff;font-size:13px;font-weight:700;cursor:pointer;">去超级道具商店</button>
          </div>`
        }
      </div>
    </div>
  `;
  
  const oldModal = document.getElementById('superItemPanelMask');
  if(oldModal) oldModal.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow='hidden';
}

// 关闭道具面板
function closeSuperItemPanel(){
  const modal = document.getElementById('superItemPanelMask');
  if(!modal) return;
  modal.classList.add('pet-modal-stationary','closing');
  document.body.style.overflow='';
  setTimeout(() => {
    if(modal.parentNode) modal.parentNode.removeChild(modal);
  }, 200);
}

// 使用道具并关闭面板
function useSuperItemAndClose(itemId){
  closeSuperItemPanel();
  setTimeout(() => useSuperItem(itemId), 100);
}

// 使用超级道具（在上学页面调用）
function useSuperItem(itemId){
  const item = SUPER_ITEMS.find(i => i.id === itemId);
  if(!item) return;
  
  const count = getSuperItemCount(itemId);
  if(count <= 0){
    showToast('没有这个道具哦，去超级道具商店购买吧~');
    return;
  }
  
  const schoolData = lsGet('pet_school_data', null);
  if(!schoolData){
    showToast('小橘还没上学呢，先送小橘去上学吧~');
    return;
  }
  
  // 扣除道具
  const items = getSuperItems();
  items[itemId]--;
  if(items[itemId] <= 0) delete items[itemId];
  saveSuperItems(items);
  
  // 记录使用
  recordUsage('superItem', item.id, item.name, item.emoji);
  
  if(item.type === 'speed'){
    // 加速卡：跳过50%剩余时长
    const now = Date.now();
    const remaining = schoolData.endTime - now;
    if(remaining <= 0){
      showToast('小橘已经毕业啦~');
      return;
    }
    const skipTime = Math.floor(remaining * 0.5);
    schoolData.endTime = now + (remaining - skipTime);
    lsSet('pet_school_data', schoolData);
    startPetSchoolTimer();
    showToast('⏩ 使用加速卡！上学时间缩短一半啦~');
  } else if(item.type === 'instant'){
    // 立即毕业卡：直接毕业
    showToast('⚡ 使用立即毕业卡！小橘马上毕业~');
    setTimeout(() => {
      completePetSchool();
    }, 500);
  } else if(item.type === 'doublePower'){
    // 双倍战力卡：设置标记，下次毕业战力翻倍
    lsSet('pet_double_power_next', true);
    showToast('🌟 使用双倍战力卡！下次毕业战力翻倍~');
  }
  
  // 刷新上学页面
  if(typeof renderSchoolList === 'function') renderSchoolList();
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePetSchoolPage", "<!-- pagePetSchoolPage -->\n<div class=\"tool-page\" id=\"pagePetSchoolPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎒 出门上学</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">选择学校让小橘去上学，提升战力！等级越高，战力提升越多~</div>\n      \n      <!-- 小橘状态 -->\n      <div class=\"fl-state-material-card\" style=\"padding:16px;margin-bottom:14px;\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <div style=\"display:flex;align-items:center;\">\n            <div style=\"font-size:48px;\" id=\"schoolPetEmoji\">🐱</div>\n            <div style=\"margin-left:12px;\">\n              <div style=\"font-size:16px;font-weight:700;\">小橘</div>\n              <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"schoolPetMood\">心情不错~</div>\n            </div>\n          </div>\n          <div style=\"text-align:right;flex-shrink:0;min-width:80px;\">\n            <div style=\"display:inline-block;background:#fef3c7;color:#f59e0b;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;white-space:nowrap;\">\n              ⚔️ <span id=\"schoolPetPower\">0</span>\n            </div>\n            <div style=\"font-size:11px;color:#666;margin-top:5px;white-space:nowrap;\">💰 <span id=\"schoolCoins\">0</span></div>\n          </div>\n        </div>\n        <div style=\"margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;\">\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🍖 饱食</span>\n              <span id=\"schoolHungerText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"schoolHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🧼 清洁</span>\n              <span id=\"schoolCleanText\">100/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"schoolCleanBar\" style=\"height:100%;background:linear-gradient(90deg,#60a5fa,#34d399);border-radius:4px;width:100%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>💕 好感</span>\n              <span id=\"schoolAffectionText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"schoolAffectionBar\" style=\"height:100%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      \n      <!-- 上学中状态 -->\n      <div id=\"schoolAwayArea\" style=\"display:none;margin-bottom:14px;\">\n        <div style=\"background:#fff3cd;border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);\">\n          <div style=\"font-size:48px;\">🏫</div>\n          <div style=\"font-size:16px;font-weight:700;color:#856404;margin-top:8px;\" id=\"schoolAwayText\">小橘正在上学...</div>\n          <div style=\"font-size:28px;font-weight:700;color:#856404;margin-top:10px;\" id=\"schoolAwayTimer\">00:00</div>\n          <div style=\"font-size:13px;color:#856404;margin-top:8px;\" id=\"schoolAwayReward\">预计战力 +0</div>\n          <button onclick=\"recallPet()\" style=\"margin-top:14px;background:#ef4444;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(239,68,68,0.3);\">\n            🏠 召回宠物（退还一半金币）\n          </button>\n          <button onclick=\"showSuperItemPanel()\" style=\"margin-top:10px;margin-left:8px;background:linear-gradient(135deg,#f43f5e,#f97316);color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(244,63,94,0.3);\">\n            ✨ 使用道具\n          </button>\n        </div>\n      </div>\n      \n      <!-- 学校列表 -->\n      <div id=\"schoolListArea\">\n        <div style=\"display:grid;gap:12px;\" id=\"schoolList\">\n          <!-- 学校列表由JS生成 -->\n        </div>\n      </div>\n    </div>\n  </div>");
window.flRegisterToolPage("pagePetPlayPage", "<!-- pagePetPlayPage -->\n<div class=\"tool-page\" id=\"pagePetPlayPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🌳 出去玩</h3>\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;\">\n        <div style=\"font-size:13px;color:var(--text-secondary);\">选择地点带小橘出去玩，提升好感度！不同地点有不同的惊喜哦~</div>\n        <button onclick=\"openPage('collectionRecordPage')\" style=\"flex-shrink:0;margin-left:10px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;border:none;padding:8px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(245,158,11,0.3);white-space:nowrap;\">📜 获得记录</button>\n      </div>\n      \n      <!-- 小橘状态 -->\n      <div style=\"background:linear-gradient(180deg,#dcfce7,#fff);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:0 2px 12px rgba(0,0,0,0.06);\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <div style=\"display:flex;align-items:center;\">\n            <div style=\"font-size:48px;\" id=\"playPetEmoji\">🐱</div>\n            <div style=\"margin-left:12px;\">\n              <div style=\"font-size:16px;font-weight:700;\">小橘</div>\n              <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"playPetMood\">心情不错~</div>\n            </div>\n          </div>\n          <div style=\"text-align:right;flex-shrink:0;min-width:80px;\">\n            <div style=\"display:inline-block;background:#fef3c7;color:#f59e0b;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;white-space:nowrap;\">\n              ⚔️ <span id=\"playPetPower\">0</span>\n            </div>\n            <div style=\"font-size:11px;color:#666;margin-top:5px;white-space:nowrap;\">💰 <span id=\"playCoins\">0</span></div>\n          </div>\n        </div>\n        <div style=\"margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;\">\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🍖 饱食</span>\n              <span id=\"playHungerText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"playHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🧼 清洁</span>\n              <span id=\"playCleanText\">100/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"playCleanBar\" style=\"height:100%;background:linear-gradient(90deg,#60a5fa,#34d399);border-radius:4px;width:100%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>💕 好感</span>\n              <span id=\"playAffectionText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"playAffectionBar\" style=\"height:100%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      \n      <!-- 游玩中状态 -->\n      <div id=\"playAwayArea\" style=\"display:none;margin-bottom:14px;\">\n        <div style=\"background:#dcfce7;border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);\">\n          <div style=\"font-size:48px;\" id=\"playAwayEmoji\">🌳</div>\n          <div style=\"font-size:16px;font-weight:700;color:#166534;margin-top:8px;\" id=\"playAwayText\">小橘正在公园玩耍...</div>\n          <div style=\"font-size:28px;font-weight:700;color:#166534;margin-top:10px;\" id=\"playAwayTimer\">00:00</div>\n          <div style=\"font-size:13px;color:#166534;margin-top:8px;\" id=\"playAwayReward\">预计好感 +10</div>\n          <div style=\"display:flex;gap:10px;margin-top:14px;justify-content:center;\">\n            <button onclick=\"showPlaySuperItemPanel()\" style=\"background:linear-gradient(135deg,#f43f5e,#f97316);color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(244,63,94,0.3);\">\n              ✨ 使用道具\n            </button>\n            <button onclick=\"recallPetFromPlay()\" style=\"background:#ef4444;color:#fff;border:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(239,68,68,0.3);\">\n              🏠 召回宠物\n            </button>\n          </div>\n        </div>\n      </div>\n      \n      <!-- 游玩地点列表 -->\n      <div id=\"playLocationList\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 地点卡片由JS生成 -->\n      </div>\n    </div>\n  </div>");
// ==================== 宠物上学系统 ====================
const PET_SCHOOLS = [
  {id:'kindergarten', name:'幼儿园', emoji:'🏫', cost:5, duration:10, power:1, color:'#86efac', unlockCount:0, unlockSchool:null},
  {id:'primary', name:'小学', emoji:'🏫', cost:10, duration:20, power:3, color:'#93c5fd', unlockCount:3, unlockSchool:'kindergarten'},
  {id:'middle', name:'初中', emoji:'🏫', cost:20, duration:30, power:6, color:'#fcd34d', unlockCount:10, unlockSchool:'primary'},
  {id:'high', name:'高中', emoji:'🏫', cost:35, duration:45, power:10, color:'#f9a8d4', unlockCount:20, unlockSchool:'middle'},
  {id:'university', name:'大学', emoji:'🎓', cost:50, duration:60, power:15, color:'#c4b5fd', unlockCount:25, unlockSchool:'high'}
];

// 宠物打工配置
const PET_JOBS = [
  {id:'paperboy', name:'送报纸', emoji:'📰', duration:30, coinMin:8, coinMax:15, hungerCost:8, cleanCost:5, affectionCost:2, unlockSchool:null, unlockCount:0, color:'#fcd34d', desc:'早起送报纸，辛苦但稳定~'},
  {id:'waiter', name:'餐厅服务员', emoji:'🍽️', duration:45, coinMin:15, coinMax:25, hungerCost:10, cleanCost:8, affectionCost:3, unlockSchool:'kindergarten', unlockCount:2, color:'#93c5fd', desc:'端盘子擦桌子，需幼儿园学历~'},
  {id:'cashier', name:'超市收银员', emoji:'💳', duration:60, coinMin:25, coinMax:40, hungerCost:10, cleanCost:5, affectionCost:3, unlockSchool:'primary', unlockCount:3, color:'#86efac', desc:'扫码收钱，需小学学历~'},
  {id:'tutor', name:'家庭教师', emoji:'📚', duration:90, coinMin:40, coinMax:65, hungerCost:8, cleanCost:3, affectionCost:5, unlockSchool:'middle', unlockCount:5, color:'#f9a8d4', desc:'辅导小朋友功课，需初中学历~'},
  {id:'programmer', name:'程序员', emoji:'💻', duration:120, coinMin:60, coinMax:100, hungerCost:12, cleanCost:2, affectionCost:8, unlockSchool:'high', unlockCount:5, color:'#c4b5fd', desc:'敲代码赚大钱，需高中学历~'},
  {id:'doctor', name:'医生', emoji:'⚕️', duration:150, coinMin:90, coinMax:150, hungerCost:10, cleanCost:5, affectionCost:5, unlockSchool:'university', unlockCount:3, color:'#f87171', desc:'救死扶伤，需大学学历~'}
];

// 每日任务配置


// 清洁用品配置
const PET_CLEAN_ITEMS = [
  {id:'towel', name:'毛巾', emoji:'🧻', cost:2, clean:10},
  {id:'soap', name:'香皂', emoji:'🧼', cost:3, clean:15},
  {id:'bathball', name:'沐浴球', emoji:'🛁', cost:5, clean:20},
  {id:'shampoo', name:'沐浴露', emoji:'🧴', cost:8, clean:30}
];

// 猫咪玩具配置
const PET_TOYS = [
  {id:'feather', name:'逗猫棒', emoji:'🪶', cost:5, affection:10},
  {id:'yarn', name:'毛线球', emoji:'🧶', cost:3, affection:5},
  {id:'laser', name:'激光笔', emoji:'🔴', cost:8, affection:15},
  {id:'scratcher', name:'猫抓板', emoji:'📦', cost:6, affection:12},
  {id:'mousetoy', name:'小老鼠', emoji:'🐭', cost:4, affection:8},
  {id:'catnip', name:'猫薄荷', emoji:'🌿', cost:10, affection:20}
];

// 游玩地点配置
const PET_PLAY_LOCATIONS = [
  {id:'park', name:'公园', emoji:'🌳', hungerCost:5, cleanCost:3, affectionGain:10, duration:30, coinMin:5, coinMax:15, powerGain:0, color:'#22c55e', desc:'散步晒太阳，轻松愉快~', collectibles:['🍁','🦋','🌻']},
  {id:'mall', name:'商场', emoji:'🏬', hungerCost:8, cleanCost:5, affectionGain:8, duration:45, coinMin:10, coinMax:25, powerGain:0, color:'#3b82f6', desc:'逛街购物，可能有惊喜~', collectibles:['🛍️','💄','🎀']},
  {id:'beach', name:'海边', emoji:'🏖️', hungerCost:10, cleanCost:15, affectionGain:15, duration:60, coinMin:15, coinMax:35, powerGain:0, color:'#06b6d4', desc:'吹海风玩沙子，超开心~', collectibles:['🐚','🦀','🐠']},
  {id:'playground', name:'游乐场', emoji:'🎡', hungerCost:15, cleanCost:10, affectionGain:25, duration:90, coinMin:20, coinMax:50, powerGain:2, color:'#ec4899', desc:'玩各种游乐设施，快乐加倍~', collectibles:['🎈','🎠','🎪']},
  {id:'cinema', name:'电影院', emoji:'🎬', hungerCost:5, cleanCost:2, affectionGain:12, duration:40, coinMin:8, coinMax:20, powerGain:0, color:'#8b5cf6', desc:'看场电影，放松心情~', collectibles:['🎬','🍿','🎞️']},
  {id:'zoo', name:'动物园', emoji:'🦁', hungerCost:8, cleanCost:5, affectionGain:12, duration:40, coinMin:8, coinMax:20, powerGain:0, color:'#f97316', desc:'看各种可爱的小动物~', collectibles:['🦁','🐘','🦒']},
  {id:'aquarium', name:'水族馆', emoji:'🐬', hungerCost:6, cleanCost:8, affectionGain:15, duration:60, coinMin:12, coinMax:30, powerGain:0, color:'#0ea5e9', desc:'看海洋生物游来游去~', collectibles:['🐬','🐙','🪸']},
  {id:'ski', name:'滑雪场', emoji:'⛷️', hungerCost:12, cleanCost:8, affectionGain:18, duration:75, coinMin:18, coinMax:40, powerGain:1, color:'#38bdf8', desc:'滑雪打雪仗，超刺激~', collectibles:['⛷️','⛄','🏂']},
  {id:'camping', name:'露营地', emoji:'⛺', hungerCost:10, cleanCost:10, affectionGain:20, duration:50, coinMin:10, coinMax:25, powerGain:0, color:'#84cc16', desc:'搭帐篷烤篝火，亲近自然~', collectibles:['⛺','🔥','🔦']},
  {id:'dessert', name:'甜品店', emoji:'🍰', hungerCost:3, cleanCost:2, affectionGain:8, duration:25, coinMin:5, coinMax:15, powerGain:0, color:'#f472b6', desc:'吃甜甜的蛋糕和冰淇淋~', collectibles:['🍰','🍩','🧁']}
];

// 收藏品配置
const PET_COLLECTIBLES = {
  '🍁':{name:'枫叶',location:'公园',desc:'秋天的公园随处可见，火红的枫叶像小手掌~'},
  '🦋':{name:'蝴蝶',location:'公园',desc:'花丛中翩翩起舞的美丽精灵，小橘追了好久~'},
  '🌻':{name:'向日葵',location:'公园',desc:'永远朝着太阳绽放的花朵，充满阳光的味道~'},
  '🛍️':{name:'购物袋',location:'商场',desc:'逛街购物的战利品，里面装着满满的快乐~'},
  '💄':{name:'口红',location:'商场',desc:'美妆店的热门商品，小橘偷偷试了试~'},
  '🎀':{name:'蝴蝶结',location:'商场',desc:'可爱的粉色蝴蝶结，戴在小橘头上超萌~'},
  '🐚':{name:'贝壳',location:'海边',desc:'海浪冲上来的美丽贝壳，贴在耳边能听到海声~'},
  '🦀':{name:'螃蟹',location:'海边',desc:'横着走路的小螃蟹，差点夹住小橘的爪子~'},
  '🐠':{name:'小鱼',location:'海边',desc:'在浅水里游来游去的彩色小鱼，超可爱~'},
  '🎈':{name:'气球',location:'游乐场',desc:'五颜六色的气球，小橘一松手就飞上天啦~'},
  '🎠':{name:'旋转木马',location:'游乐场',desc:'梦幻的旋转木马，小橘坐上去开心得喵喵叫~'},
  '🎪':{name:'马戏团',location:'游乐场',desc:'精彩的马戏团表演，小橘看得目不转睛~'},
  '🎬':{name:'电影票',location:'电影院',desc:'一场电影的入场券，小橘选了最爱的动画片~'},
  '🍿':{name:'爆米花',location:'电影院',desc:'看电影必备的香甜爆米花，小橘一口一个~'},
  '🎞️':{name:'胶片',location:'电影院',desc:'老电影的胶片，记录着一个个动人的故事~'},
  '🦁':{name:'狮子玩偶',location:'动物园',desc:'动物园纪念品商店买的小狮子玩偶，毛茸茸超可爱~'},
  '🐘':{name:'大象贴纸',location:'动物园',desc:'长鼻子大象的贴纸，小橘贴在了日记本上~'},
  '🦒':{name:'长颈鹿模型',location:'动物园',desc:'长长的脖子模型，小橘说要和它比身高~'},
  '🐬':{name:'海豚玩偶',location:'水族馆',desc:'蓝色的海豚毛绒玩偶，摸起来软软的~'},
  '🐙':{name:'章鱼毛绒',location:'水族馆',desc:'八只触手的章鱼玩偶，小橘数了好几遍~'},
  '🪸':{name:'珊瑚标本',location:'水族馆',desc:'美丽的珊瑚标本，像海底的小花~'},
  '⛷️':{name:'迷你滑雪板',location:'滑雪场',desc:'缩小版的滑雪板钥匙扣，小橘挂在书包上~'},
  '⛄':{name:'小雪人',location:'滑雪场',desc:'用雪堆的小雪人，虽然化了但照片留下来了~'},
  '🏂':{name:'滑雪奖牌',location:'滑雪场',desc:'小橘第一次滑雪获得的鼓励奖牌~'},
  '⛺':{name:'小帐篷',location:'露营地',desc:'迷你帐篷模型，小橘说下次要带真的去露营~'},
  '🔥':{name:'篝火徽章',location:'露营地',desc:'露营篝火晚会的纪念徽章，暖暖的~'},
  '🔦':{name:'小手电筒',location:'露营地',desc:'夜里探险用的小手电筒，还能发光~'},
  '🍰':{name:'小蛋糕',location:'甜品店',desc:'草莓奶油小蛋糕，小橘吃得满脸都是~'},
  '🍩':{name:'甜甜圈',location:'甜品店',desc:'粉色糖霜甜甜圈，小橘舔了舔嘴唇~'},
  '🧁':{name:'纸杯蛋糕',location:'甜品店',desc:'可爱的纸杯蛋糕，上面有小橘最爱的糖珠~'}
};

let petPlayTimer = null;
let currentPlayLocation = null;

// 渲染游玩地点列表
function renderPlayLocations(){
  const container = document.getElementById('playLocationList');
  if(!container) return;
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  const affection = lsGet('pet_affection', 50);
  
  container.innerHTML = PET_PLAY_LOCATIONS.map(loc => {
    const canPlay = hunger >= loc.hungerCost && clean >= loc.cleanCost;
    return `
      <div onclick="${canPlay ? `confirmPlayLocation('${loc.id}')` : `showToast('状态不足，无法去${loc.name}玩~')`}" 
           style="background:linear-gradient(135deg,${loc.color}40,${loc.color}20);border-radius:16px;padding:16px;cursor:${canPlay?'pointer':'not-allowed'};box-shadow:0 2px 12px rgba(0,0,0,0.06);border:2px solid ${canPlay?loc.color:'#e5e7eb'};opacity:${canPlay?1:0.5};">
        <div style="text-align:center;">
          <div style="font-size:40px;">${loc.emoji}</div>
          <div style="font-size:16px;font-weight:700;margin-top:6px;">${loc.name}</div>
          <div style="font-size:11px;color:#666;margin-top:2px;">${loc.desc}</div>
          <div style="margin-top:10px;padding:8px;background:rgba(255,255,255,0.6);border-radius:8px;font-size:11px;line-height:1.6;">
            <div>⏱️ ${loc.duration}秒</div>
            <div>🍖 -${loc.hungerCost} 🧼 -${loc.cleanCost}</div>
            <div style="color:#16a34a;font-weight:600;">💕 +${loc.affectionGain}好感</div>
            <div style="color:#d97706;font-weight:600;">💰 ${loc.coinMin}-${loc.coinMax}金币${loc.powerGain>0?` ⚔️+${loc.powerGain}`:''}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 确认游玩地点（弹出确认窗口）
function confirmPlayLocation(locationId){
  const loc = PET_PLAY_LOCATIONS.find(l => l.id === locationId);
  if(!loc) return;
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  if(hunger < loc.hungerCost){
    showToast(`饱食度不足，需要${loc.hungerCost}点~`);
    return;
  }
  if(clean < loc.cleanCost){
    showToast(`清洁值不足，需要${loc.cleanCost}点~`);
    return;
  }
  
  // 创建确认弹窗
  const collectiblesHtml = loc.collectibles.map(c => 
    `<span style="display:inline-block;font-size:24px;margin:0 4px;" title="${PET_COLLECTIBLES[c]?.name || c}">${c}</span>`
  ).join('');
  
  const modalHtml = `
    <div class="modal-mask" id="playConfirmMask" style="display:flex;position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:99999;align-items:center;justify-content:center;margin:0;padding:0;">
      <div class="modal-box" style="max-width:360px;width:90%;padding:0;overflow:hidden;border-radius:20px;">
        <button class="modal-close-btn" type="button" aria-label="关闭游玩确认" onclick="closePlayConfirm()" style="position:absolute;top:12px;right:12px;z-index:2;">✕</button>
        <div style="background:linear-gradient(135deg,${loc.color},${loc.color}aa);padding:20px;text-align:center;">
          <div style="font-size:56px;">${loc.emoji}</div>
          <div style="font-size:18px;font-weight:700;color:#fff;margin-top:8px;">${loc.name}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.9);margin-top:4px;">${loc.desc}</div>
        </div>
        <div style="padding:20px;">
          <div style="font-size:14px;font-weight:700;color:#333;margin-bottom:10px;text-align:center;">📋 游玩确认</div>
          
          <!-- 消耗 -->
          <div style="background:#fef2f2;border-radius:10px;padding:10px;margin-bottom:10px;">
            <div style="font-size:12px;font-weight:600;color:#dc2626;margin-bottom:6px;">💔 消耗</div>
            <div style="display:flex;gap:12px;font-size:13px;color:#666;">
              <span>🍖 饱食度 -${loc.hungerCost}</span>
              <span>🧼 清洁值 -${loc.cleanCost}</span>
            </div>
          </div>
          
          <!-- 获得 -->
          <div style="background:#f0fdf4;border-radius:10px;padding:10px;margin-bottom:10px;">
            <div style="font-size:12px;font-weight:600;color:#16a34a;margin-bottom:6px;">🎁 可能获得</div>
            <div style="font-size:13px;color:#666;line-height:1.8;">
              <div>💕 好感度 +${loc.affectionGain}</div>
              <div>💰 金币 ${loc.coinMin}-${loc.coinMax}${loc.powerGain > 0 ? ` · ⚔️ 战力 +${loc.powerGain}` : ''}</div>
              <div style="margin-top:4px;">🏆 收藏品：${collectiblesHtml}</div>
            </div>
          </div>
          
          <!-- 时长 -->
          <div style="text-align:center;font-size:12px;color:#999;margin-bottom:14px;">⏱️ 游玩时长：${loc.duration}秒</div>
          
          <!-- 按钮 -->
          <div style="display:flex;gap:10px;">
            <button onclick="closePlayConfirm()" style="flex:1;padding:12px;border:none;border-radius:12px;background:#f3f4f6;color:#666;font-size:14px;font-weight:700;cursor:pointer;">取消</button>
            <button onclick="startPetPlay('${loc.id}');closePlayConfirm();" style="flex:2;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,${loc.color},${loc.color}cc);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px ${loc.color}66;">🚀 出发！</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 移除已存在的弹窗
  const oldModal = document.getElementById('playConfirmMask');
  if(oldModal) oldModal.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow='hidden';
}

// 关闭游玩确认弹窗（带淡出动画）
function closePlayConfirm(){
  const modal = document.getElementById('playConfirmMask');
  if(!modal) return;
  modal.classList.add('pet-modal-stationary','closing');
  document.body.style.overflow='';
  setTimeout(() => {
    if(modal.parentNode) modal.parentNode.removeChild(modal);
  }, 200);
}

// 渲染收藏品展柜
function renderCollections(){
  const container = document.getElementById('collectionDisplay');
  const progressEl = document.getElementById('collectionProgress');
  if(!container) return;
  
  const collections = lsGet('pet_collections', {});
  const allCollectibles = Object.keys(PET_COLLECTIBLES);
  const obtainedCount = allCollectibles.filter(c => collections[c] > 0).length;
  
  if(progressEl) progressEl.textContent = `${obtainedCount}/${allCollectibles.length}`;
  
  container.innerHTML = allCollectibles.map(c => {
    const count = collections[c] || 0;
    const obtained = count > 0;
    const info = PET_COLLECTIBLES[c];
    return `
      <div onclick="showCollectibleDetail('${c}')" style="text-align:center;padding:8px 4px;background:${obtained ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.1)'};border-radius:10px;position:relative;cursor:pointer;" title="${info?.name || c}（${info?.location || '未知'}）">
        <div style="font-size:24px;${obtained ? '' : 'filter:grayscale(100%);opacity:0.4;'}">${c}</div>
        ${obtained ? `<div style="font-size:10px;color:#92400e;font-weight:600;margin-top:2px;">×${count}</div>` : `<div style="font-size:10px;color:#999;margin-top:2px;">未获得</div>`}
      </div>
    `;
  }).join('');
}

// 渲染全部收藏品展柜页面
function renderAllCollections(){
  const container = document.getElementById('allCollectionContent');
  const countEl = document.getElementById('allCollectionCount');
  if(!container) return;
  
  const collections = lsGet('pet_collections', {});
  const history = lsGet('pet_collection_history', []);
  const allCollectibles = Object.keys(PET_COLLECTIBLES);
  const obtainedCount = allCollectibles.filter(c => collections[c] > 0).length;
  
  if(countEl) countEl.textContent = obtainedCount;
  const totalEl = document.getElementById('allCollectionTotal');
  if(totalEl) totalEl.textContent = allCollectibles.length;
  
  // 按地点分组
  const locations = {};
  allCollectibles.forEach(c => {
    const info = PET_COLLECTIBLES[c];
    const loc = info?.location || '未知';
    if(!locations[loc]) locations[loc] = [];
    locations[loc].push(c);
  });
  
  // 地点对应的emoji
  const locationEmojis = {'公园':'🌳','商场':'🏬','海边':'🏖️','游乐场':'🎡','电影院':'🎬'};
  
  container.innerHTML = Object.keys(locations).map(loc => {
    const items = locations[loc];
    const locObtained = items.filter(c => collections[c] > 0).length;
    return `
      <div class="fl-state-material-card" style="margin-bottom:18px;padding:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="font-size:15px;font-weight:700;color:#333;">${locationEmojis[loc] || '📍'} ${loc}</div>
          <div style="font-size:12px;color:#999;">${locObtained}/${items.length}</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
          ${items.map(c => {
            const count = collections[c] || 0;
            const obtained = count > 0;
            const info = PET_COLLECTIBLES[c];
            // 查找首次获得时间
            const firstGet = history.find(h => h.collectible === c);
            const timeStr = firstGet ? formatTime(firstGet.time) : '';
            return `
              <div onclick="showCollectibleDetail('${c}')" style="text-align:center;padding:12px 8px;background:${obtained ? 'linear-gradient(135deg,#fef3c7,#fde68a)' : '#f5f5f5'};border-radius:12px;cursor:pointer;">
                <div style="font-size:32px;${obtained ? '' : 'filter:grayscale(100%);opacity:0.3;'}">${c}</div>
                <div style="font-size:12px;font-weight:600;color:${obtained ? '#92400e' : '#999'};margin-top:6px;">${info?.name || c}</div>
                ${obtained ? `
                  <div style="font-size:11px;color:#b45309;margin-top:2px;">×${count}</div>
                  <div style="font-size:10px;color:#d97706;margin-top:2px;">${timeStr}</div>
                ` : `<div style="font-size:10px;color:#bbb;margin-top:4px;">未获得</div>`}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// 渲染收藏品获得记录
function renderCollectionHistory(){
  const container = document.getElementById('collectionHistoryContent');
  if(!container) return;
  
  const history = lsGet('pet_collection_history', []);
  
  if(history.length === 0){
    container.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#999;">
        <div style="font-size:48px;margin-bottom:12px;">📭</div>
        <div style="font-size:14px;">还没有获得记录哦~</div>
        <div style="font-size:12px;margin-top:6px;">带小橘出去玩收集纪念品吧！</div>
      </div>
    `;
    return;
  }
  
  // 按时间倒序
  const sorted = [...history].sort((a, b) => b.time - a.time);
  
  container.innerHTML = `
    <div style="font-size:12px;color:#999;margin-bottom:10px;">共 ${history.length} 条获得记录</div>
    <div style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
      ${sorted.map((item, index) => {
        const info = PET_COLLECTIBLES[item.collectible];
        return `
          <div style="display:flex;align-items:center;padding:12px 14px;${index < sorted.length - 1 ? 'border-bottom:1px solid #f0f0f0;' : ''}">
            <div style="font-size:28px;margin-right:12px;">${item.collectible}</div>
            <div style="flex:1;">
              <div style="font-size:14px;font-weight:600;color:#333;">${info?.name || item.collectible}</div>
              <div style="font-size:11px;color:#999;margin-top:2px;">在${item.location}获得</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;color:#666;">${formatTime(item.time)}</div>
              <div style="font-size:10px;color:#bbb;margin-top:2px;">${formatDate(item.time)}</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 清空获得记录
function clearCollectionHistory(){
  if(!confirm('确定要清空所有获得记录吗？（收藏品数量不会清空）')) return;
  lsSet('pet_collection_history', []);
  renderCollectionHistory();
  showToast('获得记录已清空~');
}

// 格式化时间（HH:MM）
function formatTime(timestamp){
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

// 格式化日期（MM-DD）
function formatDate(timestamp){
  const d = new Date(timestamp);
  return `${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// 显示收藏品说明弹窗
function showCollectibleDetail(emoji){
  const info = PET_COLLECTIBLES[emoji];
  if(!info) return;
  
  const collections = lsGet('pet_collections', {});
  const count = collections[emoji] || 0;
  const obtained = count > 0;
  
  // 查找首次获得时间
  const history = lsGet('pet_collection_history', []);
  const firstGet = history.find(h => h.collectible === emoji);
  const firstTimeStr = firstGet ? `${formatDate(firstGet.time)} ${formatTime(firstGet.time)}` : '未获得';
  
  // 地点对应的emoji
  const locationEmojis = {'公园':'🌳','商场':'🏬','海边':'🏖️','游乐场':'🎡','电影院':'🎬'};
  
  const modalHtml = `
    <div class="modal-mask" id="collectibleDetailMask" style="display:flex;position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:99999;align-items:center;justify-content:center;margin:0;padding:0;">
      <div class="modal-box" style="max-width:340px;width:90%;padding:0;overflow:hidden;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
        <button class="modal-close-btn" type="button" aria-label="关闭收藏品详情" onclick="closeCollectibleDetail()" style="position:absolute;top:12px;right:12px;z-index:2;">✕</button>
        <!-- 顶部区域 -->
        <div style="background:${obtained ? 'linear-gradient(135deg,#fef3c7,#fde68a)' : 'linear-gradient(135deg,#f3f4f6,#e5e7eb)'};padding:28px 20px;text-align:center;">
          <div style="font-size:64px;${obtained ? '' : 'filter:grayscale(100%);opacity:0.5;'}">${emoji}</div>
          <div style="font-size:20px;font-weight:700;color:${obtained ? '#92400e' : '#666'};margin-top:10px;">${info.name}</div>
          <div style="font-size:12px;color:${obtained ? '#b45309' : '#999'};margin-top:4px;">${locationEmojis[info.location] || '📍'} ${info.location}</div>
        </div>
        
        <!-- 详情区域 -->
        <div style="padding:18px;background:#fff;">
          <!-- 描述 -->
          <div style="background:${obtained ? '#fffbeb' : '#f9fafb'};border-radius:12px;padding:12px;margin-bottom:14px;">
            <div style="font-size:11px;font-weight:600;color:${obtained ? '#92400e' : '#999'};margin-bottom:6px;">📝 收藏品介绍</div>
            <div style="font-size:13px;color:${obtained ? '#78350f' : '#666'};line-height:1.6;">${info.desc}</div>
          </div>
          
          <!-- 统计信息 -->
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
            <div style="background:#f9fafb;border-radius:10px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:#999;">获得数量</div>
              <div style="font-size:18px;font-weight:700;color:${obtained ? '#f59e0b' : '#999'};margin-top:2px;">${obtained ? '×' + count : '未获得'}</div>
            </div>
            <div style="background:#f9fafb;border-radius:10px;padding:10px;text-align:center;">
              <div style="font-size:11px;color:#999;">首次获得</div>
              <div style="font-size:13px;font-weight:600;color:${obtained ? '#666' : '#999'};margin-top:4px;">${firstTimeStr}</div>
            </div>
          </div>
          
          <!-- 关闭按钮 -->
          <button onclick="closeCollectibleDetail()" style="width:100%;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(245,158,11,0.4);">
            ${obtained ? '知道啦~' : '去收集！'}
          </button>
        </div>
      </div>
    </div>
  `;
  
  // 移除已存在的弹窗
  const oldModal = document.getElementById('collectibleDetailMask');
  if(oldModal) oldModal.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow='hidden';
}

// 关闭收藏品说明弹窗（带淡出动画）
function closeCollectibleDetail(){
  const modal = document.getElementById('collectibleDetailMask');
  if(!modal) return;
  modal.classList.add('pet-modal-stationary','closing');
  document.body.style.overflow='';
  setTimeout(() => {
    if(modal.parentNode) modal.parentNode.removeChild(modal);
  }, 200);
}

// 开始出去玩
function startPetPlay(locationId){
  const loc = PET_PLAY_LOCATIONS.find(l => l.id === locationId);
  if(!loc) return;
  currentPlayLocation = loc;
  
  // 扣除状态
  lsSet('pet_hunger', Math.max(0, lsGet('pet_hunger', 50) - loc.hungerCost));
  lsSet('pet_clean', Math.max(0, lsGet('pet_clean', 100) - loc.cleanCost));
  
  // 设置游玩状态
  const playData = {
    locationId: loc.id,
    startTime: Date.now(),
    duration: loc.duration * 1000,
    endTime: Date.now() + loc.duration * 1000
  };
  lsSet('pet_play_data', playData);
  
  // 更新UI
  updatePlayUI();
  if(typeof playSound === 'function') playSound('success');
  showToast(`小橘去${loc.name}玩啦~`);
}

// 更新出去玩UI
function updatePlayUI(){
  const playData = lsGet('pet_play_data', null);
  const awayArea = document.getElementById('playAwayArea');
  const listArea = document.getElementById('playLocationList');
  
  if(playData && Date.now() < playData.endTime){
    if(awayArea) awayArea.style.display = 'block';
    if(listArea) listArea.style.display = 'none';
    const loc = PET_PLAY_LOCATIONS.find(l => l.id === playData.locationId);
    if(loc){
      const awayEmoji = document.getElementById('playAwayEmoji');
      const awayText = document.getElementById('playAwayText');
      const awayReward = document.getElementById('playAwayReward');
      if(awayEmoji) awayEmoji.textContent = loc.emoji;
      if(awayText) awayText.textContent = `小橘正在${loc.name}玩耍...`;
      if(awayReward) awayReward.textContent = `预计好感 +${loc.affectionGain}，金币 ${loc.coinMin}-${loc.coinMax}`;
    }
    startPlayTimer();
  }else{
    if(awayArea) awayArea.style.display = 'none';
    if(listArea) listArea.style.display = 'grid';
    if(petPlayTimer){
      clearInterval(petPlayTimer);
      petPlayTimer = null;
    }
    renderPlayLocations();
  }
  updatePetStatusDisplay('play');
}

// 启动游玩计时器
function startPlayTimer(){
  if(petPlayTimer) clearInterval(petPlayTimer);
  petPlayTimer = setInterval(() => {
    const playData = lsGet('pet_play_data', null);
    if(!playData){
      clearInterval(petPlayTimer);
      petPlayTimer = null;
      return;
    }
    const remaining = Math.max(0, playData.endTime - Date.now());
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    const timeStr = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    
    // 更新出去玩页面倒计时
    const timerEl = document.getElementById('playAwayTimer');
    if(timerEl) timerEl.textContent = timeStr;
    
    // 更新状态页面倒计时
    const statusTimerEl = document.getElementById('statusPetAwayTimer');
    if(statusTimerEl) statusTimerEl.textContent = timeStr;
    
    if(remaining <= 0){
      completePetPlay();
    }
  }, 500);
}

// 完成出去玩
function completePetPlay(){
  const playData = lsGet('pet_play_data', null);
  if(!playData) return;
  const loc = PET_PLAY_LOCATIONS.find(l => l.id === playData.locationId);
  if(!loc) return;
  
  // 增加好感度
  const currentAffection = lsGet('pet_affection', 50);
  lsSet('pet_affection', Math.min(100, currentAffection + loc.affectionGain));
  
  // 随机金币奖励
  const coinReward = Math.floor(Math.random() * (loc.coinMax - loc.coinMin + 1)) + loc.coinMin;
  bpAddCoins(coinReward, 'play');
  
  // 战力奖励
  if(loc.powerGain > 0){
    const currentPower = lsGet('pet_power', 0);
    lsSet('pet_power', currentPower + loc.powerGain);
    const totalGained = lsGet('pet_total_gained_power', 0);
    lsSet('pet_total_gained_power', totalGained + loc.powerGain);
  }
  
  // 收藏品奖励（50%概率获得，使用必出收藏品卡则必定获得）
  let obtainedCollectible = null;
  const guaranteedCollectible = lsGet('pet_guaranteed_collectible', false);
  const shouldGetCollectible = guaranteedCollectible || Math.random() < 0.5;
  if(shouldGetCollectible && loc.collectibles && loc.collectibles.length > 0){
    obtainedCollectible = loc.collectibles[Math.floor(Math.random() * loc.collectibles.length)];
    const collections = lsGet('pet_collections', {});
    collections[obtainedCollectible] = (collections[obtainedCollectible] || 0) + 1;
    lsSet('pet_collections', collections);
    
    // 记录获得历史
    const history = lsGet('pet_collection_history', []);
    history.push({
      collectible: obtainedCollectible,
      location: loc.name,
      time: Date.now()
    });
    lsSet('pet_collection_history', history);
    
    // 清除必出收藏品标记
    if(guaranteedCollectible){
      lsSet('pet_guaranteed_collectible', false);
    }
  }
  
  // 清除游玩数据
  lsSet('pet_play_data', null);
  currentPlayLocation = null;
  
  // 清除定时器
  if(petPlayTimer){
    clearInterval(petPlayTimer);
    petPlayTimer = null;
  }
  
  // 更新UI
  updatePlayUI();
  if(typeof playSound === 'function') playSound('success');
  
  let rewardMsg = `小橘从${loc.name}回来啦~ 💕+${loc.affectionGain}好感，💰+${coinReward}金币`;
  if(loc.powerGain > 0) rewardMsg += `，⚔️+${loc.powerGain}战力`;
  if(obtainedCollectible) rewardMsg += `，🏆获得收藏品${obtainedCollectible}`;
  showToast(rewardMsg);
}

// 从游玩中召回宠物
function recallPetFromPlay(){
  const playData = lsGet('pet_play_data', null);
  if(!playData) return;
  lsSet('pet_play_data', null);
  currentPlayLocation = null;
  if(petPlayTimer){
    clearInterval(petPlayTimer);
    petPlayTimer = null;
  }
  updatePlayUI();
  if(typeof playSound === 'function') playSound('click');
  showToast('小橘被召回啦~');
}

let petSchoolTimer = null;

// 初始化宠物战力、清洁值和毕业次数
function initPetPower(){
  if(lsGet('pet_power', null) === null){
    lsSet('pet_power', 0);
  }
  if(lsGet('pet_clean', null) === null){
    lsSet('pet_clean', 100);
  }
  if(lsGet('pet_school_counts', null) === null){
    lsSet('pet_school_counts', {});
  }
}

// 检查学校是否解锁
function isSchoolUnlocked(schoolId){
  const school = PET_SCHOOLS.find(s => s.id === schoolId);
  if(!school || !school.unlockSchool) return true;
  const counts = lsGet('pet_school_counts', {});
  const requiredCount = school.unlockCount;
  const currentCount = counts[school.unlockSchool] || 0;
  return currentCount >= requiredCount;
}

// 获取学校解锁进度
function getSchoolUnlockProgress(schoolId){
  const school = PET_SCHOOLS.find(s => s.id === schoolId);
  if(!school || !school.unlockSchool) return {current:0, required:0, percent:100};
  const counts = lsGet('pet_school_counts', {});
  const requiredCount = school.unlockCount;
  const currentCount = Math.min(counts[school.unlockSchool] || 0, requiredCount);
  return {current:currentCount, required:requiredCount, percent:Math.floor(currentCount/requiredCount*100)};
}

// 更新宠物状态显示（状态页面和上学页面）
function updatePetStatusDisplay(){
  const power = lsGet('pet_power', 0);
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  const affection = lsGet('pet_affection', 50);
  const hungerPercent = Math.max(0, Math.min(100, hunger));
  const cleanPercent = Math.max(0, Math.min(100, clean));
  const affectionPercent = Math.max(0, Math.min(100, affection));
  
  // 根据饱食度和清洁值更新心情和表情
  let mood, emoji;
  if(hungerPercent >= 80 && cleanPercent >= 80){ mood='吃饱喝足，超级开心~'; emoji='😺'; }
  else if(hungerPercent >= 50 && cleanPercent >= 50){ mood='心情不错~'; emoji='🐱'; }
  else if(hungerPercent >= 20 && cleanPercent >= 20){ mood='有点饿了/该洗澡了...'; emoji='😿'; }
  else{ mood='快饿晕啦/脏死啦，快照顾我！'; emoji='😾'; }
  
  if(cleanPercent < 30){ emoji = '🥺'; mood = '脏死啦，快给我洗澡！'; }
  
  // 状态页面
  const elStatusPower = document.getElementById('statusPetPower');
  const elStatusEmoji = document.getElementById('statusPetEmoji');
  const elStatusMood = document.getElementById('statusPetMood');
  const elStatusHungerText = document.getElementById('statusHungerText');
  const elStatusHungerBar = document.getElementById('statusHungerBar');
  const elStatusCleanText = document.getElementById('statusCleanText');
  const elStatusCleanBar = document.getElementById('statusCleanBar');
  const elStatusAffectionText = document.getElementById('statusAffectionText');
  const elStatusAffectionBar = document.getElementById('statusAffectionBar');
  if(elStatusPower) elStatusPower.textContent = power;
  if(elStatusEmoji) elStatusEmoji.textContent = emoji;
  if(elStatusMood) elStatusMood.textContent = mood;
  if(elStatusHungerText) elStatusHungerText.textContent = hungerPercent + '/100';
  if(elStatusHungerBar) elStatusHungerBar.style.width = hungerPercent + '%';
  if(elStatusCleanText) elStatusCleanText.textContent = cleanPercent + '/100';
  if(elStatusCleanBar) elStatusCleanBar.style.width = cleanPercent + '%';
  if(elStatusAffectionText) elStatusAffectionText.textContent = affectionPercent + '/100';
  if(elStatusAffectionBar) elStatusAffectionBar.style.width = affectionPercent + '%';
  
  // 上学页面
  const elSchoolPower = document.getElementById('schoolPetPower');
  const elSchoolEmoji = document.getElementById('schoolPetEmoji');
  const elSchoolMood = document.getElementById('schoolPetMood');
  const elSchoolCoins = document.getElementById('schoolCoins');
  const elSchoolHungerText = document.getElementById('schoolHungerText');
  const elSchoolHungerBar = document.getElementById('schoolHungerBar');
  const elSchoolCleanText = document.getElementById('schoolCleanText');
  const elSchoolCleanBar = document.getElementById('schoolCleanBar');
  const elSchoolAffectionText = document.getElementById('schoolAffectionText');
  const elSchoolAffectionBar = document.getElementById('schoolAffectionBar');
  if(elSchoolPower) elSchoolPower.textContent = power;
  if(elSchoolEmoji) elSchoolEmoji.textContent = emoji;
  if(elSchoolMood) elSchoolMood.textContent = mood;
  if(elSchoolCoins) elSchoolCoins.textContent = bpGetCoins();
  if(elSchoolHungerText) elSchoolHungerText.textContent = hungerPercent + '/100';
  if(elSchoolHungerBar) elSchoolHungerBar.style.width = hungerPercent + '%';
  if(elSchoolCleanText) elSchoolCleanText.textContent = cleanPercent + '/100';
  if(elSchoolCleanBar) elSchoolCleanBar.style.width = cleanPercent + '%';
  if(elSchoolAffectionText) elSchoolAffectionText.textContent = affectionPercent + '/100';
  if(elSchoolAffectionBar) elSchoolAffectionBar.style.width = affectionPercent + '%';
  
  // 出去玩页面
  const elPlayPower = document.getElementById('playPetPower');
  const elPlayEmoji = document.getElementById('playPetEmoji');
  const elPlayMood = document.getElementById('playPetMood');
  const elPlayCoins = document.getElementById('playCoins');
  const elPlayHungerText = document.getElementById('playHungerText');
  const elPlayHungerBar = document.getElementById('playHungerBar');
  const elPlayCleanText = document.getElementById('playCleanText');
  const elPlayCleanBar = document.getElementById('playCleanBar');
  const elPlayAffectionText = document.getElementById('playAffectionText');
  const elPlayAffectionBar = document.getElementById('playAffectionBar');
  if(elPlayPower) elPlayPower.textContent = power;
  if(elPlayEmoji) elPlayEmoji.textContent = emoji;
  if(elPlayMood) elPlayMood.textContent = mood;
  if(elPlayCoins) elPlayCoins.textContent = bpGetCoins();
  if(elPlayHungerText) elPlayHungerText.textContent = hungerPercent + '/100';
  if(elPlayHungerBar) elPlayHungerBar.style.width = hungerPercent + '%';
  if(elPlayCleanText) elPlayCleanText.textContent = cleanPercent + '/100';
  if(elPlayCleanBar) elPlayCleanBar.style.width = cleanPercent + '%';
  if(elPlayAffectionText) elPlayAffectionText.textContent = affectionPercent + '/100';
  if(elPlayAffectionBar) elPlayAffectionBar.style.width = affectionPercent + '%';
  
  // 检查宠物是否在上学或出去玩或打工
  const schoolData = lsGet('pet_school_data', null);
  const playData = lsGet('pet_play_data', null);
  const workData = lsGet('pet_work_data', null);
  const elHomeArea = document.getElementById('statusPetHomeArea');
  const elAwayArea = document.getElementById('statusPetAwayArea');
  const elSchoolListArea = document.getElementById('schoolListArea');
  const elSchoolAwayArea = document.getElementById('schoolAwayArea');
  
  if(playData && playData.endTime > Date.now()){
    // 宠物正在出去玩
    if(elHomeArea) elHomeArea.style.display = 'none';
    if(elAwayArea) elAwayArea.style.display = 'block';
    if(elSchoolListArea) elSchoolListArea.style.display = 'none';
    if(elSchoolAwayArea) elSchoolAwayArea.style.display = 'none';
    
    const loc = PET_PLAY_LOCATIONS.find(l => l.id === playData.locationId);
    if(loc){
      const elAwayText = document.getElementById('statusPetAwayText');
      if(elAwayText) elAwayText.textContent = '小橘正在' + loc.name + '玩耍...';
    }
    // 修改召回按钮为游玩召回
    const recallBtn = document.querySelector('#statusPetAwayArea button');
    if(recallBtn){
      recallBtn.style.display = 'block';
      recallBtn.textContent = '🏠 召回宠物';
      recallBtn.onclick = recallPetFromPlay;
    }
    // 修改使用道具按钮为出去玩道具
    const allBtns = document.querySelectorAll('#statusPetAwayArea button');
    if(allBtns.length > 1){
      allBtns[1].style.display = 'block';
      allBtns[1].textContent = '✨ 使用道具';
      allBtns[1].setAttribute('onclick', 'showPlaySuperItemPanel()');
      allBtns[1].onclick = showPlaySuperItemPanel;
    }
    // 更新倒计时
    const remaining = Math.max(0, playData.endTime - Date.now());
    const timerEl = document.getElementById('statusPetAwayTimer');
    if(timerEl){
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      timerEl.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }
  } else if(workData && workData.endTime > Date.now()){
    // 宠物正在打工
    if(elHomeArea) elHomeArea.style.display = 'none';
    if(elAwayArea) elAwayArea.style.display = 'block';
    if(elSchoolListArea) elSchoolListArea.style.display = 'none';
    if(elSchoolAwayArea) elSchoolAwayArea.style.display = 'none';
    
    const job = PET_JOBS.find(j => j.id === workData.jobId);
    if(job){
      const elAwayText = document.getElementById('statusPetAwayText');
      if(elAwayText) elAwayText.textContent = '小橘正在' + job.name + '打工...';
    }
    // 召回按钮
    const recallBtn = document.querySelector('#statusPetAwayArea button');
    if(recallBtn){
      recallBtn.style.display = 'block';
      recallBtn.textContent = '🏠 召回宠物（不获得工资）';
      recallBtn.onclick = recallPetWork;
    }
    // 隐藏使用道具按钮（打工没有道具）
    const allBtns = document.querySelectorAll('#statusPetAwayArea button');
    if(allBtns.length > 1){
      allBtns[1].style.display = 'none';
    }
    // 更新倒计时
    const remaining = Math.max(0, workData.endTime - Date.now());
    const timerEl = document.getElementById('statusPetAwayTimer');
    if(timerEl){
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      timerEl.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }
  } else if(schoolData && schoolData.endTime > Date.now()){
    // 宠物正在上学
    if(elHomeArea) elHomeArea.style.display = 'none';
    if(elAwayArea) elAwayArea.style.display = 'block';
    if(elSchoolListArea) elSchoolListArea.style.display = 'none';
    if(elSchoolAwayArea) elSchoolAwayArea.style.display = 'block';
    
    const school = PET_SCHOOLS.find(s => s.id === schoolData.schoolId);
    if(school){
      const elAwayText = document.getElementById('statusPetAwayText');
      const elSchoolAwayText = document.getElementById('schoolAwayText');
      const elSchoolAwayReward = document.getElementById('schoolAwayReward');
      if(elAwayText) elAwayText.textContent = '小橘正在' + school.name + '上学...';
      if(elSchoolAwayText) elSchoolAwayText.textContent = '小橘正在' + school.name + '上学...';
      if(elSchoolAwayReward) elSchoolAwayReward.textContent = '预计战力 +' + school.power;
    }
    // 恢复上学召回按钮
    const recallBtn = document.querySelector('#statusPetAwayArea button');
    if(recallBtn){
      recallBtn.style.display = 'block';
      recallBtn.textContent = '🏠 召回宠物（退还一半金币）';
      recallBtn.onclick = recallPet;
    }
    // 显示使用道具按钮（恢复为上学道具）
    const allBtns = document.querySelectorAll('#statusPetAwayArea button');
    if(allBtns.length > 1){
      allBtns[1].style.display = 'block';
      allBtns[1].textContent = '✨ 使用道具';
      allBtns[1].setAttribute('onclick', 'showSuperItemPanel()');
      allBtns[1].onclick = showSuperItemPanel;
    }
  } else {
    // 宠物在家
    if(elHomeArea) elHomeArea.style.display = 'block';
    if(elAwayArea) elAwayArea.style.display = 'none';
    if(elSchoolListArea) elSchoolListArea.style.display = 'block';
    if(elSchoolAwayArea) elSchoolAwayArea.style.display = 'none';
  }
}

// 初始化宠物上学页面
function initPetSchool(){
  renderSchoolList();
  updatePetStatusDisplay();
  startPetSchoolTimer();
}

// 渲染学校列表
// 当前选中待确认的学校
let confirmSchoolId = null;

function renderSchoolList(){
  const container = document.getElementById('schoolList');
  if(!container) return;
  container.innerHTML = '';
  PET_SCHOOLS.forEach(school => {
    const unlocked = isSchoolUnlocked(school.id);
    const progress = getSchoolUnlockProgress(school.id);
    const isConfirming = confirmSchoolId === school.id;
    const div = document.createElement('div');
    if(unlocked){
      div.className = 'fl-state-material-card';
      div.style.cssText = `padding:16px;cursor:pointer;transition:transform 0.2s;border-left:6px solid ${school.color};${isConfirming ? 'border:2px solid #667eea;' : ''}`;
      div.onmouseover = () => div.style.transform = 'translateX(4px)';
      div.onmouseout = () => div.style.transform = 'translateX(0)';
      div.onclick = () => toggleSchoolConfirm(school.id);
    } else {
      div.style.cssText = `background:#f5f5f5;border-radius:14px;padding:16px;cursor:not-allowed;box-shadow:0 2px 8px rgba(0,0,0,0.04);border-left:6px solid #ccc;opacity:0.7;`;
    }
    let extraInfo = '';
    if(!unlocked && school.unlockSchool){
      const unlockSchoolName = PET_SCHOOLS.find(s => s.id === school.unlockSchool)?.name || '';
      extraInfo = `
        <div style="margin-top:8px;padding:8px 12px;background:#fff3cd;border-radius:8px;">
          <div style="font-size:12px;color:#856404;font-weight:600;">🔒 需要${unlockSchoolName}毕业 ${progress.required} 次解锁</div>
          <div style="height:6px;background:#fff;border-radius:3px;margin-top:6px;overflow:hidden;">
            <div style="height:100%;background:#f59e0b;border-radius:3px;width:${progress.percent}%;"></div>
          </div>
          <div style="font-size:11px;color:#856404;margin-top:4px;text-align:right;">${progress.current}/${progress.required}</div>
        </div>
      `;
    }
    // 确认面板
    let confirmPanel = '';
    if(isConfirming && unlocked){
      const curHunger = lsGet('pet_hunger', 50);
      const curClean = lsGet('pet_clean', 100);
      const curAffection = lsGet('pet_affection', 50);
      const curCoins = bpGetCoins();
      const lackHunger = curHunger < 10;
      const lackClean = curClean < 10;
      const lackAffection = curAffection < 5;
      const lackCoins = curCoins < school.cost;
      const canConfirm = !lackHunger && !lackClean && !lackAffection && !lackCoins;
      const lackList = [];
      if(lackCoins) lackList.push('💰金币');
      if(lackHunger) lackList.push('🍖饱食度');
      if(lackClean) lackList.push('🧼清洁值');
      if(lackAffection) lackList.push('💕好感度');
      const warnText = canConfirm ? '' : `<div style="margin-top:8px;padding:6px 10px;background:#fef2f2;border-radius:6px;font-size:11px;color:#dc2626;font-weight:600;">⚠️ ${lackList.join('、')}不足，无法上学</div>`;
      const confirmBtnStyle = canConfirm 
        ? 'background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;cursor:pointer;box-shadow:0 2px 6px rgba(102,126,234,0.3);'
        : 'background:#d1d5db;color:#9ca3af;cursor:not-allowed;';
      confirmPanel = `
        <div style="margin-top:12px;padding:12px;background:linear-gradient(135deg,#eef2ff,#fdf4ff);border-radius:10px;border:1px dashed #667eea;" onclick="event.stopPropagation();">
          <div style="font-size:13px;font-weight:700;color:#4c51bf;margin-bottom:8px;">📋 上学消耗确认</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:12px;">
            <div style="color:#666;${lackCoins ? 'background:#fef2f2;padding:2px 4px;border-radius:4px;' : ''}">💰 消耗金币：<span style="color:${lackCoins ? '#dc2626' : '#f59e0b'};font-weight:600;">-${school.cost}${lackCoins ? ' (不足)' : ''}</span></div>
            <div style="color:#666;">⏱️ 上学时长：<span style="color:#667eea;font-weight:600;">${school.duration}秒</span></div>
            <div style="color:#666;${lackHunger ? 'background:#fef2f2;padding:2px 4px;border-radius:4px;' : ''}">🍖 饱食度：<span style="color:${lackHunger ? '#dc2626' : '#ef4444'};font-weight:600;">-10${lackHunger ? ' (不足)' : ''}</span></div>
            <div style="color:#666;${lackClean ? 'background:#fef2f2;padding:2px 4px;border-radius:4px;' : ''}">🧼 清洁值：<span style="color:${lackClean ? '#dc2626' : '#3b82f6'};font-weight:600;">-10${lackClean ? ' (不足)' : ''}</span></div>
            <div style="color:#666;${lackAffection ? 'background:#fef2f2;padding:2px 4px;border-radius:4px;' : ''}">💕 好感度：<span style="color:${lackAffection ? '#dc2626' : '#ec4899'};font-weight:600;">-5${lackAffection ? ' (不足)' : ''}</span></div>
            <div style="color:#666;">⚔️ 获得战力：<span style="color:#10b981;font-weight:600;">+${school.power}</span></div>
          </div>
          ${warnText}
          <div style="display:flex;gap:8px;margin-top:10px;">
            <button ${canConfirm ? `onclick="confirmSendToSchool('${school.id}')"` : 'disabled'} style="flex:1;border:none;padding:8px;border-radius:8px;font-size:13px;font-weight:700;${confirmBtnStyle}">
              ✅ 确认上学
            </button>
            <button onclick="cancelSchoolConfirm()" style="flex:1;background:#e5e7eb;color:#666;border:none;padding:8px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;">
              ❌ 取消
            </button>
          </div>
        </div>
      `;
    }
    div.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;align-items:center;">
          <div style="font-size:32px;filter:${unlocked ? 'none' : 'grayscale(100%)'};">${unlocked ? school.emoji : '🔒'}</div>
          <div style="margin-left:12px;">
            <div style="font-size:16px;font-weight:700;">${school.name}</div>
            <div style="font-size:12px;color:#666;margin-top:2px;">⏱️ ${school.duration}秒 · ⚔️ 战力+${school.power}</div>
          </div>
        </div>
        <div style="background:${unlocked ? '#fef3c7' : '#e0e0e0'};color:${unlocked ? '#f59e0b' : '#999'};padding:6px 14px;border-radius:12px;font-size:14px;font-weight:700;">
          💰 ${school.cost}
        </div>
      </div>
      ${extraInfo}
      ${confirmPanel}
    `;
    container.appendChild(div);
  });
}

// 切换学校确认面板
function toggleSchoolConfirm(schoolId){
  if(confirmSchoolId === schoolId){
    confirmSchoolId = null;
  } else {
    confirmSchoolId = schoolId;
  }
  renderSchoolList();
}

// 取消学校确认
function cancelSchoolConfirm(){
  confirmSchoolId = null;
  renderSchoolList();
}

// 确认送宠物去上学
function confirmSendToSchool(schoolId){
  confirmSchoolId = null;
  renderSchoolList();
  sendPetToSchool(schoolId);
}

// 送宠物去上学
function sendPetToSchool(schoolId){
  const school = PET_SCHOOLS.find(s => s.id === schoolId);
  if(!school) return;
  
  // 检查学校是否解锁
  if(!isSchoolUnlocked(schoolId)){
    const progress = getSchoolUnlockProgress(schoolId);
    const unlockSchoolName = PET_SCHOOLS.find(s => s.id === school.unlockSchool)?.name || '';
    showToast(`🔒 ${school.name}未解锁，需要${unlockSchoolName}毕业${progress.required}次（当前${progress.current}/${progress.required}）`);
    return;
  }
  
  const coins = bpGetCoins();
  if(coins < school.cost){
    showToast('金币不足，去玩游戏赚金币吧~');
    return;
  }
  
  // 检查状态是否足够抵扣上学消耗
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  const affection = lsGet('pet_affection', 50);
  const lackStats = [];
  if(hunger < 10) lackStats.push('🍖饱食度');
  if(clean < 10) lackStats.push('🧼清洁值');
  if(affection < 5) lackStats.push('💕好感度');
  if(lackStats.length > 0){
    showToast('⚠️ 状态不足无法上学！' + lackStats.join('、') + '太低了，先照顾小橘吧~');
    return;
  }
  
  // 扣除金币
  lsSet('backpack_coins', coins - school.cost);
  
  // 记录上学数据
  const schoolData = {
    schoolId: school.id,
    startTime: Date.now(),
    endTime: Date.now() + school.duration * 1000
  };
  lsSet('pet_school_data', schoolData);
  
  // 扣除饱食度和清洁值（上学消耗体力和变脏）
  lsSet('pet_hunger', Math.max(0, hunger - 10));
  lsSet('pet_clean', Math.max(0, clean - 10));
  // 减少好感度（上学没时间陪小橘玩）
  lsSet('pet_affection', Math.max(0, affection - 5));
  
  showToast('小橘去' + school.name + '上学啦！');
  updatePetStatusDisplay();
  startPetSchoolTimer();
  // 每日任务进度
  if(typeof updateDailyTask === 'function') updateDailyTask('daily_pet_school', 1);
}

// 召回宠物
function recallPet(){
  const schoolData = lsGet('pet_school_data', null);
  if(!schoolData) return;
  
  const school = PET_SCHOOLS.find(s => s.id === schoolData.schoolId);
  if(!school) return;
  
  // 退还一半金币
  const refund = Math.floor(school.cost / 2);
  const coins = bpGetCoins();
  lsSet('backpack_coins', coins + refund);
  
  // 清除上学数据
  lsSet('pet_school_data', null);
  
  // 停止倒计时
  if(petSchoolTimer){
    clearInterval(petSchoolTimer);
    petSchoolTimer = null;
  }
  
  showToast('小橘被召回啦！退还' + refund + '金币（不获得战力）');
  updatePetStatusDisplay();
  if(typeof bpUpdateHomeBadge === 'function') bpUpdateHomeBadge();
}

// 启动上学倒计时
function startPetSchoolTimer(){
  if(petSchoolTimer){
    clearInterval(petSchoolTimer);
    petSchoolTimer = null;
  }
  
  const schoolData = lsGet('pet_school_data', null);
  if(!schoolData || schoolData.endTime <= Date.now()){
    return;
  }
  
  updateSchoolTimerDisplay();
  
  petSchoolTimer = setInterval(() => {
    const data = lsGet('pet_school_data', null);
    if(!data || data.endTime <= Date.now()){
      // 上学结束
      clearInterval(petSchoolTimer);
      petSchoolTimer = null;
      completePetSchool();
      return;
    }
    updateSchoolTimerDisplay();
  }, 1000);
}

// 更新倒计时显示
function updateSchoolTimerDisplay(){
  const schoolData = lsGet('pet_school_data', null);
  if(!schoolData) return;
  
  const remaining = Math.max(0, Math.ceil((schoolData.endTime - Date.now()) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  
  const elStatusTimer = document.getElementById('statusPetAwayTimer');
  const elSchoolTimer = document.getElementById('schoolAwayTimer');
  if(elStatusTimer) elStatusTimer.textContent = timeStr;
  if(elSchoolTimer) elSchoolTimer.textContent = timeStr;
}

// 完成上学，提升战力
function completePetSchool(){
  const schoolData = lsGet('pet_school_data', null);
  if(!schoolData) return;
  
  const school = PET_SCHOOLS.find(s => s.id === schoolData.schoolId);
  if(!school) return;
  
  // 提升战力（支持双倍战力卡）
  const power = lsGet('pet_power', 0);
  const doublePower = lsGet('pet_double_power_next', false);
  const gainedPower = doublePower ? school.power * 2 : school.power;
  lsSet('pet_power', power + gainedPower);
  if(doublePower) lsSet('pet_double_power_next', false);
  
  // 记录累计获得战力
  const totalGained = lsGet('pet_total_gained_power', 0);
  lsSet('pet_total_gained_power', totalGained + gainedPower);
  
  // 记录毕业次数
  const counts = lsGet('pet_school_counts', {});
  counts[school.id] = (counts[school.id] || 0) + 1;
  lsSet('pet_school_counts', counts);
  
  // 清除上学数据
  lsSet('pet_school_data', null);
  
  // 判断是否是最后一次升学（达到解锁下一级学校的次数）
  const nextSchool = PET_SCHOOLS.find(s => s.unlockSchool === school.id);
  const isFinalGraduation = !nextSchool || counts[school.id] === nextSchool.unlockCount;
  
  const powerText = doublePower ? `战力+${gainedPower}（双倍！）` : `战力+${gainedPower}`;
  if(isFinalGraduation){
    showToast('🎉 小橘从' + school.name + '毕业啦！' + powerText + '！');
  } else {
    showToast('🐱 小橘放学啦，回去抱抱她吧~ ' + powerText + '！');
  }
  
  updatePetStatusDisplay();
  renderSchoolList();
  if(typeof bpUpdateHomeBadge === 'function') bpUpdateHomeBadge();
  
  // 生成校长邮件
  generateSchoolMail(school, counts[school.id], isFinalGraduation);
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePetWorkPage", "<!-- pagePetWorkPage -->\n<div class=\"tool-page\" id=\"pagePetWorkPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>💼 出门打工</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">让小橘去打工赚金币！学历越高，工作越赚钱~ 关闭浏览器时间也会继续走哦</div>\n      \n      <!-- 小橘状态 -->\n      <div class=\"fl-state-material-card\" style=\"padding:16px;margin-bottom:14px;\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n          <div style=\"display:flex;align-items:center;\">\n            <div style=\"font-size:48px;\" id=\"workPetEmoji\">🐱</div>\n            <div style=\"margin-left:12px;\">\n              <div style=\"font-size:16px;font-weight:700;\">小橘</div>\n              <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"workPetMood\">心情不错~</div>\n            </div>\n          </div>\n          <div style=\"text-align:right;flex-shrink:0;min-width:80px;\">\n            <div style=\"display:inline-block;background:#fef3c7;color:#f59e0b;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;white-space:nowrap;\">\n              ⚔️ <span id=\"workPetPower\">0</span>\n            </div>\n            <div style=\"font-size:11px;color:#666;margin-top:5px;white-space:nowrap;\">💰 <span id=\"workCoins\">0</span></div>\n          </div>\n        </div>\n        <div style=\"margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;\">\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🍖 饱食</span><span id=\"workHungerText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"workHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🧼 清洁</span><span id=\"workCleanText\">100/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"workCleanBar\" style=\"height:100%;background:linear-gradient(90deg,#60a5fa,#34d399);border-radius:4px;width:100%;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>💕 好感</span><span id=\"workAffectionText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"workAffectionBar\" style=\"height:100%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:4px;width:50%;\"></div>\n            </div>\n          </div>\n        </div>\n      </div>\n      \n      <!-- 打工中状态 -->\n      <div id=\"workAwayArea\" style=\"display:none;margin-bottom:14px;\">\n        <div style=\"background:#fff3cd;border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);\">\n          <div style=\"font-size:48px;\">💼</div>\n          <div style=\"font-size:16px;font-weight:700;color:#856404;margin-top:8px;\" id=\"workAwayText\">小橘正在打工...</div>\n          <div style=\"font-size:28px;font-weight:700;color:#856404;margin-top:10px;\" id=\"workAwayTimer\">00:00</div>\n          <div style=\"font-size:13px;color:#856404;margin-top:8px;\" id=\"workAwayReward\">预计收入 0 金币</div>\n          <button onclick=\"recallPetWork()\" style=\"margin-top:14px;background:#ef4444;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(239,68,68,0.3);\">\n            🏠 召回宠物（不获得工资）\n          </button>\n        </div>\n      </div>\n      \n      <!-- 工作列表 -->\n      <div id=\"workListArea\">\n        <div style=\"display:grid;gap:12px;\" id=\"workList\">\n          <!-- 工作列表由JS生成 -->\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 宠物打工系统 ====================
let petWorkTimer = null;

// 判断工作是否解锁
function isJobUnlocked(jobId){
  const job = PET_JOBS.find(j => j.id === jobId);
  if(!job) return false;
  if(!job.unlockSchool) return true;
  const counts = lsGet('pet_school_counts', {});
  return (counts[job.unlockSchool] || 0) >= job.unlockCount;
}

// 获取工作解锁进度
function getJobUnlockProgress(jobId){
  const job = PET_JOBS.find(j => j.id === jobId);
  if(!job || !job.unlockSchool) return {current:0, required:0};
  const counts = lsGet('pet_school_counts', {});
  return {current: counts[job.unlockSchool] || 0, required: job.unlockCount};
}

// 初始化打工页面
function initPetWork(){
  updateWorkPetDisplay();
  renderWorkList();
  startPetWorkTimer();
}

// 更新打工页面宠物状态显示
function updateWorkPetDisplay(){
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  const affection = lsGet('pet_affection', 50);
  const power = lsGet('pet_power', 0);
  const coins = bpGetCoins();
  
  let mood = '心情不错~', emoji = '🐱';
  if(hunger >= 80){emoji='😺';mood='吃饱喝足，精神满满~';}
  else if(hunger >= 50){emoji='🐱';mood='心情不错~';}
  else if(hunger >= 20){emoji='😿';mood='有点饿了...';}
  else{emoji='😾';mood='饿晕了，快喂我！';}
  
  const setBar = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.style.width = Math.max(0, Math.min(100, val)) + '%';
  };
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.textContent = Math.round(val) + '/100';
  };
  
  setText('workHungerText', hunger); setBar('workHungerBar', hunger);
  setText('workCleanText', clean); setBar('workCleanBar', clean);
  setText('workAffectionText', affection); setBar('workAffectionBar', affection);
  
  const e1 = document.getElementById('workPetEmoji'); if(e1) e1.textContent = emoji;
  const e2 = document.getElementById('workPetMood'); if(e2) e2.textContent = mood;
  const e3 = document.getElementById('workPetPower'); if(e3) e3.textContent = power;
  const e4 = document.getElementById('workCoins'); if(e4) e4.textContent = coins;
  
  // 检查是否在打工中
  const workData = lsGet('pet_work_data', null);
  const awayArea = document.getElementById('workAwayArea');
  const listArea = document.getElementById('workListArea');
  if(workData && workData.endTime > Date.now()){
    if(awayArea) awayArea.style.display = 'block';
    if(listArea) listArea.style.display = 'none';
    const job = PET_JOBS.find(j => j.id === workData.jobId);
    if(job){
      const t = document.getElementById('workAwayText');
      if(t) t.textContent = '小橘正在' + job.name + '打工...';
      const r = document.getElementById('workAwayReward');
      if(r) r.textContent = '预计收入 ' + job.coinMin + '~' + job.coinMax + ' 金币';
    }
  } else {
    if(awayArea) awayArea.style.display = 'none';
    if(listArea) listArea.style.display = 'block';
  }
}

// 渲染工作列表
function renderWorkList(){
  const container = document.getElementById('workList');
  if(!container) return;
  container.innerHTML = '';
  PET_JOBS.forEach(job => {
    const unlocked = isJobUnlocked(job.id);
    const progress = getJobUnlockProgress(job.id);
    const div = document.createElement('div');
    div.className = 'fl-state-material-card';
    div.style.cssText = 'padding:16px;border-left:4px solid ' + job.color + ';' + (unlocked ? '' : 'opacity:0.6;');
    let lockInfo = '';
    if(!unlocked){
      const reqSchool = PET_SCHOOLS.find(s => s.id === job.unlockSchool);
      lockInfo = '<div style="font-size:11px;color:#ef4444;margin-top:4px;">🔒 需' + (reqSchool ? reqSchool.name : '') + '毕业' + progress.required + '次（' + progress.current + '/' + progress.required + '）</div>';
    }
    div.innerHTML = 
      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<div style="font-size:36px;">' + job.emoji + '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-size:15px;font-weight:700;">' + job.name + '</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">' + job.desc + '</div>' +
          '<div style="display:flex;gap:10px;margin-top:6px;font-size:11px;color:var(--text-secondary);flex-wrap:wrap;">' +
            '<span>⏱️ ' + job.duration + '秒</span>' +
            '<span>💰 ' + job.coinMin + '~' + job.coinMax + '</span>' +
            '<span>🍖-' + job.hungerCost + '</span>' +
            '<span>🧼-' + job.cleanCost + '</span>' +
          '</div>' +
          lockInfo +
        '</div>' +
        (unlocked ? '<button onclick="sendPetToWork(\'' + job.id + '\')" style="background:linear-gradient(135deg,' + job.color + ',#f59e0b);color:#fff;border:none;padding:8px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.15);flex-shrink:0;">💼 打工</button>' : '') +
      '</div>';
    container.appendChild(div);
  });
}

// 送宠物去打工
function sendPetToWork(jobId){
  const job = PET_JOBS.find(j => j.id === jobId);
  if(!job) return;
  if(!isJobUnlocked(jobId)){
    showToast('🔒 该工作未解锁');
    return;
  }
  // 检查是否正在上学/游玩/打工
  if(lsGet('pet_school_data', null)){
    showToast('⚠️ 小橘正在上学，不能同时打工~');
    return;
  }
  if(lsGet('pet_play_data', null)){
    showToast('⚠️ 小橘正在外面玩，不能同时打工~');
    return;
  }
  if(lsGet('pet_work_data', null)){
    showToast('⚠️ 小橘已经在打工了~');
    return;
  }
  // 检查状态
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  const affection = lsGet('pet_affection', 50);
  if(hunger < job.hungerCost || clean < job.cleanCost || affection < job.affectionCost){
    showToast('⚠️ 状态不足，先照顾小橘吧~');
    return;
  }
  // 扣除状态
  lsSet('pet_hunger', Math.max(0, hunger - job.hungerCost));
  lsSet('pet_clean', Math.max(0, clean - job.cleanCost));
  lsSet('pet_affection', Math.max(0, affection - job.affectionCost));
  // 记录打工数据
  const workData = {
    jobId: job.id,
    startTime: Date.now(),
    endTime: Date.now() + job.duration * 1000
  };
  lsSet('pet_work_data', workData);
  showToast('💼 小橘去' + job.name + '打工啦！');
  updateWorkPetDisplay();
  startPetWorkTimer();
  // 每日任务进度
  updateDailyTask('daily_pet_work', 1);
}

// 启动打工倒计时
function startPetWorkTimer(){
  if(petWorkTimer){
    clearInterval(petWorkTimer);
    petWorkTimer = null;
  }
  const workData = lsGet('pet_work_data', null);
  if(!workData || workData.endTime <= Date.now()){
    return;
  }
  updateWorkTimerDisplay();
  petWorkTimer = setInterval(() => {
    const data = lsGet('pet_work_data', null);
    if(!data || data.endTime <= Date.now()){
      clearInterval(petWorkTimer);
      petWorkTimer = null;
      completePetWork();
      return;
    }
    updateWorkTimerDisplay();
  }, 1000);
}

// 更新打工倒计时显示
function updateWorkTimerDisplay(){
  const workData = lsGet('pet_work_data', null);
  if(!workData) return;
  const remaining = Math.max(0, Math.ceil((workData.endTime - Date.now()) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  const el = document.getElementById('workAwayTimer');
  if(el) el.textContent = timeStr;
  // 状态页也同步
  const el2 = document.getElementById('statusPetAwayTimer');
  if(el2 && lsGet('pet_work_data', null)) el2.textContent = timeStr;
}

// 完成打工，获得金币
function completePetWork(){
  const workData = lsGet('pet_work_data', null);
  if(!workData) return;
  const job = PET_JOBS.find(j => j.id === workData.jobId);
  if(!job){ lsSet('pet_work_data', null); return; }
  // 随机金币
  const earned = Math.floor(Math.random() * (job.coinMax - job.coinMin + 1)) + job.coinMin;
  bpAddCoins(earned, 'petWork');
  // 记录打工次数
  const workCounts = lsGet('pet_work_counts', {});
  workCounts[job.id] = (workCounts[job.id] || 0) + 1;
  lsSet('pet_work_counts', workCounts);
  // 累计打工收入
  const totalEarned = lsGet('pet_work_total_earned', 0);
  lsSet('pet_work_total_earned', totalEarned + earned);
  // 清除打工数据
  lsSet('pet_work_data', null);
  showToast('💰 小橘打工回来啦！赚了' + earned + '金币~');
  updatePetStatusDisplay();
  updateWorkPetDisplay();
  renderWorkList();
  if(typeof bpUpdateHomeBadge === 'function') bpUpdateHomeBadge();
}

// 召回宠物（打工中）
function recallPetWork(){
  const workData = lsGet('pet_work_data', null);
  if(!workData) return;
  lsSet('pet_work_data', null);
  if(petWorkTimer){
    clearInterval(petWorkTimer);
    petWorkTimer = null;
  }
  showToast('🏠 小橘被召回啦！（不获得工资）');
  updatePetStatusDisplay();
  updateWorkPetDisplay();
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageCollectionPage", "<!-- pageCollectionPage -->\n<div class=\"tool-page\" id=\"pageCollectionPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🏆 全部收藏品展柜</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:16px;\">带小橘出去玩收集各种纪念品吧~ 已收集 <span id=\"allCollectionCount\" style=\"color:#f59e0b;font-weight:700;\">0</span>/<span id=\"allCollectionTotal\">15</span></div>\n      \n      <div id=\"allCollectionContent\">\n        <!-- 按地点分组的收藏品由JS生成 -->\n      </div>\n    </div>\n  </div>");
// ===== 塔罗牌收藏 =====
let bpTarotFilter='upright';
function bpFilterTarot(cat){
  bpTarotFilter=cat;
  document.querySelectorAll('#bpTarotTabs .bp-cat-tab').forEach(t=>t.classList.remove('active'));
  try{event.target.classList.add('active');}catch(e){}
  const grid=document.getElementById('bpTarotGrid');
  const tip=document.getElementById('bpTarotHideTip');
  if(grid){grid.style.display='grid';}
  if(tip){tip.style.display='none';}
  const hideBtn=document.querySelector('#bpTarotTabs .bp-hide-btn');
  if(hideBtn){hideBtn.textContent='🙈 隐藏';hideBtn.classList.add('showing');}
  bpRenderTarot();
}
function bpRenderTarot(){
  const cards=lsGet('backpack_tarot',[]);
  const filtered=bpTarotFilter==='all'?cards:
    bpTarotFilter==='upright'?cards.filter(c=>!c.reversed):
    cards.filter(c=>c.reversed);
  const grid=document.getElementById('bpTarotGrid');
  if(!grid)return;
  if(filtered.length===0){
    grid.innerHTML='<div class="bp-empty" style="grid-column:1/-1;">还没有塔罗牌，去百宝箱抽牌试试吧！</div>';
    return;
  }
  // 合并重复项，按牌编号+正逆位分组统计数量
  const tarotMap={};
  filtered.forEach(c=>{
    const key=c.num+'_'+(c.reversed?'rev':'up');
    if(!tarotMap[key])tarotMap[key]={...c,count:0};
    tarotMap[key].count++;
  });
  const mergedTarot=Object.values(tarotMap).sort((a,b)=>b.count-a.count);
  grid.innerHTML=mergedTarot.map(c=>{
    const tarotKey=c.num+'_'+(c.reversed?'rev':'up');
    return '<div class="bp-tarot-card'+(c.reversed?' reversed':'')+'" style="position:relative;cursor:pointer;" onclick="bpShowTarotDetail(\''+tarotKey+'\')">'+
      (c.count>1?'<div style="position:absolute;top:4px;right:4px;background:'+(c.reversed?'#db2777':'#ca8a04')+';color:#fff;font-size:10px;padding:1px 6px;border-radius:8px;font-weight:bold;">x'+c.count+'</div>':'')+
      '<div class="bt-num">'+c.num+'</div>'+
      '<div class="bt-icon">'+c.icon+'</div>'+
      '<div class="bt-name">'+c.name+'</div>'+
      '<div class="bt-orient">'+(c.reversed?'逆位':'正位')+'</div>'+
    '</div>';
  }).join('');
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePetDressPage", "<!-- pagePetDressPage -->\n<div class=\"tool-page\" id=\"pagePetDressPage\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <h3>👗 宠物装扮</h3>\n    <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">\n      给小橘买好看的衣帽配饰！点击购买，再点\"穿上\"即可穿戴，金币：<b id=\"pdCoins\">0</b> 💰\n    </div>\n\n    <!-- 装扮预览区 -->\n    <div class=\"fl-state-material-card\" style=\"padding:20px;margin-bottom:14px;text-align:center;\">\n      <div style=\"font-size:13px;color:#666;margin-bottom:8px;\">✨ 装扮预览 ✨</div>\n      <div id=\"pdPreview\" style=\"position:relative;display:inline-block;font-size:64px;line-height:1.2;\">🐱</div>\n      <div style=\"font-size:12px;color:#666;margin-top:8px;\" id=\"pdPreviewText\">小橘还没穿衣服呢~</div>\n    </div>\n\n    <!-- 装扮商店（按分类渲染） -->\n    <div id=\"pdShopArea\"></div>\n  </div>\n</div>");
// ==================== 功能组C：宠物装扮 ====================

const PET_DRESS_CATS = [
  {key:'hat', name:'帽子 🎩'},
  {key:'glasses', name:'眼镜 👓'},
  {key:'scarf', name:'围巾 🧣'},
  {key:'clothes', name:'衣服 👕'}
];
const PET_DRESS_ITEMS = [
  {id:'hat_top', cat:'hat', name:'高顶礼帽', emoji:'🎩', price:50},
  {id:'hat_cap', cat:'hat', name:'棒球帽', emoji:'🧢', price:25},
  {id:'hat_crown', cat:'hat', name:'小皇冠', emoji:'👑', price:100},
  {id:'hat_bow', cat:'hat', name:'蝴蝶结', emoji:'🎀', price:20},
  {id:'hat_straw', cat:'hat', name:'草帽', emoji:'👒', price:15},
  {id:'glass_plain', cat:'glasses', name:'方框眼镜', emoji:'👓', price:40},
  {id:'glass_sun', cat:'glasses', name:'酷墨镜', emoji:'🕶️', price:60},
  {id:'glass_goggle', cat:'glasses', name:'护目镜', emoji:'🥽', price:35},
  {id:'glass_nerd', cat:'glasses', name:'学霸眼镜', emoji:'🤓', price:50},
  {id:'scarf_red', cat:'scarf', name:'红围巾', emoji:'🧣', price:45},
  {id:'scarf_flower', cat:'scarf', name:'花领巾', emoji:'🌸', price:20},
  {id:'scarf_knit', cat:'scarf', name:'毛线围脖', emoji:'🧶', price:35},
  {id:'scarf_ribbon', cat:'scarf', name:'丝带领', emoji:'🎗️', price:25},
  {id:'cloth_tshirt', cat:'clothes', name:'小T恤', emoji:'👕', price:30},
  {id:'cloth_dress', cat:'clothes', name:'小裙子', emoji:'👗', price:60},
  {id:'cloth_coat', cat:'clothes', name:'小外套', emoji:'🧥', price:80},
  {id:'cloth_vest', cat:'clothes', name:'小马甲', emoji:'🦺', price:25},
  {id:'cloth_kimono', cat:'clothes', name:'小和服', emoji:'🥋', price:90}
];

function pdGet(){
  const d = lsGet('pet_dressup', {hat:null, glasses:null, scarf:null, clothes:null, owned:[]});
  if(!d.owned) d.owned = [];
  ['hat','glasses','scarf','clothes'].forEach(k=>{ if(!(k in d)) d[k] = null; });
  return d;
}
function pdSave(d){ lsSet('pet_dressup', d); }
function pdFindItem(id){
  for(let i=0;i<PET_DRESS_ITEMS.length;i++){ if(PET_DRESS_ITEMS[i].id===id) return PET_DRESS_ITEMS[i]; }
  return null;
}

function pdBuy(id){
  const it = pdFindItem(id);
  if(!it) return;
  const d = pdGet();
  if(d.owned.indexOf(id) >= 0){ showToast('已经拥有啦~'); return; }
  if(!bpSpendCoins(it.price, 'petDress')){ showToast('金币不足，快去打工赚钱吧~'); return; }
  d.owned.push(id);
  pdSave(d);
  showToast('购买成功：'+it.name);
  pdRenderShop();
}

function pdWear(id){
  const it = pdFindItem(id);
  if(!it) return;
  const d = pdGet();
  if(d[it.cat] === id){
    d[it.cat] = null;
    showToast('已脱下 '+it.name);
  } else {
    d[it.cat] = id;
    showToast('穿上 '+it.name+' 啦~');
  }
  pdSave(d);
  pdRenderShop();
}

// 装扮页预览
function pdRenderPreview(){
  const box = document.getElementById('pdPreview');
  if(!box) return;
  const d = pdGet();
  const defs = [
    {id:d.hat, css:'top:-16px;left:50%;transform:translateX(-50%);font-size:26px;'},
    {id:d.glasses, css:'top:26%;left:50%;transform:translateX(-50%);font-size:22px;'},
    {id:d.scarf, css:'bottom:24%;left:50%;transform:translateX(-50%);font-size:20px;'},
    {id:d.clothes, css:'bottom:-4px;left:50%;transform:translateX(-50%);font-size:28px;'}
  ];
  let ov = '';
  defs.forEach(def=>{
    if(!def.id) return;
    const it = pdFindItem(def.id);
    if(!it) return;
    ov += '<span style="position:absolute;'+def.css+'pointer-events:none;line-height:1;">'+it.emoji+'</span>';
  });
  box.innerHTML = '🐱' + ov;
  const txt = document.getElementById('pdPreviewText');
  const worn = [d.hat,d.glasses,d.scarf,d.clothes].filter(Boolean).length;
  if(txt) txt.textContent = worn===0 ? '小橘还没穿衣服呢，去商店挑几件吧~' : '小橘已穿戴 '+worn+' 件装扮，真好看！';
}

function pdRenderShop(){
  const area = document.getElementById('pdShopArea');
  if(!area) return;
  const d = pdGet();
  const coinEl = document.getElementById('pdCoins');
  if(coinEl) coinEl.textContent = bpGetCoins();

  let html = '';
  PET_DRESS_CATS.forEach(cat=>{
    const items = PET_DRESS_ITEMS.filter(it=>it.cat===cat.key);
    html += '<h4 style="margin:14px 0 8px;font-size:15px;color:var(--text-main);">'+cat.name+'</h4>';
    html += '<div class="fl-state-material-card" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:6px;">';
    items.forEach(it=>{
      const owned = d.owned.indexOf(it.id) >= 0;
      const wearing = d[cat.key] === it.id;
      let actionBtn;
      if(!owned){
        actionBtn = '<button onclick="pdBuy(\''+it.id+'\')" style="width:100%;background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;border:none;padding:7px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">'+it.price+'💰 购买</button>';
      } else if(wearing){
        actionBtn = '<button onclick="pdWear(\''+it.id+'\')" style="width:100%;background:#ef4444;color:#fff;border:none;padding:7px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">已穿 · 脱下</button>';
      } else {
        actionBtn = '<button onclick="pdWear(\''+it.id+'\')" style="width:100%;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;border:none;padding:7px;border-radius:9px;font-size:12px;font-weight:700;cursor:pointer;">穿上</button>';
      }
      const border = wearing ? 'border:2px solid var(--primary);' : '';
      html += '<div style="padding:12px;text-align:center;'+border+'">'
        + '<div style="font-size:32px;">'+it.emoji+'</div>'
        + '<div style="font-size:13px;font-weight:700;margin-top:4px;color:var(--text-main);">'+it.name+'</div>'
        + '<div style="margin-top:8px;">'+actionBtn+'</div>'
        + '</div>';
    });
    html += '</div>';
  });
  area.innerHTML = html;
  pdRenderPreview();
}

// 状态页小橘展示区叠加装扮（供 updateStatusPage 调用）
function updatePetDressDisplay(){
  const em = document.getElementById('statusPetEmoji');
  if(!em) return;
  em.style.position = 'relative';
  em.style.display = 'inline-block';
  const old = em.querySelectorAll('.pd-overlay');
  for(let i=0;i<old.length;i++){ old[i].parentNode.removeChild(old[i]); }
  const d = pdGet();
  const defs = [
    {id:d.hat, css:'top:-14px;left:50%;transform:translateX(-50%);font-size:24px;'},
    {id:d.glasses, css:'top:26%;left:50%;transform:translateX(-50%);font-size:20px;'},
    {id:d.scarf, css:'bottom:22%;left:50%;transform:translateX(-50%);font-size:18px;'},
    {id:d.clothes, css:'bottom:-4px;left:50%;transform:translateX(-50%);font-size:24px;'}
  ];
  defs.forEach(def=>{
    if(!def.id) return;
    const it = pdFindItem(def.id);
    if(!it) return;
    const sp = document.createElement('span');
    sp.className = 'pd-overlay';
    sp.style.cssText = 'position:absolute;'+def.css+'pointer-events:none;line-height:1;';
    sp.textContent = it.emoji;
    em.appendChild(sp);
  });
}

function initPetDress(){
  pdRenderShop();
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePetSkillPage", "<!-- pagePetSkillPage -->\n<div class=\"tool-page\" id=\"pagePetSkillPage\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <h3>✨ 宠物技能</h3>\n    <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">\n      小橘通过上学、打工和日常陪伴习得技能，达成条件即可免费解锁！已解锁 <b id=\"psUnlockedCount\">0</b> / <b id=\"psTotalCount\">0</b> 个\n    </div>\n    <div id=\"psSkillArea\" style=\"display:grid;gap:12px;\"></div>\n  </div>\n</div>");
// ==================== 功能组C：宠物技能 ====================

function petGradCount(schoolId){
  const c = lsGet('pet_school_counts', {});
  return c[schoolId] || 0;
}
// 清洁≥80连续天数（按自然日累计）
function petCleanStreak(){
  const clean = lsGet('pet_clean', 100);
  const today = new Date().toDateString();
  const rec = lsGet('pet_clean_days', {streak:0, date:''});
  if(clean >= 80){
    if(rec.date !== today){
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if(rec.date === yesterday){ rec.streak = (rec.streak || 0) + 1; }
      else { rec.streak = 1; }
      rec.date = today;
      lsSet('pet_clean_days', rec);
    }
  } else if(rec.streak !== 0){
    rec.streak = 0;
    rec.date = '';
    lsSet('pet_clean_days', rec);
  }
  return rec.streak || 0;
}

const PET_SKILLS = [
  {id:'fish', icon:'🐟', name:'抓鱼达人', desc:'打工金币 +20%', needText:'小学毕业 1 次', check:()=> petGradCount('primary') >= 1},
  {id:'spoiled', icon:'💕', name:'撒娇高手', desc:'游玩好感 +30%', needText:'好感度 ≥ 60', check:()=> (lsGet('pet_affection', 50)) >= 60},
  {id:'door', icon:'🚪', name:'开门大师', desc:'所有活动时间 -20%', needText:'初中毕业 1 次', check:()=> petGradCount('middle') >= 1},
  {id:'rich', icon:'💰', name:'理财小能手', desc:'金币获取 +15%', needText:'高中毕业 1 次', check:()=> petGradCount('high') >= 1},
  {id:'clean', icon:'🧼', name:'清洁精灵', desc:'清洁消耗 -30%', needText:'清洁 ≥ 80 持续 3 天', check:()=> petCleanStreak() >= 3},
  {id:'power', icon:'💪', name:'力量训练', desc:'战力 +10', needText:'大学毕业 1 次', check:()=> petGradCount('university') >= 1}
];

function psIsUnlocked(id){
  const un = lsGet('pet_skills_unlocked', []);
  return un.indexOf(id) >= 0;
}

function unlockSkill(id){
  let sk = null;
  for(let i=0;i<PET_SKILLS.length;i++){ if(PET_SKILLS[i].id===id){ sk = PET_SKILLS[i]; break; } }
  if(!sk) return;
  if(psIsUnlocked(id)){ showToast('已经解锁过啦~'); return; }
  // 先刷新清洁连续天数统计
  petCleanStreak();
  if(!sk.check()){ showToast('暂未满足解锁条件：'+sk.needText); return; }
  const un = lsGet('pet_skills_unlocked', []);
  un.push(id);
  lsSet('pet_skills_unlocked', un);
  showToast('🎉 解锁新技能：'+sk.name+'！');
  renderPetSkills();
}



function renderPetSkills(){
  const area = document.getElementById('psSkillArea');
  if(!area) return;
  let unlockedCount = 0;
  let html = '';
  PET_SKILLS.forEach(sk=>{
    // 刷新条件（尤其清洁连续天数）
    const met = sk.check();
    const unlocked = psIsUnlocked(sk.id);
    if(unlocked) unlockedCount++;
    let cardStyle, statusHtml;
    if(unlocked){
      cardStyle = 'background:linear-gradient(135deg,#dcfce7,#bbf7d0);border:2px solid #16a34a;';
      statusHtml = '<div style="font-size:12px;color:#166534;font-weight:700;margin-top:6px;">✅ 已解锁 · '+sk.desc+'</div>';
    } else if(met){
      cardStyle = 'background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;';
      statusHtml = '<div style="font-size:12px;color:#92400e;margin-top:6px;">🔓 条件达成：'+sk.needText+'</div>'
        + '<button onclick="unlockSkill(\''+sk.id+'\')" style="margin-top:8px;width:100%;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border:none;padding:8px;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;">✨ 点击解锁</button>';
    } else {
      cardStyle = 'border:2px solid var(--border-color);opacity:0.85;';
      statusHtml = '<div style="font-size:12px;color:var(--text-secondary);margin-top:6px;">🔒 未解锁 · 需 '+sk.needText+'</div>';
    }
    html += '<div style="border-radius:14px;padding:14px;box-shadow:0 2px 10px rgba(0,0,0,0.05);'+cardStyle+'">'
      + '<div style="display:flex;align-items:center;gap:10px;">'
      + '<div style="font-size:32px;">'+sk.icon+'</div>'
      + '<div>'
      + '<div style="font-size:15px;font-weight:700;color:var(--text-main);">'+sk.name+'</div>'
      + '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">'+sk.desc+'</div>'
      + '</div></div>'
      + statusHtml
      + '</div>';
  });
  area.innerHTML = html;
  const uc = document.getElementById('psUnlockedCount');
  const tc = document.getElementById('psTotalCount');
  if(uc) uc.textContent = unlockedCount;
  if(tc) tc.textContent = PET_SKILLS.length;
}

function initPetSkill(){
  renderPetSkills();
}

// 状态页刷新后叠加小橘装扮效果
const _origUpdateStatusPageC = updateStatusPage;
updateStatusPage = function(){
  _origUpdateStatusPageC.apply(this, arguments);
  if(typeof updatePetDressDisplay === 'function') updatePetDressDisplay();
};



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePetDiaryPage", "<!-- pagePetDiaryPage -->\n<div class=\"tool-page\" id=\"pagePetDiaryPage\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <h3>📔 宠物日记</h3>\n    <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">小橘每天都会把有趣的事写进日记里，一起来看看吧~</div>\n\n    <!-- 写日记按钮 -->\n    <button id=\"diaryWriteBtn\" onclick=\"manualWriteDiary()\" style=\"width:100%;background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(245,158,11,0.3);margin-bottom:14px;\">\n      ✍️ 写日记\n    </button>\n\n    <!-- 日记列表 -->\n    <div id=\"diaryList\" style=\"display:grid;gap:12px;\">\n      <!-- 日记卡片由JS生成 -->\n    </div>\n  </div>\n</div>");
// ==================== 宠物日记系统 ====================
let petDiaryTimer = null;

// 获取今天日期字符串
function getDiaryTodayStr(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// 获取当日事件列表（自动跨天清空）
function getPetDailyEvents(){
  const data = lsGet('pet_daily_events', null);
  const today = getDiaryTodayStr();
  if(!data || data.date !== today){
    const fresh = {date: today, events: []};
    lsSet('pet_daily_events', fresh);
    return fresh;
  }
  if(!Array.isArray(data.events)) data.events = [];
  return data;
}

// 记录一条当日事件（供其他功能调用）
function recordPetDailyEvent(text){
  if(!text) return;
  const data = getPetDailyEvents();
  data.events.push(text);
  lsSet('pet_daily_events', data);
}

// 生成宠物日记（可被其他功能调用）
function generatePetDiary(){
  const today = getDiaryTodayStr();
  const diaryList = lsGet('pet_diary', []);
  // 今天已写过则不重复
  if(diaryList.some(d => d.date === today)) return null;

  // 收集事件
  const daily = getPetDailyEvents();
  const events = daily.events.slice();

  // 附加推断：根据 localStorage 状态补充事件
  const schoolData = lsGet('pet_school_data', null);
  if(schoolData && schoolData.endTime > Date.now()){
    events.push('正在认真地上学呢');
  }
  const workData = lsGet('pet_work_data', null);
  if(workData && workData.endTime > Date.now()){
    events.push('出门打工赚金币去了');
  }
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  if(hunger >= 80) events.push('吃得饱饱的');
  if(clean < 30) events.push('玩得脏兮兮的');

  // 随机天气
  const weathers = [
    {emoji:'☀️', text:'阳光明媚的大晴天'},
    {emoji:'🌤️', text:'多云转晴'},
    {emoji:'⛅', text:'云朵飘来飘去的'},
    {emoji:'🌧️', text:'下着小雨的一天'},
    {emoji:'🌈', text:'雨后出了彩虹'},
    {emoji:'🌙', text:'晚上星星特别亮'}
  ];
  const weather = weathers[Math.floor(Math.random() * weathers.length)];

  // 心情
  const moods = [
    {emoji:'😄', text:'开心'},
    {emoji:'😺', text:'满足'},
    {emoji:'🥰', text:'幸福'},
    {emoji:'😴', text:'慵懒'},
    {emoji:'🤔', text:'有点小好奇'},
    {emoji:'😋', text:'美滋滋'}
  ];
  const mood = moods[Math.floor(Math.random() * moods.length)];

  // 拼接正文（50-100字）
  let body = '';
  if(events.length === 0){
    body = '今天阳光很好，我趴在窗台上晒了一整个下午的太阳，舔了舔爪子，伸了个大大的懒腰。主人好像很忙的样子，但偶尔会过来摸摸我的头，我觉得今天也很幸福呢。';
  } else {
    const evText = events.slice(0, 4).join('，') + '。';
    const feelings = [
      '真是充实的一天呀！',
      '虽然有点累，但是很开心~',
      '好想天天都这样过！',
      '下次还要叫上好朋友一起！',
      '主人会不会夸我呢？嘻嘻~'
    ];
    const feel = feelings[Math.floor(Math.random() * feelings.length)];
    body = '今天' + weather.text + '。' + evText + feel;
  }
  // 控制字数 50-100
  if(body.length < 50){
    body += '对了，刚才又去吃了点小零食，咕噜咕噜好饱。明天也要开开心心地过！';
  }
  if(body.length > 110){
    body = body.substring(0, 100) + '。';
  }

  const entry = {
    date: today,
    weather: weather.emoji,
    weatherText: weather.text,
    mood: mood.emoji,
    moodText: mood.text,
    content: body
  };
  diaryList.push(entry);
  lsSet('pet_diary', diaryList);
  return entry;
}

// 手动写日记按钮
function manualWriteDiary(){
  const today = getDiaryTodayStr();
  const diaryList = lsGet('pet_diary', []);
  if(diaryList.some(d => d.date === today)){
    showToast('📔 小橘今天已经写过日记啦~');
    return;
  }
  const entry = generatePetDiary();
  if(entry){
    showToast('📔 小橘写完日记啦！');
    renderDiaryList();
  }
}

// 初始化宠物日记页面
function initPetDiary(){
  // 每次打开页面时，如果今天还没写，自动生成一篇
  const today = getDiaryTodayStr();
  const diaryList = lsGet('pet_diary', []);
  const btn = document.getElementById('diaryWriteBtn');
  if(diaryList.some(d => d.date === today)){
    if(btn) btn.disabled = true;
    if(btn) btn.textContent = '📔 今天已写完';
  } else {
    if(btn) btn.disabled = false;
    if(btn) btn.textContent = '✍️ 写日记';
  }
  renderDiaryList();
}

// 渲染日记列表（按日期倒序）
function renderDiaryList(){
  const container = document.getElementById('diaryList');
  if(!container) return;
  container.innerHTML = '';
  const diaryList = lsGet('pet_diary', []).slice().sort((a,b) => b.date.localeCompare(a.date));
  if(!diaryList.length){
    container.innerHTML = '<div style="text-align:center;padding:30px 10px;color:var(--text-placeholder);font-size:13px;">还没有日记呢，和小橘一起度过有趣的一天吧~</div>';
    return;
  }
  diaryList.forEach(entry => {
    const div = document.createElement('div');
    div.style.cssText = 'background:linear-gradient(135deg,#fffbeb,#fef3c7);border-radius:14px;padding:16px;box-shadow:0 2px 10px rgba(245,158,11,0.12);border-left:4px solid #f59e0b;';
    div.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
        '<div style="font-size:13px;font-weight:700;color:#92400e;">📅 ' + entry.date + '</div>' +
        '<div style="font-size:18px;">' + (entry.weather || '☀️') + ' ' + (entry.mood || '😄') + '</div>' +
      '</div>' +
      '<div style="font-size:12px;color:#b45309;margin-bottom:6px;">' + (entry.weatherText || '') + ' · 心情：' + (entry.moodText || '') + '</div>' +
      '<div style="font-size:14px;color:#78350f;line-height:1.8;">' + entry.content + '</div>';
    container.appendChild(div);
  });
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePetExplorePage", "<!-- pagePetExplorePage -->\n<div class=\"tool-page\" id=\"pagePetExplorePage\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <h3>🗺️ 宠物探险</h3>\n    <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">派小橘去各地冒险吧！带回金币和稀有宝藏，还有意外事件哦~ 关闭浏览器时间也会继续走</div>\n\n    <!-- 小橘状态 -->\n    <div class=\"fl-state-material-card\" style=\"padding:16px;margin-bottom:14px;\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;\">\n        <div style=\"display:flex;align-items:center;\">\n          <div style=\"font-size:48px;\" id=\"explorePetEmoji\">🐱</div>\n          <div style=\"margin-left:12px;\">\n            <div style=\"font-size:16px;font-weight:700;\">小橘</div>\n            <div style=\"font-size:12px;color:#666;margin-top:2px;\" id=\"explorePetMood\">心情不错~</div>\n          </div>\n        </div>\n        <div style=\"text-align:right;flex-shrink:0;min-width:80px;\">\n          <div style=\"display:inline-block;background:#fef3c7;color:#f59e0b;padding:3px 10px;border-radius:10px;font-size:12px;font-weight:700;white-space:nowrap;\">\n            ⚔️ <span id=\"explorePetPower\">0</span>\n          </div>\n          <div style=\"font-size:11px;color:#666;margin-top:5px;white-space:nowrap;\">💰 <span id=\"exploreCoins\">0</span></div>\n        </div>\n      </div>\n      <div style=\"margin-top:12px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;\">\n        <div>\n          <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n            <span>🍖 饱食</span><span id=\"exploreHungerText\">50/100</span>\n          </div>\n          <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n            <div id=\"exploreHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:4px;width:50%;\"></div>\n          </div>\n        </div>\n        <div>\n          <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n            <span>🧼 清洁</span><span id=\"exploreCleanText\">100/100</span>\n          </div>\n          <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n            <div id=\"exploreCleanBar\" style=\"height:100%;background:linear-gradient(90deg,#60a5fa,#34d399);border-radius:4px;width:100%;\"></div>\n          </div>\n        </div>\n        <div>\n          <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n            <span>💕 好感</span><span id=\"exploreAffectionText\">50/100</span>\n          </div>\n          <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n            <div id=\"exploreAffectionBar\" style=\"height:100%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:4px;width:50%;\"></div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <!-- 探险中状态 -->\n    <div id=\"exploreAwayArea\" style=\"display:none;margin-bottom:14px;\">\n      <div style=\"background:linear-gradient(135deg,#ede9fe,#ddd6fe);border-radius:16px;padding:20px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.06);\">\n        <div style=\"font-size:48px;\" id=\"exploreAwayEmoji\">🗺️</div>\n        <div style=\"font-size:16px;font-weight:700;color:#5b21b6;margin-top:8px;\" id=\"exploreAwayText\">小橘正在探险...</div>\n        <div style=\"font-size:28px;font-weight:700;color:#5b21b6;margin-top:10px;\" id=\"exploreAwayTimer\">00:00</div>\n        <div style=\"font-size:13px;color:#6d28d9;margin-top:8px;\" id=\"exploreAwayReward\">探索中，期待宝藏~</div>\n        <button onclick=\"recallPetExplore()\" style=\"margin-top:14px;background:#ef4444;color:#fff;border:none;padding:10px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(239,68,68,0.3);\">\n          🏠 召回宠物（无奖励）\n        </button>\n      </div>\n    </div>\n\n    <!-- 探险地点列表 -->\n    <div id=\"exploreListArea\">\n      <div style=\"display:grid;gap:12px;\" id=\"exploreList\">\n        <!-- 地点列表由JS生成 -->\n      </div>\n    </div>\n\n    <!-- 探险仓库 -->\n    <div style=\"margin-top:18px;\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;\">\n        <div style=\"font-size:15px;font-weight:700;\">🎒 探险背包</div>\n        <span style=\"font-size:12px;color:var(--text-secondary);\">已收集 <span id=\"exploreItemCount\">0</span> 件宝物</span>\n      </div>\n      <div id=\"exploreItemsBox\" class=\"fl-state-material-card\" style=\"display:flex;flex-wrap:wrap;gap:8px;min-height:50px;padding:12px;\">\n        <span style=\"font-size:12px;color:var(--text-placeholder);margin:auto;\">去探险带回宝物吧~</span>\n      </div>\n    </div>\n  </div>\n</div>");
// ==================== 宠物探险系统 ====================
const PET_EXPLORE_PLACES = [
  {id:'forest', name:'神秘森林', emoji:'🌲', duration:30, hungerCost:10, cleanCost:5, coinMin:10, coinMax:30,
   items:[{emoji:'🍄',name:'蘑菇'},{emoji:'🌰',name:'板栗'},{emoji:'🪵',name:'树枝'},{emoji:'🌸',name:'野花'}],
   eventChance:0.0, desc:'在林间散步，采采野果~', color:'#34d399'},
  {id:'cave', name:'幽暗山洞', emoji:'🕳️', duration:60, hungerCost:15, cleanCost:10, coinMin:20, coinMax:50,
   items:[{emoji:'💎',name:'宝石'},{emoji:'🪨',name:'矿石'},{emoji:'📜',name:'古地图'},{emoji:'🦇',name:'小蝙蝠'}],
   eventChance:0.3, desc:'探险洞窟，有稀有宝藏，也有危险！', color:'#8b5cf6'},
  {id:'beach', name:'海边沙滩', emoji:'🌊', duration:45, hungerCost:8, cleanCost:15, coinMin:15, coinMax:40,
   items:[{emoji:'🐚',name:'贝壳'},{emoji:'🦀',name:'小螃蟹'},{emoji:'⭐',name:'海星'},{emoji:'🫧',name:'水晶'}],
   eventChance:0.15, desc:'海边漫步，捡贝壳吹海风~', color:'#60a5fa'},
  {id:'city', name:'城市冒险', emoji:'🏙️', duration:90, hungerCost:20, cleanCost:5, coinMin:30, coinMax:80,
   items:[{emoji:'🎁',name:'神秘礼盒'},{emoji:'📰',name:'旧报纸'},{emoji:'🎫',name:'电影票'},{emoji:'🍬',name:'糖果'}],
   eventChance:0.35, desc:'逛遍大街小巷，惊喜多多！', color:'#f59e0b'}
];

let petExploreTimer = null;

// 初始化宠物探险页面
function initPetExplore(){
  // 页面打开时检查是否已到期自动结算
  const ed = lsGet('pet_explore_data', null);
  if(ed && ed.endTime <= Date.now()){
    completePetExplore();
  }
  updateExplorePetDisplay();
  renderExploreList();
  renderExploreItems();
  startPetExploreTimer();
}

// 更新探险页面宠物状态显示
function updateExplorePetDisplay(){
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  const affection = lsGet('pet_affection', 50);
  const power = lsGet('pet_power', 0);
  const coins = bpGetCoins();

  let mood = '心情不错~', emoji = '🐱';
  if(hunger >= 80){emoji='😺';mood='吃饱喝足，准备出发~';}
  else if(hunger >= 50){emoji='🐱';mood='心情不错~';}
  else if(hunger >= 20){emoji='😿';mood='有点饿了...';}
  else{emoji='😾';mood='饿晕了，先喂我！';}

  const setBar = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.style.width = Math.max(0, Math.min(100, val)) + '%';
  };
  const setText = (id, val) => {
    const el = document.getElementById(id);
    if(el) el.textContent = Math.round(val) + '/100';
  };

  setText('exploreHungerText', hunger); setBar('exploreHungerBar', hunger);
  setText('exploreCleanText', clean); setBar('exploreCleanBar', clean);
  setText('exploreAffectionText', affection); setBar('exploreAffectionBar', affection);

  const e1 = document.getElementById('explorePetEmoji'); if(e1) e1.textContent = emoji;
  const e2 = document.getElementById('explorePetMood'); if(e2) e2.textContent = mood;
  const e3 = document.getElementById('explorePetPower'); if(e3) e3.textContent = power;
  const e4 = document.getElementById('exploreCoins'); if(e4) e4.textContent = coins;

  // 检查是否在探险中
  const ed = lsGet('pet_explore_data', null);
  const awayArea = document.getElementById('exploreAwayArea');
  const listArea = document.getElementById('exploreListArea');
  if(ed && ed.endTime > Date.now()){
    if(awayArea) awayArea.style.display = 'block';
    if(listArea) listArea.style.display = 'none';
    const place = PET_EXPLORE_PLACES.find(p => p.id === ed.placeId);
    if(place){
      const t = document.getElementById('exploreAwayText');
      if(t) t.textContent = '小橘正在' + place.name + '探险...';
      const em = document.getElementById('exploreAwayEmoji');
      if(em) em.textContent = place.emoji;
      const r = document.getElementById('exploreAwayReward');
      if(r) r.textContent = '预计 ' + place.coinMin + '~' + place.coinMax + ' 金币 + 神秘宝物';
    }
  } else {
    if(awayArea) awayArea.style.display = 'none';
    if(listArea) listArea.style.display = 'block';
  }
}

// 渲染探险地点列表
function renderExploreList(){
  const container = document.getElementById('exploreList');
  if(!container) return;
  container.innerHTML = '';
  PET_EXPLORE_PLACES.forEach(place => {
    const div = document.createElement('div');
    div.className = 'fl-state-material-card';
    div.style.cssText = 'padding:16px;border-left:4px solid ' + place.color + ';';
    div.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<div style="font-size:36px;">' + place.emoji + '</div>' +
        '<div style="flex:1;">' +
          '<div style="font-size:15px;font-weight:700;">' + place.name + '</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-top:2px;">' + place.desc + '</div>' +
          '<div style="display:flex;gap:10px;margin-top:6px;font-size:11px;color:var(--text-secondary);flex-wrap:wrap;">' +
            '<span>⏱️ ' + place.duration + '秒</span>' +
            '<span>💰 ' + place.coinMin + '~' + place.coinMax + '</span>' +
            '<span>🍖-' + place.hungerCost + '</span>' +
            '<span>🧼-' + place.cleanCost + '</span>' +
            (place.eventChance > 0 ? '<span style="color:#8b5cf6;">✨有事件</span>' : '') +
          '</div>' +
        '</div>' +
        '<button onclick="sendPetToExplore(\'' + place.id + '\')" style="background:linear-gradient(135deg,' + place.color + ',#8b5cf6);color:#fff;border:none;padding:8px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,0.15);flex-shrink:0;">🗺️ 出发</button>' +
      '</div>';
    container.appendChild(div);
  });
}

// 检查小橘是否在忙（上学/打工/探险任一未到期）
function isPetBusy(){
  const sd = lsGet('pet_school_data', null);
  if(sd && sd.endTime && sd.endTime > Date.now()) return {busy:true, type:'school'};
  const wd = lsGet('pet_work_data', null);
  if(wd && wd.endTime && wd.endTime > Date.now()) return {busy:true, type:'work'};
  const ed = lsGet('pet_explore_data', null);
  if(ed && ed.endTime && ed.endTime > Date.now()) return {busy:true, type:'explore'};
  return {busy:false};
}

// 送小橘去探险
function sendPetToExplore(placeId){
  const place = PET_EXPLORE_PLACES.find(p => p.id === placeId);
  if(!place) return;
  // 检查忙碌状态
  const busy = isPetBusy();
  if(busy.busy){
    if(busy.type === 'school') showToast('⚠️ 小橘正在上学，不能同时探险~');
    else if(busy.type === 'work') showToast('⚠️ 小橘正在打工，不能同时探险~');
    else showToast('⚠️ 小橘已经在探险了~');
    return;
  }
  // 检查属性
  const hunger = lsGet('pet_hunger', 50);
  const clean = lsGet('pet_clean', 100);
  if(hunger < place.hungerCost || clean < place.cleanCost){
    showToast('⚠️ 饱食或清洁不足，先照顾小橘吧~');
    return;
  }
  // 扣除属性
  lsSet('pet_hunger', Math.max(0, hunger - place.hungerCost));
  lsSet('pet_clean', Math.max(0, clean - place.cleanCost));
  // 记录探险数据
  const exploreData = {
    placeId: place.id,
    startTime: Date.now(),
    endTime: Date.now() + place.duration * 1000
  };
  lsSet('pet_explore_data', exploreData);
  // 记录当日事件
  recordPetDailyEvent('小橘去' + place.name + '探险啦');
  showToast('🗺️ 小橘出发去' + place.name + '！');
  updateExplorePetDisplay();
  updatePetStatusDisplay();
  startPetExploreTimer();
}

// 启动探险倒计时
function startPetExploreTimer(){
  if(petExploreTimer){
    clearInterval(petExploreTimer);
    petExploreTimer = null;
  }
  const ed = lsGet('pet_explore_data', null);
  if(!ed || ed.endTime <= Date.now()){
    return;
  }
  updateExploreTimerDisplay();
  petExploreTimer = setInterval(() => {
    const data = lsGet('pet_explore_data', null);
    if(!data || data.endTime <= Date.now()){
      clearInterval(petExploreTimer);
      petExploreTimer = null;
      completePetExplore();
      return;
    }
    updateExploreTimerDisplay();
    updateExploreStatusDisplay();
  }, 1000);
}

// 更新探险倒计时显示
function updateExploreTimerDisplay(){
  const ed = lsGet('pet_explore_data', null);
  if(!ed) return;
  const remaining = Math.max(0, Math.ceil((ed.endTime - Date.now()) / 1000));
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  const el = document.getElementById('exploreAwayTimer');
  if(el) el.textContent = timeStr;
}

// 完成探险结算
function completePetExplore(){
  const ed = lsGet('pet_explore_data', null);
  if(!ed) return;
  const place = PET_EXPLORE_PLACES.find(p => p.id === ed.placeId);
  if(!place){ lsSet('pet_explore_data', null); return; }

  // 随机金币
  const earned = Math.floor(Math.random() * (place.coinMax - place.coinMin + 1)) + place.coinMin;
  bpAddCoins(earned, 'petExplore');

  // 随机物品（每个地点带1-2件）
  const items = lsGet('pet_explore_items', []);
  const itemCount = 1 + Math.floor(Math.random() * 2); // 1~2件
  const gotItems = [];
  for(let i = 0; i < itemCount; i++){
    const it = place.items[Math.floor(Math.random() * place.items.length)];
    // 合并同类物品
    const exist = items.find(x => x.emoji === it.emoji);
    if(exist) exist.count = (exist.count || 1) + 1;
    else items.push({emoji: it.emoji, name: it.name, count: 1, place: place.name});
    gotItems.push(it.emoji + it.name);
  }
  lsSet('pet_explore_items', items);

  // 随机事件
  let eventMsg = '';
  let moodDelta = 0;
  if(place.eventChance > 0 && Math.random() < place.eventChance){
    const events = [
      {type:'money', text:'小橘在路上捡到了金币！💰', effect:()=>{const b=Math.floor(Math.random()*15)+5;bpAddCoins(b,'petExploreLucky');eventMsg+=' 还捡到了'+b+'金币！';}},
      {type:'friend', text:'小橘遇到了好朋友一起玩耍~', effect:()=>{const a=lsGet('pet_affection',50);lsSet('pet_affection',Math.min(100,a+8));moodDelta=8;eventMsg+=' 还遇到了新朋友，好感度提升了！';}},
      {type:'hurt', text:'小橘不小心摔了一跤...', effect:()=>{const p=lsGet('pet_power',0);lsSet('pet_power',Math.max(0,p-3));eventMsg+=' 不过有点小擦伤，战力-3';}},
      {type:'rare', text:'小橘发现了稀有宝物！✨', effect:()=>{const rare={emoji:'🏆',name:'勇者勋章',count:1,place:place.name};const arr=lsGet('pet_explore_items',[]);arr.push(rare);lsSet('pet_explore_items',arr);gotItems.push('🏆勇者勋章');eventMsg+=' 还获得了稀有宝物【勇者勋章】！';}}
    ];
    const ev = events[Math.floor(Math.random() * events.length)];
    ev.effect();
    recordPetDailyEvent(ev.text);
  }

  // 清除探险数据
  lsSet('pet_explore_data', null);

  // 记录当日事件
  recordPetDailyEvent('小橘从' + place.name + '探险回来，赚了' + earned + '金币，带回了' + gotItems.join('、'));
  // 自动触发日记
  generatePetDiary();

  // 反馈
  let toastMsg = '🗺️ 小橘探险回来啦！💰+' + earned;
  if(gotItems.length) toastMsg += ' 🎒获得' + gotItems.join('、');
  if(eventMsg) toastMsg += eventMsg;
  showToast(toastMsg);

  if(typeof bpUpdateHomeBadge === 'function') bpUpdateHomeBadge();
  updatePetStatusDisplay();
  updateExplorePetDisplay();
  renderExploreList();
  renderExploreItems();
}

// 召回探险中的小橘（无奖励）
function recallPetExplore(){
  const ed = lsGet('pet_explore_data', null);
  if(!ed) return;
  lsSet('pet_explore_data', null);
  if(petExploreTimer){
    clearInterval(petExploreTimer);
    petExploreTimer = null;
  }
  recordPetDailyEvent('小橘的探险被提前召回了');
  showToast('🏠 小橘被召回啦！（无奖励）');
  updatePetStatusDisplay();
  updateExplorePetDisplay();
}

// 渲染探险背包
function renderExploreItems(){
  const items = lsGet('pet_explore_items', []);
  const box = document.getElementById('exploreItemsBox');
  const cnt = document.getElementById('exploreItemCount');
  if(cnt) cnt.textContent = items.reduce((s,x)=>s+(x.count||1),0);
  if(!box) return;
  if(!items.length){
    box.innerHTML = '<span style="font-size:12px;color:var(--text-placeholder);margin:auto;">去探险带回宝物吧~</span>';
    return;
  }
  box.innerHTML = '';
  items.forEach(it => {
    const div = document.createElement('div');
    div.style.cssText = 'background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:10px;padding:8px 12px;text-align:center;min-width:70px;box-shadow:0 2px 6px rgba(245,158,11,0.15);';
    div.title = (it.place || '') + '带回';
    div.innerHTML = '<div style="font-size:24px;">' + it.emoji + '</div>' +
      '<div style="font-size:11px;color:#92400e;margin-top:2px;font-weight:600;">' + it.name + '</div>' +
      '<div style="font-size:10px;color:#b45309;">×' + (it.count || 1) + '</div>';
    box.appendChild(div);
  });
}

// 供状态页调用：显示探险中的状态
function updateExploreStatusDisplay(){
  const ed = lsGet('pet_explore_data', null);
  const elHomeArea = document.getElementById('statusPetHomeArea');
  const elAwayArea = document.getElementById('statusPetAwayArea');
  if(!elAwayArea) return;

  if(ed && ed.endTime > Date.now()){
    // 仅当当前没有其他活动状态时才接管显示
    const sd = lsGet('pet_school_data', null);
    const wd = lsGet('pet_work_data', null);
    const pd = lsGet('pet_play_data', null);
    const otherActive = (sd && sd.endTime > Date.now()) || (wd && wd.endTime > Date.now()) || (pd && pd.endTime > Date.now());
    if(otherActive) return;

    if(elHomeArea) elHomeArea.style.display = 'none';
    elAwayArea.style.display = 'block';
    const place = PET_EXPLORE_PLACES.find(p => p.id === ed.placeId);
    const elAwayText = document.getElementById('statusPetAwayText');
    if(elAwayText) elAwayText.textContent = place ? '小橘正在' + place.name + '探险...' : '小橘正在探险...';

    const recallBtn = document.querySelector('#statusPetAwayArea button');
    if(recallBtn){
      recallBtn.style.display = 'block';
      recallBtn.textContent = '🏠 召回宠物（无奖励）';
      recallBtn.onclick = recallPetExplore;
    }
    const allBtns = document.querySelectorAll('#statusPetAwayArea button');
    if(allBtns.length > 1) allBtns[1].style.display = 'none';

    const remaining = Math.max(0, ed.endTime - Date.now());
    const timerEl = document.getElementById('statusPetAwayTimer');
    if(timerEl){
      const mins = Math.floor(remaining / 60000);
      const secs = Math.floor((remaining % 60000) / 1000);
      timerEl.textContent = String(mins).padStart(2,'0') + ':' + String(secs).padStart(2,'0');
    }
  }
}



/* ===== 状态相关页面模块 ===== */
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageStatusPage", "<!-- pageStatusPage -->\n<div class=\"tool-page\" id=\"pageStatusPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📊 个人状态</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">查看你的数据信息和宠物成长统计</div>\n      \n      <!-- 数据信息卡片 -->\n      <div class=\"status-summary-card fl-state-material-card\">\n        <h4 style=\"margin:0 0 12px 0;font-size:15px;\">📊 数据信息</h4>\n        <div class=\"status-data-grid\" style=\"display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;\">\n          <div style=\"background:var(--primary-bg);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:var(--text-secondary);\">首次进入</div>\n            <div style=\"font-size:16px;font-weight:700;color:var(--primary);margin-top:4px;\" id=\"statusFirstVisit\">--</div>\n          </div>\n          <div style=\"background:var(--primary-bg);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:var(--text-secondary);\">访问次数</div>\n            <div style=\"font-size:16px;font-weight:700;color:var(--primary);margin-top:4px;\" id=\"statusVisitCount\">0</div>\n          </div>\n          <div style=\"background:var(--primary-bg);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:var(--text-secondary);\">当前金币</div>\n            <div style=\"font-size:16px;font-weight:700;color:#f59e0b;margin-top:4px;\" id=\"statusCoins\">0</div>\n          </div>\n          <div style=\"background:var(--primary-bg);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:var(--text-secondary);\">弹珠总数</div>\n            <div style=\"font-size:16px;font-weight:700;color:#ef4444;margin-top:4px;\" id=\"statusPinballs\">0</div>\n          </div>\n          <div style=\"background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:#92400e;\">⚔️ 总战力</div>\n            <div style=\"font-size:16px;font-weight:700;color:#d97706;margin-top:4px;\" id=\"statusTotalPower\">0</div>\n          </div>\n          <div style=\"background:linear-gradient(135deg,#dbeafe,#bfdbfe);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:#1e40af;\">🏫 累计上学</div>\n            <div style=\"font-size:16px;font-weight:700;color:#2563eb;margin-top:4px;\" id=\"statusTotalSchool\">0次</div>\n          </div>\n          <div style=\"background:linear-gradient(135deg,#dcfce7,#bbf7d0);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:#166534;\">🎓 当前学历</div>\n            <div style=\"font-size:16px;font-weight:700;color:#16a34a;margin-top:4px;\" id=\"statusCurrentDegree\">--</div>\n          </div>\n          <div style=\"background:linear-gradient(135deg,#f3e8ff,#e9d5ff);border-radius:12px;padding:12px;\">\n            <div style=\"font-size:12px;color:#6b21a8;\">📦 累计使用</div>\n            <div style=\"font-size:16px;font-weight:700;color:#9333ea;margin-top:4px;\" id=\"statusTotalUsage\">0次</div>\n          </div>\n          <div class=\"status-stats-btn\" onclick=\"openPage('usageStatsPage')\" style=\"background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:12px;padding:12px;cursor:pointer;box-shadow:0 2px 8px rgba(245,158,11,0.2);border:2px solid #f59e0b;transition:all 0.2s;\" onmouseover=\"this.style.transform='scale(1.02)'\" onmouseout=\"this.style.transform='scale(1)'\">\n            <div style=\"font-size:12px;color:#92400e;\">📊 统计信息</div>\n            <div style=\"font-size:16px;font-weight:700;color:#d97706;margin-top:4px;\">查看使用记录 →</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- 收藏统计卡片 -->\n      <div class=\"status-summary-card fl-state-material-card\">\n        <h4 style=\"margin:0 0 12px 0;font-size:15px;\">📦 收藏统计</h4>\n        <div style=\"display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;\">\n          <div style=\"background:var(--primary-bg);border-radius:12px;padding:12px;text-align:center;\">\n            <div style=\"font-size:20px;\">🃏</div>\n            <div style=\"font-size:12px;color:var(--text-secondary);margin-top:4px;\">卡牌数量</div>\n            <div style=\"font-size:16px;font-weight:700;color:var(--primary);\" id=\"statusCards\">0</div>\n          </div>\n          <div style=\"background:var(--primary-bg);border-radius:12px;padding:12px;text-align:center;\">\n            <div style=\"font-size:20px;\">🎁</div>\n            <div style=\"font-size:12px;color:var(--text-secondary);margin-top:4px;\">道具数量</div>\n            <div style=\"font-size:16px;font-weight:700;color:var(--primary);\" id=\"statusItems\">0</div>\n          </div>\n          <div style=\"background:var(--primary-bg);border-radius:12px;padding:12px;text-align:center;\">\n            <div style=\"font-size:20px;\">🏅</div>\n            <div style=\"font-size:12px;color:var(--text-secondary);margin-top:4px;\">成就数量</div>\n            <div style=\"font-size:16px;font-weight:700;color:var(--primary);\" id=\"statusAchievements\">0</div>\n          </div>\n        </div>\n      </div>\n\n      <!-- 小橘猫展示区 -->\n      <div class=\"fl-state-material-card\" style=\"padding:20px;margin-bottom:14px;text-align:center;position:relative;\">\n        <!-- 校长信箱按钮 -->\n        <button onclick=\"openPage('mailboxPage')\" style=\"position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#fff;border:none;padding:8px 12px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(245,158,11,0.4);display:flex;align-items:center;gap:4px;\">\n          ✉️ 校长信箱 <span id=\"mailboxBadge\" style=\"display:none;background:#ef4444;color:#fff;border-radius:10px;padding:1px 6px;font-size:11px;min-width:16px;text-align:center;\">0</span>\n        </button>\n        <div style=\"font-size:60px;\" id=\"statusPetEmoji\">🐱</div>\n        <div style=\"font-size:18px;font-weight:700;margin-top:8px;\" id=\"statusPetName\">小橘</div>\n        <div style=\"font-size:12px;color:#666;margin-top:4px;\" id=\"statusPetMood\">心情不错~</div>\n        <div style=\"margin-top:10px;display:inline-block;background:#fef3c7;color:#f59e0b;padding:4px 14px;border-radius:14px;font-size:13px;font-weight:700;\">\n          ⚔️ 战力：<span id=\"statusPetPower\">0</span>\n        </div>\n        <div style=\"margin-top:14px;text-align:left;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;\">\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🍖 饱食</span>\n              <span id=\"statusHungerText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"statusHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:4px;width:50%;transition:width 0.3s;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>🧼 清洁</span>\n              <span id=\"statusCleanText\">100/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"statusCleanBar\" style=\"height:100%;background:linear-gradient(90deg,#60a5fa,#34d399);border-radius:4px;width:100%;transition:width 0.3s;\"></div>\n            </div>\n          </div>\n          <div>\n            <div style=\"display:flex;justify-content:space-between;font-size:10px;margin-bottom:4px;white-space:nowrap;\">\n              <span>💕 好感</span>\n              <span id=\"statusAffectionText\">50/100</span>\n            </div>\n            <div style=\"height:8px;background:#eee;border-radius:4px;overflow:hidden;\">\n              <div id=\"statusAffectionBar\" style=\"height:100%;background:linear-gradient(90deg,#f472b6,#fb7185);border-radius:4px;width:50%;transition:width 0.3s;\"></div>\n            </div>\n          </div>\n        </div>\n        <div id=\"statusPetHomeArea\" style=\"margin-top:14px;\">\n          <button onclick=\"openPage('petSchoolPage')\" style=\"width:100%;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(102,126,234,0.3);\">\n            🎒 出门上学\n          </button>\n          <button onclick=\"openPage('petPlayPage')\" style=\"width:100%;margin-top:10px;background:linear-gradient(135deg,#10b981,#34d399);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.3);\">\n            🌳 出去玩\n          </button>\n          <button onclick=\"openPage('petWorkPage')\" style=\"width:100%;margin-top:10px;background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(245,158,11,0.3);\">\n            💼 出门打工\n          </button>\n          <button onclick=\"openPage('petExplorePage')\" style=\"width:100%;margin-top:10px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.3);\">\n            🗺️ 宠物探险\n          </button>\n          <button onclick=\"openPage('petDressPage')\" style=\"width:100%;margin-top:10px;background:linear-gradient(135deg,#ec4899,#f472b6);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(236,72,153,0.3);\">\n            👗 宠物装扮\n          </button>\n          <button onclick=\"openPage('petSkillPage')\" style=\"width:100%;margin-top:10px;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(139,92,246,0.3);\">\n            ✨ 宠物技能\n          </button>\n          <button onclick=\"openPage('petDiaryPage')\" style=\"width:100%;margin-top:10px;background:linear-gradient(135deg,#f59e0b,#fb7185);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(245,158,11,0.3);\">\n            📔 宠物日记\n          </button>\n        </div>\n        <div id=\"statusPetAwayArea\" style=\"margin-top:14px;display:none;\">\n          <div style=\"background:#fff3cd;border-radius:12px;padding:12px;text-align:center;\">\n            <div style=\"font-size:14px;color:#856404;font-weight:600;\" id=\"statusPetAwayText\">小橘正在上学...</div>\n            <div style=\"font-size:20px;font-weight:700;color:#856404;margin-top:6px;\" id=\"statusPetAwayTimer\">00:00</div>\n            <button onclick=\"recallPet()\" style=\"margin-top:10px;width:100%;background:#ef4444;color:#fff;border:none;padding:10px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(239,68,68,0.3);\">\n              🏠 召回宠物（退还一半金币）\n            </button>\n            <button onclick=\"showSuperItemPanel()\" style=\"margin-top:8px;width:100%;background:linear-gradient(135deg,#f43f5e,#f97316);color:#fff;border:none;padding:10px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 2px 8px rgba(244,63,94,0.3);\">\n              ✨ 使用道具\n            </button>\n          </div>\n        </div>\n        <!-- 仓库按钮 -->\n        <div style=\"margin-top:10px;\">\n          <button onclick=\"openPage('warehousePage')\" style=\"width:100%;background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;border:none;padding:12px;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(245,158,11,0.3);display:flex;align-items:center;justify-content:center;gap:6px;\">\n            📦 宠物仓库 <span id=\"warehouseBadge\" style=\"background:rgba(255,255,255,0.25);border-radius:10px;padding:1px 8px;font-size:12px;\">0</span>\n          </button>\n        </div>\n      </div>\n      \n      <!-- 收藏品展柜 -->\n      <div style=\"margin-top:14px;margin-bottom:24px;background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:16px;padding:16px;box-shadow:0 4px 16px rgba(245,158,11,0.2);\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;\">\n          <div style=\"font-size:16px;font-weight:700;color:#92400e;\">🏆 收藏品展柜</div>\n          <div style=\"display:flex;align-items:center;gap:8px;\">\n            <span style=\"font-size:12px;color:#92400e;\" id=\"collectionProgress\">0/15</span>\n            <button onclick=\"openPage('collectionPage')\" style=\"background:rgba(255,255,255,0.5);border:none;border-radius:8px;padding:4px 10px;font-size:11px;color:#92400e;font-weight:600;cursor:pointer;\">查看全部 →</button>\n          </div>\n        </div>\n        <div id=\"collectionDisplay\" style=\"display:grid;grid-template-columns:repeat(5,1fr);gap:8px;\">\n          <!-- 收藏品由JS生成 -->\n        </div>\n      </div>\n      \n      <!-- 商店按钮区域 -->\n      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 食物商店按钮 -->\n        <div onclick=\"openPage('foodShopPage')\" style=\"background:linear-gradient(135deg,#ff9a9e,#fecfef);border-radius:16px;padding:16px;cursor:pointer;box-shadow:0 4px 16px rgba(255,154,158,0.3);\">\n          <div style=\"text-align:center;\">\n            <div style=\"font-size:32px;\">🍖</div>\n            <div style=\"font-size:15px;font-weight:700;color:#fff;margin-top:6px;\">食物商店</div>\n            <div style=\"font-size:11px;color:rgba(255,255,255,0.9);margin-top:2px;\">买好吃的~</div>\n          </div>\n        </div>\n        <!-- 清洁商店按钮 -->\n        <div onclick=\"openPage('cleanShopPage')\" style=\"background:linear-gradient(135deg,#60a5fa,#34d399);border-radius:16px;padding:16px;cursor:pointer;box-shadow:0 4px 16px rgba(96,165,250,0.3);\">\n          <div style=\"text-align:center;\">\n            <div style=\"font-size:32px;\">🧼</div>\n            <div style=\"font-size:15px;font-weight:700;color:#fff;margin-top:6px;\">清洁商店</div>\n            <div style=\"font-size:11px;color:rgba(255,255,255,0.9);margin-top:2px;\">买清洁用品~</div>\n          </div>\n        </div>\n      </div>\n      <!-- 猫咪用品商店按钮 -->\n      <div onclick=\"openPage('toyShopPage')\" style=\"margin-top:12px;background:linear-gradient(135deg,#a78bfa,#f472b6);border-radius:16px;padding:14px;cursor:pointer;box-shadow:0 4px 16px rgba(167,139,250,0.3);\">\n        <div style=\"text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;\">\n          <div style=\"font-size:28px;\">🪶</div>\n          <div style=\"text-align:left;\">\n            <div style=\"font-size:15px;font-weight:700;color:#fff;\">猫咪用品商店</div>\n            <div style=\"font-size:11px;color:rgba(255,255,255,0.9);margin-top:1px;\">逗猫棒、毛线球~ 提升好感度</div>\n          </div>\n        </div>\n      </div>\n      <!-- 超级道具商店按钮 -->\n      <div onclick=\"openPage('superItemShopPage')\" style=\"margin-top:12px;background:linear-gradient(135deg,#f43f5e,#f97316);border-radius:16px;padding:14px;cursor:pointer;box-shadow:0 4px 16px rgba(244,63,94,0.3);\">\n        <div style=\"text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;\">\n          <div style=\"font-size:28px;\">✨</div>\n          <div style=\"text-align:left;\">\n            <div style=\"font-size:15px;font-weight:700;color:#fff;\">超级道具商店</div>\n            <div style=\"font-size:11px;color:rgba(255,255,255,0.9);margin-top:1px;\">加速卡、双倍战力~ 上学神器</div>\n          </div>\n        </div>\n      </div>\n      <!-- 每日任务按钮 -->\n      <div onclick=\"openPage('dailyTaskPage')\" style=\"margin-top:12px;background:linear-gradient(135deg,#8b5cf6,#6366f1);border-radius:16px;padding:14px;cursor:pointer;box-shadow:0 4px 16px rgba(139,92,246,0.3);\">\n        <div style=\"text-align:center;display:flex;align-items:center;justify-content:center;gap:10px;\">\n          <div style=\"font-size:28px;\">📋</div>\n          <div style=\"text-align:left;\">\n            <div style=\"font-size:15px;font-weight:700;color:#fff;\">每日任务</div>\n            <div style=\"font-size:11px;color:rgba(255,255,255,0.9);margin-top:1px;\">完成任务领金币，每天0点刷新</div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>");
window.flRegisterToolPage("pageFoodShopPage", "<!-- pageFoodShopPage -->\n<div class=\"tool-page\" id=\"pageFoodShopPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('statusPage')\"><span>←</span> 返回状态</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🍽️ 食物商店</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:14px;\">给小橘买好吃的，点击食物购买后放入仓库，再从仓库喂食~</div>\n      \n      <!-- 小橘猫状态 -->\n      <div class=\"fl-state-material-card\" style=\"padding:20px;margin-bottom:14px;text-align:center;\">\n        <div style=\"font-size:60px;\" id=\"foodPetEmoji\">🐱</div>\n        <div style=\"font-size:18px;font-weight:700;margin-top:8px;\" id=\"foodPetName\">小橘</div>\n        <div style=\"font-size:12px;color:#666;margin-top:4px;\" id=\"foodPetMood\">心情不错~</div>\n        <div style=\"margin-top:14px;text-align:left;\">\n          <div style=\"display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;\">\n            <span>🍖 饱食度</span>\n            <span id=\"foodHungerText\">50/100</span>\n          </div>\n          <div style=\"height:10px;background:#eee;border-radius:5px;overflow:hidden;\">\n            <div id=\"foodHungerBar\" style=\"height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:5px;width:50%;transition:width 0.3s;\"></div>\n          </div>\n        </div>\n      </div>\n      \n      <!-- 食物列表 -->\n      <div id=\"foodShopList\" style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n        <!-- 食物列表由JS生成 -->\n      </div>\n      \n      <!-- 当前金币 -->\n      <div style=\"margin-top:16px;padding:14px;background:var(--primary-bg);border-radius:12px;text-align:center;font-size:15px;\">\n        💰 当前金币：<span id=\"foodCoinsDisplay\" style=\"font-weight:700;color:#f59e0b;font-size:18px;\">0</span>\n      </div>\n    </div>\n  </div>");
// ==================== 状态系统 ====================
function initStatus(){
  // 记录第一次进入日期
  const firstVisit = lsGet('first_visit_date', null);
  if(!firstVisit){
    const now = new Date();
    const dateStr = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0')+'-'+String(now.getDate()).padStart(2,'0');
    lsSet('first_visit_date', dateStr);
  }
  // 记录访问次数
  const visitCount = lsGet('visit_count', 0) + 1;
  lsSet('visit_count', visitCount);
  // 初始化饱食度
  if(lsGet('pet_hunger', null) === null){
    lsSet('pet_hunger', 50);
  }
  // 初始化清洁值
  if(lsGet('pet_clean', null) === null){
    lsSet('pet_clean', 100);
  }
  // 初始化好感度
  if(lsGet('pet_affection', null) === null){
    lsSet('pet_affection', 50);
  }
  // 初始化宠物战力
  initPetPower();
  // 离线结算：检查关闭浏览器期间是否有活动结束
  setTimeout(() => {
    // 上学离线结算
    const schoolData = lsGet('pet_school_data', null);
    if(schoolData && schoolData.endTime <= Date.now()){
      completePetSchool();
    }
    // 打工离线结算
    const workData = lsGet('pet_work_data', null);
    if(workData && workData.endTime <= Date.now()){
      completePetWork();
    }
    // 启动各活动计时器（游玩计时器首次tick会自动结算已结束的）
    startPetSchoolTimer();
    startPetWorkTimer();
    startPlayTimer();
    updatePetStatusDisplay();
    updateWarehouseBadge();
    updateMailboxBadge();
  }, 500);
}

function updateStatusPage(){
  // 更新状态页面信息
  const firstVisit = lsGet('first_visit_date', '--');
  const visitCount = lsGet('visit_count', 0);
  const coins = bpGetCoins();
  
  // 计算弹珠总数
  const pinballInv = lsGet('pinball_inventory', {});
  let totalPinballs = 0;
  for(let k in pinballInv){ totalPinballs += pinballInv[k]; }
  
  // 计算卡牌数量（backpack_cards是数组，每个元素是卡牌对象）
  const cardInv = lsGet('backpack_cards', []);
  let totalCards = Array.isArray(cardInv) ? cardInv.length : 0;
  
  // 计算道具数量（backpack_items是数组，每个元素是道具对象）
  const itemInv = lsGet('backpack_items', []);
  let totalItems = Array.isArray(itemInv) ? itemInv.length : 0;
  
  // 计算成就数量
  const achievementsClaimed = lsGet('achievements_claimed', []);
  const totalAchievements = achievementsClaimed.length;
  
  // 更新DOM
  const elFirst = document.getElementById('statusFirstVisit');
  const elVisit = document.getElementById('statusVisitCount');
  const elCoins = document.getElementById('statusCoins');
  const elPinballs = document.getElementById('statusPinballs');
  const elCards = document.getElementById('statusCards');
  const elItems = document.getElementById('statusItems');
  const elAch = document.getElementById('statusAchievements');
  
  if(elFirst) elFirst.textContent = firstVisit;
  if(elVisit) elVisit.textContent = visitCount + ' 次';
  if(elCoins) elCoins.textContent = coins + ' 💰';
  if(elPinballs) elPinballs.textContent = totalPinballs + ' 🔮';
  if(elCards) elCards.textContent = totalCards;
  if(elItems) elItems.textContent = totalItems;
  if(elAch) elAch.textContent = totalAchievements + '/' + (typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS.length : 34);
  
  // 宠物数据统计
  const petPower = lsGet('pet_power', 0);
  const schoolCounts = lsGet('pet_school_counts', {});
  let totalSchool = 0;
  for(let k in schoolCounts){ totalSchool += schoolCounts[k]; }
  const totalGainedPower = lsGet('pet_total_gained_power', 0);
  const warehouseTotal = typeof getWarehouseAllTotal === 'function' ? getWarehouseAllTotal() : 0;
  
  // 计算当前学历（最高解锁的学校）
  let currentDegree = '幼儿园';
  const unlockedSchools = PET_SCHOOLS.filter(s => {
    if(!s.unlockSchool) return true;
    const reqCount = schoolCounts[s.unlockSchool] || 0;
    return reqCount >= s.unlockCount;
  });
  if(unlockedSchools.length > 0){
    currentDegree = unlockedSchools[unlockedSchools.length - 1].name;
  }
  
  const elTotalPower = document.getElementById('statusTotalPower');
  const elTotalSchool = document.getElementById('statusTotalSchool');
  const elDegree = document.getElementById('statusCurrentDegree');
  const elTotalUsage = document.getElementById('statusTotalUsage');
  
  // 计算使用总次数
  const usageHistory = lsGet('pet_usage_history', []);
  const totalUsage = usageHistory.length;
  
  if(elTotalPower) elTotalPower.textContent = petPower;
  if(elTotalSchool) elTotalSchool.textContent = totalSchool + '次';
  if(elDegree) elDegree.textContent = currentDegree;
  if(elTotalUsage) elTotalUsage.textContent = totalUsage + '次';
  
  // 更新小橘猫显示
  updatePetStatusDisplay();
  // 更新仓库角标
  updateWarehouseBadge();
  // 更新收藏品展柜
  renderCollections();
  // 更新信箱角标
  updateMailboxBadge();
}

// 更新小橘猫显示（状态页面和食物商店页面）
function updatePetDisplay(){
  const hunger = lsGet('pet_hunger', 50);
  const hungerPercent = Math.max(0, Math.min(100, hunger));
  
  // 根据饱食度更新心情和表情
  let mood, emoji;
  if(hungerPercent >= 80){
    mood = '吃饱啦，超级开心~';
    emoji = '😺';
  } else if(hungerPercent >= 50){
    mood = '心情不错~';
    emoji = '🐱';
  } else if(hungerPercent >= 20){
    mood = '有点饿了...';
    emoji = '😿';
  } else {
    mood = '快饿晕啦，快喂我！';
    emoji = '😾';
  }
  
  // 更新状态页面的小橘猫
  const elStatusEmoji = document.getElementById('statusPetEmoji');
  const elStatusMood = document.getElementById('statusPetMood');
  const elStatusHungerText = document.getElementById('statusHungerText');
  const elStatusHungerBar = document.getElementById('statusHungerBar');
  if(elStatusEmoji) elStatusEmoji.textContent = emoji;
  if(elStatusMood) elStatusMood.textContent = mood;
  if(elStatusHungerText) elStatusHungerText.textContent = hungerPercent + '/100';
  if(elStatusHungerBar) elStatusHungerBar.style.width = hungerPercent + '%';
  
  // 更新食物商店页面的小橘猫
  const elFoodEmoji = document.getElementById('foodPetEmoji');
  const elFoodMood = document.getElementById('foodPetMood');
  const elFoodHungerText = document.getElementById('foodHungerText');
  const elFoodHungerBar = document.getElementById('foodHungerBar');
  if(elFoodEmoji) elFoodEmoji.textContent = emoji;
  if(elFoodMood) elFoodMood.textContent = mood;
  if(elFoodHungerText) elFoodHungerText.textContent = hungerPercent + '/100';
  if(elFoodHungerBar) elFoodHungerBar.style.width = hungerPercent + '%';
  
  // 更新食物商店页面的金币
  const elFoodCoins = document.getElementById('foodCoinsDisplay');
  if(elFoodCoins) elFoodCoins.textContent = bpGetCoins();
}

// 初始化食物商店页面
function initFoodShop(){
  renderFoodShopList();
  updatePetDisplay();
}

// 渲染食物商店列表
function renderFoodShopList(){
  const container = document.getElementById('foodShopList');
  if(!container) return;
  container.innerHTML = '';
  PHONE_FOODS.forEach(food => {
    const div = document.createElement('div');
    div.style.cssText = 'background:var(--bg-card);border-radius:14px;padding:16px;text-align:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.06);transition:transform 0.2s;border:2px solid transparent;';
    div.onmouseover = () => {div.style.transform='scale(1.03)';div.style.borderColor='var(--primary)';};
    div.onmouseout = () => {div.style.transform='scale(1)';div.style.borderColor='transparent';};
    div.onclick = () => showBuyQuantityModal(food, 'food');
    div.innerHTML = `
      <div style="font-size:36px;">${food.emoji}</div>
      <div style="font-size:15px;font-weight:700;margin-top:8px;">${food.name}</div>
      <div style="font-size:12px;color:#666;margin-top:4px;">+${food.hunger}饱食度</div>
      <div style="margin-top:8px;display:inline-block;background:#fef3c7;color:#f59e0b;padding:4px 12px;border-radius:12px;font-size:13px;font-weight:700;">💰 ${food.price}</div>
    `;
    container.appendChild(div);
  });
}


/* ===== 状态系统共享功能 ===== */
// ==================== 每日任务系统 ====================
const DAILY_TASKS = [
  {id:'play_game', name:'玩1局游戏', emoji:'🎮', target:1, reward:10, key:'daily_play_game', desc:'任意游戏玩1局'},
  {id:'feed_pet', name:'喂食小橘1次', emoji:'🍖', target:1, reward:8, key:'daily_feed_pet', desc:'使用食物1次'},
  {id:'clean_pet', name:'给小橘清洁1次', emoji:'🧼', target:1, reward:8, key:'daily_clean_pet', desc:'使用清洁用品1次'},
  {id:'play_pet', name:'陪小橘玩1次', emoji:'🪶', target:1, reward:8, key:'daily_play_pet', desc:'使用玩具1次'},
  {id:'gacha', name:'抽卡或扭蛋1次', emoji:'🎴', target:1, reward:10, key:'daily_gacha', desc:'抽卡/扭蛋/转盘任意1次'},
  {id:'checkin', name:'每日签到', emoji:'📅', target:1, reward:15, key:'daily_checkin', desc:'完成今日签到'},
  {id:'earn_coins', name:'赚取50金币', emoji:'🪙', target:50, reward:20, key:'daily_earn_coins', desc:'通过游戏/打工累计赚取'},
  {id:'pet_work', name:'让小橘打工1次', emoji:'💼', target:1, reward:15, key:'daily_pet_work', desc:'完成一次打工'},
  {id:'pet_school', name:'送小橘上学1次', emoji:'🎒', target:1, reward:12, key:'daily_pet_school', desc:'完成一次上学'},
  {id:'use_tool', name:'使用3款不同工具', emoji:'🧰', target:3, reward:12, key:'daily_use_tool', desc:'使用不同的工具/游戏'}
];

// 获取今天的日期字符串
function getTodayStr(){
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

// 获取每日任务数据（自动跨天重置）
function getDailyTaskData(){
  const data = lsGet('daily_tasks_data', null);
  const today = getTodayStr();
  if(!data || data.date !== today){
    const fresh = {date: today, progress: {}, claimed: [], uniqueTools: []};
    lsSet('daily_tasks_data', fresh);
    return fresh;
  }
  return data;
}

// 更新任务进度
function updateDailyTask(key, amount){
  const data = getDailyTaskData();
  if(!data.progress) data.progress = {};
  data.progress[key] = (data.progress[key] || 0) + (amount || 1);
  lsSet('daily_tasks_data', data);
  // 如果当前在任务页面，刷新显示
  if(pageDailyTaskPage && pageDailyTaskPage.style.display === 'block'){
    renderDailyTasks();
  }
}

// 记录使用了不同工具（用于"使用3款不同工具"任务）
function recordDailyToolUse(toolId){
  const data = getDailyTaskData();
  if(!data.uniqueTools) data.uniqueTools = [];
  if(!data.uniqueTools.includes(toolId)){
    data.uniqueTools.push(toolId);
    data.progress['daily_use_tool'] = data.uniqueTools.length;
    lsSet('daily_tasks_data', data);
  }
}

// 从每日任务页面返回（根据来源页面动态返回）
function backFromDailyTask(){
  const from = window._dailyTaskFrom || 'chestHome';
  openPage(from);
}

// 渲染每日任务列表
function renderDailyTasks(){
  // 更新返回按钮文字（根据来源页面）
  const backText = document.getElementById('dailyTaskBackText');
  if(backText){
    const from = window._dailyTaskFrom || 'chestHome';
    backText.textContent = from === 'statusPage' ? '返回状态' : '返回百宝箱';
  }
  // 同时更新签到区域
  if(typeof checkinRender === 'function') checkinRender();
  const data = getDailyTaskData();
  const listEl = document.getElementById('dailyTaskList');
  if(!listEl) return;
  
  let completed = 0, claimedReward = 0, totalReward = 0;
  let html = '';
  
  DAILY_TASKS.forEach(task => {
    const progress = data.progress[task.key] || 0;
    const done = progress >= task.target;
    const claimed = data.claimed.includes(task.id);
    if(done) completed++;
    totalReward += task.reward;
    if(claimed) claimedReward += task.reward;
    
    const percent = Math.min(100, (progress / task.target) * 100);
    let btnHtml = '';
    if(!done){
      btnHtml = '<div style="font-size:12px;color:var(--text-placeholder);">进度 ' + Math.min(progress, task.target) + '/' + task.target + '</div>';
    } else if(claimed){
      btnHtml = '<div style="font-size:12px;color:#16a34a;font-weight:600;">✅ 已领取</div>';
    } else {
      btnHtml = '<button onclick="claimDailyTask(\'' + task.id + '\')" style="background:linear-gradient(135deg,#f59e0b,#d97706);color:#fff;border:none;padding:6px 14px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;box-shadow:0 2px 6px rgba(245,158,11,0.3);">🎁 领取 +' + task.reward + '</button>';
    }
    
    const cardClass = done ? '' : ' class="fl-state-material-card"';
    const cardStyle = done
      ? 'background:linear-gradient(135deg,#fef3c7,#fde68a);border-radius:14px;padding:14px;box-shadow:0 2px 8px rgba(0,0,0,0.05);border:1px solid #f59e0b;'
      : 'padding:14px;';
    html += '<div' + cardClass + ' style="' + cardStyle + '">' +
      '<div style="display:flex;align-items:center;gap:12px;">' +
        '<div style="font-size:28px;">' + task.emoji + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:14px;font-weight:700;">' + task.name + '</div>' +
          '<div style="font-size:11px;color:var(--text-secondary);margin-top:1px;">' + task.desc + '</div>' +
          '<div style="height:6px;background:#eee;border-radius:3px;overflow:hidden;margin-top:6px;">' +
            '<div style="height:100%;background:linear-gradient(90deg,#f59e0b,#d97706);border-radius:3px;width:' + percent + '%;transition:width 0.3s;"></div>' +
          '</div>' +
        '</div>' +
        '<div style="flex-shrink:0;text-align:right;min-width:70px;">' +
          '<div style="font-size:11px;color:#b45309;font-weight:600;">+' + task.reward + '💰</div>' +
          btnHtml +
        '</div>' +
      '</div>' +
    '</div>';
  });
  
  listEl.innerHTML = html;
  
  // 更新概览
  const elDate = document.getElementById('dailyTaskDate');
  if(elDate) elDate.textContent = data.date;
  const elProg = document.getElementById('dailyTaskProgress');
  if(elProg) elProg.textContent = completed + '/' + DAILY_TASKS.length;
  const elBar = document.getElementById('dailyTaskBar');
  if(elBar) elBar.style.width = (completed / DAILY_TASKS.length * 100) + '%';
  const elClaimed = document.getElementById('dailyTaskClaimed');
  if(elClaimed) elClaimed.textContent = claimedReward;
  const elTotal = document.getElementById('dailyTaskTotal');
  if(elTotal) elTotal.textContent = totalReward;
}

// 领取每日任务奖励
function claimDailyTask(taskId){
  const task = DAILY_TASKS.find(t => t.id === taskId);
  if(!task) return;
  const data = getDailyTaskData();
  if(data.claimed.includes(taskId)) return;
  const progress = data.progress[task.key] || 0;
  if(progress < task.target) return;
  data.claimed.push(taskId);
  lsSet('daily_tasks_data', data);
  bpAddCoins(task.reward, 'dailyTask');
  showToast('🎁 领取成功！获得' + task.reward + '金币~');
  renderDailyTasks();
}



/* ===== 状态系统共享功能 ===== */
// ==================== 出去玩超级道具系统 ====================

// 显示出去玩道具面板
function showPlaySuperItemPanel(){
  const playData = lsGet('pet_play_data', null);
  if(!playData){
    showToast('小橘还没出去玩呢，先带小橘出去玩吧~');
    return;
  }
  
  const items = getSuperItems();
  const playItems = SUPER_ITEMS.filter(item => item.category === 'play');
  const hasItems = playItems.some(item => (items[item.id] || 0) > 0);
  
  let itemsHtml = '';
  if(hasItems){
    playItems.forEach(item => {
      const count = items[item.id] || 0;
      if(count > 0){
        itemsHtml += `
          <div class="fl-state-material-card" onclick="usePlaySuperItemAndClose('${item.id}')" style="padding:14px;cursor:pointer;text-align:center;transition:all 0.2s;" onmouseover="this.style.borderColor='#f43f5e'" onmouseout="this.style.borderColor='transparent'">
            <div style="font-size:32px;">${item.emoji}</div>
            <div style="font-size:14px;font-weight:700;margin-top:6px;">${item.name}</div>
            <div style="font-size:11px;color:#666;margin-top:2px;">${item.desc}</div>
            <div style="margin-top:6px;display:inline-block;background:#fee2e2;color:#ef4444;border-radius:10px;padding:2px 8px;font-size:12px;font-weight:700;">×${count}</div>
          </div>
        `;
      }
    });
  }
  
  const modalHtml = `
    <div class="modal-mask" id="playSuperItemPanelMask" style="display:flex;position:fixed;top:0;left:0;right:0;bottom:0;width:100vw;height:100vh;z-index:99999;align-items:center;justify-content:center;margin:0;padding:0;">
      <div class="modal-box" style="max-width:400px;width:90%;padding:20px;border-radius:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="font-size:18px;font-weight:700;">✨ 选择道具</div>
          <button class="modal-close-btn" onclick="closePlaySuperItemPanel()" aria-label="关闭外出道具弹窗">×</button>
        </div>
        ${hasItems ? 
          `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">${itemsHtml}</div>` :
          `<div style="text-align:center;padding:30px 20px;color:#999;">
            <div style="font-size:48px;">📭</div>
            <div style="font-size:14px;margin-top:10px;">还没有出去玩道具哦~</div>
            <button onclick="closePlaySuperItemPanel();openPage('superItemShopPage')" style="margin-top:14px;padding:8px 16px;border:none;border-radius:10px;background:linear-gradient(135deg,#f43f5e,#f97316);color:#fff;font-size:13px;font-weight:700;cursor:pointer;">去超级道具商店</button>
          </div>`
        }
      </div>
    </div>
  `;
  
  const oldModal = document.getElementById('playSuperItemPanelMask');
  if(oldModal) oldModal.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow='hidden';
}

// 关闭出去玩道具面板
function closePlaySuperItemPanel(){
  const modal = document.getElementById('playSuperItemPanelMask');
  if(!modal) return;
  modal.classList.add('pet-modal-stationary','closing');
  document.body.style.overflow='';
  setTimeout(() => {
    if(modal.parentNode) modal.parentNode.removeChild(modal);
  }, 200);
}

// 使用出去玩道具并关闭面板
function usePlaySuperItemAndClose(itemId){
  closePlaySuperItemPanel();
  usePlaySuperItem(itemId);
}

// 使用出去玩道具
function usePlaySuperItem(itemId){
  const item = SUPER_ITEMS.find(i => i.id === itemId);
  if(!item) return;
  
  const count = getSuperItemCount(itemId);
  if(count <= 0){
    showToast('没有这个道具哦，去超级道具商店购买吧~');
    return;
  }
  
  const playData = lsGet('pet_play_data', null);
  if(!playData){
    showToast('小橘还没出去玩呢，先带小橘出去玩吧~');
    return;
  }
  
  // 扣除道具
  const items = getSuperItems();
  items[itemId] = count - 1;
  saveSuperItems(items);
  
  // 记录使用历史
  recordUsage('superItem', item.id, item.name, item.emoji);
  
  if(item.type === 'playSpeed'){
    // 立即回家卡：将游玩结束时间缩短到0.1秒后
    playData.endTime = Date.now() + 100;
    lsSet('pet_play_data', playData);
    startPlayTimer();
    showToast('🏠 使用立即回家卡！小橘马上回来啦~');
  } else if(item.type === 'guaranteedCollectible'){
    // 必出收藏品卡：设置标记，游玩结束时必定获得收藏品
    lsSet('pet_guaranteed_collectible', true);
    showToast('🎁 使用必出收藏品卡！这次游玩必定获得收藏品~');
  }
  
  // 更新UI
  updatePlayUI();
  if(typeof playSound === 'function') playSound('success');
}

// 初始化使用统计页面
function initUsageStats(){
  renderUsageStats();
}

// 渲染使用统计
function renderUsageStats(){
  const history = lsGet('pet_usage_history', []);
  
  // 统计各类别数量
  let foodCount = 0, cleanCount = 0, toyCount = 0, superItemCount = 0;
  history.forEach(record => {
    if(record.type === 'food') foodCount++;
    else if(record.type === 'clean') cleanCount++;
    else if(record.type === 'toy') toyCount++;
    else if(record.type === 'superItem') superItemCount++;
  });
  
  // 更新统计数字
  const elFood = document.getElementById('statsFoodCount');
  const elClean = document.getElementById('statsCleanCount');
  const elToy = document.getElementById('statsToyCount');
  const elSuper = document.getElementById('statsSuperItemCount');
  
  if(elFood) elFood.textContent = foodCount;
  if(elClean) elClean.textContent = cleanCount;
  if(elToy) elToy.textContent = toyCount;
  if(elSuper) elSuper.textContent = superItemCount;
  
  // 渲染历史记录
  const listEl = document.getElementById('usageHistoryList');
  const emptyEl = document.getElementById('usageHistoryEmpty');
  
  if(!listEl) return;
  
  if(history.length === 0){
    listEl.style.display = 'none';
    if(emptyEl) emptyEl.style.display = 'block';
    return;
  }
  
  listEl.style.display = 'flex';
  if(emptyEl) emptyEl.style.display = 'none';
  
  // 类型颜色映射
  const typeColors = {
    food: {bg: '#fef2f2', text: '#dc2626', label: '食物'},
    clean: {bg: '#eff6ff', text: '#2563eb', label: '清洁'},
    toy: {bg: '#fdf2f8', text: '#db2777', label: '玩具'},
    superItem: {bg: '#fffbeb', text: '#d97706', label: '道具'}
  };
  
  listEl.innerHTML = history.slice(0, 100).map(record => {
    const date = new Date(record.timestamp);
    const dateStr = `${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    const color = typeColors[record.type] || typeColors.food;
    
    return `
      <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:${color.bg};border-radius:10px;">
        <div style="font-size:24px;">${record.itemEmoji}</div>
        <div style="flex:1;">
          <div style="font-size:13px;font-weight:600;color:#333;">${record.itemName}</div>
          <div style="font-size:11px;color:#999;margin-top:1px;">${dateStr}</div>
        </div>
        <div style="background:${color.text};color:#fff;border-radius:8px;padding:2px 8px;font-size:11px;font-weight:600;">${color.label}</div>
      </div>
    `;
  }).join('');
}

// 清空使用记录
function clearUsageHistory(){
  if(confirm('确定要清空所有使用记录吗？此操作不可恢复。')){
    lsSet('pet_usage_history', []);
    renderUsageStats();
    showToast('使用记录已清空~');
  }
}



/* ===== 状态系统共享功能 ===== */
// ==================== 手机功能 ====================
const PHONE_MODAL_MARKUP = `
<!-- 手机功能弹窗 -->
<div class="modal-mask" id="phoneModalMask" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:1000;margin:0;padding:0;">
  <div class="modal-box" style="max-width:380px;padding:0;overflow:hidden;border-radius:24px;">
    <!-- 手机顶部 -->
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:16px;text-align:center;position:relative;">
      <div style="width:60px;height:6px;background:#333;border-radius:3px;margin:0 auto 12px;"></div>
      <div style="color:#fff;font-size:16px;font-weight:600;">📱 我的手机</div>
      <button class="modal-close-btn" onclick="closePhoneModal()" aria-label="关闭手机功能弹窗" style="position:absolute;top:12px;right:12px;">✕</button>
    </div>

    <!-- 宠物状态 -->
    <div style="background:linear-gradient(180deg,#e0f7fa,#fff);padding:20px;text-align:center;">
      <div style="font-size:60px;" id="phonePetEmoji">🐱</div>
      <div style="font-size:18px;font-weight:700;margin-top:8px;" id="phonePetName">小橘</div>
      <div style="font-size:12px;color:#666;margin-top:4px;" id="phonePetMood">心情不错~</div>

      <!-- 饱食度 -->
      <div style="margin-top:16px;text-align:left;">
        <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;">
          <span>🍖 饱食度</span>
          <span id="phoneHungerText">50/100</span>
        </div>
        <div style="height:10px;background:#eee;border-radius:5px;overflow:hidden;">
          <div id="phoneHungerProgress" style="height:100%;background:linear-gradient(90deg,#ff6b6b,#feca57);border-radius:5px;width:50%;transition:width 0.3s;"></div>
        </div>
      </div>
    </div>

    <!-- 食物商店 -->
    <div style="padding:16px;background:#f9f9f9;">
      <div style="font-size:14px;font-weight:600;margin-bottom:10px;">🍽️ 食物商店</div>
      <div id="phoneFoodList" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <!-- 食物列表由JS生成 -->
      </div>
      <div style="margin-top:12px;padding:10px;background:var(--primary-bg);border-radius:10px;text-align:center;font-size:13px;">
        💰 当前金币：<span id="phoneCoinsDisplay" style="font-weight:700;color:#f59e0b;">0</span>
      </div>
    </div>
  </div>
</div>`;

function ensurePhoneModalMarkup(){
  if(document.getElementById('phoneModalMask')) return document.getElementById('phoneModalMask');
  if(!document.body) return null;
  document.body.insertAdjacentHTML('beforeend', PHONE_MODAL_MARKUP);
  const mask = document.getElementById('phoneModalMask');
  if(mask){
    mask.addEventListener('click', event => {
      if(event.target === mask) closePhoneModal();
    });
  }
  return mask;
}

ensurePhoneModalMarkup();
const PHONE_FOODS = [
  {id:'fish', name:'小鱼干', emoji:'🐟', price:5, hunger:15},
  {id:'meat', name:'肉肉', emoji:'🍖', price:10, hunger:25},
  {id:'milk', name:'牛奶', emoji:'🥛', price:3, hunger:10},
  {id:'cake', name:'蛋糕', emoji:'🍰', price:8, hunger:20},
  {id:'apple', name:'苹果', emoji:'🍎', price:2, hunger:8},
  {id:'candy', name:'糖果', emoji:'🍬', price:1, hunger:5}
];



function closePhoneModal(){
  const mask = document.getElementById('phoneModalMask');
  if(mask){mask.classList.add('pet-modal-stationary');closeModalAnimated(mask);}
}

function renderPhoneFoodList(){
  const container = document.getElementById('phoneFoodList');
  if(!container) return;
  container.innerHTML = '';
  PHONE_FOODS.forEach(food => {
    const div = document.createElement('div');
    div.style.cssText = 'background:#fff;border-radius:12px;padding:12px;text-align:center;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.06);transition:transform 0.2s;';
    div.onmouseover = () => div.style.transform = 'scale(1.03)';
    div.onmouseout = () => div.style.transform = 'scale(1)';
    div.onclick = () => showBuyQuantityModal(food, 'food');
    div.innerHTML = `
      <div style="font-size:28px;">${food.emoji}</div>
      <div style="font-size:13px;font-weight:600;margin-top:4px;">${food.name}</div>
      <div style="font-size:11px;color:#666;margin-top:2px;">+${food.hunger}饱食度</div>
      <div style="font-size:12px;color:#f59e0b;font-weight:700;margin-top:4px;">💰 ${food.price}</div>
    `;
    container.appendChild(div);
  });
}



/* ===== 状态系统共享功能 ===== */
// ==================== 批量购买系统 ====================
let batchBuyItem = null;
let batchBuyType = null;
let batchBuyQuantity = 1;

// 打开批量购买弹窗
function showBuyQuantityModal(item, type){
  batchBuyItem = item;
  batchBuyType = type;
  batchBuyQuantity = 1;
  
  // 获取商品单价和效果描述
  const price = item.price || item.cost || 0;
  let effectText = '';
  if(type === 'food') effectText = `+${item.hunger}饱食度/个`;
  else if(type === 'clean') effectText = `+${item.clean}清洁值/个`;
  else if(type === 'toy') effectText = `+${item.affection}好感度/个`;
  
  const coins = bpGetCoins();
  const maxAffordable = Math.floor(coins / price);
  
  const modalHtml = `
    <div class="modal-mask" id="buyModalMask" style="display:flex;position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:1000;align-items:center;justify-content:center;margin:0;padding:0;">
      <div class="modal-box" style="max-width:360px;width:90%;padding:0;overflow:hidden;border-radius:20px;">
        <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;text-align:center;position:relative;">
          <div style="font-size:56px;">${item.emoji}</div>
          <div style="font-size:18px;font-weight:700;color:#fff;margin-top:8px;">${item.name}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.8);margin-top:4px;">${effectText}</div>
          <div style="font-size:14px;color:#fef3c7;margin-top:6px;font-weight:600;">💰 单价：${price} 金币</div>
          <button class="modal-close-btn" onclick="closeBuyModal()" aria-label="关闭批量购买弹窗" style="position:absolute;top:12px;right:12px;">×</button>
        </div>
        <div style="padding:20px;">
          <div style="font-size:14px;font-weight:700;color:#333;margin-bottom:12px;text-align:center;">选择购买数量</div>
          
          <!-- 快捷数量按钮 -->
          <div style="display:flex;gap:8px;margin-bottom:14px;">
            <button onclick="setBuyQuantity(1)" id="bqBtn1" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;">×1</button>
            <button onclick="setBuyQuantity(5)" id="bqBtn5" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:#f3f4f6;color:#666;">×5</button>
            <button onclick="setBuyQuantity(10)" id="bqBtn10" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:#f3f4f6;color:#666;">×10</button>
            <button onclick="setBuyQuantity(${maxAffordable > 0 ? maxAffordable : 1})" id="bqBtnMax" style="flex:1;padding:10px;border:none;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;background:#f3f4f6;color:#666;">最大</button>
          </div>
          
          <!-- 自定义数量 -->
          <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px;background:#f9fafb;border-radius:12px;padding:12px;">
            <button onclick="changeBuyQuantity(-1)" style="width:36px;height:36px;border:none;border-radius:50%;background:#e5e7eb;color:#333;font-size:20px;font-weight:700;cursor:pointer;">−</button>
            <input type="number" id="buyQuantityInput" value="1" min="1" oninput="onBuyQuantityInput(this.value)" style="font-size:28px;font-weight:700;color:#333;min-width:80px;text-align:center;border:none;background:transparent;outline:none;-moz-appearance:textfield;" />
            <button onclick="changeBuyQuantity(1)" style="width:36px;height:36px;border:none;border-radius:50%;background:#e5e7eb;color:#333;font-size:20px;font-weight:700;cursor:pointer;">+</button>
          </div>
          
          <!-- 总价 -->
          <div style="display:flex;justify-content:space-between;align-items:center;background:#fef3c7;border-radius:10px;padding:12px;margin-bottom:16px;">
            <span style="font-size:14px;color:#92400e;font-weight:600;">总价</span>
            <span style="font-size:18px;font-weight:700;color:#d97706;" id="buyTotalPrice">💰 ${price}</span>
          </div>
          
          <!-- 当前金币 -->
          <div style="text-align:center;font-size:12px;color:#999;margin-bottom:14px;">当前金币：💰 ${coins} ${maxAffordable > 0 ? `（最多可买${maxAffordable}个）` : '（金币不足）'}</div>
          
          <!-- 按钮 -->
          <div style="display:flex;gap:10px;">
            <button onclick="closeBuyModal()" style="flex:1;padding:12px;border:none;border-radius:12px;background:#f3f4f6;color:#666;font-size:14px;font-weight:700;cursor:pointer;">取消</button>
            <button onclick="confirmBatchBuy()" id="confirmBatchBuyBtn" style="flex:2;padding:12px;border:none;border-radius:12px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(102,126,234,0.3);">🛒 确认购买</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 移除已存在的弹窗
  const oldModal = document.getElementById('buyModalMask');
  if(oldModal) oldModal.remove();
  
  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.body.style.overflow='hidden';
  updateBuyModalDisplay();
}

// 设置购买数量
function setBuyQuantity(qty){
  batchBuyQuantity = qty;
  updateBuyModalDisplay();
}

// 增减购买数量
function changeBuyQuantity(delta){
  const newQty = batchBuyQuantity + delta;
  if(newQty >= 1 && newQty <= 999){
    batchBuyQuantity = newQty;
    updateBuyModalDisplay();
  }
}

// 直接输入购买数量
function onBuyQuantityInput(value){
  let qty = parseInt(value);
  if(isNaN(qty) || qty < 1) qty = 1;
  if(qty > 999) qty = 999;
  batchBuyQuantity = qty;
  updateBuyModalDisplay();
}

// 更新弹窗显示
function updateBuyModalDisplay(){
  const price = batchBuyItem.price || batchBuyItem.cost || 0;
  const total = price * batchBuyQuantity;
  const coins = bpGetCoins();
  
  const qtyInput = document.getElementById('buyQuantityInput');
  const totalDisplay = document.getElementById('buyTotalPrice');
  const confirmBtn = document.getElementById('confirmBatchBuyBtn');
  
  if(qtyInput && document.activeElement !== qtyInput) qtyInput.value = batchBuyQuantity;
  if(totalDisplay) totalDisplay.textContent = `💰 ${total}`;
  
  // 更新快捷按钮高亮
  ['1','5','10'].forEach(q => {
    const btn = document.getElementById('bqBtn' + q);
    if(btn){
      if(batchBuyQuantity === parseInt(q)){
        btn.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
        btn.style.color = '#fff';
      } else {
        btn.style.background = '#f3f4f6';
        btn.style.color = '#666';
      }
    }
  });
  
  // 最大按钮高亮
  const maxBtn = document.getElementById('bqBtnMax');
  if(maxBtn){
    const maxAffordable = Math.floor(coins / price);
    if(batchBuyQuantity === maxAffordable && maxAffordable > 0){
      maxBtn.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
      maxBtn.style.color = '#fff';
    } else {
      maxBtn.style.background = '#f3f4f6';
      maxBtn.style.color = '#666';
    }
  }
  
  // 确认按钮状态
  if(confirmBtn){
    if(total > coins){
      confirmBtn.style.background = '#d1d5db';
      confirmBtn.style.color = '#9ca3af';
      confirmBtn.style.cursor = 'not-allowed';
      confirmBtn.textContent = '💰 金币不足';
    } else {
      confirmBtn.style.background = 'linear-gradient(135deg,#667eea,#764ba2)';
      confirmBtn.style.color = '#fff';
      confirmBtn.style.cursor = 'pointer';
      confirmBtn.textContent = `🛒 购买${batchBuyQuantity}个`;
    }
  }
}

// 确认批量购买
function confirmBatchBuy(){
  const item = batchBuyItem;
  const type = batchBuyType;
  const qty = batchBuyQuantity;
  const price = item.price || item.cost || 0;
  const total = price * qty;
  const coins = bpGetCoins();
  
  if(total > coins){
    showToast('金币不足，去玩游戏赚金币吧~');
    return;
  }
  
  // 扣除金币
  lsSet('backpack_coins', coins - total);
  
  // 批量放入仓库
  for(let i = 0; i < qty; i++){
    addToWarehouse(type, item.id);
  }
  
  // 更新显示
  if(type === 'food'){
    updatePetDisplay();
  } else if(type === 'clean'){
    updateCleanShopDisplay();
    updatePetStatusDisplay();
  } else if(type === 'toy'){
    updateToyShopDisplay();
    updatePetStatusDisplay();
  }
  updateWarehouseBadge();
  if(typeof bpUpdateHomeBadge === 'function') bpUpdateHomeBadge();
  
  // 播放音效
  if(typeof playSound === 'function') playSound('coin');
  
  showToast(`购买了${item.emoji}${item.name} ×${qty}，已放入仓库~`);
  closeBuyModal();
}

// 关闭购买弹窗
function closeBuyModal(){
  const modal = document.getElementById('buyModalMask');
  if(modal){
    modal.classList.add('pet-modal-stationary','closing');
    document.body.style.overflow='';
    setTimeout(()=>{ modal.remove(); }, 200);
  }
  batchBuyItem = null;
  batchBuyType = null;
  batchBuyQuantity = 1;
}



// 页面加载时初始化状态
initStatus();


/* ===== 百宝箱功能分段 ===== */



/* ===== 状态系统共享功能 ===== */
// ==================== 道具使用系统 ====================
const ITEM_EFFECTS={
  exp_potion:{name:'经验药水',icon:'🌟',action:()=>{const r=Math.floor(Math.random()*20)+10;bpAddCoins(r,'道具');playSound('item');showToast('🌟 使用经验药水，获得'+r+'金币');}},
  coin_bag:{name:'金币袋',icon:'💰',action:()=>{const r=Math.floor(Math.random()*21)+10;bpAddCoins(r,'道具');playSound('coin');showToast('💰 打开金币袋，获得'+r+'金币');}},
  lucky_charm:{name:'幸运符',icon:'🍀',action:()=>{lsSet('lucky_charm_count',3);playSound('item');showToast('🍀 使用幸运符，接下来3次抽卡/扭蛋概率提升！');}},
  mystery_box:{name:'神秘宝箱',icon:'🎁',action:()=>{const r=Math.random();if(r<0.5){const c=Math.floor(Math.random()*30)+20;bpAddCoins(c,'道具');playSound('coin');showToast('🎁 神秘宝箱开出'+c+'金币！');}else{const item=capsuleGetRandomItem();bpAddItem(item.id);playSound('item');showToast('🎁 神秘宝箱开出'+item.name+'！');}}},
  magic_scroll:{name:'魔法卷轴',icon:'📜',action:()=>{bpAddCoins(50,'道具');playSound('item');showToast('📜 使用魔法卷轴，获得50金币');}},
  energy_crystal:{name:'能量水晶',icon:'💎',action:()=>{const r=Math.floor(Math.random()*31)+30;bpAddCoins(r,'道具');playSound('coin');showToast('💎 能量水晶转化为'+r+'金币');}},
  time_hourglass:{name:'时光沙漏',icon:'⏳',action:()=>{bpAddCoins(25,'道具');playSound('item');showToast('⏳ 使用时光沙漏，获得25金币');}},
  star_fragment:{name:'星星碎片',icon:'⭐',action:()=>{const count=lsGet('star_fragment_used',0)+1;lsSet('star_fragment_used',count);if(count>=5){lsSet('star_fragment_used',0);bpAddCoins(100,'道具');playSound('success');showToast('⭐ 集齐5颗星星碎片，获得100金币！');}else{playSound('item');showToast('⭐ 使用星星碎片（'+count+'/5），集齐5颗获得100金币');}}}
};
// 批量使用道具相关变量
let currentBatchItemId=null;
let currentBatchCount=1;
let currentBatchMax=1;

function useItem(itemId){
  const items=bpGetItems();
  const count=items.filter(i=>i.id===itemId).length;
  if(count===0){showToast('没有这个道具');return;}
  if(count===1){
    // 只有1个，直接使用
    const idx=items.findIndex(i=>i.id===itemId);
    items.splice(idx,1);
    lsSet('backpack_items',items);
    const effect=ITEM_EFFECTS[itemId];
    if(effect)effect.action();
    bpRenderItems();
    bpRender();
  }else{
    // 多个，打开批量使用弹窗
    openBatchUseModal(itemId,count);
  }
}

function openBatchUseModal(itemId,count){
  currentBatchItemId=itemId;
  currentBatchMax=count;
  currentBatchCount=1;
  const effect=ITEM_EFFECTS[itemId];
  if(effect){
    document.getElementById('batchItemIcon').textContent=effect.icon;
    document.getElementById('batchItemName').textContent=effect.name;
  }
  document.getElementById('batchItemCount').textContent='拥有：'+count+'个';
  document.getElementById('batchCount').textContent=currentBatchCount;
  const modal=document.getElementById('batchUseModal');
  if(modal){modal.classList.remove('closing');modal.style.display='flex';document.body.style.overflow='hidden';}
  playSound('click');
}

function closeBatchUseModal(){
  const modal=document.getElementById('batchUseModal');
  if(modal){modal.classList.add('pet-modal-stationary');closeModalAnimated(modal);}
  currentBatchItemId=null;
}

function changeBatchCount(delta){
  currentBatchCount=Math.max(1,Math.min(currentBatchMax,currentBatchCount+delta));
  document.getElementById('batchCount').textContent=currentBatchCount;
}

function setBatchMax(){
  currentBatchCount=currentBatchMax;
  document.getElementById('batchCount').textContent=currentBatchCount;
}

function confirmBatchUse(){
  if(!currentBatchItemId)return;
  const items=bpGetItems();
  let used=0;
  for(let i=0;i<currentBatchCount;i++){
    const idx=items.findIndex(it=>it.id===currentBatchItemId);
    if(idx===-1)break;
    items.splice(idx,1);
    used++;
  }
  lsSet('backpack_items',items);
  // 循环触发道具效果
  const effect=ITEM_EFFECTS[currentBatchItemId];
  if(effect){
    for(let i=0;i<used;i++){
      effect.action();
    }
  }
  showToast('✨ 批量使用了'+used+'个'+effect.name);
  closeBatchUseModal();
  bpRenderItems();
  bpRender();
}


/* ===== 百宝箱功能分段 ===== */

// 扭蛋机规则弹窗
function openCapsuleRule(){
  const m=document.getElementById('capsuleRuleModal');
  if(m){m.classList.remove('closing');m.style.display='flex';document.body.style.overflow='hidden';playSound('click');}
}
function closeCapsuleRule(){
  const m=document.getElementById('capsuleRuleModal');
  if(m) closeModalAnimated(m);
}


/* ===== 百宝箱功能分段 ===== */

// 批量使用道具弹窗：与道具批量使用逻辑一起挂载。
(function mountBatchUseModal(){
  if(!document.body||document.getElementById('batchUseModal'))return;
  document.body.insertAdjacentHTML('beforeend', `<!-- 批量使用道具弹窗 -->
  <div class="modal-mask" id="batchUseModal" style="padding:20px;box-sizing:border-box;">
    <div class="modal-box" style="background:var(--bg-card,#ffffff);border-radius:18px;padding:24px;max-width:360px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:1px solid var(--border-color,#e5e7eb);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
        <h3 style="margin:0;font-size:18px;">🎁 批量使用道具</h3>
        <button class="modal-close-btn" aria-label="关闭批量使用弹窗" onclick="closeBatchUseModal()">✕</button>
      </div>
      <div id="batchItemInfo" style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-input,#f9fafb);border-radius:12px;margin-bottom:16px;">
        <span id="batchItemIcon" style="font-size:36px;">🌟</span>
        <div style="flex:1;">
          <div id="batchItemName" style="font-size:15px;font-weight:600;">经验药水</div>
          <div id="batchItemCount" style="font-size:12px;color:var(--text-secondary,#6b7280);margin-top:2px;">拥有：5个</div>
        </div>
      </div>
      <div style="font-size:13px;color:var(--text-secondary,#6b7280);margin-bottom:8px;">选择使用数量</div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <button onclick="changeBatchCount(-1)" style="width:40px;height:40px;border-radius:10px;border:1px solid var(--border-color,#e5e7eb);background:var(--bg-card,#fff);font-size:20px;cursor:pointer;color:var(--text,#1f2937);display:flex;align-items:center;justify-content:center;">−</button>
        <div style="flex:1;text-align:center;">
          <span id="batchCount" style="font-size:28px;font-weight:700;color:var(--primary,#6366f1);">1</span>
          <span style="font-size:14px;color:var(--text-secondary,#6b7280);">个</span>
        </div>
        <button onclick="changeBatchCount(1)" style="width:40px;height:40px;border-radius:10px;border:1px solid var(--border-color,#e5e7eb);background:var(--bg-card,#fff);font-size:20px;cursor:pointer;color:var(--text,#1f2937);display:flex;align-items:center;justify-content:center;">+</button>
      </div>
      <button onclick="setBatchMax()" style="width:100%;padding:8px;background:var(--bg-input,#f3f4f6);border:1px solid var(--border-color,#e5e7eb);border-radius:8px;font-size:12px;color:var(--text-secondary,#6b7280);cursor:pointer;margin-bottom:12px;">全部使用（最大数量）</button>
      <div style="display:flex;gap:10px;">
        <button onclick="closeBatchUseModal()" style="flex:1;padding:12px;background:var(--bg-input,#f3f4f6);color:var(--text-secondary,#6b7280);border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">取消</button>
        <button onclick="confirmBatchUse()" style="flex:1;padding:12px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;">确认使用</button>
      </div>
    </div>
  </div>`);
})();
