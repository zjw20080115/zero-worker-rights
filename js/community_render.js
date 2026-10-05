// js/community_render.js

// === 1. 获取页面上的 DOM 元素 ===
const postList = document.getElementById('postList');
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.getElementById('categoryTabs');
const postCountSpan = document.getElementById('postCount'); 

// === 2. 全局变量 ===
let currentCategory = '全部';
let currentSearch = '';

// === 3. 渲染帖子的核心函数 ===
function renderPosts(data) {
    if (postCountSpan) {
        postCountSpan.innerText = data.length;
    }

    if (data.length === 0) {
        postList.innerHTML = '<div class="empty-state">🔍 暂时没有找到相关问题，换个关键词试试吧</div>';
        return;
    }

    let html = '';
    data.forEach(post => {
        html += `
            <div class="post-card" onclick="window.location.href='post_detail.html?id=${post.id}'" style="cursor: pointer;">
                <div class="post-header">
                    <span class="post-category">${post.category}</span>
                    <span class="post-time">${post.time || ''}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${(post.content || '').substring(0, 60)}...</p>
                <div class="post-footer">
                    <div class="post-author">
                        <span class="avatar">👤</span>
                        <span>${post.author || '匿名用户'}</span>
                    </div>
                    <div class="post-stats">
                        <span class="stat-item" title="评论">
                            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            ${post.comments || 0}
                        </span>
                        <span class="stat-item like-btn" onclick="event.stopPropagation(); likePost(${post.id}, this)" title="点赞">
                            <svg class="icon-svg" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                            <span class="like-count">${post.likes || 0}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    postList.innerHTML = html;
}

// === 4. 筛选逻辑（搜索 + 分类） ===
function filterAndRender() {
    let filtered = posts; 

    if (currentCategory !== '全部') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (currentSearch.trim() !== '') {
        const keyword = currentSearch.toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(keyword) || 
            p.content.toLowerCase().includes(keyword)
        );
    }

    renderPosts(filtered);
}

// === 5. 绑定事件：搜索框输入 ===
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        filterAndRender();
    });
}

// === 6. 绑定事件：点击左侧分类标签 ===
if (categoryTabs) {
    categoryTabs.addEventListener('click', (e) => {
        const targetLi = e.target.closest('li');
        if (targetLi) {
            document.querySelectorAll('#categoryTabs li').forEach(li => li.classList.remove('active'));
            targetLi.classList.add('active');
            currentCategory = targetLi.getAttribute('data-category');
            filterAndRender();
        }
    });
}