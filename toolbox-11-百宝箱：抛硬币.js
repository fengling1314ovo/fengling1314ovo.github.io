/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
/* 抛硬币页面专属样式与动画。 */
(function installCoinPageStyles(){
  if(document.getElementById("flCoinPageStyles")) return;
  /* Styles moved to css/toolbox-11-百宝箱：抛硬币.css. */
})();
window.flRegisterToolPage("pageCoinPage", "<!-- pageCoinPage -->\n<div class=\"tool-page\" id=\"pageCoinPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🪙 抛硬币</h3>\n      <div class=\"coin-area\">\n        <div class=\"coin\" id=\"coinEl\">?</div>\n        <button class=\"common-btn\" id=\"coinFlipBtn\" onclick=\"flipCoin()\">🪙 抛一次硬币</button>\n        <button class=\"common-btn\" onclick=\"resetCoinStats()\">🔄 重置统计</button>\n      </div>\n      <div class=\"coin-stats\">\n        <span>正面 <b id=\"coinHeads\">0</b></span>\n        <span>反面 <b id=\"coinTails\">0</b></span>\n        <span>总次数 <b id=\"coinTotal\">0</b></span>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：抛硬币 ====================
const coinEl=document.getElementById('coinEl'), coinHeadsEl=document.getElementById('coinHeads'),
  coinTailsEl=document.getElementById('coinTails'), coinTotalEl=document.getElementById('coinTotal');
let coinStats=lsGet('coin_stats',{heads:0,tails:0});
function updateCoinStats(){ coinHeadsEl.textContent=coinStats.heads; coinTailsEl.textContent=coinStats.tails; coinTotalEl.textContent=coinStats.heads+coinStats.tails; }
updateCoinStats();
let coinFlipping=false;
function flipCoin(){
  if(coinFlipping)return;
  coinFlipping=true;
  coinEl.classList.add('flipping');
  coinEl.textContent='?';
  setTimeout(()=>{
    const isHeads=Math.random()>0.5;
    coinEl.textContent=isHeads?'正':'反';
    if(isHeads)coinStats.heads++; else coinStats.tails++;
    lsSet('coin_stats',coinStats);
    updateCoinStats();
    coinEl.classList.remove('flipping');
    coinFlipping=false;
    showToast(isHeads?'🪙 正面！':'🪙 反面！');
  },800);
}
function resetCoinStats(){ coinStats={heads:0,tails:0}; lsSet('coin_stats',coinStats); updateCoinStats(); showToast('统计已重置'); }

