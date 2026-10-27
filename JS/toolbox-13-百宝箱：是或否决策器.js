/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageYesnoPage", "<!-- pageYesnoPage -->\n<div class=\"tool-page\" id=\"pageYesnoPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎯 是或否决策器</h3>\n      <button class=\"common-btn\" onclick=\"yesNoDecide()\">🎯 帮我做决定</button>\n      <button class=\"common-btn\" onclick=\"clearYesnoHistory()\">🗑 清空历史</button>\n      <div id=\"yesnoResult\" style=\"margin-top:12px;font-size:22px;font-weight:bold;min-height:30px;\"></div>\n      <div class=\"history-list\" id=\"yesnoHistory\">\n        <div class=\"history-empty\">暂无决策记录</div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：是或否决策器 ====================
const yesnoResultEl=document.getElementById('yesnoResult'), yesnoHistoryEl=document.getElementById('yesnoHistory');
const YESNO_LIST=['✅是的','❌不要','🤔再想想','✅可以做','❌不建议','👍没问题','👎算了吧','💡换个思路','🔥果断去做','🌧️今天不太合适','☀️正是好时机'];
let yesnoRolling=false;
function yesNoDecide(){
  if(yesnoRolling)return;
  yesnoRolling=true; let ticks=0;
  const anim=setInterval(()=>{
    yesnoResultEl.textContent=YESNO_LIST[Math.floor(Math.random()*YESNO_LIST.length)];
    ticks++; if(ticks>=12){ clearInterval(anim);
      const pick=YESNO_LIST[Math.floor(Math.random()*YESNO_LIST.length)];
      yesnoResultEl.textContent=pick;
      let hist=lsGet('yesno_history',[]);
      hist.unshift({text:pick,time:nowTimeStr()});
      if(hist.length>20)hist.length=20;
      lsSet('yesno_history',hist); renderYesnoHistory();
      yesnoRolling=false;
    }
  },65);
}
function renderYesnoHistory(){
  const hist=lsGet('yesno_history',[]);
  if(!hist.length){ yesnoHistoryEl.innerHTML='<div class="history-empty">暂无决策记录</div>'; return; }
  yesnoHistoryEl.innerHTML=hist.map(h=>`<div class="h-item"><span>${h.text}</span><span class="h-time">${h.time}</span></div>`).join('');
}
renderYesnoHistory();
function clearYesnoHistory(){ lsSet('yesno_history',[]); renderYesnoHistory(); showToast('历史已清空'); }

