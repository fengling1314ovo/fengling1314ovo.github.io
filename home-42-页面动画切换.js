// ==================== 页面动画切换 ====================
let currentPageAnim=lsGet('page_anim','default');
const pageAnimMap={
  default:{name:'pageAnimDefault',duration:'0.28s',ease:'ease'},
  slide:{name:'pageAnimSlide',duration:'0.3s',ease:'ease-out'},
  zoom:{name:'pageAnimZoom',duration:'0.35s',ease:'cubic-bezier(0.34,1.56,0.64,1)'},
  rotate:{name:'pageAnimRotate',duration:'0.35s',ease:'cubic-bezier(0.34,1.56,0.64,1)'},
  blur:{name:'pageAnimBlur',duration:'0.35s',ease:'ease-out'}
};
function applyPageAnim(type){
  const cfg=pageAnimMap[type]||pageAnimMap.default;
  document.body.style.setProperty('--page-anim-name',cfg.name);
  document.body.style.setProperty('--page-anim-duration',cfg.duration);
  document.body.style.setProperty('--page-anim-ease',cfg.ease);
}
function setPageAnim(type){
  currentPageAnim=type;
  lsSet('page_anim',type);
  document.querySelectorAll('.page-anim-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.anim===type);
  });
  applyPageAnim(type);
  if(typeof playSound==='function')playSound('click');
}
applyPageAnim(currentPageAnim);
// 初始化时同步按钮选中状态
function initPageAnimButtons(){
  document.querySelectorAll('.page-anim-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.anim===currentPageAnim);
  });
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded',initPageAnimButtons,{once:true});
}else{
  initPageAnimButtons();
}

/* 轻量加载器：fl.js 只会在用户打开加密音频工具时请求。 */
(function () {
  let loadPromise = null;

  function showLoadError(host) {
    if (typeof window.flRenderLoadErrorCard === "function") {
      host.replaceChildren(window.flRenderLoadErrorCard(
        "音频工具加载失败，请检查网络后重试。",
        "",
        window.flLoadAudioTool
      ));
      return;
    }
    host.textContent = "音频工具加载失败，请检查网络后重试。";
  }

  function ensureScript() {
    if (typeof window.initFlAudioTool === "function") return Promise.resolve();
    if (loadPromise) return loadPromise;
    loadPromise = window.flLoadScriptOnce("https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.min.js")
      .then(function () { return window.flLoadScriptOnce("./js/fl.js"); })
      .then(function () {
        if (typeof window.initFlAudioTool !== "function") {
          throw new Error("音频工具脚本没有提供初始化函数");
        }
      })
      .catch(function (error) {
        loadPromise = null;
        throw error;
      });
    return loadPromise;
  }
  window.flLoadAudioTool = function flLoadAudioTool() {
    const host = document.getElementById("flAudioToolHost");
    if (!host) return;
    if (typeof window.initFlAudioTool === "function") {
      window.initFlAudioTool();
      return;
    }
    host.textContent = "正在加载音频工具…";
    ensureScript()
      .then(function () { window.initFlAudioTool(); })
      .catch(function () { showLoadError(host); });
  };
})();
