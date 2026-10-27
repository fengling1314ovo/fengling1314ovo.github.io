/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageRiddlesPage", "<!-- pageRiddlesPage -->\n<div class=\"tool-page\" id=\"pageRiddlesPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🤔 脑筋急转弯</h3>\n      <div style=\"text-align:center;margin:16px 0;\">\n        <button class=\"common-btn\" onclick=\"riddlesGet()\">🤯 出一道题</button>\n      </div>\n      <div id=\"riddlesResult\"></div>\n    </div>\n  </div>");
// ==================== 新增工具：脑筋急转弯 ====================
const RIDDLES_LIST=[
  {q:'什么东西越洗越脏？',a:'水'},
  {q:'什么车没有人能开？',a:'风车'},
  {q:'什么杯子不能喝水？',a:'奖杯'},
  {q:'什么书买不到？',a:'遗书'},
  {q:'什么蛋不能吃？',a:'零蛋'},
  {q:'什么门永远关不上？',a:'球门'},
  {q:'什么布剪不断？',a:'瀑布'},
  {q:'什么河没有水？',a:'银河'},
  {q:'什么路最窄？',a:'冤家路窄'},
  {q:'什么马不能骑？',a:'木马'},
  {q:'什么猪没有嘴？',a:'珍珠'},
  {q:'什么花没有枝？',a:'浪花'},
  {q:'什么鸡没有翅膀？',a:'田鸡'},
  {q:'什么球不能踢？',a:'眼球'},
  {q:'什么鱼不能吃？',a:'木鱼'},
  {q:'什么山没人爬？',a:'书山'},
  {q:'什么海没有水？',a:'人海'},
  {q:'什么星星不会发光？',a:'五角星'},
  {q:'什么伞不能遮雨？',a:'降落伞'},
  {q:'什么饭不能吃？',a:'炒鱿鱼'},
  {q:'什么车坐不得？',a:'玩具车'},
  {q:'什么钟不报时？',a:'闹钟没电'},
  {q:'什么糖不能吃？',a:'新郎'},
  {q:'什么冰不能化？',a:'电冰箱'},
  {q:'什么牙不会掉？',a:'月牙'}
];
let riddlesIdx=0;
function riddlesGet(){
  riddlesIdx=Math.floor(Math.random()*RIDDLES_LIST.length);
  const r=RIDDLES_LIST[riddlesIdx];
  document.getElementById('riddlesResult').innerHTML=
    '<div class="quiz-result-card">'+
    '<div style="font-size:17px;font-weight:bold;margin-bottom:12px;">🤔 '+r.q+'</div>'+
    '<button class="common-btn" onclick="riddlesShowAnswer()">💡 查看答案</button>'+
    '<div id="riddlesAnswer" style="margin-top:12px;font-size:15px;color:var(--primary);font-weight:bold;display:none;">答案：'+r.a+'</div>'+
    '</div>';
}
function riddlesShowAnswer(){
  const el=document.getElementById('riddlesAnswer');
  if(el)el.style.display='block';
}

