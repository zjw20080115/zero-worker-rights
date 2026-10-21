/* ============================================================
 * 零工权益助手 —— 个人信息页（js/profile.js）
 *
 * 布局：卡片仪表盘（左个人信息卡 + 右我的帖子）。
 * 权益记录展示已迁移至权益自测页（test.html 右侧面板，
 * 渲染/展开/删除逻辑见 js/test.js 第 11 节）。
 *
 * 功能：
 *   1. 头像修改（拍摄占位 / 相册选择 + 本地预览 + localStorage 持久化）
 *   2. 用户名修改（真实接口 PUT /api/auth/user/update）
 *   3. 修改密码（真实接口 PUT /api/auth/user/password）
 *   4. 提出建议（真实接口 POST /api/suggestions）
 *   5. 退出登录 / 登录注册切换按钮
 *
 * 说明：
 *   - 全程不使用原生 alert，统一走 auth_modal.js 的
 *     showCenterToast / showCenterConfirm。
 * ============================================================ */

/* ---------- 1. DOM 元素引用 ---------- */
const avatarImg = document.getElementById('user-avatar');
const avatarInput = document.getElementById('avatar-input');
const avatarModal = document.getElementById('avatar-modal');
const avatarShootBtn = document.getElementById('avatar-shoot-btn');
const avatarAlbumBtn = document.getElementById('avatar-album-btn');
const avatarCancelBtn = document.getElementById('avatar-cancel-btn');
const userNameDisplay = document.getElementById('user-name-display');
const editUsernameModal = document.getElementById('edit-username-modal');
const newUsernameInput = document.getElementById('new-username');
const editUsernameConfirm = document.getElementById('edit-username-confirm');
const editUsernameCancel = document.getElementById('edit-username-cancel');
const changePwdBtn = document.getElementById('change-pwd-btn');
const editPasswordModal = document.getElementById('edit-password-modal');
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const oldPasswordInput = document.getElementById('old-password');
const editPasswordConfirm = document.getElementById('edit-password-confirm');
const editPasswordCancel = document.getElementById('edit-password-cancel');
const suggestionInput = document.getElementById('suggestion-input');
const suggestionSubmit = document.getElementById('suggestion-submit');

/* ---------- 2. 弹窗工具（auth_modal.js 提供，此处统一封装，不用原生 alert） ---------- */
function toast(message, type) {
    if (typeof window.showCenterToast === 'function') {
        window.showCenterToast(message, type || 'info');
    } else {
        console.warn('[profile.js] showCenterToast 不可用：', message);
    }
}
function confirmBox(message, onConfirm) {
    if (typeof window.showCenterConfirm === 'function') {
        window.showCenterConfirm(message, onConfirm);
    } else {
        console.warn('[profile.js] showCenterConfirm 不可用：', message);
    }
}

/* ---------- 3. 头像修改 ---------- */
function openAvatarModal() {
    avatarModal.style.display = 'flex';
}
function closeAvatarModal() {
    avatarModal.style.display = 'none';
}

// 点击头像：弹出选择弹窗（拍摄 / 从相册选择 / 取消）
avatarImg.addEventListener('click', openAvatarModal);

// 拍摄：模拟功能，暂未开放
avatarShootBtn.addEventListener('click', () => {
    toast('拍摄功能暂未开放', 'info');
});

// 从相册选择：触发隐藏的 file input
avatarAlbumBtn.addEventListener('click', () => {
    closeAvatarModal();
    avatarInput.click();
});
avatarCancelBtn.addEventListener('click', closeAvatarModal);

// 选择图片后：FileReader 转 Base64，本地预览 + 写入 localStorage
avatarInput.addEventListener('change', () => {
    const file = avatarInput.files && avatarInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        avatarImg.src = reader.result;
        // 存入 localStorage，供导航栏（index.js）等位置读取最新头像
        try {
            localStorage.setItem('avatarUrl', reader.result);
        } catch (e) {
            // 图片过大超出 localStorage 配额时仅做本地预览
            console.warn('[profile.js] 头像过大，无法存入 localStorage（仅本地预览）：', e);
        }
        toast('头像修改成功', 'success');
    };
    reader.readAsDataURL(file);
});

