/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagebrainTestPage", "<!-- pagebrainTestPage -->\n<div class=\"tool-page\" id=\"pagebrainTestPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🧩 左右脑测试</h3>\n      <div id=\"btQuiz\"></div>\n      <div id=\"btResult\" style=\"display:none;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：左右脑测试 ====================
const BT_QUESTIONS=[
  {q:'看地图或导航时，你？',opts:[{t:'很快能找到方向',brain:'L'},{t:'经常分不清东南西北',brain:'R'}]},
  {q:'你更擅长？',opts:[{t:'数学和逻辑推理',brain:'L'},{t:'音乐和艺术创作',brain:'R'}]},
  {q:'做决定时你更依赖？',opts:[{t:'数据分析和事实',brain:'L'},{t:'直觉和感觉',brain:'R'}]},
  {q:'你更喜欢的学习方式？',opts:[{t:'按步骤有条理地学',brain:'L'},{t:'整体感知，跳跃式学习',brain:'R'}]},
  {q:'你对时间的感觉？',opts:[{t:'很准时，时间观念强',brain:'L'},{t:'经常忘记时间，沉浸其中',brain:'R'}]},
  {q:'表达想法时你更倾向于？',opts:[{t:'用语言清晰描述',brain:'L'},{t:'用手势、图画或表情',brain:'R'}]},
  {q:'你更欣赏哪种人？',opts:[{t:'理性冷静，逻辑清晰',brain:'L'},{t:'感性浪漫，富有创意',brain:'R'}]},
  {q:'房间乱了你的反应？',opts:[{t:'立刻收拾整理',brain:'L'},{t:'乱中有序，不影响',brain:'R'}]},
  {q:'看电影时你更关注？',opts:[{t:'剧情逻辑和细节',brain:'L'},{t:'画面美感和音乐',brain:'R'}]},
  {q:'你更相信？',opts:[{t:'科学证明的结论',brain:'L'},{t:'内心的感受',brain:'R'}]}
];
let btAnswers=[];
function btRender(){
  btAnswers=[];
  const html=BT_QUESTIONS.map((q,i)=>`
    <div class="quiz-question">${i+1}. ${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map((o,j)=>`<button class="quiz-option" onclick="btAnswer(${i},${j},this)">${o.t}</button>`).join('')}
    </div>
  `).join('');
  document.getElementById('btQuiz').innerHTML=html;
  document.getElementById('btResult').style.display='none';
}
function btAnswer(qi,oi,btn){
  btAnswers[qi]=BT_QUESTIONS[qi].opts[oi].brain;
  btn.parentElement.querySelectorAll('.quiz-option').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  if(btAnswers.filter(a=>a!==undefined).length===BT_QUESTIONS.length){
    setTimeout(btShowResult,300);
  }
}
function btShowResult(){
  const left=btAnswers.filter(b=>b==='L').length;
  const right=btAnswers.filter(b=>b==='R').length;
  const leftPct=Math.round(left/BT_QUESTIONS.length*100);
  const rightPct=100-leftPct;
  let type='',desc='',color='';
  if(leftPct>=70){type='左脑主导型';desc='你是典型的左脑型人，逻辑思维强，擅长分析、推理和语言表达，做事有条理，适合从事科研、法律、工程等领域。';color='#3b82f6';}
  else if(rightPct>=70){type='右脑主导型';desc='你是典型的右脑型人，直觉敏锐，富有创造力和想象力，擅长艺术、音乐和空间感知，适合从事设计、艺术、创作等领域。';color='#ec4899';}
  else{type='左右脑均衡型';desc='你的左右脑发展均衡，既有逻辑思维能力，又有创造力和直觉，能在理性和感性之间灵活切换，是难得的全脑型人才！';color='#8b5cf6';}
  document.getElementById('btQuiz').innerHTML='';
  document.getElementById('btResult').style.display='block';
  document.getElementById('btResult').innerHTML=
    `<div class="quiz-result-card">
      <div style="display:flex;justify-content:space-around;margin:16px 0;">
        <div><div style="font-size:32px;font-weight:bold;color:#3b82f6;">${leftPct}%</div><div style="font-size:13px;color:var(--text-secondary);">左脑（逻辑）</div></div>
        <div><div style="font-size:32px;font-weight:bold;color:#ec4899;">${rightPct}%</div><div style="font-size:13px;color:var(--text-secondary);">右脑（创造）</div></div>
      </div>
      <div style="font-size:20px;font-weight:bold;color:${color};margin:12px 0;">${type}</div>
      <div class="qr-desc">${desc}</div>
      <button class="common-btn" onclick="btRender()" style="margin-top:16px;">🔄 重新测试</button>
    </div>`;
}
btRender();

