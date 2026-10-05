// js/publish.js
document.addEventListener('DOMContentLoaded', function() {
    
    const publishForm = document.getElementById('publishForm');

    // 注意这里加上了 async
    publishForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. 获取用户填写的数据
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const content = document.getElementById('content').value.trim();
        const isAnonymous = document.getElementById('isAnonymous').checked;

        // 2. 处理匿名逻辑
        const currentUserName = "张三"; 
        const currentUserId = 1001; 

        let displayAuthor = isAnonymous ? "匿名用户" : currentUserName;

        // 3. 构造要发送给后端的数据对象
        const postData = {
            title: title,
            category: category,
            content: content,
            author: displayAuthor,  
            user_id: currentUserId, 
            likes: 0,               
            comments: 0,            
            time: new Date().toISOString().split('T')[0] 
        };

        console.log("准备发送给后端的数据：", postData);

        // --- 下面是真实的 API 调用 ---
        // ⚠️ 等 C 同学给你地址后，把这里改成真实的 POST 地址，例如 'http://192.168.1.100:8080/api/posts'
        const PUBLISH_API_URL = 'http://localhost:8080/api/posts'; 

        try {
            const response = await fetch(PUBLISH_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                alert("发布成功！点击确定返回主页。");
                window.location.href = "community.html"; 
            } else {
                alert("发布失败，请检查后端。");
            }
        } catch (error) {
            console.error("发布出错:", error);
            alert("网络错误，无法连接到后端。如果 C 同学还没写好接口，这是正常的。");
        }
    });
});