// 权益知识资料库路径
const DATA_URL = "../data/right-library.json";

// 保存资料
let allKnowledge = [];
let currentKnowledge = [];

// 页面加载完成后读取资料
document.addEventListener("DOMContentLoaded", function () {
    loadKnowledge();
});

// 读取 JSON 资料库
async function loadKnowledge() {
    const titleElement = document.getElementById("articleTitle");
    const contentElement = document.getElementById("articleContent");

    if (!titleElement || !contentElement) {
        console.error("没有找到 articleTitle 或 articleContent");
        return;
    }

    titleElement.textContent = "正在加载权益知识……";
    contentElement.textContent = "请稍候。";

    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("读取资料失败，状态码：" + response.status);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("JSON 最外层应该是数组");
        }

        allKnowledge = data;
        currentKnowledge = data;

        renderCatalog(data);

        if (data.length > 0) {
            showKnowledge(0);
        } else {
            titleElement.textContent = "暂无资料";
            contentElement.textContent = "资料库中暂时没有内容。";
        }

    } catch (error) {
        console.error("资料库加载失败：", error);

        titleElement.textContent = "资料加载失败";
        contentElement.textContent =
            "请检查 right-library.json 文件路径、JSON 格式，以及网页是否通过本地服务器运行。";
    }
}

// 获取资料标题
function getTitle(item) {
    return item.doc_name || item.title || "未命名资料";
}

// 获取资料正文
function getContent(item) {
    let result = "";

    if (item.content) {
        result += item.content + "\n\n";
    }

    if (Array.isArray(item.chapter_list)) {
        result += "章节目录：\n";
        result += item.chapter_list.join("\n") + "\n\n";
    }

    if (Array.isArray(item.paragraphs)) {
        item.paragraphs.forEach(function (paragraph) {
            if (paragraph.para_no) {
                result += paragraph.para_no + "\n";
            }

            if (paragraph.content) {
                result += paragraph.content + "\n\n";
            }
        });
    }

    return result.trim() || "暂无详细内容。";
}

// 生成左侧目录
function renderCatalog(data) {
    const catalog = document.querySelector(".catalog");

    if (!catalog) {
        console.error("没有找到左侧目录 .catalog");
        return;
    }

    catalog.innerHTML = "<h3>☷ 目录</h3>";

    data.forEach(function (item, index) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = getTitle(item);

        button.addEventListener("click", function () {
            showKnowledge(index);
        });

        catalog.appendChild(button);
    });
}
// 显示指定资料
function showKnowledge(index) {
    const item = currentKnowledge[index];

    if (!item) {
        return;
    }

    const titleElement = document.getElementById("articleTitle");
    const contentElement = document.getElementById("articleContent");

    titleElement.textContent = getTitle(item);
    contentElement.textContent = getContent(item);

    // 更新左侧目录选中状态
    const buttons = document.querySelectorAll(".catalog button");

    buttons.forEach(function (button, buttonIndex) {
        button.classList.toggle("active", buttonIndex === index);
    });
}

// 搜索资料
function searchArticles() {
    const input = document.getElementById("searchInput");

    if (!input) {
        return;
    }

    const keyword = input.value.trim().toLowerCase();

    if (!keyword) {
        currentKnowledge = allKnowledge;
        renderCatalog(currentKnowledge);

        if (currentKnowledge.length > 0) {
            showKnowledge(0);
        }

        return;
    }

    currentKnowledge = allKnowledge.filter(function (item) {
        const title = getTitle(item);
        const content = getContent(item);

        const keywords = Array.isArray(item.keyword)
            ? item.keyword.join(" ")
            : "";

        const text = title + " " + content + " " + keywords;

        return text.toLowerCase().includes(keyword);
    });

    renderCatalog(currentKnowledge);

    if (currentKnowledge.length > 0) {
        showKnowledge(0);
    } else {
        document.getElementById("articleTitle").textContent = "没有找到相关资料";
        document.getElementById("articleContent").textContent =
            "没有找到包含“" + keyword + "”的资料，请尝试其他关键词。";
    }
}

// 切换资料分类
function switchCategory(category, button) {
    document.querySelectorAll(".library-tabs button").forEach(function (item) {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    if (category === "全部") {
        currentKnowledge = allKnowledge;
    } else {
        currentKnowledge = allKnowledge.filter(function (item) {
            const title = getTitle(item);
            const keywords = Array.isArray(item.keyword)
                ? item.keyword.join(" ")
                : "";

            const text = title + " " + keywords;

            if (category === "法律法规") {
                return text.includes("法律") ||
                       text.includes("条例") ||
                       text.includes("法规");
            }

            if (category === "劳动关系") {
                return text.includes("劳动关系") ||
                       text.includes("劳动合同");
            }

            if (category === "工资报酬") {
                return text.includes("工资") ||
                       text.includes("劳动报酬");
            }

            if (category === "社会保险") {
                return text.includes("社会保险") ||
                       text.includes("养老保险") ||
                       text.includes("医疗保险");
            }

            return true;
        });
    }

    renderCatalog(currentKnowledge);

    if (currentKnowledge.length > 0) {
        showKnowledge(0);
    } else {
        document.getElementById("articleTitle").textContent = "暂无相关资料";
        document.getElementById("articleContent").textContent =
            "当前分类没有匹配到资料。";
    }
}
