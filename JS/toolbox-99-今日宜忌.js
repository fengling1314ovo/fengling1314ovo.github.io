/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageAlmanacPage", "<!-- pageAlmanacPage -->\n<div class=\"tool-page\" id=\"pageAlmanacPage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📜 今日宜忌</h3>\n      <div id=\"almanacContent\"></div>\n      <h4 style=\"margin:22px 0 10px;font-size:15px;font-weight:600;color:var(--text-secondary);\">🕘 最近7天记录</h4>\n      <div id=\"almanacHistory\"></div>\n      <p style=\"text-align:center;font-size:12px;color:var(--text-placeholder);margin-top:14px;\">※ 每日宜忌仅供娱乐，图个好彩头~</p>\n    </div>\n  </div>");
// ==================== 今日宜忌 ====================
const ALMANAC_YI = [
  '宜摸鱼','宜喝奶茶','宜早睡','宜晒太阳','宜散步','宜微笑','宜请客','宜购物',
  '宜学习','宜运动','宜约会','宜表白','宜追剧','宜读书','宜听音乐','宜睡懒觉',
  '宜自拍','宜吃火锅','宜喝下午茶','宜发呆','宜养花','宜撸猫','宜打游戏','宜露营',
  '宜看电影','宜收拾房间','宜存钱','宜许愿','宜拥抱','宜旅行','宜理发','宜吃零食'
];
const ALMANAC_JI = [
  '忌加班','忌熬夜','忌立flag','忌生气','忌拖延','忌冲动消费','忌节食','忌空腹喝咖啡',
  '忌久坐不动','忌抬杠','忌内耗','忌暴饮暴食','忌借钱给别人','忌吃宵夜','忌说谎','忌抱怨',
  '忌跷二郎腿','忌咬指甲','忌炫耀','忌emo','忌攀比','忌无效社交','忌凌晨下单','忌空腹饮酒',
  '忌翘班','忌强行装熟','忌秒回消息','忌追热点','忌转发锦鲤','忌忘带伞','忌情绪上头','忌钻牛角尖'
];
function initAlmanac(){ renderAlmanac(); }
function renderAlmanac(){
  const today = getTodaySeed();
  const rng = gbRng('almanac_' + today);
  const yiCount = 3 + Math.floor(rng() * 3); // 3-5个
  const jiCount = 3 + Math.floor(rng() * 3);
  const yi = gbPickN(rng, ALMANAC_YI, yiCount);
  const ji = gbPickN(rng, ALMANAC_JI, jiCount);

  // 写入历史记录（同一天覆盖）
  let history = lsGet('almanac_history', []);
  history = history.filter(function(h){ return h.d !== today; });
  history.unshift({ d: today, yi: yi, ji: ji });
  if(history.length > 30) history.length = 30;
  lsSet('almanac_history', history);

  document.getElementById('almanacContent').innerHTML =
    '<div class="fortune-today-card">' +
      '<div class="ft-title">📜 ' + today + ' 宜忌</div>' +
      '<div style="margin-top:14px;">' +
        '<div style="font-size:14px;font-weight:600;color:#10b981;margin-bottom:8px;">✅ 今日宜</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
          yi.map(function(x){ return '<span style="background:#ecfdf5;color:#059669;border-radius:20px;padding:5px 14px;font-size:13px;">' + x + '</span>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div style="margin-top:14px;">' +
        '<div style="font-size:14px;font-weight:600;color:#ef4444;margin-bottom:8px;">❌ 今日忌</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px;">' +
          ji.map(function(x){ return '<span style="background:#fef2f2;color:#dc2626;border-radius:20px;padding:5px 14px;font-size:13px;">' + x + '</span>'; }).join('') +
        '</div>' +
      '</div>' +
    '</div>';

  // 最近7天
  const recent = history.slice(0, 7);
  document.getElementById('almanacHistory').innerHTML = recent.map(function(rec){
    return '<div class="record-item" style="padding:12px;margin-bottom:8px;">' +
      '<div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:6px;">' + rec.d + '</div>' +
      '<div style="font-size:13px;color:#059669;margin-bottom:3px;">✅ 宜：' + rec.yi.join('、') + '</div>' +
      '<div style="font-size:13px;color:#dc2626;">❌ 忌：' + rec.ji.join('、') + '</div>' +
    '</div>';
  }).join('');
}

