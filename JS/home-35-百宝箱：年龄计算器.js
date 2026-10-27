/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageagePage", "<!-- pageagePage -->\n<div class=\"tool-page\" id=\"pageagePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎂 年龄计算器</h3>\n      <label>你的出生日期</label>\n      <input type=\"date\" id=\"ageBirth\" value=\"2000-01-01\">\n      <br>\n      <button class=\"common-btn\" onclick=\"ageCalc()\">🎂 计算年龄</button>\n      <div id=\"ageResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：年龄计算器 ====================
function ageCalc(){
  const birth=document.getElementById('ageBirth').value;
  if(!birth){showToast('请选择出生日期');return;}
  const bd=new Date(birth);
  const now=new Date();
  let years=now.getFullYear()-bd.getFullYear();
  let months=now.getMonth()-bd.getMonth();
  let days=now.getDate()-bd.getDate();
  if(days<0){months--;days+=new Date(now.getFullYear(),now.getMonth(),0).getDate();}
  if(months<0){years--;months+=12;}
  const totalDays=Math.floor((now-bd)/(1000*60*60*24));
  const totalHours=totalDays*24;
  const totalMinutes=totalHours*60;
  // 下次生日
  let nextBd=new Date(now.getFullYear(),bd.getMonth(),bd.getDate());
  if(nextBd<now)nextBd=new Date(now.getFullYear()+1,bd.getMonth(),bd.getDate());
  const daysToBd=Math.ceil((nextBd-now)/(1000*60*60*24));
  // 生肖和星座
  const zodiacs=['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  const zodiac=zodiacs[(bd.getFullYear()-4)%12];
  const sign=getZodiac(bd.getMonth()+1,bd.getDate());
  document.getElementById('ageResult').innerHTML=
    `<div class="fortune-today-card">
      <div class="ft-title">年龄详情</div>
      <div class="ft-overall" style="font-size:42px;">${years}岁</div>
      <div class="ft-level">${months}个月${days}天</div>
      <div class="fortune-grid">
        <div class="fg-item"><div class="fg-label">📅 总天数</div><div class="fg-val">${totalDays.toLocaleString()}天</div></div>
        <div class="fg-item"><div class="fg-label">⏰ 总小时</div><div class="fg-val">${totalHours.toLocaleString()}小时</div></div>
        <div class="fg-item"><div class="fg-label">🐾 生肖</div><div class="fg-val">${zodiac}</div></div>
        <div class="fg-item"><div class="fg-label">⭐ 星座</div><div class="fg-val">${sign.icon}${sign.name}</div></div>
      </div>
      <div class="fortune-extra">
        <span class="fe-tag">🎂 距离下次生日还有 ${daysToBd} 天</span>
      </div>
    </div>`;
}

