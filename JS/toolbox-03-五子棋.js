/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageGomoku", "<!-- pageGomoku -->\n<div class=\"tool-page\" id=\"pageGomoku\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>⚫ 五子棋</h3>\n      <div class=\"game-info\">\n        <span>你执 <b style=\"color:#000;\">●黑</b></span>\n        <span>AI 执 <b style=\"color:#fff;text-shadow:0 0 1px #333;\">○白</b></span>\n      </div>\n      <div class=\"game-canvas-wrap\"><canvas id=\"gomokuCanvas\" class=\"game-canvas\" width=\"450\" height=\"450\" onclick=\"gomokuClick(event)\"></canvas></div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"gomokuStart()\">🔄 新游戏</button>\n      </div>\n      <p class=\"game-tip\">点击棋盘交叉点落子，五子连珠获胜</p>\n    </div>\n  </div>");
// ==================== 五子棋 ====================
const GOMOKU_N=15, GOMOKU_SIZE=30;
let gomokuBoard, gomokuOver, gomokuTurn, gomokuTouchBound=false;
function gomokuInit(){
  gomokuBoard=Array.from({length:GOMOKU_N},()=>Array(GOMOKU_N).fill(0));
  gomokuOver=false;gomokuTurn=1;
  gomokuDraw();
  if(!gomokuTouchBound){
    const cv=document.getElementById('gomokuCanvas');
    if(cv){
      cv.addEventListener('touchend',function(e){
        e.preventDefault();e.stopPropagation();
        const t=e.changedTouches[0];
        gomokuHandlePoint(t.clientX,t.clientY);
      },{passive:false});
      gomokuTouchBound=true;
    }
  }
}
function gomokuDraw(){
  const cv=document.getElementById('gomokuCanvas');
  const ctx=cv.getContext('2d');
  ctx.fillStyle='#deb887';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.strokeStyle='#8b4513';
  for(let i=0;i<GOMOKU_N;i++){
    ctx.beginPath();ctx.moveTo(GOMOKU_SIZE/2+i*GOMOKU_SIZE,GOMOKU_SIZE/2);ctx.lineTo(GOMOKU_SIZE/2+i*GOMOKU_SIZE,cv.height-GOMOKU_SIZE/2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(GOMOKU_SIZE/2,GOMOKU_SIZE/2+i*GOMOKU_SIZE);ctx.lineTo(cv.width-GOMOKU_SIZE/2,GOMOKU_SIZE/2+i*GOMOKU_SIZE);ctx.stroke();
  }
  ctx.fillStyle='#8b4513';
  [[3,3],[3,11],[11,3],[11,11],[7,7]].forEach(function(p){ctx.beginPath();ctx.arc(GOMOKU_SIZE/2+p[1]*GOMOKU_SIZE,GOMOKU_SIZE/2+p[0]*GOMOKU_SIZE,4,0,Math.PI*2);ctx.fill();});
  for(let r=0;r<GOMOKU_N;r++)for(let c=0;c<GOMOKU_N;c++){
    if(gomokuBoard[r][c]){
      ctx.beginPath();ctx.arc(GOMOKU_SIZE/2+c*GOMOKU_SIZE,GOMOKU_SIZE/2+r*GOMOKU_SIZE,GOMOKU_SIZE/2-3,0,Math.PI*2);
      ctx.fillStyle=gomokuBoard[r][c]===1?'#000':'#fff';ctx.fill();ctx.strokeStyle='#333';ctx.stroke();
    }
  }
  if(gomokuOver){
    ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(0,0,cv.width,cv.height);
    ctx.fillStyle='#fff';ctx.font='bold 22px sans-serif';ctx.textAlign='center';
    ctx.fillText(gomokuTurn===1?'你赢了！':'AI 获胜',cv.width/2,cv.height/2);
  }
}
function gomokuClick(e){
  gomokuHandlePoint(e.clientX,e.clientY);
}
function gomokuHandlePoint(clientX,clientY){
  if(gomokuOver||gomokuTurn!==1)return;
  const cv=document.getElementById('gomokuCanvas');
  const rect=cv.getBoundingClientRect();
  const scaleX=cv.width/rect.width;
  const scaleY=cv.height/rect.height;
  const x=(clientX-rect.left)*scaleX;
  const y=(clientY-rect.top)*scaleY;
  const c=Math.round((x-GOMOKU_SIZE/2)/GOMOKU_SIZE);
  const r=Math.round((y-GOMOKU_SIZE/2)/GOMOKU_SIZE);
  if(r<0||r>=GOMOKU_N||c<0||c>=GOMOKU_N||gomokuBoard[r][c])return;
  gomokuBoard[r][c]=1;
  if(gomokuCheck(r,c,1)){gomokuOver=true;gomokuDraw();bpAddCoins(30,'五子棋');showToast('五子连珠！获得30金币');return;}
  gomokuTurn=2;gomokuDraw();
  setTimeout(gomokuAI,300);
}
function gomokuCheck(r,c,player){
  const dirs=[[0,1],[1,0],[1,1],[1,-1]];
  for(const d of dirs){
    let count=1;
    for(let i=1;i<5;i++){const nr=r+d[0]*i,nc=c+d[1]*i;if(nr<0||nr>=GOMOKU_N||nc<0||nc>=GOMOKU_N||gomokuBoard[nr][nc]!==player)break;count++;}
    for(let i=1;i<5;i++){const nr=r-d[0]*i,nc=c-d[1]*i;if(nr<0||nr>=GOMOKU_N||nc<0||nc>=GOMOKU_N||gomokuBoard[nr][nc]!==player)break;count++;}
    if(count>=5)return true;
  }
  return false;
}
function gomokuEval(r,c,player){
  const dirs=[[0,1],[1,0],[1,1],[1,-1]];
  let total=0;
  for(const d of dirs){
    let count=1,blocked=0;
    for(let i=1;i<5;i++){const nr=r+d[0]*i,nc=c+d[1]*i;if(nr<0||nr>=GOMOKU_N||nc<0||nc>=GOMOKU_N){blocked++;break;}if(gomokuBoard[nr][nc]===player)count++;else if(gomokuBoard[nr][nc]!==0){blocked++;break;}else break;}
    for(let i=1;i<5;i++){const nr=r-d[0]*i,nc=c-d[1]*i;if(nr<0||nr>=GOMOKU_N||nc<0||nc>=GOMOKU_N){blocked++;break;}if(gomokuBoard[nr][nc]===player)count++;else if(gomokuBoard[nr][nc]!==0){blocked++;break;}else break;}
    if(count>=5)total+=100000;
    else if(count===4&&blocked===0)total+=10000;
    else if(count===4&&blocked===1)total+=1000;
    else if(count===3&&blocked===0)total+=500;
    else if(count===3&&blocked===1)total+=100;
    else if(count===2&&blocked===0)total+=50;
    else total+=count*5;
  }
  return total;
}
function gomokuAI(){
  if(gomokuOver)return;
  let best=-1,bestR=7,bestC=7;
  for(let r=0;r<GOMOKU_N;r++)for(let c=0;c<GOMOKU_N;c++){
    if(gomokuBoard[r][c])continue;
    let hasNeighbor=false;
    for(let dr=-2;dr<=2;dr++)for(let dc=-2;dc<=2;dc++){const nr=r+dr,nc=c+dc;if(nr>=0&&nr<GOMOKU_N&&nc>=0&&nc<GOMOKU_N&&gomokuBoard[nr][nc])hasNeighbor=true;}
    if(!hasNeighbor&&!(r===7&&c===7))continue;
    const score=gomokuEval(r,c,2)+gomokuEval(r,c,1)*0.9;
    if(score>best){best=score;bestR=r;bestC=c;}
  }
  gomokuBoard[bestR][bestC]=2;
  if(gomokuCheck(bestR,bestC,2)){gomokuOver=true;gomokuTurn=2;gomokuDraw();showToast('AI 五子连珠，你输了');return;}
  gomokuTurn=1;gomokuDraw();
}
function gomokuStart(){gomokuInit();}

