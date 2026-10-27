/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagecaloriePage", "<!-- pagecaloriePage -->\n<div class=\"tool-page\" id=\"pagecaloriePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔥 卡路里计算器</h3>\n      <label>性别</label>\n      <select id=\"calGender\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);min-height:44px;\">\n        <option value=\"male\">男</option><option value=\"female\">女</option>\n      </select>\n      <label>年龄</label><input id=\"calAge\" type=\"number\" value=\"25\" placeholder=\"岁\">\n      <label>身高(cm)</label><input id=\"calHeight\" type=\"number\" value=\"170\" placeholder=\"cm\">\n      <label>体重(kg)</label><input id=\"calWeight\" type=\"number\" value=\"65\" placeholder=\"kg\">\n      <label>活动量</label>\n      <select id=\"calActivity\" style=\"width:100%;padding:10px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-main);min-height:44px;\">\n        <option value=\"1.2\">久坐不动（几乎不运动）</option>\n        <option value=\"1.375\">轻度活动（每周1-3次）</option>\n        <option value=\"1.55\" selected>中度活动（每周3-5次）</option>\n        <option value=\"1.725\">高度活动（每周6-7次）</option>\n        <option value=\"1.9\">极高活动（体力劳动/每天训练）</option>\n      </select>\n      <br>\n      <button class=\"common-btn\" onclick=\"calorieCalc()\">🔥 计算</button>\n      <div id=\"calResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：卡路里计算器 ====================
function calorieCalc(){
  const gender=document.getElementById('calGender').value;
  const age=Number(document.getElementById('calAge').value);
  const height=Number(document.getElementById('calHeight').value);
  const weight=Number(document.getElementById('calWeight').value);
  const activity=Number(document.getElementById('calActivity').value);
  if(!age||!height||!weight){showToast('请填写完整信息');return;}
  // Mifflin-St Jeor公式
  let bmr;
  if(gender==='male')bmr=10*weight+6.25*height-5*age+5;
  else bmr=10*weight+6.25*height-5*age-161;
  const tdee=Math.round(bmr*activity);
  const bmi=(weight/Math.pow(height/100,2)).toFixed(1);
  let bmiLevel='',bmiColor='';
  if(bmi<18.5){bmiLevel='偏瘦';bmiColor='#3b82f6';}
  else if(bmi<24){bmiLevel='正常';bmiColor='#10b981';}
  else if(bmi<28){bmiLevel='偏胖';bmiColor='#f59e0b';}
  else{bmiLevel='肥胖';bmiColor='#ef4444';}
  document.getElementById('calResult').innerHTML=
    `<div class="fortune-today-card">
      <div class="ft-title">每日热量需求</div>
      <div class="ft-overall" style="font-size:38px;">${tdee}</div>
      <div class="ft-level">大卡/天（维持体重）</div>
      <div class="fortune-grid">
        <div class="fg-item"><div class="fg-label">🔥 基础代谢BMR</div><div class="fg-val">${Math.round(bmr)} 大卡</div></div>
        <div class="fg-item"><div class="fg-label">⚖️ BMI</div><div class="fg-val" style="color:${bmiColor};">${bmi} (${bmiLevel})</div></div>
        <div class="fg-item"><div class="fg-label">📉 减脂建议</div><div class="fg-val">${Math.round(tdee*0.8)} 大卡</div></div>
        <div class="fg-item"><div class="fg-label">📈 增肌建议</div><div class="fg-val">${Math.round(tdee*1.1)} 大卡</div></div>
      </div>
    </div>`;
}

