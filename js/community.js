// js/community.js

const API_BASE_URL = 'http://10.72.39.141:8080/api';

let posts = [];
const userLikedStatus = {};

document.addEventListener('DOMContentLoaded', async function() {
    const postList = document.getElementById('postList');
    if(postList) postList.innerHTML = '<div style="text-align:center; padding:40px; color:#94a3b8;">正在加载帖子，请稍候...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (!response.ok) throw new Error('网络请求失败');
        
        posts = await response.json();
        filterAndRender(); 

    } catch (error) {
        console.error("获取帖子失败:", error);
        if(postList) postList.innerHTML = '<div class="empty-state" style="padding:40px; text-align:center; color:#94a3b8;">⚠️ 无法连接到服务器，请检查 C 同学的后端是否已启动。</div>';
    }
});

// ⭐ 点赞/取消点赞切换（未登录先弹登录）
async function likePost(postId, btnElement) {
    // ⭐ 登录检查
    if (!checkLogin()) return;

    if (btnElement.classList.contains('liking')) return;
    btnElement.classList.add('liking');

    const currentUserId = parseInt(localStorage.getItem('userId')) || 1;
    const isLiked = userLikedStatus[postId] || false;

    try {
        if (isLiked) {
            const response = await fetch(`${API_BASE_URL}/likes`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: parseInt(postId), userId: currentUserId })
            });

            if (response.ok) {
                userLikedStatus[postId] = false;
                const likeCountSpan = btnElement.querySelector('.like-count');
                if (likeCountSpan) {
                    likeCountSpan.textContent = Math.max(0, parseInt(likeCountSpan.textContent) - 1);
                }
                btnElement.style.color = '';
            } else {
                showCenterToast(await response.text(), "error");
            }
        } else {
            const response = await fetch(`${API_BASE_URL}/likes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId: parseInt(postId), userId: currentUserId })
            });

            const text = await response.text();

            if (response.ok) {
                userLikedStatus[postId] = true;
                const likeCountSpan = btnElement.querySelector('.like-count');
                if (likeCountSpan) {
                    likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
                }
                btnElement.style.color = '#dc3545';
            } else {
                showCenterToast(text, "error");
            }
        }
    } catch (error) {
        console.error("点赞出错:", error);
        showCenterToast("网络错误，无法连接到后端", "error");
    } finally {
        btnElement.classList.remove('liking');
    }
}