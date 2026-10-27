/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageDomainCheck", "<!-- pageDomainCheck -->\n<div class=\"tool-page\" id=\"pageDomainCheck\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>🌐 域名注册查询</h3>\n      <div class=\"home-notice\" style=\"margin:12px 0 0;\">\n        <div class=\"notice-title\">📢 说明</div>\n        <div class=\"notice-content\">\n          <p>输入域名可查询是否已被注册，以及注册商、到期时间等信息</p>\n        </div>\n      </div>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>域名</label>\n        <input type=\"text\" id=\"domainCheckInput\" placeholder=\"例如：baidu.com\">\n      </div>\n      <button class=\"qr-btn\" onclick=\"checkDomain();document.activeElement.blur();\">立即查询</button>\n      <div id=\"domainCheckResult\" style=\"display:none;margin-top:16px;\"></div>\n      <div class=\"currency-source\">\n        数据来源：枫铃工具箱后端代理（fengling1314ovo.top）\n      </div>\n    </div>\n  </div>\n");
window.flRegisterToolPage("pageDnsquery", "<!-- dnsDomain -->\n<div class=\"tool-page page-dnsquery\" id=\"pageDnsquery\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>🔍 查询服务器IP</h3>\n      <div class=\"home-notice\" style=\"margin:12px 0 0;\">\n        <div class=\"notice-title\">📢 说明</div>\n        <div class=\"notice-content\">\n          <p>输入网址可查询网站服务器的IP地址，部分IP地区显示存在翻译问题，可自行翻译</p>\n        </div>\n      </div>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>域名</label>\n        <input type=\"text\" id=\"dnsDomain\" placeholder=\"例如：baidu.com\" value=\"fengling1314ovo.top\">\n      </div>\n      <button class=\"qr-btn\" id=\"btnDnsQuery\" onclick=\"queryDns()\">立即查询</button>\n      <div id=\"dnsResult\" style=\"display:none;margin-top:16px;\"></div>\n      <div class=\"currency-source\">\n        数据来源：<a href=\"https://dns.alidns.com\" target=\"_blank\" rel=\"noopener\">阿里 DoH</a>（阿里公共 DNS）\n      </div>\n    </div>\n  </div>");
// ==================== 域名解析 ====================
async function dnsQuery(domain, type){
  const res=await fetch('https://dns.alidns.com/resolve?name='+encodeURIComponent(domain)+'&type='+type).then(r=>r.json());
  return res.Answer||[];
}
async function queryDns(){
  const domain=document.getElementById('dnsDomain').value.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  if(!domain){ showToast('请输入域名'); return; }
  const btn=document.getElementById('btnDnsQuery');
  btn.textContent='查询中…'; btn.disabled=true;
  const box=document.getElementById('dnsResult');
  box.style.display='';
  try{
    let chain=[], cur=domain, visited=new Set(), depth=0;
    while(cur && !visited.has(cur) && depth<10){
      visited.add(cur);
      const records=await dnsQuery(cur,'A');
      const cname=records.find(r=>r.type===5);
      const aRecs=records.filter(r=>r.type===1);
      chain.push({domain:cur, cname:cname?cname.data:null, ips:aRecs.map(r=>r.data), ttl:aRecs.length?aRecs[0].TTL:(cname?cname.TTL:0)});
      if(cname){ cur=cname.data.replace(/\.$/,''); depth++; }
      else break;
    }
    const aaaaRecs=await dnsQuery(domain,'AAAA');
    const aaaaIps=aaaaRecs.filter(r=>r.type===28).map(r=>r.data);

    let html='';
    let idx=0;
    const pending=[];
    html+='<div style="margin:4px 0 10px;font-size:13px;color:var(--text-secondary);">查询的网址：<b style="color:var(--text-main);">'+domain+'</b> 的服务器IP</div>';
    html+='<div class="dns-section"><div class="dns-section-title">IPv4 记录</div>';
    chain.forEach((c,i)=>{
      html+='<div class="dns-item" style="flex-direction:column;align-items:flex-start;">';
      html+='<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;"><span style="font-size:12px;color:var(--primary);font-weight:600;">'+(i+1)+'.</span><span style="font-family:monospace;font-size:14px;">'+c.domain+'</span>';
      if(c.cname) html+='<span style="font-size:12px;color:var(--text-placeholder);">→ CNAME →</span><span style="font-family:monospace;font-size:13px;color:var(--primary);">'+c.cname+'</span>';
      html+='</div>';
      if(c.ips.length){
        c.ips.forEach(ip=>{
          const divId='ipinfo_'+(idx++);
          html+='<div style="margin-top:6px;width:100%;">';
          html+='<div style="display:flex;align-items:center;gap:8px;"><span class="ip">'+ip+'</span><span class="ttl">TTL '+c.ttl+'s</span></div>';
          html+='<div id="'+divId+'" style="font-size:12px;color:var(--text-secondary);margin-top:3px;padding-left:4px;">查询归属地…</div>';
          html+='</div>';
          pending.push([ip, divId]);
        });
      }
      html+='</div>';
    });
    html+='</div>';
    if(aaaaIps.length){
      html+='<div class="dns-section"><div class="dns-section-title">IPv6（AAAA 记录，'+aaaaIps.length+' 条）</div>';
      aaaaIps.forEach(ip=>{
        const divId='ipinfo_'+(idx++);
        html+='<div class="dns-item" style="flex-direction:column;align-items:flex-start;">';
        html+='<span class="ip">'+ip+'</span>';
        html+='<div id="'+divId+'" style="font-size:12px;color:var(--text-secondary);margin-top:3px;">查询归属地…</div>';
        html+='</div>';
        pending.push([ip, divId]);
      });
      html+='</div>';
    }
    if(!html || chain.length===0){
      html='<div class="dns-empty">未找到解析记录，域名可能不存在</div>';
    }
    box.innerHTML=html;
    pending.forEach(([ip,divId])=>loadIpInfo(ip, divId));
  }catch(e){
    box.innerHTML='<div class="dns-empty">查询失败：'+e.message+'</div>';
  }finally{
    btn.textContent='立即查询'; btn.disabled=false;
  }
}
const DOMAIN_API='https://api.fengling1314ovo.top/api/domain-check';
function renderDomainResult(registered,reg,created,expires,nameservers){
  let html='';
  if(registered){
    html+='<div style="padding:14px;border-radius:12px;background:#fef2f2;border:1px solid #fecaca;margin-bottom:12px;text-align:center;">';
    html+='<div style="font-size:24px;">❌</div>';
    html+='<div style="font-size:16px;font-weight:700;color:#dc2626;margin-top:4px;">该域名已被注册</div>';
    html+='</div>';
    html+='<div style="display:flex;flex-direction:column;gap:8px;">';
    html+='<div style="display:flex;justify-content:space-between;padding:10px 14px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border-color);"><span style="color:var(--text-secondary);">注册商</span><span style="font-weight:600;">'+(reg||'-')+'</span></div>';
    html+='<div style="display:flex;justify-content:space-between;padding:10px 14px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border-color);"><span style="color:var(--text-secondary);">注册时间</span><span style="font-weight:600;">'+(created||'-')+'</span></div>';
    html+='<div style="display:flex;justify-content:space-between;padding:10px 14px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border-color);"><span style="color:var(--text-secondary);">到期时间</span><span style="font-weight:600;">'+(expires||'-')+'</span></div>';
    if(Array.isArray(nameservers)&&nameservers.length>0){
      html+='<div style="padding:10px 14px;border-radius:10px;background:var(--bg-card);border:1px solid var(--border-color);"><span style="color:var(--text-secondary);">DNS服务器</span><div style="margin-top:4px;font-family:monospace;font-size:13px;">'+nameservers.join('<br>')+'</div></div>';
    }
    html+='</div>';
  }else{
    html+='<div style="padding:14px;border-radius:12px;background:#f0fdf4;border:1px solid #bbf7d0;margin-bottom:12px;text-align:center;">';
    html+='<div style="font-size:24px;">✅</div>';
    html+='<div style="font-size:16px;font-weight:700;color:#16a34a;margin-top:4px;">该域名可以注册</div>';
    html+='</div>';
  }
  return html;
}
async function checkDomain(){
  let domain=document.getElementById('domainCheckInput').value.trim().toLowerCase().replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  if(!domain){showToast('请输入域名');return;}
  const box=document.getElementById('domainCheckResult');
  box.style.display='';
  box.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-secondary);">⏳ 查询中...</div>';
  try{
    const res=await fetch(DOMAIN_API+'?domain='+encodeURIComponent(domain));
    const data=await res.json();
    if(!data.ok){
      box.innerHTML='<div style="text-align:center;padding:20px;color:#dc2626;">查询失败：'+(data.msg||'未知错误')+'</div>';
      return;
    }
    box.innerHTML=renderDomainResult(data.registered,data.registrar,data.created,data.expires,data.nameservers);
  }catch(e){
    box.innerHTML='<div style="text-align:center;padding:20px;color:#dc2626;">查询失败：'+e.message+'</div>';
  }
}
async function loadIpInfo(ip, divId){
  const el=document.getElementById(divId);
  if(!el) return;
  try{
    const res=await fetch('https://ipwho.is/'+ip);
    const data=await res.json();
    if(!data.success){ el.innerHTML=''; return; }
    const country=toChinese(data.country, CN_COUNTRY_MAP);
    const region=toChinese(data.region, CN_REGION_MAP);
    const city=toChinese(data.city, CN_CITY_MAP);
    const isp=toChineseIsp(data.connection?data.connection.isp:'');
    let html='';
    if(country&&country!=='-') html+='<div>IP国家：<span class="loc-country">'+country+'</span></div>';
    if(region&&region!=='-') html+='<div>IP省份：<span class="loc-region">'+region+'</span></div>';
    if(city&&city!=='-') html+='<div>IP城市：<span class="loc-city">'+city+'</span></div>';
    if(isp&&isp!=='-') html+='<div style="color:var(--primary);">IP运营商：'+isp+'</div>';
    el.innerHTML=html;
    // 自动翻译未匹配的英文地名
    (async()=>{
      if(data.country && !CN_COUNTRY_MAP[data.country]){
        const t=await autoTrans(data.country);
        const e=el.querySelector('.loc-country'); if(e) e.textContent=t;
      }
      if(data.region && !CN_REGION_MAP[data.region]){
        const t=await autoTrans(data.region);
        const e=el.querySelector('.loc-region'); if(e) e.textContent=t;
      }
      if(data.city && !CN_CITY_MAP[data.city]){
        const t=await autoTrans(data.city);
        const e=el.querySelector('.loc-city'); if(e) e.textContent=t;
      }
    })();
  }catch(e){ el.innerHTML=''; }
}
function lookupIpFromDns(ip){
  openPage('iplookup');
  document.getElementById('ipInput').value=ip;
  setTimeout(queryIp, 300);
}
document.getElementById('dnsDomain').addEventListener('keydown', e=>{ if(e.key==='Enter') queryDns(); });

// 页面专属样式随功能脚本按需加载。
(function installPageStyles(){
  if(document.getElementById('flDnsLookupStyles'))return;
  /* Styles moved to css/home-22-域名解析.css. */
})();
