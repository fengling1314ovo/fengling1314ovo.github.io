;(function(){
  const id = 'flGachaChestCardStyles';
  if(document.getElementById(id)) return;
  /* Styles moved to css/toolbox-chest-home.css. */
})();
/* 页面模板按需注册：从原 tool-pages.js 迁入。 */
window.flRegisterToolPage("pageChestHome", "<!-- pageChestHome -->\n<div class=\"tool-page page-chest-home\" id=\"pageChestHome\">\n    <div class=\"sticky-nav\">\n    <div class=\"tool-header\" style=\"gap:6px;\">\n      <button class=\"back-btn\" onclick=\"goHome()\"><span>←</span> 返回首页</button>\n      <button type=\"button\" class=\"back-btn chest-help-btn\" title=\"百宝箱规则\" aria-label=\"百宝箱规则\" style=\"margin-left:auto;width:32px;height:40px;min-height:40px;padding:0;justify-content:center;background:var(--primary-bg);color:var(--primary);font-weight:700;border-radius:12px;\" onclick=\"openRuleModal()\">?</button>\n      <button class=\"back-btn chest-status-btn\" style=\"background:var(--primary-bg);color:var(--primary);font-weight:600;\" onclick=\"openChestTool('statusPage','个人状态')\">\n        📊 状态\n      </button>\n      \n    </div>\n    <div class=\"breadcrumb\"></div>\n    </div>\n    <div class=\"common-block\" style=\"padding:0 28px 32px;\">\n      <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;\"><h3 data-breadcrumb-title=\"百宝箱\" style=\"margin:0;\">🧰 趣味百宝箱</h3><button class=\"common-btn\" style=\"padding:6px 12px;font-size:13px;\" onclick=\"openPage('backpack')\">🎒 背包</button></div>\n      <div class=\"gold-tip\">✨ 金色边框的游戏可以赚金币哦～</div>\n      <div class=\"chest-quick-actions\" id=\"chestQuickActions\" style=\"justify-content:flex-start;\">\n        <button class=\"common-btn\" style=\"padding:4px 10px;font-size:12px;\" onclick=\"flOpenMysteryCodeModal()\">🔑 兑换</button>\n        <button class=\"common-btn chest-store-btn\" style=\"padding:4px 10px;font-size:12px;\" onclick=\"openChestTool('pinballShopPage','弹珠商店')\">🛒 store</button>\n      </div>\n      <div class=\"chest-welfare\" style=\"margin:4px 0 20px;padding:14px;border:1px solid #ffd700;border-radius:14px;background:linear-gradient(135deg,rgba(255,215,0,0.10),rgba(255,193,7,0.03));\">\n        <div style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;\">\n          <h4 style=\"margin:0;font-size:14px;color:#b8860b;\">🎁 福利中心</h4>\n          <span style=\"font-size:11px;color:var(--text-secondary);\">每日任务 · 扭蛋 · 成就领金币</span>\n        </div>\n        <div style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:8px;\">\n          <div class=\"chest-card gold\" style=\"padding:12px 6px;\" onclick=\"openChestTool('dailyTaskPage','每日任务')\">\n            <div class=\"icon\">📋</div><div class=\"title\" style=\"font-size:13px;white-space:nowrap;\">每日任务</div>\n          </div>\n          <div class=\"chest-card gold\" style=\"padding:12px 6px;\" onclick=\"openChestTool('capsulePage','扭蛋机')\">\n            <div class=\"icon\">🥚</div><div class=\"title\" style=\"font-size:13px;white-space:nowrap;\">扭蛋机</div>\n          </div>\n          <div class=\"chest-card gold\" style=\"padding:12px 6px;\" onclick=\"openChestTool('achievementPage','成就徽章')\">\n            <div class=\"icon\">🏅</div><div class=\"title\" style=\"font-size:13px;white-space:nowrap;\">成就徽章</div>\n          </div>\n        </div>\n      </div>\n      <div class=\"chest-categories fl-segmented-control\" id=\"chestCategories\" role=\"group\" aria-label=\"百宝箱分类\">\n        <span class=\"fl-segmented-thumb\" aria-hidden=\"true\"></span>\n        <button class=\"chest-cat-btn cat-btn-item fl-segmented-option active is-active\" data-cat=\"all\" aria-pressed=\"true\" onclick=\"filterChest('all')\">全部</button>\n        <button class=\"chest-cat-btn cat-btn-item fl-segmented-option\" data-cat=\"game\" aria-pressed=\"false\" onclick=\"filterChest('game')\">游戏</button>\n        <button class=\"chest-cat-btn cat-btn-item fl-segmented-option\" data-cat=\"fun\" aria-pressed=\"false\" onclick=\"filterChest('fun')\">趣味</button>\n        <button class=\"chest-cat-btn cat-btn-item fl-segmented-option\" data-cat=\"fortune\" aria-pressed=\"false\" onclick=\"filterChest('fortune')\">测算</button>\n              </div>\n      <div class=\"chest-grid\" id=\"chestGrid\">\n        <!-- 打字练习（红色置顶） -->\n        <div class=\"chest-card red\" data-cat=\"game\" onclick=\"openChestTool('typingPage','打字练习')\">\n          <div class=\"icon\">⌨️</div><div class=\"title\">打字练习</div><div class=\"desc\">金山打字通风格练习</div>\n        </div>\n        <!-- 打弹珠（红色置顶） -->\n        <div class=\"chest-card red\" data-cat=\"game\" onclick=\"openChestTool('pinballPage','打弹珠')\">\n          <div class=\"icon\">🔮</div><div class=\"title\">打弹珠</div><div class=\"desc\">经典弹珠台弹射得分</div>\n        </div>\n        <!-- 幸运转盘（红色） -->\n        <div class=\"chest-card red\" data-cat=\"game\" onclick=\"openChestTool('wheelPage','幸运转盘')\">\n          <div class=\"icon\">🎡</div><div class=\"title\">幸运转盘</div><div class=\"desc\">多转盘抽金币道具</div>\n        </div>\n                <!-- 趣味类 -->\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('dicePage','掷骰子')\">\n          <div class=\"icon\">🎲</div><div class=\"title\">掷骰子</div><div class=\"desc\">多颗骰子随机点数+历史</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('coinPage','抛硬币')\">\n          <div class=\"icon\">🪙</div><div class=\"title\">抛硬币</div><div class=\"desc\">翻转动画+正反面统计</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('eatPage','今天吃什么')\">\n          <div class=\"icon\">🍔</div><div class=\"title\">今天吃什么</div><div class=\"desc\">自定义美食列表</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('yesnoPage','是或否决策器')\">\n          <div class=\"icon\">🎯</div><div class=\"title\">是或否决策器</div><div class=\"desc\">帮你拿主意+历史</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('fortunePage','抽签')\">\n          <div class=\"icon\">🎋</div><div class=\"title\">抽签</div><div class=\"desc\">自定义签文随机抽取</div>\n        </div>\n        <div class=\"chest-card gacha-highlight\" data-cat=\"fun\" onclick=\"openChestTool('gachaPage','抽卡模拟器')\">\n          <div class=\"icon\">🎴</div><div class=\"title\">抽卡模拟器</div><div class=\"desc\">单抽/十连+SSR概率</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"fun\" onclick=\"openChestTool('rpsPage','石头剪刀布')\">\n          <div class=\"icon\">✊</div><div class=\"title\">石头剪刀布</div><div class=\"desc\">人机对战+胜率统计</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('magic8Page','魔法8球')\">\n          <div class=\"icon\">🔮</div><div class=\"title\">魔法8球</div><div class=\"desc\">摇动球获取答案</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('truthDarePage','真心话大冒险')\">\n          <div class=\"icon\">🎤</div><div class=\"title\">真心话大冒险</div><div class=\"desc\">聚会破冰必玩</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('jokesPage','冷笑话大全')\">\n          <div class=\"icon\">🧊</div><div class=\"title\">冷笑话大全</div><div class=\"desc\">随机冷段子</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('riddlesPage','脑筋急转弯')\">\n          <div class=\"icon\">🤔</div><div class=\"title\">脑筋急转弯</div><div class=\"desc\">考考你的脑洞</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('game24Page','24点')\">\n          <div class=\"icon\">➗</div><div class=\"title\">24点</div><div class=\"desc\">加减乘除凑24</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('idiomChainPage','成语接龙')\">\n          <div class=\"icon\">🐲</div><div class=\"title\">成语接龙</div><div class=\"desc\">接龙挑战词汇量</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('mindReadingPage','读心术')\">\n          <div class=\"icon\">🃏</div><div class=\"title\">读心术</div><div class=\"desc\">猜出你心里想的数</div>\n        </div>\n        <!-- 游戏类 -->\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('minesweeperPage','扫雷')\">\n          <div class=\"icon\">💣</div><div class=\"title\">扫雷</div><div class=\"desc\">经典踩雷游戏</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('tttPage','井字棋')\">\n          <div class=\"icon\">⭕</div><div class=\"title\">井字棋</div><div class=\"desc\">人机对战井字棋</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('memoryPage','记忆翻牌')\">\n          <div class=\"icon\">🃏</div><div class=\"title\">记忆翻牌</div><div class=\"desc\">翻牌配对考验记忆</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('whackPage','打地鼠')\">\n          <div class=\"icon\">🔨</div><div class=\"title\">打地鼠</div><div class=\"desc\">限时打地鼠计分</div>\n        </div><div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('guessPage','猜数字')\">\n          <div class=\"icon\">🎯</div><div class=\"title\">猜数字</div><div class=\"desc\">1-100猜数字游戏</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"game\" onclick=\"openChestTool('slotPage','老虎机')\">\n          <div class=\"icon\">🎰</div><div class=\"title\">老虎机</div><div class=\"desc\">旋转滚轮赢取金币</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('tetrisPage','俄罗斯方块')\">\n          <div class=\"icon\">🧱</div><div class=\"title\">俄罗斯方块</div><div class=\"desc\">消行计分+速度递增</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('gomokuPage','五子棋')\">\n          <div class=\"icon\">⚫</div><div class=\"title\">五子棋</div><div class=\"desc\">人机对战五子连珠</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('game2048Page','2048')\">\n          <div class=\"icon\">🔢</div><div class=\"title\">2048</div><div class=\"desc\">滑动合成数字</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('breakoutPage','打砖块')\">\n          <div class=\"icon\">🏓</div><div class=\"title\">打砖块</div><div class=\"desc\">挡板弹球消砖块</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('pianoPage','别踩白块')\">\n          <div class=\"icon\">🎹</div><div class=\"title\">别踩白块</div><div class=\"desc\">点击黑块别踩白</div>\n        </div>\n        <!-- 测算类 -->\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('fortuneTodayPage','今日运势')\">\n          <div class=\"icon\">🌟</div><div class=\"title\">今日运势</div><div class=\"desc\">每日固定运势测算</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('jinriPage','今日人品')\">\n          <div class=\"icon\">🍀</div><div class=\"title\">今日人品</div><div class=\"desc\">每日人品值检测</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('zodiacPage','星座运势')\">\n          <div class=\"icon\">♈</div><div class=\"title\">星座运势</div><div class=\"desc\">12星座每日运势</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('zodiacMatchPage','生肖配对')\">\n          <div class=\"icon\">🐉</div><div class=\"title\">生肖配对</div><div class=\"desc\">生肖契合度测算</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('nameMatchPage','姓名配对')\">\n          <div class=\"icon\">💕</div><div class=\"title\">姓名配对</div><div class=\"desc\">输入名字算缘分</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('mentalAgePage','心理年龄测试')\">\n          <div class=\"icon\">🧠</div><div class=\"title\">心理年龄测试</div><div class=\"desc\">测测你的心理年龄</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('brainTestPage','左右脑测试')\">\n          <div class=\"icon\">🧩</div><div class=\"title\">左右脑测试</div><div class=\"desc\">测你是左脑还是右脑型</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('pastLifePage','前世身份')\">\n          <div class=\"icon\">🏛️</div><div class=\"title\">前世身份</div><div class=\"desc\">输入名字测前世（纯娱乐）</div>\n        </div>\n        <div class=\"chest-card gacha-highlight\" data-cat=\"fortune\" onclick=\"openChestTool('tarotPage','塔罗牌占卜')\">\n          <div class=\"icon\">🔮</div><div class=\"title\">塔罗牌占卜</div><div class=\"desc\">抽牌看运势（娱乐）</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('dreamPage','周公解梦')\">\n          <div class=\"icon\">💤</div><div class=\"title\">周公解梦</div><div class=\"desc\">输入梦境关键词查询</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('mbtiPage','MBTI人格测试')\">\n          <div class=\"icon\">🧬</div><div class=\"title\">MBTI人格测试</div><div class=\"desc\">测出你的16型人格</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('iqPage','IQ智商测试')\">\n          <div class=\"icon\">🧠</div><div class=\"title\">IQ智商测试</div><div class=\"desc\">趣味智商小测验</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('bloodMatchPage','血型配对')\">\n          <div class=\"icon\">🩸</div><div class=\"title\">血型配对</div><div class=\"desc\">血型契合度测算</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('charDivPage','测字')\">\n          <div class=\"icon\">🔤</div><div class=\"title\">测字</div><div class=\"desc\">一字测运势（娱乐）</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('astrodicePage','占星骰子')\">\n          <div class=\"icon\">🎲</div><div class=\"title\">占星骰子</div><div class=\"desc\">行星·星座·宫位三骰占卜</div>\n        </div>\n        <div class=\"chest-card gacha-highlight\" data-cat=\"fortune\" onclick=\"openChestTool('runePage','符文占卜')\">\n          <div class=\"icon\">🪨</div><div class=\"title\">符文占卜</div><div class=\"desc\">北欧卢恩符文抽牌解读</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('pendulumPage','灵摆占卜')\">\n          <div class=\"icon\">🔮</div><div class=\"title\">灵摆占卜</div><div class=\"desc\">输入问题看灵摆摆动方向</div>\n        </div>\n        <div class=\"chest-card gacha-highlight\" data-cat=\"fortune\" onclick=\"openChestTool('lenormandPage','雷诺曼卡牌')\">\n          <div class=\"icon\">🎴</div><div class=\"title\">雷诺曼卡牌</div><div class=\"desc\">36张牌简单直接的占卜</div>\n          <div class=\"chest-progress\" id=\"lenormandProgress\">集齐 0/36</div>\n        </div>\n        <div class=\"chest-card gacha-highlight\" data-cat=\"fortune\" onclick=\"openChestTool('oraclePage','天使神谕卡')\">\n          <div class=\"icon\">👼</div><div class=\"title\">天使神谕卡</div><div class=\"desc\">治愈系神谕卡指引</div>\n        </div>\n        <div class=\"chest-card gacha-highlight\" data-cat=\"fortune\" onclick=\"openChestTool('kipperPage','基博卡')\">\n          <div class=\"icon\">🃏</div><div class=\"title\">基博卡</div><div class=\"desc\">德国传统生活卡牌占卜</div>\n          <div class=\"chest-progress\" id=\"kipperProgress\">集齐 0/36</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('numerologyPage','数字命理学')\">\n          <div class=\"icon\">🔢</div><div class=\"title\">数字命理学</div><div class=\"desc\">生日算生命数字运势</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('tealeafPage','茶叶占卜')\">\n          <div class=\"icon\">🍵</div><div class=\"title\">茶叶占卜</div><div class=\"desc\">看茶杯底茶叶形状解读</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('crystalballPage','水晶球占卜')\">\n          <div class=\"icon\">🔮</div><div class=\"title\">水晶球占卜</div><div class=\"desc\">凝视水晶球获取启示</div>\n        </div>\n        <!-- 生活类 -->\n        <div class=\"chest-card\" data-cat=\"fun\" onclick=\"openChestTool('acrosticPage','藏头诗生成')\">\n          <div class=\"icon\">📜</div><div class=\"title\">藏头诗生成</div><div class=\"desc\">输入字生成藏头诗</div>\n        </div>\n        <!-- 新游戏 -->\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('spotDiffPage','找不同')\">\n          <div class=\"icon\">🔍</div><div class=\"title\">找不同</div><div class=\"desc\">限时找出所有差异</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('match3Page','消消乐')\">\n          <div class=\"icon\">🍎</div><div class=\"title\">消消乐</div><div class=\"desc\">三消连线赢金币</div>\n        </div>\n        <div class=\"chest-card gold\" data-cat=\"game\" onclick=\"openChestTool('linkGamePage','连连看')\">\n          <div class=\"icon\">🔗</div><div class=\"title\">连连看</div><div class=\"desc\">配对连线消除</div>\n        </div>\n        <!-- 新测试 -->\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('almanacPage','今日宜忌')\">\n          <div class=\"icon\">📜</div><div class=\"title\">今日宜忌</div><div class=\"desc\">每日宜做啥忌做啥</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('animalPersonalityPage','动物性格测试')\">\n          <div class=\"icon\">🐾</div><div class=\"title\">动物性格测试</div><div class=\"desc\">测你内心住着啥动物</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('faceScorePage','颜值打分器')\">\n          <div class=\"icon\">💅</div><div class=\"title\">颜值打分器</div><div class=\"desc\">输入名字测颜值分</div>\n        </div>\n        <div class=\"chest-card\" data-cat=\"fortune\" onclick=\"openChestTool('moralityPage','人品计算器')\">\n          <div class=\"icon\">⚖️</div><div class=\"title\">人品计算器</div><div class=\"desc\">算算你的人品值</div>\n        </div>\n\n        <!-- 声音类 --><!-- 创意类 -->\n      </div>\n    </div>\n  </div>");
const chestRuleModalMarkup = `
<!-- 金币规则弹窗 -->
<div class="modal-mask" id="ruleModalMask">
  <div class="modal-box rule-modal-box">
    <div class="rule-main-shell">
    <div class="fl-modal-top-gradient-overlay" aria-hidden="true"></div>
    <div class="rule-tabs fl-segmented-control" role="group" aria-label="金币规则分类">
      <span class="fl-segmented-thumb" aria-hidden="true"></span>
      <button class="rule-tab fl-segmented-option active is-active" type="button" data-tab="earn" aria-pressed="true">获得</button>
      <button class="rule-tab fl-segmented-option" type="button" data-tab="spend" aria-pressed="false">消耗</button>
      <button class="rule-tab fl-segmented-option" type="button" data-tab="pet" aria-pressed="false">宠物</button>
      <button class="rule-tab fl-segmented-option" type="button" data-tab="code" aria-pressed="false">代码</button>
    </div>
    <div class="rule-panels-viewport">
    <div class="rule-tab-content" id="ruleTab-earn">
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🔢</span><span>2048</span></div><div class="rule-item-desc">每50分=1金币，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">💣</span><span>扫雷</span></div><div class="rule-item-desc">简单20/中等50/困难100</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">⭕</span><span>井字棋</span></div><div class="rule-item-desc">胜利10，平局5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🃏</span><span>记忆翻牌</span></div><div class="rule-item-desc">30-步数，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🔨</span><span>打地鼠</span></div><div class="rule-item-desc">按分数奖励，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎯</span><span>猜数字</span></div><div class="rule-item-desc">25-次数×2，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">✊</span><span>石头剪刀布</span></div><div class="rule-item-desc">胜利5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎰</span><span>老虎机</span></div><div class="rule-item-desc">中奖获得下注×倍数</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🧱</span><span>俄罗斯方块</span></div><div class="rule-item-desc">每50分=1金币，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">⚫</span><span>五子棋</span></div><div class="rule-item-desc">胜利30</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🏓</span><span>打砖块</span></div><div class="rule-item-desc">每20分=1金币，通关+20，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎹</span><span>别踩白块</span></div><div class="rule-item-desc">每5分=1金币，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🔮</span><span>打弹珠</span></div><div class="rule-item-desc">每200分=1金币，最低5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎡</span><span>幸运转盘-金币转盘</span></div><div class="rule-item-desc">免费抽金币，支持单抽/十连/百连</div></div>
    </div>
    <div class="rule-tab-content" id="ruleTab-spend" style="display:none;">
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎴</span><span>抽卡模拟器</span></div><div class="rule-item-desc">单抽5，十连40（省10）</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎰</span><span>老虎机</span></div><div class="rule-item-desc">下注消耗金币</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🔮</span><span>塔罗牌</span></div><div class="rule-item-desc">单牌10，三牌30，四牌40</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🪨</span><span>符文占卜</span></div><div class="rule-item-desc">单枚10，三枚30</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎴</span><span>雷诺曼卡牌</span></div><div class="rule-item-desc">单牌10，三牌30</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🃏</span><span>基博卡</span></div><div class="rule-item-desc">单牌10，三牌30</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🥚</span><span>扭蛋机</span></div><div class="rule-item-desc">单次5，五连25，可得卡牌/金币/道具</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎡</span><span>幸运转盘-道具转盘</span></div><div class="rule-item-desc">单抽2，十连15，可得8种道具</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎡</span><span>幸运转盘-卡牌转盘</span></div><div class="rule-item-desc">单抽2，十连15，可得N/R/SR/SSR卡牌</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎡</span><span>幸运转盘-弹珠转盘</span></div><div class="rule-item-desc">单抽1，十连8，可得9种颜色弹珠</div></div>
    </div>
    <div class="rule-tab-content" id="ruleTab-code" style="display:none;">
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🔑</span><span>20110925</span></div><div class="rule-item-desc">输入后得520金币</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🔑</span><span>fengling1314ovo.top</span></div><div class="rule-item-desc">输入后得5200金币</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">⚔️</span><span>增加战力</span></div><div class="rule-item-desc">输入后小橘战力+1000</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎓</span><span>毕业幼儿园</span></div><div class="rule-item-desc">输入后解锁小学</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎓</span><span>毕业小学</span></div><div class="rule-item-desc">输入后解锁初中</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎓</span><span>毕业初中</span></div><div class="rule-item-desc">输入后解锁高中</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎓</span><span>毕业高中</span></div><div class="rule-item-desc">输入后解锁大学</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎓</span><span>毕业大学</span></div><div class="rule-item-desc">输入后自动解锁全部学校</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">⌨️</span><span>解锁打字</span></div><div class="rule-item-desc">输入后解锁全部打字关卡</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">♾️</span><span>兑换次数</span></div><div class="rule-item-desc">无次数上限，可重复兑换</div></div>
    </div>
    <div class="rule-tab-content" id="ruleTab-pet" style="display:none;">
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🐱</span><span>宠物名字</span></div><div class="rule-item-desc">小橘，一只可爱的橘猫~</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🍖</span><span>饱食度</span></div><div class="rule-item-desc">初始50，上限100，使用食物增加</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🧼</span><span>清洁值</span></div><div class="rule-item-desc">初始100，上限100，使用清洁用品增加</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">💕</span><span>好感度</span></div><div class="rule-item-desc">初始50，上限100，使用猫咪玩具增加，上学减少5</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">⚔️</span><span>战力</span></div><div class="rule-item-desc">上学毕业获得，学历越高战力越多</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🏫</span><span>上学消耗</span></div><div class="rule-item-desc">饱食度-10、清洁值-10、好感度-5，状态不足无法上学</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🏫</span><span>上学金币</span></div><div class="rule-item-desc">幼儿园5、小学10、初中20、高中35、大学50</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🎓</span><span>学历解锁</span></div><div class="rule-item-desc">小学需幼儿园毕业3次，初中需小学10次，高中需初中20次，大学需高中25次</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🏠</span><span>召回宠物</span></div><div class="rule-item-desc">上学中可召回，退还一半金币</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🏪</span><span>食物商店</span></div><div class="rule-item-desc">购买食物放入仓库，从仓库喂食增加饱食度</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🏪</span><span>清洁商店</span></div><div class="rule-item-desc">购买清洁用品放入仓库，使用增加清洁值</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🏪</span><span>猫咪用品商店</span></div><div class="rule-item-desc">购买逗猫棒等玩具放入仓库，使用增加好感度</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">✨</span><span>超级道具商店</span></div><div class="rule-item-desc">加速卡（跳过50%时长）、立即毕业卡、双倍战力卡</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">📦</span><span>宠物仓库</span></div><div class="rule-item-desc">存放食物、清洁用品、玩具，点击物品即可使用</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">✉️</span><span>校长信箱</span></div><div class="rule-item-desc">毕业后收到校长邮件，含祝福语和随机奖励（食物/清洁/玩具/金币）</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">📊</span><span>统计信息</span></div><div class="rule-item-desc">查看小橘使用过的所有物品记录（食物/清洁/玩具/超级道具）</div></div>
      <div class="rule-item"><div class="rule-item-title"><span class="rule-icon">🛒</span><span>批量购买</span></div><div class="rule-item-desc">商店支持批量购买，可选×1/×5/×10/最大</div></div>
    </div>
    </div>
    </div>
    <div class="rule-modal-footer"><button class="rule-confirm-btn" type="button" onclick="closeRuleModal()">✓ 确认</button></div>
  </div>
</div>`;
if (!document.getElementById("ruleModalMask")) {
  document.body.insertAdjacentHTML("beforeend", chestRuleModalMarkup);
}

