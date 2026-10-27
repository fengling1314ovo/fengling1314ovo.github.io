/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagegroupPage", "<!-- pagegroupPage -->\n<div class=\"tool-page\" id=\"pagegroupPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>👥 随机分组</h3>\n      <label>名单（每行一个名字）</label>\n      <textarea id=\"gpList\" rows=\"6\" placeholder=\"张三&#10;李四&#10;王五\"></textarea>\n      <label>分成几组</label>\n      <input id=\"gpCount\" type=\"number\" value=\"3\" min=\"2\" max=\"20\">\n      <br>\n      <button class=\"common-btn\" onclick=\"groupRandom()\">👥 随机分组</button>\n      <div id=\"gpResult\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：随机分组 ====================
function groupRandom(){
  const text=document.getElementById('gpList').value.trim();
  const count=Math.max(2,Math.min(20,Number(document.getElementById('gpCount').value)||3));
  if(!text){showToast('请先输入名单');return;}
  const names=text.split('\n').map(n=>n.trim()).filter(n=>n);
  if(names.length<count){showToast('人数不能少于组数');return;}
  // 洗牌
  const shuffled=[...names].sort(()=>Math.random()-0.5);
  const groups=Array.from({length:count},()=>[]);
  shuffled.forEach((n,i)=>groups[i%count].push(n));
  const colors=['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316','#6366f1','#14b8a6','#eab308','#f43f5e','#a855f7','#0ea5e9','#22c55e','#fb923c','#818cf8','#2dd4bf','#fbbf24'];
  document.getElementById('gpResult').innerHTML=groups.map((g,i)=>`
    <div style="margin-bottom:12px;padding:12px;border-radius:12px;background:var(--bg-input);border-left:4px solid ${colors[i%colors.length]};">
      <div style="font-weight:bold;margin-bottom:6px;color:${colors[i%colors.length]};">第${i+1}组（${g.length}人）</div>
      <div style="font-size:14px;color:var(--text-secondary);">${g.join('、')}</div>
    </div>
  `).join('');
  showToast('已随机分成'+count+'组');
}

