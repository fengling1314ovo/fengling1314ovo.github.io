/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageanniversaryPage", "<!-- pageanniversaryPage -->\n<div class=\"tool-page\" id=\"pageanniversaryPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📅 纪念日倒计时</h3>\n      <div class=\"record-add-row\">\n        <input id=\"annName\" placeholder=\"纪念日名称（如：生日）\">\n        <input type=\"date\" id=\"annDate\">\n        <button class=\"common-btn\" onclick=\"annAdd()\">➕ 添加</button>\n      </div>\n      <div class=\"record-list\" id=\"annList\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：纪念日倒计时 ====================
let annList=lsGet('anniversary_list',[]);
function annRender(){
  const el=document.getElementById('annList');
  if(annList.length===0){el.innerHTML='<div style="text-align:center;color:var(--text-placeholder);padding:20px;">暂无纪念日，添加一个吧</div>';return;}
  const now=new Date();now.setHours(0,0,0,0);
  el.innerHTML=annList.map((a,i)=>{
    const d=new Date(a.date);d.setHours(0,0,0,0);
    let thisYear=new Date(now.getFullYear(),d.getMonth(),d.getDate());
    if(thisYear<now)thisYear=new Date(now.getFullYear()+1,d.getMonth(),d.getDate());
    const days=Math.ceil((thisYear-now)/(1000*60*60*24));
    const years=now.getFullYear()-d.getFullYear();
    return `<div class="record-item">
      <div><b>${a.name}</b><br><span style="font-size:12px;color:var(--text-placeholder);">${a.date} · 第${years}年</span></div>
      <div style="text-align:right;"><span style="color:var(--primary);font-weight:bold;font-size:18px;">${days}</span>天<span class="r-del" onclick="annDel(${i})">×</span></div>
    </div>`;
  }).join('');
}
function annAdd(){
  const name=document.getElementById('annName').value.trim();
  const date=document.getElementById('annDate').value;
  if(!name||!date){showToast('请填写名称和日期');return;}
  annList.push({name,date});
  lsSet('anniversary_list',annList);
  document.getElementById('annName').value='';
  document.getElementById('annDate').value='';
  annRender();
  showToast('已添加');
}
function annDel(i){annList.splice(i,1);lsSet('anniversary_list',annList);annRender();}
annRender();

