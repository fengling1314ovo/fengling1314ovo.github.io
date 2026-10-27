/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageBreakout", "<!-- pageBreakout -->\n<div class=\"tool-page\" id=\"pageBreakout\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🏓 打砖块</h3>\n      <div class=\"game-info\">\n        <span>分数 <b id=\"brkScore\">0</b></span>\n        <span>生命 <b id=\"brkLives\">3</b></span>\n      </div>\n      <div class=\"game-canvas-wrap\"><canvas id=\"brkCanvas\" class=\"game-canvas\" width=\"480\" height=\"360\"></canvas></div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"brkStart()\">▶️ 开始</button>\n      </div>\n      <p class=\"game-tip\">移动鼠标/手指控制挡板，弹球消掉所有砖块通关</p>\n    </div>\n  </div>");
// ==================== 打砖块 ====================
let brkCanvas,brkCtx,brkPaddle,brkBall,brkBricks,brkScore,brkLives,brkTimer,brkStarted,brkOver;
const BRK_COLS=8,BRK_ROWS=4,BRK_BW=50,BRK_BH=18,BRK_PAD_W=80,BRK_PAD_H=10,BRK_BALL_R=7;
function brkInit(){
  brkCanvas=document.getElementById('brkCanvas');
  brkCtx=brkCanvas.getContext('2d');
  brkScore=0;brkLives=3;brkStarted=false;brkOver=false;
  document.getElementById('brkScore').textContent='0';
  document.getElementById('brkLives').textContent='3';
  brkReset();brkDraw();
}
function brkReset(){
  brkPaddle={x:brkCanvas.width/2-BRK_PAD_W/2,y:brkCanvas.height-25,w:BRK_PAD_W,h:BRK_PAD_H};
  brkBall={x:brkCanvas.width/2,y:brkCanvas.height-40,dx:3,dy:-3,r:BRK_BALL_R};
  brkBricks=[];
  const colors=['#e74c3c','#e67e22','#f1c40f','#2ecc71'];
  for(let r=0;r<BRK_ROWS;r++)for(let c=0;c<BRK_COLS;c++){
    brkBricks.push({x:20+c*(BRK_BW+6),y:40+r*(BRK_BH+6),w:BRK_BW,h:BRK_BH,color:colors[r],alive:true});
  }
}
function brkDraw(){
  brkCtx.fillStyle='#1a1a2e';brkCtx.fillRect(0,0,brkCanvas.width,brkCanvas.height);
  brkBricks.forEach(function(b){if(b.alive){brkCtx.fillStyle=b.color;brkCtx.fillRect(b.x,b.y,b.w,b.h);brkCtx.strokeStyle='rgba(255,255,255,0.3)';brkCtx.strokeRect(b.x,b.y,b.w,b.h);}});
  brkCtx.fillStyle='#00bcd4';brkCtx.fillRect(brkPaddle.x,brkPaddle.y,brkPaddle.w,brkPaddle.h);
  brkCtx.beginPath();brkCtx.arc(brkBall.x,brkBall.y,brkBall.r,0,Math.PI*2);brkCtx.fillStyle='#fff';brkCtx.fill();
  if(brkOver){
    brkCtx.fillStyle='rgba(0,0,0,0.7)';brkCtx.fillRect(0,0,brkCanvas.width,brkCanvas.height);
    brkCtx.fillStyle='#fff';brkCtx.font='bold 22px sans-serif';brkCtx.textAlign='center';
    brkCtx.fillText(brkBricks.every(function(b){return !b.alive;})?'通关！':'游戏结束',brkCanvas.width/2,brkCanvas.height/2-10);
    brkCtx.font='14px sans-serif';brkCtx.fillText('得分 '+brkScore,brkCanvas.width/2,brkCanvas.height/2+20);
  }
}
function brkUpdate(){
  if(brkOver)return;
  brkBall.x+=brkBall.dx;brkBall.y+=brkBall.dy;
  if(brkBall.x<brkBall.r||brkBall.x>brkCanvas.width-brkBall.r)brkBall.dx*=-1;
  if(brkBall.y<brkBall.r)brkBall.dy*=-1;
  if(brkBall.y+brkBall.r>=brkPaddle.y&&brkBall.x>=brkPaddle.x&&brkBall.x<=brkPaddle.x+brkPaddle.w&&brkBall.dy>0){
    brkBall.dy*=-1;
    const hit=(brkBall.x-(brkPaddle.x+brkPaddle.w/2))/(brkPaddle.w/2);
    brkBall.dx=hit*5;
  }
  if(brkBall.y>brkCanvas.height){
    brkLives--;
    document.getElementById('brkLives').textContent=brkLives;
    if(brkLives<=0){brkGameOver(false);return;}
    brkBall={x:brkCanvas.width/2,y:brkCanvas.height-40,dx:3,dy:-3,r:BRK_BALL_R};
  }
  brkBricks.forEach(function(b){
    if(b.alive&&brkBall.x+brkBall.r>b.x&&brkBall.x-brkBall.r<b.x+b.w&&brkBall.y+brkBall.r>b.y&&brkBall.y-brkBall.r<b.y+b.h){
      b.alive=false;brkBall.dy*=-1;brkScore+=10;
      document.getElementById('brkScore').textContent=brkScore;
    }
  });
  if(brkBricks.every(function(b){return !b.alive;})){brkGameOver(true);return;}
  brkDraw();
}
function brkStart(){
  if(brkTimer)clearInterval(brkTimer);
  brkInit();brkStarted=true;
  brkTimer=setInterval(brkUpdate,16);
}
function brkGameOver(win){
  brkOver=true;brkStarted=false;clearInterval(brkTimer);brkDraw();
  const reward=Math.max(5,Math.floor(brkScore/20))+(win?20:0);
  bpAddCoins(reward,'打砖块');
  showToast((win?'通关！':'游戏结束！')+'得分'+brkScore+'，获得'+reward+'金币');
}
document.addEventListener('mousemove',function(e){
  if(!pageBreakout||pageBreakout.style.display!=='block'||!brkStarted||brkOver)return;
  const rect=brkCanvas.getBoundingClientRect();
  const x=e.clientX-rect.left;
  brkPaddle.x=Math.max(0,Math.min(brkCanvas.width-brkPaddle.w,x-brkPaddle.w/2));
});
document.addEventListener('touchmove',function(e){
  if(!pageBreakout||pageBreakout.style.display!=='block'||!brkStarted||brkOver)return;
  const rect=brkCanvas.getBoundingClientRect();
  const x=e.touches[0].clientX-rect.left;
  brkPaddle.x=Math.max(0,Math.min(brkCanvas.width-brkPaddle.w,x-brkPaddle.w/2));
},{passive:true});

