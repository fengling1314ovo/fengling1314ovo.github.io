/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageAnimalPersonalityPage", "<!-- pageAnimalPersonalityPage -->\n<div class=\"tool-page\" id=\"pageAnimalPersonalityPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🐾 动物性格测试</h3>\n      <div style=\"font-size:13px;color:var(--text-secondary);margin-bottom:8px;\">10道小题，看看你内心住着什么小动物~</div>\n      <div id=\"apQuiz\"></div>\n      <div id=\"apResult\" style=\"display:none;\"></div>\n      <p style=\"text-align:center;font-size:12px;color:var(--text-placeholder);margin-top:14px;\">※ 纯娱乐测试，别太当真哦</p>\n    </div>\n  </div>");
// ==================== 动物性格测试 ====================
const AP_QUESTIONS = [
  { q:'周末你更愿意？', opts:[
    { t:'约一群朋友热闹聚会', a:'dog' },
    { t:'找个角落看书发呆', a:'cat' },
    { t:'跟着朋友走，去哪都行', a:'panda' },
    { t:'来一场说走就走的冒险', a:'tiger' }
  ]},
  { q:'朋友找你倾诉麻烦，你会？', opts:[
    { t:'立刻放下手头事冲过去', a:'dog' },
    { t:'冷静分析，给出解决方案', a:'fox' },
    { t:'默默陪着，听Ta把话说完', a:'rabbit' },
    { t:'带Ta去大吃一顿转换心情', a:'dolphin' }
  ]},
  { q:'你心目中理想的生活是？', opts:[
    { t:'有自己的小天地，不被打扰', a:'cat' },
    { t:'家人朋友常伴，热热闹闹', a:'dog' },
    { t:'悠闲自在，慢节奏不内卷', a:'panda' },
    { t:'不断挑战，成为人群焦点', a:'lion' }
  ]},
  { q:'工作/学习中你更像？', opts:[
    { t:'独立高效，按自己节奏来', a:'cat' },
    { t:'说干就干，目标感极强', a:'tiger' },
    { t:'团队润滑剂，照顾大家情绪', a:'dolphin' },
    { t:'点子最多，总想到新玩法', a:'fox' }
  ]},
  { q:'和人起了冲突，你通常？', opts:[
    { t:'当场正面刚，绝不怂', a:'tiger' },
    { t:'察言观色，找台阶大家都下', a:'fox' },
    { t:'先退让，事后自己消化', a:'rabbit' },
    { t:'主动沟通，把话说开就好', a:'dolphin' }
  ]},
  { q:'你觉得自己最大的魅力是？', opts:[
    { t:'神秘又高级，让人想靠近', a:'cat' },
    { t:'真诚热情，谁都愿意跟你玩', a:'dog' },
    { t:'温柔体贴，让人觉得很舒服', a:'rabbit' },
    { t:'气场强大，自带主角光环', a:'lion' }
  ]},
  { q:'用一个词形容你，朋友最可能说？', opts:[
    { t:'气场强大', a:'lion' },
    { t:'佛系随和', a:'panda' },
    { t:'机灵鬼马', a:'fox' },
    { t:'治愈暖心', a:'dolphin' }
  ]},
  { q:'突如其来的压力让你？', opts:[
    { t:'越挫越勇，正面突破', a:'lion' },
    { t:'先躺平睡一觉再说', a:'panda' },
    { t:'制定计划，逐个击破', a:'tiger' },
    { t:'找人聊聊释放一下', a:'rabbit' }
  ]},
  { q:'你更喜欢的旅行方式？', opts:[
    { t:'做足攻略的深度自由行', a:'fox' },
    { t:'随便走走，随遇而安', a:'panda' },
    { t:'打卡网红地，拍照分享', a:'dolphin' },
    { t:'独自探险，去人少的地方', a:'cat' }
  ]},
  { q:'朋友最可能说你？', opts:[
    { t:'答应的事一定办到，靠谱', a:'dog' },
    { t:'关键时刻当机立断', a:'tiger' },
    { t:'情绪稳定，永远温柔', a:'rabbit' },
    { t:'有担当，能扛事', a:'lion' }
  ]}
];
const AP_ANIMALS = {
  cat:     { emoji:'🐱', name:'猫', tag:'独立优雅', desc:'你独立优雅，有自己的节奏和小世界。不喜欢被打扰，也不轻易依赖别人。看似高冷，其实内心柔软，只对信任的人展露慵懒的一面。审美在线，活得精致又克制。', career:'自由职业者 / 设计师 / 作家', match:'海豚🐬、兔子🐰' },
  dog:     { emoji:'🐶', name:'狗', tag:'忠诚热情', desc:'你忠诚热情，待人真诚，是朋友眼里最靠谱的那个。行动力强，答应的事一定办到。情绪都写在脸上，开心就摇尾巴，难过也藏不住，简单又热烈。', career:'老师 / 护士 / 团队协调', match:'狮子🦁、熊猫🐼' },
  rabbit:  { emoji:'🐰', name:'兔子', tag:'温和敏感', desc:'你温和敏感，心思细腻，很会察言观色。不喜欢冲突，习惯照顾别人的感受。看似软萌，其实内心有自己的坚持，需要安全感，也值得被好好对待。', career:'心理咨询师 / 编辑 / 设计师', match:'猫咪🐱、海豚🐬' },
  fox:     { emoji:'🦊', name:'狐狸', tag:'聪明狡黠', desc:'你聪明狡黠，反应快得像装了导航。点子多、脑洞大，擅长在复杂局面里找到最优解。偶尔有点小傲娇，但机灵有趣，跟你相处永远不会无聊。', career:'策划 / 投资人 / 侦探', match:'老虎🐯、猫咪🐱' },
  lion:    { emoji:'🦁', name:'狮子', tag:'自信领导', desc:'你自信果断，天生带着气场。目标感极强，说一不二，关键时刻总能站出来扛事。爱面子也讲义气，是朋友圈里的主心骨，追随你的人很多。', career:'管理者 / 创业者 / 项目负责人', match:'狗狗🐶、老虎🐯' },
  panda:   { emoji:'🐼', name:'熊猫', tag:'随和佛系', desc:'你随和佛系，与世无争，主打一个随缘。不争不抢不是没想法，而是觉得开心最重要。吃好喝好睡好，是朋友圈里的治愈系，谁都愿意靠近你。', career:'公务员 / 美食博主 / 运营', match:'熊猫🐼、兔子🐰' },
  tiger:   { emoji:'🐯', name:'老虎', tag:'勇敢果断', desc:'你勇敢果断，行动力拉满，认准的事就一往无前。不喜欢拖泥带水，气场全开的时候连自己都怕。偶尔冲动，但重情重义，值得深交。', career:'创业者 / 运动员 / 销售', match:'狮子🦁、狐狸🦊' },
  dolphin: { emoji:'🐬', name:'海豚', tag:'聪慧友善', desc:'你聪慧友善，情商很高，天生的气氛担当。擅长沟通和共情，到哪都能迅速融入。脑子转得快又爱玩，把生活过成了一场快乐的派对。', career:'主持人 / 公关 / 教师', match:'海豚🐬、狗狗🐶' }
};
const AP_ORDER = ['cat','dog','rabbit','fox','lion','panda','tiger','dolphin'];
let apAnswers = [];
let _apBest = null;
function initAnimalPersonality(){ apRender(); }
function apRender(){
  apAnswers = [];
  let html = '';
  AP_QUESTIONS.forEach(function(q, i){
    html += '<div class="quiz-question">' + (i+1) + '. ' + q.q + '</div><div class="quiz-options">' +
      q.opts.map(function(o, j){ return '<button class="quiz-option" onclick="apAnswer(' + i + ',' + j + ',this)">' + o.t + '</button>'; }).join('') +
    '</div>';
  });
  document.getElementById('apQuiz').innerHTML = html;
  document.getElementById('apResult').style.display = 'none';
  document.getElementById('apResult').innerHTML = '';
}
function apAnswer(qi, oi, btn){
  apAnswers[qi] = AP_QUESTIONS[qi].opts[oi].a;
  const siblings = btn.parentElement.querySelectorAll('.quiz-option');
  siblings.forEach(function(b){ b.classList.remove('selected'); });
  btn.classList.add('selected');
  const answered = apAnswers.filter(function(a){ return a !== undefined; }).length;
  if(answered === AP_QUESTIONS.length) setTimeout(apShowResult, 300);
}
function apShowResult(){
  const scores = {};
  AP_ORDER.forEach(function(k){ scores[k] = 0; });
  apAnswers.forEach(function(a){ scores[a]++; });
  let best = AP_ORDER[0];
  AP_ORDER.forEach(function(k){ if(scores[k] > scores[best]) best = k; });
  const info = AP_ANIMALS[best];
  document.getElementById('apQuiz').innerHTML = '';
  document.getElementById('apResult').style.display = 'block';
  document.getElementById('apResult').innerHTML =
    '<div class="quiz-result-card" style="text-align:center;">' +
      '<div style="font-size:64px;line-height:1.2;">' + info.emoji + '</div>' +
      '<div style="font-size:22px;font-weight:bold;margin:8px 0;">' + info.name + ' · ' + info.tag + '</div>' +
      '<div class="qr-desc" style="text-align:left;">' + info.desc + '</div>' +
      '<div style="margin-top:12px;font-size:14px;color:var(--text-secondary);">💼 适合职业：' + info.career + '</div>' +
      '<div style="margin-top:6px;font-size:14px;color:var(--text-secondary);">💞 最佳拍档：' + info.match + '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:18px;flex-wrap:wrap;">' +
        '<button class="common-btn" onclick="apRender()">🔄 重新测试</button>' +
        '<button class="common-btn btn-primary" onclick="apShareResult()">📤 分享结果</button>' +
      '</div>' +
    '</div>';
  _apBest = best;
}
function apShareResult(){
  const info = AP_ANIMALS[_apBest] || AP_ANIMALS.cat;
  gbShareText('🐾 动物性格测试：我内心住着的是 ' + info.emoji + info.name + '（' + info.tag + '）！' + info.desc + ' 适合职业：' + info.career + '。快来测测你是什么动物~');
}