/* 默认头像加载失败时：替换为灰色圆形"空"占位图 */
function handleAvatarError() {
    avatarImg.src =
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">' +
                '<circle cx="60" cy="60" r="60" fill="#cccccc"/>' +
                '<text x="60" y="60" text-anchor="middle" dominant-baseline="central" font-size="48" fill="#ffffff">空</text>' +
                '</svg>'
        );
}
// 图片可能在脚本执行前就已加载失败（complete 且 naturalWidth 为 0）
if (avatarImg.complete && avatarImg.naturalWidth === 0) {
    handleAvatarError();
}
avatarImg.addEventListener('error', handleAvatarError);

/* ---------- 4. 用户名修改（弹窗 + 防 XSS + 真实接口） ---------- */
/* 修改昵称接口（username 不可修改，只更新 nickname） */
const UPDATE_USER_API_URL = 'http://10.72.39.141:8080/api/auth/user/update';

function openEditUsernameModal() {
    newUsernameInput.value =
        userNameDisplay.textContent === '未登录' ? '' : userNameDisplay.textContent;
    editUsernameModal.style.display = 'flex';
}
function closeEditUsernameModal() {
    editUsernameModal.style.display = 'none';
}

userNameDisplay.addEventListener('click', openEditUsernameModal);
editUsernameCancel.addEventListener('click', closeEditUsernameModal);

editUsernameConfirm.addEventListener('click', async () => {
    const rawName = newUsernameInput.value.trim();
    if (!rawName) {
        toast('请输入新的用户名', 'info');
        return;
    }

    // 防 XSS：过滤 HTML 敏感字符。
    // 重要：auth_modal.js 的 updateUserArea 用 innerHTML 渲染 nickname，
    // 不过滤的话，恶意输入（如 <img onerror=...>）会被当成 HTML 执行
    const safeName = rawName.replace(/[<>"'&\\/]/g, '').trim();
    if (!safeName) {
        toast('用户名包含非法字符，请重新输入', 'error');
        return;
    }

    const userId = Number(localStorage.getItem('userId')) || 1;

    // 防重复提交
    editUsernameConfirm.disabled = true;
    editUsernameConfirm.textContent = '提交中...';

    try {
        const res = await fetch(UPDATE_USER_API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, nickname: safeName }),
        });
        // 后端返回纯文本（如"修改成功！"）
        const replyText = await res.text();
        console.log('[profile.js] 修改昵称返回：', res.status, replyText);

        if (res.ok && replyText.includes('成功')) {
            // 只更新 nickname（username 不可修改）
            localStorage.setItem('nickname', safeName);
            closeEditUsernameModal();
            toast('修改成功！', 'success');
            // 延迟 1 秒刷新，让顶部导航栏欢迎语同步更新
            setTimeout(() => location.reload(), 1000);
        } else {
            toast(replyText || '修改失败，请稍后重试', 'error');
        }
    } catch (err) {
        console.error('[profile.js] 修改昵称请求失败：', err);
        toast('修改失败，请检查网络或查看F12报错', 'error');
    } finally {
        editUsernameConfirm.disabled = false;
        editUsernameConfirm.textContent = '确认修改';
    }
});

/* ---------- 4.5 修改密码（真实接口，旧密码校验 + 纯文本返回处理） ---------- */
/* 修改密码接口 */
const UPDATE_PASSWORD_API_URL = 'http://10.72.39.141:8080/api/auth/user/password';

changePwdBtn.addEventListener('click', () => {
    oldPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';
    editPasswordModal.style.display = 'flex';
});
editPasswordCancel.addEventListener('click', () => {
    editPasswordModal.style.display = 'none';
});

editPasswordConfirm.addEventListener('click', async () => {
    const oldPwd = oldPasswordInput.value;
    const newPwd = newPasswordInput.value;
    const confirmPwd = confirmPasswordInput.value;

    // 前端校验一：长度不小于 6 位
    if (newPwd.length < 6) {
        toast('密码长度不能少于 6 位', 'error');
        return;
    }
    // 前端校验二：两次新密码一致
    if (newPwd !== confirmPwd) {
        toast('两次输入的密码不一致', 'error');
        return;
    }

    const userId = Number(localStorage.getItem('userId')) || 1;

    // 防重复提交
    editPasswordConfirm.disabled = true;
    editPasswordConfirm.textContent = '提交中...';

    try {
        const res = await fetch(UPDATE_PASSWORD_API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, oldPassword: oldPwd, newPassword: newPwd }),
        });
        // 后端返回纯文本（"修改成功！"/"旧密码错误！"等）
        const replyText = await res.text();
        console.log('[profile.js] 修改密码返回：', res.status, replyText);

        if (res.ok && replyText.includes('成功')) {
            toast('密码修改成功！', 'success');
            // 关闭弹窗并清空表单
            oldPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';
            editPasswordModal.style.display = 'none';
        } else {
            // 400/500 或"旧密码错误！"等业务错误：显示后端返回的文本
            toast(replyText || '修改失败，请稍后重试', 'error');
        }
    } catch (err) {
        console.error('[profile.js] 修改密码请求失败：', err);
        toast('修改失败，请检查网络或查看F12报错', 'error');
    } finally {
        editPasswordConfirm.disabled = false;
        editPasswordConfirm.textContent = '确认修改';
    }
});

