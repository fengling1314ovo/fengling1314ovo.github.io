/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageSpotDiffPage", "<!-- pageSpotDiffPage -->\n<div class=\"tool-page\" id=\"pageSpotDiffPage\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <h3>🔍 找不同</h3>\n    <div class=\"game-info\">\n      <span>差异 <b id=\"sdFound\">0/4</b></span>\n      <span>时间 <b id=\"sdTime\">60</b>s</span>\n    </div>\n    <div class=\"sd-wrap\">\n      <div>\n        <div style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-bottom:4px;\">图 A</div>\n        <div class=\"sd-panel\" id=\"sdPanelA\"></div>\n      </div>\n      <div>\n        <div style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-bottom:4px;\">图 B</div>\n        <div class=\"sd-panel\" id=\"sdPanelB\"></div>\n      </div>\n    </div>\n    <div class=\"game-controls\">\n      <button class=\"common-btn\" id=\"sdStartBtn\" onclick=\"sdStart()\">▶️ 开始游戏</button>\n    </div>\n    <p style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-top:8px;\">在两张图中找出全部不同之处，点击正确位置标记，点错扣 3 秒</p>\n  </div>\n</div>");
// ==================== 1. 找不同 spotDiff ====================
var SD_ROWS = 4, SD_COLS = 5, SD_TOTAL = 4;
var SD_POOL = ['🌸','🌈','🌙','⭐','☀️','☁️','🌲','🌊','🌷','🦋','🐝','🍄','🌵','🐦','🐚','🐢'];
let sdGridA = [], sdGridB = [], sdDiffs = [], sdFoundSet = {}, sdTime = 60, sdTimer = null, sdPlaying = false;

function sdRender() {
  const pa = document.getElementById('sdPanelA');
  const pb = document.getElementById('sdPanelB');
  pa.innerHTML = ''; pb.innerHTML = '';
  for (let r = 0; r < SD_ROWS; r++) {
    for (let c = 0; c < SD_COLS; c++) {
      const key = r + ',' + c;
      const isDiff = sdDiffs.some(d => d.r === r && d.c === c);
      const found = sdFoundSet[key];
      const a = document.createElement('div');
      a.className = 'sd-cell' + (found ? ' sd-found' : '');
      a.textContent = sdGridA[r][c];
      if (isDiff && !found) a.onclick = () => sdRight(r, c);
      else if (!found) a.onclick = () => sdWrong(r, c);
      pa.appendChild(a);
      const b = document.createElement('div');
      b.className = 'sd-cell' + (found ? ' sd-found' : '');
      b.textContent = sdGridB[r][c];
      if (isDiff && !found) b.onclick = () => sdRight(r, c);
      else if (!found) b.onclick = () => sdWrong(r, c);
      pb.appendChild(b);
    }
  }
}

function sdBuild() {
  sdGridA = []; sdGridB = []; sdDiffs = []; sdFoundSet = {};
  for (let r = 0; r < SD_ROWS; r++) {
    const rowA = [], rowB = [];
    for (let c = 0; c < SD_COLS; c++) {
      const e = SD_POOL[Math.floor(Math.random() * SD_POOL.length)];
      rowA.push(e); rowB.push(e);
    }
    sdGridA.push(rowA); sdGridB.push(rowB);
  }
  const cells = [];
  for (let r = 0; r < SD_ROWS; r++) for (let c = 0; c < SD_COLS; c++) cells.push({ r, c });
  cells.sort(() => Math.random() - 0.5);
  for (let i = 0; i < SD_TOTAL; i++) {
    const { r, c } = cells[i];
    let ne;
    do { ne = SD_POOL[Math.floor(Math.random() * SD_POOL.length)]; } while (ne === sdGridB[r][c]);
    sdGridB[r][c] = ne;
    sdDiffs.push({ r, c });
  }
  document.getElementById('sdFound').textContent = '0/' + SD_TOTAL;
  sdRender();
}

function sdRight(r, c) {
  if (!sdPlaying) return;
  const key = r + ',' + c;
  if (sdFoundSet[key]) return;
  sdFoundSet[key] = true;
  const foundCount = Object.keys(sdFoundSet).length;
  document.getElementById('sdFound').textContent = foundCount + '/' + SD_TOTAL;
  sdRender();
  if (foundCount === SD_TOTAL) sdWin();
}

function sdWrong(r, c) {
  if (!sdPlaying) return;
  sdTime = Math.max(0, sdTime - 3);
  document.getElementById('sdTime').textContent = sdTime;
  showToast('❌ 点错了！-3 秒');
  const cells = document.querySelectorAll('#sdPanelA .sd-cell, #sdPanelB .sd-cell');
  // 简单抖动提示：不额外改样式，时间已扣除
  if (sdTime <= 0) sdLose();
}

function sdStart() {
  sdBuild();
  sdTime = 60; sdPlaying = true;
  document.getElementById('sdTime').textContent = '60';
  document.getElementById('sdStartBtn').textContent = '🔄 重新开始';
  if (sdTimer) clearInterval(sdTimer);
  sdTimer = setInterval(() => {
    sdTime--; document.getElementById('sdTime').textContent = sdTime;
    if (sdTime <= 0) sdLose();
  }, 1000);
}

function sdWin() {
  if (sdTimer) { clearInterval(sdTimer); sdTimer = null; }
  sdPlaying = false;
  const reward = Math.max(5, sdTime);
  bpAddCoins(reward, 'spotdiff');
  showToast('🎉 全部找到！剩余 ' + sdTime + ' 秒，获得 ' + reward + ' 金币');
}

function sdLose() {
  if (!sdPlaying) return;
  if (sdTimer) { clearInterval(sdTimer); sdTimer = null; }
  sdPlaying = false;
  showToast('⏰ 时间到！找到 ' + Object.keys(sdFoundSet).length + ' 个差异');
}

function initSpotDiff() {
  const pa = document.getElementById('sdPanelA');
  const pb = document.getElementById('sdPanelB');
  pa.innerHTML = ''; pb.innerHTML = '';
  // 占位提示
  for (let i = 0; i < SD_ROWS * SD_COLS; i++) {
    const a = document.createElement('div'); a.className = 'sd-cell'; a.textContent = '❓';
    const b = document.createElement('div'); b.className = 'sd-cell'; b.textContent = '❓';
    pa.appendChild(a); pb.appendChild(b);
  }
  document.getElementById('sdFound').textContent = '0/' + SD_TOTAL;
  document.getElementById('sdTime').textContent = '60';
  document.getElementById('sdStartBtn').textContent = '▶️ 开始游戏';
}



/* 离开找不同页面时停止该游戏计时器。 */
(function installSpotDiffCleanup() {
  const previousCleanup = window.cleanupBeforePageSwitch;
  window.cleanupBeforePageSwitch = function () {
    try {
      if (typeof previousCleanup === 'function') previousCleanup.apply(this, arguments);
    } finally {
      if (sdTimer) { clearInterval(sdTimer); sdTimer = null; sdPlaying = false; }
    }
  };
})();

// 游戏专属样式按需随游戏模块加载。
(function installGameStyles(){
  if(document.getElementById('flSpotDiffStyles'))return;
  /* Styles moved to css/toolbox-92-1.-找不同-spotDiff.css. */
})();
