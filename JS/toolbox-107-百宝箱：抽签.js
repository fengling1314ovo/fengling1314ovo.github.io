/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageFortunePage", "<!-- pageFortunePage -->\n<div class=\"tool-page\" id=\"pageFortunePage\">\n    <div class=\"tool-header\">\n      <button class=\"back-btn\" onclick=\"openPage('chestHome')\"><span>←</span> 返回百宝箱</button>\n    </div>\n    <div class=\"breadcrumb\"></div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px\">\n      <h3>🎋 抽签</h3>\n      <div style=\"text-align:center;\">\n        <button class=\"common-btn\" onclick=\"drawFortune()\">🎋 抽一签</button>\n      </div>\n      <div class=\"fortune-result\" id=\"fortuneResult\">\n        <div style=\"color:var(--text-placeholder);font-size:14px;\">点击上方按钮抽签</div>\n      </div>\n      <div class=\"custom-list-area\">\n        <h4 style=\"font-size:14px;color:var(--text-secondary);margin:16px 0 8px;\">📝 自定义签文（格式：等级|内容，如 大吉|万事如意）</h4>\n        <div class=\"custom-input-row\">\n          <input id=\"fortuneInput\" placeholder=\"例如：中吉|诸事顺遂\" onkeydown=\"if(event.key==='Enter')addFortune()\">\n          <button class=\"common-btn\" onclick=\"addFortune()\">添加</button>\n        </div>\n        <div class=\"custom-tags\" id=\"fortuneTags\"></div>\n      </div>\n    </div>\n  </div>");
// ==================== 百宝箱：自定义抽签 ====================
const fortuneDefaultSigns = [
  { level: "上上签", text: "所求皆如愿，所行皆坦途。" },
  { level: "上签", text: "心中有光，前路自会明朗。" },
  { level: "中上签", text: "稳步向前，努力会有回响。" },
  { level: "中签", text: "不急不躁，耐心等待好时机。" },
  { level: "中下签", text: "暂缓脚步，整理好思路再出发。" },
  { level: "下签", text: "今日宜谨慎，先把眼前事做好。" }
];

function fortuneGetCustomSigns() {
  const stored = lsGet("fortune_custom_signs", []);
  return Array.isArray(stored) ? stored.filter(function (item) {
    return item && typeof item.level === "string" && typeof item.text === "string";
  }) : [];
}

function fortuneRenderCustomSigns() {
  const container = document.getElementById("fortuneTags");
  if (!container) return;
  container.replaceChildren();
  const signs = fortuneGetCustomSigns();
  if (!signs.length) {
    const empty = document.createElement("span");
    empty.textContent = "还没有自定义签文";
    empty.style.cssText = "font-size:12px;color:var(--text-placeholder);";
    container.appendChild(empty);
    return;
  }
  signs.forEach(function (sign, index) {
    const tag = document.createElement("span");
    tag.style.cssText = "display:inline-flex;align-items:center;gap:6px;margin:4px;padding:5px 9px;border-radius:999px;background:var(--primary-bg);color:var(--primary);font-size:12px;";
    const label = document.createElement("span");
    label.textContent = sign.level + "｜" + sign.text;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "删除这条签文");
    remove.style.cssText = "border:0;background:transparent;color:inherit;font-size:16px;line-height:1;cursor:pointer;padding:0;";
    remove.addEventListener("click", function () { fortuneRemoveCustomSign(index); });
    tag.append(label, remove);
    container.appendChild(tag);
  });
}

function addFortune() {
  const input = document.getElementById("fortuneInput");
  if (!input) return;
  const raw = input.value.trim();
  const separator = raw.indexOf("|");
  if (separator < 1 || separator === raw.length - 1) {
    showToast("请按“等级|签文内容”的格式填写");
    return;
  }
  const level = raw.slice(0, separator).trim();
  const text = raw.slice(separator + 1).trim();
  if (!level || !text) {
    showToast("等级和签文内容都不能为空");
    return;
  }
  const signs = fortuneGetCustomSigns();
  signs.unshift({ level: level.slice(0, 12), text: text.slice(0, 120) });
  lsSet("fortune_custom_signs", signs.slice(0, 100));
  input.value = "";
  fortuneRenderCustomSigns();
  showToast("已添加自定义签文");
}

function fortuneRemoveCustomSign(index) {
  const signs = fortuneGetCustomSigns();
  if (!Number.isInteger(index) || index < 0 || index >= signs.length) return;
  signs.splice(index, 1);
  lsSet("fortune_custom_signs", signs);
  fortuneRenderCustomSigns();
}

function drawFortune() {
  const result = document.getElementById("fortuneResult");
  if (!result) return;
  const options = fortuneDefaultSigns.concat(fortuneGetCustomSigns());
  const sign = options[Math.floor(Math.random() * options.length)];
  result.replaceChildren();
  const level = document.createElement("div");
  level.textContent = sign.level;
  level.style.cssText = "font-size:22px;font-weight:700;color:var(--primary);margin-bottom:8px;";
  const text = document.createElement("div");
  text.textContent = sign.text;
  text.style.cssText = "font-size:15px;color:var(--text-main);line-height:1.7;";
  result.append(level, text);
  if (typeof playSound === "function") playSound("success");
}

fortuneRenderCustomSigns();
