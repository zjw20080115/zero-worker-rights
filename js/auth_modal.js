// js/auth_modal.js

// 1. 后端 API 地址
const AUTH_API_URL = 'http://10.72.39.141:8080/api/auth';

// ⭐ 通用居中提示弹窗
function showCenterToast(message, type = 'info') {
    const existing = document.getElementById('centerToast');
    if (existing) existing.remove();

    let iconColor = '#1e5a8a';
    let iconSvg = '';
    if (type === 'success') {
        iconColor = '#34a853';
        iconSvg = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        iconColor = '#dc3545';
        iconSvg = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    } else {
        iconSvg = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }

    const toast = document.createElement('div');
    toast.id = 'centerToast';
    toast.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 99999; display: flex; justify-content: center; align-items: center;">
            <div style="background: white; width: 90%; max-width: 360px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); padding: 35px 30px; text-align: center; animation: modalFadeIn 0.3s ease;">
                <div style="width: 60px; height: 60px; background: ${type === 'success' ? '#e6f4ea' : type === 'error' ? '#fdecea' : '#eef4f9'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;">
                    ${iconSvg}
                </div>
                <p style="font-size: 16px; color: #1e293b; font-weight: 600; margin-bottom: 22px; word-wrap: break-word; line-height: 1.5;">${message}</p>
                <button onclick="document.getElementById('centerToast').remove()" style="width: 100%; padding: 11px; background: #1e5a8a; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">
                    确定
                </button>
            </div>
        </div>
        <style>@keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }</style>
    `;
    document.body.appendChild(toast);
}

// ⭐ 通用居中确认弹窗
function showCenterConfirm(message, onConfirm) {
    const existing = document.getElementById('centerConfirm');
    if (existing) existing.remove();

    const confirmBox = document.createElement('div');
    confirmBox.id = 'centerConfirm';
    confirmBox.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 99999; display: flex; justify-content: center; align-items: center;">
            <div style="background: white; width: 90%; max-width: 360px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); padding: 35px 30px; text-align: center; animation: modalFadeIn 0.3s ease;">
                <div style="width: 60px; height: 60px; background: #eef4f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1e5a8a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <p style="font-size: 16px; color: #1e293b; font-weight: 600; margin-bottom: 22px; line-height: 1.5;">${message}</p>
                <div style="display: flex; gap: 10px;">
                    <button onclick="document.getElementById('centerConfirm').remove()" style="flex: 1; padding: 11px; background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">取消</button>
                    <button id="centerConfirmOk" style="flex: 1; padding: 11px; background: #dc3545; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;">确定</button>
                </div>
            </div>
        </div>
        <style>@keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }</style>
    `;
    document.body.appendChild(confirmBox);

    document.getElementById('centerConfirmOk').onclick = function() {
        confirmBox.remove();
        if (onConfirm) onConfirm();
    };
}

// ⭐ 检查是否已登录
function checkLogin() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        showCenterToast("请先登录后再操作", "info");
        setTimeout(() => openAuthModal(), 700);
        return false;
    }
    return true;
}

// ⭐ 跳转发帖页（需要登录）
function goPublish() {
    if (!checkLogin()) return;
    window.location.href = "publish.html";
}

// 2. 打开登录弹窗
function openAuthModal() {
    document.getElementById('authModal').style.display = 'flex';
    switchAuthTab('login');
}

// 3. 关闭登录弹窗
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

// 4. 切换登录/注册
function switchAuthTab(type) {
    if (type === 'login') {
        document.getElementById('modalTabLogin').classList.add('active');
        document.getElementById('modalTabRegister').classList.remove('active');
        document.getElementById('modalLoginForm').classList.remove('hidden');
        document.getElementById('modalRegisterForm').classList.add('hidden');
    } else {
        document.getElementById('modalTabRegister').classList.add('active');
        document.getElementById('modalTabLogin').classList.remove('active');
        document.getElementById('modalRegisterForm').classList.remove('hidden');
        document.getElementById('modalLoginForm').classList.add('hidden');
    }
}

// 5. 点击遮罩层关闭弹窗（空值保护）
const authModalEl = document.getElementById('authModal');
if (authModalEl) {
    authModalEl.addEventListener('click', function(e) {
        if (e.target === this) closeAuthModal();
    });
}

