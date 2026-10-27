/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagePendulumPage", "<!-- pagePendulumPage -->\n<div class=\"tool-page\" id=\"pagePendulumPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🔮 灵摆占卜</h3>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-secondary);margin:8px 0 16px;\">在心中默念你的问题，然后启动灵摆，观察摆动方向获取答案</p>\n      <div class=\"pendulum-setup\">\n        <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:4px 0 8px;\">输入你的问题（可选）</label>\n        <input id=\"pendulumQuestion\" placeholder=\"例如：我最近适合换工作吗？\">\n      </div>\n      <div class=\"pendulum-stage\">\n        <div class=\"pendulum-stand\"></div>\n        <div class=\"pendulum-swing\" id=\"pendulumSwing\">\n          <div class=\"pendulum-string\"></div>\n          <div class=\"pendulum-bob\">🔮</div>\n        </div>\n      </div>\n      <div style=\"text-align:center;margin:12px 0;\">\n        <button class=\"common-btn btn-primary\" onclick=\"pendulumStart()\" id=\"pendulumStartBtn\">🔮 启动灵摆</button>\n        <button class=\"common-btn\" onclick=\"pendulumReset()\">🔄 重置</button>\n      </div>\n      <div class=\"pendulum-result\" id=\"pendulumResult\" style=\"display:none;\">\n        <div class=\"pr-answer\" id=\"pendulumAnswer\"></div>\n        <div class=\"pr-text\" id=\"pendulumText\"></div>\n      </div>\n      <div style=\"display:flex;gap:12px;justify-content:center;margin-top:16px;flex-wrap:wrap;font-size:12px;color:var(--text-secondary);\">\n        <span>↻ 顺时针=是</span>\n        <span>↺ 逆时针=否</span>\n        <span>↔ 左右=不确定</span>\n        <span>↕ 上下=肯定但需等待</span>\n      </div>\n    </div>\n  </div>");
// ==================== 灵摆占卜 ====================
const PENDULUM_ANSWERS=[
  {dir:'cw',answer:'是 ✅',text:'灵摆顺时针转动，答案倾向于"是"。你所问的事情有积极的发展趋势，可以放心推进。',icon:'↻'},
  {dir:'ccw',answer:'否 ❌',text:'灵摆逆时针转动，答案倾向于"否"。当前可能不是最佳时机，建议暂缓或重新考虑。',icon:'↺'},
  {dir:'h',answer:'不确定 ⚠️',text:'灵摆左右摆动，答案不确定。事情还在变化中，信息不够充分，建议等待更多线索。',icon:'↔'},
  {dir:'v',answer:'肯定但需等待 ⏳',text:'灵摆上下摆动，答案是肯定的但需要等待。方向正确，但时机尚未成熟，耐心准备。',icon:'↕'}
];

function pendulumStart(){
  const q=document.getElementById('pendulumQuestion').value.trim();
  const btn=document.getElementById('pendulumStartBtn');
  btn.disabled=true;btn.textContent='🔮 摆动中...';
  document.getElementById('pendulumResult').style.display='none';
  const swing=document.getElementById('pendulumSwing');
  swing.className='pendulum-swing';
  void swing.offsetWidth;
  const answer=PENDULUM_ANSWERS[Math.floor(Math.random()*PENDULUM_ANSWERS.length)];
  swing.classList.add('swing-'+answer.dir);
  setTimeout(()=>{
    swing.className='pendulum-swing';
    document.getElementById('pendulumAnswer').textContent=answer.icon+' '+answer.answer;
    document.getElementById('pendulumText').textContent=(q?'你问：「'+q+'」\n':'')+answer.text;
    document.getElementById('pendulumResult').style.display='block';
    btn.disabled=false;btn.textContent='🔮 再问一次';
  },3000);
}

function pendulumReset(){
  document.getElementById('pendulumQuestion').value='';
  document.getElementById('pendulumSwing').className='pendulum-swing';
  document.getElementById('pendulumResult').style.display='none';
  document.getElementById('pendulumStartBtn').textContent='🔮 启动灵摆';
}

// 工具专属样式按需随对应模块加载。
(function installToolStyles(){
  if(document.getElementById('flPendulumStyles'))return;
  /* Styles moved to css/toolbox-56-灵摆占卜.css. */
})();
