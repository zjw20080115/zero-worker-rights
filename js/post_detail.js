// js/post_detail.js

const API_BASE_URL = 'http://10.72.39.141:8080/api'; 

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    alert("缺少帖子ID，即将返回首页");
    window.location.href = "community.html";
}

// ⭐ 关键：未登录时 loggedInUserId 为 null，避免误判
const loggedInUserId = localStorage.getItem('userId');
const currentUserId = loggedInUserId ? parseInt(loggedInUserId) : null;

let isDetailLiked = false;

// ⭐ 时间格式化函数
function formatTime(timeStr) {
    if (!timeStr) return '';
    try {
        return timeStr.replace('T', ' ').substring(0, 16);
    } catch (e) {
        return timeStr;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchPostDetail(postId);
    fetchComments(postId);
});

// 获取帖子详情
async function fetchPostDetail(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) throw new Error('获取详情失败');
        const post = await response.json();

        document.getElementById('postTitle').textContent = post.title || "无标题";
        
        // 后端已经根据 anonymous 处理好了 author
        const displayAuthor = post.author || '匿名用户';
        
        document.getElementById('postMeta').textContent = `${displayAuthor} 发布于 ${formatTime(post.createTime)}`;
        document.getElementById('postContent').textContent = post.content || "无内容";
        
        const likeCountEl = document.getElementById('likeCount');
        if (likeCountEl) likeCountEl.textContent = post.likeCount || 0;

        if (post.liked === true) {
            isDetailLiked = true;
            document.getElementById('likeBtn').classList.add('active-like');
        }

        // ⭐ 未登录 / 非本人帖子 → 不显示删除按钮
        const deleteBtn = document.getElementById('deletePostBtn');
        if (deleteBtn) {
            if (loggedInUserId && loggedInUserId == post.userId) {
                deleteBtn.style.display = 'flex';
            } else {
                deleteBtn.style.display = 'none';
            }
        }
        
    } catch (error) {
        console.error("获取详情失败:", error);
        document.getElementById('postTitle').textContent = "加载帖子失败";
    }
}

// 获取评论
async function fetchComments(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/comments/post/${id}`);
        if (!response.ok) throw new Error('获取评论失败');
        const comments = await response.json();
        renderComments(comments);
    } catch (error) {
        console.error("获取评论失败:", error);
        document.getElementById('commentList').innerHTML = '<p style="color:#94a3b8; text-align:center;">评论加载失败。</p>';
    }
}

// 渲染评论
function renderComments(comments) {
    const commentList = document.getElementById('commentList');
    const commentCount = document.getElementById('commentCount');
    
    commentCount.textContent = comments.length;
    commentList.innerHTML = ''; 

    if (comments.length === 0) {
        commentList.innerHTML = '<p style="color:#94a3b8; padding: 20px 0; text-align: center;">暂无评论，快来抢沙发吧！</p>';
        return;
    }

    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        
        // ⭐ 未登录 / 非本人评论 → 不显示删除按钮
        const showDelete = loggedInUserId && comment.userId == loggedInUserId;
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div class="comment-user">${comment.author || '用户' + (comment.userId || '')}</div>
                    <div class="comment-text">${comment.content}</div>
                </div>
                ${showDelete ? `
                    <span onclick="deleteComment(${comment.id})" style="cursor: pointer; color: #dc3545; font-size: 13px; padding: 4px 8px; border-radius: 4px; flex-shrink: 0;">删除</span>
                ` : ''}
            </div>
        `;
        commentList.appendChild(div);
    });
}

// 删除评论
function deleteComment(commentId) {
    if (!checkLogin()) return;
    showCenterConfirm("确定要删除这条评论吗？", async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchComments(postId);
            } else {
                showCenterToast("删除失败：" + await response.text(), "error");
            }
        } catch (error) {
            console.error("删除评论出错:", error);
            showCenterToast("网络错误，无法连接到后端", "error");
        }
    });
}

// 评论框显示/隐藏
function toggleCommentInput() {
    if (!checkLogin()) return;
    const area = document.getElementById('commentInputArea');
    if (area.style.display === 'block') {
        area.style.display = 'none';
    } else {
        area.style.display = 'block';
        document.getElementById('commentInput').focus();
    }
}