/* 百宝箱首页共享功能：规则弹窗与卡片收集进度。 */
function updateChestProgress() {
  const lenormandCards = lsGet("backpack_lenormand", []);
  const lenormandUnique = new Set(lenormandCards.map(function (card) { return card.num; }));
  const lenormandEl = document.getElementById("lenormandProgress");
  if (lenormandEl) lenormandEl.textContent = "集齐 " + lenormandUnique.size + "/36";

  const kipperCards = lsGet("backpack_kipper", []);
  const kipperUnique = new Set(kipperCards.map(function (card) { return card.num; }));
  const kipperEl = document.getElementById("kipperProgress");
  if (kipperEl) kipperEl.textContent = "集齐 " + kipperUnique.size + "/36";
}

function initRuleTabControl() {
  const tabs = document.querySelector('#ruleModalMask .rule-tabs');
  if (!tabs || typeof window.flInitSegmentedControl !== 'function') return null;
  const active = tabs.querySelector('.rule-tab.is-active, .rule-tab.active');
  const initialTab = active ? active.dataset.tab : 'earn';
  window.flInitSegmentedControl(tabs, {
    getValue: function () {
      const selected = tabs.querySelector('.rule-tab.is-active, .rule-tab.active');
      return selected ? selected.dataset.tab : 'earn';
    },
    getOptionValue: function (button) { return button.dataset.tab; },
    handleClick: true,
    onChange: switchRuleTab
  });
  if (tabs.flSegmentedSync) tabs.flSegmentedSync(initialTab);
  return tabs;
}

