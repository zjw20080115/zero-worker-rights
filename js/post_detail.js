// js/post_detail.js

// ⚠️ 等 C 同学给你地址后，把这里改成真实的 API 地址
const API_BASE_URL = 'http://localhost:8080/api'; 

// 1. 从 URL 中获取帖子 ID (例如 community.html 跳转过来是 post_detail.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    alert("缺少帖子ID，即将返回首页");
    window.location.href = "community.html";
}

// 2. 页面加载时，获取帖子和评论
document.addEventListener('DOMContentLoaded', function() {
    fetchPostDetail(postId);
    fetchComments(postId);
});

// 3. 获取帖子详情
async function fetchPostDetail(id) {
    try {
        // GET /api/posts/{id}
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) throw new Error('获取详情失败');
        const post = await response.json();

        // 渲染到页面
        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postMeta').textContent = `${post.author} 发布于 ${post.time}`;
        document.getElementById('postContent').textContent = post.content;
        
    } catch (error) {
        console.error("获取详情失败:", error);
        document.getElementById('postTitle').textContent = "加载帖子失败 (可能是 C 同学接口未启动)";
    }
}

// 4. 获取评论列表
async function fetchComments(id) {
    try {
        // GET /api/posts/{id}/comments
        const response = await fetch(`${API_BASE_URL}/posts/${id}/comments`);
        if (!response.ok) throw new Error('获取评论失败');
        const comments = await response.json();

        renderComments(comments);
    } catch (error) {
        console.error("获取评论失败:", error);
    }
}

// 5. 渲染评论列表
function renderComments(comments) {
    const commentList = document.getElementById('commentList');
    const commentCount = document.getElementById('commentCount');
    
    commentCount.textContent = comments.length;
    commentList.innerHTML = ''; // 清空

    if (comments.length === 0) {
        commentList.innerHTML = '<p style="color:#94a3b8; padding: 20px 0; text-align: center;">暂无评论，快来抢沙发吧！</p>';
        return;
    }

    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'comment-item';
        div.innerHTML = `
            <div class="comment-user">${comment.author || '匿名用户'}</div>
            <div class="comment-text">${comment.content}</div>
        `;
        commentList.appendChild(div);
    });
}

// 6. 提交新评论 (绑定给按钮的 onclick)
async function submitComment() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();

    if (!content) {
        alert("请输入评论内容！");
        return;
    }

    const commentData = {
        post_id: postId, // 当前帖子的 ID
        content: content,
        author: "当前登录用户", // 暂时写死，后续可接入登录
        user_id: 1001
    };

    try {
        // POST /api/comments
        const response = await fetch(`${API_BASE_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        });

        if (response.ok) {
            alert("评论成功！");
            input.value = ''; // 清空输入框
            fetchComments(postId); // 重新拉取最新的评论列表
        } else {
            alert("评论失败");
        }
    } catch (error) {
        console.error("评论出错:", error);
        alert("网络错误，无法连接到后端");
    }
}