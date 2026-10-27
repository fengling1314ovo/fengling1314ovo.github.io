/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagementalAgePage", "<!-- pagementalAgePage -->\n<div class=\"tool-page\" id=\"pagementalAgePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🧠 心理年龄测试</h3>\n      <div id=\"maQuiz\"></div>\n      <div id=\"maResult\" style=\"display:none;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：心理年龄测试 ====================
const MA_QUESTIONS=[
  {q:'周末你更喜欢？',opts:[{t:'宅在家里追剧',s:2},{t:'和朋友出去玩',s:1},{t:'学习充电',s:3},{t:'户外运动',s:1}]},
  {q:'看到朋友圈有人晒旅游，你会？',opts:[{t:'羡慕，也想去',s:1},{t:'无感，自己过得好就行',s:3},{t:'点赞评论',s:2},{t:'立刻规划下一次旅行',s:1}]},
  {q:'你对未来的规划是？',opts:[{t:'走一步看一步',s:1},{t:'有短期目标',s:2},{t:'有清晰的五年规划',s:3},{t:'还没想过',s:1}]},
  {q:'遇到困难时你通常？',opts:[{t:'找朋友倾诉',s:1},{t:'自己想办法解决',s:3},{t:'先逃避再说',s:1},{t:'分析问题逐步解决',s:3}]},
  {q:'你觉得自己最需要的是？',opts:[{t:'快乐',s:1},{t:'钱',s:2},{t:'成长',s:3},{t:'陪伴',s:1}]},
  {q:'对新鲜事物的态度？',opts:[{t:'非常好奇，想尝试',s:1},{t:'看有没有用',s:2},{t:'不太感兴趣',s:3},{t:'等别人试过再说',s:2}]},
  {q:'你更认同哪句话？',opts:[{t:'及时行乐',s:1},{t:'活在当下',s:2},{t:'未雨绸缪',s:3},{t:'顺其自然',s:2}]},
  {q:'生气的时候你会？',opts:[{t:'直接爆发',s:1},{t:'生闷气',s:2},{t:'冷静后沟通',s:3},{t:'转头就忘',s:1}]}
];
let maAnswers=[];
function maRender(){
  maAnswers=[];
  const html=MA_QUESTIONS.map((q,i)=>`
    <div class="quiz-question">${i+1}. ${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map((o,j)=>`<button class="quiz-option" onclick="maAnswer(${i},${j},this)">${o.t}</button>`).join('')}
    </div>
  `).join('');
  document.getElementById('maQuiz').innerHTML=html;
  document.getElementById('maResult').style.display='none';
}
function maAnswer(qi,oi,btn){
  maAnswers[qi]=MA_QUESTIONS[qi].opts[oi].s;
  btn.parentElement.querySelectorAll('.quiz-option').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  if(maAnswers.filter(a=>a!==undefined).length===MA_QUESTIONS.length){
    setTimeout(maShowResult,300);
  }
}
function maShowResult(){
  const total=maAnswers.reduce((a,b)=>a+b,0);
  const avg=total/MA_QUESTIONS.length;
  let age='',desc='',color='';
  if(avg<=1.3){age='18岁以下';desc='你保持着一颗纯真的童心，对世界充满好奇和热情，快乐是你最大的追求！';color='#3b82f6';}
  else if(avg<=1.8){age='18-25岁';desc='你正处于青春洋溢的年纪，有冲劲有梦想，对未来充满期待，偶尔也会有些迷茫。';color='#22c55e';}
  else if(avg<=2.3){age='26-35岁';desc='你已经逐渐成熟，有自己的目标和规划，懂得在理想和现实之间找到平衡。';color='#f59e0b';}
  else if(avg<=2.7){age='36-50岁';desc='你阅历丰富，处事沉稳，懂得取舍，对人生有自己独到的见解。';color='#f97316';}
  else{age='50岁以上';desc='你拥有一颗通透的心，看破世事，淡泊名利，追求内心的平静和幸福。';color='#8b5cf6';}
  document.getElementById('maQuiz').innerHTML='';
  document.getElementById('maResult').style.display='block';
  document.getElementById('maResult').innerHTML=
    `<div class="quiz-result-card">
      <div class="qr-score" style="color:${color};">${age}</div>
      <div style="font-size:18px;font-weight:bold;margin:8px 0;color:${color};">心理年龄</div>
      <div class="qr-desc">${desc}</div>
      <button class="common-btn" onclick="maRender()" style="margin-top:16px;">🔄 重新测试</button>
    </div>`;
}
maRender();

