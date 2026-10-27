/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageUnitConverter", "<!-- pageUnitConverter -->\n<div class=\"tool-page\" id=\"pageUnitConverter\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>📐 单位换算器</h3>\n      <div class=\"uc-cat-tabs\" id=\"ucCatTabs\"></div>\n      <div style=\"display:flex;gap:10px;align-items:center;margin:16px 0;flex-wrap:wrap;\">\n        <input id=\"ucInput\" type=\"number\" value=\"1\" min=\"0\" step=\"any\" placeholder=\"输入数值\" style=\"flex:1;min-width:120px;\">\n        <select id=\"ucFromUnit\" style=\"flex:1;min-width:120px;\"></select>\n        <span style=\"font-size:18px;color:var(--text-secondary);\">=</span>\n        <select id=\"ucToUnit\" style=\"flex:1;min-width:120px;\"></select>\n      </div>\n      <div class=\"uc-result\" id=\"ucResult\">—</div>\n      <div style=\"text-align:center;margin:12px 0;\">\n        <button class=\"common-btn\" onclick=\"ucSwap()\">🔄 交换单位</button>\n        <button class=\"common-btn\" onclick=\"ucCopyResult()\">📋 复制结果</button>\n      </div>\n      <div class=\"uc-quick-ref\" id=\"ucQuickRef\"></div>\n    </div>\n  </div>");
// ==================== 单位换算器 ====================
const UNIT_CATEGORIES={
  length:{name:'长度',units:{m:{name:'米',rate:1},km:{name:'千米',rate:1000},cm:{name:'厘米',rate:0.01},mm:{name:'毫米',rate:0.001},mi:{name:'英里',rate:1609.344},yd:{name:'码',rate:0.9144},ft:{name:'英尺',rate:0.3048},in:{name:'英寸',rate:0.0254}}},
  weight:{name:'重量',units:{kg:{name:'千克',rate:1},g:{name:'克',rate:0.001},mg:{name:'毫克',rate:0.000001},t:{name:'吨',rate:1000},lb:{name:'磅',rate:0.453592},oz:{name:'盎司',rate:0.0283495},jin:{name:'斤',rate:0.5}}},
  temperature:{name:'温度',units:{c:{name:'摄氏度',rate:1},f:{name:'华氏度',rate:1},k:{name:'开尔文',rate:1}},special:true},
  area:{name:'面积',units:{m2:{name:'平方米',rate:1},km2:{name:'平方千米',rate:1000000},cm2:{name:'平方厘米',rate:0.0001},ha:{name:'公顷',rate:10000},mu:{name:'亩',rate:666.667},ft2:{name:'平方英尺',rate:0.092903},ac:{name:'英亩',rate:4046.86}}},
  volume:{name:'体积',units:{l:{name:'升',rate:1},ml:{name:'毫升',rate:0.001},m3:{name:'立方米',rate:1000},gal:{name:'加仑',rate:3.78541},cup:{name:'杯',rate:0.236588},floz:{name:'液盎司',rate:0.0295735}}},
  speed:{name:'速度',units:{ms:{name:'米/秒',rate:1},kmh:{name:'千米/时',rate:0.277778},mph:{name:'英里/时',rate:0.44704},kn:{name:'节',rate:0.514444},fts:{name:'英尺/秒',rate:0.3048}}},
  data:{name:'数据存储',units:{b:{name:'字节B',rate:1},kb:{name:'KB',rate:1024},mb:{name:'MB',rate:1048576},gb:{name:'GB',rate:1073741824},tb:{name:'TB',rate:1099511627776}}}
};

let ucCurrentCat='length';

function ucInit(){
  const tabs=document.getElementById('ucCatTabs');
  tabs.innerHTML=Object.entries(UNIT_CATEGORIES).map(([k,v])=>
    '<button class="uc-cat-tab'+(k===ucCurrentCat?' active':'')+'" onclick="ucSwitchCat(\''+k+'\')">'+v.name+'</button>'
  ).join('');
  ucUpdateUnits();
  document.getElementById('ucInput').addEventListener('input',ucConvert);
  document.getElementById('ucFromUnit').addEventListener('change',ucConvert);
  document.getElementById('ucToUnit').addEventListener('change',ucConvert);
  ucConvert();
}

