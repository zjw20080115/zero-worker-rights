// js/post_detail.js

const API_BASE_URL = 'http://10.72.39.141:8080/api'; 

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    alert("缺少帖子ID，即将返回首页");
    window.location.href = "community.html";
}

const loggedInUserId = localStorage.getItem('userId');
const currentUserId = loggedInUserId ? parseInt(loggedInUserId) : null;
let isDetailLiked = false;
let currentDetailCount = 0;
let currentCommentCount = 0; // ⭐ 记录最新评论数

function formatTime(timeStr) {
    if (!timeStr) return '刚刚';
    try { return timeStr.replace('T', ' ').substring(0, 16); } catch (e) { return timeStr; }
}

function getLikeCache() {
    try { return JSON.parse(localStorage.getItem('likeCache') || '{}'); } catch (e) { return {}; }
}
function setLikeCache(id, liked, likeCount) {
    const cache = getLikeCache();
    cache[String(id)] = { liked: liked, likeCount: likeCount };
    localStorage.setItem('likeCache', JSON.stringify(cache));
}

// ⭐ 评论数缓存
function getCommentCache() {
    try { return JSON.parse(localStorage.getItem('commentCache') || '{}'); } catch (e) { return {}; }
}
function setCommentCache(id, count) {
    const cache = getCommentCache();
    cache[String(id)] = count;
    localStorage.setItem('commentCache', JSON.stringify(cache));
    // 触发一个事件，通知列表页（如果列表页开着）
    window.dispatchEvent(new Event('commentUpdated'));
}

document.addEventListener('DOMContentLoaded', function() {
    fetchPostDetail(postId);
    fetchComments(postId);
});

async function fetchPostDetail(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) throw new Error('获取详情失败');
        const post = await response.json();

        document.getElementById('postTitle').textContent = post.title || "无标题";
        let displayAuthor = post.author || "匿名用户";
        if (post.anonymous === false && post.userId) displayAuthor = "用户" + post.userId;
        document.getElementById('postMeta').textContent = `${displayAuthor} 发布于 ${formatTime(post.createTime)}`;
        document.getElementById('postContent').textContent = post.content || "无内容";
        
        let finalLiked = post.liked === true;
        let finalCount = post.likeCount !== undefined ? post.likeCount : (post.likes || 0);

        const likeCache = getLikeCache();
        if (likeCache[String(id)]) {
            finalLiked = likeCache[String(id)].liked;
            finalCount = likeCache[String(id)].likeCount;
        }

        isDetailLiked = finalLiked;
        currentDetailCount = finalCount;
        
        document.getElementById('likeCount').textContent = currentDetailCount;

        const likeBtn = document.getElementById('likeBtn');
        if (isDetailLiked) likeBtn.classList.add('active-like');
        else likeBtn.classList.remove('active-like');

        const deleteBtn = document.getElementById('deletePostBtn');
        if (deleteBtn) deleteBtn.style.display = (loggedInUserId && loggedInUserId == post.userId) ? 'flex' : 'none';
        
    } catch (error) {
        console.error("获取详情失败:", error);
        document.getElementById('postTitle').textContent = "加载帖子失败";
    }
}

async function fetchComments(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/comments/post/${id}`);
        if (!response.ok) throw new Error('获取评论失败');
        const comments = await response.json();
        
        // ⭐ 获取到真实的评论列表后，更新缓存
        currentCommentCount = comments.length;
        setCommentCache(id, currentCommentCount);
        
        renderComments(comments);
    } catch (error) {
        console.error("获取评论失败:", error);
        document.getElementById('commentList').innerHTML = '<p style="color:#94a3b8; text-align:center;">评论加载失败。</p>';
    }
}

function renderComments(comments) {
    const commentList = document.getElementById('commentList');
    const commentCount = document.getElementById('commentCount');
    
    if (commentCount) commentCount.textContent = comments.length;
    commentList.innerHTML = ''; 

    if (comments.length === 0) {
        commentList.innerHTML = '<p style="color:#94a3b8; padding: 20px 0; text-align: center;">暂无评论，快来抢沙发吧！</p>';
        return;
    }

    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        const showDelete = loggedInUserId && (String(comment.userId) === String(loggedInUserId));
        let deleteBtnHtml = showDelete ? `<span onclick="deleteComment(${comment.id})" style="cursor: pointer; color: #dc3545; font-size: 13px; padding: 4px 8px; border-radius: 4px; flex-shrink: 0;">删除</span>` : '';

        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div class="comment-user">${comment.author || '用户' + (comment.userId || '')}</div>
                    <div class="comment-text">${comment.content}</div>
                </div>
                ${deleteBtnHtml}
            </div>
        `;
        commentList.appendChild(div);
    });
}

