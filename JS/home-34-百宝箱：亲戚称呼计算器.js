/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pagerelativePage", "<!-- pagerelativePage -->\n<div class=\"tool-page\" id=\"pagerelativePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>👨‍👩‍👧 亲戚称呼计算器</h3>\n      <p style=\"font-size:14px;color:var(--text-secondary);margin-bottom:12px;\">选择关系链，计算该怎么称呼</p>\n      <div id=\"relChain\" style=\"display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;min-height:36px;\"></div>\n      <div style=\"display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;\">\n        <button class=\"common-btn\" onclick=\"relAdd('父')\">父亲的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('母')\">母亲的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('兄')\">哥哥的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('弟')\">弟弟的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('姐')\">姐姐的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('妹')\">妹妹的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('子')\">儿子的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('女')\">女儿的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('妻')\">妻子的</button>\n        <button class=\"common-btn\" onclick=\"relAdd('夫')\">丈夫的</button>\n      </div>\n      <div style=\"display:flex;gap:8px;\">\n        <button class=\"common-btn\" onclick=\"relUndo()\">↩️ 撤销</button>\n        <button class=\"common-btn\" onclick=\"relClear()\">🗑️ 清空</button>\n      </div>\n      <div id=\"relResult\" style=\"margin-top:16px;font-size:18px;font-weight:bold;text-align:center;\"></div>\n    </div>\n  </div>");
// ==================== 百宝箱：亲戚称呼计算器 ====================
let relChainArr=[];
const REL_MAP={
  '父父':'爷爷','父母':'奶奶','母父':'外公','母母':'外婆',
  '父兄':'伯伯','父弟':'叔叔','父姐':'姑姑','父妹':'姑姑',
  '母兄':'舅舅','母弟':'舅舅','母姐':'阿姨','母妹':'阿姨',
  '兄子':'侄子','兄女':'侄女','弟子':'侄子','弟女':'侄女',
  '姐子':'外甥','姐女':'外甥女','妹子':'外甥','妹女':'外甥女',
  '子子':'孙子','子女':'孙女','女子':'外孙','女女':'外孙女',
  '妻父':'岳父','妻母':'岳母','夫父':'公公','夫母':'婆婆',
  '父兄子':'堂兄弟','父兄女':'堂姐妹','父弟子':'堂兄弟','父弟女':'堂姐妹',
  '父姐子':'表兄弟','父姐女':'表姐妹','父妹子':'表兄弟','父妹女':'表姐妹',
  '母兄子':'表兄弟','母兄女':'表姐妹','母弟子':'表兄弟','母弟女':'表姐妹',
  '母姐子':'表兄弟','母姐女':'表姐妹','母妹子':'表兄弟','母妹女':'表姐妹'
};
function relRender(){
  const el=document.getElementById('relChain');
  if(relChainArr.length===0){el.innerHTML='<span style="color:var(--text-placeholder);">请选择关系</span>';}
  else{el.innerHTML=relChainArr.map((r,i)=>`<span style="padding:4px 10px;background:var(--primary-bg);border-radius:8px;font-size:14px;">${r}</span>`).join('<span style="color:var(--text-placeholder);">的</span>');}
  relCalc();
}
function relAdd(r){relChainArr.push(r);relRender();}
function relUndo(){relChainArr.pop();relRender();}
function relClear(){relChainArr=[];relRender();}
function relCalc(){
  if(relChainArr.length===0){document.getElementById('relResult').innerHTML='';return;}
  const key=relChainArr.join('');
  let result=REL_MAP[key];
  if(!result){
    // 简化处理：根据最后一个关系和长度生成
    const last=relChainArr[relChainArr.length-1];
    if(relChainArr.length>=3){
      if(last==='子'||last==='女')result='曾'+(last==='子'?'孙':'孙女');
      else if(last==='父'||last==='母')result='曾'+(last==='父'?'祖':'祖母');
      else result='远房'+({兄:'兄长',弟:'弟弟',姐:'姐姐',妹:'妹妹',子:'儿子',女:'女儿',父:'父亲',母:'母亲'}[last]||'亲戚');
    }else{
      result={父:'父亲',母:'母亲',兄:'哥哥',弟:'弟弟',姐:'姐姐',妹:'妹妹',子:'儿子',女:'女儿',妻:'妻子',夫:'丈夫'}[last]||'亲戚';
    }
  }
  document.getElementById('relResult').innerHTML=`应该叫：<span style="color:var(--primary);font-size:24px;">${result}</span>`;
}
relRender();

