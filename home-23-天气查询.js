window.flRegisterToolPage("pageWeather", "<!-- weatherCity -->\n<div class=\"tool-page page-weather\" id=\"pageWeather\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>🌤️ 天气查询</h3>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>城市</label>\n        <select id=\"weatherCity\" onchange=\"queryWeather()\">\n          <option value=\"北京\">北京</option>\n          <option value=\"上海\">上海</option>\n          <option value=\"广州\">广州</option>\n          <option value=\"深圳\">深圳</option>\n          <option value=\"杭州\">杭州</option>\n          <option value=\"成都\">成都</option>\n          <option value=\"武汉\">武汉</option>\n          <option value=\"西安\">西安</option>\n          <option value=\"重庆\">重庆</option>\n          <option value=\"天津\">天津</option>\n          <option value=\"南京\">南京</option>\n          <option value=\"苏州\">苏州</option>\n          <option value=\"青岛\">青岛</option>\n          <option value=\"长沙\">长沙</option>\n          <option value=\"郑州\">郑州</option>\n          <option value=\"合肥\">合肥</option>\n          <option value=\"昆明\">昆明</option>\n          <option value=\"福州\">福州</option>\n          <option value=\"厦门\">厦门</option>\n          <option value=\"济南\">济南</option>\n          <option value=\"沈阳\">沈阳</option>\n          <option value=\"哈尔滨\">哈尔滨</option>\n          <option value=\"长春\">长春</option>\n          <option value=\"石家庄\">石家庄</option>\n          <option value=\"太原\">太原</option>\n          <option value=\"南宁\">南宁</option>\n          <option value=\"贵阳\">贵阳</option>\n          <option value=\"兰州\">兰州</option>\n          <option value=\"乌鲁木齐\">乌鲁木齐</option>\n          <option value=\"海口\">海口</option>\n          <option value=\"三亚\">三亚</option>\n          <option value=\"香港\">香港</option>\n          <option value=\"澳门\">澳门</option>\n          <option value=\"台北\">台北</option>\n          <option value=\"无锡\">无锡</option>\n          <option value=\"宁波\">宁波</option>\n          <option value=\"佛山\">佛山</option>\n          <option value=\"东莞\">东莞</option>\n          <option value=\"温州\">温州</option>\n          <option value=\"大连\">大连</option>\n          <option value=\"泉州\">泉州</option>\n          <option value=\"徐州\">徐州</option>\n          <option value=\"珠海\">珠海</option>\n          <option value=\"中山\">中山</option>\n          <option value=\"惠州\">惠州</option>\n          <option value=\"常州\">常州</option>\n          <option value=\"绍兴\">绍兴</option>\n          <option value=\"台州\">台州</option>\n          <option value=\"嘉兴\">嘉兴</option>\n          <option value=\"烟台\">烟台</option>\n          <option value=\"潍坊\">潍坊</option>\n          <option value=\"临沂\">临沂</option>\n          <option value=\"洛阳\">洛阳</option>\n          <option value=\"宜昌\">宜昌</option>\n          <option value=\"襄阳\">襄阳</option>\n          <option value=\"芜湖\">芜湖</option>\n          <option value=\"赣州\">赣州</option>\n          <option value=\"九江\">九江</option>\n          <option value=\"桂林\">桂林</option>\n          <option value=\"柳州\">柳州</option>\n          <option value=\"绵阳\">绵阳</option>\n          <option value=\"宜宾\">宜宾</option>\n          <option value=\"遵义\">遵义</option>\n          <option value=\"曲靖\">曲靖</option>\n          <option value=\"咸阳\">咸阳</option>\n          <option value=\"宝鸡\">宝鸡</option>\n          <option value=\"榆林\">榆林</option>\n          <option value=\"洛阳\">洛阳</option>\n          <option value=\"张家口\">张家口</option>\n          <option value=\"承德\">承德</option>\n          <option value=\"秦皇岛\">秦皇岛</option>\n        </select>\n      </div>\n      <button class=\"qr-btn\" id=\"btnWeather\" onclick=\"queryWeather()\">立即查询</button>\n      <div id=\"weatherResult\" style=\"display:none;margin-top:16px;\"></div>\n      <div class=\"currency-source\">\n        数据来源：<a href=\"https://open-meteo.com\" target=\"_blank\" rel=\"noopener\">Open-Meteo</a>（免费天气API）\n      </div>\n    </div>\n  </div>\n");
// ==================== 天气查询 ====================
const CITY_GEO={'北京':[39.9042,116.4074],'上海':[31.2304,121.4737],'广州':[23.1291,113.2644],'深圳':[22.5431,114.0579],'杭州':[30.2741,120.1551],'成都':[30.5728,104.0668],'武汉':[30.5928,114.3055],'西安':[34.3416,108.9398],'重庆':[29.5630,106.5516],'天津':[39.0842,117.2010],'南京':[32.0603,118.7969],'苏州':[31.2989,120.5853],'青岛':[36.0671,120.3826],'长沙':[28.2282,112.9388],'郑州':[34.7466,113.6254],'合肥':[31.8206,117.2272],'昆明':[25.0389,102.7183],'福州':[26.0745,119.2965],'厦门':[24.4798,118.0894],'济南':[36.6512,117.1201],'沈阳':[41.8057,123.4315],'哈尔滨':[45.8038,126.5349],'长春':[43.8171,125.3235],'石家庄':[38.0428,114.5149],'太原':[37.8706,112.5489],'南宁':[22.8170,108.3669],'贵阳':[26.6470,106.6302],'兰州':[36.0611,103.8343],'乌鲁木齐':[43.8256,87.6168],'海口':[20.0440,110.1990],'三亚':[18.2528,109.5119],'香港':[22.3193,114.1694],'澳门':[22.1987,113.5439],'台北':[25.0330,121.5654],'无锡':[31.4912,120.3119],'宁波':[29.8683,121.5440],'佛山':[23.0215,113.1214],'东莞':[23.0207,113.7518],'温州':[27.9938,120.6994],'大连':[38.9140,121.6147],'泉州':[24.8741,118.6757],'徐州':[34.2044,117.2841],'珠海':[22.2707,113.5767],'中山':[22.5176,113.3928],'惠州':[23.1116,114.4152],'常州':[31.7727,119.9469],'绍兴':[30.0303,120.5804],'台州':[28.6564,121.4208],'嘉兴':[30.7461,120.7555],'烟台':[37.4638,121.4479],'潍坊':[36.7069,119.1618],'临沂':[35.1047,118.3564],'洛阳':[34.6197,112.4540],'宜昌':[30.6919,111.2865],'襄阳':[32.0089,112.1222],'芜湖':[31.3345,118.4326],'赣州':[25.8311,114.9350],'九江':[29.7051,116.0019],'桂林':[25.2343,110.1795],'柳州':[24.3264,109.4281],'绵阳':[31.4675,104.6796],'宜宾':[28.7513,104.6419],'遵义':[27.7255,106.9274],'曲靖':[25.4900,103.7979],'咸阳':[34.3296,108.7088],'宝鸡':[34.3619,107.2370],'榆林':[38.2854,109.7347],'张家口':[40.8119,114.8794],'承德':[40.9515,117.9634],'秦皇岛':[39.9354,119.6005]};
const WMO_CODE={0:['☀️','晴'],1:['🌤️','大致晴朗'],2:['⛅','多云'],3:['☁️','阴'],45:['🌫️','雾'],48:['🌫️','雾凇'],51:['🌦️','小毛毛雨'],53:['🌦️','毛毛雨'],55:['🌧️','大毛毛雨'],56:['🌧️','冻毛毛雨'],57:['🌧️','强冻毛毛雨'],61:['🌦️','小雨'],63:['🌧️','中雨'],65:['🌧️','大雨'],66:['🌧️','冻雨'],67:['🌧️','强冻雨'],71:['🌨️','小雪'],73:['🌨️','中雪'],75:['❄️','大雪'],77:['❄️','雪粒'],80:['🌦️','小阵雨'],81:['🌧️','阵雨'],82:['⛈️','强阵雨'],85:['🌨️','小阵雪'],86:['❄️','大阵雪'],95:['⛈️','雷暴'],96:['⛈️','雷暴伴冰雹'],99:['⛈️','强雷暴伴冰雹']};

