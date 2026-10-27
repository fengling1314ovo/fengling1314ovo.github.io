// 天数计算：按 26.11.0 原始备份恢复页面与计算逻辑。
window.flRegisterToolPage('pageDayCalc', "<!-- 天数计算 -->\n  <div class=\"tool-page page-daycalc\" id=\"pageDayCalc\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0;\">\n      <h3>📅 天数计算器</h3>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>开始日期</label>\n        <input type=\"date\" id=\"dayStart\">\n      </div>\n      <div class=\"currency-row\">\n        <label>结束日期</label>\n        <input type=\"date\" id=\"dayEnd\">\n      </div>\n      <button type=\"button\" class=\"qr-btn\" onclick=\"calcDays();document.activeElement.blur();\">📊 计算天数差</button>\n      <div id=\"dayResult\" style=\"display:none;margin-top:16px;padding:20px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-color);text-align:center;\">\n        <div id=\"dayResultDays\" style=\"font-size:36px;font-weight:700;color:var(--primary);\"></div>\n        <div id=\"dayResultDetail\" style=\"font-size:14px;color:var(--text-secondary);margin-top:8px;line-height:1.8;\"></div>\n      </div>\n    </div>\n    <div style=\"max-width:500px;margin:20px auto;padding:0 28px;\">\n      <div style=\"font-size:15px;font-weight:700;color:var(--text-main);margin-bottom:12px;\">日期计算器</div>\n      <div style=\"display:flex;flex-direction:column;gap:12px;\">\n        <div style=\"padding:16px;border-radius:16px;background:rgba(255,255,255,0.28);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.5);box-shadow:0 4px 20px rgba(99,102,241,0.08);\">\n          <div style=\"font-size:14px;font-weight:600;color:var(--text-main);margin-bottom:10px;\">⬅️ 往前推算</div>\n          <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:8px;\">基准日期：<span id=\"beforeBaseLabel\" style=\"color:var(--primary);cursor:pointer;\" onclick=\"document.getElementById('beforeBaseRow').style.display=document.getElementById('beforeBaseRow').style.display==='none'?'block':'none';\">今天（点击修改）</span></div>\n          <div id=\"beforeBaseRow\" style=\"display:none;margin-bottom:8px;\">\n            <input type=\"date\" id=\"beforeBase\" style=\"width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:13px;color:var(--text-main);box-sizing:border-box;\">\n          </div>\n          <label style=\"font-size:12px;color:var(--text-secondary);display:block;margin-bottom:4px;\">往前多少天</label>\n          <input type=\"number\" id=\"beforeDays\" value=\"100\" min=\"0\" style=\"width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:14px;color:var(--text-main);box-sizing:border-box;margin-bottom:10px;\">\n          <button type=\"button\" class=\"qr-btn\" style=\"padding:10px;font-size:14px;width:100%;border-radius:12px;\" onclick=\"calcBefore();document.activeElement.blur();\">推算</button>\n          <div id=\"beforeResult\" style=\"margin-top:12px;text-align:center;font-size:14px;line-height:1.7;color:var(--text-secondary);\"></div>\n        </div>\n        <div style=\"padding:16px;border-radius:16px;background:rgba(255,255,255,0.28);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.5);box-shadow:0 4px 20px rgba(99,102,241,0.08);\">\n          <div style=\"font-size:14px;font-weight:600;color:var(--text-main);margin-bottom:10px;\">往后推算 ➡️</div>\n          <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:8px;\">基准日期：<span id=\"afterBaseLabel\" style=\"color:var(--primary);cursor:pointer;\" onclick=\"document.getElementById('afterBaseRow').style.display=document.getElementById('afterBaseRow').style.display==='none'?'block':'none';\">今天（点击修改）</span></div>\n          <div id=\"afterBaseRow\" style=\"display:none;margin-bottom:8px;\">\n            <input type=\"date\" id=\"afterBase\" style=\"width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:13px;color:var(--text-main);box-sizing:border-box;\">\n          </div>\n          <label style=\"font-size:12px;color:var(--text-secondary);display:block;margin-bottom:4px;\">往后多少天</label>\n          <input type=\"number\" id=\"afterDays\" value=\"100\" min=\"0\" style=\"width:100%;padding:10px 12px;border-radius:12px;border:1px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font-size:14px;color:var(--text-main);box-sizing:border-box;margin-bottom:10px;\">\n          <button type=\"button\" class=\"qr-btn\" style=\"padding:10px;font-size:14px;width:100%;border-radius:12px;\" onclick=\"calcAfter();document.activeElement.blur();\">推算</button>\n          <div id=\"afterResult\" style=\"margin-top:12px;text-align:center;font-size:14px;line-height:1.7;color:var(--text-secondary);\"></div>\n        </div>\n      </div>\n    </div>\n    <div style=\"max-width:500px;margin:20px auto;padding:0 28px 32px;\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;gap:8px;\">\n        <h3 style=\"margin:0;font-size:18px;\">🎊 节假日查询</h3>\n        <div style=\"display:flex;align-items:center;gap:6px;\">\n          <select id=\"holidayYearSelect\" onchange=\"loadHolidayList(this.value)\" style=\"padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);color:var(--text-primary);font-size:13px;\">\n          </select>\n          <button type=\"button\" class=\"back-btn\" style=\"padding:6px 12px;font-size:12px;min-height:30px;border-radius:10px;border:1px solid rgba(255,255,255,0.5);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);\" onclick=\"loadHolidayList(document.getElementById('holidayYearSelect').value);document.activeElement.blur();\">🔄 刷新</button>\n        </div>\n      </div>\n      <div id=\"holidayList\" style=\"padding:16px;border-radius:16px;background:rgba(255,255,255,0.28);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(255,255,255,0.5);box-shadow:0 4px 20px rgba(99,102,241,0.08);\">\n        <div style=\"text-align:center;color:var(--text-secondary);font-size:14px;\">点击刷新加载节日数据...</div>\n      </div>\n      <div style=\"margin-top:12px;text-align:center;font-size:12px;color:var(--text-placeholder);\">节假日查询API由枫铃工具箱后端直接提供，所有节日均为手动输入添加</div>\n    </div>\n  </div>");

