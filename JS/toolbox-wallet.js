/* 百宝箱公共金币账户：只有使用金币或奖励金币的工具才加载。 */
function bpGetCoins() {
  return Number(lsGet("backpack_coins", 100));
}

function bpSetCoins(value) {
  lsSet("backpack_coins", Math.max(0, Math.floor(value)));
  bpUpdateHomeBadge();
}

function bpAddCoins(amount, game) {
  if (amount <= 0) return;
  bpSetCoins(bpGetCoins() + amount);
  const earned = lsGet("backpack_earned", {});
  earned[game] = (earned[game] || 0) + amount;
  lsSet("backpack_earned", earned);
  if (typeof updateDailyTask === "function" && game !== "dailyTask" && game !== "achievement") {
    updateDailyTask("daily_earn_coins", amount);
  }
  const renderBackpack = window["bpRender"];
  if (typeof renderBackpack === "function" && typeof pageBackpack !== "undefined" && pageBackpack && pageBackpack.style.display === "block") {
    renderBackpack();
  }
}

function bpSpendCoins(amount, source) {
  const coins = bpGetCoins();
  if (coins < amount) return false;
  bpSetCoins(coins - amount);
  if (source) {
    const spent = lsGet("backpack_spent", {});
    spent[source] = (spent[source] || 0) + amount;
    lsSet("backpack_spent", spent);
  }
  return true;
}

function bpUpdateHomeBadge() {
  const badge = document.getElementById("homeCoinBadge");
  if (badge) badge.textContent = "💰" + bpGetCoins();
}
