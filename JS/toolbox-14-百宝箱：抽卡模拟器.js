;(function(){
  const id = 'flGachaCardStyles';
  if(document.getElementById(id)) return;
  /* Styles moved to css/toolbox-14-百宝箱：抽卡模拟器.css. */
})();
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageGachaPage", "<!-- pageGachaPage -->\n<div class=\"tool-page\" id=\"pageGachaPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎴 抽卡模拟器</h3>\n      <div style=\"text-align:center;\">\n        <button class=\"common-btn\" onclick=\"gachaDraw(1)\">🎴 单抽 <span style=\"font-size:11px;opacity:0.8;\">(5💰)</span></button>\n        <button class=\"common-btn\" onclick=\"gachaDraw(10)\" style=\"background:linear-gradient(135deg,#a855f7,#8b5cf6);border-color:#a855f7;\">✨ 十连抽 <span style=\"font-size:11px;opacity:0.9;\">(40💰 省10)</span></button>\n        <button class=\"common-btn\" onclick=\"gachaReset()\">🔄 重置统计</button>\n      </div>\n      <div class=\"gacha-result-area\" id=\"gachaResult\"><div style=\"text-align:center;color:var(--text-placeholder);padding:30px;\">点击上方按钮开始抽卡</div></div>\n      <div class=\"gacha-stats\" id=\"gachaStats\">\n        <span>总抽数 <b id=\"gachaTotal\">0</b></span>\n        <span>SSR <b id=\"gachaSsr\">0</b></span>\n        <span>SR <b id=\"gachaSr\">0</b></span>\n        <span>R <b id=\"gachaR\">0</b></span>\n        <span>N <b id=\"gachaN\">0</b></span>\n      </div>\n      <div style=\"margin-top:12px;font-size:12px;color:var(--text-placeholder);text-align:center;\">概率：SSR 3% / SR 15% / R 60% / N 22%</div>\n    </div>\n  </div>");
// ==================== 百宝箱：抽卡模拟器 ====================
const GACHA_ICONS={ssr:'🌟',sr:'💎',r:'🔵',n:'⚪'};
const GACHA_NAMES={ssr:'SSR',sr:'SR',r:'R',n:'N'};
function gachaRoll(){
  const r=Math.random()*100;
  if(r<3)return 'ssr';
  if(r<18)return 'sr';
  if(r<78)return 'r';
  return 'n';
}
let gachaAnimating=false;
function gachaDraw(count){
  if(gachaAnimating)return;
  const cost=count===10?40:count*5;
  if(bpGetCoins()<cost){showToast('金币不足！抽'+count+'次需要'+cost+'金币');return;}
  bpSpendCoins(cost,'gacha');
  const results=[];
  for(let i=0;i<count;i++) results.push(gachaRoll());
  // 十连保底至少一个SR及以上
  if(count===10 && !results.some(r=>r==='ssr'||r==='sr')){
    results[Math.floor(Math.random()*10)]='sr';
  }
  gachaAnimating=true;
  const area=document.getElementById('gachaResult');
  area.innerHTML='<div class="gacha-cards">'+results.map((r,i)=>
    `<div class="gacha-card gacha-${r}" style="animation-delay:${i*0.08}s"><div class="g-icon">${GACHA_ICONS[r]}</div><div class="g-level">${GACHA_NAMES[r]}</div></div>`
  ).join('')+'</div>';
  // 更新统计
  const stats=lsGet('gacha_stats',{total:0,ssr:0,sr:0,r:0,n:0});
  results.forEach(r=>{stats.total++;stats[r]++;});
  lsSet('gacha_stats',stats);
  document.getElementById('gachaTotal').textContent=stats.total;
  document.getElementById('gachaSsr').textContent=stats.ssr;
  document.getElementById('gachaSr').textContent=stats.sr;
  document.getElementById('gachaR').textContent=stats.r;
  document.getElementById('gachaN').textContent=stats.n;
  // 保存卡牌到背包
  let cardNames=[];
  results.forEach(r=>{const name=bpAddCard(r);cardNames.push(name);});
  const ssrCount=results.filter(r=>r==='ssr').length;
  const srCount=results.filter(r=>r==='sr').length;
  if(ssrCount>0)showToast('🎉 抽到SSR！×'+ssrCount+' 已存入背包');
  else if(srCount>0)showToast('✨ 抽到SR！×'+srCount+' 已存入背包');
  else showToast('抽卡完成，'+count+'张卡牌已存入背包');
  setTimeout(()=>{gachaAnimating=false;},500);
  // 每日任务进度
  if(typeof updateDailyTask === 'function') updateDailyTask('daily_gacha', 1);
}
(function(){ const s=lsGet('gacha_stats',{total:0,ssr:0,sr:0,r:0,n:0});
  document.getElementById('gachaTotal').textContent=s.total;
  document.getElementById('gachaSsr').textContent=s.ssr;
  document.getElementById('gachaSr').textContent=s.sr;
  document.getElementById('gachaR').textContent=s.r;
  document.getElementById('gachaN').textContent=s.n;
})();
function gachaReset(){ lsSet('gacha_stats',{total:0,ssr:0,sr:0,r:0,n:0});
  ['gachaTotal','gachaSsr','gachaSr','gachaR','gachaN'].forEach(id=>document.getElementById(id).textContent='0');
  document.getElementById('gachaResult').innerHTML='<div style="text-align:center;color:var(--text-placeholder);padding:30px;">点击上方按钮开始抽卡</div>';
  showToast('统计已重置');
}

