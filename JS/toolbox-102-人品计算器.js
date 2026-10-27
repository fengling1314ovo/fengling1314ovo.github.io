/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageMoralityPage", "<!-- pageMoralityPage -->\n<div class=\"tool-page\" id=\"pageMoralityPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>⚖️ 人品计算器</h3>\n      <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:16px 0 8px;\">输入你的名字</label>\n      <input id=\"morName\" maxlength=\"12\" placeholder=\"例如：小红\">\n      <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:14px 0 8px;\">选择你的生日</label>\n      <div style=\"display:flex;gap:10px;\">\n        <select id=\"morYear\" style=\"flex:1;\"></select>\n        <select id=\"morMonth\" style=\"flex:1;\"></select>\n        <select id=\"morDay\" style=\"flex:1;\"></select>\n      </div>\n      <div style=\"text-align:center;margin-top:14px;\">\n        <button class=\"common-btn\" onclick=\"moralityCalc()\">⚖️ 计算人品值</button>\n      </div>\n      <div id=\"moralityResult\" style=\"margin-top:16px;\"></div>\n      <p style=\"text-align:center;font-size:12px;color:var(--text-placeholder);margin-top:14px;\">※ 纯娱乐算命，人品好不好还是看你自己~</p>\n    </div>\n  </div>");
// ==================== 人品计算器 ====================
const MOR_LEVELS = [
  { min:90, max:100, name:'圣人', icon:'😇', color:'#f43f5e',
    comments:['人品好到发光，走到哪都有人想渡你成佛。','德高望重，行善积德的典范，瑞思拜。'] },
  { min:80, max:89,  name:'君子', icon:'🎩', color:'#f59e0b',
    comments:['堂堂正正，言而有信，是个靠谱的人。','君子坦荡荡，做事有底线，让人放心。'] },
  { min:70, max:79,  name:'好人', icon:'😊', color:'#10b981',
    comments:['热心肠，不坑人，朋友圈里的口碑担当。','人品不错，小日子过得也敞亮。'] },
  { min:60, max:69,  name:'凡人', icon:'🙂', color:'#64748b',
    comments:['不圣母也不坏人，普普通通刚刚好。','芸芸众生一枚，问心无愧就好。'] },
  { min:50, max:59,  name:'小人', icon:'😏', color:'#f97316',
    comments:['偶尔耍点小聪明，小便宜占多了可不好。','心眼子不少，用在正道上会更出彩。'] },
  { min:0,  max:49,  name:'坏人', icon:'😈', color:'#ef4444',
    comments:['啧，小心点——开玩笑的，浪子回头金不换。','人品有待充值，从今天起做个好人吧。'] }
];
const MOR_WEALTH = ['近期财运平平，存钱比赚钱靠谱。','小财不断，大财看缘分。','有意外进账的可能，留意红包和账单。','花钱欲望强，这个月先管住手。'];
const MOR_LOVE   = ['桃花运在线，多出门走走有惊喜。','桃花一般，先提升自己缘分自来。','旧人可能回头，冷静处理别冲动。','正缘在路上，别急慢慢来。'];
const MOR_CAREER = ['事业运稳，适合深耕手上的项目。','有贵人相助，大胆表达你的想法。','别频繁变动，沉淀一下更有利。','小机会不少，接住一个就赚了。'];
const MOR_HEALTH = ['早睡早起，身体会感谢你。','注意腰颈，别久坐多起身。','情绪有点down，出去透透气。','状态不错，适合安排一波运动。'];
let _morCache = null;
function initMorality(){
  _morCache = null;
  const yearSel = document.getElementById('morYear');
  const monthSel = document.getElementById('morMonth');
  const daySel = document.getElementById('morDay');
  const curYear = new Date().getFullYear();
  let yOpts = '';
  for(let y = curYear; y >= 1950; y--){ yOpts += '<option value="' + y + '"' + (y===2000?' selected':'') + '>' + y + '年</option>'; }
  yearSel.innerHTML = yOpts;
  let mOpts = '';
  for(let m = 1; m <= 12; m++){ mOpts += '<option value="' + m + '">' + m + '月</option>'; }
  monthSel.innerHTML = mOpts;
  let dOpts = '';
  for(let d = 1; d <= 31; d++){ dOpts += '<option value="' + d + '">' + d + '日</option>'; }
  daySel.innerHTML = dOpts;
  document.getElementById('moralityResult').innerHTML =
    '<div style="text-align:center;color:var(--text-placeholder);padding:24px 0;font-size:14px;">输入名字和生日，算算你的人品值~</div>';
}
function moralityCalc(){
  const name = document.getElementById('morName').value.trim();
  if(!name){ showToast('请先输入你的名字哦~'); return; }
  const y = document.getElementById('morYear').value;
  const m = document.getElementById('morMonth').value;
  const d = document.getElementById('morDay').value;
  const today = getTodaySeed();
  const rng = gbRng('mor_' + today + '_' + name + '_' + y + '-' + m + '-' + d);
  const score = Math.floor(rng() * 101);
  let lv = MOR_LEVELS[0];
  for(let i=0;i<MOR_LEVELS.length;i++){
    if(score >= MOR_LEVELS[i].min){ lv = MOR_LEVELS[i]; break; }
  }
  const comment = lv.comments[Math.floor(rng() * lv.comments.length)];
  const wealth = MOR_WEALTH[Math.floor(rng() * MOR_WEALTH.length)];
  const love = MOR_LOVE[Math.floor(rng() * MOR_LOVE.length)];
  const career = MOR_CAREER[Math.floor(rng() * MOR_CAREER.length)];
  const health = MOR_HEALTH[Math.floor(rng() * MOR_HEALTH.length)];
  _morCache = { name:name, bd:y + '年' + m + '月' + d + '日', score:score, lv:lv, comment:comment, wealth:wealth, love:love, career:career, health:health };
  document.getElementById('moralityResult').innerHTML =
    '<div class="quiz-result-card" style="text-align:center;">' +
      '<div style="font-size:14px;color:var(--text-secondary);">' + name + '（' + (y + '-' + m + '-' + d) + '）人品计算</div>' +
      '<div style="font-size:56px;font-weight:bold;color:' + lv.color + ';line-height:1.2;">' + score + '</div>' +
      '<div style="font-size:18px;font-weight:600;color:' + lv.color + ';">' + lv.icon + ' ' + lv.name + '</div>' +
      '<div class="qr-desc" style="text-align:left;margin-top:10px;">' + comment + '</div>' +
      '<div style="margin-top:14px;text-align:left;display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
        '<div style="background:#fffbeb;border-radius:10px;padding:10px;font-size:12px;line-height:1.5;">💰<br>' + wealth + '</div>' +
        '<div style="background:#fdf2f8;border-radius:10px;padding:10px;font-size:12px;line-height:1.5;">💕<br>' + love + '</div>' +
        '<div style="background:#eff6ff;border-radius:10px;padding:10px;font-size:12px;line-height:1.5;">💼<br>' + career + '</div>' +
        '<div style="background:#f0fdf4;border-radius:10px;padding:10px;font-size:12px;line-height:1.5;">🏥<br>' + health + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
        '<button class="common-btn" onclick="moralityCalc()">🔄 重新计算</button>' +
        '<button class="common-btn btn-primary" onclick="morShareResult()">📤 分享结果</button>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--text-placeholder);margin-top:8px;">※ 纯娱乐，人品好不好还是看你自己~</div>' +
    '</div>';
}
function morShareResult(){
  if(!_morCache){ showToast('先算一算再分享哦~'); return; }
  const c = _morCache;
  gbShareText('⚖️ 人品计算器：「' + c.name + '」的人品值 ' + c.score + '，等级：' + c.lv.icon + c.lv.name + '！财运：' + c.wealth + ' 快来测测你的人品~');
}

