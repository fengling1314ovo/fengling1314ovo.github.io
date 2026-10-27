/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagememoryPage", "<!-- pagememoryPage -->\n<div class=\"tool-page\" id=\"pagememoryPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🃏 记忆翻牌</h3>\n      <div class=\"game-info\">\n        <span>步数 <b id=\"memMoves\">0</b></span>\n        <span>配对 <b id=\"memPairs\">0</b>/8</span>\n        <span>用时 <b id=\"memTime\">0</b>s</span>\n      </div>\n      <div class=\"memory-grid\" id=\"memGrid\"></div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"memNew()\">🔄 新游戏</button>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：记忆翻牌 ====================
const MEM_EMOJIS=['🍎','🍌','🍇','🍓','🍊','🍉','🍑','🥝'];
let memCards=[],memFlipped=[],memMatched=0,memMoves=0,memTimer=null,memSeconds=0,memLock=false;
function memNew(){
  memCards=[...MEM_EMOJIS,...MEM_EMOJIS].sort(()=>Math.random()-0.5);
  memFlipped=[];memMatched=0;memMoves=0;memSeconds=0;memLock=false;
  if(memTimer)clearInterval(memTimer);
  memTimer=setInterval(()=>{memSeconds++;document.getElementById('memTime').textContent=memSeconds;},1000);
  document.getElementById('memMoves').textContent='0';
  document.getElementById('memPairs').textContent='0';
  document.getElementById('memTime').textContent='0';
  const grid=document.getElementById('memGrid');
  grid.innerHTML='';
  memCards.forEach((emoji,i)=>{
    const card=document.createElement('div');
    card.className='memory-card';card.dataset.index=i;card.textContent='?';
    card.onclick=()=>memFlip(i,card);
    grid.appendChild(card);
  });
}
function memFlip(i,card){
  if(memLock||card.classList.contains('flipped')||card.classList.contains('matched'))return;
  card.classList.add('flipped');card.textContent=memCards[i];
  memFlipped.push({i,card});
  if(memFlipped.length===2){
    memMoves++;document.getElementById('memMoves').textContent=memMoves;
    if(memFlipped[0].card.textContent===memFlipped[1].card.textContent){
      memFlipped.forEach(f=>f.card.classList.add('matched'));
      memMatched++;document.getElementById('memPairs').textContent=memMatched;
      memFlipped=[];
      if(memMatched===8){clearInterval(memTimer);const memReward=Math.max(5,30-memMoves);bpAddCoins(memReward,'memory');showToast('🎉 完成！用了'+memMoves+'步，获得'+memReward+'金币');}
    }else{
      memLock=true;
      setTimeout(()=>{
        memFlipped.forEach(f=>{f.card.classList.remove('flipped');f.card.textContent='?';});
        memFlipped=[];memLock=false;
      },800);
    }
  }
}
memNew();

