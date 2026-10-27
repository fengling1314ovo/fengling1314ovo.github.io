/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageFaceScorePage", "<!-- pageFaceScorePage -->\n<div class=\"tool-page\" id=\"pageFaceScorePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>💅 颜值打分器</h3>\n      <label style=\"display:block;font-size:13px;font-weight:600;color:var(--text-secondary);margin:16px 0 8px;\">输入你的名字</label>\n      <input id=\"faceName\" maxlength=\"12\" placeholder=\"例如：小明\" onkeydown=\"if(event.key==='Enter')faceScoreCalc()\">\n      <div style=\"text-align:center;margin-top:12px;\">\n        <button class=\"common-btn\" onclick=\"faceScoreCalc()\">✨ 开始打分</button>\n      </div>\n      <div id=\"faceScoreResult\" style=\"margin-top:16px;\"></div>\n      <p style=\"text-align:center;font-size:12px;color:var(--text-placeholder);margin-top:14px;\">※ 纯娱乐，颜值由本工具的心情决定</p>\n    </div>\n  </div>");
// ==================== 颜值打分器 ====================
const FACE_LEVELS = [
  { min:90, max:100, name:'神仙颜值', icon:'✨', color:'#f43f5e',
    comments:['走在路上回头率百分百，素颜都像开了滤镜！','老天追着喂饭吃的颜值，别人羡慕不来。'] },
  { min:80, max:89,  name:'颜值担当', icon:'🌟', color:'#f59e0b',
    comments:['天生丽质，随便打扮一下就很出圈。','人群里一眼就能看到你，颜值很能打。'] },
  { min:70, max:79,  name:'清秀可人', icon:'🌿', color:'#10b981',
    comments:['越看越舒服的耐看型，亲和力满分。','长相干净舒服，越相处越好看。'] },
  { min:60, max:69,  name:'普普通通', icon:'😐', color:'#64748b',
    comments:['长相大众，但胜在亲切自然。','不惊艳但耐看，属于舒服型。'] },
  { min:50, max:59,  name:'有待提升', icon:'💧', color:'#f97316',
    comments:['底子还行，穿搭和发型还能再抢救一下。','收拾一下还是能看的，别放弃自己。'] },
  { min:0,  max:49,  name:'不忍直视', icon:'🫣', color:'#ef4444',
    comments:['……建议今天先戴口罩，明天再看也许就顺眼了。','颜值暂时欠费，多睡几觉补回来。'] }
];
let _faceScoreCache = null;
function initFaceScore(){
  _faceScoreCache = null;
  document.getElementById('faceScoreResult').innerHTML =
    '<div style="text-align:center;color:var(--text-placeholder);padding:24px 0;font-size:14px;">输入名字，看看今天的颜值分~</div>';
}
function faceScoreCalc(){
  const name = document.getElementById('faceName').value.trim();
  if(!name){ showToast('请先输入你的名字哦~'); return; }
  const today = getTodaySeed();
  const rng = gbRng('face_' + today + '_' + name);
  const score = Math.floor(rng() * 101);
  let lv = FACE_LEVELS[0];
  for(let i=0;i<FACE_LEVELS.length;i++){
    if(score >= FACE_LEVELS[i].min){ lv = FACE_LEVELS[i]; break; }
  }
  const comment = lv.comments[Math.floor(rng() * lv.comments.length)];
  const dims = ['五官','气质','肤色','身材','魅力'];
  const barsHtml = dims.map(function(d){
    const v = Math.min(99, Math.max(55, score + Math.floor(rng()*11) - 5));
    return '<div style="margin-bottom:8px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-secondary);margin-bottom:3px;"><span>' + d + '</span><span>' + v + '</span></div>' +
      '<div style="height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden;"><div style="height:100%;width:' + v + '%;background:linear-gradient(90deg,#f472b6,#a855f7);border-radius:4px;"></div></div>' +
    '</div>';
  }).join('');
  _faceScoreCache = { name:name, score:score, lv:lv, comment:comment };
  document.getElementById('faceScoreResult').innerHTML =
    '<div class="quiz-result-card" style="text-align:center;">' +
      '<div style="font-size:14px;color:var(--text-secondary);">' + name + ' 今日颜值分</div>' +
      '<div style="font-size:56px;font-weight:bold;color:' + lv.color + ';line-height:1.2;">' + score + '</div>' +
      '<div style="font-size:18px;font-weight:600;color:' + lv.color + ';">' + lv.icon + ' ' + lv.name + '</div>' +
      '<div class="qr-desc" style="text-align:left;margin-top:10px;">' + comment + '</div>' +
      '<div style="margin-top:14px;text-align:left;"><div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">📊 颜值雷达</div>' + barsHtml + '</div>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap;">' +
        '<button class="common-btn" onclick="faceScoreCalc()">🔄 再测一次</button>' +
        '<button class="common-btn btn-primary" onclick="faceShareResult()">📤 分享结果</button>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--text-placeholder);margin-top:8px;">※ 同一天同一人分数固定，明天再来会变哦</div>' +
    '</div>';
}
function faceShareResult(){
  if(!_faceScoreCache){ showToast('先测一测再分享哦~'); return; }
  const c = _faceScoreCache;
  gbShareText('💅 颜值打分器：「' + c.name + '」今日颜值分 ' + c.score + '，等级：' + c.lv.icon + c.lv.name + '！' + c.comment + ' 快来测测你的颜值~');
}

