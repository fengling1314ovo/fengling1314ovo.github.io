/* JS资源目录：仅在打开资源下载页时按需加载。 */
(function(){
  const files = ["account.js","fl.js","home-01-视频提取音频.js","home-02-网站状态检测.js","home-03-油价查询.js","home-04-短视频去水印.js","home-05-从视频提取音频（ffmpeg.wasm）.js","home-06-图床上传（极速图床）.js","home-07-国庆头像生成器.js","home-08-数字文本生成器.js","home-09-密码强度检测.js","home-10-收藏夹功能.js","home-11-弹窗逻辑.js","home-12-主题色.js","home-13-背景流动.js","home-14-节日弹窗系统（API驱动）.js","home-15-QQ好友工具.js","home-16-QQ群工具.js","home-17-二维码生成.js","home-18-条形码生成.js","home-19-扫码识别.js","home-tool-form-styles.js","home-20-汇率换算.js","home-21-IP-查询.js","home-22-域名解析.js","home-23-天气查询.js","home-24-刷新率测试.js","home-25-AES加密.js","home-26-时间戳转换.js","home-27-文本工具.js","home-28-随机数.js","home-29-JSON格式化.js","home-30-Base64.js","home-31-进制转换.js","home-32-UUID.js","home-33-百宝箱：密码生成器.js","home-34-百宝箱：亲戚称呼计算器.js","home-35-百宝箱：年龄计算器.js","home-36-百宝箱：摩斯密码.js","home-37-新增工具：通用复制辅助.js","home-38-单位换算器.js","home-39-全局搜索.js","home-40-音效系统.js","home-41-节日主题（粒子效果）.js","home-42-页面动画切换.js","home-43-天数计算.js","home-44-在线翻译.js","home-45-卡片渐入动画.js","home-99-JS资源下载页.js","intro-page.js","home-core.js","home-range-control.js","home.js","home-ui-core.js","home-about-entry.js","home-route-loader.js","home-author-qq-modal.js","home-account-entry.js","home-modal-common.js","home-segmented-control.js","tool-pages.js","toolbox-01-intro.js","toolbox-02-俄罗斯方块.js","toolbox-03-五子棋.js","toolbox-04-2048.js","toolbox-05-打砖块.js","toolbox-06-别踩白块.js","toolbox-07-打弹珠.js","toolbox-08-弹珠库存与商店.js","toolbox-10-百宝箱：掷骰子.js","toolbox-100-动物性格测试.js","toolbox-101-颜值打分器.js","toolbox-102-人品计算器.js","toolbox-107-百宝箱：抽签.js","toolbox-11-百宝箱：抛硬币.js","toolbox-12-百宝箱：今天吃什么.js","toolbox-13-百宝箱：是或否决策器.js","toolbox-14-百宝箱：抽卡模拟器.js","toolbox-15-百宝箱：石头剪刀布.js","toolbox-16-百宝箱：魔法8球.js","toolbox-17-百宝箱：今日运势.js","toolbox-18-百宝箱：今日人品.js","toolbox-19-背包系统.js","toolbox-21-符文收藏.js","toolbox-22-雷诺曼收藏.js","toolbox-23-神谕卡收藏.js","toolbox-24-基博卡收藏.js","toolbox-25-百宝箱：老虎机.js","toolbox-26-百宝箱：猜数字.js","toolbox-27-百宝箱分类筛选.js","toolbox-28-百宝箱：扫雷.js","toolbox-29-百宝箱：井字棋.js","toolbox-30-百宝箱：记忆翻牌.js","toolbox-31-百宝箱：打地鼠.js","toolbox-32-百宝箱：星座运势.js","toolbox-33-百宝箱：生肖配对.js","toolbox-34-百宝箱：姓名配对.js","toolbox-35-百宝箱：心理年龄测试.js","toolbox-36-百宝箱：左右脑测试.js","toolbox-37-百宝箱：前世身份.js","toolbox-38-百宝箱：纪念日倒计时.js","toolbox-39-百宝箱：卡路里计算器.js","toolbox-40-百宝箱：排卵期计算器.js","toolbox-41-百宝箱：随机点名.js","toolbox-42-百宝箱：随机分组.js","toolbox-43-百宝箱：藏头诗生成.js","toolbox-44-百宝箱：凯撒密码.js","toolbox-45-百宝箱：文字反转.js","toolbox-46-新增工具：真心话大冒险.js","toolbox-47-新增工具：冷笑话大全.js","toolbox-48-新增工具：脑筋急转弯.js","toolbox-49-新增工具：24点.js","toolbox-50-新增工具：成语接龙.js","toolbox-51-新增工具：读心术.js","toolbox-53-塔罗牌占卜（优化版）.js","toolbox-54-占星骰子.js","toolbox-55-符文占卜.js","toolbox-56-灵摆占卜.js","toolbox-57-雷诺曼卡牌.js","toolbox-58-天使神谕卡.js","toolbox-59-基博卡.js","toolbox-divination-card-styles.js","toolbox-60-新增工具：周公解梦.js","toolbox-61-新增工具：MBTI人格测试.js","toolbox-62-新增工具：IQ智商测试.js","toolbox-63-新增工具：血型配对.js","toolbox-64-新增工具：测字.js","toolbox-65-新增工具：幸运转盘（多转盘版）.js","toolbox-67-新增工具：扭蛋机.js","toolbox-68-扭蛋机道具系统.js","toolbox-69-新增工具：成就徽章.js","toolbox-70-打工相关成就.js","toolbox-71-每日任务相关成就.js","toolbox-72-宠物相关成就.js","toolbox-73-数字命理学.js","toolbox-74-茶叶占卜.js","toolbox-75-水晶球占卜.js","toolbox-76-状态系统.js","toolbox-92-1.-找不同-spotDiff.js","toolbox-93-2.-消消乐-match3.js","toolbox-94-3.-打字通-typing.js","toolbox-95-4.-连连看-linkGame.js","toolbox-98-新增工具组B：公共工具.js","toolbox-99-今日宜忌.js","toolbox-chest-core.js","toolbox-chest-home.js","toolbox-wallet.js","toolbox.js"];
  const markup = [
    '<div class="tool-page" id="pageJsResources">',
    '  <div class="tool-header"><button class="back-btn" type="button" onclick="goHome()"><span>←</span> 返回上一级</button></div>',
    '  <div class="breadcrumb"></div>',
    '  <div class="common-block" style="padding:0 28px 32px">',
    '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">',
    '  <h3 style="margin:0;">📦 下载 JS 资源</h3>',
    '</div>',
    '  <div id="flJsResourceSourceDialog" class="modal-mask" style="display:none;z-index:10005;overscroll-behavior:contain;">',
    '    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="flJsResourceSourceTitle" style="width:calc(100% - 40px);max-width:380px;min-width:0;box-sizing:border-box;padding:22px 22px 82px;overscroll-behavior:contain;">',
    '      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;">',
    '        <h4 id="flJsResourceSourceTitle" style="margin:0;">选择下载源</h4>',
    '      </div>',
    '      <p style="margin:8px 0 16px;font-size:13px;line-height:1.6;color:var(--text-secondary);">只影响本页“预加载”获取资源的地址</p>',
    '      <div style="display:grid;gap:10px;">',
    '        <button type="button" class="common-btn" data-fl-js-resource-source="fengling" aria-pressed="false" style="width:100%;justify-content:space-between;margin:4px 0;padding:12px 14px;">',
    '          <span>枫铃源站</span><span data-fl-js-resource-current style="display:none;color:#000!important;-webkit-text-fill-color:#000!important;opacity:1!important;filter:none!important;font-size:12px;font-weight:700;">当前使用</span>',
    '        </button>',
    '        <button type="button" class="common-btn" data-fl-js-resource-source="github" aria-pressed="false" style="width:100%;justify-content:space-between;margin:4px 0;padding:12px 14px;">',
    '          <span>GitHub 镜像</span><span data-fl-js-resource-current style="display:none;color:#000!important;-webkit-text-fill-color:#000!important;opacity:1!important;filter:none!important;font-size:12px;font-weight:700;">当前使用</span>',
    '        </button>',
    '      </div>',
    '      <button type="button" id="flJsResourceSourceConfirm" class="personal-modal-confirm"><span aria-hidden="true">✓</span>确认</button>',
    '    </div>',
    '  </div>',
    '  <div id="flJsResourcePackageDialog" class="modal-mask" style="display:none;z-index:10005;overscroll-behavior:contain;">',
    '    <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="flJsResourcePackageTitle" style="width:calc(100% - 40px);max-width:380px;min-width:0;box-sizing:border-box;padding:22px 22px 82px;overscroll-behavior:contain;">',
    '      <h4 id="flJsResourcePackageTitle" style="margin:0 0 12px;">整包下载</h4>',
    '      <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:var(--text-secondary);">点击确认后，将强制从 GitHub 镜像完整预加载所有功能所需的 JS 资源，约占用 1 MB 浏览器缓存空间。下载过程不会执行脚本，请保持页面打开直到完成。</p>',
    '      <button type="button" id="flJsResourcePackageCancel" class="common-btn" style="width:100%;margin:4px 0;padding:10px 14px;background:var(--bg-input);color:var(--text-secondary);">取消</button>',
    '      <button type="button" id="flJsResourcePackageConfirm" class="personal-modal-confirm"><span aria-hidden="true">✓</span>确认下载</button>',
    '    </div>',
    '  </div>',
    '    <div class="fl-js-resource-tabs" role="tablist" aria-label="资源缓存状态">',
    '      <button class="fl-js-resource-tab active" type="button" role="tab" aria-selected="true" data-fl-js-resource-view="undownloaded">未下载</button>',
    '      <button class="fl-js-resource-tab" type="button" role="tab" aria-selected="false" data-fl-js-resource-view="downloaded">已下载</button>',
    '    </div>',
    '    <div class="fl-js-resource-toolbar">',
    '      <input class="fl-js-resource-search" id="flJsResourceSearch" type="search" placeholder="搜索文件名…" autocomplete="off">',
    '      <div class="fl-js-resource-actions">',
    '        <button type="button" id="flJsResourcePackageButton" class="common-btn fl-js-resource-action-btn" aria-haspopup="dialog" aria-expanded="false">整包下载</button>',
    '        <div id="flJsResourceSourcePicker"><button type="button" id="flJsResourceSourceToggle" class="common-btn fl-js-resource-action-btn" aria-haspopup="dialog" aria-expanded="false">下载源</button></div>',
    '      </div>',
    '    </div>',
    '    <div class="fl-js-resource-count-row"><span class="fl-js-resource-count" id="flJsResourceCount"></span></div>',
    '    <div class="fl-js-resource-list" id="flJsResourceList"></div>',
    '    <div class="fl-js-resource-empty" id="flJsResourceEmpty" style="display:none;"></div>',
    '  </div>',
    '</div>'
  ].join('');
  window.flRegisterToolPage('pageJsResources', markup);

  const list = document.getElementById('flJsResourceList');
  const search = document.getElementById('flJsResourceSearch');
  const count = document.getElementById('flJsResourceCount');
  const empty = document.getElementById('flJsResourceEmpty');
  const tabs = Array.from(document.querySelectorAll('[data-fl-js-resource-view]'));
  let activeView = 'undownloaded';
  const sourceToggle = document.getElementById('flJsResourceSourceToggle');
  const sourceDialog = document.getElementById('flJsResourceSourceDialog');
  const sourceConfirm = document.getElementById('flJsResourceSourceConfirm');
  const packageButton = document.getElementById('flJsResourcePackageButton');
  const packageDialog = document.getElementById('flJsResourcePackageDialog');
  const packageConfirm = document.getElementById('flJsResourcePackageConfirm');
  const packageCancel = document.getElementById('flJsResourcePackageCancel');
  const sourceOptions = sourceDialog ? Array.from(sourceDialog.querySelectorAll('[data-fl-js-resource-source]')) : [];
  let pendingSource = 'fengling';
  let pendingResourcePreloads = 0;
  let packagePreloadRunning = false;
  let resourceRenderTimer = null;
  let sourceDialogCloseTimer = null;
  let packageDialogCloseTimer = null;
  function getCurrentSource(){
    return typeof window.flGetJsResourceSource === 'function' ? window.flGetJsResourceSource() : 'github';
  }
  function getDownloadedFiles(){
    return window.__flLoadedJsResources || (window.__flLoadedJsResources = new Set());
  }
  function focusWithoutScroll(element){
    if(!element || typeof element.focus !== 'function') return;
    try{ element.focus({preventScroll:true}); }
    catch(error){ element.focus(); }
  }
  function closeSourceDialog(){
    if(!sourceDialog || !sourceToggle) return;
    if(sourceDialogCloseTimer) clearTimeout(sourceDialogCloseTimer);
    sourceDialog.classList.add('closing');
    sourceDialogCloseTimer = setTimeout(function(){
      sourceDialog.style.display = 'none';
      sourceDialog.classList.remove('closing');
      sourceDialogCloseTimer = null;
    }, 200);
    pendingSource = getCurrentSource();
    sourceToggle.setAttribute('aria-expanded', 'false');
    focusWithoutScroll(sourceToggle);
  }
  function openSourceDialog(){
    if(!sourceDialog || !sourceToggle) return;
    pendingSource = getCurrentSource();
    updateSourcePicker();
    document.body.appendChild(sourceDialog);
    if(sourceDialogCloseTimer){
      clearTimeout(sourceDialogCloseTimer);
      sourceDialogCloseTimer = null;
    }
    sourceDialog.classList.remove('closing');
    sourceDialog.style.display = 'flex';
    sourceToggle.setAttribute('aria-expanded', 'true');
    const selected = sourceOptions.find(function(option){ return option.dataset.flJsResourceSource === pendingSource; });
    focusWithoutScroll(selected || sourceConfirm || sourceDialog);
  }
  function updateSourcePicker(){
    if(!sourceToggle || !sourceDialog) return;
    const currentSource = getCurrentSource();
    const label = currentSource === 'github' ? 'GitHub 镜像' : '枫铃源站';
    sourceToggle.textContent = '下载源';
    sourceToggle.setAttribute('aria-label', '下载源，当前为' + label);
    sourceOptions.forEach(function(option){
      const selected = option.dataset.flJsResourceSource === pendingSource;
      option.setAttribute('aria-pressed', selected ? 'true' : 'false');
      option.classList.toggle('btn-primary', selected);
      const currentLabel = option.querySelector('[data-fl-js-resource-current]');
      if(currentLabel){
        currentLabel.textContent = option.dataset.flJsResourceSource === currentSource ? '当前使用' : '待确认';
        currentLabel.style.display = selected ? 'inline-flex' : 'none';
        currentLabel.style.setProperty('color', '#000', 'important');
        currentLabel.style.setProperty('-webkit-text-fill-color', '#000', 'important');
        currentLabel.style.setProperty('opacity', '1', 'important');
        currentLabel.style.setProperty('filter', 'none', 'important');
      }
    });
  }
  if(sourceToggle && sourceDialog){
    sourceToggle.addEventListener('click', openSourceDialog);
    sourceOptions.forEach(function(option){
      option.addEventListener('click', function(){
        pendingSource = option.dataset.flJsResourceSource;
        updateSourcePicker();
      });
    });
    if(sourceConfirm) sourceConfirm.addEventListener('click', function(){
      const nextSource = pendingSource;
      const changed = nextSource !== getCurrentSource();
      if(typeof window.flSetJsResourceSource === 'function') window.flSetJsResourceSource(nextSource);
      closeSourceDialog();
      updateSourcePicker();
      if(changed && typeof window.showToast === 'function') window.showToast('下载源已切换为' + (nextSource === 'github' ? 'GitHub 镜像' : '枫铃源站') + '，仅本页预加载生效');
    });
    sourceDialog.addEventListener('wheel', function(event){
      const panel = event.target.closest && event.target.closest('.modal-box');
      if(!panel || panel.scrollHeight <= panel.clientHeight) event.preventDefault();
    }, {passive:false});
    sourceDialog.addEventListener('touchmove', function(event){
      const panel = event.target.closest && event.target.closest('.modal-box');
      if(!panel || panel.scrollHeight <= panel.clientHeight) event.preventDefault();
    }, {passive:false});
    sourceDialog.addEventListener('click', function(event){
      const target = event.target instanceof Element ? event.target : null;
      const allowedControl = target && target.closest('[data-fl-js-resource-source],#flJsResourceSourceConfirm');
      if(!allowedControl){
        event.preventDefault();
        event.stopPropagation();
      }
    });
    sourceDialog.addEventListener('keydown', function(event){
      if(event.key !== 'Tab') return;
      const controls = sourceOptions.concat(sourceConfirm).filter(function(control){ return control && !control.disabled; });
      if(!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if(event.shiftKey && document.activeElement === first){
        event.preventDefault();
        focusWithoutScroll(last);
      }else if(!event.shiftKey && document.activeElement === last){
        event.preventDefault();
        focusWithoutScroll(first);
      }
    });
  }
  function closePackageDialog(){
    if(!packageDialog || !packageButton) return;
    if(packageDialogCloseTimer) clearTimeout(packageDialogCloseTimer);
    packageDialog.classList.add('closing');
    packageDialogCloseTimer = setTimeout(function(){
      packageDialog.style.display = 'none';
      packageDialog.classList.remove('closing');
      packageDialogCloseTimer = null;
    }, 200);
    packageButton.setAttribute('aria-expanded', 'false');
    focusWithoutScroll(packageButton);
  }
  function openPackageDialog(){
    if(!packageDialog || !packageButton || packagePreloadRunning) return;
    document.body.appendChild(packageDialog);
    if(packageDialogCloseTimer){
      clearTimeout(packageDialogCloseTimer);
      packageDialogCloseTimer = null;
    }
    packageDialog.classList.remove('closing');
    packageDialog.style.display = 'flex';
    packageButton.setAttribute('aria-expanded', 'true');
    focusWithoutScroll(packageCancel || packageConfirm || packageDialog);
  }
  function startPackagePreload(){
    if(packagePreloadRunning) return;
    if(typeof window.flPreloadJsResource !== 'function'){
      if(typeof window.showToast === 'function') window.showToast('整包下载功能尚未就绪，请刷新后重试');
      return;
    }
    const packageFiles = Array.from(new Set(files));
    const total = packageFiles.length;
    let nextIndex = 0;
    let completed = 0;
    const failedFiles = [];
    packagePreloadRunning = true;
    pendingResourcePreloads++;
    if(packageButton){
      packageButton.disabled = true;
      packageButton.textContent = '下载中 0/' + total;
    }
    if(typeof window.showToast === 'function') window.showToast('正在从 GitHub 镜像预加载整包资源…', 3500);
    async function preloadWorker(){
      while(nextIndex < packageFiles.length){
        const file = packageFiles[nextIndex++];
        try{
          await window.flPreloadJsResource(file, {source:'github'});
        }catch(error){
          failedFiles.push(file);
          console.error('整包预加载失败：' + file, error);
        }
        completed++;
        if(packageButton) packageButton.textContent = '下载中 ' + completed + '/' + total;
      }
    }
    const workerCount = Math.min(6, total);
    Promise.all(Array.from({length:workerCount}, preloadWorker)).then(function(){
      packagePreloadRunning = false;
      pendingResourcePreloads = Math.max(0, pendingResourcePreloads - 1);
      if(packageButton){
        packageButton.disabled = false;
        packageButton.textContent = '整包下载';
      }
      if(!pendingResourcePreloads) render(search.value);
      if(typeof window.showToast === 'function'){
        if(failedFiles.length){
          window.showToast('整包预加载完成：成功 ' + (total - failedFiles.length) + '/' + total + ' 个，失败 ' + failedFiles.length + ' 个');
        }else{
          window.showToast('✅ 整包预加载完成，资源来自 GitHub 镜像');
        }
      }
    });
  }
  if(packageButton && packageDialog){
    packageButton.addEventListener('click', openPackageDialog);
    if(packageCancel) packageCancel.addEventListener('click', closePackageDialog);
    if(packageConfirm) packageConfirm.addEventListener('click', function(){
      closePackageDialog();
      startPackagePreload();
    });
    packageDialog.addEventListener('wheel', function(event){
      const panel = event.target.closest && event.target.closest('.modal-box');
      if(!panel || panel.scrollHeight <= panel.clientHeight) event.preventDefault();
    }, {passive:false});
    packageDialog.addEventListener('touchmove', function(event){
      const panel = event.target.closest && event.target.closest('.modal-box');
      if(!panel || panel.scrollHeight <= panel.clientHeight) event.preventDefault();
    }, {passive:false});
    packageDialog.addEventListener('click', function(event){
      const target = event.target instanceof Element ? event.target : null;
      const allowedControl = target && target.closest('#flJsResourcePackageCancel,#flJsResourcePackageConfirm');
      if(!allowedControl){
        event.preventDefault();
        event.stopPropagation();
      }
    });
    packageDialog.addEventListener('keydown', function(event){
      if(event.key === 'Escape'){
        event.preventDefault();
        closePackageDialog();
        return;
      }
      if(event.key !== 'Tab') return;
      const controls = [packageCancel, packageConfirm].filter(function(control){ return control && !control.disabled; });
      if(!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if(event.shiftKey && document.activeElement === first){
        event.preventDefault();
        focusWithoutScroll(last);
      }else if(!event.shiftKey && document.activeElement === last){
        event.preventDefault();
        focusWithoutScroll(first);
      }
    });
  }
  if(typeof window.flRecordJsResourceLoad === 'function'){
    document.querySelectorAll('script[src]').forEach(function(script){ window.flRecordJsResourceLoad(script.src); });
  }
  function render(query){
    const previousScrollX = window.scrollX;
    const previousScrollY = window.scrollY;
    const normalized = String(query || '').trim().toLocaleLowerCase();
    const matches = files.filter(function(file){
      const isLoaded = getDownloadedFiles().has(file);
      const inSelectedView = activeView === 'downloaded' ? isLoaded : !isLoaded;
      return inSelectedView && file.toLocaleLowerCase().includes(normalized);
    });
    list.replaceChildren();
    matches.forEach(function(file){
      const row = document.createElement('div');
      row.className = 'fl-js-resource-item fl-state-material-card';
      const name = document.createElement('span');
      name.className = 'fl-js-resource-name';
      name.textContent = '📄 ' + file;
      const action = document.createElement('button');
      action.type = 'button';
      action.className = 'fl-js-resource-download';
      action.disabled = getDownloadedFiles().has(file);
      action.textContent = action.disabled ? '已下载' : '预加载';
      action.setAttribute('aria-label', (action.disabled ? '已下载 ' : '预加载 ') + file);
      action.addEventListener('click', function(){
        if(action.disabled) return;
        if(typeof window.flPreloadJsResource !== 'function'){
          if(typeof window.showToast === 'function') window.showToast('预加载功能尚未就绪，请刷新后重试');
          return;
        }
        action.disabled = true;
        action.textContent = '加载中…';
        pendingResourcePreloads++;
        Promise.resolve().then(function(){ return window.flPreloadJsResource(file); }).then(function(){
          pendingResourcePreloads = Math.max(0, pendingResourcePreloads - 1);
          if(!pendingResourcePreloads) render(search.value);
          if(typeof window.showToast === 'function') window.showToast('✅ 预加载完成：' + file);
        }).catch(function(error){
          console.error(error);
          pendingResourcePreloads = Math.max(0, pendingResourcePreloads - 1);
          action.disabled = false;
          action.textContent = '重试';
          if(!pendingResourcePreloads) render(search.value);
          if(typeof window.showToast === 'function') window.showToast('预加载失败：' + file);
        });
      });
      row.append(name, action);
      list.appendChild(row);
    });
    const downloadedCount = files.filter(function(file){ return getDownloadedFiles().has(file); }).length;
    count.textContent = '已下载 ' + downloadedCount + ' / ' + files.length + ' 个 · 当前显示 ' + matches.length + ' 个';
    empty.textContent = matches.length ? '' : normalized
      ? '没有找到匹配的 JS 文件。'
      : activeView === 'downloaded'
        ? '还没有已下载脚本，点击“未下载”中的“预加载”即可。'
        : '没有未下载资源。';
    empty.style.display = matches.length ? 'none' : 'block';
    window.scrollTo(previousScrollX, previousScrollY);
  }
  function scheduleResourceRender(){
    if(resourceRenderTimer) clearTimeout(resourceRenderTimer);
    resourceRenderTimer = setTimeout(function(){
      resourceRenderTimer = null;
      if(!pendingResourcePreloads) render(search.value);
    }, 80);
  }
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      activeView = tab.dataset.flJsResourceView;
      tabs.forEach(function(item){
        const selected = item === tab;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', selected ? 'true' : 'false');
      });
      render(search.value);
    });
  });
  window.addEventListener('fl-js-resource-loaded', function(event){
    const fileName = event.detail && event.detail.fileName;
    if(!fileName || !files.includes(fileName)) return;
    if(!pendingResourcePreloads) scheduleResourceRender();
  });
  window.addEventListener('fl-js-resource-source-changed', function(){
    pendingSource = getCurrentSource();
    updateSourcePicker();
  });
  window.closeJsResourceSourceDialog = closeSourceDialog;
  search.addEventListener('input', function(){ render(search.value); });
  updateSourcePicker();
  render('');
})();
