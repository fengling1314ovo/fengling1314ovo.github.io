/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageRpsPage", "<!-- pageRpsPage -->\n<div class=\"tool-page\" id=\"pageRpsPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>✊ 石头剪刀布</h3>\n      <div class=\"rps-area\">\n        <div class=\"rps-vs\">\n          <div class=\"rps-side\"><span class=\"rps-label\">你</span><span class=\"rps-choice\" id=\"rpsPlayer\">❓</span></div>\n          <span style=\"font-size:24px;color:var(--text-secondary);\">VS</span>\n          <div class=\"rps-side\"><span class=\"rps-label\">电脑</span><span class=\"rps-choice\" id=\"rpsComputer\">❓</span></div>\n        </div>\n        <div class=\"rps-result-text\" id=\"rpsResult\">选择出拳开始游戏</div>\n        <div class=\"rps-buttons\">\n          <button class=\"rps-btn\" onclick=\"rpsPlay('rock')\" title=\"石头\">✊</button>\n          <button class=\"rps-btn\" onclick=\"rpsPlay('scissors')\" title=\"剪刀\">✌️</button>\n          <button class=\"rps-btn\" onclick=\"rpsPlay('paper')\" title=\"布\">🖐️</button>\n        </div>\n        <div class=\"rps-stats\">\n          <span>胜 <b id=\"rpsWin\">0</b></span>\n          <span>负 <b id=\"rpsLose\">0</b></span>\n          <span>平 <b id=\"rpsDraw\">0</b></span>\n          <span>胜率 <b id=\"rpsRate\">-</b></span>\n          <button class=\"common-btn\" onclick=\"rpsReset()\" style=\"margin-left:12px;\">重置</button>\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：石头剪刀布 ====================
const RPS_CHOICES={rock:'✊',scissors:'✌️',paper:'🖐️'};
const RPS_NAMES={rock:'石头',scissors:'剪刀',paper:'布'};
let rpsStats=lsGet('rps_stats',{win:0,lose:0,draw:0});
function rpsUpdateStats(){
  document.getElementById('rpsWin').textContent=rpsStats.win;
  document.getElementById('rpsLose').textContent=rpsStats.lose;
  document.getElementById('rpsDraw').textContent=rpsStats.draw;
  const total=rpsStats.win+rpsStats.lose+rpsStats.draw;
  document.getElementById('rpsRate').textContent=total>0?Math.round(rpsStats.win/total*100)+'%':'-';
}
rpsUpdateStats();
function rpsPlay(playerChoice){
  const choices=['rock','scissors','paper'];
  const computerChoice=choices[Math.floor(Math.random()*3)];
  document.getElementById('rpsPlayer').textContent=RPS_CHOICES[playerChoice];
  document.getElementById('rpsComputer').textContent=RPS_CHOICES[computerChoice];
  let result='',color='';
  if(playerChoice===computerChoice){result='平局！';color='var(--text-secondary)';rpsStats.draw++;}
  else if((playerChoice==='rock'&&computerChoice==='scissors')||(playerChoice==='scissors'&&computerChoice==='paper')||(playerChoice==='paper'&&computerChoice==='rock')){
    result='🎉 你赢了！';color='#10b981';rpsStats.win++;bpAddCoins(5,'rps');
  }else{result='😢 你输了！';color='#ef4444';rpsStats.lose++;}
  const resEl=document.getElementById('rpsResult');
  resEl.textContent=result;resEl.style.color=color;
  lsSet('rps_stats',rpsStats);rpsUpdateStats();
}
function rpsReset(){ rpsStats={win:0,lose:0,draw:0}; lsSet('rps_stats',rpsStats); rpsUpdateStats();
  document.getElementById('rpsPlayer').textContent='❓';document.getElementById('rpsComputer').textContent='❓';
  document.getElementById('rpsResult').textContent='选择出拳开始游戏';document.getElementById('rpsResult').style.color='';
  showToast('统计已重置');
}