function openRuleModal() {
  const mask = document.getElementById('ruleModalMask');
  if (!mask) return;
  mask.style.display = 'flex';
  initRuleTabControl();
  const viewport = mask.querySelector('.rule-panels-viewport');
  if (viewport) viewport.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeRuleModal() {
  closeModalAnimated("ruleModalMask");
}

function switchRuleTab(tab) {
  const mask = document.getElementById('ruleModalMask');
  if (!mask) return;
  const buttons = Array.from(mask.querySelectorAll('.rule-tab'));
  const selected = mask.querySelector('#ruleTab-' + tab);
  if (!buttons.some(function (button) { return button.dataset.tab === tab; }) || !selected) return;
  const currentContent = Array.from(mask.querySelectorAll('.rule-tab-content')).find(function (content) {
    return getComputedStyle(content).display !== 'none';
  });
  buttons.forEach(function (button) {
    const active = button.dataset.tab === tab;
    button.classList.toggle('active', active);
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (currentContent !== selected) {
    mask.querySelectorAll('.rule-tab-content').forEach(function (content) {
      content.style.display = 'none';
    });
    selected.style.display = 'block';
    const viewport = mask.querySelector('.rule-panels-viewport');
    if (viewport) viewport.scrollTop = 0;
  }
  const tabs = mask.querySelector('.rule-tabs');
  if (tabs && tabs.flSegmentedSync) tabs.flSegmentedSync(tab);
}