// 发表评论
async function submitComment() {
    if (!checkLogin()) return;

    const input = document.getElementById('commentInput');
    const content = input.value.trim();

    if (!content) {
        showCenterToast("请输入评论内容！", "error");
        return;
    }

    const commentData = {
        postId: parseInt(postId),
        userId: currentUserId,
        content: content
    };

    try {
        const response = await fetch(`${API_BASE_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            input.value = ''; 
            document.getElementById('commentInputArea').style.display = 'none';
            fetchComments(postId); 
        } else {
            showCenterToast("评论失败", "error");
        }
    } catch (error) {
        console.error("评论出错:", error);
        showCenterToast("网络错误，无法连接到后端", "error");
    }
}

// 详情页点赞
async function likePost() {
    if (!checkLogin()) return;

    const likeData = {
        postId: parseInt(postId),
        userId: currentUserId
    };

    try {
        if (isDetailLiked) {
            const response = await fetch(`${API_BASE_URL}/likes`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(likeData)
            });

            if (response.ok) {
                isDetailLiked = false;
                const likeCountEl = document.getElementById('likeCount');
                if (likeCountEl) {
                    likeCountEl.textContent = Math.max(0, parseInt(likeCountEl.textContent) - 1);
                }
                document.getElementById('likeBtn').classList.remove('active-like');
            } else {
                showCenterToast(await response.text(), "error");
            }
        } else {
            const response = await fetch(`${API_BASE_URL}/likes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(likeData)
            });

            const text = await response.text(); 
            
            if (response.ok) {
                isDetailLiked = true;
                document.getElementById('likeBtn').classList.add('active-like');
                const likeCountEl = document.getElementById('likeCount');
                if (likeCountEl) {
                    likeCountEl.textContent = parseInt(likeCountEl.textContent) + 1;
                }
            } else {
                showCenterToast("点赞失败：" + text, "error"); 
            }
        }
    } catch (error) {
        console.error("点赞出错:", error);
        showCenterToast("网络错误，无法连接到后端", "error");
    }
}

// 打开举报弹窗
function reportPost() {
    if (!checkLogin()) return;
    document.getElementById('reportModal').style.display = 'flex';
    document.querySelectorAll('input[name="reportReason"]').forEach(r => {
        r.checked = false;
        r.wasChecked = false;
    });
    document.getElementById('customReportReason').value = '';
}

function closeReportModal() {
    document.getElementById('reportModal').style.display = 'none';
}

async function submitReport() {
    const selectedRadio = document.querySelector('input[name="reportReason"]:checked');
    const customReason = document.getElementById('customReportReason').value.trim();

    let finalReason = '';
    
    if (selectedRadio) {
        finalReason = selectedRadio.value;
        if (finalReason === '其他' && customReason) {
            finalReason = customReason;
        } else if (finalReason !== '其他' && customReason) {
            finalReason += '：' + customReason;
        }
    } else if (customReason) {
        finalReason = customReason;
    } else {
        showCenterToast("请选择或填写举报原因！", "error");
        return;
    }

    const reportData = {
        postId: parseInt(postId),
        userId: currentUserId,
        reason: finalReason
    };

    try {
        const response = await fetch(`${API_BASE_URL}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });

        const text = await response.text();

        if (response.ok) {
            closeReportModal();
            showCenterToast("举报成功！我们会尽快处理。", "success");
        } else {
            showCenterToast("举报失败：" + text, "error");
        }
    } catch (error) {
        console.error("举报出错:", error);
        showCenterToast("网络错误，无法连接到后端", "error");
    }
}

// 允许点击已选中的单选按钮取消选择
function toggleRadio(radio) {
    if (radio.wasChecked) {
        radio.checked = false;
        radio.wasChecked = false;
    } else {
        document.querySelectorAll('input[name="reportReason"]').forEach(r => {
            r.wasChecked = false;
        });
        radio.wasChecked = true;
    }
}

// 删除帖子
function deletePost() {
    if (!checkLogin()) return;
    showCenterConfirm("确定要删除这篇帖子吗？删除后无法恢复！", async function() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showCenterToast("删除成功！即将返回主页。", "success");
                setTimeout(() => window.location.href = "community.html", 900);
            } else {
                showCenterToast("删除失败：" + await response.text(), "error");
            }
        } catch (error) {
            console.error("删除出错:", error);
            showCenterToast("网络错误，无法连接到后端", "error");
        }
    });
}