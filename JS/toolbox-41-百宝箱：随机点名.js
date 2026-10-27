/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagerollCallPage", "<!-- pagerollCallPage -->\n<div class=\"tool-page\" id=\"pagerollCallPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📢 随机点名</h3>\n      <label>名单（每行一个名字）</label>\n      <textarea id=\"rcList\" rows=\"6\" placeholder=\"张三&#10;李四&#10;王五\"></textarea>\n      <br>\n      <button class=\"common-btn\" onclick=\"rollCallStart()\">🎯 开始点名</button>\n      <button class=\"common-btn\" onclick=\"rollCallStop()\" id=\"rcStopBtn\" style=\"display:none;\">🛑 停止</button>\n      <div id=\"rcResult\" style=\"margin-top:20px;font-size:36px;font-weight:bold;text-align:center;color:var(--primary);min-height:50px;\"></div>\n      <div id=\"rcHistory\" style=\"margin-top:12px;font-size:13px;color:var(--text-secondary);text-align:center;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：随机点名 ====================
let rcTimer=null,rcRunning=false,rcHistory=[];
function rollCallStart(){
  const text=document.getElementById('rcList').value.trim();
  if(!text){showToast('请先输入名单');return;}
  const names=text.split('\n').map(n=>n.trim()).filter(n=>n);
  if(names.length<2){showToast('至少需要2个名字');return;}
  if(rcRunning){rollCallStop();return;}
  rcRunning=true;
  document.getElementById('rcStopBtn').style.display='inline-block';
  document.querySelector('button[onclick="rollCallStart()"]').textContent='🛑 停止';
  const resultEl=document.getElementById('rcResult');
  rcTimer=setInterval(()=>{
    resultEl.textContent=names[Math.floor(Math.random()*names.length)];
  },50);
}
function rollCallStop(){
  if(!rcRunning)return;
  clearInterval(rcTimer);rcRunning=false;
  document.getElementById('rcStopBtn').style.display='none';
  document.querySelector('button[onclick="rollCallStart()"]').textContent='🎯 开始点名';
  const name=document.getElementById('rcResult').textContent;
  rcHistory.unshift(name);
  if(rcHistory.length>10)rcHistory.pop();
  document.getElementById('rcHistory').textContent='历史：'+rcHistory.join(' → ');
  showToast('🎉 点到了：'+name);
}

