window.flRegisterToolPage("pageRefreshRate", "<!-- pageRefreshRate -->\n<div class=\"tool-page page-refreshrate\" id=\"pageRefreshRate\">\n  <div class=\"sticky-nav\">\n    <div class=\"tool-header\"><button class=\"back-btn\" onclick=\"backFromTool()\"><span>←</span> 返回上一级</button></div>\n    <div class=\"breadcrumb\"></div>\n  </div>\n  <div class=\"common-block\" style=\"padding:0 28px 0\"><h3>🔄 刷新率测试</h3></div>\n  <div class=\"currency-container\">\n    <div class=\"home-notice\" style=\"margin:0 0 16px\"><div class=\"notice-title\">📊 测试说明</div><div class=\"notice-content\"><p>点击开始后，请保持此页面在前台约 3 秒。浏览器会根据动画帧间隔估算屏幕刷新率。</p></div></div>\n    <button type=\"button\" class=\"qr-btn\" onclick=\"startRefreshRate();document.activeElement.blur();\">开始测试</button>\n    <div id=\"rrResult\" style=\"margin-top:16px;text-align:center;font-size:32px;font-weight:700;color:var(--primary);\">-- Hz</div>\n    <div id=\"rrStatus\" style=\"margin-top:8px;text-align:center;color:var(--text-secondary);\">点击开始测试</div>\n    <div id=\"rrCanvasWrap\" style=\"display:none;margin-top:16px;padding:10px;border-radius:12px;background:#0f172a\"><canvas id=\"rrCanvas\" width=\"420\" height=\"160\" style=\"display:block;width:100%;height:auto;border-radius:8px\"></canvas></div>\n  </div>\n</div>");
// ==================== 刷新率测试 ====================
let _rrRAF=null,_rrIntervals=[],_rrLastTime=0,_rrBarX=0,_rrSamples=[];
function startRefreshRate(){
  const canvas=document.getElementById('rrCanvas');
  const ctx=canvas.getContext('2d');
  document.getElementById('rrCanvasWrap').style.display='block';
  document.getElementById('rrResult').textContent='-- Hz';
  document.getElementById('rrStatus').textContent='预热中，请不要切走标签页...';
  _rrIntervals=[];_rrSamples=[];_rrLastTime=performance.now();
  const W=canvas.width,H=canvas.height;
  function loop(now){
    const dt=now-_rrLastTime;
    _rrLastTime=now;
    if(dt>0&&dt<200) _rrIntervals.push(dt);
    _rrSamples.push(now);
    // 画移动条
    ctx.fillStyle='#0f172a';ctx.fillRect(0,0,W,H);
    _rrBarX=(_rrBarX+8)%W;
    ctx.fillStyle='#22d3ee';
    ctx.beginPath();ctx.arc(_rrBarX,H/2,20,0,Math.PI*2);ctx.fill();
    // 收集3秒后计算
    const elapsed=(now-_rrStart)/1000;
    if(elapsed>=3){
      const hz=calcRefreshRate(_rrIntervals);
      document.getElementById('rrResult').textContent=hz+' Hz';
      let quality='';
      if(hz>=120) quality=' 🚀 高刷屏';
      else if(hz>=90) quality=' ✨ 流畅';
      else if(hz>=60) quality=' 🙂 标准';
      else quality=' 😐 偏低';
      document.getElementById('rrStatus').textContent=quality;
      _rrRAF=null;return;
    }
    document.getElementById('rrStatus').textContent='测量中... '+Math.round(elapsed)+'s/3s';
    _rrRAF=requestAnimationFrame(loop);
  }
  _rrStart=performance.now();
  _rrRAF=requestAnimationFrame(loop);
}
function calcRefreshRate(intervals){
  if(intervals.length<10) return Math.round(1000/(intervals[0]||16.7));
  // 排序取中位帧间隔
  const sorted=[...intervals].sort((a,b)=>a-b);
  const median=sorted[Math.floor(sorted.length/2)];
  const baseline=1000/median; // 估计的刷新率
  // 对每个间隔，计算实际跨过了几个刷新周期（四舍五入到最接近的整数）
  // 然后累计周期数 / 累计时间 = 实际刷新率
  let totalCycles=0,totalTime=0;
  for(let i=0;i<intervals.length;i++){
    const cycles=Math.round(intervals[i]/median);
    if(cycles>=1&&cycles<=4){ // 丢弃异常值
      totalCycles+=cycles;
      totalTime+=intervals[i];
    }
  }
  if(totalTime<=0) return Math.round(baseline);
  return Math.round(totalCycles*1000/totalTime);
}
// 离开页面时停止
(function(){
  const origCleanup=cleanupBeforePageSwitch;
  cleanupBeforePageSwitch=function(){
    if(_rrRAF){cancelAnimationFrame(_rrRAF);_rrRAF=null;}
    origCleanup();
  };
})();

