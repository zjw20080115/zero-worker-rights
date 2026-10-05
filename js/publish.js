// js/publish.js
document.addEventListener('DOMContentLoaded', function() {
    
    const publishForm = document.getElementById('publishForm');

    publishForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // 1. 获取用户填写的数据
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const content = document.getElementById('content').value.trim();
        const isAnonymous = document.getElementById('isAnonymous').checked;

        // 2. 构造发给 C 同学后端的数据对象 (严格按照接口文档)
        const postData = {
            userId: 1,               // 目前先写死为 1
            title: title,
            content: content,
            category: category,
            anonymous: isAnonymous   // 发送布尔值 true/false
        };

        console.log("准备发送给后端的数据：", postData);

        // 3. 发送 POST 请求 (替换为 C 同学的 IP)
        const PUBLISH_API_URL = 'http://192.168.134.1:8080/api/posts'; 

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
            alert("网络错误，无法连接到后端。请确保 C 同学的后端已经启动。");
        }
    });
});