/* ---------- 5. 提出建议（真实接口提交） ---------- */
const SUGGESTION_API_URL = 'http://10.72.39.141:8080/api/suggestions';

suggestionSubmit.addEventListener('click', async () => {
    const content = suggestionInput.value.trim();

    // 空内容校验
    if (!content) {
        toast('请先输入您的建议', 'info');
        return;
    }

    // 组装请求体：userId 优先取登录态，为空时先用默认值 1 兜底
    // TODO 登录功能完善后：未登录时应先引导登录，而不是默认 1
    const userId = Number(localStorage.getItem('userId')) || 1;

    // 禁用按钮并改为"提交中..."，防止重复点击
    suggestionSubmit.disabled = true;
    suggestionSubmit.textContent = '提交中...';

    try {
        const res = await fetch(SUGGESTION_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, content: content }),
        });

        // 尝试解析返回 JSON（后端非 JSON 响应时给默认空对象）
        let result;
        try {
            result = await res.json();
        } catch (e) {
            result = { code: res.status, message: '' };
        }

        // 成功判断：状态码 2xx 且业务 code === 200
        if (res.ok && result.code === 200) {
            suggestionInput.value = '';
            toast('感谢您的建议，我们会认真考虑！', 'success');
        } else {
            // 状态码非 2xx 或业务 code 非 200：展示后端 message
            toast(result.message || '提交失败，请稍后重试', 'error');
        }
    } catch (err) {
        // 网络容错：控制台报错 + 弹窗提示
        console.error('[profile.js] 提交建议失败：', err);
        toast('提交失败，请检查网络或查看F12报错', 'error');
    } finally {
        // 恢复按钮状态
        suggestionSubmit.disabled = false;
        suggestionSubmit.textContent = '提交建议';
    }
});

/* ---------- 6. 初始用户名展示 ---------- */
(function initUserName() {
    const nickname = localStorage.getItem('nickname');
    const username = localStorage.getItem('username');
    userNameDisplay.textContent = nickname || username || '未登录';
})();

/* ---------- 7. 登录态按钮：已登录 → "退出登录"；未登录 → "立即登录/注册" ---------- */
(function initAuthButton() {
    const authBtn = document.getElementById('profile-auth-btn');
    if (!authBtn) return;
    const userId = localStorage.getItem('userId');

    if (userId) {
        authBtn.textContent = '退出登录';
        authBtn.classList.remove('login-mode');
        authBtn.addEventListener('click', () => {
            if (typeof window.logout === 'function') {
                window.logout();
            }
        });
    } else {
        authBtn.textContent = '立即登录/注册';
        authBtn.classList.add('login-mode');
        authBtn.addEventListener('click', () => {
            if (typeof window.openAuthModal === 'function') {
                window.openAuthModal();
            }
        });
    }
})();

/* ============================================================
 * 8. 我的帖子（真实接口）
 * ============================================================ */

const POSTS_API_BASE = 'http://10.72.39.141:8080/api/posts';
const myPostsList = document.getElementById('my-posts-list');
let myPosts = [];

/* 转义 HTML，防止后端返回的文本被当成标签渲染 */
function escapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/* 时间格式化：2026-10-05T15:28:13 -> 2026-10-05 15:28 */
function formatPostTime(timeStr) {
    if (!timeStr) return '';
    try {
        return timeStr.replace('T', ' ').substring(0, 16);
    } catch (e) {
        return timeStr;
    }
}