function calcDays(){
  const s=document.getElementById('dayStart').value;
  const e=document.getElementById('dayEnd').value;
  if(!s||!e){showToast('请选择开始和结束日期');return;}
  const start=new Date(s);
  const end=new Date(e);
  const diff=Math.round((end-start)/(1000*60*60*24));
  const abs=Math.abs(diff);
  const years=Math.floor(abs/365);
  const months=Math.floor((abs%365)/30);
  const days=(abs%365)%30;
  let detail='';
  if(years>0)detail+=years+'年';
  if(months>0)detail+=months+'个月';
  detail+=days+'天';
  document.getElementById('dayResultDays').textContent=abs+' 天';
  let dir=diff>0?'之后':(diff<0?'之前':'今天');
  document.getElementById('dayResultDetail').innerHTML=
    (diff>=0?'从开始日期到结束日期':'从结束日期到开始日期')+'相差 <b>'+detail+'</b><br>'+
    (diff>0?'结束日期在开始日期之后 '+abs+' 天':(diff<0?'结束日期在开始日期之前 '+abs+' 天':'两个日期是同一天'));
  document.getElementById('dayResult').style.display='block';
}
function calcBefore(){
  let baseVal = document.getElementById('beforeBase').value;
  let base;
  if(baseVal){ base = new Date(baseVal); }
  else { base = new Date(); baseVal = base.getFullYear()+'-'+String(base.getMonth()+1).padStart(2,'0')+'-'+String(base.getDate()).padStart(2,'0'); document.getElementById('beforeBase').value = baseVal; }
  if(isNaN(base.getTime())){ showToast('基准日期无效'); return; }
  const days = parseInt(document.getElementById('beforeDays').value);
  if(isNaN(days) || days < 0){ showToast('请输入有效天数'); return; }
  const dayMs = 1000*60*60*24;
  const target = new Date(base.getTime() - days*dayMs);
  const fmt = d => d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日';
  const week = ['周日','周一','周二','周三','周四','周五','周六'];
  document.getElementById('beforeResult').innerHTML =
    '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">'+days+' 天前是</div>'+
    '<b style="color:var(--text-main);font-size:18px;">'+fmt(target)+'</b><br><span style="color:var(--text-secondary);font-size:13px;">'+week[target.getDay()]+'</span>';
}
function calcAfter(){
  let baseVal = document.getElementById('afterBase').value;
  let base;
  if(baseVal){ base = new Date(baseVal); }
  else { base = new Date(); baseVal = base.getFullYear()+'-'+String(base.getMonth()+1).padStart(2,'0')+'-'+String(base.getDate()).padStart(2,'0'); document.getElementById('afterBase').value = baseVal; }
  if(isNaN(base.getTime())){ showToast('基准日期无效'); return; }
  const days = parseInt(document.getElementById('afterDays').value);
  if(isNaN(days) || days < 0){ showToast('请输入有效天数'); return; }
  const dayMs = 1000*60*60*24;
  const target = new Date(base.getTime() + days*dayMs);
  const fmt = d => d.getFullYear()+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日';
  const week = ['周日','周一','周二','周三','周四','周五','周六'];
  document.getElementById('afterResult').innerHTML =
    '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">'+days+' 天后是</div>'+
    '<b style="color:var(--text-main);font-size:18px;">'+fmt(target)+'</b><br><span style="color:var(--text-secondary);font-size:13px;">'+week[target.getDay()]+'</span>';
}
async function loadHolidayList(selectedYear){
  const box=document.getElementById('holidayList');
  if(!box)return;
  const curYear=new Date().getFullYear();
  // 初始化年份下拉框
  const sel=document.getElementById('holidayYearSelect');
  if(sel&&sel.options.length===0){
    for(let y=curYear-3;y<=curYear+3;y++){
      const opt=document.createElement('option');
      opt.value=y;opt.textContent=y+'年';
      if(y===curYear)opt.selected=true;
      sel.appendChild(opt);
    }
  }
  const year=selectedYear?parseInt(selectedYear):curYear;
  if(sel)sel.value=year;
  box.innerHTML='<div style="text-align:center;color:var(--text-secondary);font-size:14px;">加载中...</div>';
  let holidays=[];
  try{
    const r=await fetch('https://api.fengling1314ovo.top/api/holidays?year='+year).then(r=>r.json());
    if(r&&r.ok&&r.data){
      holidays=r.data.map(h=>({name:h.name,date:h.date}));
    }
  }catch(e){/* 后端无数据 */}
  holidays.sort((a,b)=>a.date.localeCompare(b.date));
  if(holidays.length===0){
    box.innerHTML='<div style="text-align:center;color:var(--text-secondary);font-size:14px;">暂无节日数据</div>';
    return;
  }
  const now=new Date();now.setHours(0,0,0,0);
  let html='<div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;text-align:center;">'+year+'年节日一览</div>';
  for(const h of holidays){
    const d=new Date(h.date+'T00:00:00');
    const days=Math.ceil((d-now)/86400000);
    let status='';
    if(year<curYear)status='<span style="color:var(--text-secondary);opacity:0.5;">已过</span>';
    else if(days<0)status='<span style="color:var(--text-secondary);opacity:0.5;">已过</span>';
    else if(days===0)status='<span style="color:#10b981;font-weight:600;">今天</span>';
    else status='<span style="color:var(--primary);font-weight:600;">还有 '+days+' 天</span>';
    html+='<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-color);">'+
      '<div><span style="font-weight:600;">'+h.name+'</span>'+
      '<span style="color:var(--text-secondary);font-size:12px;margin-left:8px;">'+h.date+'</span></div>'+
      '<div style="font-size:13px;">'+status+'</div></div>';
  }
  box.innerHTML=html;
}
