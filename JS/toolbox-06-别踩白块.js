/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePiano", "<!-- pagePiano -->\n<div class=\"tool-page\" id=\"pagePiano\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎹 别踩白块</h3>\n      <div class=\"game-info\">\n        <span>分数 <b id=\"pianoScore\">0</b></span>\n      </div>\n      <canvas class=\"piano-canvas\" id=\"pianoCanvas\" width=\"280\" height=\"420\" onclick=\"pianoCanvasClick(event)\"></canvas>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"pianoStart()\">▶️ 开始</button>\n      </div>\n      <p class=\"game-tip\">点击下落的黑块，别让黑块落出底部，速度会越来越快</p>\n    </div>\n  </div>");
// ==================== 别踩白块 ====================
let pianoTiles,pianoScore,pianoSpeed,pianoTimer,pianoStarted,pianoOver,pianoTouchBound=false;
const PIANO_COLS=4,PIANO_TILE_H=80,PIANO_BOARD_H=420;
function pianoInit(){
  pianoTiles=[];pianoScore=0;pianoSpeed=1.2;pianoStarted=false;pianoOver=false;
  document.getElementById('pianoScore').textContent='0';
  for(let i=0;i<6;i++){
    pianoTiles.push({col:Math.floor(Math.random()*PIANO_COLS),y:-PIANO_TILE_H*(8-i),tapped:false});
  }
  pianoDraw();
  if(!pianoTouchBound){
    const cv=document.getElementById('pianoCanvas');
    if(cv){
      cv.addEventListener('touchend',function(e){
        e.preventDefault();e.stopPropagation();
        const t=e.changedTouches[0];
        pianoBoardTap(t.clientX,t.clientY);
      },{passive:false});
      pianoTouchBound=true;
    }
  }
}
function pianoDraw(){
  const canvas=document.getElementById('pianoCanvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height,colW=W/PIANO_COLS;
  ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#eee';ctx.lineWidth=1;
  for(let c=1;c<PIANO_COLS;c++){ctx.beginPath();ctx.moveTo(c*colW,0);ctx.lineTo(c*colW,H);ctx.stroke();}
  pianoTiles.forEach(function(t){
    if(t.y>H)return;
    ctx.fillStyle=t.tapped?'#aaa':'#222';
    ctx.fillRect(t.col*colW+2,t.y,colW-4,PIANO_TILE_H-4);
  });
  if(pianoOver){
    ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff';ctx.font='bold 24px sans-serif';ctx.textAlign='center';
    ctx.fillText('游戏结束',W/2,H/2-10);
    ctx.font='14px sans-serif';ctx.fillText('得分 '+pianoScore,W/2,H/2+20);
  }
}
function pianoCanvasClick(e){
  pianoBoardTap(e.clientX,e.clientY);
}
function pianoBoardTap(clientX,clientY){
  if(pianoOver||!pianoStarted)return;
  const canvas=document.getElementById('pianoCanvas');
  const rect=canvas.getBoundingClientRect();
  const ratioX=(clientX-rect.left)/rect.width;
  const col=Math.floor(ratioX*PIANO_COLS);
  if(col<0||col>=PIANO_COLS)return;
  let target=null;
  for(const t of pianoTiles){
    if(t.col===col&&!t.tapped&&t.y>=0&&t.y<=canvas.height-PIANO_TILE_H){
      if(!target||t.y>target.y)target=t;
    }
  }
  if(target)pianoTap(target);
}
function pianoTap(tile){
  if(pianoOver||!pianoStarted||tile.tapped)return;
  if(tile.y<0||tile.y>PIANO_BOARD_H-PIANO_TILE_H)return;
  tile.tapped=true;pianoScore++;
  document.getElementById('pianoScore').textContent=pianoScore;
  pianoSpeed=1.2+Math.floor(pianoScore/15)*0.4;
  pianoDraw();
}
function pianoUpdate(){
  if(pianoOver)return;
  pianoTiles.forEach(function(t){t.y+=pianoSpeed;});
  for(const t of pianoTiles){if(!t.tapped&&t.y>=PIANO_BOARD_H){pianoGameOver();return;}}
  pianoTiles=pianoTiles.filter(function(t){return t.y<PIANO_BOARD_H+PIANO_TILE_H;});
  const top=Math.min.apply(null,pianoTiles.map(function(t){return t.y;}));
  if(top>=0){pianoTiles.push({col:Math.floor(Math.random()*PIANO_COLS),y:top-PIANO_TILE_H,tapped:false});}
  pianoDraw();
}
function pianoStart(){
  if(pianoTimer)clearInterval(pianoTimer);
  pianoInit();pianoStarted=true;
  pianoTimer=setInterval(pianoUpdate,16);
}
function pianoGameOver(){
  pianoOver=true;pianoStarted=false;clearInterval(pianoTimer);pianoDraw();
  const reward=Math.max(5,Math.floor(pianoScore/5));
  bpAddCoins(reward,'别踩白块');
  showToast('游戏结束！得分'+pianoScore+'，获得'+reward+'金币');
}


/* ===== 百宝箱功能分段 ===== */

