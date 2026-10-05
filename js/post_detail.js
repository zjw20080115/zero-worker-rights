// js/post_detail.js

// ⚠️ 注意：等 C 同学重启后端后，如果 IP 变了，改这里
const API_BASE_URL = 'http://10.72.39.141:8080/api'; 

// 1. 从 URL 中获取帖子 ID (例如 post_detail.html?id=1)
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    alert("缺少帖子ID，即将返回首页");
    window.location.href = "community.html";
}

// 2. 页面加载时，获取帖子详情
document.addEventListener('DOMContentLoaded', function() {
    fetchPostDetail(postId);
    
    // ⚠️ 评论接口 C 同学还没给，先用假数据演示排版
    // 等他给了接口，把下面这行注释掉，打开 fetchComments(postId);
    loadMockComments(); 
    // fetchComments(postId);
});

// 3. 获取帖子详情 (对接 C 同学的 GET /api/posts/{id})
async function fetchPostDetail(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) throw new Error('获取详情失败');
        const post = await response.json();

        document.getElementById('postTitle').textContent = post.title || "无标题";
        
        // 兼容处理：如果后端返回了 author 就用，没返回就根据 anonymous 判断
        let displayAuthor = post.author;
        if (!displayAuthor) {
            displayAuthor = post.anonymous ? "匿名用户" : "用户" + (post.userId || "");
        }
        
        document.getElementById('postMeta').textContent = `${displayAuthor} 发布于 ${post.time || "刚刚"}`;
        document.getElementById('postContent').textContent = post.content || "无内容";
        
    } catch (error) {
        console.error("获取详情失败:", error);
        document.getElementById('postTitle').textContent = "加载帖子失败 (请检查C同学后端是否已启动/是否已配置跨域)";
    }
}

// 4. 渲染评论列表 (这个函数先保留，等有数据了直接调用)
function renderComments(comments) {
    const commentList = document.getElementById('commentList');
    const commentCount = document.getElementById('commentCount');
    
    if (!commentList) return;

    commentCount.textContent = comments.length;
    commentList.innerHTML = ''; 

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

// ================== 以下为临时测试评论功能 ==================
// C 同学补上评论接口后，把这块删掉，打开上面的 fetchComments 和 submitComment
function loadMockComments() {
    const mockComments = [
        { author: "用户A", content: "我也遇到过类似问题，建议保存好工资流水。" },
        { author: "用户B", content: "建议直接去劳动监察大队投诉。" }
    ];
    renderComments(mockComments);
}

// 提交评论（等 C 同学给接口后启用）
async function submitComment() {
    const input = document.getElementById('commentInput');
    const content = input.value.trim();

    if (!content) {
        alert("请输入评论内容！");
        return;
    }

    alert("评论接口 C 同学还没开通，目前只是演示！");
}