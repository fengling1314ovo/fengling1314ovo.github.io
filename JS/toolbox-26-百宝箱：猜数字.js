/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageGuessPage", "<!-- pageGuessPage -->\n<div class=\"tool-page\" id=\"pageGuessPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔢 猜数字游戏</h3>\n      <div class=\"guess-area\">\n        <p style=\"font-size:14px;color:var(--text-secondary);\">我想了一个 1-100 之间的数字，来猜猜看吧！</p>\n        <div class=\"guess-input-row\">\n          <input id=\"guessInput\" type=\"number\" min=\"1\" max=\"100\" placeholder=\"输入1-100\" inputmode=\"numeric\" onkeydown=\"if(event.key==='Enter')guessSubmit()\">\n          <button class=\"common-btn\" id=\"guessSubmitBtn\" onclick=\"guessSubmit()\">猜！</button>\n          <button class=\"common-btn\" onclick=\"guessReset()\">🔄 重新开始</button>\n        </div>\n        <div class=\"guess-feedback\" id=\"guessFeedback\">等待你的猜测...</div>\n        <div style=\"font-size:14px;color:var(--text-secondary);\">已猜次数：<b id=\"guessCount\">0</b></div>\n        <div class=\"guess-history\" id=\"guessHistory\">\n          <div class=\"gh-empty\">暂无猜测记录</div>\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：猜数字 ====================
let guessTarget=0, guessCount=0, guessHistoryArr=[], guessGameOver=false;
function guessInit(){
  guessTarget=Math.floor(Math.random()*100)+1;
  guessCount=0;guessHistoryArr=[];guessGameOver=false;
  document.getElementById('guessCount').textContent='0';
  document.getElementById('guessFeedback').textContent='我想了一个 1-100 的数字，来猜猜看吧！';
  document.getElementById('guessFeedback').style.color='';
  document.getElementById('guessInput').value='';
  document.getElementById('guessSubmitBtn').disabled=false;
  document.getElementById('guessHistory').innerHTML='<div class="gh-empty">暂无猜测记录</div>';
}
guessInit();
function guessSubmit(){
  if(guessGameOver){showToast('游戏已结束，点击重新开始');return;}
  const val=Number(document.getElementById('guessInput').value);
  if(isNaN(val)||val<1||val>100){showToast('请输入1-100之间的数字');return;}
  guessCount++;
  document.getElementById('guessCount').textContent=guessCount;
  const fb=document.getElementById('guessFeedback');
  let hint='';
  if(val<guessTarget){hint='📈 太小了，往大了猜！';fb.style.color='#3b82f6';}
  else if(val>guessTarget){hint='📉 太大了，往小了猜！';fb.style.color='#f59e0b';}
  else{
    hint=`🎉 恭喜猜对了！答案就是 ${guessTarget}，用了 ${guessCount} 次！`;
    fb.style.color='#10b981';guessGameOver=true;
    document.getElementById('guessSubmitBtn').disabled=true;
    const guessReward=Math.max(5,25-guessCount*2);bpAddCoins(guessReward,'guess');showToast('🎉 猜对了！用了'+guessCount+'次，获得'+guessReward+'金币');
  }
  fb.textContent=hint;
  guessHistoryArr.unshift({num:val,hint:val===guessTarget?'✅ 正确':(val<guessTarget?'⬆️ 小了':'⬇️ 大了')});
  const histEl=document.getElementById('guessHistory');
  histEl.innerHTML=guessHistoryArr.map(h=>`<div class="gh-item">第${guessCount-guessHistoryArr.indexOf(h)}次：猜 ${h.num} → ${h.hint}</div>`).join('');
  document.getElementById('guessInput').value='';
  document.getElementById('guessInput').focus();
}
function guessReset(){ guessInit(); showToast('新游戏开始！'); }


