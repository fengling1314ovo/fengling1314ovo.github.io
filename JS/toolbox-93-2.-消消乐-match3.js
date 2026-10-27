/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageMatch3Page", "<!-- pageMatch3Page -->\n<div class=\"tool-page\" id=\"pageMatch3Page\">\n  <div class=\"tool-header\">\n    <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n  </div>\n  <div class=\"breadcrumb\"></div>\n  <div class=\"common-block\" style=\"padding:0 28px 32px\">\n    <h3>🍎 消消乐</h3>\n    <div class=\"game-info\">\n      <span>分数 <b id=\"m3Score\">0</b></span>\n      <span>连击 <b id=\"m3Combo\">x1</b></span>\n      <span>时间 <b id=\"m3Time\">90</b>s</span>\n    </div>\n    <div class=\"m3-grid\" id=\"m3Grid\"></div>\n    <div class=\"game-controls\">\n      <button class=\"common-btn\" id=\"m3StartBtn\" onclick=\"m3Start()\">▶️ 开始游戏</button>\n    </div>\n    <p style=\"text-align:center;font-size:13px;color:var(--text-placeholder);margin-top:8px;\">点击两个相邻方块交换，三个及以上相同即消除，每 100 分 = 1 金币（上限 20）</p>\n  </div>\n</div>");
// ==================== 2. 消消乐 match3 ====================
var M3_ROWS = 8, M3_COLS = 8;
var M3_TYPES = ['🍎','🍊','🍋','🍇','🍓','🍉'];
let m3Grid = [], m3Score = 0, m3Time = 90, m3Timer = null, m3Sel = null, m3Lock = false, m3Combo = 0, m3TouchBound = false;

function m3RandType() { return M3_TYPES[Math.floor(Math.random() * M3_TYPES.length)]; }

function m3InitGrid() {
  m3Grid = [];
  for (let r = 0; r < M3_ROWS; r++) {
    const row = [];
    for (let c = 0; c < M3_COLS; c++) {
      let t;
      do {
        t = m3RandType();
      } while (
        (c >= 2 && row[c - 1] === t && row[c - 2] === t) ||
        (r >= 2 && m3Grid[r - 1][c] === t && m3Grid[r - 2][c] === t)
      );
      row.push(t);
    }
    m3Grid.push(row);
  }
}

function m3Render() {
  const g = document.getElementById('m3Grid');
  g.innerHTML = '';
  for (let r = 0; r < M3_ROWS; r++) {
    for (let c = 0; c < M3_COLS; c++) {
      const d = document.createElement('div');
      d.className = 'm3-cell';
      d.dataset.r = r; d.dataset.c = c;
      d.textContent = m3Grid[r] ? (m3Grid[r][c] || '') : '';
      if (m3Sel && m3Sel.r === r && m3Sel.c === c) d.classList.add('m3-sel');
      d.onclick = () => m3Click(r, c);
      g.appendChild(d);
    }
  }
}

function m3Swap(a, b) {
  const t = m3Grid[a.r][a.c];
  m3Grid[a.r][a.c] = m3Grid[b.r][b.c];
  m3Grid[b.r][b.c] = t;
}

function m3FindMatches() {
  const matched = new Set();
  for (let r = 0; r < M3_ROWS; r++) {
    let run = 1;
    for (let c = 1; c <= M3_COLS; c++) {
      if (c < M3_COLS && m3Grid[r][c] && m3Grid[r][c] === m3Grid[r][c - 1]) run++;
      else {
        if (run >= 3) for (let k = c - run; k < c; k++) matched.add(r + ',' + k);
        run = 1;
      }
    }
  }
  for (let c = 0; c < M3_COLS; c++) {
    let run = 1;
    for (let r = 1; r <= M3_ROWS; r++) {
      if (r < M3_ROWS && m3Grid[r][c] && m3Grid[r][c] === m3Grid[r - 1][c]) run++;
      else {
        if (run >= 3) for (let k = r - run; k < r; k++) matched.add(k + ',' + c);
        run = 1;
      }
    }
  }
  return matched;
}

function m3Drop() {
  for (let c = 0; c < M3_COLS; c++) {
    let col = [];
    for (let r = 0; r < M3_ROWS; r++) if (m3Grid[r][c]) col.push(m3Grid[r][c]);
    while (col.length < M3_ROWS) col.unshift(m3RandType());
    for (let r = 0; r < M3_ROWS; r++) m3Grid[r][c] = col[r];
  }
}

