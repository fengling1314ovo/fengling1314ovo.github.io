/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageBloodMatchPage", "<!-- pageBloodMatchPage -->\n<div class=\"tool-page\" id=\"pageBloodMatchPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🩸 血型配对</h3>\n      <div style=\"display:flex;gap:12px;margin:16px 0;\">\n        <select id=\"bmSelf\" style=\"flex:1;\">\n          <option value=\"A\">A型</option><option value=\"B\">B型</option><option value=\"AB\">AB型</option><option value=\"O\">O型</option>\n        </select>\n        <select id=\"bmOther\" style=\"flex:1;\">\n          <option value=\"A\">A型</option><option value=\"B\">B型</option><option value=\"AB\">AB型</option><option value=\"O\">O型</option>\n        </select>\n      </div>\n      <div style=\"text-align:center;\">\n        <button class=\"common-btn\" onclick=\"bloodMatch()\">💕 查看契合度</button>\n      </div>\n      <div id=\"bmResult\" style=\"margin-top:16px;\"></div>\n      <p style=\"text-align:center;font-size:12px;color:var(--text-placeholder);margin-top:14px;\">※ 纯娱乐测试，血型与性格并无科学定论</p>\n    </div>\n  </div>");
// ==================== 新增工具：血型配对 ====================
const BLOOD_MAP={
  'A-A':[90,'两个A型在一起，稳重细心，细水长流。'],
  'A-B':[78,'互补组合，一个认真一个随性，互相包容会更甜蜜。'],
  'A-O':[85,'A型主导、O型追随，配合默契。'],
  'A-AB':[82,'AB欣赏A的踏实，A喜欢AB的聪慧，相处融洽。'],
  'B-B':[80,'两个B型自由随性，轻松愉快，但别一起犯懒。'],
  'B-O':[88,'B型活泼遇上O型体贴，相处很舒服。'],
  'B-AB':[86,'AB的奇思妙想配上B的随性，玩得到一起。'],
  'O-O':[85,'两个O型行动派，直来直去，简单直接。'],
  'O-AB':[92,'一个理性一个感性，天生互补的一对。'],
  'AB-AB':[95,'思想同频，灵魂契合度极高。']
};
function bloodMatch(){
  const a=document.getElementById('bmSelf').value;
  const b=document.getElementById('bmOther').value;
  const key=[a,b].sort().join('-');
  const data=BLOOD_MAP[key]||[70,'缘分需要慢慢经营。'];
  const score=data[0];
  let level='',color='';
  if(score>=90){level='天作之合';color='#10b981';}
  else if(score>=80){level='非常般配';color='#22c55e';}
  else if(score>=70){level='还算合适';color='#f59e0b';}
  else{level='需要磨合';color='#ef4444';}
  document.getElementById('bmResult').innerHTML=
    '<div class="quiz-result-card">'+
    '<div style="font-size:22px;font-weight:bold;margin-bottom:8px;">'+a+'型 ❤️ '+b+'型</div>'+
    '<div class="qr-score" style="color:'+color+';">'+score+'%</div>'+
    '<div style="font-size:17px;font-weight:bold;color:'+color+';margin:8px 0;">'+level+'</div>'+
    '<div class="qr-desc">'+data[1]+'</div></div>';
}

