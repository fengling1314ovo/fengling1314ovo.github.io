/* 本地与云端账号功能。 */

(function mountFlAccountModals(){
  if(document.getElementById('flAccountModal')) return;
  const mount=document.getElementById('flAccountModalsMount');
  if(!mount) throw new Error('账号弹窗挂载点缺失');
  mount.insertAdjacentHTML('afterend', `
<!-- ==================== 账号管理弹窗（云端+本地） ==================== -->
<div class="modal-mask" id="flAccountModal" style="display:none;z-index:9998;">
  <div class="modal-box fl-account-modal-box" role="dialog" aria-modal="true" aria-labelledby="flAccountModalTitle" style="width:92vw;max-width:440px;max-height:86vh;overflow-y:auto;padding:22px 20px;">
    <div class="fl-account-modal-header">
      <h3 id="flAccountModalTitle" style="margin:0;font-size:18px;">👤 账号管理</h3>
      <button onclick="flShowRules()" style="border:1px solid var(--border-color);background:var(--bg-input);padding:4px 12px;border-radius:8px;font-size:12px;cursor:pointer;color:var(--text-secondary);">📖 规则</button>
    </div>

    <div class="fl-account-modal-scroll">
    <!-- ===== 云端账号区域 ===== -->
    <div style="background:var(--primary-bg);border-radius:14px;padding:14px;margin-bottom:16px;">
      <div id="flCloudSection"></div>
    </div>

    <!-- ===== 本地账号区域 ===== -->
    <div style="font-size:13px;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">📱 本地账号</div>
    <div id="flAccountList" style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;"></div>

    <!-- 分隔线 -->
    <div style="border-top:1px dashed var(--border-color);margin:6px 0 14px;"></div>

    <!-- 新建本地账号按钮 -->
    <button class="common-btn" id="flSubmitBtn" style="width:100%;height:44px;" onclick="flOpenNewAccountModal()">✨ 新建本地账号</button>
    <button class="common-btn" style="width:100%;height:40px;margin-top:8px;background:var(--bg-input);color:var(--primary);border:1px dashed var(--border-color);" onclick="flOpenExportCodeModal()">📤 生成存档码</button>
    <button class="common-btn" style="width:100%;height:40px;margin-top:8px;background:var(--bg-input);color:var(--primary);border:1px dashed var(--border-color);" onclick="flOpenCloudImportModal()">📥 输入存档码导入</button>
    </div>
    <button class="personal-modal-confirm" id="flAccountModalConfirm" type="button" onclick="flCloseAccountModal()"><span aria-hidden="true">✓</span>确认</button>
  </div>
</div>

<!-- ==================== 修改资料弹窗 ==================== -->
<div class="modal-mask" id="flProfileModal" style="display:none;z-index:9999;">
  <div class="modal-box" style="width:92vw;max-width:360px;padding:16px 16px;max-height:62vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
    <div class="modal-glass-sticky-head" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <h3 style="margin:0;font-size:17px;">✏️ 修改资料</h3>
      <button class="modal-close-btn" onclick="flCloseProfileModal()" style="border:none;background:var(--bg-input);width:30px;height:30px;border-radius:50%;font-size:15px;cursor:pointer;">✕</button>
    </div>
    <div id="flProfileCloudFields">
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">头像</div>
    <div id="flProfileAvatarPicker" style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;"></div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">用户名 <span style="font-size:10px;color:var(--text-placeholder);">（登录用）</span></div>
    <input id="flProfileUsername" maxlength="20" placeholder="3-20位字母或数字" style="width:100%;height:38px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;">
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">昵称</div>
    <input id="flProfileNickname" maxlength="20" placeholder="输入昵称" style="width:100%;height:38px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;">
    </div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">性别</div>
    <div id="flProfileGender" style="display:flex;gap:8px;margin-bottom:10px;">
      <button type="button" data-gender="male" style="flex:1;height:34px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-input);color:var(--text-main);font-size:14px;cursor:pointer;"><span style="color:#3b82f6;font-weight:700;">♂</span> 男</button>
      <button type="button" data-gender="female" style="flex:1;height:34px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-input);color:var(--text-main);font-size:14px;cursor:pointer;"><span style="color:#e91e63;font-weight:700;">♀</span> 女</button>
      <button type="button" data-gender="secret" style="flex:1;height:34px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-input);color:var(--text-main);font-size:13px;cursor:pointer;">🔒 保密</button>
    </div>
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">出生日期</div>
    <input id="flProfileBirthday" type="date" style="width:100%;height:38px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;">
    <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">所在省份</div>
    <select id="flProfileProvince" style="width:100%;height:38px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;">
      <option value="">请选择省份</option>
    </select>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;padding:8px 12px;border-radius:10px;background:var(--bg-input);">
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text-main);">🌈 彩虹昵称</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">开启后昵称显示为彩虹流动效果</div>
      </div>
      <button type="button" id="flRainbowToggle" onclick="flToggleRainbow()" style="width:46px;height:26px;border-radius:13px;border:none;cursor:pointer;position:relative;transition:background .2s;background:#ccc;">
        <span id="flRainbowToggleDot" style="position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,0.2);display:block;"></span>
      </button>
    </div>
    <button class="common-btn" style="width:100%;height:42px;" onclick="flDoUpdateProfile()">💾 保存修改</button>
  </div>
</div>

<!-- ==================== 账号规则弹窗 ==================== -->
<div class="modal-mask" id="flRulesModal" style="display:none;z-index:9999;">
  <div class="modal-box" style="width:92vw;max-width:400px;padding:22px 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h3 style="margin:0;font-size:18px;">📖 账号规则</h3>
      <button class="modal-close-btn" onclick="flCloseRulesModal()" style="border:none;background:var(--bg-input);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="font-size:13px;line-height:1.8;color:var(--text-main);">
      <div style="margin-bottom:12px;padding:10px 12px;background:var(--primary-bg);border-radius:10px;">
        <div style="font-weight:600;color:var(--primary);margin-bottom:4px;">☁️ 云端账号</div>
        <div>· 用户名：3-20位字母或数字，可在修改资料中更改</div>
        <div>· 密码：6-24位，建议混合字母数字提高安全</div>
        <div>· 昵称：自定义显示名，可随时修改</div>
        <div>· 登录后自动同步存档，关闭页面时自动上传</div>
      </div>
      <div style="margin-bottom:12px;padding:10px 12px;background:var(--bg-input);border-radius:10px;">
        <div style="font-weight:600;margin-bottom:4px;">📱 本地账号</div>
        <div>· 数据仅保存在本机浏览器，清除缓存会丢失</div>
        <div>· 可创建多个本地账号切换使用</div>
      </div>
      <div style="padding:10px 12px;background:var(--bg-input);border-radius:10px;">
        <div style="font-weight:600;margin-bottom:4px;">📥 存档码</div>
        <div>· 输入存档码可导入其他设备的存档</div>
        <div>· 存档码永久有效，请注意保管</div>
      </div>
    </div>
  </div>
</div>

<!-- ==================== 隐私政策确认弹窗 ==================== -->
<div class="modal-mask" id="flPrivacyModal" style="display:none;z-index:10000;">
  <div class="modal-box" style="width:92vw;max-width:400px;padding:22px 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h3 style="margin:0;font-size:18px;">🔒 隐私政策</h3>
      <button class="modal-close-btn" onclick="flClosePrivacyModal()" style="border:none;background:var(--bg-input);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="font-size:13px;line-height:1.8;color:var(--text-main);margin-bottom:16px;">
      <div style="margin-bottom:10px;font-weight:600;">注册即表示您同意以下条款：</div>
      <div style="padding:10px 12px;background:var(--bg-input);border-radius:10px;">
        <div>· 用户名仅用于登录，可在修改资料中更改</div>
        <div>· 密码经加密存储，不会以明文形式展示或泄露</div>
        <div>· 存档数据仅用于云端同步，帮助您在多设备间恢复进度</div>
        <div>· 我们不会向任何第三方出售或分享您的个人信息</div>
        <div>· 您可随时退出登录，本地数据不受影响</div>
      </div>
    </div>
    <div style="display:flex;gap:10px;">
      <button class="common-btn" style="flex:1;height:42px;background:var(--bg-input);color:var(--text-secondary);border:1px solid var(--border-color);" onclick="flClosePrivacyModal()">取消</button>
      <button class="common-btn" style="flex:1;height:42px;background:var(--primary);color:#fff;font-weight:600;font-size:14px;" onclick="flConfirmRegister()">✅ 同意并注册</button>
    </div>
  </div>
</div>

<!-- ==================== 通用确认弹窗 ==================== -->
<div class="modal-mask" id="flConfirmModal" style="display:none;z-index:10001;">
  <div class="modal-box" style="width:92vw;max-width:360px;padding:22px 20px;">
    <button class="modal-close-btn" type="button" aria-label="关闭确认弹窗" onclick="flConfirmCancel()" style="position:absolute;top:12px;right:12px;">✕</button>
    <div style="font-size:15px;font-weight:600;margin-bottom:12px;line-height:1.5;padding-top:30px;" id="flConfirmMsg">确定操作吗？</div>
    <div style="display:flex;gap:10px;">
      <button class="common-btn" style="flex:1;height:40px;background:var(--bg-input);color:var(--text-secondary);border:1px solid var(--border-color);" onclick="flConfirmCancel()">取消</button>
      <button class="common-btn" style="flex:1;height:40px;background:#ef4444;color:#fff;font-weight:600;" onclick="flConfirmOk()">确定</button>
    </div>
  </div>
</div>

<!-- ==================== 选择账号弹窗 ==================== -->
<div class="modal-mask" id="flSelectModal" style="display:none;z-index:10001;">
  <div class="modal-box" style="width:92vw;max-width:400px;max-height:70vh;overflow-y:auto;padding:22px 20px;">
    <div class="modal-glass-sticky-head" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h3 id="flSelectTitle" style="margin:0;font-size:17px;">选择账号</h3>
      <button class="modal-close-btn" onclick="flSelectCancel()" style="border:none;background:var(--bg-input);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div id="flSelectList" style="display:flex;flex-direction:column;gap:10px;"></div>
  </div>
</div>

<!-- ==================== 新建/编辑账号弹窗 ==================== -->
<div class="modal-mask" id="flNewAccountModal" style="display:none;z-index:10002;">
  <div class="modal-box" style="width:92vw;max-width:380px;padding:22px 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h3 id="flNewAccountTitle" style="margin:0;font-size:17px;">✨ 新建本地账号</h3>
      <button class="modal-close-btn" onclick="flCloseNewAccountModal()" style="border:none;background:var(--bg-input);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--text-secondary);">头像设置</div>
    <div id="flAvatarPicker" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;"></div>
    <input id="flNewName" maxlength="12" placeholder="给账号起个名字（≤12字）" style="width:100%;height:42px;padding:0 14px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:14px;box-sizing:border-box;">
    <button class="common-btn" id="flNewAccountSubmit" style="width:100%;height:44px;background:var(--primary);color:#fff;font-weight:600;font-size:15px;" onclick="flCreateAccount()">➕ 创建新账号</button>
  </div>
</div>

<!-- ==================== 存档码导入弹窗 ==================== -->
<div class="modal-mask" id="flImportModal" style="display:none;z-index:10002;">
  <div class="modal-box" style="width:92vw;max-width:380px;padding:22px 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h3 style="margin:0;font-size:17px;">📥 输入存档码</h3>
      <button class="modal-close-btn" onclick="flCloseImportModal()" style="border:none;background:var(--bg-input);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <input id="flImportCode" maxlength="6" placeholder="请输入6位数字存档码" style="width:100%;height:46px;padding:0 14px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:18px;letter-spacing:4px;text-align:center;outline:none;box-sizing:border-box;margin-bottom:14px;text-transform:uppercase;">
    <button class="common-btn" style="width:100%;height:44px;background:var(--primary);color:#fff;font-weight:600;font-size:15px;" onclick="flDoImport()">✅ 导入存档</button>
  </div>
</div>

<!-- ==================== 存档码展示弹窗 ==================== -->
<div class="modal-mask" id="flCodeModal" style="display:none;z-index:10003;">
  <div class="modal-box" style="width:92vw;max-width:360px;padding:26px 20px;text-align:center;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <div style="font-size:15px;color:var(--text-secondary);">你的存档码</div>
      <button class="modal-close-btn" type="button" aria-label="关闭存档码弹窗" onclick="flCloseCodeModal()">✕</button>
    </div>
    <div id="flCodeDisplay" style="font-size:36px;font-weight:700;letter-spacing:8px;color:var(--primary);margin-bottom:20px;font-family:monospace;">ABCDEF</div>
    <div style="display:flex;gap:10px;">
      <button class="common-btn" style="flex:1;height:42px;background:var(--primary);color:#fff;font-weight:600;" onclick="flCopyCode()">📋 复制</button>
    </div>
  </div>
</div>

<!-- ==================== 修改密码弹窗 ==================== -->
<div class="modal-mask" id="flPwdModal" style="display:none;z-index:10003;">
  <div class="modal-box" style="width:92vw;max-width:380px;padding:22px 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h3 style="margin:0;font-size:17px;">🔑 修改密码</h3>
      <button class="modal-close-btn" onclick="flClosePwdModal()" style="border:none;background:var(--bg-input);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <input id="flOldPwd" type="password" placeholder="旧密码" style="width:100%;height:42px;padding:0 14px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;">
    <input id="flNewPwd" type="password" placeholder="新密码（6-24位）" style="width:100%;height:42px;padding:0 14px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;">
    <input id="flNewPwd2" type="password" placeholder="确认新密码" style="width:100%;height:42px;padding:0 14px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:14px;">
    <button class="common-btn" style="width:100%;height:44px;background:var(--primary);color:#fff;font-weight:600;font-size:15px;" onclick="flDoChangePwd()">✅ 确认修改</button>
  </div>
</div>

<!-- ==================== 注销账号弹窗 ==================== -->
<div class="modal-mask" id="flDeleteModal" style="display:none;z-index:10003;">
  <div class="modal-box" style="width:92vw;max-width:380px;padding:22px 20px;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
      <h3 style="margin:0;font-size:17px;color:#dc2626;">⚠️ 注销账号</h3>
      <button class="modal-close-btn" onclick="flCloseDeleteModal()" style="border:none;background:var(--bg-input);width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;">✕</button>
    </div>
    <div style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:14px;">
      <div style="margin-bottom:6px;color:#dc2626;font-weight:600;">此操作不可恢复！</div>
      <div>· 账号将立即被删除</div>
      <div>· 所有云端存档将被清除</div>
      <div>· 注销后无法找回</div>
    </div>
    <input id="flDeletePwd" type="password" placeholder="请输入密码确认注销" style="width:100%;height:42px;padding:0 14px;border:1px solid #fca5a5;border-radius:10px;background:#fef2f2;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:14px;">
    <button class="common-btn" id="flDeleteBtn" onclick="flDoDeleteAccount()" style="width:100%;height:44px;background:#d1d5db;color:#9ca3af;font-weight:600;font-size:15px;cursor:not-allowed;" disabled>请稍候...</button>
  </div>
</div>

`);
})();
(function(){
  function checkModalLock(){
    const anyOpen = Array.from(document.querySelectorAll('.modal-mask')).some(m => {
      const s = m.style.display;
      return s === 'flex' || s === 'block';
    });
    document.body.style.overflow = anyOpen ? 'hidden' : '';
  }
  const observer = new MutationObserver(checkModalLock);
  document.querySelectorAll('.modal-mask').forEach(m => {
    observer.observe(m, { attributes: true, attributeFilter: ['style'] });
  });
})();

