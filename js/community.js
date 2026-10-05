// js/community.js

// 1. 后端 API 地址 (已替换为 C 同学最新的 IP)
const API_BASE_URL = 'http://10.72.39.141:8080/api';

// 2. 声明一个全局变量 posts，供 community_render.js 使用
let posts = [];

// 3. 页面加载时，自动请求后端获取数据
document.addEventListener('DOMContentLoaded', async function() {
    
    const postList = document.getElementById('postList');
    if(postList) postList.innerHTML = '<div style="text-align:center; padding:40px; color:#94a3b8;">正在加载帖子，请稍候...</div>';

    try {
        // 发起 GET 请求：GET /api/posts
        const response = await fetch(`${API_BASE_URL}/posts`);
        
        if (!response.ok) throw new Error('网络请求失败');
        
        // 把后端返回的 JSON 数据赋值给全局变量 posts
        posts = await response.json();
        
        // 调用 community_render.js 里的函数，将数据渲染到页面
        filterAndRender(); 

    } catch (error) {
        console.error("获取帖子失败:", error);
        if(postList) postList.innerHTML = '<div class="empty-state" style="padding:40px; text-align:center; color:#94a3b8; border:1px dashed #cbd5e1; border-radius:8px;">⚠️ 无法连接到服务器，请检查 C 同学的后端是否已启动，以及 IP 地址是否正确。</div>';
    }
});