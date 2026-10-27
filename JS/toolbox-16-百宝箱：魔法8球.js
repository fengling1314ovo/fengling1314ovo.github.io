/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageMagic8Page", "<!-- pageMagic8Page -->\n<div class=\"tool-page\" id=\"pageMagic8Page\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔮 魔法8球</h3>\n      <div class=\"magic8-area\">\n        <div class=\"magic8-ball\" id=\"magic8Ball\">\n          <div class=\"magic8-answer waiting\" id=\"magic8Answer\">8</div>\n        </div>\n        <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:4px 0 8px;\">输入你的问题</label>\n        <input id=\"magic8Question\" placeholder=\"例如：今天会有好事发生吗？\">\n        <br>\n        <button class=\"common-btn\" onclick=\"magic8Shake()\">🔮 摇动魔法球</button>\n        <div id=\"magic8QuestionShow\" style=\"margin-top:12px;font-size:14px;color:var(--text-secondary);min-height:20px;\"></div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：魔法8球 ====================
const MAGIC8_ANSWERS=[
  '毫无疑问','是的，一定','毫无疑问','是的，肯定如此','你可以依靠它',
  '如我所见，是的','大概率','前景看好','迹象表明是的','是的',
  '回答模糊，再试一次','稍后再问','最好现在不告诉你','现在无法预测','集中注意力再问',
  '别指望了','我的回答是不','我的消息说不','前景不太好','非常怀疑'
];
let magic8Shaking=false;
function magic8Shake(){
  if(magic8Shaking)return;
  const q=document.getElementById('magic8Question').value.trim();
  const ball=document.getElementById('magic8Ball');
  const answer=document.getElementById('magic8Answer');
  magic8Shaking=true;
  ball.classList.add('shaking');
  answer.textContent='...';answer.classList.add('waiting');
  document.getElementById('magic8QuestionShow').textContent=q?('❓ '+q):'';
  setTimeout(()=>{
    const a=MAGIC8_ANSWERS[Math.floor(Math.random()*MAGIC8_ANSWERS.length)];
    answer.textContent=a;answer.classList.remove('waiting');
    ball.classList.remove('shaking');
    magic8Shaking=false;
    showToast('🔮 答案已揭晓');
  },700);
}

