/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageSlotPage", "<!-- pageSlotPage -->\n<div class=\"tool-page\" id=\"pageSlotPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎰 老虎机</h3>\n      <div class=\"slot-area\">\n        <div class=\"slot-info\">\n          <span>💰 金币 <b id=\"slotCoins\">100</b></span>\n          <span>🏆 累计赢取 <b id=\"slotWon\">0</b></span>\n        </div>\n        <div class=\"slot-machine\">\n          <div class=\"slot-reel\" id=\"slotReel1\">🍒</div>\n          <div class=\"slot-reel\" id=\"slotReel2\">🍋</div>\n          <div class=\"slot-reel\" id=\"slotReel3\">🍊</div>\n        </div>\n        <div class=\"slot-result\" id=\"slotResult\">下注后点击开始</div>\n        <div class=\"slot-bet-row\">\n          <label style=\"font-size:13px;color:var(--text-secondary);\">下注：</label>\n          <input id=\"slotBet\" type=\"number\" value=\"10\" min=\"1\" max=\"1000\" inputmode=\"numeric\">\n          <button class=\"common-btn\" id=\"slotStartBtn\" onclick=\"slotSpin()\">🎰 开始</button>\n          <button class=\"common-btn\" onclick=\"slotReset()\">🔄 重置</button>\n        </div>\n        <div style=\"font-size:12px;color:var(--text-placeholder);margin-top:8px;\">三个相同=10倍下注 / 两个相同=2倍下注 / 777=50倍</div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：老虎机 ====================
const SLOT_SYMBOLS=['🍒','🍋','🍊','🍇','🍉','⭐','🔔','7️⃣'];
let slotCoins=lsGet('slot_coins',100);
let slotWon=lsGet('slot_won',0);
let slotSpinning=false;
function slotUpdateUI(){
  document.getElementById('slotCoins').textContent=bpGetCoins();
  document.getElementById('slotWon').textContent=slotWon;
}
slotUpdateUI();
function slotSpin(){
  if(slotSpinning)return;
  const bet=Math.max(1,Number(document.getElementById('slotBet').value)||10);
  if(bet>bpGetCoins()){showToast('金币不足！');return;}
  bpSpendCoins(bet,'slot');slotUpdateUI();
  slotSpinning=true;
  document.getElementById('slotStartBtn').disabled=true;
  document.getElementById('slotResult').textContent='旋转中...';
  const reels=[document.getElementById('slotReel1'),document.getElementById('slotReel2'),document.getElementById('slotReel3')];
  reels.forEach(r=>r.classList.add('spinning'));
  const results=[];
  for(let i=0;i<3;i++)results.push(SLOT_SYMBOLS[Math.floor(Math.random()*SLOT_SYMBOLS.length)]);
  // 依次停止
  setTimeout(()=>{reels[0].classList.remove('spinning');reels[0].textContent=results[0];},500);
  setTimeout(()=>{reels[1].classList.remove('spinning');reels[1].textContent=results[1];},900);
  setTimeout(()=>{
    reels[2].classList.remove('spinning');reels[2].textContent=results[2];
    let win=0,msg='';
    if(results[0]==='7️⃣'&&results[1]==='7️⃣'&&results[2]==='7️⃣'){win=bet*50;msg='🎉 JACKPOT! 777 大奖！';}
    else if(results[0]===results[1]&&results[1]===results[2]){win=bet*10;msg='🎉 三个相同！10倍奖励！';}
    else if(results[0]===results[1]||results[1]===results[2]||results[0]===results[2]){win=bet*2;msg='✨ 两个相同！2倍奖励！';}
    else{msg='😢 未中奖，再接再厉！';}
    if(win>0){slotWon+=win;lsSet('slot_won',slotWon);bpAddCoins(win,'slot');slotUpdateUI();}
    document.getElementById('slotResult').textContent=msg+(win>0?(' +'+win+'金币'):'');
    document.getElementById('slotStartBtn').disabled=false;
    slotSpinning=false;
    if(win>0)showToast(msg);
  },1300);
}
function slotReset(){ bpSetCoins(100);slotWon=0;lsSet('slot_won',0);slotUpdateUI();
  document.getElementById('slotResult').textContent='下注后点击开始';
  ['slotReel1','slotReel2','slotReel3'].forEach((id,i)=>document.getElementById(id).textContent=SLOT_SYMBOLS[i]);
  showToast('老虎机已重置');
}

