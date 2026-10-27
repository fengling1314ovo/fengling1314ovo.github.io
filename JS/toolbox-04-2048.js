/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageGame2048", "<!-- pageGame2048 -->\n<div class=\"tool-page\" id=\"pageGame2048\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔢 2048</h3>\n      <div class=\"game-info\">\n        <span>分数 <b id=\"game2048Score\">0</b></span>\n      </div>\n      <div class=\"game2048-board\" id=\"game2048Board\"></div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"game2048Init()\">🔄 新游戏</button>\n        <button class=\"common-btn\" onclick=\"game2048Move('left')\">⬅️</button>\n        <button class=\"common-btn\" onclick=\"game2048Move('right')\">➡️</button>\n        <button class=\"common-btn\" onclick=\"game2048Move('up')\">⬆️</button>\n        <button class=\"common-btn\" onclick=\"game2048Move('down')\">⬇️</button>\n      </div>\n      <p class=\"game-tip\">键盘方向键或点击按钮滑动，相同数字合并，合成2048获胜</p>\n    </div>\n  </div>");
// ==================== 2048 ====================
let game2048Board, game2048Score, game2048Over;
const GAME2048_COLORS={2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
function game2048Init(){
  game2048Board=Array.from({length:4},()=>Array(4).fill(0));
  game2048Score=0;game2048Over=false;
  game2048Add();game2048Add();
  document.getElementById('game2048Score').textContent='0';
  game2048Draw();
}
function game2048Add(){
  const empty=[];
  for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(!game2048Board[r][c])empty.push([r,c]);
  if(!empty.length)return;
  const p=empty[Math.floor(Math.random()*empty.length)];
  game2048Board[p[0]][p[1]]=Math.random()<0.9?2:4;
}
function game2048Draw(){
  const wrap=document.getElementById('game2048Board');
  wrap.innerHTML='';
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){
    const cell=document.createElement('div');
    cell.className='game2048-cell';
    cell.style.left=(10+c*70)+'px';cell.style.top=(10+r*70)+'px';
    wrap.appendChild(cell);
    if(game2048Board[r][c]){
      const tile=document.createElement('div');
      tile.className='game2048-tile';
      tile.style.left=(10+c*70)+'px';tile.style.top=(10+r*70)+'px';
      tile.style.background=GAME2048_COLORS[game2048Board[r][c]]||'#3c3a32';
      tile.style.color=game2048Board[r][c]<=4?'#776e65':'#fff';
      tile.style.fontSize=game2048Board[r][c]>=1024?'16px':'22px';
      tile.textContent=game2048Board[r][c];
      wrap.appendChild(tile);
    }
  }
  if(game2048Over){
    const overlay=document.createElement('div');
    overlay.style.cssText='position:absolute;inset:0;background:rgba(238,228,218,0.73);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:10;';
    overlay.innerHTML='<div style="font-size:28px;font-weight:700;color:#776e65;">游戏结束</div><div style="font-size:14px;color:#776e65;margin-top:8px;">得分 '+game2048Score+'</div>';
    wrap.appendChild(overlay);
  }
}
function game2048Move(dir){
  if(game2048Over)return;
  let moved=false;
  const rotate=function(b){return b[0].map(function(_,i){return b.map(function(r){return r[i];}).reverse();});};
  let board=game2048Board.map(function(r){return r.slice();});
  const rotations={left:0,up:1,right:2,down:3}[dir];
  for(let i=0;i<rotations;i++)board=rotate(board);
  for(let r=0;r<4;r++){
    let row=board[r].filter(function(v){return v;});
    for(let c=0;c<row.length-1;c++){
      if(row[c]===row[c+1]){row[c]*=2;game2048Score+=row[c];row.splice(c+1,1);}
    }
    while(row.length<4)row.push(0);
    if(row.join()!==board[r].join())moved=true;
    board[r]=row;
  }
  for(let i=0;i<(4-rotations)%4;i++)board=rotate(board);
  if(moved){
    game2048Board=board;game2048Add();
    document.getElementById('game2048Score').textContent=game2048Score;
    game2048Draw();
    if(!game2048CanMove()){
      game2048Over=true;game2048Draw();
      const reward=Math.max(5,Math.floor(game2048Score/50));
      bpAddCoins(reward,'2048');
      showToast('游戏结束！得分'+game2048Score+'，获得'+reward+'金币');
    }
  }
}
function game2048CanMove(){
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){
    if(!game2048Board[r][c])return true;
    if(c<3&&game2048Board[r][c]===game2048Board[r][c+1])return true;
    if(r<3&&game2048Board[r][c]===game2048Board[r+1][c])return true;
  }
  return false;
}
document.addEventListener('keydown',function(e){
  if(!pageGame2048||pageGame2048.style.display!=='block')return;
  const map={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};
  if(map[e.key]){e.preventDefault();game2048Move(map[e.key]);}
});