/* 渲染我的帖子卡片（复用权益记录的 record-card 风格） */
function renderMyPosts(posts) {
    if (!myPostsList) return;
    if (myPosts.length === 0) {
        myPostsList.innerHTML = '<p>暂无帖子，快去互助墙发帖吧！</p>';
        return;
    }
    myPostsList.innerHTML = myPosts
        .map((p) => {
            // 标签：优先 problemType，其次 category，都没有则不显示
            const categoryText = escapeHtml(p.problemType || p.category || '');
            const categoryBadge = categoryText
                ? `<span class="post-category-badge">${categoryText}</span>`
                : '';
            return `
        <div class="record-card post-clickable" data-id="${p.id}">
            <div class="card-header">
                <div class="post-title-wrap">
                    <span class="post-title">${escapeHtml(p.title || '无标题')}</span>
                    ${categoryBadge}
                </div>
                <span class="record-date">${formatPostTime(p.createTime)}</span>
            </div>
            <p class="record-desc">${escapeHtml(p.content || '')}</p>
            <div class="post-footer-row">
                <span>👤 ${escapeHtml(p.author || '匿名用户')}</span>
                <span>👍 ${p.likeCount || 0}</span>
                <span>💬 ${p.commentCount || 0}</span>
                <button class="delete-post-btn" data-id="${p.id}">删除</button>
            </div>
        </div>`;
        })
        .join('');
}

/* 拉取我的帖子（未登录时直接显示空状态，不发请求） */
async function loadMyPosts() {
    if (!myPostsList) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
        myPostsList.innerHTML = '<p>暂无帖子，快去互助墙发帖吧！</p>';
        return;
    }
    myPostsList.innerHTML = '<p>加载中...</p>';
    try {
        const res = await fetch(`${POSTS_API_BASE}/user/${userId}`, {
            cache: 'no-store', // 每次加载都强制走网络，保证数据最新
        });
        if (!res.ok) {
            throw new Error(`接口返回状态码 ${res.status}`);
        }
        const data = await res.json();
        myPosts = Array.isArray(data) ? data : [];
        renderMyPosts(myPosts);
    } catch (err) {
        console.error('[profile.js] 加载我的帖子失败：', err);
        myPostsList.innerHTML = '<p>暂无帖子，快去互助墙发帖吧！</p>';
    }
}

/* 删除帖子：确认 + DELETE + 刷新列表 */
async function deleteMyPost(postId, btn) {
    btn.disabled = true;
    try {
        const res = await fetch(`${POSTS_API_BASE}/${postId}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error(`接口返回状态码 ${res.status}`);
        }
        toast('删除成功', 'success');
        loadMyPosts();
    } catch (err) {
        console.error('[profile.js] 删除帖子失败：', err);
        toast('删除失败，请检查网络或查看F12报错', 'error');
    } finally {
        btn.disabled = false;
    }
}

/* 事件委托：删除按钮 + 整卡点击跳详情（动态卡片生效） */
if (myPostsList) {
    myPostsList.addEventListener('click', (e) => {
        // 分支一：删除按钮（第一行 stopPropagation，防止误触跳详情页）
        const delBtn = e.target.closest('.delete-post-btn');
        if (delBtn) {
            e.stopPropagation();
            const postId = delBtn.dataset.id;
            // 确认弹窗（走 auth_modal.js 的居中确认框，避免原生 confirm）
            confirmBox('确定要删除这篇帖子吗？', () => {
                deleteMyPost(postId, delBtn);
            });
            return;
        }

        // 分支二：点击卡片其他位置 -> 跳转帖子详情页查看评论
        const card = e.target.closest('.post-clickable');
        if (card) {
            window.location.href = 'pages/post_detail.html?id=' + card.dataset.id;
        }
    });
}

/* 页面加载：自动拉取我的帖子（权益记录已迁至自测页，这里独立运行） */
loadMyPosts();

/* ---------- 数据保鲜：页面重新可见时重新拉取 ---------- */
let lastPostsRefresh = 0;

/* 带节流的刷新：visibilitychange 与 pageshow 可能同时触发，2 秒内去重 */
function refreshMyPosts() {
    const now = Date.now();
    if (now - lastPostsRefresh < 2000) return;
    lastPostsRefresh = now;
    loadMyPosts();
}

/* 场景一：切换标签页 / 最小化后回到本页 */
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        refreshMyPosts();
    }
});

/* 场景二：从帖子详情页点击浏览器"返回"（bfcache 恢复，event.persisted 为 true） */
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        refreshMyPosts();
    }
});