function ucSwitchCat(cat){
  ucCurrentCat=cat;
  document.querySelectorAll('.uc-cat-tab').forEach(t=>t.classList.remove('active'));
  event.target.classList.add('active');
  ucUpdateUnits();
  ucConvert();
}

function ucUpdateUnits(){
  const units=UNIT_CATEGORIES[ucCurrentCat].units;
  const keys=Object.keys(units);
  const fromSel=document.getElementById('ucFromUnit');
  const toSel=document.getElementById('ucToUnit');
  fromSel.innerHTML=keys.map(k=>'<option value="'+k+'">'+units[k].name+'</option>').join('');
  toSel.innerHTML=keys.map(k=>'<option value="'+k+'">'+units[k].name+'</option>').join('');
  fromSel.value=keys[0];
  toSel.value=keys[1]||keys[0];
}

function ucConvert(){
  const val=parseFloat(document.getElementById('ucInput').value);
  if(isNaN(val)){document.getElementById('ucResult').textContent='—';return;}
  const from=document.getElementById('ucFromUnit').value;
  const to=document.getElementById('ucToUnit').value;
  let result;
  if(ucCurrentCat==='temperature'){
    result=ucConvertTemp(val,from,to);
  }else{
    const fromRate=UNIT_CATEGORIES[ucCurrentCat].units[from].rate;
    const toRate=UNIT_CATEGORIES[ucCurrentCat].units[to].rate;
    result=val*fromRate/toRate;
  }
  const formatted=Math.abs(result)>=1e9||(Math.abs(result)<0.0001&&result!==0)?result.toExponential(4):parseFloat(result.toFixed(6));
  document.getElementById('ucResult').textContent=formatted+' '+UNIT_CATEGORIES[ucCurrentCat].units[to].name;
  ucRenderQuickRef(val,from);
}

function ucConvertTemp(val,from,to){
  let c;
  if(from==='c')c=val;
  else if(from==='f')c=(val-32)*5/9;
  else c=val-273.15;
  if(to==='c')return c;
  if(to==='f')return c*9/5+32;
  return c+273.15;
}

function ucRenderQuickRef(val,from){
  const units=UNIT_CATEGORIES[ucCurrentCat].units;
  const ref=document.getElementById('ucQuickRef');
  if(isNaN(val)||val===0){ref.innerHTML='';return;}
  let html='<h4>📋 常用换算参考（'+val+' '+units[from].name+'）</h4><div class="uc-ref-grid">';
  Object.entries(units).forEach(([k,u])=>{
    if(k===from)return;
    let r;
    if(ucCurrentCat==='temperature')r=ucConvertTemp(val,from,k);
    else r=val*units[from].rate/u.rate;
    const f=Math.abs(r)>=1e6||(Math.abs(r)<0.001&&r!==0)?r.toExponential(3):parseFloat(r.toFixed(4));
    html+='<div class="uc-ref-item" onclick="ucSetTarget(\''+k+'\')"><span>'+u.name+'</span><span class="ur-val">'+f+'</span></div>';
  });
  html+='</div>';
  ref.innerHTML=html;
}

function ucSetTarget(unit){
  document.getElementById('ucToUnit').value=unit;
  ucConvert();
}

function ucSwap(){
  const from=document.getElementById('ucFromUnit');
  const to=document.getElementById('ucToUnit');
  const tmp=from.value;from.value=to.value;to.value=tmp;
  ucConvert();
}

function ucCopyResult(){
  const text=document.getElementById('ucResult').textContent;
  if(text==='—'){showToast('没有可复制的结果');return;}
  copyText(text);showToast('已复制结果');
}
ucInit();

