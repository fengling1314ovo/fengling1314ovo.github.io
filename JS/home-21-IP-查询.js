window.flRegisterToolPage("pageIplookup", "<!-- ipInput -->\n<div class=\"tool-page page-iplookup\" id=\"pageIplookup\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>🌐 IP查询</h3>\n      <div class=\"home-notice\" style=\"margin:12px 0 0;\">\n        <div class=\"notice-title\">📢 说明</div>\n        <div class=\"notice-content\">\n          <p>由于使用的是国外IP查询的API，所以显示的IP省份可能出现是英文的情况，可自行翻译</p>\n        </div>\n      </div>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>IP 地址（留空查当前IP）</label>\n        <input type=\"text\" id=\"ipInput\" placeholder=\"例如：8.8.8.8\">\n      </div>\n      <button class=\"qr-btn\" id=\"btnIpQuery\" onclick=\"queryIp()\">立即查询</button>\n      <div class=\"currency-result\" id=\"ipResult\" style=\"display:none;\">\n        <div class=\"result-from\" id=\"ipStatus\"></div>\n        <div class=\"ip-info\" id=\"ipInfo\"></div>\n      </div>\n      <div class=\"currency-source\">\n        数据来源：<a href=\"https://ipwho.is\" target=\"_blank\" rel=\"noopener\">ipwho.is</a>（备用 <a href=\"https://ip.sb/api/\" target=\"_blank\" rel=\"noopener\">IP.SB</a>、<a href=\"https://ipapi.co\" target=\"_blank\" rel=\"noopener\">ipapi.co</a>）\n      </div>\n    </div>\n  </div>\n");
// ==================== IP 查询 ====================
const CN_REGION_MAP={'Beijing':'北京','Shanghai':'上海','Tianjin':'天津','Chongqing':'重庆','Guangdong':'广东','Zhejiang':'浙江','Jiangsu':'江苏','Shandong':'山东','Henan':'河南','Hebei':'河北','Hubei':'湖北','Hunan':'湖南','Sichuan':'四川','Fujian':'福建','Anhui':'安徽','Jiangxi':'江西','Liaoning':'辽宁','Heilongjiang':'黑龙江','Jilin':'吉林','Shanxi':'山西','Shaanxi':'陕西','Yunnan':'云南','Guangxi':'广西','Guizhou':'贵州','Gansu':'甘肃','Inner Mongolia':'内蒙古','Xinjiang':'新疆','Tibet':'西藏','Qinghai':'青海','Ningxia':'宁夏','Hainan':'海南','Hong Kong':'香港','Macao':'澳门','Taiwan':'台湾','California':'加利福尼亚州'};
const CN_COUNTRY_MAP={'China':'中国','United States':'美国','Japan':'日本','Korea (Republic of)':'韩国','South Korea':'韩国','Korea':'韩国','United Kingdom':'英国','Germany':'德国','France':'法国','Russia':'俄罗斯','Canada':'加拿大','Australia':'澳大利亚','Singapore':'新加坡','Thailand':'泰国','Malaysia':'马来西亚','Vietnam':'越南','India':'印度','Indonesia':'印度尼西亚','Philippines':'菲律宾','Brazil':'巴西','Spain':'西班牙','Italy':'意大利','Netherlands':'荷兰','Switzerland':'瑞士','Sweden':'瑞典','Norway':'挪威','Denmark':'丹麦','Finland':'芬兰','Poland':'波兰','Turkey':'土耳其','Ukraine':'乌克兰','Mexico':'墨西哥','Argentina':'阿根廷','South Africa':'南非','Egypt':'埃及','Saudi Arabia':'沙特阿拉伯','United Arab Emirates':'阿联酋','Israel':'以色列','New Zealand':'新西兰','Ireland':'爱尔兰','Belgium':'比利时','Austria':'奥地利','Portugal':'葡萄牙','Greece':'希腊','Czechia':'捷克','Hungary':'匈牙利','Romania':'罗马尼亚','Chile':'智利','Colombia':'哥伦比亚','Pakistan':'巴基斯坦','Bangladesh':'孟加拉国','Hong Kong':'中国香港','Macao':'中国澳门','Taiwan':'中国台湾'};
const CN_CITY_MAP={'Beijing':'北京','Shanghai':'上海','Guangzhou':'广州','Shenzhen':'深圳','Hangzhou':'杭州','Nanjing':'南京','Chengdu':'成都','Wuhan':'武汉',"Xi'an":'西安',"Xian":'西安','Chongqing':'重庆','Tianjin':'天津','Suzhou':'苏州','Qingdao':'青岛','Dalian':'大连','Xiamen':'厦门','Fuzhou':'福州','Jinan':'济南','Changsha':'长沙','Zhengzhou':'郑州','Hefei':'合肥','Kunming':'昆明','Shenyang':'沈阳','Harbin':'哈尔滨','Changchun':'长春','Shijiazhuang':'石家庄','Taiyuan':'太原','Nanning':'南宁','Guiyang':'贵阳','Lanzhou':'兰州','Urumqi':'乌鲁木齐','Lhasa':'拉萨','Xining':'西宁','Yinchuan':'银川','Hohhot':'呼和浩特','Haikou':'海口','Sanya':'三亚','Hong Kong':'香港','Macau':'澳门','Taipei':'台北','Wuxi':'无锡','Ningbo':'宁波','Foshan':'佛山','Dongguan':'东莞','Wenzhou':'温州','Luoyang':'洛阳','Nanchang':'南昌','Shijiazhuang':'石家庄','San Francisco':'旧金山','Los Angeles':'洛杉矶','San Jose':'圣何塞','San Diego':'圣迭戈'};
const ISP_MAP={'China Unicom':'中国联通','CHINA UNICOM':'中国联通','China Mobile':'中国移动','CHINA MOBILE':'中国移动','China Telecom':'中国电信','CHINA TELECOM':'中国电信','ChinaNet':'中国电信','China169 Backbone':'联通169骨干网','Alibaba Cloud':'阿里云','Aliyun Computing':'阿里云','Hangzhou Alibaba Advertising':'杭州阿里巴巴','Tencent Cloud':'腾讯云','Huawei Cloud':'华为云','Baidu Cloud':'百度智能云','Amazon AWS':'亚马逊AWS','Google Cloud':'谷歌云','Microsoft Azure':'微软Azure'};
const TZ_MAP={'Asia/Shanghai':'亚洲/上海（北京时间）','Asia/Beijing':'亚洲/北京','Asia/Hong_Kong':'亚洲/香港','Asia/Taipei':'亚洲/台北','Asia/Chongqing':'亚洲/重庆','Asia/Urumqi':'亚洲/乌鲁木齐','Asia/Harbin':'亚洲/哈尔滨'};
function toChinese(name, map){ if(!name) return '-'; if(map[name]) return map[name]; return name; }
const _transCache={};
async function autoTrans(name){
  if(!name||name==='-') return name;
  // 如果已经是中文（含中文字符），直接返回
  if(/[\u4e00-\u9fa5]/.test(name)) return name;
  if(_transCache[name]!==undefined) return _transCache[name];
  try{
    const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(name)+'&langpair=en|zh-CN';
    const res=await fetch(url);
    const data=await res.json();
    let t=data.responseData&&data.responseData.translatedText?data.responseData.translatedText:name;
    // 清理翻译结果中多余的标点
    t=t.replace(/\.$/,'').trim();
    _transCache[name]=t;
    return t;
  }catch(e){ return name; }
}
function toChineseIsp(name){ if(!name||name==='-') return '-'; if(ISP_MAP[name]) return ISP_MAP[name]; for(const k in ISP_MAP){ if(name.toLowerCase().includes(k.toLowerCase())) return name.replace(new RegExp(k,'gi'), ISP_MAP[k]); } return name; }
async function queryIp(){
  let ip=document.getElementById('ipInput').value.trim();
  const btn=document.getElementById('btnIpQuery');
  btn.textContent='查询中…'; btn.disabled=true;
  try{
    if(!ip){
      try{
        const v4res=await fetch('https://ipv4.icanhazip.com',{cache:'no-store'});
        ip=(await v4res.text()).trim();
      }catch(e){ ip=''; }
    }
    const url='https://ipwho.is/'+ip;
    const res=await fetch(url);
    const data=await res.json();
    if(!data.success) throw new Error(data.message||'查询失败');
    document.getElementById('ipResult').style.display='';
    document.getElementById('ipStatus').innerHTML=(document.getElementById('ipInput').value.trim()?'查询 IP':'当前 IP')+'：<b>'+data.ip+'</b>';
    const rawCountry=data.country||'';
    const rawRegion=data.region||'';
    const rawCity=data.city||'';
    const rows=[
      ['国家/地区',toChinese(rawCountry, CN_COUNTRY_MAP)],
      ['省份/地区',toChinese(rawRegion, CN_REGION_MAP)],
      ['城市',toChinese(rawCity, CN_CITY_MAP)],
      ['邮政编码',data.postal||'-'],
      ['运营商',toChineseIsp(data.connection?data.connection.isp:'-')],
      ['机构/组织',toChineseIsp(data.connection?data.connection.org:'-')],
      ['AS 编号',data.connection?data.connection.asn:'-'],
      ['经纬度',data.latitude+', '+data.longitude],
      ['时区',toChinese(data.timezone?data.timezone.id:'-', TZ_MAP)],
    ];
    document.getElementById('ipInfo').innerHTML=rows.map(([k,v])=>
      '<div class="ip-info-row"><span class="label">'+k+'</span><span class="value">'+(v||'-')+'</span></div>'
    ).join('');
    // 自动翻译未匹配的英文地名
    (async()=>{
      const fields=[
        {val:rawCountry, map:CN_COUNTRY_MAP, row:0},
        {val:rawRegion, map:CN_REGION_MAP, row:1},
        {val:rawCity, map:CN_CITY_MAP, row:2},
      ];
      for(const f of fields){
        if(f.val && !f.map[f.val]){
          const t=await autoTrans(f.val);
          if(t!==f.val){
            document.querySelectorAll('#ipInfo .ip-info-row')[f.row].querySelector('.value').textContent=t;
          }
        }
      }
    })();
    if(data.type==='IPv6'||data.ip.includes(':')){
      document.getElementById('ipInfo').innerHTML+='<div style="margin-top:10px;padding:8px 10px;background:var(--primary-bg);border-radius:8px;font-size:12px;color:var(--text-secondary);">⚠️ 当前为 IPv6 地址，定位可能不够精准，建议切换 IPv4 网络查询</div>';
    }
  }catch(e){
    showToast('查询失败：'+e.message);
  }finally{
    btn.textContent='立即查询'; btn.disabled=false;
  }
}
document.getElementById('ipInput').addEventListener('keydown', e=>{ if(e.key==='Enter') queryIp(); });

// 页面专属样式随功能脚本按需加载。
(function installPageStyles(){
  if(document.getElementById('flIpLookupStyles'))return;
  /* Styles moved to css/home-21-IP-查询.css. */
})();
