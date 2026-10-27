/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagezodiacMatchPage", "<!-- pagezodiacMatchPage -->\n<div class=\"tool-page\" id=\"pagezodiacMatchPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🐉 生肖配对</h3>\n      <label>你的生肖</label>\n      <select id=\"zmSelf\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);min-height:44px;\">\n        <option value=\"鼠\">鼠</option><option value=\"牛\">牛</option><option value=\"虎\">虎</option>\n        <option value=\"兔\">兔</option><option value=\"龙\">龙</option><option value=\"蛇\">蛇</option>\n        <option value=\"马\">马</option><option value=\"羊\">羊</option><option value=\"猴\">猴</option>\n        <option value=\"鸡\">鸡</option><option value=\"狗\">狗</option><option value=\"猪\">猪</option>\n      </select>\n      <label>对方生肖</label>\n      <select id=\"zmOther\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);min-height:44px;\">\n        <option value=\"鼠\">鼠</option><option value=\"牛\">牛</option><option value=\"虎\">虎</option>\n        <option value=\"兔\">兔</option><option value=\"龙\">龙</option><option value=\"蛇\">蛇</option>\n        <option value=\"马\">马</option><option value=\"羊\">羊</option><option value=\"猴\">猴</option>\n        <option value=\"鸡\">鸡</option><option value=\"狗\">狗</option><option value=\"猪\">猪</option>\n      </select>\n      <br>\n      <button class=\"common-btn\" onclick=\"zodiacMatch()\">💕 测算配对</button>\n      <div id=\"zmResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：生肖配对 ====================
const ZM_COMPAT={
  '鼠牛':95,'鼠鼠':80,'鼠龙':90,'鼠猴':85,'鼠鸡':60,'鼠马':40,'鼠羊':55,'鼠兔':70,'鼠蛇':75,'鼠虎':50,'鼠狗':65,'鼠猪':85,
  '牛牛':85,'牛龙':60,'牛猴':55,'牛鸡':90,'牛马':45,'牛羊':70,'牛兔':75,'牛蛇':80,'牛虎':50,'牛狗':65,'牛猪':60,
  '龙龙':80,'龙猴':95,'龙鸡':70,'龙马':65,'龙羊':50,'龙兔':55,'龙蛇':85,'龙虎':90,'龙狗':45,'龙猪':75,
  '猴猴':80,'猴鸡':75,'猴马':70,'猴羊':55,'猴兔':60,'猴蛇':80,'猴虎':65,'猴狗':50,'猴猪':70,
  '鸡鸡':80,'鸡马':55,'鸡羊':65,'鸡兔':50,'鸡蛇':85,'鸡虎':60,'鸡狗':70,'鸡猪':55,
  '马马':75,'马羊':95,'马兔':60,'马蛇':70,'马虎':85,'马狗':75,'马猪':65,
  '羊羊':70,'羊兔':90,'羊蛇':60,'羊虎':55,'羊狗':80,'羊猪':85,
  '兔兔':75,'兔蛇':65,'兔虎':55,'兔狗':85,'兔猪':90,
  '蛇蛇':75,'蛇虎':75,'蛇狗':60,'蛇猪':55,
  '虎虎':70,'虎狗':80,'虎猪':65,
  '狗狗':80,'狗猪':70,'猪猪':85
};
function zodiacMatch(){
  const a=document.getElementById('zmSelf').value;
  const b=document.getElementById('zmOther').value;
  const key=[a,b].sort().join('');
  let score=ZM_COMPAT[key];
  if(!score){
    // 反向查找
    const key2=[b,a].sort().join('');
    score=ZM_COMPAT[key2]||Math.floor(Math.random()*30)+55;
  }
  let level='',advice='',color='';
  if(score>=90){level='天作之合';advice='你们是天生一对，好好珍惜彼此！';color='#10b981';}
  else if(score>=75){level='非常般配';advice='相处融洽，互相理解，是很好的组合。';color='#22c55e';}
  else if(score>=60){level='还算合适';advice='需要多沟通磨合，互相包容才能长久。';color='#f59e0b';}
  else{level='需要努力';advice='性格差异较大，需要更多耐心和理解。';color='#ef4444';}
  document.getElementById('zmResult').innerHTML=
    `<div class="quiz-result-card">
      <div style="font-size:32px;margin-bottom:8px;">${a} ❤️ ${b}</div>
      <div class="qr-score" style="color:${color};">${score}%</div>
      <div style="font-size:18px;font-weight:bold;color:${color};margin:8px 0;">${level}</div>
      <div class="qr-desc">${advice}</div>
    </div>`;
}

