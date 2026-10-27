/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageovulationPage", "<!-- pageovulationPage -->\n<div class=\"tool-page\" id=\"pageovulationPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🌸 排卵期计算器</h3>\n      <label>末次月经第一天</label>\n      <input type=\"date\" id=\"ovLast\">\n      <label>月经周期（天）</label>\n      <input id=\"ovCycle\" type=\"number\" value=\"28\" placeholder=\"一般28天\">\n      <label>经期持续（天）</label>\n      <input id=\"ovPeriod\" type=\"number\" value=\"5\" placeholder=\"一般5天\">\n      <br>\n      <button class=\"common-btn\" onclick=\"ovulationCalc()\">🌸 计算</button>\n      <div id=\"ovResult\" style=\"margin-top:16px;\"></div>\n      <p style=\"font-size:12px;color:var(--text-placeholder);margin-top:12px;\">※ 仅供参考，实际情况因人而异</p>\n    </div>\n  </div>");
// ==================== 百宝箱：排卵期计算器 ====================
function ovulationCalc(){
  const last=document.getElementById('ovLast').value;
  const cycle=Math.max(21,Math.min(40,Number(document.getElementById('ovCycle').value)||28));
  const period=Math.max(2,Math.min(10,Number(document.getElementById('ovPeriod').value)||5));
  if(!last){showToast('请选择末次月经日期');return;}
  const lastDate=new Date(last);
  const ovulation=new Date(lastDate);ovulation.setDate(ovulation.getDate()+cycle-14);
  const fertileStart=new Date(ovulation);fertileStart.setDate(fertileStart.getDate()-5);
  const fertileEnd=new Date(ovulation);fertileEnd.setDate(fertileEnd.getDate()+1);
  const nextPeriod=new Date(lastDate);nextPeriod.setDate(nextPeriod.getDate()+cycle);
  const safeStart=new Date(ovulation);safeStart.setDate(safeStart.getDate()+2);
  const safeEnd=new Date(nextPeriod);safeEnd.setDate(safeEnd.getDate()-1);
  function fmt(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
  document.getElementById('ovResult').innerHTML=
    `<div class="fortune-today-card">
      <div class="ft-title">周期分析（${cycle}天周期）</div>
      <div class="fortune-grid">
        <div class="fg-item"><div class="fg-label">🩸 经期</div><div class="fg-val">${fmt(lastDate)} ~ ${fmt(new Date(lastDate.getTime()+(period-1)*86400000))}</div></div>
        <div class="fg-item"><div class="fg-label">🥚 排卵日</div><div class="fg-val" style="color:#ec4899;">${fmt(ovulation)}</div></div>
        <div class="fg-item"><div class="fg-label">💕 易孕期</div><div class="fg-val" style="color:#f59e0b;">${fmt(fertileStart)} ~ ${fmt(fertileEnd)}</div></div>
        <div class="fg-item"><div class="fg-label">🛡️ 安全期</div><div class="fg-val" style="color:#10b981;">${fmt(safeStart)} ~ ${fmt(safeEnd)}</div></div>
        <div class="fg-item"><div class="fg-label">📅 下次月经</div><div class="fg-val">${fmt(nextPeriod)}</div></div>
      </div>
      <div style="margin-top:12px;font-size:12px;color:var(--text-placeholder);">※ 仅供参考，实际排卵受多种因素影响</div>
    </div>`;
}


