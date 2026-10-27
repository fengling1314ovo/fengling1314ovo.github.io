/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagewhackPage", "<!-- pagewhackPage -->\n<div class=\"tool-page\" id=\"pagewhackPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔨 打地鼠</h3>\n      <div class=\"game-info\">\n        <span>分数 <b id=\"whackScore\">0</b></span>\n        <span>时间 <b id=\"whackTime\">30</b>s</span>\n        <span>最高分 <b id=\"whackBest\">0</b></span>\n      </div>\n      <div class=\"whack-grid\" id=\"whackGrid\"></div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" id=\"whackStartBtn\" onclick=\"whackStart()\">▶️ 开始游戏</button>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：打地鼠 ====================
let whackScore=0,whackTime=30,whackTimer=null,whackMoleInt=null,whackBest=lsGet('whack_best',0);
function whackInit(){
  const grid=document.getElementById('whackGrid');
  grid.innerHTML='';
  for(let i=0;i<9;i++){
    const hole=document.createElement('div');
    hole.className='whack-hole';hole.id='whack'+i;hole.textContent='';
    hole.onclick=()=>whackHit(i);
    grid.appendChild(hole);
  }
  document.getElementById('whackBest').textContent=whackBest;
}
function whackStart(){
  whackScore=0;whackTime=30;
  document.getElementById('whackScore').textContent='0';
  document.getElementById('whackTime').textContent='30';
  document.getElementById('whackStartBtn').textContent='🔄 重新开始';
  if(whackTimer)clearInterval(whackTimer);
  if(whackMoleInt)clearInterval(whackMoleInt);
  whackTimer=setInterval(()=>{
    whackTime--;document.getElementById('whackTime').textContent=whackTime;
    if(whackTime<=0)whackEnd();
  },1000);
  whackMoleInt=setInterval(whackShowMole,700);
}
function whackShowMole(){
  document.querySelectorAll('.whack-hole').forEach(h=>{h.classList.remove('has-mole');h.textContent='';});
  const idx=Math.floor(Math.random()*9);
  const hole=document.getElementById('whack'+idx);
  hole.classList.add('has-mole');hole.textContent='🐹';
}
function whackHit(i){
  const hole=document.getElementById('whack'+i);
  if(hole.classList.contains('has-mole')){
    whackScore+=10;document.getElementById('whackScore').textContent=whackScore;
    hole.classList.remove('has-mole');hole.textContent='💥';
    setTimeout(()=>{if(hole.textContent==='💥')hole.textContent='';},200);
  }
}
function whackEnd(){
  clearInterval(whackTimer);clearInterval(whackMoleInt);
  document.querySelectorAll('.whack-hole').forEach(h=>{h.classList.remove('has-mole');h.textContent='';});
  if(whackScore>whackBest){whackBest=whackScore;lsSet('whack_best',whackBest);document.getElementById('whackBest').textContent=whackBest;}
  const whackReward=Math.max(5,whackScore);bpAddCoins(whackReward,'whack');showToast('游戏结束！得分'+whackScore+'，获得'+whackReward+'金币');
}
whackInit();

