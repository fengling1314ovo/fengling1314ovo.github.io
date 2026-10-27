/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageJokesPage", "<!-- pageJokesPage -->\n<div class=\"tool-page\" id=\"pageJokesPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🧊 冷笑话大全</h3>\n      <div style=\"text-align:center;margin:16px 0;\">\n        <button class=\"common-btn\" onclick=\"jokesGet()\">😄 来一个冷笑话</button>\n      </div>\n      <div id=\"jokesResult\"></div>\n    </div>\n  </div>");
// ==================== 新增工具：冷笑话大全 ====================
const JOKES_LIST=[
  '为什么手机怕冷？因为它会"关机"。','为什么数学书总是很忧郁？因为它有太多问题。',
  '鱼为什么不能玩电脑？因为怕碰到"电鱼"。','为什么篮球运动员一进考场就紧张？因为怕"砸"了。',
  '为什么蜜蜂的翅膀总是嗡嗡响？因为它在说"蜂"言风语。','为什么打印机怕黑？因为怕"打"不出字。',
  '为什么钟表总是很守时？因为它有"秒"杀一切的自信。','为什么兔子不戴眼镜？因为它是"长"颈的。',
  '为什么天冷了不能玩手机？因为会"手机"。','为什么西瓜很害羞？因为它有"红"脸。',
  '为什么鸭子会游泳？因为它的"鸭"力太大。','为什么电脑感冒了？因为它中了"病毒"。',
  '为什么鸡蛋总是很忧郁？因为它是"蛋"生的。','为什么香蕉穿外衣？因为它怕"蕉"冷。',
  '为什么星星不吵架？因为它们都知道"和气生财"。','为什么书桌上永远不冷？因为有"课本"保温。',
  '为什么蚊子不咬数学老师？因为老师会"数"它们。','为什么洋葱让人流泪？因为它在"洋葱"地。',
  '为什么豆沙包总是一副苦脸？因为它是"甜"中带苦。','为什么月亮总是很圆？因为"圆"来如此。',
  '为什么水母总是显得很疲惫？因为它"海"洋太大。','为什么门总是很谦虚？因为它总说"我让一让"。',
  '为什么蜘蛛侠不用手机？因为他"网"速很快。','为什么怕黑的人不去买蜡烛？因为"烛"光很贵。'
];
let jokesLast='';
function jokesGet(){
  jokesLast=JOKES_LIST[Math.floor(Math.random()*JOKES_LIST.length)];
  document.getElementById('jokesResult').innerHTML=
    '<div class="quiz-result-card"><div class="qr-desc" style="font-size:16px;line-height:1.8;">'+jokesLast+'</div>'+
    '<button class="common-btn" style="margin-top:14px;" onclick="toastCopy(jokesLast)">📋 复制</button></div>';
}

