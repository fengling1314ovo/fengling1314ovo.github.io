/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageminesweeperPage", "<!-- pageminesweeperPage -->\n<div class=\"tool-page\" id=\"pageminesweeperPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>💣 扫雷</h3>\n      <div class=\"game-info\">\n        <span>💣 <b id=\"msMines\">10</b></span>\n        <span>⏱️ <b id=\"msTime\">0</b>s</span>\n        <span>难度 <select id=\"msLevel\" onchange=\"msNew()\" style=\"border:1px solid var(--border-color);border-radius:8px;padding:4px 8px;color:var(--text-main);\"><option value=\"easy\">简单9×9</option><option value=\"medium\">中等16×16</option><option value=\"hard\">困难16×30</option></select></span>\n      </div>\n      <div class=\"game-canvas-wrap\" style=\"overflow-x:auto;\">\n        <div id=\"msGrid\" class=\"ms-grid\"></div>\n      </div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"msNew()\">🔄 新游戏</button>\n      </div>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-top:8px;\">左键翻开，右键/长按插旗</p>\n    </div>\n  </div>");
// ==================== 百宝箱：扫雷 ====================
let msBoard=[],msRows=9,msCols=9,msMines=10,msFlags=0,msRevealed=0,msOver=false,msTimerInt=null,msTime=0;
function msNew(){
  const level=document.getElementById('msLevel').value;
  if(level==='easy'){msRows=9;msCols=9;msMines=10;}
  else if(level==='medium'){msRows=16;msCols=16;msMines=40;}
  else{msRows=16;msCols=30;msMines=99;}
  msBoard=Array(msRows).fill(null).map(()=>Array(msCols).fill(null).map(()=>({mine:false,revealed:false,flagged:false,count:0})));
  msFlags=0;msRevealed=0;msOver=false;msTime=0;
  document.getElementById('msMines').textContent=msMines;
  document.getElementById('msTime').textContent='0';
  if(msTimerInt)clearInterval(msTimerInt);
  msTimerInt=setInterval(()=>{if(!msOver){msTime++;document.getElementById('msTime').textContent=msTime;}},1000);
  msRender();
}
function msPlaceMines(sr,sc){
  let placed=0;
  while(placed<msMines){
    const r=Math.floor(Math.random()*msRows),c=Math.floor(Math.random()*msCols);
    if((Math.abs(r-sr)<=1&&Math.abs(c-sc)<=1)||msBoard[r][c].mine)continue;
    msBoard[r][c].mine=true;placed++;
  }
  for(let r=0;r<msRows;r++)for(let c=0;c<msCols;c++){
    if(msBoard[r][c].mine)continue;
    let cnt=0;
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<msRows&&nc>=0&&nc<msCols&&msBoard[nr][nc].mine)cnt++;
    }
    msBoard[r][c].count=cnt;
  }
}
function msRender(){
  const grid=document.getElementById('msGrid');
  grid.style.gridTemplateColumns=`repeat(${msCols},30px)`;
  grid.innerHTML='';
  for(let r=0;r<msRows;r++)for(let c=0;c<msCols;c++){
    const cell=msBoard[r][c];
    const div=document.createElement('div');
    div.className='ms-cell';
    if(cell.revealed){
      div.classList.add('revealed');
      if(cell.mine){div.classList.add('mine');div.textContent='💣';}
      else if(cell.count>0){div.textContent=cell.count;div.style.color=['','#3b82f6','#10b981','#ef4444','#8b5cf6','#f59e0b','#06b6d4','#000','#666'][cell.count];}
    }else if(cell.flagged){div.classList.add('flagged');div.textContent='🚩';}
    div.onclick=()=>msReveal(r,c);
    div.oncontextmenu=(e)=>{e.preventDefault();msFlag(r,c);};
    grid.appendChild(div);
  }
}
function msReveal(r,c){
  if(msOver||msBoard[r][c].revealed||msBoard[r][c].flagged)return;
  if(msRevealed===0)msPlaceMines(r,c);
  const cell=msBoard[r][c];
  cell.revealed=true;msRevealed++;
  if(cell.mine){msOver=true;msBoard.forEach(row=>row.forEach(cc=>{if(cc.mine)cc.revealed=true;}));msRender();showToast('💥 踩到雷了！');return;}
  if(cell.count===0){
    for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<msRows&&nc>=0&&nc<msCols&&!msBoard[nr][nc].revealed)msReveal(nr,nc);
    }
  }
  if(msRevealed===msRows*msCols-msMines){msOver=true;const level=document.getElementById('msLevel').value;const msReward=level==='easy'?20:(level==='medium'?50:100);bpAddCoins(msReward,'minesweeper');showToast('🎉 胜利！用时'+msTime+'秒，获得'+msReward+'金币');}
  msRender();
}
function msFlag(r,c){
  if(msOver||msBoard[r][c].revealed)return;
  msBoard[r][c].flagged=!msBoard[r][c].flagged;
  msFlags+=msBoard[r][c].flagged?1:-1;
  document.getElementById('msMines').textContent=msMines-msFlags;
  msRender();
}
msNew();

