/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageTetris", "<!-- pageTetris -->\n<div class=\"tool-page\" id=\"pageTetris\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🧱 俄罗斯方块</h3>\n      <div class=\"game-info\">\n        <span>分数 <b id=\"tetScore\">0</b></span>\n        <span>消行 <b id=\"tetLines\">0</b></span>\n        <span>等级 <b id=\"tetLevel\">1</b></span>\n      </div>\n      <div class=\"game-canvas-wrap\"><canvas id=\"tetCanvas\" class=\"game-canvas\" width=\"300\" height=\"600\"></canvas></div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"tetStart()\">▶️ 开始</button>\n        <button class=\"common-btn\" onclick=\"tetMove(-1)\">⬅️ 左</button>\n        <button class=\"common-btn\" onclick=\"tetRotate()\">🔄 旋转</button>\n        <button class=\"common-btn\" onclick=\"tetMove(1)\">➡️ 右</button>\n        <button class=\"common-btn\" onclick=\"tetHardDrop()\">⬇️ 直落</button>\n      </div>\n      <p class=\"game-tip\">键盘：←→移动，↑旋转，↓加速，空格直落</p>\n    </div>\n  </div>");
// ==================== 俄罗斯方块 ====================
const TET_COLS=10, TET_ROWS=20, TET_SIZE=30;
const TET_SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]]];
const TET_COLORS=['#00bcd4','#ffeb3b','#9c27b0','#4caf50','#f44336','#2196f3','#ff9800'];
let tetBoard, tetCur, tetScore, tetLines, tetLevel, tetTimer, tetOver, tetStarted;
function tetInit(){
  tetBoard=Array.from({length:TET_ROWS},()=>Array(TET_COLS).fill(0));
  tetScore=0;tetLines=0;tetLevel=1;tetOver=false;tetStarted=false;
  document.getElementById('tetScore').textContent='0';
  document.getElementById('tetLines').textContent='0';
  document.getElementById('tetLevel').textContent='1';
  tetDraw();
}
function tetNewPiece(){
  const i=Math.floor(Math.random()*TET_SHAPES.length);
  const shape=TET_SHAPES[i].map(r=>r.slice());
  tetCur={shape,color:TET_COLORS[i],x:Math.floor((TET_COLS-shape[0].length)/2),y:0};
  if(tetCollide(tetCur.shape,tetCur.x,tetCur.y)) tetGameOver();
}
function tetCollide(shape,x,y){
  for(let r=0;r<shape.length;r++)for(let c=0;c<shape[r].length;c++){
    if(!shape[r][c])continue;
    const nx=x+c,ny=y+r;
    if(nx<0||nx>=TET_COLS||ny>=TET_ROWS)return true;
    if(ny>=0&&tetBoard[ny][nx])return true;
  }
  return false;
}
function tetRotate(){
  if(tetOver||!tetStarted)return;
  const s=tetCur.shape;
  const rotated=s[0].map((_,i)=>s.map(r=>r[i]).reverse());
  if(!tetCollide(rotated,tetCur.x,tetCur.y)) tetCur.shape=rotated;
  else if(!tetCollide(rotated,tetCur.x-1,tetCur.y)){tetCur.shape=rotated;tetCur.x--;}
  else if(!tetCollide(rotated,tetCur.x+1,tetCur.y)){tetCur.shape=rotated;tetCur.x++;}
  tetDraw();
}
function tetMove(dx){
  if(tetOver||!tetStarted)return;
  if(!tetCollide(tetCur.shape,tetCur.x+dx,tetCur.y)){tetCur.x+=dx;tetDraw();}
}
function tetDrop(){
  if(tetOver||!tetStarted)return;
  if(!tetCollide(tetCur.shape,tetCur.x,tetCur.y+1)){tetCur.y++;tetDraw();}
  else tetLock();
}
function tetHardDrop(){
  if(tetOver||!tetStarted)return;
  while(!tetCollide(tetCur.shape,tetCur.x,tetCur.y+1))tetCur.y++;
  tetLock();
}
function tetLock(){
  for(let r=0;r<tetCur.shape.length;r++)for(let c=0;c<tetCur.shape[r].length;c++){
    if(tetCur.shape[r][c]&&tetCur.y+r>=0) tetBoard[tetCur.y+r][tetCur.x+c]=tetCur.color;
  }
  tetClearLines();
  tetNewPiece();
  tetDraw();
}
function tetClearLines(){
  let cleared=0;
  for(let r=TET_ROWS-1;r>=0;r--){
    if(tetBoard[r].every(v=>v)){
      tetBoard.splice(r,1);
      tetBoard.unshift(Array(TET_COLS).fill(0));
      cleared++;r++;
    }
  }
  if(cleared>0){
    const points=[0,100,300,500,800];
    tetScore+=points[cleared]*tetLevel;
    tetLines+=cleared;
    tetLevel=Math.floor(tetLines/10)+1;
    document.getElementById('tetScore').textContent=tetScore;
    document.getElementById('tetLines').textContent=tetLines;
    document.getElementById('tetLevel').textContent=tetLevel;
    clearInterval(tetTimer);
    tetTimer=setInterval(tetDrop,Math.max(100,800-(tetLevel-1)*70));
  }
}
function tetDraw(){
  const cv=document.getElementById('tetCanvas');
  const ctx=cv.getContext('2d');
  ctx.fillStyle='#1a1a2e';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.strokeStyle='rgba(255,255,255,0.05)';
  for(let r=0;r<=TET_ROWS;r++){ctx.beginPath();ctx.moveTo(0,r*TET_SIZE);ctx.lineTo(TET_COLS*TET_SIZE,r*TET_SIZE);ctx.stroke();}
  for(let c=0;c<=TET_COLS;c++){ctx.beginPath();ctx.moveTo(c*TET_SIZE,0);ctx.lineTo(c*TET_SIZE,TET_ROWS*TET_SIZE);ctx.stroke();}
  for(let r=0;r<TET_ROWS;r++)for(let c=0;c<TET_COLS;c++){
    if(tetBoard[r][c]){ctx.fillStyle=tetBoard[r][c];ctx.fillRect(c*TET_SIZE+1,r*TET_SIZE+1,TET_SIZE-2,TET_SIZE-2);}
  }
  if(tetCur&&tetStarted){
    ctx.fillStyle=tetCur.color;
    for(let r=0;r<tetCur.shape.length;r++)for(let c=0;c<tetCur.shape[r].length;c++){
      if(tetCur.shape[r][c]&&tetCur.y+r>=0) ctx.fillRect((tetCur.x+c)*TET_SIZE+1,(tetCur.y+r)*TET_SIZE+1,TET_SIZE-2,TET_SIZE-2);
    }
  }
  if(tetOver){
    ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#fff';ctx.font='bold 24px sans-serif';ctx.textAlign='center';
    ctx.fillText('游戏结束',cv.width/2,cv.height/2-10);
    ctx.font='14px sans-serif';ctx.fillText('得分 '+tetScore,cv.width/2,cv.height/2+20);
  }
}
function tetStart(){
  if(tetTimer)clearInterval(tetTimer);
  tetInit();tetStarted=true;tetNewPiece();
  tetTimer=setInterval(tetDrop,800);
  tetDraw();
}
function tetGameOver(){
  tetOver=true;tetStarted=false;clearInterval(tetTimer);tetDraw();
  const reward=Math.max(5,Math.floor(tetScore/50));
  bpAddCoins(reward,'俄罗斯方块');
  showToast('游戏结束！得分'+tetScore+'，获得'+reward+'金币');
}
document.addEventListener('keydown',function(e){
  if(!pageTetris||pageTetris.style.display!=='block')return;
  if(e.key==='ArrowLeft'){e.preventDefault();tetMove(-1);}
  else if(e.key==='ArrowRight'){e.preventDefault();tetMove(1);}
  else if(e.key==='ArrowDown'){e.preventDefault();tetDrop();}
  else if(e.key==='ArrowUp'){e.preventDefault();tetRotate();}
  else if(e.key===' '){e.preventDefault();tetHardDrop();}
});