async function queryWeather(){
  const city=document.getElementById('weatherCity').value;
  const btn=document.getElementById('btnWeather');
  btn.textContent='查询中…'; btn.disabled=true;
  try{
    const [lat,lon]=CITY_GEO[city];
    const url='https://api.open-meteo.com/v1/forecast?latitude='+lat+'&longitude='+lon+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Shanghai';
    const res=await fetch(url);
    const data=await res.json();
    const c=data.current;
    const wmo=WMO_CODE[c.weather_code]||['🌡️','未知'];
    let html='<div class="weather-main">';
    html+='<div class="weather-icon">'+wmo[0]+'</div>';
    html+='<div class="weather-temp">'+Math.round(c.temperature_2m)+'°C</div>';
    html+='<div class="weather-desc">'+city+' · '+wmo[1]+'</div>';
    html+='</div>';
    html+='<div class="weather-grid">';
    html+='<div class="weather-card"><div class="label">体感温度</div><div class="value">'+Math.round(c.apparent_temperature)+'°C</div></div>';
    html+='<div class="weather-card"><div class="label">相对湿度</div><div class="value">'+c.relative_humidity_2m+'%</div></div>';
    html+='<div class="weather-card"><div class="label">风速</div><div class="value">'+c.wind_speed_10m+' km/h</div></div>';
    html+='<div class="weather-card"><div class="label">观测时间</div><div class="value" style="font-size:13px;">'+c.time.slice(5,16).replace('T',' ')+'</div></div>';
    html+='</div>';
    document.getElementById('weatherResult').innerHTML=html;
    document.getElementById('weatherResult').style.display='';
  }catch(e){
    showToast('查询失败：'+e.message);
  }finally{
    btn.textContent='立即查询'; btn.disabled=false;
  }
}

// 页面专属样式随功能脚本按需加载。
(function installPageStyles(){
  if(document.getElementById('flWeatherStyles'))return;
  /* Styles moved to css/home-23-天气查询.css. */
})();
