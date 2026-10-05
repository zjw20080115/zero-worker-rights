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

// ⭐ 通用居中确认弹窗（替代 confirm）
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

// 5. 点击遮罩层关闭弹窗
document.getElementById('authModal').addEventListener('click', function(e) {
    if (e.target === this) closeAuthModal();
});

// 6. 登录
document.getElementById('modalLoginForm').addEventListener('submit', async function(e) {
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

// 7. 注册
document.getElementById('modalRegisterForm').addEventListener('submit', async function(e) {
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

// 10. 页面加载时更新一次
document.addEventListener('DOMContentLoaded', updateUserArea);