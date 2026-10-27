/* 百宝箱轻量入口。index.html 会在进入对应页面时按需加载工具模块。 */
(function () {
  const scriptBase = new URL(".", document.currentScript.src);
  const chestCoreModule = new URL("./toolbox-chest-core.js", scriptBase).href;
  window.flEnsureChestBase = function () {
    if (typeof window.openChestToolLoaded === "function") return Promise.resolve();
    return window.flLoadScriptOnce(chestCoreModule);
  };
  window.__flChestModulesReady = window.flEnsureChestBase();
})();
