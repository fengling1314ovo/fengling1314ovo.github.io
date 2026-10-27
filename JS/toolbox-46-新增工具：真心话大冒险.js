/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageTruthDarePage", "<!-- pageTruthDarePage -->\n<div class=\"tool-page\" id=\"pageTruthDarePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎤 真心话大冒险</h3>\n      <div style=\"display:flex;gap:12px;margin:16px 0;\">\n        <button class=\"common-btn\" style=\"flex:1;\" onclick=\"truthDarePick('truth')\">💬 真心话</button>\n        <button class=\"common-btn\" style=\"flex:1;\" onclick=\"truthDarePick('dare')\">🔥 大冒险</button>\n      </div>\n      <div id=\"truthDareResult\"></div>\n      <p style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-top:12px;\">适合朋友聚会、真心话大冒险游戏时使用</p>\n    </div>\n  </div>");
// ==================== 新增工具：真心话大冒险 ====================
const TRUTH_LIST=[
  '你做过最尴尬的一件事是什么？','你偷偷喜欢过的人是谁？','你手机里最不想让人看到的是什么？',
  '你最近一次说谎是什么时候？','你身上最不满意的地方是什么？','如果只能带一样东西去荒岛，你带什么？',
  '你从小到大最难忘的一次糗事？','你现在最想对谁说对不起？','你有没有背地里偷偷翻过别人的手机？',
  '你觉得自己最大的缺点是什么？','你有没有做过对不起朋友的事？','你人生中最后悔的决定是什么？',
  '你第一次心动是什么时候？','你暗恋过几次？','你介意对象翻你的手机吗？',
  '你上一次哭是什么时候？','你觉得自己什么时候最丑？','你有没有删过前任的联系方式？',
  '你做过最冲动的一件事是什么？','如果明天是世界末日，你今天想做什么？','你私下里最大的爱好是什么？',
  '你有没有背地里说过朋友的坏话？','你最近一次熬夜到几点？','你觉得自己恋爱里最大的问题是？',
  '你忘不掉的前任是个什么样的人？','你曾经撒过最大的谎是什么？','你买过最没用的一件东西是什么？'
];
const DARE_LIST=[
  '模仿一个动物叫10秒','给通讯录第5个人打电话说"我爱你"','用方言朗读一段课文',
  '原地转10圈然后走直线','唱一首歌的高潮部分','做一个你最丑的表情让大家拍照',
  '学青蛙跳一圈','对着镜子说三遍"我最帅/最美"','用屁股写自己的名字',
  '吃一片柠檬还要面不改色','学蜡笔小新说话','公主抱左边的人10秒',
  '闭眼说出屋里所有人的名字','用夸张的语气朗读一句广告词','做10个俯卧撑',
  '给爸妈打个电话说"我想你们了"','单脚站立30秒','模仿某个明星的经典动作',
  '吃一大口芥末','用外语做自我介绍30秒','头顶书走直线',
  '发一条指定内容的朋友圈','捏着鼻子说"我是小猪"','跳一支即兴舞蹈30秒',
  '跟右边的人深情对视10秒不笑','用左手写自己的名字','把袜子套在手上做鬼脸'
];
let truthDareLast='';
function truthDarePick(type){
  const list=type==='truth'?TRUTH_LIST:DARE_LIST;
  truthDareLast=list[Math.floor(Math.random()*list.length)];
  document.getElementById('truthDareResult').innerHTML=
    '<div class="quiz-result-card">'+
    '<div style="font-size:22px;font-weight:bold;color:var(--primary);margin-bottom:8px;">'+(type==='truth'?'💬 真心话':'🔥 大冒险')+'</div>'+
    '<div class="qr-desc" style="font-size:16px;line-height:1.7;">'+truthDareLast+'</div>'+
    '<button class="common-btn" style="margin-top:14px;" onclick="toastCopy(truthDareLast)">📋 复制</button>'+
    '</div>';
}

