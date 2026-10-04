// js/publish.js
document.addEventListener('DOMContentLoaded', function() {
    
    // 获取表单元素
    const publishForm = document.getElementById('publishForm');

    // 监听表单的提交事件
    publishForm.addEventListener('submit', function(event) {
        // 阻止表单默认的刷新页面行为
        event.preventDefault();

        // 1. 获取用户填写的数据
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const content = document.getElementById('content').value.trim();
        const isAnonymous = document.getElementById('isAnonymous').checked;

        // 2. 处理匿名逻辑
        // 假设当前系统登录的用户叫 "张三"，真实ID是 1001
        // (在真实项目中，这些应该从登录后保存在浏览器的 token 或 localStorage 里获取)
        const currentUserName = "张三"; 
        const currentUserId = 1001; 

        // 如果勾选了匿名，前端显示的名字就是 "匿名用户"
        // 但真实的 user_id 依然要保留，发给后端 (C同学)
        let displayAuthor = isAnonymous ? "匿名用户" : currentUserName;

        // 3. 构造要发送给后端的数据对象
        const postData = {
            title: title,
            category: category,
            content: content,
            author: displayAuthor,  // 前端列表页展示用的名字
            user_id: currentUserId, // 真实的用户ID，传给C同学存数据库
            likes: 0,               // 新发布的帖子，点赞数初始为0
            comments: 0,            // 评论数初始为0
            time: new Date().toISOString().split('T')[0] // 获取当前日期，格式如 "2026-10-04"
        };

        // 打印出来看看对不对 (你可以按F12在控制台查看)
        console.log("准备发送给后端的数据：", postData);

        // --- 下面这部分是 Day 4 与 C 同学联调的内容，今天先写个占位 ---
       alert("数据收集成功！点击确定跳回主页。\n\n(数据已打印在控制台)");
       window.location.href = "community.html";
        
        // 未来在这里调用 API：
        // sendPostToBackend(postData);
    });
});