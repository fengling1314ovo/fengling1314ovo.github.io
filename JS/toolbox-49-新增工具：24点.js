/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageGame24Page", "<!-- pageGame24Page -->\n<div class=\"tool-page\" id=\"pageGame24Page\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>➗ 24点</h3>\n      <div class=\"fortune-today-card\" style=\"text-align:center;\">\n        <div id=\"g24Nums\" style=\"font-size:40px;font-weight:bold;color:var(--primary);letter-spacing:10px;margin:12px 0;\">—</div>\n        <div style=\"font-size:13px;color:var(--text-secondary);\">用加减乘除把 4 个数凑成 24，每个数用且只能用一次</div>\n        <div style=\"display:flex;gap:8px;margin-top:16px;justify-content:center;flex-wrap:wrap;\">\n          <button class=\"common-btn\" onclick=\"g24New()\">🔄 换一组</button>\n          <button class=\"common-btn\" onclick=\"g24Answer()\">💡 看答案</button>\n        </div>\n      </div>\n      <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:16px 0 8px;\">输入你的算式（支持 + - * / 和括号）</label>\n      <input id=\"g24Input\" placeholder=\"例如：(8-4)*(7-1)\" onkeydown=\"if(event.key==='Enter')g24Check()\">\n      <div style=\"text-align:center;margin-top:12px;\">\n        <button class=\"common-btn\" onclick=\"g24Check()\">✅ 验证</button>\n      </div>\n      <div id=\"g24Result\" style=\"margin-top:16px;\"></div>\n    </div>\n  </div>");
// ==================== 新增工具：24点 ====================
let g24Nums=[];
function g24HasSolution(nums){
  return g24Solve(nums.map(n=>({v:n,s:String(n)})))!==null;
}
function g24New(){
  let trial=[],guard=0;
  do{
    trial=[];
    while(trial.length<4)trial.push(Math.floor(Math.random()*13)+1);
    guard++;
  }while(!g24HasSolution(trial)&&guard<200);
  if(!g24HasSolution(trial))trial=[8,4,7,1];
  g24Nums=trial;
  document.getElementById('g24Nums').textContent=g24Nums.join('  ');
  document.getElementById('g24Input').value='';
  document.getElementById('g24Result').innerHTML='';
}
function g24Solve(arr){
  if(arr.length===1){
    if(Math.abs(arr[0].v-24)<1e-6)return arr[0].s;
    return null;
  }
  for(let i=0;i<arr.length;i++)for(let j=0;j<arr.length;j++){
    if(i===j)continue;
    const rest=[];
    for(let k=0;k<arr.length;k++)if(k!==i&&k!==j)rest.push(arr[k]);
    const a=arr[i],b=arr[j];
    const pairs=[
      {v:a.v+b.v,s:'('+a.s+'+'+b.s+')'},
      {v:a.v-b.v,s:'('+a.s+'-'+b.s+')'},
      {v:a.v*b.v,s:'('+a.s+'*'+b.s+')'}
    ];
    if(Math.abs(b.v)>1e-9)pairs.push({v:a.v/b.v,s:'('+a.s+'/'+b.s+')'});
    for(const p of pairs){
      const r=g24Solve(rest.concat([p]));
      if(r)return r;
    }
  }
  return null;
}
function g24Answer(){
  const arr=g24Nums.map(n=>({v:n,s:String(n)}));
  const res=g24Solve(arr);
  document.getElementById('g24Result').innerHTML=
    '<div class="quiz-result-card"><div class="qr-desc">'+(res?('💡 一种解法：<b style="color:var(--primary);font-size:18px;">'+res+' = 24</b>'):'😅 这组数字可能无解，换一组试试')+'</div></div>';
}
function g24Check(){
  const input=document.getElementById('g24Input').value.replace(/\s+/g,'');
  if(!/^[0-9+\-*/().]+$/.test(input)){showToast('只能输入数字和 + - * / ( )');return;}
  const used=[];
  for(const ch of input){if(/[0-9]/.test(ch))used.push(Number(ch));}
  if([...g24Nums].sort().join(',')!==[...used].sort().join(',')){showToast('请把给出的4个数字各用一次');return;}
  let val;
  try{val=Function('"use strict";return ('+input+');')();}catch(e){showToast('算式格式有误');return;}
  if(Math.abs(val-24)<1e-6){
    document.getElementById('g24Result').innerHTML='<div class="quiz-result-card"><div class="qr-desc" style="color:#10b981;font-weight:bold;font-size:18px;">🎉 完全正确！ '+input+' = 24</div></div>';
    bpAddCoins(8,'game24');
    showToast('🎉 答对了！+8金币');
  }else{
    document.getElementById('g24Result').innerHTML='<div class="quiz-result-card"><div class="qr-desc" style="color:#ef4444;">❌ 结果是 '+val+'，不是 24，再想想~</div></div>';
  }
}
g24New();

