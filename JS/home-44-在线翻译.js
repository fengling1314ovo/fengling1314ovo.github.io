/* 在线翻译：本工具页面和逻辑按需加载。 */
window.flRegisterToolPage("pageTranslate", "<!-- transFrom -->\n<div class=\"tool-page page-translate\" id=\"pageTranslate\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 0\">\n      <h3>🌍 在线翻译</h3>\n    </div>\n    <div class=\"currency-container\">\n      <div class=\"currency-row\">\n        <label>源语言</label>\n        <select id=\"transFrom\">\n          <option value=\"zh-CN\">中文（简体）</option>\n          <option value=\"zh-TW\">中文（繁体）</option>\n          <option value=\"en\">英语</option>\n          <option value=\"ja\">日语</option>\n          <option value=\"ko\">韩语</option>\n          <option value=\"fr\">法语</option>\n          <option value=\"de\">德语</option>\n          <option value=\"es\">西班牙语</option>\n          <option value=\"ru\">俄语</option>\n          <option value=\"it\">意大利语</option>\n          <option value=\"pt\">葡萄牙语</option>\n          <option value=\"ar\">阿拉伯语</option>\n        </select>\n      </div>\n      <div class=\"currency-row\">\n        <label>目标语言</label>\n        <select id=\"transTo\">\n          <option value=\"en\">英语</option>\n          <option value=\"zh-CN\">中文（简体）</option>\n          <option value=\"zh-TW\">中文（繁体）</option>\n          <option value=\"ja\">日语</option>\n          <option value=\"ko\">韩语</option>\n          <option value=\"fr\">法语</option>\n          <option value=\"de\">德语</option>\n          <option value=\"es\">西班牙语</option>\n          <option value=\"ru\">俄语</option>\n          <option value=\"it\">意大利语</option>\n          <option value=\"pt\">葡萄牙语</option>\n          <option value=\"ar\">阿拉伯语</option>\n        </select>\n      </div>\n      <label>输入文本</label>\n      <textarea id=\"transInput\" rows=\"4\" style=\"width:100%;padding:12px;border-radius:12px;border:1px solid var(--border-color);color:var(--text-primary);font-size:15px;resize:vertical;box-sizing:border-box;\" placeholder=\"输入要翻译的文本...\"></textarea>\n      <button class=\"qr-btn\" onclick=\"doTranslate()\">立即翻译</button>\n      <div id=\"transResult\" style=\"display:none;margin-top:16px;padding:14px;border-radius:12px;background:var(--bg-card);border:1px solid var(--border-color);line-height:1.7;font-size:15px;\"></div>\n      <div class=\"currency-source\">\n        数据来源：<a href=\"https://mymemory.translated.net\" target=\"_blank\" rel=\"noopener\">MyMemory</a>（免费翻译API）\n      </div>\n    </div>\n  </div>\n");
async function doTranslate(){
  const text=document.getElementById('transInput').value.trim();
  const from=document.getElementById('transFrom').value;
  const to=document.getElementById('transTo').value;
  const resultEl=document.getElementById('transResult');
  if(!text){resultEl.style.display='block';resultEl.textContent='请输入要翻译的文本';return;}
  if(from===to){resultEl.style.display='block';resultEl.textContent='源语言和目标语言不能相同';return;}
  resultEl.style.display='block';resultEl.innerHTML='<span style="opacity:0.6;">翻译中...</span>';
  try{
    const url='https://api.mymemory.translated.net/get?q='+encodeURIComponent(text)+'&langpair='+from+'|'+to;
    const res=await fetch(url);
    const data=await res.json();
    if(data.responseData&&data.responseData.translatedText){
      resultEl.textContent=data.responseData.translatedText;
    }else{
      resultEl.textContent='翻译失败，请稍后重试';
    }
  }catch(e){
    resultEl.textContent='请求失败，请检查网络后重试';
  }
}
