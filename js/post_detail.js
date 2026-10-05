// js/post_detail.js

// 1. 后端 API 地址 (已替换为 C 同学的 IP)
const API_BASE_URL = 'http://192.168.134.1:8080/api'; 

// 2. 从 URL 中获取帖子 ID
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postId) {
    alert("缺少帖子ID，即将返回首页");
    window.location.href = "community.html";
}

// 3. 页面加载时，获取帖子和评论
document.addEventListener('DOMContentLoaded', function() {
    fetchPostDetail(postId);
    // 注意：评论接口 C 同学还没给，暂时先保留之前的逻辑，等他有接口了再改
    // fetchComments(postId); 
});

// 4. 获取帖子详情
async function fetchPostDetail(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/posts/${id}`);
        if (!response.ok) throw new Error('获取详情失败');
        const post = await response.json();

        // 渲染到页面 (增强容错，防止字段缺失)
        document.getElementById('postTitle').textContent = post.title || "无标题";
        
        // 根据 anonymous 和 userId 动态显示作者名
        let displayAuthor = "匿名用户";
        if (post.anonymous === false) {
            displayAuthor = "用户" + (post.userId || "");
        }
        
        document.getElementById('postMeta').textContent = `${displayAuthor} 发布于 ${post.time || "刚刚"}`;
        document.getElementById('postContent').textContent = post.content || "无内容";
        
    } catch (error) {
        console.error("获取详情失败:", error);
        document.getElementById('postTitle').textContent = "加载帖子失败 (可能是 C 同学接口未启动)";
    }
}

// 5. 评论相关代码 (暂时保留，等 C 同学提供评论接口后再启用)
// function renderComments(comments) { ... }
// async function submitComment() { ... }