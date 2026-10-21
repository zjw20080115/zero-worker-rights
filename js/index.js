/* ============================================================
 * 零工权益助手 —— 首页（js/index.js）
 *
 * 首页动态区域：
 *   1. 互助墙高赞贴：拉取 GET /api/posts，按点赞数降序取前三渲染
 * （轮播图为占位块，待更多图片素材就绪后再替换为真实轮播）
 * ============================================================ */

const INDEX_API_BASE = 'http://10.72.39.141:8080/api';

/* 读取点赞缓存 */
function getIndexLikeCache() {
    try { return JSON.parse(localStorage.getItem('likeCache') || '{}'); } catch (e) { return {}; }
}
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
/* 加载互助墙高赞贴：结合点赞缓存，按 likeCount 降序取前三，渲染到 #community-hot-posts */
async function loadHotPosts() {
    const container = document.getElementById('community-hot-posts');
    if (!container) return;

    try {
        const res = await fetch(`${INDEX_API_BASE}/posts`);
        if (!res.ok) {
            throw new Error(`接口返回状态码 ${res.status}`);
        }
        const data = await res.json();
        let posts = Array.isArray(data) ? data : [];

        // ⭐ 1. 读取本地点赞和评论缓存
        let likeCache = {};
        let commentCache = {};
        try { 
            likeCache = JSON.parse(localStorage.getItem('likeCache') || '{}'); 
            commentCache = JSON.parse(localStorage.getItem('commentCache') || '{}'); 
        } catch (e) {}

        // ⭐ 2. 将缓存数据覆盖到帖子数据上
        posts.forEach(post => {
            const cache = likeCache[String(post.id)];
            if (cache) {
                post.likeCount = cache.likeCount !== undefined ? cache.likeCount : post.likeCount;
                post.isLiked = cache.liked; 
            } else {
                post.isLiked = false; 
            }

            // 如果本地有评论缓存，优先使用本地缓存的评论数（解决显示为0的问题）
            if (commentCache[String(post.id)] !== undefined) {
                post.comments = commentCache[String(post.id)];
            }
        });

        // ⭐ 3. 重新排序，取前三
        const hotPosts = posts
            .filter((p) => p && p.id)
            .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
            .slice(0, 3);

        if (hotPosts.length === 0) {
            container.innerHTML = '<p style="margin:0;">暂无帖子，快去互助墙发第一帖吧！</p>';
            return;
        }

                // ⭐ 4. 渲染列表
                container.innerHTML = hotPosts.map(post => {
                    // 判断是否点过赞，决定颜色
                    const likeColor = post.isLiked ? 'color: #dc3545;' : '';

                    return `
                    <div class="hot-post-item" onclick="window.location.href='pages/post_detail.html?id=${post.id}'" style="cursor: pointer;">

                        <!-- ★ 核心：加上这一层 post-inner，用来控制内边距 -->
                        <div class="post-inner">
                            <div class="hot-post-head">
                                <span class="hot-post-category">${indexEscapeHtml(post.category || '未分类')}</span>
                                <span class="hot-post-time">${indexFormatTime(post.createTime)}</span>
                            </div>
                            <h4 class="hot-post-title">${indexEscapeHtml(post.title || '无标题')}</h4>
                            <p class="hot-post-excerpt">${indexEscapeHtml((post.content || '').substring(0, 60))}...</p>
                            <div class="hot-post-foot">
                                <span style="margin-right: auto;">👤 ${indexEscapeHtml(post.author || '匿名用户')}</span>

                                <!-- 评论图标 -->
                                <span class="stat-item" style="display:inline-flex; align-items:center; gap:4px;">
                                    <svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                    <span class="home-comment-count">${post.comments || 0}</span>
                                </span>

                                <!-- 点赞图标 -->
                                <span class="stat-item like-btn-home" onclick="handleHomeLike(event, ${post.id}, this)" style="${likeColor}; cursor: pointer;">
                                    <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                    <span class="home-like-count">${post.likeCount || 0}</span>
                                </span>
                            </div>
                        </div>

                    </div>`;
                }).join('');
        
    } catch (err) {
        console.error('[index.js] 加载高赞贴失败：', err);
        container.innerHTML = '<p style="margin:0;color:#94a3b8;">高赞帖子加载失败，请检查网络或稍后重试</p>';
    }
}
async function handleHomeLike(event, postId, btnElement) {
    // 阻止事件冒泡，防止点击点赞时跳转到详情页
    event.stopPropagation(); 
    event.preventDefault();

    const currentUserId = parseInt(localStorage.getItem('userId'));
    if (!currentUserId) {
        alert("请先登录后再点赞！");
        return;
    }

    if (btnElement.classList.contains('liking')) return;
    btnElement.classList.add('liking');

    let likeCache = {};
    try { likeCache = JSON.parse(localStorage.getItem('likeCache') || '{}'); } catch (e) {}
    
    const currentStatus = likeCache[String(postId)] ? likeCache[String(postId)].liked : false;
    let currentCount = parseInt(btnElement.querySelector('.home-like-count').textContent) || 0;

    try {
        const response = await fetch(`${INDEX_API_BASE}/likes`, {
            method: currentStatus ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: postId, userId: currentUserId })
        });

                if (response.ok) {
            const newStatus = !currentStatus;
            const newCount = newStatus ? currentCount + 1 : Math.max(0, currentCount - 1);

            // 1. 先临时更新 UI，给用户反馈
            btnElement.style.color = newStatus ? '#dc3545' : ''; 
            btnElement.querySelector('.home-like-count').textContent = newCount;

            // 2. 更新本地缓存
            likeCache[String(postId)] = { liked: newStatus, likeCount: newCount };
            localStorage.setItem('likeCache', JSON.stringify(likeCache));

            // ⭐ 3. 重新加载并重新排序高赞帖
            // 因为我们刚更新了缓存，loadHotPosts 会重新拉取数据并按照最新点赞数排序
            loadHotPosts(); 

        } else {
            alert("点赞操作失败，请稍后重试");
        }
    } catch (error) {
        console.error("点赞出错:", error);
        alert("网络错误，无法连接服务器");
    } finally {
        btnElement.classList.remove('liking');
    }
}

/* 页面加载即拉取高赞贴 */
loadHotPosts();

/* ⭐ 监听页面返回：当从详情页退回首页时，强制重新拉取最新数据并重新排序 */
window.addEventListener('pageshow', function(event) {
    // 只要是从缓存恢复（后退/前进）或者重新加载，就强制重载
    if (event.persisted) {
        loadHotPosts(); 
    } else {
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0 && navEntries[0].type === "back_forward") {
            loadHotPosts();
        }
    }
});

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
