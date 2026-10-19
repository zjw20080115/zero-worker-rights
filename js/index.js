/* ============================================================
 * 零工权益助手 —— 首页（js/index.js）
 *
 * 首页动态区域：
 *   1. 互助墙高赞贴：拉取 GET /api/posts，按点赞数降序取前三渲染
 * （轮播图为占位块，待更多图片素材就绪后再替换为真实轮播）
 * ============================================================ */

const INDEX_API_BASE = 'http://10.72.39.141:8080/api';

/* 转义 HTML，防止后端返回的文本被当成标签渲染 */
function indexEscapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/* 时间格式化：2026-10-05T15:28:13 -> 2026-10-05 15:28 */
function indexFormatTime(timeStr) {
    if (!timeStr) return '';
    try {
        return timeStr.replace('T', ' ').substring(0, 16);
    } catch (e) {
        return timeStr;
    }
}

/* 加载互助墙高赞贴：按 likeCount 降序取前三，渲染到 #community-hot-posts */
async function loadHotPosts() {
    const container = document.getElementById('community-hot-posts');
    if (!container) return;

    try {
        const res = await fetch(`${INDEX_API_BASE}/posts`);
        if (!res.ok) {
            throw new Error(`接口返回状态码 ${res.status}`);
        }
        const data = await res.json();
        const posts = Array.isArray(data) ? data : [];
        const hotPosts = posts
            .filter((p) => p && p.id)
            .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
            .slice(0, 3);

        if (hotPosts.length === 0) {
            container.innerHTML = '<p style="margin:0;">暂无帖子，快去互助墙发第一帖吧！</p>';
            return;
        }

        container.innerHTML = hotPosts
            .map(
                (post) => `
            <div class="hot-post-item" onclick="window.location.href='pages/post_detail.html?id=${post.id}'" style="cursor: pointer;">
                <div class="hot-post-head">
                    <span class="hot-post-category">${indexEscapeHtml(post.category || '未分类')}</span>
                    <span class="hot-post-time">${indexFormatTime(post.createTime)}</span>
                </div>
                <h4 class="hot-post-title">${indexEscapeHtml(post.title || '无标题')}</h4>
                <p class="hot-post-excerpt">${indexEscapeHtml((post.content || '').substring(0, 60))}...</p>
                <div class="hot-post-foot">
                    <span>👤 ${indexEscapeHtml(post.author || '匿名用户')}</span>
                    <span>👍 ${post.likeCount || 0}</span>
                    <span>💬 ${post.comments || 0}</span>
                </div>
            </div>`
            )
            .join('');
    } catch (err) {
        console.error('[index.js] 加载高赞贴失败：', err);
        container.innerHTML =
            '<p style="margin:0;color:#94a3b8;">高赞帖子加载失败，请检查网络或稍后重试</p>';
    }
}

/* 页面加载即拉取高赞贴 */
loadHotPosts();

/* ============================================================
 * 导航头像：默认图兜底 + 读取本地头像 + Lightbox 放大
 * ============================================================ */

const navAvatar = document.getElementById('nav-avatar');
const avatarLightbox = document.getElementById('avatar-lightbox');
const lightboxImg = document.getElementById('lightbox-img');

/* 头像兜底：默认图缺失时用灰色圆形占位图（带"空"字） */
function navAvatarFallback() {
    navAvatar.src =
        'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
                '<circle cx="48" cy="48" r="48" fill="#cccccc"/>' +
                '<text x="48" y="48" text-anchor="middle" dominant-baseline="central" font-size="40" fill="#ffffff">空</text>' +
                '</svg>'
        );
}

/* 联动：个人中心修改头像后会写入 localStorage.avatarUrl，这里读取最新头像 */
(function initNavAvatar() {
    const savedAvatar = localStorage.getItem('avatarUrl');
    if (savedAvatar) {
        navAvatar.src = savedAvatar;
    }
    // 图片可能在脚本执行前就已加载失败（complete 且 naturalWidth 为 0）
    if (navAvatar.complete && navAvatar.naturalWidth === 0) {
        navAvatarFallback();
    }
    navAvatar.addEventListener('error', navAvatarFallback);
})();

/* Lightbox：点击头像放大 */
navAvatar.addEventListener('click', () => {
    lightboxImg.src = navAvatar.src;
    avatarLightbox.style.display = 'flex';
});

/* 点击遮罩层任意区域关闭放大 */
avatarLightbox.addEventListener('click', () => {
    avatarLightbox.style.display = 'none';
});