async function likePost() {
    if (!checkLogin()) return;
    const likeData = { postId: parseInt(postId), userId: currentUserId };
    try {
        const response = await fetch(`${API_BASE_URL}/likes`, {
            method: isDetailLiked ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(likeData)
        });

        if (response.ok) {
            isDetailLiked = !isDetailLiked;
            currentDetailCount = isDetailLiked ? currentDetailCount + 1 : Math.max(0, currentDetailCount - 1);
            document.getElementById('likeCount').textContent = currentDetailCount;
            document.getElementById('likeBtn').classList.toggle('active-like', isDetailLiked);
            setLikeCache(postId, isDetailLiked, currentDetailCount);
        } else {
            showCenterToast(await response.text(), "error");
        }
    } catch (error) {
        showCenterToast("网络错误", "error");
    }
}

async function submitComment() {
    if (!checkLogin()) return;
    const input = document.getElementById('commentInput');
    const content = input.value.trim();
    if (!content) return showCenterToast("请输入评论内容！", "error");

    try {
        const response = await fetch(`${API_BASE_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: parseInt(postId), userId: currentUserId, content: content })
        });

        if (response.ok) {
            input.value = ''; 
            document.getElementById('commentInputArea').style.display = 'none';
            // 重新获取评论（会自动更新缓存）
            fetchComments(postId); 
        } else {
            showCenterToast("评论失败", "error");
        }
    } catch (error) {
        showCenterToast("网络错误", "error");
    }
}

function deleteComment(commentId) {
    if (!checkLogin()) return;
    showCenterConfirm("确定要删除这条评论吗？", async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, { method: 'DELETE' });
            if (response.ok) {
                // 重新获取评论（会自动更新缓存）
                fetchComments(postId); 
            } else {
                showCenterToast("删除失败：" + await response.text(), "error");
            }
        } catch (error) {
            showCenterToast("网络错误", "error");
        }
    });
}

function toggleCommentInput() {
    if (!checkLogin()) return;
    const area = document.getElementById('commentInputArea');
    area.style.display = area.style.display === 'block' ? 'none' : 'block';
    if(area.style.display === 'block') document.getElementById('commentInput').focus();
}

function reportPost() {
    if (!checkLogin()) return;
    document.getElementById('reportModal').style.display = 'flex';
    document.querySelectorAll('input[name="reportReason"]').forEach(r => { r.checked = false; r.wasChecked = false; });
    document.getElementById('customReportReason').value = '';
}
function closeReportModal() { document.getElementById('reportModal').style.display = 'none'; }
function toggleRadio(radio) {
    if (radio.wasChecked) { radio.checked = false; radio.wasChecked = false; } 
    else { document.querySelectorAll('input[name="reportReason"]').forEach(r => r.wasChecked = false); radio.wasChecked = true; }
}
async function submitReport() {
    const selectedRadio = document.querySelector('input[name="reportReason"]:checked');
    const customReason = document.getElementById('customReportReason').value.trim();
    let finalReason = selectedRadio ? selectedRadio.value : '';
    if (finalReason === '其他' && customReason) finalReason = customReason;
    else if (finalReason && customReason) finalReason += '：' + customReason;
    else if (!finalReason && customReason) finalReason = customReason;
    if (!finalReason) return showCenterToast("请选择或填写举报原因！", "error");
    try {
        const response = await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: parseInt(postId), userId: currentUserId, reason: finalReason })
        });
        if (response.ok) { closeReportModal(); showCenterToast("举报成功！", "success"); }
        else showCenterToast("举报失败：" + await response.text(), "error");
    } catch (error) { showCenterToast("网络错误", "error"); }
}
function deletePost() {
    if (!checkLogin()) return;
    showCenterConfirm("确定要删除这篇帖子吗？删除后无法恢复！", async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, { method: 'DELETE' });
            if (response.ok) {
                const cache = getLikeCache(); delete cache[String(postId)];
                localStorage.setItem('likeCache', JSON.stringify(cache));
                showCenterToast("删除成功！即将返回主页。", "success");
                setTimeout(() => window.location.href = "community.html", 900);
            } else showCenterToast("删除失败：" + await response.text(), "error");
        } catch (error) { showCenterToast("网络错误", "error"); }
    });
}