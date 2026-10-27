/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagepastLifePage", "<!-- pagepastLifePage -->\n<div class=\"tool-page\" id=\"pagepastLifePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🏛️ 前世身份</h3>\n      <label>输入你的名字</label>\n      <input id=\"plName\" placeholder=\"输入名字\">\n      <br>\n      <button class=\"common-btn\" onclick=\"pastLifeCalc()\">🔮 查看前世身份</button>\n      <div id=\"plResult\" style=\"margin-top:16px;\"></div>\n      <p style=\"font-size:12px;color:var(--text-placeholder);margin-top:12px;text-align:center;\">※ 纯娱乐，请勿当真</p>\n    </div>\n  </div>");
// ==================== 百宝箱：前世身份 ====================
const PAST_LIVES=[
  {title:'古代将军',desc:'你前世是一位征战沙场的将军，英勇善战，保家卫国，立下赫赫战功。今生你依然保留着果断坚毅的性格。',icon:'⚔️'},
  {title:'文人墨客',desc:'你前世是一位才华横溢的文人，诗词歌赋样样精通，留下了许多传世佳作。今生你对文学艺术依然有浓厚兴趣。',icon:'📜'},
  {title:'宫廷御医',desc:'你前世是一位医术高明的御医，救死扶伤，悬壶济世，深受百姓爱戴。今生你依然关心他人健康。',icon:'⚕️'},
  {title:'江湖侠客',desc:'你前世是一位行侠仗义的江湖侠客，路见不平拔刀相助，快意恩仇。今生你依然富有正义感。',icon:'🗡️'},
  {title:'富商大贾',desc:'你前世是一位富甲一方的商人，诚信经营，乐善好施。今生你依然有不错的财运和商业头脑。',icon:'💰'},
  {title:'世外高人',desc:'你前世是一位隐居山林的高人，参悟天地，逍遥自在。今生你依然追求内心的平静和自由。',icon:'🏔️'},
  {title:'宫廷乐师',desc:'你前世是一位技艺精湛的宫廷乐师，弹奏的曲子如天籁之音。今生你依然对音乐有独特的感悟。',icon:'🎵'},
  {title:'农家田园',desc:'你前世是一位勤劳朴实的农夫，日出而作日落而息，生活简单而幸福。今生你依然向往简单纯粹的生活。',icon:'🌾'},
  {title:'状元郎',desc:'你前世是一位寒窗苦读的状元，才华横溢，金榜题名。今生你依然勤奋好学，追求卓越。',icon:'📚'},
  {title:'神医',desc:'你前世是一位云游四方的神医，医术高超，起死回生。今生你依然有帮助他人的天性。',icon:'💊'},
  {title:'公主/王子',desc:'你前世是一位金枝玉叶的公主/王子，从小锦衣玉食，却也肩负着家国责任。今生你依然有高贵的气质。',icon:'👑'},
  {title:'算命先生',desc:'你前世是一位神机妙算的算命先生，上知天文下知地理，能掐会算。今生你依然直觉敏锐，有先见之明。',icon:'🔮'}
];
function pastLifeCalc(){
  const name=document.getElementById('plName').value.trim();
  if(!name){showToast('请输入名字');return;}
  const seed=hashString('pastlife_'+name);
  const life=PAST_LIVES[seed%PAST_LIVES.length];
  document.getElementById('plResult').innerHTML=
    `<div class="quiz-result-card">
      <div style="font-size:48px;">${life.icon}</div>
      <div style="font-size:24px;font-weight:bold;color:var(--primary);margin:8px 0;">${life.title}</div>
      <div class="qr-desc">${life.desc}</div>
      <div style="margin-top:12px;font-size:13px;color:var(--text-placeholder);">※ 纯娱乐，请勿当真</div>
    </div>`;
}