function flConfirm(msg){
  return new Promise(function(resolve){
    flConfirmCallback = resolve;
    document.getElementById('flConfirmMsg').textContent = msg;
    const m = document.getElementById('flConfirmModal');
    m.classList.remove('closing');
    m.style.display = 'flex';
    m.style.alignItems = 'center';
    m.style.justifyContent = 'center';
  });
}
function flConfirmOk(){
  const m = document.getElementById('flConfirmModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
  if (flConfirmCallback) { flConfirmCallback(true); flConfirmCallback = null; }
}
function flConfirmCancel(){
  const m = document.getElementById('flConfirmModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
  if (flConfirmCallback) { flConfirmCallback(false); flConfirmCallback = null; }
}

// ===== 选择账号弹窗 =====
let flSelectCallback = null;
function flSelectAccount(title){
  return new Promise(function(resolve){
    flSelectCallback = resolve;
    document.getElementById('flSelectTitle').textContent = title;
    const list = window.__fl.getAccounts();
    const curId = localStorage.getItem(window.__fl.CUR_KEY);
    const box = document.getElementById('flSelectList');
    box.innerHTML = '';
    list.forEach(acc=>{
      const card = document.createElement('div');
      const isCur = acc.id === curId;
      card.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;border:1.5px solid ' + (isCur ? 'var(--primary)' : 'var(--border-color)') + ';background:' + (isCur ? 'var(--primary-bg)' : 'var(--bg-input)') + ';cursor:pointer;';
      card.innerHTML =
        '<div style="font-size:30px;">' + acc.avatar + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:14px;font-weight:600;">' + flNameHtml(acc.name) + (isCur ? ' <span style="font-size:10px;background:var(--primary);color:#fff;padding:2px 6px;border-radius:8px;">当前</span>' : '') + '</div>' +
          '<div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">💰' + (acc.coin||0) + '</div>' +
        '</div>';
      card.onclick = function(){
        const m = document.getElementById('flSelectModal');
        m.classList.add('closing');
        setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
        if (flSelectCallback) { flSelectCallback(acc.id); flSelectCallback = null; }
      };
      box.appendChild(card);
    });
    const m = document.getElementById('flSelectModal');
    m.classList.remove('closing');
    m.style.display = 'flex';
    m.style.alignItems = 'center';
    m.style.justifyContent = 'center';
  });
}
function flSelectCancel(){
  const m = document.getElementById('flSelectModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
  if (flSelectCallback) { flSelectCallback(null); flSelectCallback = null; }
}

const FL_AVATARS = ['😀','🥳','🍀','🌸','⭐','☁️','🎵','🔥','💎','🌟','❤️','😘','💕','💖','🐾'];
let flPickedAvatar = '😀';
let flEditingId = null;
let flAuthTab = 'login'; // login | register
let flProfileAvatar = '😀';
let flSelectedRecentUser = null; // 当前选中的最近登录账号
let flShowAccountPicker = false; // 是否显示账号选择界面（false=显示账号卡片一键登录）

// ===== 云端账号状态 =====
const CLOUD_API = 'https://api.fengling1314ovo.top/api';
const CLOUD_TOKEN_KEY = 'fl_cloud_token';
const CLOUD_USER_KEY = 'fl_cloud_user';

// ===== 存档压缩工具（LZ-string） =====
// 压缩：JSON对象 → 压缩后的base64字符串
function flCompressSave(data){
  try{
    const json = JSON.stringify(data);
    return LZString.compressToBase64(json);
  }catch(e){
    // 压缩失败就返回原始JSON字符串
    return JSON.stringify(data);
  }
}
// 解压：压缩后的字符串 → JSON对象（自动兼容旧数据）
function flDecompressSave(str){
  if(!str) return null;
  try{
    // 先尝试当JSON解析（旧数据）
    const parsed = JSON.parse(str);
    // 如果解析成功，直接返回
    return parsed;
  }catch(e){
    // 不是JSON，尝试当压缩数据解压
    try{
      const decompressed = LZString.decompressFromBase64(str);
      if(decompressed) return JSON.parse(decompressed);
    }catch(e2){}
  }
  // 都失败就返回原始数据
  return str;
}

function flGetToken(){ return localStorage.getItem(CLOUD_TOKEN_KEY) || ''; }
function flGetUser(){ try{ return JSON.parse(localStorage.getItem(CLOUD_USER_KEY)||'null'); }catch(e){ return null; } }
function flSetAuth(token, user, password){
  if(token) localStorage.setItem(CLOUD_TOKEN_KEY, token);
  if(user) localStorage.setItem(CLOUD_USER_KEY, JSON.stringify(user));
  // 从云端用户对象同步扩展资料（性别/生日/省份），不写入存档
  if(user){
    // 先清空上一个账号的残留资料，避免新账号未设置时仍显示旧账号的性别/生日/地区
    localStorage.removeItem('profile_gender');
    localStorage.removeItem('profile_birthday');
    localStorage.removeItem('profile_province');
    if(user.gender) lsSet('profile_gender', user.gender);
    if(user.birthday) lsSet('profile_birthday', user.birthday);
    if(user.province) lsSet('profile_province', user.province);
    if(user.rainbow_name !== undefined) lsSet('rainbow_name', !!user.rainbow_name);
    else localStorage.removeItem('rainbow_name');
  }
  // 记录最近登录账号（含密码，本地免密登录用）
  if(user && user.username){
    flAddRecentUser(user.username, user.avatar, user.nickname, password);
  }
}
function flClearAuth(){
  localStorage.removeItem(CLOUD_TOKEN_KEY);
  localStorage.removeItem(CLOUD_USER_KEY);
  // 退出登录时清空上一个云端账号的个人资料，避免残留给下一个账号
  localStorage.removeItem('profile_gender');
  localStorage.removeItem('profile_birthday');
  localStorage.removeItem('profile_province');
}
// 统一处理token过期：清除登录状态并提示
let flTokenExpiredHandled = false;
function flHandleTokenExpired(msg){
  if(flTokenExpiredHandled) return;
  flTokenExpiredHandled = true;
  flClearAuth();
  flSelectedRecentUser = null;
  flShowAccountPicker = false;
  flAuthTab = 'login';
  try{ flRenderCloudSection(); }catch(e){}
  try{ flRefreshHomeAccountBtn(); }catch(e){}
  showToast('⏰ ' + (msg || '登录已过期，请重新登录'));
  setTimeout(function(){ flTokenExpiredHandled = false; }, 3000);
}
// 检查服务器返回是否为登录过期错误
function flIsAuthExpired(result){
  if(!result || result.ok) return false;
  const msg = (result.msg || '').toLowerCase();
  return msg.indexOf('登录') >= 0 && (msg.indexOf('过期') >= 0 || msg.indexOf('失效') >= 0 || msg.indexOf('请重新') >= 0);
}
// 最近登录账号管理
const RECENT_USERS_KEY = 'fl_recent_users';
function flGetRecentUsers(){
  try{ return JSON.parse(localStorage.getItem(RECENT_USERS_KEY))||[]; }catch(e){ return []; }
}
function flAddRecentUser(username, avatar, nickname, password){
  let list = flGetRecentUsers();
  list = list.filter(u=>u.username !== username);
  list.unshift({username, avatar:avatar||'🙂', nickname:nickname||username, password:password||''});
  if(list.length > 3) list = list.slice(0, 3);
  localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(list));
}
function flGetSavedPassword(username){
  const list = flGetRecentUsers();
  const user = list.find(u=>u.username === username);
  return user ? (user.password || '') : '';
}
function flSelectRecentUser(username){
  const list = flGetRecentUsers();
  const user = list.find(u=>u.username === username);
  if(user){
    flSelectedRecentUser = user;
    flAuthTab = 'login';
    flShowAccountPicker = false;
    flRenderCloudSection();
  }
}
function flSwitchToAccountPicker(){
  // 清除当前账号的保存密码，无法再一键登录
  if(flSelectedRecentUser){
    flClearSavedPassword(flSelectedRecentUser.username);
  }
  flSelectedRecentUser = null;
  flShowAccountPicker = true;
  flRenderCloudSection();
}
function flClearSavedPassword(username){
  const list = flGetRecentUsers();
  const user = list.find(u=>u.username === username);
  if(user){
    user.password = '';
    localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(list));
  }
}
async function flDoLoginWithSelected(username){
  // 优先用本地保存的密码，没有就读输入框
  let password = flGetSavedPassword(username);
  if(!password){
    const input = document.getElementById('flAuthPassword');
    password = input ? input.value : '';
  }
  if(!password){ showToast('⚠️ 请输入密码'); return; }
  if(password.length < 6 || password.length > 24){ showToast('⚠️ 密码需6-24位'); return; }
  await flDoLogin(username, password);
}

// ===== 打开/关闭弹窗 =====
function flOpenAccountModal(){
  const m = document.getElementById('flAccountModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
  flRenderCloudSection();
  flRenderAccountList();
  flResetForm();
}
function flCloseAccountModal(){
  const m = document.getElementById('flAccountModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}
function flCloseProfileModal(){
  const m = document.getElementById('flProfileModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}
function flShowRules(){
  const m = document.getElementById('flRulesModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
}
function flCloseRulesModal(){
  const m = document.getElementById('flRulesModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}

// ===== 渲染云端账号区域 =====
function flRenderCloudSection(){
  const box = document.getElementById('flCloudSection');
  const user = flGetUser();
  if (user) {
    // 已登录
    const _g = lsGet('profile_gender', '');
    const _b = lsGet('profile_birthday', '');
    const _p = lsGet('profile_province', '');
    const _gTxt = _g==='male'?'<span style="color:#3b82f6;font-weight:700;">♂</span> 男':_g==='female'?'<span style="color:#e91e63;font-weight:700;">♀</span> 女':_g==='secret'?'🔒 保密':'未设置';
    const _infoParts = [];
    if(_g) _infoParts.push(_gTxt); else _infoParts.push('性别未设置');
    if(_b) _infoParts.push('🎂 '+_b); else _infoParts.push('生日未设置');
    if(_p) _infoParts.push('📍 '+_p); else _infoParts.push('地区未设置');
    box.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">' +
        '<div style="font-size:40px;">' + (user.avatar||'🙂') + '</div>' +
        '<div style="flex:1;min-width:0;">' +
          '<div style="font-size:16px;font-weight:600;">' + flNameHtml(user.nickname||user.username) + '</div>' +
          '<div style="font-size:12px;color:var(--text-secondary);">@' + escapeHtml(user.username) + '</div>' +
        '</div>' +
        '<button style="border:none;background:var(--bg-input);padding:6px 10px;border-radius:8px;font-size:12px;cursor:pointer;color:var(--text-secondary);" onclick="flOpenPwdModal()">🔑 改密码</button>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;display:flex;gap:12px;flex-wrap:wrap;">' +
        '<span>' + _infoParts[0] + '</span>' +
        '<span>' + _infoParts[1] + '</span>' +
        '<span>' + _infoParts[2] + '</span>' +
      '</div>' +
      '<div style="display:flex;gap:8px;">' +
        '<button class="common-btn" style="flex:1;height:38px;font-size:13px;background:#10b981;color:#000;" onclick="flSmartSync()">☁️ 同步存档</button>' +
        '<button class="common-btn" style="flex:1;height:38px;font-size:13px;background:var(--bg-input);color:#000;border:1px solid var(--border-color);" onclick="flOpenProfileModal()">✏️ 修改资料</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:8px;">' +
        '<button class="common-btn" style="flex:1;height:36px;font-size:12px;background:var(--bg-input);color:#000;border:1px solid var(--primary);" onclick="flCloudToLocal()">⬇️ 云端→本地</button>' +
        '<button class="common-btn" style="flex:1;height:36px;font-size:12px;background:var(--bg-input);color:#000;border:1px solid var(--primary);" onclick="flLocalToCloud()">⬆️ 本地→云端</button>' +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-top:8px;">' +
        '<button class="common-btn" style="flex:1;height:36px;font-size:12px;background:var(--primary-bg);color:#000;border:1px solid var(--primary);" onclick="flUseCloudOnly()">🔗 使用云端账号</button>' +
        '<button class="common-btn" style="flex:1;height:36px;font-size:12px;background:#fee2e2;color:#dc2626;" onclick="flDoLogout()">🚪 退出登录</button>' +
      '</div>' +
      '<div style="margin-top:10px;padding:8px 12px;background:var(--bg-input);border-radius:10px;font-size:11px;color:var(--text-secondary);line-height:1.6;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<span>⏱️ 上次同步：<span id="flLastSyncTime">从未同步</span></span>' +
          '<button onclick="flOpenAutoSyncModal()" style="border:none;background:var(--primary-bg);color:var(--primary);padding:3px 10px;border-radius:8px;font-size:11px;cursor:pointer;">' +
            '⚙️ <span id="flAutoSyncLabel">自动同步：关闭</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<button class="common-btn" style="width:100%;height:34px;margin-top:8px;font-size:12px;background:transparent;color:#dc2626;border:1px dashed #fca5a5;" onclick="flOpenDeleteModal()">🗑️ 注销账号</button>';
  } else {
    // 未登录：登录/注册表单
    const recentUsers = flGetRecentUsers();
    const selectedUser = flSelectedRecentUser || (recentUsers.length > 0 ? recentUsers[0] : null);

    if(selectedUser && flAuthTab === 'login' && !flShowAccountPicker){
      // 显示账号卡片模式：大头像 + 用户名，直接登录（本地已保存密码）
      const savedPwd = flGetSavedPassword(selectedUser.username);
      box.innerHTML =
        '<div style="text-align:center;margin-bottom:16px;">' +
          '<div style="font-size:56px;margin-bottom:8px;">' + (selectedUser.avatar||'🙂') + '</div>' +
          '<div style="font-size:18px;font-weight:600;margin-bottom:2px;">' + flNameHtml(selectedUser.nickname||selectedUser.username) + '</div>' +
          '<div style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">@' + escapeHtml(selectedUser.username) + '</div>' +
          '<button onclick="flSwitchToAccountPicker()" style="border:none;background:none;color:var(--primary);font-size:12px;cursor:pointer;text-decoration:underline;">切换账号</button>' +
        '</div>' +
        (savedPwd ?
          '<button class="common-btn" style="width:100%;height:42px;font-size:14px;" onclick="flDoLoginWithSelected(\'' + selectedUser.username + '\')">🔐 一键登录</button>'
          :
          '<input id="flAuthPassword" type="password" maxlength="24" placeholder="请输入密码" style="width:100%;height:42px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:14px;outline:none;box-sizing:border-box;margin-bottom:10px;" autofocus>' +
          '<button class="common-btn" style="width:100%;height:42px;font-size:14px;" onclick="flDoLoginWithSelected(\'' + selectedUser.username + '\')">🔐 登录</button>'
        ) +
        '<div style="text-align:center;margin-top:12px;">' +
          '<button onclick="flSwitchAuthTab(\'register\')" style="border:none;background:none;color:var(--text-secondary);font-size:12px;cursor:pointer;">没有账号？去注册</button>' +
        '</div>';
    } else {
      // 账号选择模式 / 注册模式
      let recentHtml = '';
      if(recentUsers.length > 0 && flAuthTab === 'login'){
        recentHtml = '<div style="margin-bottom:12px;">' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">选择账号</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
        recentUsers.forEach(u=>{
          recentHtml += '<button onclick="flSelectRecentUser(\'' + u.username + '\')" style="display:flex;align-items:center;gap:6px;padding:6px 12px;border:1px solid var(--border-color);border-radius:20px;background:var(--bg-input);cursor:pointer;font-size:13px;color:var(--text-main);">' +
            '<span style="font-size:16px;">' + (u.avatar||'🙂') + '</span><span>' + escapeHtml(u.username) + '</span>' +
          '</button>';
        });
        recentHtml += '</div></div>';
      }
      box.innerHTML =
        recentHtml +
        '<div style="display:flex;gap:8px;margin-bottom:12px;">' +
          '<button id="flTabLogin" style="flex:1;height:36px;border:none;border-radius:10px;font-size:13px;cursor:pointer;background:' + (flAuthTab==='login'?'var(--primary)':'var(--bg-input)') + ';color:' + (flAuthTab==='login'?'#fff':'var(--text-secondary)') + ';" onclick="flSwitchAuthTab(\'login\')">登录</button>' +
          '<button id="flTabRegister" style="flex:1;height:36px;border:none;border-radius:10px;font-size:13px;cursor:pointer;background:' + (flAuthTab==='register'?'var(--primary)':'var(--bg-input)') + ';color:' + (flAuthTab==='register'?'#fff':'var(--text-secondary)') + ';" onclick="flSwitchAuthTab(\'register\')">注册</button>' +
        '</div>' +
        '<input id="flAuthUsername" maxlength="20" placeholder="用户名（3-20位字母数字）" style="width:100%;height:40px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:13px;outline:none;box-sizing:border-box;margin-bottom:2px;">' +
        '<div id="flUsernameTip" style="display:none;font-size:11px;color:var(--text-placeholder);margin-bottom:8px;">⚠️ 用户名3-20位字母或数字</div>' +
        '<input id="flAuthPassword" type="password" maxlength="24" placeholder="密码（6-24位）" oninput="flUpdatePwStrength()" style="width:100%;height:40px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:13px;outline:none;box-sizing:border-box;margin-bottom:6px;">' +
        '<div id="flPwStrengthBar" style="display:none;height:4px;border-radius:2px;background:var(--border-color);margin-bottom:4px;overflow:hidden;"><div id="flPwStrengthFill" style="height:100%;width:0%;transition:width .2s;"></div></div>' +
        '<div id="flPwStrengthText" style="display:none;font-size:11px;color:var(--text-placeholder);margin-bottom:10px;">请输入密码</div>' +
        '<div id="flRegisterFields" style="display:none;">' +
          '<input id="flAuthNickname" maxlength="20" placeholder="昵称（可自定义，显示用）" style="width:100%;height:40px;padding:0 12px;border:1px solid var(--border-color);border-radius:10px;color:var(--text-main);font-size:13px;outline:none;box-sizing:border-box;margin-bottom:8px;">' +
          '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">选择头像</div>' +
          '<div id="flAuthAvatarPicker" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;"></div>' +
        '</div>' +
        '<button class="common-btn" id="flAuthSubmitBtn" style="width:100%;height:42px;font-size:14px;" onclick="flDoAuth()">🔐 ' + (flAuthTab==='register'?'注册并登录':'登录') + '</button>';
      flRenderAuthAvatarPicker();
      if(flAuthTab === 'register'){
        setTimeout(()=>{ document.getElementById('flRegisterFields').style.display='block'; }, 10);
      }
    }
  }
  // 渲染后更新上次同步时间和自动同步标签
  flUpdateLastSyncDisplay();
  flUpdateAutoSyncLabel();
}

function flSwitchAuthTab(tab){
  flAuthTab = tab;
  if(tab === 'register'){
    // 点注册时清除当前账号密码，进入账号选择模式
    if(flSelectedRecentUser){
      flClearSavedPassword(flSelectedRecentUser.username);
    }
    flSelectedRecentUser = null;
    flShowAccountPicker = true;
  }
  flRenderCloudSection();
}

function flRenderAuthAvatarPicker(){
  const box = document.getElementById('flAuthAvatarPicker');
  if (!box) return;
  box.innerHTML = '';
  FL_AVATARS.forEach(em => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = em;
    b.style.cssText = 'width:36px;height:36px;font-size:18px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-input);cursor:pointer;transition:all .15s;';
    if (em === flPickedAvatar) { b.style.borderColor = 'var(--primary)'; b.style.background = 'var(--primary-bg)'; b.style.transform = 'scale(1.1)'; }
    b.onclick = function(){ flPickedAvatar = em; flRenderAuthAvatarPicker(); };
    box.appendChild(b);
  });
}

// ===== 密码强度检测 =====
function flUpdatePwStrength(){
  const pw = document.getElementById('flAuthPassword').value;
  const fill = document.getElementById('flPwStrengthFill');
  const text = document.getElementById('flPwStrengthText');
  if (!pw) {
    fill.style.width = '0%'; fill.style.background = 'var(--border-color)';
    text.textContent = '请输入密码'; text.style.color = 'var(--text-placeholder)';
    return;
  }
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const levels = [
    { w: '20%', c: '#ef4444', t: '弱', tc: '#ef4444' },
    { w: '40%', c: '#f97316', t: '一般', tc: '#f97316' },
    { w: '60%', c: '#eab308', t: '中等', tc: '#eab308' },
    { w: '80%', c: '#22c55e', t: '强', tc: '#22c55e' },
    { w: '100%', c: '#10b981', t: '非常强', tc: '#10b981' }
  ];
  const lv = levels[Math.min(score, 5) - 1] || levels[0];
  fill.style.width = lv.w;
  fill.style.background = lv.c;
  text.textContent = '密码强度：' + lv.t;
  text.style.color = lv.tc;
}

// ===== 登录/注册 =====
let flPendingRegister = null; // 等待隐私政策确认的注册数据

async function flDoAuth(){
  const username = document.getElementById('flAuthUsername').value.trim();
  const password = document.getElementById('flAuthPassword').value;
  if (!username || !password) { showToast('⚠️ 请输入用户名和密码'); return; }
  if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) { showToast('⚠️ 用户名需3-20位字母或数字'); return; }
  if (password.length < 6 || password.length > 24) { showToast('⚠️ 密码需6-24位'); return; }

  if (flAuthTab === 'register') {
    // 注册：先弹隐私政策确认
    flPendingRegister = {
      username, password,
      nickname: document.getElementById('flAuthNickname').value.trim() || username,
      avatar: flPickedAvatar
    };
    flOpenPrivacyModal();
    return;
  }

  // 登录直接执行
  await flDoLogin(username, password);
}

async function flDoLogin(username, password) {
  showToast('🔐 正在登录...');
  try {
    const res = await fetch(CLOUD_API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await res.json();
    if (result.ok && result.token) {
      flSetAuth(result.token, result.user, password);
      showToast('✅ 登录成功');
      await flCloudSyncLoad(true, true);
      flRenderCloudSection();
      flRefreshHomeAccountBtn();
    } else {
      showToast('❌ ' + (result.msg || '登录失败'));
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

async function flDoRegister(data) {
  showToast('✨ 正在注册...');
  try {
    const res = await fetch(CLOUD_API + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.ok && result.token) {
      flSetAuth(result.token, result.user, data.password);
      showToast('✅ 注册成功');
      await flCloudSyncLoad(true, true);
      flRenderCloudSection();
      flRefreshHomeAccountBtn();
    } else {
      showToast('❌ ' + (result.msg || '注册失败'));
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

// ===== 隐私政策弹窗 =====
function flOpenPrivacyModal(){
  const m = document.getElementById('flPrivacyModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
}
function flClosePrivacyModal(){
  const m = document.getElementById('flPrivacyModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
  flPendingRegister = null;
}
function flConfirmRegister(){
  if (!flPendingRegister) return;
  const data = flPendingRegister;
  flPendingRegister = null;
  flClosePrivacyModal();
  flDoRegister(data);
}

// ===== 修改密码 =====
function flOpenPwdModal(){
  document.getElementById('flOldPwd').value = '';
  document.getElementById('flNewPwd').value = '';
  document.getElementById('flNewPwd2').value = '';
  const m = document.getElementById('flPwdModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
}
function flClosePwdModal(){
  const m = document.getElementById('flPwdModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}
async function flDoChangePwd(){
  const oldPwd = document.getElementById('flOldPwd').value;
  const newPwd = document.getElementById('flNewPwd').value;
  const newPwd2 = document.getElementById('flNewPwd2').value;
  if (!oldPwd || !newPwd) { showToast('⚠️ 请输入旧密码和新密码'); return; }
  if (newPwd.length < 6 || newPwd.length > 24) { showToast('⚠️ 新密码需6-24位'); return; }
  if (newPwd !== newPwd2) { showToast('⚠️ 两次输入的新密码不一致'); return; }
  const token = flGetToken();
  showToast('🔄 正在修改...');
  try {
    const res = await fetch(CLOUD_API + '/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, oldPassword: oldPwd, newPassword: newPwd })
    });
    const result = await res.json();
    if (result.ok) {
      showToast('✅ 密码修改成功，所有设备已退出登录');
      flClosePwdModal();
      // 改密码后清除本地登录状态
      const list = window.__fl.getAccounts();
      const newList = list.filter(a => a.cloudAccount !== true);
      window.__fl.setAccounts(newList);
      flClearAuth();
      flRenderCloudSection();
      flRenderAccountList();
      flRefreshHomeAccountBtn();
    } else {
      if (flIsAuthExpired(result)) {
        flHandleTokenExpired(result.msg);
      } else {
        showToast('❌ ' + (result.msg || '修改失败'));
      }
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

// ===== 注销账号 =====
let flDeleteCountdownTimer = null;
function flOpenDeleteModal(){
  document.getElementById('flDeletePwd').value = '';
  const btn = document.getElementById('flDeleteBtn');
  btn.disabled = true;
  btn.style.background = '#d1d5db';
  btn.style.color = '#9ca3af';
  btn.style.cursor = 'not-allowed';
  let count = 5;
  btn.textContent = '⚠️ ' + count + ' 秒后可注销';
  if (flDeleteCountdownTimer) clearInterval(flDeleteCountdownTimer);
  flDeleteCountdownTimer = setInterval(function(){
    count--;
    if (count <= 0) {
      clearInterval(flDeleteCountdownTimer);
      flDeleteCountdownTimer = null;
      btn.disabled = false;
      btn.style.background = '#dc2626';
      btn.style.color = '#fff';
      btn.style.cursor = 'pointer';
      btn.textContent = '🗑️ 立即注销';
    } else {
      btn.textContent = '⚠️ ' + count + ' 秒后可注销';
    }
  }, 1000);
  const m = document.getElementById('flDeleteModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
}
function flCloseDeleteModal(){
  if (flDeleteCountdownTimer) { clearInterval(flDeleteCountdownTimer); flDeleteCountdownTimer = null; }
  const m = document.getElementById('flDeleteModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}
async function flDoDeleteAccount(){
  const pwd = document.getElementById('flDeletePwd').value;
  if (!pwd) { showToast('⚠️ 请输入密码'); return; }
  const token = flGetToken();
  showToast('🔄 正在注销...');
  try {
    const res = await fetch(CLOUD_API + '/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: pwd })
    });
    const result = await res.json();
    if (result.ok) {
      // 删除所有云端账号本地数据
      const list = window.__fl.getAccounts();
      const newList = list.filter(a => a.cloudAccount !== true);
      window.__fl.setAccounts(newList);
      flClearAuth();
      flCloseDeleteModal();
      flRenderCloudSection();
      flRenderAccountList();
      flRefreshHomeAccountBtn();
      showToast('✅ 账号已注销');
    } else {
      if (flIsAuthExpired(result)) {
        flHandleTokenExpired(result.msg);
      } else {
        showToast('❌ ' + (result.msg || '注销失败'));
      }
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

// ===== 退出登录 =====
async function flDoLogout(){
  const ok = await flConfirm('确定退出登录吗？退出后本地存档仍保留。');
  if (!ok) return;
  const token = flGetToken();
  try {
    await fetch(CLOUD_API + '/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  } catch (e) {}
  // 删除所有云端账号对应的本地账号
  const list = window.__fl.getAccounts();
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  const cloudAcc = list.find(a => a.id === curId && a.cloudAccount === true);
  const newList = list.filter(a => a.cloudAccount !== true);
  // 如果当前正在用云端账号，切到第一个普通账号
  if (cloudAcc && newList.length > 0) {
    const firstNormal = newList[0];
    let save = {};
    try { save = JSON.parse(localStorage.getItem(window.__fl.SAVE_PRE + firstNormal.id) || '{}'); } catch(e){}
    window.__fl.unpackRoot(save);
    localStorage.setItem(window.__fl.CUR_KEY, firstNormal.id);
  }
  window.__fl.setAccounts(newList);
  flClearAuth();
  flSelectedRecentUser = null;
  flShowAccountPicker = false;
  flAuthTab = 'login';
  flRenderCloudSection();
  flRenderAccountList();
  flRefreshHomeAccountBtn();
  showToast('🚪 已退出登录');
}

// ===== 云端覆盖本地 =====
async function flCloudToLocal(){
  const ok = await flConfirm('⚠️ 将用云端存档覆盖你选择的本地账号数据，确定继续吗？');
  if (!ok) return;
  const targetId = await flSelectAccount('选择要覆盖的本地账号');
  if (!targetId) return;
  const token = flGetToken();
  showToast('☁️ 正在拉取云端存档...');
  try {
    const res = await fetch(CLOUD_API + '/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const result = await res.json();
    if (result.ok && result.data) {
      result.data = flDecompressSave(result.data);
      // 覆盖选中账号的快照
      try { localStorage.setItem(window.__fl.SAVE_PRE + targetId, JSON.stringify(result.data)); } catch(e){}
      const list = window.__fl.getAccounts();
      const acc = list.find(a => a.id === targetId);
      if (acc) {
        acc.coin = window.__fl.coinFromSave(result.data);
        acc.lastActive = Date.now();
        window.__fl.setAccounts(list);
      }
      // 如果覆盖的是当前账号，刷新页面
      const curId = localStorage.getItem(window.__fl.CUR_KEY);
      if (targetId === curId) {
        window.__fl.unpackRoot(result.data);
        showToast('✅ 云端存档已覆盖当前账号，即将刷新...');
        setTimeout(function(){ location.reload(); }, 1000);
      } else {
        showToast('✅ 云端存档已覆盖到选中账号');
        flRenderAccountList();
      }
    } else if (result.ok && result.data === null) {
      showToast('📭 云端暂无存档');
    } else {
      if (flIsAuthExpired(result)) {
        flHandleTokenExpired(result.msg);
      } else {
        showToast('❌ ' + (result.msg || '拉取失败'));
      }
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

// ===== 本地覆盖云端 =====
async function flLocalToCloud(){
  const ok = await flConfirm('⚠️ 将用你选择的本地账号数据覆盖云端存档，云端旧进度会丢失，确定继续吗？');
  if (!ok) return;
  const targetId = await flSelectAccount('选择要上传的本地账号');
  if (!targetId) return;
  const token = flGetToken();
  showToast('☁️ 正在上传本地存档...');
  // 读取选中账号的快照
  let saveData = {};
  try { saveData = JSON.parse(localStorage.getItem(window.__fl.SAVE_PRE + targetId) || '{}'); } catch(e){}
  try {
    const res = await fetch(CLOUD_API + '/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, data: flCompressSave(saveData) })
    });
    const result = await res.json();
    if (result.ok) {
      showToast('✅ 本地存档已覆盖云端');
    } else {
      if (flIsAuthExpired(result)) {
        flHandleTokenExpired(result.msg);
      } else {
        showToast('❌ ' + (result.msg || '上传失败'));
      }
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

// ===== 只使用云端账号 =====
function flUseCloudOnly(){
  const list = window.__fl.getAccounts();
  const user = flGetUser();
  // 找到云端账号对应的本地账号
  const cloudAcc = list.find(a => a.cloudAccount === true && a.cloudUsername === (user ? user.username : ''));
  if (!cloudAcc) {
    showToast('⚠️ 本地还没有云端存档，先点「同步存档」拉取');
    return;
  }
  // 切换到云端账号
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  if (cloudAcc.id === curId) {
    showToast('✅ 当前已在使用云端账号');
    return;
  }
  showToast('🔄 正在切换到云端账号...');
  // 保存当前账号
  const save = window.__fl.packRoot();
  const oldAcc = list.find(a => a.id === curId);
  if (oldAcc) {
    oldAcc.coin = window.__fl.coinFromSave(save);
    oldAcc.lastActive = Date.now();
    try { localStorage.setItem(window.__fl.SAVE_PRE + curId, JSON.stringify(save)); } catch(e){}
  }
  // 切换
  localStorage.setItem(window.__fl.CUR_KEY, cloudAcc.id);
  let newSave = {};
  try { newSave = JSON.parse(localStorage.getItem(window.__fl.SAVE_PRE + cloudAcc.id) || '{}'); } catch(e){}
  window.__fl.unpackRoot(newSave);
  const newAcc = list.find(a => a.id === cloudAcc.id);
  if (newAcc) {
    newAcc.lastActive = Date.now();
    newAcc.coin = window.__fl.coinFromSave(newSave);
  }
  window.__fl.setAccounts(list);
  setTimeout(function(){ location.reload(); }, 700);
}

// ===== 云端同步：上传 =====
async function flCloudSyncLoad(silent, autoSwitch){
  const token = flGetToken();
  if (!token) { if (!silent) showToast('⚠️ 请先登录'); return false; }
  if (!silent) showToast('☁️ 正在拉取云端存档...');
  try {
    const res = await fetch(CLOUD_API + '/load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const result = await res.json();
    if (result.ok && result.data) {
      result.data = flDecompressSave(result.data);
      // 把云端存档作为新本地账号导入
      const list = window.__fl.getAccounts();
      const curId = localStorage.getItem(window.__fl.CUR_KEY);
      const user = flGetUser();
      const accName = (user ? user.nickname : '云端') + '的存档';

      // 检查是否已有该云端账号
      let cloudAcc = list.find(a => a.cloudAccount === true && a.cloudUsername === (user ? user.username : ''));
      if (cloudAcc) {
        // 更新已有
        cloudAcc.coin = window.__fl.coinFromSave(result.data);
        cloudAcc.cloudTime = Date.now();
        window.__fl.setAccounts(list);
        try { localStorage.setItem(window.__fl.SAVE_PRE + cloudAcc.id, JSON.stringify(result.data)); } catch(e){}
      } else {
        // 新建
        const newId = window.__fl.genId();
        list.push({
          id: newId,
          name: accName,
          avatar: (user && user.avatar) || '☁️',
          createdAt: Date.now(),
          lastActive: Date.now(),
          coin: window.__fl.coinFromSave(result.data),
          cloudCode: null,
          cloudTime: Date.now(),
          cloudAccount: true,
          cloudUsername: user ? user.username : ''
        });
        window.__fl.setAccounts(list);
        try { localStorage.setItem(window.__fl.SAVE_PRE + newId, JSON.stringify(result.data)); } catch(e){}
        cloudAcc = list.find(a => a.id === newId);
      }
      flRenderAccountList();
      if (!silent) showToast('✅ 云端存档已拉取');
      // 自动切换到云端账号
      if (autoSwitch && cloudAcc && cloudAcc.id !== curId) {
        setTimeout(()=>{ flSwitchToCloudAccount(cloudAcc.id); }, 300);
      }
      return true;
    } else if (result.ok && result.data === null) {
      // 云端暂无存档
      if (autoSwitch) {
        // 自动切换模式下，创建一个空的云端账号并切换
        const list = window.__fl.getAccounts();
        const curId = localStorage.getItem(window.__fl.CUR_KEY);
        const user = flGetUser();
        const accName = (user ? user.nickname : '云端') + '的存档';
        let cloudAcc = list.find(a => a.cloudAccount === true && a.cloudUsername === (user ? user.username : ''));
        if (!cloudAcc) {
          const newId = window.__fl.genId();
          list.push({
            id: newId,
            name: accName,
            avatar: (user && user.avatar) || '☁️',
            createdAt: Date.now(),
            lastActive: Date.now(),
            coin: 100,
            cloudCode: null,
            cloudTime: Date.now(),
            cloudAccount: true,
            cloudUsername: user ? user.username : ''
          });
          window.__fl.setAccounts(list);
          try { localStorage.setItem(window.__fl.SAVE_PRE + newId, JSON.stringify({})); } catch(e){}
          cloudAcc = list.find(a => a.id === newId);
        }
        flRenderAccountList();
        if (cloudAcc && cloudAcc.id !== curId) {
          setTimeout(()=>{ flSwitchToCloudAccount(cloudAcc.id); }, 300);
        }
      } else if (!silent) {
        showToast('📭 云端暂无存档');
      }
      return false;
    } else {
      // 检测登录过期
      if (flIsAuthExpired(result)) {
        flHandleTokenExpired(result.msg);
      } else if (!silent) {
        showToast('❌ ' + (result.msg || '拉取失败'));
      }
      return false;
    }
  } catch (e) {
    if (!silent) showToast('❌ 网络错误：' + e.message);
    return false;
  }
}

// 切换到云端账号（不弹确认，直接切换）
function flSwitchToCloudAccount(cloudAccId){
  const list = window.__fl.getAccounts();
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  if (cloudAccId === curId) return;
  showToast('🔄 正在切换到云端账号...');
  // 保存当前账号
  const save = window.__fl.packRoot();
  const oldAcc = list.find(a => a.id === curId);
  if (oldAcc) {
    oldAcc.coin = window.__fl.coinFromSave(save);
    oldAcc.lastActive = Date.now();
    try { localStorage.setItem(window.__fl.SAVE_PRE + curId, JSON.stringify(save)); } catch(e){}
  }
  // 切换
  localStorage.setItem(window.__fl.CUR_KEY, cloudAccId);
  let newSave = {};
  try { newSave = JSON.parse(localStorage.getItem(window.__fl.SAVE_PRE + cloudAccId) || '{}'); } catch(e){}
  window.__fl.unpackRoot(newSave);
  const newAcc = list.find(a => a.id === cloudAccId);
  if (newAcc) {
    newAcc.lastActive = Date.now();
    newAcc.coin = window.__fl.coinFromSave(newSave);
  }
  window.__fl.setAccounts(list);
  setTimeout(function(){ location.reload(); }, 500);
}

async function flCloudSyncSave(){
  const token = flGetToken();
  if (!token) { showToast('⚠️ 请先登录'); return; }
  showToast('☁️ 正在上传存档...');
  const saveData = window.__fl.packRoot();
  try {
    const res = await fetch(CLOUD_API + '/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, data: flCompressSave(saveData) })
    });
    const result = await res.json();
    if (result.ok) {
      showToast('✅ 存档已同步到云端');
      flSetLastSyncTime();
    } else {
      if (flIsAuthExpired(result)) {
        flHandleTokenExpired(result.msg);
      } else {
        showToast('❌ ' + (result.msg || '同步失败'));
      }
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

// ===== 自动同步设置 =====
const AUTO_SYNC_KEY = 'fl_auto_sync_minutes';
const LAST_SYNC_KEY = 'fl_last_sync_time';
let flAutoSyncTimer = null;

function flGetAutoSyncMinutes(){
  return parseInt(localStorage.getItem(AUTO_SYNC_KEY) || '0');
}
function flSetAutoSyncMinutes(minutes){
  localStorage.setItem(AUTO_SYNC_KEY, String(minutes));
  flRestartAutoSync();
  flUpdateAutoSyncLabel();
}
function flGetLastSyncTime(){
  return parseInt(localStorage.getItem(LAST_SYNC_KEY) || '0');
}
function flSetLastSyncTime(){
  localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
  flUpdateLastSyncDisplay();
}
function flFormatLastSync(ts){
  if(!ts) return '从未同步';
  const diff = Date.now() - ts;
  const m = Math.floor(diff/60000), h = Math.floor(m/60), d = Math.floor(h/24);
  if(d>0) return d + '天前';
  if(h>0) return h + '小时前';
  if(m>0) return m + '分钟前';
  return '刚刚';
}
function flUpdateLastSyncDisplay(){
  const el = document.getElementById('flLastSyncTime');
  if(el) el.textContent = flFormatLastSync(flGetLastSyncTime());
}
function flUpdateAutoSyncLabel(){
  const el = document.getElementById('flAutoSyncLabel');
  if(!el) return;
  const min = flGetAutoSyncMinutes();
  el.textContent = min > 0 ? ('自动同步：' + min + '分钟') : '自动同步：关闭';
}
function flStartAutoSync(){
  flStopAutoSync();
  const minutes = flGetAutoSyncMinutes();
  if(minutes <= 0) return;
  const ms = minutes * 60 * 1000;
  flAutoSyncTimer = setInterval(async function(){
    const token = flGetToken();
    if(!token) return;
    // 自动同步只上传当前进度到云端
    try {
      const saveData = window.__fl.packRoot();
      const res = await fetch(CLOUD_API + '/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, data: flCompressSave(saveData) })
      });
      const result = await res.json();
      if (result.ok) {
        flSetLastSyncTime();
      }
    } catch(e) {}
  }, ms);
}
function flStopAutoSync(){
  if(flAutoSyncTimer){ clearInterval(flAutoSyncTimer); flAutoSyncTimer = null; }
}
function flRestartAutoSync(){
  flStartAutoSync();
}
let flSelectedAutoSync = 0;
function flOpenAutoSyncModal(){
  flSelectedAutoSync = flGetAutoSyncMinutes();
  const options = [0, 5, 10, 20, 30, 40, 50, 60];
  let html = '<div style="font-size:14px;font-weight:600;margin-bottom:12px;">⏱️ 自动同步设置</div>';
  html += '<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">';
  options.forEach(m => {
    const label = m === 0 ? '关闭' : (m + '分钟');
    const active = m === flSelectedAutoSync;
    html += '<button onclick="flPickAutoSync(' + m + ')" style="flex:1 0 30%;height:36px;border-radius:10px;border:1px solid ' + (active ? 'var(--primary)' : 'var(--border-color)') + ';background:' + (active ? 'var(--primary)' : 'var(--bg-input)') + ';color:' + (active ? '#fff' : 'var(--text-main)') + ';font-size:13px;cursor:pointer;">' + label + '</button>';
  });
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--text-secondary);text-align:center;margin-bottom:12px;">开启后，每隔设定时间自动保存进度到云端</div>';
  html += '<button onclick="flConfirmAutoSync()" style="width:100%;height:40px;border:none;border-radius:10px;background:var(--primary);color:#fff;font-size:14px;font-weight:600;cursor:pointer;">✅ 确认</button>';
  // 注入弹窗
  let modal = document.getElementById('flAutoSyncModal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'flAutoSyncModal';
    modal.className = 'modal-mask';
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;';
    document.body.appendChild(modal);
  }
  modal.innerHTML = '<div class="modal-box" style="background:var(--bg-card);border-radius:16px;padding:20px;max-width:320px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.2);"><button class="modal-close-btn" type="button" aria-label="关闭自动同步设置" onclick="closeModalAnimated(\'flAutoSyncModal\')" style="position:absolute;top:12px;right:12px;">✕</button>' + html + '</div>';
  modal.classList.remove('closing');
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  // 禁止点击背景关闭
  modal.onclick = null;
}
function flPickAutoSync(minutes){
  flSelectedAutoSync = minutes;
  // 重新渲染选项高亮
  const modal = document.getElementById('flAutoSyncModal');
  if(!modal) return;
  const buttons = modal.querySelectorAll('button');
  const options = [0, 5, 10, 20, 30, 40, 50, 60];
  buttons.forEach((btn, i) => {
    if(i < options.length){
      const active = options[i] === minutes;
      btn.style.borderColor = active ? 'var(--primary)' : 'var(--border-color)';
      btn.style.background = active ? 'var(--primary)' : 'var(--bg-input)';
      btn.style.color = active ? '#fff' : 'var(--text-main)';
    }
  });
}
function flConfirmAutoSync(){
  flSetAutoSyncMinutes(flSelectedAutoSync);
  flCloseAutoSyncModal();
  showToast(flSelectedAutoSync > 0 ? ('✅ 已设置每' + flSelectedAutoSync + '分钟自动同步') : '✅ 已关闭自动同步');
}
function flCloseAutoSyncModal(){
  const m = document.getElementById('flAutoSyncModal');
  if(!m) return;
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}

// ===== 智能同步：根据当前账号类型决定上传还是下载 =====
async function flSmartSync(){
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  const list = window.__fl.getAccounts();
  const curAcc = list.find(a => a.id === curId);
  const isCloudAcc = curAcc && curAcc.cloudAccount === true;

  if (isCloudAcc) {
    // 当前在云端账号：上传当前进度到云端
    await flCloudSyncSave();
  } else {
    // 当前在本地账号：从云端拉取最新存档，更新云端账号的本地快照
    // 不自动切换到云端账号，只更新云端账号的本地数据
    const token = flGetToken();
    if (!token) { showToast('⚠️ 请先登录'); return; }
    showToast('☁️ 正在拉取云端存档...');
    try {
      const res = await fetch(CLOUD_API + '/load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const result = await res.json();
      if (flIsAuthExpired(result)) { flHandleTokenExpired(result.msg); return; }
      if (result.ok && result.data) {
        result.data = flDecompressSave(result.data);
        const user = flGetUser();
        // 找到云端账号对应的本地账号
        let cloudAcc = list.find(a => a.cloudAccount === true && a.cloudUsername === (user ? user.username : ''));
        if (cloudAcc) {
          // 更新已有云端账号的本地快照
          cloudAcc.coin = window.__fl.coinFromSave(result.data);
          cloudAcc.cloudTime = Date.now();
          window.__fl.setAccounts(list);
          try { localStorage.setItem(window.__fl.SAVE_PRE + cloudAcc.id, JSON.stringify(result.data)); } catch(e){}
          showToast('✅ 云端存档已同步到云端账号');
          flSetLastSyncTime();
          flRenderAccountList();
        } else {
          // 云端账号不存在，创建一个新的（不切换）
          const newId = window.__fl.genId();
          list.push({
            id: newId,
            name: (user ? user.nickname : '云端') + '的存档',
            avatar: (user && user.avatar) || '☁️',
            createdAt: Date.now(),
            lastActive: Date.now(),
            coin: window.__fl.coinFromSave(result.data),
            cloudCode: null,
            cloudTime: Date.now(),
            cloudAccount: true,
            cloudUsername: user ? user.username : ''
          });
          window.__fl.setAccounts(list);
          try { localStorage.setItem(window.__fl.SAVE_PRE + newId, JSON.stringify(result.data)); } catch(e){}
          showToast('✅ 已从云端拉取存档并创建云端账号');
          flRenderAccountList();
        }
      } else if (result.ok && result.data === null) {
        showToast('📭 云端暂无存档');
      } else {
        showToast('❌ ' + (result.msg || '拉取失败'));
      }
    } catch (e) {
      showToast('❌ 网络错误：' + e.message);
    }
  }
}

// ===== 修改资料 =====
// 省份列表
const FL_PROVINCES = ['北京市','天津市','上海市','重庆市','河北省','山西省','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','海南省','四川省','贵州省','云南省','陕西省','甘肃省','青海省','台湾省','内蒙古自治区','广西壮族自治区','西藏自治区','宁夏回族自治区','新疆维吾尔自治区','香港特别行政区','澳门特别行政区'];
let flProfileGender = 'secret';
let flRainbowEnabled = false;
// 彩虹昵称开关
function flToggleRainbow(){
  flRainbowEnabled = !flRainbowEnabled;
  const btn = document.getElementById('flRainbowToggle');
  const dot = document.getElementById('flRainbowToggleDot');
  btn.style.background = flRainbowEnabled ? 'linear-gradient(90deg,#f59e0b,#ec4899)' : '#ccc';
  dot.style.transform = flRainbowEnabled ? 'translateX(20px)' : 'translateX(0)';
}
function flRenderRainbowToggle(){
  const btn = document.getElementById('flRainbowToggle');
  const dot = document.getElementById('flRainbowToggleDot');
  if(!btn || !dot) return;
  btn.style.background = flRainbowEnabled ? 'linear-gradient(90deg,#f59e0b,#ec4899)' : '#ccc';
  dot.style.transform = flRainbowEnabled ? 'translateX(20px)' : 'translateX(0)';
}
// 生成昵称HTML：开启彩虹就套 rainbow-text 样式
function flNameHtml(name){
  if(lsGet('rainbow_name', false)){
    return '<span class="rainbow-text">' + escapeHtml(name) + '</span>';
  }
  return escapeHtml(name);
}
function flInitProfileGenderButtons(){
  const box = document.getElementById('flProfileGender');
  if(!box) return;
  box.querySelectorAll('button').forEach(btn=>{
    btn.onclick = function(){
      flProfileGender = this.dataset.gender;
      box.querySelectorAll('button').forEach(b=>{
        const sel = b.dataset.gender === flProfileGender;
        b.style.borderColor = sel ? 'var(--primary)' : 'var(--border-color)';
        b.style.background = sel ? 'var(--primary-bg)' : 'var(--bg-input)';
        b.style.color = sel ? 'var(--primary)' : 'var(--text-main)';
        b.style.fontWeight = sel ? '700' : '400';
      });
    };
  });
}
function flRenderGenderButtons(){
  const box = document.getElementById('flProfileGender');
  if(!box) return;
  box.querySelectorAll('button').forEach(b=>{
    const sel = b.dataset.gender === flProfileGender;
    b.style.borderColor = sel ? 'var(--primary)' : 'var(--border-color)';
    b.style.background = sel ? 'var(--primary-bg)' : 'var(--bg-input)';
    b.style.color = sel ? 'var(--primary)' : 'var(--text-main)';
    b.style.fontWeight = sel ? '700' : '400';
  });
}
function flFillProvinceSelect(){
  const sel = document.getElementById('flProfileProvince');
  if(!sel || sel.options.length > 1) return;
  FL_PROVINCES.forEach(p=>{
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    sel.appendChild(opt);
  });
}
let flProfileLocalMode = false;
function flOpenProfileModal(){
  const user = flGetUser();
  if (!user) return;
  flProfileLocalMode = false;
  document.getElementById('flProfileCloudFields').style.display = '';
  document.querySelector('#flProfileModal h3').textContent = '✏️ 修改资料';
  flProfileAvatar = user.avatar || '🙂';
  document.getElementById('flProfileUsername').value = user.username || '';
  document.getElementById('flProfileNickname').value = user.nickname || '';
  // 读取扩展资料（性别/生日/省份，存在根级 localStorage，自动跟随账号）
  flProfileGender = lsGet('profile_gender', 'secret');
  document.getElementById('flProfileBirthday').value = lsGet('profile_birthday', '');
  flFillProvinceSelect();
  document.getElementById('flProfileProvince').value = lsGet('profile_province', '');
  flRenderProfileAvatarPicker();
  flRainbowEnabled = lsGet('rainbow_name', false);
  flRenderGenderButtons();
  flRenderRainbowToggle();
  flInitProfileGenderButtons();
  const m = document.getElementById('flProfileModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
}
function flRenderProfileAvatarPicker(){
  const box = document.getElementById('flProfileAvatarPicker');
  box.innerHTML = '';
  FL_AVATARS.forEach(em => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = em;
    b.style.cssText = 'width:32px;height:32px;font-size:17px;border-radius:9px;border:1px solid var(--border-color);background:var(--bg-input);cursor:pointer;transition:all .15s;';
    if (em === flProfileAvatar) { b.style.borderColor = 'var(--primary)'; b.style.background = 'var(--primary-bg)'; b.style.transform = 'scale(1.08)'; }
    b.onclick = function(){ flProfileAvatar = em; flRenderProfileAvatarPicker(); };
    box.appendChild(b);
  });
}
async function flDoUpdateProfile(){
  const token = flGetToken();
  const user = flGetUser();
  const newUsername = document.getElementById('flProfileUsername').value.trim().toLowerCase();
  const nickname = document.getElementById('flProfileNickname').value.trim();
  const gender = flProfileGender;
  const birthday = document.getElementById('flProfileBirthday').value;
  const province = document.getElementById('flProfileProvince').value;
  if (!nickname) { showToast('⚠️ 昵称不能为空'); return; }
  if (!/^[a-zA-Z0-9]{3,20}$/.test(newUsername)) { showToast('⚠️ 用户名需3-20位字母或数字'); return; }
  try {
    // 先检查用户名是否改了
    if (newUsername !== (user.username || '').toLowerCase()) {
      const res2 = await fetch(CLOUD_API + '/update-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newUsername })
      });
      const result2 = await res2.json();
      if (!result2.ok) {
        if (flIsAuthExpired(result2)) { flHandleTokenExpired(result2.msg); }
        else { showToast('❌ ' + (result2.msg || '用户名修改失败')); }
        return;
      }
      if (result2.ok && result2.user) {
        flSetAuth(token, result2.user);
      }
    }
    const res = await fetch(CLOUD_API + '/update-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, nickname, avatar: flProfileAvatar, gender, birthday, province, rainbow_name: flRainbowEnabled })
    });
    const result = await res.json();
    if (result.ok && result.user) {
      flSetAuth(token, result.user);
      // 从云端返回的 user 里读取扩展资料（如果后端保存了）
      const u = result.user;
      lsSet('profile_gender', u.gender || gender);
      lsSet('profile_birthday', u.birthday || birthday);
      lsSet('profile_province', u.province || province);
      lsSet('rainbow_name', flRainbowEnabled);
      flCloseProfileModal();
      flRenderCloudSection();
      flRefreshHomeAccountBtn();
      showToast('✅ 资料已更新');
    } else {
      if (flIsAuthExpired(result)) {
        flHandleTokenExpired(result.msg);
      } else {
        showToast('❌ ' + (result.msg || '更新失败'));
      }
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}

// ===== 工具函数 =====
function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== 本地账号表单（保留原有逻辑） =====
// ===== 新建/编辑账号弹窗 =====
function flOpenNewAccountModal(){
  flEditingId = null;
  flPickedAvatar = '😀';
  document.getElementById('flNewAccountTitle').textContent = '✨ 新建本地账号';
  document.getElementById('flNewName').value = '';
  document.getElementById('flNewName').placeholder = '给账号起个名字（≤12字）';
  document.getElementById('flNewAccountSubmit').textContent = '➕ 创建新账号';
  flRenderAvatarPicker();
  const m = document.getElementById('flNewAccountModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
}
function flCloseNewAccountModal(){
  const m = document.getElementById('flNewAccountModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}
function flResetForm(){
  flEditingId = null;
  flPickedAvatar = '😀';
  flRenderAvatarPicker();
}
function flEditAccount(id){
  const list = window.__fl.getAccounts();
  const acc = list.find(a=>a.id===id);
  if(!acc) return;
  flEditingId = id;
  flPickedAvatar = acc.avatar;
  document.getElementById('flNewAccountTitle').textContent = '✏️ 编辑账号';
  document.getElementById('flNewName').value = acc.name;
  document.getElementById('flNewName').placeholder = '修改账号名字（≤12字）';
  document.getElementById('flNewAccountSubmit').textContent = '💾 保存修改';
  flRenderAvatarPicker();
  const m = document.getElementById('flNewAccountModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
  document.getElementById('flNewName').focus();
}
function fmtDate(ts){ const d=new Date(ts); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function fmtActive(ts){
  const diff = Date.now() - ts;
  const m = Math.floor(diff/60000), h = Math.floor(m/60), d = Math.floor(h/24);
  if(d>0) return d+'天前'; if(h>0) return h+'小时前'; if(m>0) return m+'分钟前'; return '刚刚';
}
function flRenderAvatarPicker(){
  const box = document.getElementById('flAvatarPicker');
  box.innerHTML = '';
  FL_AVATARS.forEach(em=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = em;
    b.style.cssText = 'width:38px;height:38px;font-size:20px;border-radius:10px;border:1px solid var(--border-color);background:var(--bg-input);cursor:pointer;transition:all .15s;';
    if(em===flPickedAvatar){ b.style.borderColor='var(--primary)'; b.style.background='var(--primary-bg)'; b.style.transform='scale(1.08)'; }
    b.onclick = function(){ flPickedAvatar = em; flRenderAvatarPicker(); };
    box.appendChild(b);
  });
}
function flRenderAccountList(){
  const list = window.__fl.getAccounts();
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  const box = document.getElementById('flAccountList');
  box.innerHTML = '';
  list.forEach(acc=>{
    const isCur = acc.id === curId;
    const card = document.createElement('div');
    card.style.cssText = 'display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;border:1.5px solid ' + (isCur ? 'var(--primary)' : 'var(--border-color)') + ';background:' + (isCur ? 'var(--primary-bg)' : 'var(--bg-input)') + ';';
    card.innerHTML =
      '<div style="font-size:32px;flex-shrink:0;">' + acc.avatar + '</div>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="font-size:15px;font-weight:600;display:flex;align-items:center;gap:6px;">' +
          '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + flNameHtml(acc.name) + '</span>' +
          (isCur ? '<span style="font-size:10px;background:var(--primary);color:#fff;padding:2px 6px;border-radius:8px;">使用中</span>' : '') +
          (acc.cloudAccount ? '<span style="font-size:10px;background:#10b981;color:#fff;padding:2px 6px;border-radius:8px;">☁️云</span>' : '') +
        '</div>' +
        '<div style="font-size:11px;color:var(--text-secondary);margin-top:3px;">💰' + (acc.coin||0) + ' · 创建于 ' + fmtDate(acc.createdAt) + ' · 活跃：' + fmtActive(acc.lastActive) + '</div>' +
      '</div>';
    const ops = document.createElement('div');
    ops.style.cssText = 'display:flex;flex-direction:column;gap:6px;flex-shrink:0;';
    if(!isCur){
      const sw = document.createElement('button');
      sw.textContent = '切换';
      sw.style.cssText = 'padding:6px 12px;border:none;border-radius:8px;background:var(--primary);color:#fff;font-size:12px;cursor:pointer;';
      sw.onclick = function(){ flSwitchAccount(acc.id); };
      ops.appendChild(sw);
      const del = document.createElement('button');
      del.textContent = '删除';
      del.style.cssText = 'padding:6px 12px;border:none;border-radius:8px;background:#fee2e2;color:#dc2626;font-size:12px;cursor:pointer;transition:all .15s;';
      del.onclick = function(){ flDeleteAccount(acc.id); };
      ops.appendChild(del);
    } else {
      const edit = document.createElement('button');
      edit.textContent = '修改';
      edit.style.cssText = 'padding:6px 12px;border:none;border-radius:8px;background:var(--bg-input);color:var(--text-main);font-size:12px;cursor:pointer;border:1px solid var(--border-color);';
      edit.onclick = function(){ flEditAccount(acc.id); };
      ops.appendChild(edit);
      if (!acc.cloudAccount) {
        const bindBtn = document.createElement('button');
        bindBtn.textContent = '分享';
        bindBtn.style.cssText = 'padding:6px 12px;border:none;border-radius:8px;background:#6366f1;color:#fff;font-size:12px;cursor:pointer;';
        bindBtn.onclick = function(){ flShareAccount(acc.id); };
        ops.appendChild(bindBtn);
      } else {
        // 已绑定云端账号
        const cloudBtn = document.createElement('button');
        cloudBtn.textContent = '☁️云';
        cloudBtn.style.cssText = 'padding:6px 12px;border:none;border-radius:8px;background:#10b981;color:#fff;font-size:12px;cursor:pointer;line-height:1;';
        cloudBtn.onclick = function(){ flShareAccount(acc.id); };
        ops.appendChild(cloudBtn);
      }
    }
    card.appendChild(ops);
    box.appendChild(card);
  });
}
function flSwitchAccount(id){
  const list = window.__fl.getAccounts();
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  if(id === curId) return;
  showToast('🔄 正在切换账号...');
  const save = window.__fl.packRoot();
  const oldAcc = list.find(a=>a.id===curId);
  if(oldAcc){
    oldAcc.coin = window.__fl.coinFromSave(save);
    oldAcc.lastActive = Date.now();
    try{ localStorage.setItem(window.__fl.SAVE_PRE + curId, JSON.stringify(save)); }catch(e){}
  }
  localStorage.setItem(window.__fl.CUR_KEY, id);
  let newSave = {};
  try{ newSave = JSON.parse(localStorage.getItem(window.__fl.SAVE_PRE + id) || '{}'); }catch(e){ newSave={}; }
  window.__fl.unpackRoot(newSave);
  const newAcc = list.find(a=>a.id===id);
  if(newAcc){ newAcc.lastActive = Date.now(); newAcc.coin = window.__fl.coinFromSave(newSave); }
  window.__fl.setAccounts(list);
  setTimeout(function(){ location.reload(); }, 500);
}
async function flDeleteAccount(id){
  const list = window.__fl.getAccounts();
  if(list.length <= 1){ showToast('⚠️ 至少需要保留一个账号，不能删除。'); return; }
  const acc = list.find(a=>a.id===id);
  if(!acc) return;
  const ok = await flConfirm('确定要删除账号「' + acc.name + '」吗？\n该账号的所有存档将无法恢复！');
  if(!ok) return;
  localStorage.removeItem(window.__fl.SAVE_PRE + id);
  const newList = list.filter(a=>a.id!==id);
  window.__fl.setAccounts(newList);
  showToast('🗑️ 已删除账号：' + acc.name);
  flRenderAccountList();
}
function flCreateAccount(){
  const nameInput = document.getElementById('flNewName');
  const name = (nameInput.value || '').trim();
  if(!name){ showToast('⚠️ 请输入账号名字'); return; }
  const list = window.__fl.getAccounts();
  if(flEditingId){
    const acc = list.find(a=>a.id===flEditingId);
    if(!acc){ showToast('⚠️ 账号不存在'); return; }
    acc.name = name;
    acc.avatar = flPickedAvatar;
    window.__fl.setAccounts(list);
    showToast('✅ 账号资料已修改');
    flCloseNewAccountModal();
    flResetForm();
    flRenderAccountList();
    flRefreshHomeAccountBtn();
    return;
  }
  // 限制本地账号最多3个
  const localCount = list.filter(a => !a.cloudAccount).length;
  if (localCount >= 3) {
    showToast('⚠️ 最多只能创建3个本地账号');
    flCloseNewAccountModal();
    return;
  }
  flCloseNewAccountModal();
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  const save = window.__fl.packRoot();
  const oldAcc = list.find(a=>a.id===curId);
  if(oldAcc){
    oldAcc.coin = window.__fl.coinFromSave(save);
    oldAcc.lastActive = Date.now();
    try{ localStorage.setItem(window.__fl.SAVE_PRE + curId, JSON.stringify(save)); }catch(e){}
  }
  const newId = window.__fl.genId();
  list.push({ id:newId, name:name, avatar:flPickedAvatar, createdAt:Date.now(), lastActive:Date.now(), coin:100, cloudCode:null, cloudTime:0 });
  try{ localStorage.setItem(window.__fl.SAVE_PRE + newId, JSON.stringify({})); }catch(e){}
  window.__fl.setAccounts(list);
  localStorage.setItem(window.__fl.CUR_KEY, newId);
  window.__fl.unpackRoot({});
  showToast('🎉 已创建并切换到新账号：' + name);
  setTimeout(function(){ location.reload(); }, 700);
}

// ===== 存档码功能（保留） =====
async function flOpenExportCodeModal(){
  const ok = await flConfirm('📤 存档码分享给他人后，他人可游玩你的存档，确定继续吗？');
  if (!ok) return;
  const targetId = await flSelectAccount('选择要生成存档码的账号');
  if (!targetId) return;
  await flCloudUpload(targetId);
}
// 账号卡片上的分享按钮
async function flShareAccount(accId){
  const list = window.__fl.getAccounts();
  const acc = list.find(a => a.id === accId);
  if (!acc) return;
  // 检查存档码是否超过30分钟
  if (acc.cloudCode && acc.cloudTime) {
    const THIRTY_MIN = 30 * 60 * 1000;
    if (Date.now() - acc.cloudTime > THIRTY_MIN) {
      // 已过期，清除存档码
      acc.cloudCode = null;
      acc.cloudTime = 0;
      window.__fl.setAccounts(list);
    }
  }
  // 已有存档码，直接显示
  if (acc.cloudCode) {
    flShowCodeModal(acc.cloudCode);
    return;
  }
  // 没有存档码，弹确认后生成
  const ok = await flConfirm('你确定要分享该存档给其他人使用吗？');
  if (!ok) return;
  await flCloudUpload(accId);
}
// 存档码展示弹窗
function flShowCodeModal(code){
  document.getElementById('flCodeDisplay').textContent = code;
  const m = document.getElementById('flCodeModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
}
function flCloseCodeModal(){
  const m = document.getElementById('flCodeModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}
function flCopyCode(){
  const code = document.getElementById('flCodeDisplay').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(code).then(()=>{
      showToast('✅ 已复制：' + code);
    }).catch(()=>{
      // 降级方案
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✅ 已复制：' + code);
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('✅ 已复制：' + code);
  }
}
async function flCloudUpload(targetId) {
  const curId = localStorage.getItem(window.__fl.CUR_KEY);
  const list = window.__fl.getAccounts();
  const acc = list.find(a => a.id === (targetId || curId));
  if (!acc) return;
  showToast('☁️ 正在生成存档码...');
  // 如果选的不是当前账号，用该账号的快照数据
  let saveData;
  if (targetId && targetId !== curId) {
    try { saveData = JSON.parse(localStorage.getItem(window.__fl.SAVE_PRE + targetId) || '{}'); } catch(e){ saveData = {}; }
  } else {
    saveData = window.__fl.packRoot();
  }
  try {
    const res = await fetch(CLOUD_API + '/create-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: acc.cloudCode || null, data: saveData })
    });
    const result = await res.json();
    if (result.ok && result.code) {
      acc.cloudCode = result.code;
      acc.cloudTime = Date.now();
      acc.coin = window.__fl.coinFromSave(saveData);
      window.__fl.setAccounts(list);
      flRenderAccountList();
      flRefreshHomeAccountBtn();
      // 弹出存档码窗口
      flShowCodeModal(result.code);
    } else {
      showToast('❌ 上传失败：' + (result.msg || '未知错误'));
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}
async function flCloudDownload(code) {
  const inputCode = (code || '').trim().toUpperCase();
  if (!inputCode) { showToast('⚠️ 请输入存档码'); return; }
  showToast('☁️ 正在下载存档...');
  try {
    const res = await fetch(CLOUD_API + '/get-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inputCode })
    });
    const result = await res.json();
    if (result.ok && result.data) {
      const list = window.__fl.getAccounts();
      const exist = list.find(a => a.cloudCode === inputCode);
      if (exist) {
        exist.cloudTime = Date.now();
        exist.coin = window.__fl.coinFromSave(result.data);
        window.__fl.setAccounts(list);
        try { localStorage.setItem(window.__fl.SAVE_PRE + exist.id, JSON.stringify(result.data)); } catch(e){}
        showToast('✅ 存档已更新：' + exist.name);
      } else {
        const newId = window.__fl.genId();
        list.push({
          id: newId, name: '存档码 ' + inputCode, avatar: '☁️',
          createdAt: Date.now(), lastActive: Date.now(),
          coin: window.__fl.coinFromSave(result.data),
          cloudCode: inputCode, cloudTime: Date.now()
        });
        window.__fl.setAccounts(list);
        try { localStorage.setItem(window.__fl.SAVE_PRE + newId, JSON.stringify(result.data)); } catch(e){}
        showToast('✅ 存档已导入为新账号');
      }
      flRenderAccountList();
      flRefreshHomeAccountBtn();
    } else {
      showToast('❌ 下载失败：' + (result.msg || '存档码不存在'));
    }
  } catch (e) {
    showToast('❌ 网络错误：' + e.message);
  }
}
function flOpenCloudImportModal() {
  document.getElementById('flImportCode').value = '';
  const m = document.getElementById('flImportModal');
  m.classList.remove('closing');
  m.style.display = 'flex';
  m.style.alignItems = 'center';
  m.style.justifyContent = 'center';
  setTimeout(()=>{ document.getElementById('flImportCode').focus(); }, 100);
}
function flCloseImportModal(){
  const m = document.getElementById('flImportModal');
  m.classList.add('closing');
  setTimeout(()=>{ m.style.display='none'; m.classList.remove('closing'); }, 200);
}
function flDoImport(){
  const code = document.getElementById('flImportCode').value;
  if (!code || !code.trim()) { showToast('⚠️ 请输入存档码'); return; }
  flCloseImportModal();
  flCloudDownload(code);
}

// ===== 首页按钮更新 =====
function flRefreshHomeAccountBtn(){
  // 按钮文字固定，不随登录状态变化
}

// ===== 弹窗遮罩关闭 =====
// 弹窗遮罩不点击关闭，只能点✕按钮关闭

// ===== 页面加载时自动同步（如果已登录，静默模式，失败不提示） =====
function flInitializeAccountModule(){
  flRefreshHomeAccountBtn();
  flUpdateLastSyncDisplay();
  flUpdateAutoSyncLabel();
  // 已登录时启动自动同步
  if (flGetToken()) {
    flStartAutoSync();
    setTimeout(function(){ flCloudSyncLoad(true); }, 1500);
  }
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded', flInitializeAccountModule, {once:true});
}else{
  flInitializeAccountModule();
}
window.addEventListener('load', flRefreshHomeAccountBtn);

// ===== 页面前自动上传存档（如果已登录） =====
window.addEventListener('beforeunload', function(){
  const token = flGetToken();
  if (!token) return;
  const saveData = window.__fl.packRoot();
  // 用 sendBeacon 保证页面关闭时也能发送
  const blob = new Blob([JSON.stringify({ token, data: flCompressSave(saveData) })], { type: 'application/json' });
  try { navigator.sendBeacon(CLOUD_API + '/save', blob); } catch(e) {}
});
