/* ============================================================
 * 零工权益助手 —— 个人信息页（js/profile.js）
 *
 * 占位文件：右侧内容区的具体页面（我的帖子 / 我的基本资料）
 * 后续在此实现菜单切换与数据加载。
 * 当前仅做占位提示，防止 href="#" 导致页面跳顶。
 * ============================================================ */

/* 左侧菜单占位点击：未实现的功能在右侧显示"建设中"提示 */
document.querySelectorAll('.menu-item[data-menu]').forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const content = document.getElementById('main-content');
        if (content) {
            content.innerHTML = `<p>「${item.textContent.trim()}」功能正在建设中，敬请期待。</p>`;
        }
    });
});
