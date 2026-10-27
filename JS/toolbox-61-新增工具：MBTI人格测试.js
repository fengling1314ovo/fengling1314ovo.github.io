/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageMbtiPage", "<!-- pageMbtiPage -->\n<div class=\"tool-page\" id=\"pageMbtiPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🧬 MBTI人格测试</h3>\n      <div id=\"mbtiQuiz\"></div>\n      <div id=\"mbtiResult\" style=\"display:none;\"></div>\n    </div>\n  </div>");
// ==================== 新增工具：MBTI人格测试 ====================
const MBTI_QUESTIONS=[
  {q:'周末你更倾向于？',opts:[{t:'和朋友聚会、热闹',m:'E'},{t:'独处充电、安静',m:'I'}]},
  {q:'你更关注？',opts:[{t:'具体的事实和细节',m:'S'},{t:'未来的可能和联想',m:'N'}]},
  {q:'做决定时你更看重？',opts:[{t:'逻辑和客观分析',m:'T'},{t:'感受和人际关系',m:'F'}]},
  {q:'你更喜欢？',opts:[{t:'提前规划、按计划走',m:'J'},{t:'随机应变、灵活自由',m:'P'}]},
  {q:'在团队里你通常？',opts:[{t:'主动发言、带动气氛',m:'E'},{t:'安静倾听、需要时再说',m:'I'}]},
  {q:'你更容易记住？',opts:[{t:'实际发生过的事',m:'S'},{t:'脑海中的想象',m:'N'}]},
  {q:'朋友找你倾诉，你会？',opts:[{t:'先帮Ta分析解决办法',m:'T'},{t:'先安抚Ta的情绪',m:'F'}]},
  {q:'面对突然的变故，你？',opts:[{t:'有点焦虑，希望有计划',m:'J'},{t:'觉得刺激，随机应变',m:'P'}]},
  {q:'学习新东西时你？',opts:[{t:'喜欢按步骤慢慢来',m:'S'},{t:'喜欢整体把握、跳跃联想',m:'N'}]},
  {q:'你更在意？',opts:[{t:'事情对不对',m:'T'},{t:'大家开不开心',m:'F'}]},
  {q:'你的书桌通常？',opts:[{t:'整洁有序',m:'J'},{t:'乱中有序',m:'P'}]},
  {q:'你更愿意？',opts:[{t:'和人交流获取能量',m:'E'},{t:'独处思考获取能量',m:'I'}]}
];
let mbtiAnswers=[];
function mbtiRender(){
  mbtiAnswers=[];
  let html='';
  MBTI_QUESTIONS.forEach((q,i)=>{
    html+='<div class="quiz-question">'+(i+1)+'. '+q.q+'</div><div class="quiz-options">'+
      q.opts.map((o,j)=>'<button class="quiz-option" onclick="mbtiAnswer('+i+','+j+',this)">'+o.t+'</button>').join('')+
      '</div>';
  });
  document.getElementById('mbtiQuiz').innerHTML=html;
  document.getElementById('mbtiResult').style.display='none';
}
function mbtiAnswer(qi,oi,btn){
  mbtiAnswers[qi]=MBTI_QUESTIONS[qi].opts[oi].m;
  btn.parentElement.querySelectorAll('.quiz-option').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  if(mbtiAnswers.filter(a=>a!==undefined).length===MBTI_QUESTIONS.length)setTimeout(mbtiShowResult,300);
}
const MBTI_TYPES={
  'INTJ':['建筑师','独立冷静、有远见，擅长制定长期战略。'],
  'INTP':['逻辑学家','思维缜密、热爱钻研，喜欢探究事物的本质。'],
  'ENTJ':['指挥官','天生的领导者，目标明确、执行力强。'],
  'ENTP':['辩论家','思维活跃、点子多，享受思想的碰撞。'],
  'INFJ':['提倡者','理想主义者，洞察人心、富有同理心。'],
  'INFP':['调停者','温柔敏感、忠于内心，追求意义与美好。'],
  'ENFJ':['主人公','天生的领袖，热情感染他人、乐于助人。'],
  'ENFP':['竞选者','热情开朗、富有想象力，走到哪里都是焦点。'],
  'ISTJ':['物流师','务实可靠、条理分明，是团队的中坚力量。'],
  'ISFJ':['守卫者','细心体贴、忠诚可靠，默默守护身边的人。'],
  'ESTJ':['总经理','果断高效、重视秩序，天生的管理者。'],
  'ESFJ':['执政官','热心周到、重视和谐，擅长照顾他人。'],
  'ISTP':['鉴赏家','冷静务实、动手能力强，喜欢探索与实践。'],
  'ISFP':['探险家','随性自由、审美出众，享受当下的美好。'],
  'ESTP':['企业家','大胆果敢、行动派，享受刺激与冒险。'],
  'ESFP':['表演者','活泼外向、热爱生活，天生的快乐源泉。']
};
function mbtiShowResult(){
  const counts={E:0,I:0,S:0,N:0,T:0,F:0,J:0,P:0};
  mbtiAnswers.forEach(m=>counts[m]++);
  const type=(counts.E>=counts.I?'E':'I')+(counts.S>=counts.N?'S':'N')+(counts.T>=counts.F?'T':'F')+(counts.J>=counts.P?'J':'P');
  const info=MBTI_TYPES[type]||['神秘型','你的MBTI类型需要更多探索。'];
  document.getElementById('mbtiQuiz').innerHTML='';
  document.getElementById('mbtiResult').style.display='block';
  document.getElementById('mbtiResult').innerHTML=
    '<div class="quiz-result-card">'+
    '<div style="font-size:36px;font-weight:bold;color:var(--primary);">'+type+'</div>'+
    '<div style="font-size:18px;font-weight:bold;margin:8px 0;">'+info[0]+'</div>'+
    '<div class="qr-desc">'+info[1]+'</div>'+
    '<button class="common-btn" style="margin-top:16px;" onclick="mbtiRender()">🔄 重新测试</button>'+
    '</div>';
}
mbtiRender();

