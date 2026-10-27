/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageLinkGamePage", "<!-- pageLinkGamePage -->\n<div class=\"tool-page\" id=\"pageLinkGamePage\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <h3>🔗 连连看</h3>\n    <div class=\"game-info\">\n      <span>剩余 <b id=\"lkLeft\">0</b></span>\n      <span>时间 <b id=\"lkTime\">120</b>s</span>\n    </div>\n    <div class=\"lk-grid\" id=\"lkGrid\"></div>\n    <div class=\"game-controls\">\n      <button class=\"common-btn\" id=\"lkStartBtn\" onclick=\"lkStart()\">▶️ 开始游戏</button>\n    </div>\n    <p style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-top:8px;\">点击两个相同图案，能用不超过 2 个拐点连接即可消除，全部消除赢金币</p>\n  </div>\n</div>");
// ==================== 4. 连连看 linkGame ====================
var LK_ROWS = 6, LK_COLS = 8;
var LK_EMOJIS = ['🍎','🍊','🍋','🍇','🍓','🍉','🍒','🥝','🍑','🍍','🥥','🍅'];
let lkGrid = [], lkSelected = null, lkTime = 120, lkTimer = null, lkLeft = 0, lkLock = false;

function lkBuild() {
  const tiles = [];
  LK_EMOJIS.forEach(e => { for (let i = 0; i < 4; i++) tiles.push(e); });
  tiles.sort(() => Math.random() - 0.5);
  const rows = LK_ROWS + 2, cols = LK_COLS + 2;
  lkGrid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) row.push(0);
      else row.push(tiles[(r - 1) * LK_COLS + (c - 1)]);
    }
    lkGrid.push(row);
  }
  lkLeft = 48;
  if (!lkHasMove()) lkShuffle();
}

function lkShuffle() {
  const vals = [];
  for (let r = 1; r <= LK_ROWS; r++) for (let c = 1; c <= LK_COLS; c++) if (lkGrid[r][c]) vals.push(lkGrid[r][c]);
  vals.sort(() => Math.random() - 0.5);
  let i = 0;
  for (let r = 1; r <= LK_ROWS; r++) for (let c = 1; c <= LK_COLS; c++) if (lkGrid[r][c]) lkGrid[r][c] = vals[i++];
  if (!lkHasMove()) lkShuffle();
}

function lkSegClear(r1, c1, r2, c2) {
  if (r1 === r2) {
    const lo = Math.min(c1, c2), hi = Math.max(c1, c2);
    for (let c = lo + 1; c < hi; c++) if (lkGrid[r1][c]) return false;
    return true;
  }
  if (c1 === c2) {
    const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
    for (let r = lo + 1; r < hi; r++) if (lkGrid[r][c1]) return false;
    return true;
  }
  return false;
}

// 假设 (r1,c1) 为空起点，找一条 1 拐点折线连到 (r2,c2) 终点
function lkOneTurn(r1, c1, r2, c2) {
  const corners = [{ r: r1, c: c2 }, { r: r2, c: c1 }];
  for (const cn of corners) {
    if (!lkGrid[cn.r][cn.c] &&
      lkSegClear(r1, c1, cn.r, cn.c) &&
      lkSegClear(cn.r, cn.c, r2, c2)) {
      return [{ r: r1, c: c1 }, cn, { r: r2, c: c2 }];
    }
  }
  return null;
}

// 判断两个已选中方块 (ar,ac)-(br,bc) 能否用 <=2 拐点连接，返回拐点路径数组或 null
function lkCanConnect(ar, ac, br, bc) {
  if (ar === br && ac === bc) return null;
  if (!lkGrid[ar][ac] || !lkGrid[br][bc]) return null;
  if (lkGrid[ar][ac] !== lkGrid[br][bc]) return null;
  // 0 拐点：直线
  if (ar === br && lkSegClear(ar, ac, br, bc)) return [{ r: ar, c: ac }, { r: br, c: bc }];
  if (ac === bc && lkSegClear(ar, ac, br, bc)) return [{ r: ar, c: ac }, { r: br, c: bc }];
  // 1 拐点：两个矩形角
  const corners = [{ r: ar, c: bc }, { r: br, c: ac }];
  for (const cn of corners) {
    if (!lkGrid[cn.r][cn.c] &&
      lkSegClear(ar, ac, cn.r, cn.c) &&
      lkSegClear(cn.r, cn.c, br, bc)) {
      return [{ r: ar, c: ac }, cn, { r: br, c: bc }];
    }
  }
  // 2 拐点：A 沿直线走到空点 C，再 C 到 B 用 1 拐点
  const R = lkGrid.length, C = lkGrid[0].length;
  for (let c = 0; c < C; c++) {
    if (c === ac) continue;
    if (!lkGrid[ar][c] && lkSegClear(ar, ac, ar, c)) {
      const p = lkOneTurn(ar, c, br, bc);
      if (p) return [{ r: ar, c: ac }, ...p];
    }
  }
  for (let r = 0; r < R; r++) {
    if (r === ar) continue;
    if (!lkGrid[r][ac] && lkSegClear(ar, ac, r, ac)) {
      const p = lkOneTurn(r, ac, br, bc);
      if (p) return [{ r: ar, c: ac }, ...p];
    }
  }
  return null;
}

function lkHasMove() {
  const seen = {};
  for (let r = 1; r <= LK_ROWS; r++) {
    for (let c = 1; c <= LK_COLS; c++) {
      if (!lkGrid[r][c]) continue;
      const e = lkGrid[r][c];
      if (!seen[e]) seen[e] = [];
      for (const other of seen[e]) {
        if (lkCanConnect(r, c, other.r, other.c)) return true;
      }
      seen[e].push({ r, c });
    }
  }
  return false;
}

