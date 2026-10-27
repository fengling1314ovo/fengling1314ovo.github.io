/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagenameMatchPage", "<!-- pagenameMatchPage -->\n<div class=\"tool-page\" id=\"pagenameMatchPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>💕 姓名配对</h3>\n      <label>你的名字</label>\n      <input id=\"nmSelf\" placeholder=\"输入你的名字\">\n      <label>对方名字</label>\n      <input id=\"nmOther\" placeholder=\"输入对方名字\">\n      <br>\n      <button class=\"common-btn\" onclick=\"nameMatch()\">💕 测算缘分</button>\n      <div id=\"nmResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：姓名配对 ====================
function nameMatch(){
  const a=document.getElementById('nmSelf').value.trim();
  const b=document.getElementById('nmOther').value.trim();
  if(!a||!b){showToast('请输入两个名字');return;}
  const seed=hashString(a+'_'+b);
  const score=seed%41+55; // 55-95
  let level='',poem='',color='';
  if(score>=90){level='灵魂伴侣';poem='金风玉露一相逢，便胜却人间无数。';color='#10b981';}
  else if(score>=80){level='天生一对';poem='身无彩凤双飞翼，心有灵犀一点通。';color='#22c55e';}
  else if(score>=70){level='两情相悦';poem='愿得一心人，白首不相离。';color='#84cc16';}
  else if(score>=60){level='缘分不浅';poem='有缘千里来相会，无缘对面不相逢。';color='#f59e0b';}
  else{level='需要努力';poem='路遥知马力，日久见人心。';color='#ef4444';}
  document.getElementById('nmResult').innerHTML=
    `<div class="quiz-result-card">
      <div style="font-size:24px;margin-bottom:8px;">${a} ❤️ ${b}</div>
      <div class="qr-score" style="color:${color};">${score}%</div>
      <div style="font-size:18px;font-weight:bold;color:${color};margin:8px 0;">${level}</div>
      <div class="qr-desc" style="font-family:'KaiTi','STKaiti',serif;font-size:16px;">${poem}</div>
    </div>`;
}

