/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageOilPrice", "<!-- pageOilPrice -->\n<div class=\"tool-page\" id=\"pageOilPrice\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>⛽ 油价查询</h3>\n      <div class=\"currency-container\" style=\"margin-top:16px;\">\n        <div class=\"currency-row\">\n          <label>选择省份</label>\n          <select id=\"oilProvinceSelect\">\n            <option value=\"北京\">北京</option>\n            <option value=\"天津\">天津</option>\n            <option value=\"河北\">河北</option>\n            <option value=\"山西\">山西</option>\n            <option value=\"内蒙古\">内蒙古</option>\n            <option value=\"辽宁\">辽宁</option>\n            <option value=\"吉林\">吉林</option>\n            <option value=\"黑龙江\">黑龙江</option>\n            <option value=\"上海\">上海</option>\n            <option value=\"江苏\">江苏</option>\n            <option value=\"浙江\">浙江</option>\n            <option value=\"安徽\">安徽</option>\n            <option value=\"福建\">福建</option>\n            <option value=\"江西\">江西</option>\n            <option value=\"山东\">山东</option>\n            <option value=\"河南\">河南</option>\n            <option value=\"湖北\">湖北</option>\n            <option value=\"湖南\">湖南</option>\n            <option value=\"广东\">广东</option>\n            <option value=\"广西\">广西</option>\n            <option value=\"海南\">海南</option>\n            <option value=\"重庆\">重庆</option>\n            <option value=\"四川\">四川</option>\n            <option value=\"贵州\">贵州</option>\n            <option value=\"云南\">云南</option>\n            <option value=\"西藏\">西藏</option>\n            <option value=\"陕西\">陕西</option>\n            <option value=\"甘肃\">甘肃</option>\n            <option value=\"青海\">青海</option>\n            <option value=\"宁夏\">宁夏</option>\n            <option value=\"新疆\">新疆</option>\n          </select>\n        </div>\n        <button class=\"qr-btn\" onclick=\"queryOilPrice()\" style=\"display:block;width:100%;margin-top:12px;position:relative;z-index:10;\">🔍 查询油价</button>\n        <div id=\"oilPriceStatus\" style=\"margin-top:12px;text-align:center;font-size:14px;color:var(--text-secondary);display:none;\"></div>\n        <div id=\"oilPriceResult\" style=\"display:none;margin-top:16px;padding:24px;border-radius:16px;background:rgba(255,255,255,0.35);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(99,102,241,0.15);\">\n          <div id=\"oilPriceProvince\" style=\"font-size:18px;font-weight:700;color:var(--text-main);text-align:center;margin-bottom:16px;\"></div>\n          <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:12px;\">\n            <div style=\"text-align:center;padding:16px;border-radius:12px;background:rgba(99,102,241,0.08);\">\n              <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:6px;\">⛽ 92号汽油</div>\n              <div id=\"oil92\" style=\"font-size:24px;font-weight:700;color:var(--primary);\">--</div>\n              <div style=\"font-size:11px;color:var(--text-secondary);margin-top:2px;\">元/升</div>\n            </div>\n            <div style=\"text-align:center;padding:16px;border-radius:12px;background:rgba(249,115,22,0.08);\">\n              <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:6px;\">⛽ 95号汽油</div>\n              <div id=\"oil95\" style=\"font-size:24px;font-weight:700;color:#f97316;\">--</div>\n              <div style=\"font-size:11px;color:var(--text-secondary);margin-top:2px;\">元/升</div>\n            </div>\n            <div style=\"text-align:center;padding:16px;border-radius:12px;background:rgba(239,68,68,0.08);\">\n              <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:6px;\">⛽ 98号汽油</div>\n              <div id=\"oil98\" style=\"font-size:24px;font-weight:700;color:#ef4444;\">--</div>\n              <div style=\"font-size:11px;color:var(--text-secondary);margin-top:2px;\">元/升</div>\n            </div>\n            <div style=\"text-align:center;padding:16px;border-radius:12px;background:rgba(16,185,129,0.08);\">\n              <div style=\"font-size:12px;color:var(--text-secondary);margin-bottom:6px;\">🛢️ 0号柴油</div>\n              <div id=\"oil0\" style=\"font-size:24px;font-weight:700;color:#10b981;\">--</div>\n              <div style=\"font-size:11px;color:var(--text-secondary);margin-top:2px;\">元/升</div>\n            </div>\n          </div>\n        </div>\n        <div style=\"margin-top:16px;padding:12px 14px;border-radius:var(--radius-md);background:rgba(255,255,255,0.35);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(99,102,241,0.12);font-size:12px;line-height:1.7;color:var(--text-secondary);\">\n          <b>说明：</b>数据来源于第三方API，仅供参考。实际油价请以当地加油站为准。油价通常每10个工作日调整一次。\n        </div>\n      </div>\n    </div>\n  </div>");
// ==================== 油价查询 ====================
let oilPriceCache = null;
const OIL_PROVINCES = ['北京','天津','河北','山西','内蒙古','辽宁','吉林','黑龙江','上海','江苏','浙江','安徽','福建','江西','山东','河南','湖北','湖南','广东','广西','海南','重庆','四川','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆'];
function initOilProvinceSelect(){
  const sel = document.getElementById('oilProvinceSelect');
  if(!sel) return;
  const last = localStorage.getItem('oilLastProvince');
  if(last){
    for(let i=0;i<sel.options.length;i++){
      if(sel.options[i].value === last){ sel.selectedIndex = i; break; }
    }
  }
}
function queryOilPrice(){
  const province = document.getElementById('oilProvinceSelect').value;
  if(!province){ showToast('请选择省份'); return; }
  localStorage.setItem('oilLastProvince', province);
  const statusEl = document.getElementById('oilPriceStatus');
  const resultEl = document.getElementById('oilPriceResult');
  statusEl.style.display = 'block';
  statusEl.textContent = '⏳ 正在查询油价...';
  resultEl.style.display = 'none';
  const today = new Date().toDateString();
  if(oilPriceCache && oilPriceCache.date === today && oilPriceCache.data){
    renderOilPrice(province, oilPriceCache.data);
    return;
  }
  fetch('https://api.fengling1314ovo.top/api/oil-price?province=' + encodeURIComponent(province), {signal: AbortSignal.timeout(15000)})
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data && data.ok && data.data){
        oilPriceCache = {date: today, data: data.data};
        renderOilPrice(province, data.data);
      } else {
        statusEl.textContent = '❌ ' + (data.msg || '查询失败，请稍后重试');
      }
    })
    .catch(function(){
      statusEl.textContent = '❌ 网络错误，请检查网络连接';
    });
}
function renderOilPrice(province, data){
  const statusEl = document.getElementById('oilPriceStatus');
  const resultEl = document.getElementById('oilPriceResult');
  let item = null;
  if(Array.isArray(data) && data.length > 0){
    item = data.find(function(d){ return d.city === province || d.province === province; }) || data[0];
  } else if(typeof data === 'object'){
    item = data;
  }
  if(!item){
    statusEl.textContent = '❌ 未找到该省份油价数据';
    return;
  }
  document.getElementById('oilPriceProvince').textContent = (item.city || item.province || province) + ' 今日油价';
  document.getElementById('oil92').textContent = item['92'] || item.t92 || '--';
  document.getElementById('oil95').textContent = item['95'] || item.t95 || '--';
  document.getElementById('oil98').textContent = item['98'] || item.t98 || '--';
  document.getElementById('oil0').textContent = item['0'] || item.t0 || '--';
  statusEl.style.display = 'none';
  resultEl.style.display = 'block';
}

