// js/community.js

const API_BASE_URL = 'http://10.72.39.141:8080/api';
let posts = [];
const userLikedStatus = {};

function getLikeCache() {
    try { return JSON.parse(localStorage.getItem('likeCache') || '{}'); } catch (e) { return {}; }
}
function setLikeCache(postId, liked, likeCount) {
    const cache = getLikeCache();
    cache[String(postId)] = { liked: liked, likeCount: likeCount };
    localStorage.setItem('likeCache', JSON.stringify(cache));
}

// ⭐ 评论缓存
function getCommentCache() {
    try { return JSON.parse(localStorage.getItem('commentCache') || '{}'); } catch (e) { return {}; }
}

function applyCacheAndRender() {
    const likeCache = getLikeCache();
    const commentCache = getCommentCache();
    
    posts.forEach(p => {
        let baseCount = p.likeCount !== undefined ? p.likeCount : (p.likes || 0);
        
        // 应用点赞缓存
        if (likeCache[String(p.id)]) {
            p.liked = likeCache[String(p.id)].liked;
            p.likeCount = likeCache[String(p.id)].likeCount;
            userLikedStatus[p.id] = p.liked;
        } else {
            p.liked = p.liked === true;
            p.likeCount = baseCount;
            userLikedStatus[p.id] = p.liked;
        }

        // ⭐ 应用评论缓存（覆盖后端返回的数量）
        if (commentCache[String(p.id)] !== undefined) {
            p.comments = commentCache[String(p.id)];
        }
    });
    filterAndRender(); 
}

document.addEventListener('DOMContentLoaded', async function() {
    const postList = document.getElementById('postList');
    if(postList) postList.innerHTML = '<div style="text-align:center; padding:40px; color:#94a3b8;">正在加载帖子，请稍候...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) throw new Error('网络请求失败');
        posts = await response.json();
        applyCacheAndRender();
    } catch (error) {
        console.error("获取帖子失败:", error);
        if(postList) postList.innerHTML = '<div class="empty-state" style="padding:40px; text-align:center; color:#94a3b8;">⚠️ 无法连接到服务器。</div>';
    }
});

// ⭐ 监听返回和详情页发评论的事件
window.addEventListener('pageshow', function(event) {
    if (event.persisted && posts.length > 0) applyCacheAndRender();
});
window.addEventListener('commentUpdated', function() {
    if (posts.length > 0) applyCacheAndRender();
});

async function likePost(postId, btnElement) {
    if (!checkLogin()) return;
    if (btnElement.classList.contains('liking')) return;
    btnElement.classList.add('liking');

    const currentUserId = parseInt(localStorage.getItem('userId'));
    const isLiked = userLikedStatus[postId] || false;

    try {
        const response = await fetch(`${API_BASE_URL}/likes`, {
            method: isLiked ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: parseInt(postId), userId: currentUserId })
        });

        if (response.ok) {
            userLikedStatus[postId] = !isLiked;
            const post = posts.find(p => String(p.id) === String(postId));
            let newCount = 0;
            if (post) {
                newCount = isLiked ? Math.max(0, post.likeCount - 1) : post.likeCount + 1;
                post.likeCount = newCount;
                post.liked = !isLiked;
            }
            setLikeCache(postId, !isLiked, newCount);
            const likeCountSpan = btnElement.querySelector('.like-count');
            if (likeCountSpan) likeCountSpan.textContent = newCount;
            btnElement.style.color = isLiked ? '' : '#dc3545';
        } else {
            showCenterToast(await response.text(), "error");
        }
    } catch (error) {
        showCenterToast("网络错误", "error");
    } finally {
        btnElement.classList.remove('liking');
    }
}