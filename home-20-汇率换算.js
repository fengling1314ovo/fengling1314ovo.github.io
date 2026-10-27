;(function(){
  const id = 'flCurrencyPageStyles';
  if(document.getElementById(id)) return;
  /* Styles moved to css/home-20-汇率换算.css. */
})();
window.flRegisterToolPage("pageCurrency", "<!-- curAmount -->\n<div class=\"tool-page page-currency\" id=\"pageCurrency\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>💱 汇率换算</h3>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>金额</label>\n        <input type=\"number\" id=\"curAmount\" value=\"100\" min=\"0\" step=\"0.01\" placeholder=\"输入金额\">\n      </div>\n      <div class=\"currency-row\">\n        <label>从</label>\n        <select id=\"curFrom\"></select>\n      </div>\n      <div class=\"currency-swap\" onclick=\"swapCurrency()\">🔄 交换</div>\n      <div class=\"currency-row\">\n        <label>到</label>\n        <select id=\"curTo\"></select>\n      </div>\n      <button class=\"qr-btn\" id=\"btnConvert\" onclick=\"convertCurrency()\">立即换算</button>\n      <div class=\"currency-result\" id=\"currencyResult\" style=\"display:none;\">\n        <div class=\"result-from\" id=\"resultFrom\"></div>\n        <div class=\"result-arrow\">↓</div>\n        <div class=\"result-to\" id=\"resultTo\"></div>\n        <div class=\"result-rate\" id=\"resultRate\"></div>\n      </div>\n      <div class=\"currency-source\">\n        数据来源：<a href=\"https://frankfurter.dev\" target=\"_blank\" rel=\"noopener\">Frankfurter API</a>（欧洲央行等官方数据，每日更新）\n      </div>\n    </div>\n  </div>\n");
// ==================== 汇率换算 ====================
const CURRENCY_LIST = [
  {code:'CNY',name:'人民币 🇨🇳'},{code:'USD',name:'美元 🇺🇸'},{code:'EUR',name:'欧元 🇪🇺'},
  {code:'JPY',name:'日元 🇯🇵'},{code:'GBP',name:'英镑 🇬🇧'},{code:'HKD',name:'港币 🇭🇰'},
  {code:'TWD',name:'新台币 🇹🇼'},{code:'KRW',name:'韩元 🇰🇷'},{code:'AUD',name:'澳元 🇦🇺'},
  {code:'CAD',name:'加元 🇨🇦'},{code:'SGD',name:'新加坡元 🇸🇬'},{code:'CHF',name:'瑞士法郎 🇨🇭'},
  {code:'NZD',name:'新西兰元 🇳🇿'},{code:'THB',name:'泰铢 🇹🇭'},{code:'MYR',name:'马来西亚林吉特 🇲🇾'},
  {code:'IDR',name:'印尼盾 🇮🇩'},{code:'PHP',name:'菲律宾比索 🇵🇭'},{code:'VND',name:'越南盾 🇻🇳'},
  {code:'INR',name:'印度卢比 🇮🇳'},{code:'RUB',name:'俄罗斯卢布 🇷🇺'},{code:'BRL',name:'巴西雷亚尔 🇧🇷'},
  {code:'ZAR',name:'南非兰特 🇿🇦'},{code:'MOP',name:'澳门元 🇲🇴'},{code:'SEK',name:'瑞典克朗 🇸🇪'},
  {code:'NOK',name:'挪威克朗 🇳🇴'},{code:'DKK',name:'丹麦克朗 🇩🇰'},{code:'PLN',name:'波兰兹罗提 🇵🇱'},
  {code:'CZK',name:'捷克克朗 🇨🇿'},{code:'HUF',name:'匈牙利福林 🇭🇺'},{code:'ILS',name:'以色列新谢克尔 🇮🇱'},
  {code:'AED',name:'阿联酋迪拉姆 🇦🇪'},{code:'SAR',name:'沙特里亚尔 🇸🇦'},{code:'TRY',name:'土耳其里拉 🇹🇷'},
  {code:'MXN',name:'墨西哥比索 🇲🇽'},{code:'BGN',name:'保加利亚列弗 🇧🇬'},{code:'RON',name:'罗马尼亚列伊 🇷🇴'},
];
const curFromEl=document.getElementById('curFrom'), curToEl=document.getElementById('curTo');
CURRENCY_LIST.forEach(c=>{
  curFromEl.innerHTML += '<option value="'+c.code+'">'+c.name+'</option>';
  curToEl.innerHTML += '<option value="'+c.code+'">'+c.name+'</option>';
});
curFromEl.value='CNY';
curToEl.value='USD';

function getCurrencyName(code){
  const c=CURRENCY_LIST.find(x=>x.code===code);
  return c?c.name:code;
}

async function convertCurrency(){
  const amount=parseFloat(document.getElementById('curAmount').value);
  const from=curFromEl.value, to=curToEl.value;
  if(isNaN(amount)||amount<=0){ showToast('请输入有效金额'); return; }
  if(from===to){
    showCurrencyResult(amount, from, amount, to, 1);
    return;
  }
  const btn=document.getElementById('btnConvert');
  btn.textContent='换算中…'; btn.disabled=true;
  try{
    const res=await fetch('https://api.frankfurter.dev/v1/latest?amount='+amount+'&from='+from+'&to='+to);
    if(!res.ok) throw new Error('API请求失败('+res.status+')');
    const data=await res.json();
    const result=data.rates[to];
    const rate=result/amount;
    showCurrencyResult(amount, from, result, to, rate);
  }catch(e){
    showToast('换算失败：'+e.message);
  }finally{
    btn.textContent='立即换算'; btn.disabled=false;
  }
}

function showCurrencyResult(amount, from, result, to, rate){
  document.getElementById('currencyResult').style.display='';
  document.getElementById('resultFrom').textContent=amount+' '+getCurrencyName(from);
  document.getElementById('resultTo').textContent=result.toFixed(4)+' '+getCurrencyName(to);
  document.getElementById('resultRate').textContent='当前汇率：1 '+from+' = '+rate.toFixed(6)+' '+to+'（数据日期：'+new Date().toLocaleDateString('zh-CN')+'）';
}

function swapCurrency(){
  const tmp=curFromEl.value;
  curFromEl.value=curToEl.value;
  curToEl.value=tmp;
}
// 回车换算
document.getElementById('curAmount').addEventListener('keydown', e=>{ if(e.key==='Enter') convertCurrency(); });

