/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageDicePage", "<!-- pageDicePage -->\n<div class=\"tool-page\" id=\"pageDicePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎲 掷骰子模拟器</h3>\n      <label>骰子面数(D4/D6/D8/D10/D12/D20)</label>\n      <input id=\"diceSides\" type=\"number\" value=\"6\" min=\"2\" max=\"100\" inputmode=\"numeric\">\n      <label>骰子颗数</label>\n      <input id=\"diceCount\" type=\"number\" value=\"1\" min=\"1\" max=\"30\" inputmode=\"numeric\">\n      <br>\n      <button class=\"common-btn\" id=\"diceRollBtn\" onclick=\"rollDice()\">🎲 掷骰子</button>\n      <button class=\"common-btn\" onclick=\"copyDiceResult()\">📋 复制结果</button>\n      <button class=\"common-btn\" onclick=\"clearDiceHistory()\">🗑 清空历史</button>\n      <div id=\"diceResult\" style=\"margin-top:10px;font-size:17px;font-weight:600;min-height:24px;\"></div>\n      <div class=\"history-list\" id=\"diceHistory\">\n        <div class=\"history-empty\">暂无投掷记录</div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：掷骰子 ====================
const diceSidesEl=document.getElementById('diceSides'), diceCountEl=document.getElementById('diceCount'),
  diceResultEl=document.getElementById('diceResult'), diceHistoryEl=document.getElementById('diceHistory');
// 恢复输入状态
(function(){ const s=lsGet('dice_sides',6), c=lsGet('dice_count',1); diceSidesEl.value=s; diceCountEl.value=c; })();
diceSidesEl.addEventListener('change',()=>lsSet('dice_sides',Number(diceSidesEl.value)||6));
diceCountEl.addEventListener('change',()=>lsSet('dice_count',Number(diceCountEl.value)||1));

let diceRolling=false;
function rollDice(){
  if(diceRolling)return;
  const sides=Number(diceSidesEl.value), cnt=Number(diceCountEl.value);
  if(!sides||sides<2||sides>100){ showToast('骰子面数范围2-100'); return; }
  if(!cnt||cnt<1||cnt>30){ showToast('骰子颗数范围1-30'); return; }
  diceRolling=true;
  const btn=document.getElementById('diceRollBtn'); btn.disabled=true;
  let ticks=0;
  const anim=setInterval(()=>{
    let res=[]; for(let i=0;i<cnt;i++) res.push(Math.floor(Math.random()*sides)+1);
    diceResultEl.textContent='🎲 投掷中… '+res.join(', ');
    ticks++;
    if(ticks>=8){
      clearInterval(anim);
      let res=[]; let sum=0; for(let i=0;i<cnt;i++){ const n=Math.floor(Math.random()*sides)+1; res.push(n); sum+=n; }
      const text=`点数：${res.join(', ')} ｜总和：${sum}`;
      diceResultEl.textContent=text;
      // 保存历史
      let hist=lsGet('dice_history',[]);
      hist.unshift({text:text,time:nowTimeStr()});
      if(hist.length>20)hist.length=20;
      lsSet('dice_history',hist); renderDiceHistory();
      diceRolling=false; btn.disabled=false;
    }
  },60);
}
function renderDiceHistory(){
  const hist=lsGet('dice_history',[]);
  if(!hist.length){ diceHistoryEl.innerHTML='<div class="history-empty">暂无投掷记录</div>'; return; }
  diceHistoryEl.innerHTML=hist.map(h=>`<div class="h-item"><span>${h.text}</span><span class="h-time">${h.time}</span></div>`).join('');
}
renderDiceHistory();
function copyDiceResult(){ if(!diceResultEl.textContent||diceResultEl.textContent.includes('投掷中')){ showToast('暂无结果可复制'); return; } copyText(diceResultEl.textContent).then(ok=>showToast(ok?'已复制结果':'复制失败')); }
function clearDiceHistory(){ lsSet('dice_history',[]); renderDiceHistory(); showToast('历史已清空'); }

