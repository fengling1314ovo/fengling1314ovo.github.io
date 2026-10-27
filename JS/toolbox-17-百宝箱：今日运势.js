/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageFortuneTodayPage", "<!-- pageFortuneTodayPage -->\n<div class=\"tool-page\" id=\"pageFortuneTodayPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🌟 今日运势</h3>\n      <div id=\"fortuneTodayContent\"><div style=\"text-align:center;color:var(--text-placeholder);padding:30px;\">加载中...</div></div>\n      <div style=\"text-align:center;margin-top:12px;\">\n        <button class=\"common-btn\" onclick=\"renderFortuneToday()\">🔄 重新测算</button>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：今日运势 ====================
function hashString(str){
  let hash=0;
  for(let i=0;i<str.length;i++){const char=str.charCodeAt(i);hash=((hash<<5)-hash)+char;hash|=0;}
  return Math.abs(hash);
}
function getTodaySeed(){
  const d=new Date();
  return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
}
function renderFortuneToday(){
  const seed=hashString('fortune_'+getTodaySeed());
  const overall=seed%5+1;
  const stars='⭐'.repeat(overall)+'☆'.repeat(5-overall);
  const levels=['大凶','小凶','平','小吉','中吉','大吉'];
  const level=levels[overall];
  const loveTexts=['感情易有波折','需多关心对方','感情平稳','有桃花运','感情甜蜜','爱情事业双丰收'];
  const workTexts=['工作压力大','需谨慎行事','按部就班即可','有贵人相助','事业上升期','万事顺遂'];
  const wealthTexts=['破财风险','理财需谨慎','财运平平','有小财进账','财运亨通','财源滚滚'];
  const healthTexts=['注意休息','多运动','身体尚可','精力充沛','身体强健','身心健康'];
  const luckyNumbers=[];
  for(let i=0;i<3;i++)luckyNumbers.push((seed>>(i*3))%49+1);
  const colors=['红色','蓝色','绿色','黄色','紫色','白色','黑色','粉色','橙色','青色'];
  const luckyColor=colors[seed%colors.length];
  const yiList=['出行','学习','工作','约会','购物','运动','旅行','聚会','签约','搬家'];
  const jiList=['争吵','冒险','熬夜','暴饮暴食','冲动消费','远行','投资','签约','搬家','熬夜'];
  const yi=yiList[(seed>>4)%yiList.length]+'、'+yiList[(seed>>8)%yiList.length];
  const ji=jiList[(seed>>6)%jiList.length]+'、'+jiList[(seed>>10)%jiList.length];
  document.getElementById('fortuneTodayContent').innerHTML=
    `<div class="fortune-today-card">
      <div class="ft-title">${getTodaySeed()} 运势</div>
      <div class="ft-overall">${stars}</div>
      <div class="ft-level">${level}</div>
      <div class="fortune-grid">
        <div class="fg-item"><div class="fg-label">💕 爱情</div><div class="fg-val">${loveTexts[overall]}</div></div>
        <div class="fg-item"><div class="fg-label">💼 事业</div><div class="fg-val">${workTexts[overall]}</div></div>
        <div class="fg-item"><div class="fg-label">💰 财运</div><div class="fg-val">${wealthTexts[overall]}</div></div>
        <div class="fg-item"><div class="fg-label">🏥 健康</div><div class="fg-val">${healthTexts[overall]}</div></div>
      </div>
      <div class="fortune-extra">
        <span class="fe-tag">🔢 幸运数字：${luckyNumbers.join(', ')}</span>
        <span class="fe-tag">🎨 幸运色：${luckyColor}</span>
      </div>
      <div class="fortune-extra">
        <span class="fe-tag" style="color:#10b981;">✅ 宜：${yi}</span>
        <span class="fe-tag" style="color:#ef4444;">❌ 忌：${ji}</span>
      </div>
    </div>`;
}
renderFortuneToday();

