/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagezodiacPage", "<!-- pagezodiacPage -->\n<div class=\"tool-page\" id=\"pagezodiacPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>♈ 星座运势</h3>\n      <label>你的生日</label>\n      <input type=\"date\" id=\"zodiacBirth\" value=\"2000-06-15\">\n      <br>\n      <button class=\"common-btn\" onclick=\"zodiacCalc()\">🔮 查看今日运势</button>\n      <div id=\"zodiacResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：星座运势 ====================
const ZODIAC_SIGNS=[
  {name:'白羊座',icon:'♈',start:[3,21],end:[4,19]},
  {name:'金牛座',icon:'♉',start:[4,20],end:[5,20]},
  {name:'双子座',icon:'♊',start:[5,21],end:[6,21]},
  {name:'巨蟹座',icon:'♋',start:[6,22],end:[7,22]},
  {name:'狮子座',icon:'♌',start:[7,23],end:[8,22]},
  {name:'处女座',icon:'♍',start:[8,23],end:[9,22]},
  {name:'天秤座',icon:'♎',start:[9,23],end:[10,23]},
  {name:'天蝎座',icon:'♏',start:[10,24],end:[11,22]},
  {name:'射手座',icon:'♐',start:[11,23],end:[12,21]},
  {name:'摩羯座',icon:'♑',start:[12,22],end:[1,19]},
  {name:'水瓶座',icon:'♒',start:[1,20],end:[2,18]},
  {name:'双鱼座',icon:'♓',start:[2,19],end:[3,20]}
];
function getZodiac(month,day){
  for(const s of ZODIAC_SIGNS){
    if(s.start[0]===12&&month===12){if(day>=s.start[1])return s;}
    else if(s.start[0]===1&&month===1){if(day<=s.end[1])return s;}
    else if(month===s.start[0]&&day>=s.start[1])return s;
    else if(month===s.end[0]&&day<=s.end[1])return s;
  }
  return ZODIAC_SIGNS[0];
}
function zodiacCalc(){
  const birth=document.getElementById('zodiacBirth').value;
  if(!birth){showToast('请选择生日');return;}
  const d=new Date(birth);
  const sign=getZodiac(d.getMonth()+1,d.getDate());
  const seed=hashString('zodiac_'+sign.name+'_'+getTodaySeed());
  const overall=seed%5+1;
  const stars='⭐'.repeat(overall)+'☆'.repeat(5-overall);
  const fortuneTexts=['今日运势平平，宜低调行事。','今日有小惊喜，注意把握机会。','今日运势不错，诸事顺遂。','今日运势上佳，可大胆尝试。','今日运势极佳，万事如意！'];
  const love=['感情需多沟通','有小桃花','感情甜蜜','桃花运旺','爱情事业双丰收'];
  const work=['按部就班','有小进展','贵人相助','事业上升','大展宏图'];
  const wealth=['破财风险','财运平平','有小财','财运亨通','财源滚滚'];
  const luckyNums=[];
  for(let i=0;i<3;i++)luckyNums.push((seed>>(i*3))%49+1);
  const colors=['红色','蓝色','绿色','黄色','紫色','白色','金色','粉色'];
  document.getElementById('zodiacResult').innerHTML=
    `<div class="fortune-today-card">
      <div class="ft-title">${sign.icon} ${sign.name} 今日运势</div>
      <div class="ft-overall">${stars}</div>
      <div class="ft-level">${fortuneTexts[overall-1].split('，')[0]}</div>
      <div style="margin:8px 0;font-size:14px;color:var(--text-secondary);">${fortuneTexts[overall-1]}</div>
      <div class="fortune-grid">
        <div class="fg-item"><div class="fg-label">💕 爱情</div><div class="fg-val">${love[overall-1]}</div></div>
        <div class="fg-item"><div class="fg-label">💼 事业</div><div class="fg-val">${work[overall-1]}</div></div>
        <div class="fg-item"><div class="fg-label">💰 财运</div><div class="fg-val">${wealth[overall-1]}</div></div>
      </div>
      <div class="fortune-extra">
        <span class="fe-tag">🔢 幸运数字：${luckyNums.join(', ')}</span>
        <span class="fe-tag">🎨 幸运色：${colors[seed%colors.length]}</span>
      </div>
    </div>`;
}