function lkRender() {
  const g = document.getElementById('lkGrid');
  g.innerHTML = '';
  lkClearLine();
  for (let r = 1; r <= LK_ROWS; r++) {
    for (let c = 1; c <= LK_COLS; c++) {
      const d = document.createElement('div');
      d.className = 'lk-cell';
      const v = lkGrid[r] ? lkGrid[r][c] : 0;
      d.textContent = v || '';
      if (!v) d.style.visibility = 'hidden';
      if (lkSelected && lkSelected.r === r && lkSelected.c === c) d.classList.add('lk-sel');
      d.onclick = () => lkClick(r, c);
      g.appendChild(d);
    }
  }
  document.getElementById('lkLeft').textContent = lkLeft;
}

function lkCellCenter(r, c) {
  const g = document.getElementById('lkGrid');
  const el = g.children[(r - 1) * LK_COLS + (c - 1)];
  const gRect = g.getBoundingClientRect();
  const eRect = el.getBoundingClientRect();
  return {
    x: (eRect.left - gRect.left) + eRect.width / 2,
    y: (eRect.top - gRect.top) + eRect.height / 2
  };
}

function lkDrawLine(path) {
  lkClearLine();
  const g = document.getElementById('lkGrid');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'lkOverlay';
  svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
  const pts = path.map(p => lkCellCenter(p.r, p.c));
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  poly.setAttribute('points', pts.map(p => p.x + ',' + p.y).join(' '));
  poly.setAttribute('fill', 'none');
  poly.setAttribute('stroke', '#10b981');
  poly.setAttribute('stroke-width', '4');
  poly.setAttribute('stroke-linecap', 'round');
  poly.setAttribute('stroke-linejoin', 'round');
  svg.appendChild(poly);
  g.appendChild(svg);
}

function lkClearLine() {
  const svg = document.getElementById('lkOverlay');
  if (svg && svg.parentNode) svg.parentNode.removeChild(svg);
}

function lkClick(r, c) {
  if (lkLock || lkTime <= 0) return;
  if (!lkGrid[r][c]) return;
  if (!lkSelected) { lkSelected = { r, c }; lkRender(); return; }
  if (lkSelected.r === r && lkSelected.c === c) { lkSelected = null; lkRender(); return; }
  if (lkGrid[lkSelected.r][lkSelected.c] !== lkGrid[r][c]) {
    lkSelected = { r, c }; lkRender(); return;
  }
  const path = lkCanConnect(lkSelected.r, lkSelected.c, r, c);
  if (path) {
    lkLock = true;
    lkDrawLine(path);
    const a = lkSelected;
    lkSelected = null;
    setTimeout(() => {
      lkGrid[a.r][a.c] = 0;
      lkGrid[r][c] = 0;
      lkLeft -= 2;
      lkRender();
      lkLock = false;
      if (lkLeft === 0) { lkWin(); return; }
      if (!lkHasMove()) {
        showToast('🔀 当前无可用配对，自动重排');
        lkShuffle(); lkRender();
      }
    }, 380);
  } else {
    showToast('❌ 无法连接（超过 2 个拐点）');
    lkSelected = { r, c }; lkRender();
  }
}

function lkStart() {
  lkBuild();
  lkSelected = null; lkTime = 120; lkLock = false;
  document.getElementById('lkTime').textContent = '120';
  document.getElementById('lkLeft').textContent = '48';
  lkRender();
  document.getElementById('lkStartBtn').textContent = '🔄 重新开始';
  if (lkTimer) clearInterval(lkTimer);
  lkTimer = setInterval(() => {
    lkTime--; document.getElementById('lkTime').textContent = lkTime;
    if (lkTime <= 0) lkLose();
  }, 1000);
}

function lkWin() {
  if (lkTimer) { clearInterval(lkTimer); lkTimer = null; }
  lkLock = true;
  const reward = Math.round(10 + lkTime * 0.2);
  bpAddCoins(reward, 'linkgame');
  showToast('🎉 全部消除！获得 ' + reward + ' 金币');
}

function lkLose() {
  if (lkTimer) { clearInterval(lkTimer); lkTimer = null; }
  lkLock = true;
  showToast('⏰ 时间到！剩余 ' + lkLeft + ' 块');
}

function initLinkGame() {
  const rows = LK_ROWS + 2, cols = LK_COLS + 2;
  lkGrid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(0);
    lkGrid.push(row);
  }
  lkLeft = 0; lkSelected = null; lkLock = false;
  lkRender();
  document.getElementById('lkTime').textContent = '120';
  document.getElementById('lkLeft').textContent = '0';
  document.getElementById('lkStartBtn').textContent = '▶️ 开始游戏';
}



/* 离开连连看页面时停止该游戏计时器。 */
(function installLinkGameCleanup() {
  const previousCleanup = window.cleanupBeforePageSwitch;
  window.cleanupBeforePageSwitch = function () {
    try {
      if (typeof previousCleanup === 'function') previousCleanup.apply(this, arguments);
    } finally {
      if (lkTimer) { clearInterval(lkTimer); lkTimer = null; lkLock = false; }
    }
  };
})();

// 游戏专属样式按需随游戏模块加载。
(function installGameStyles(){
  if(document.getElementById('flLinkGameStyles'))return;
  /* Styles moved to css/toolbox-95-4.-连连看-linkGame.css. */
})();
