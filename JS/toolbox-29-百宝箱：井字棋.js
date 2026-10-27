/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagetttPage", "<!-- pagetttPage -->\n<div class=\"tool-page\" id=\"pagetttPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>⭕ 井字棋</h3>\n      <div class=\"game-info\">\n        <span id=\"tttStatus\">你的回合（X）</span>\n      </div>\n      <div class=\"ttt-grid\" id=\"tttGrid\"></div>\n      <div class=\"game-info\">\n        <span>你(X) <b id=\"tttWin\">0</b></span>\n        <span>平 <b id=\"tttDraw\">0</b></span>\n        <span>电脑(O) <b id=\"tttLose\">0</b></span>\n      </div>\n      <div class=\"game-controls\">\n        <button class=\"common-btn\" onclick=\"tttReset()\">🔄 重新开始</button>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：井字棋 ====================
let tttBoard=Array(9).fill(''),tttTurn='X',tttOver=false,tttStats=lsGet('ttt_stats',{win:0,draw:0,lose:0});
function tttRender(){
  const grid=document.getElementById('tttGrid');
  grid.innerHTML='';
  tttBoard.forEach((v,i)=>{
    const cell=document.createElement('div');
    cell.className='ttt-cell'+(v==='X'?' x':v==='O'?' o':'');
    cell.textContent=v;
    cell.onclick=()=>tttPlay(i);
    grid.appendChild(cell);
  });
  document.getElementById('tttWin').textContent=tttStats.win;
  document.getElementById('tttDraw').textContent=tttStats.draw;
  document.getElementById('tttLose').textContent=tttStats.lose;
}
function tttPlay(i){
  if(tttOver||tttBoard[i]!=='')return;
  tttBoard[i]='X';tttRender();
  if(tttCheck('X')){tttOver=true;tttStats.win++;lsSet('ttt_stats',tttStats);bpAddCoins(10,'ttt');document.getElementById('tttStatus').textContent='🎉 你赢了！+10金币';tttRender();return;}
  if(tttBoard.every(v=>v!=='')){tttOver=true;tttStats.draw++;lsSet('ttt_stats',tttStats);bpAddCoins(5,'ttt');document.getElementById('tttStatus').textContent='平局！+5金币';tttRender();return;}
  document.getElementById('tttStatus').textContent='电脑思考中...';
  setTimeout(tttAI,300);
}
function tttAI(){
  const empty=tttBoard.map((v,i)=>v===''?i:-1).filter(i=>i>=0);
  // 简单AI：优先赢，其次堵，否则随机
  for(const i of empty){tttBoard[i]='O';if(tttCheck('O')){tttBoard[i]='O';break;}tttBoard[i]='';}
  if(!tttBoard.some((v,i)=>v==='O'&&empty.includes(i)&&tttCheck('O'))){
    for(const i of empty){tttBoard[i]='X';if(tttCheck('X')){tttBoard[i]='O';break;}tttBoard[i]='';}
  }
  if(!tttBoard.some((v,i)=>v==='O')){
    const center=empty.includes(4)?4:empty[Math.floor(Math.random()*empty.length)];
    tttBoard[center]='O';
  }
  tttRender();
  if(tttCheck('O')){tttOver=true;tttStats.lose++;lsSet('ttt_stats',tttStats);document.getElementById('tttStatus').textContent='😢 电脑赢了！';tttRender();return;}
  if(tttBoard.every(v=>v!=='')){tttOver=true;tttStats.draw++;lsSet('ttt_stats',tttStats);document.getElementById('tttStatus').textContent='平局！';tttRender();return;}
  document.getElementById('tttStatus').textContent='你的回合（X）';
}
function tttCheck(p){
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return lines.some(l=>l.every(i=>tttBoard[i]===p));
}
function tttReset(){tttBoard=Array(9).fill('');tttTurn='X';tttOver=false;document.getElementById('tttStatus').textContent='你的回合（X）';tttRender();}
tttRender();

