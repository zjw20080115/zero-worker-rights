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
        // 用 <a> 标签包裹整个卡片，点击跳转到详情页，并带上帖子的 id
        html += `
            <a href="post_detail.html?id=${post.id}" style="text-decoration: none; color: inherit; display: block;">
                <div class="post-card">
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
                            <span class="stat-item">💬 ${post.comments || 0}</span>
                            <span class="stat-item like-btn">👍 ${post.likes || 0}</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    });
    
    postList.innerHTML = html;
}

// === 4. 筛选逻辑（搜索 + 分类） ===
function filterAndRender() {
    // 这里的 posts 是从 community.js 里定义的全局变量
    let filtered = posts; 

    if (currentCategory !== '全部') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (currentSearch.trim() !== '') {
        const keyword = currentSearch.toLowerCase();
        filtered = filtered.filter(p => 
            (p.title || '').toLowerCase().includes(keyword) || 
            (p.content || '').toLowerCase().includes(keyword)
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