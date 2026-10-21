/* ============================================================
 * 零工权益助手 —— 导航头像通用逻辑（js/nav_avatar.js）
 *
 * 供各页面共享（book.html / community.html 等子页面）：
 *   1. 默认头像缺失时用灰色圆形占位图兜底
 *   2. 读取 localStorage.avatarUrl（个人中心修改的头像）
 *   3. 点击头像打开 Lightbox 放大，点击遮罩关闭
 *
 * 注意：index.html 的头像逻辑在 js/index.js 中（功能相同），
 * 不要在同个页面同时引入本文件和 index.js 的这段逻辑。
 * ============================================================ */

const navAvatar = document.getElementById('nav-avatar');
const avatarLightbox = document.getElementById('avatar-lightbox');
const lightboxImg = document.getElementById('lightbox-img');

/* 头像兜底：默认图缺失时用灰色圆形占位图（带"空"字） */
function navAvatarFallback() {
    if (!navAvatar) return;
    navAvatar.src =
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
                '<circle cx="48" cy="48" r="48" fill="#cccccc"/>' +
                '<text x="48" y="48" text-anchor="middle" dominant-baseline="central" font-size="40" fill="#ffffff">空</text>' +
                '</svg>'
        );
}

/* 初始化：读取本地头像 + 绑定加载失败兜底 */
(function initNavAvatar() {
    if (!navAvatar) return;
    const savedAvatar = localStorage.getItem('userAvatar') || localStorage.getItem('avatarUrl');
    if (savedAvatar) {
        // 路径按页面层级修正（复用 auth_modal.js 的 normalizeAvatarPath，解决 pages/ 下 404）
        navAvatar.src =
            typeof normalizeAvatarPath === 'function'
                ? normalizeAvatarPath(savedAvatar)
                : savedAvatar;
    } else {
        navAvatarFallback();
    }
    // 图片可能在脚本执行前就已加载失败（complete 且 naturalWidth 为 0）
    if (navAvatar.complete && navAvatar.naturalWidth === 0) {
        navAvatarFallback();
    }
    navAvatar.addEventListener('error', navAvatarFallback);
})();

/* Lightbox：点击头像放大，点击遮罩关闭 */
if (navAvatar && avatarLightbox && lightboxImg) {
    navAvatar.addEventListener('click', () => {
        lightboxImg.src = navAvatar.src;
        avatarLightbox.style.display = 'flex';
    });
    avatarLightbox.addEventListener('click', () => {
        avatarLightbox.style.display = 'none';
    });
}
