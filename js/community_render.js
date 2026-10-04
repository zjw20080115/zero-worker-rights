// js/community_render.js

// === 1. 获取页面上的 DOM 元素 ===
const postList = document.getElementById('postList');
const searchInput = document.getElementById('searchInput');
const categoryTabs = document.getElementById('categoryTabs');
const postCountSpan = document.getElementById('postCount'); // 这是新加的帖子总数显示

// === 2. 全局变量 ===
let currentCategory = '全部';
let currentSearch = '';

// === 3. 渲染帖子的核心函数 ===
function renderPosts(data) {
    // 更新帖子总数（即使数据为空，也要显示0）
    if (postCountSpan) {
        postCountSpan.innerText = data.length;
    }

    // 如果筛选后没有数据，显示空状态
    if (data.length === 0) {
        postList.innerHTML = '<div class="empty-state">🔍 暂时没有找到相关问题，换个关键词试试吧</div>';
        return;
    }

    // 遍历数据，生成 HTML 卡片
    let html = '';
    data.forEach(post => {
        html += `
            <div class="post-card">
                <div class="post-header">
                    <span class="post-category">${post.category}</span>
                    <span class="post-time">${post.time}</span>
                </div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${post.content.substring(0, 60)}...</p>
                <div class="post-footer">
                    <div class="post-author">
                        <span class="avatar">👤</span>
                        <span>${post.author}</span>
                    </div>
                    <div class="post-stats">
                        <span class="stat-item">💬 ${post.comments}</span>
                        <span class="stat-item like-btn">👍 ${post.likes}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    // 把生成的卡片塞进列表容器
    postList.innerHTML = html;
}

// === 4. 筛选逻辑（搜索 + 分类） ===
function filterAndRender() {
    let filtered = posts; // 这里的 posts 是从 community.js 传过来的假数据

    // 按分类筛选
    if (currentCategory !== '全部') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    // 按搜索词筛选
    if (currentSearch.trim() !== '') {
        const keyword = currentSearch.toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(keyword) || 
            p.content.toLowerCase().includes(keyword)
        );
    }

    // 调用渲染函数
    renderPosts(filtered);
}

// === 5. 绑定事件：搜索框输入 ===
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        filterAndRender();
    });
}

// === 6. 绑定事件：点击左侧分类标签（适配 <li> 标签） ===
if (categoryTabs) {
    categoryTabs.addEventListener('click', (e) => {
        // 因为点击可能发生在 li 里面的文字上，所以用 closest 找最近的 li
        const targetLi = e.target.closest('li');
        
        if (targetLi) {
            // 移除所有 li 的 active 类
            document.querySelectorAll('#categoryTabs li').forEach(li => li.classList.remove('active'));
            
            // 给当前点击的 li 加上 active
            targetLi.classList.add('active');
            
            // 更新当前分类
            currentCategory = targetLi.getAttribute('data-category');
            
            // 重新渲染
            filterAndRender();
        }
    });
}

// === 7. 页面初始化 ===
// 页面一加载，立刻显示所有帖子1
filterAndRender();