// 6. 登录
const loginFormEl = document.getElementById('modalLoginForm');
if (loginFormEl) {
    loginFormEl.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('modalLoginUsername').value.trim();
        const password = document.getElementById('modalLoginPassword').value.trim();

        try {
            const response = await fetch(`${AUTH_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            console.log("登录接口返回：", result);

            if (result.code === 200) {
                const userData = result.data;
                localStorage.setItem('userId', userData.userId);
                localStorage.setItem('username', userData.username);
                localStorage.setItem('nickname', userData.nickname);
                if (userData.token) {
                    localStorage.setItem('token', userData.token);
                }

                closeAuthModal();
                showCenterToast("登录成功！", "success");
                setTimeout(() => location.reload(), 900);
            } else {
                showCenterToast(result.message || "登录失败", "error");
            }
        } catch (error) {
            console.error("登录出错:", error);
            showCenterToast("网络错误，无法连接到后端", "error");
        }
    });
}

// 7. 注册
const registerFormEl = document.getElementById('modalRegisterForm');
if (registerFormEl) {
    registerFormEl.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('modalRegUsername').value.trim();
        const password = document.getElementById('modalRegPassword').value.trim();
        const nickname = document.getElementById('modalRegNickname').value.trim();

        try {
            const response = await fetch(`${AUTH_API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, nickname })
            });

            const text = await response.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                result = { code: response.ok ? 200 : 400, message: text };
            }

            if (response.ok && (result.code === 200 || result.code === undefined)) {
                showCenterToast(result.message || "注册成功！请登录。", "success");
                setTimeout(() => switchAuthTab('login'), 900);
            } else {
                showCenterToast(result.message || "注册失败", "error");
            }
        } catch (error) {
            console.error("注册出错:", error);
            showCenterToast("网络错误，无法连接到后端", "error");
        }
    });
}

// 8. 退出登录
function logout() {
    showCenterConfirm("确定要退出登录吗？", function() {
        localStorage.removeItem('userId');
        localStorage.removeItem('nickname');
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        location.reload();
    });
}

// 9. 更新顶部用户区域
function updateUserArea() {
    const userArea = document.getElementById('userArea');
    if (!userArea) return;

    const userId = localStorage.getItem('userId');
    const nickname = localStorage.getItem('nickname');

    if (userId && nickname) {
        userArea.innerHTML = `
            <span class="user-info">欢迎，<b>${nickname}</b></span>
            <span class="logout-btn" onclick="logout()">退出登录</span>
        `;
    } else {
        userArea.innerHTML = `<span class="login-btn" onclick="openAuthModal()">登录/注册</span>`;
    }
}

// ============================================================
// 10. 导航头像统一处理（修复全站 404：不再依赖 default-avatar.png）
// ============================================================

/* 把存储的头像路径转换为当前页面层级可用的相对路径：
 *   根目录页面 -> images/avatars/a4.jpg
 *   pages/ 页面 -> ../images/avatars/a4.jpg
 * data: 开头（旧版上传的 Base64 头像）原样返回 */
function normalizeAvatarPath(savedPath) {
    if (!savedPath) return '';
    if (savedPath.indexOf('data:') === 0) return savedPath;
    var isSubPage = window.location.pathname.indexOf('/pages/') !== -1;
    var p = savedPath;
    if (p.charAt(0) === '/') p = p.substring(1); // 去掉前导斜杠，统一成相对形式
    if (isSubPage) {
        return p.indexOf('../') === 0 ? p : '../' + p;
    }
    return p;
}

/* 默认灰色圆形占位头像（内联 SVG，不发任何网络请求） */
function getDefaultAvatarDataUri() {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
        '<circle cx="48" cy="48" r="48" fill="#cccccc"/>' +
        '<text x="48" y="48" text-anchor="middle" dominant-baseline="central" font-size="40" fill="#ffffff">空</text>' +
        '</svg>'
    );
}

/* 更新导航栏头像：
 *   - #nav-avatar 元素不存在时自动创建（插在 userArea 之后）
 *   - 有存储（userAvatar 优先，兼容 avatarUrl）就显示存储头像（路径按层级修正）
 *   - 没有存储就显示原生灰色圆圈占位 */
function updateNavAvatar() {
    var userArea = document.getElementById('userArea');
    if (!userArea || !userArea.parentNode) return;

    var navAvatarEl = document.getElementById('nav-avatar');
    if (!navAvatarEl) {
        navAvatarEl = document.createElement('img');
        navAvatarEl.id = 'nav-avatar';
        navAvatarEl.alt = '头像';
        navAvatarEl.style.width = '36px';
        navAvatarEl.style.height = '36px';
        navAvatarEl.style.borderRadius = '50%';
        navAvatarEl.style.objectFit = 'cover';
        navAvatarEl.style.cursor = 'pointer';
        navAvatarEl.style.border = '2px solid rgba(255,255,255,0.3)';
        navAvatarEl.style.marginLeft = '20px';
        userArea.parentNode.insertBefore(navAvatarEl, userArea.nextSibling);
    }

    var savedAvatar = localStorage.getItem('userAvatar') || localStorage.getItem('avatarUrl');
    navAvatarEl.src = savedAvatar ? normalizeAvatarPath(savedAvatar) : getDefaultAvatarDataUri();
}

// 脚本在 body 底部执行，DOM 已就绪，立即更新一次（保证早于 nav_avatar.js 运行）
updateNavAvatar();

// 11. 页面加载时再更新一次（用户区渲染 + 头像同步）
document.addEventListener('DOMContentLoaded', function() {
    updateUserArea();
    updateNavAvatar();
});