function m3ResolveCascade() {
  const matches = m3FindMatches();
  if (!matches.size) { m3Lock = false; m3Render(); return; }
  m3Combo++;
  m3Score += matches.size * 10 * m3Combo;
  document.getElementById('m3Score').textContent = m3Score;
  document.getElementById('m3Combo').textContent = 'x' + m3Combo;
  matches.forEach(k => {
    const parts = k.split(',');
    m3Grid[+parts[0]][+parts[1]] = '';
  });
  m3Render();
  setTimeout(() => {
    m3Drop();
    m3Render();
    setTimeout(() => m3ResolveCascade(), 260);
  }, 260);
}

function m3Click(r, c) {
  if (!m3Timer) m3Start();
  if (m3Lock || m3Time <= 0) return;
  if (!m3Grid[r][c]) return;
  if (!m3Sel) { m3Sel = { r, c }; m3Render(); return; }
  if (m3Sel.r === r && m3Sel.c === c) { m3Sel = null; m3Render(); return; }
  const dr = Math.abs(m3Sel.r - r), dc = Math.abs(m3Sel.c - c);
  if (dr + dc === 1) {
    const a = { r: m3Sel.r, c: m3Sel.c }, b = { r, c };
    m3Swap(a, b); m3Sel = null; m3Lock = true;
    if (m3FindMatches().size) {
      m3Combo = 0;
      m3ResolveCascade();
    } else {
      setTimeout(() => { m3Swap(a, b); m3Render(); m3Lock = false; }, 220);
    }
  } else {
    m3Sel = { r, c }; m3Render();
  }
}

function m3Start() {
  m3Score = 0; m3Time = 90; m3Combo = 0; m3Sel = null; m3Lock = false;
  m3InitGrid();
  document.getElementById('m3Score').textContent = '0';
  document.getElementById('m3Time').textContent = '90';
  document.getElementById('m3Combo').textContent = 'x1';
  m3Render();
  document.getElementById('m3StartBtn').textContent = '🔄 重新开始';
  if (m3Timer) clearInterval(m3Timer);
  m3Timer = setInterval(() => {
    m3Time--; document.getElementById('m3Time').textContent = m3Time;
    if (m3Time <= 0) m3End();
  }, 1000);
}

function m3End() {
  if (m3Timer) { clearInterval(m3Timer); m3Timer = null; }
  m3Lock = true;
  const coins = Math.min(20, Math.floor(m3Score / 100));
  if (coins > 0) bpAddCoins(coins, 'match3');
  showToast('⏰ 时间到！得分 ' + m3Score + '，获得 ' + coins + ' 金币');
}

function initMatch3() {
  m3Score = 0; m3Time = 90; m3Combo = 0; m3Sel = null; m3Lock = false;
  if (m3Timer) { clearInterval(m3Timer); m3Timer = null; }
  m3InitGrid();
  m3Render();
  document.getElementById('m3Score').textContent = '0';
  document.getElementById('m3Time').textContent = '90';
  document.getElementById('m3Combo').textContent = 'x1';
  document.getElementById('m3StartBtn').textContent = '▶️ 开始游戏';
  if (!m3TouchBound) {
    const g = document.getElementById('m3Grid');
    g.addEventListener('touchend', function(e){
      e.preventDefault(); e.stopPropagation();
      const cell = e.target.closest('.m3-cell');
      if (!cell) return;
      const r = parseInt(cell.dataset.r, 10);
      const c = parseInt(cell.dataset.c, 10);
      if (!isNaN(r) && !isNaN(c)) m3Click(r, c);
    }, {passive: false});
    m3TouchBound = true;
  }
}



/* 离开消消乐页面时停止该游戏计时器。 */
(function installMatch3Cleanup() {
  const previousCleanup = window.cleanupBeforePageSwitch;
  window.cleanupBeforePageSwitch = function () {
    try {
      if (typeof previousCleanup === 'function') previousCleanup.apply(this, arguments);
    } finally {
      if (m3Timer) { clearInterval(m3Timer); m3Timer = null; m3Lock = false; }
    }
  };
})();

// 游戏专属样式按需随游戏模块加载。
(function installGameStyles(){
  if(document.getElementById('flMatch3Styles'))return;
  /* Styles moved to css/toolbox-93-2.-消消乐-match3.css. */
})();
