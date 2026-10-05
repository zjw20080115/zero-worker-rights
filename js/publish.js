// js/publish.js
document.addEventListener('DOMContentLoaded', function() {
    
    const publishForm = document.getElementById('publishForm');

    publishForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value;
        const content = document.getElementById('content').value.trim();
        const isAnonymous = document.getElementById('isAnonymous').checked;

        const currentUserId = parseInt(localStorage.getItem('userId')) || 1;

        const postData = {
            userId: currentUserId,
            title: title,
            content: content,
            category: category,
            anonymous: isAnonymous
        };

        const PUBLISH_API_URL = 'http://10.72.39.141:8080/api/posts'; 

        try {
            const response = await fetch(PUBLISH_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                showSuccessModal();
            } else {
                showCenterToast("发布失败，请检查后端。", "error");
            }
        } catch (error) {
            console.error("发布出错:", error);
            showCenterToast("网络错误，无法连接到后端。", "error");
        }
    });
});

// 显示发布成功的居中弹窗
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.id = 'successModal';
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;">
            <div style="background: white; width: 90%; max-width: 380px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.3); padding: 40px 30px; text-align: center; animation: modalFadeIn 0.3s ease;">
                <div style="width: 70px; height: 70px; background: #e6f4ea; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#34a853" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
                <h3 style="font-size: 20px; color: #1e293b; font-weight: 700; margin-bottom: 10px;">发布成功！</h3>
                <p style="font-size: 14px; color: #64748b; margin-bottom: 25px;">你的问题已经发布到互助墙</p>
                <button onclick="closeSuccessModal()" style="width: 100%; padding: 12px; background: #1e5a8a; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer;">
                    返回首页
                </button>
            </div>
        </div>
        <style>@keyframes modalFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }</style>
    `;
    document.body.appendChild(modal);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
    window.location.href = "community.html";
}