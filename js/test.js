/* ============================================================
 * 零工权益助手 —— 权益自测模块（js/test.js）
 *
 * 数据驱动设计：题目、选项、分值全部来自 questions 数组，
 * 渲染、计分、结果展示的逻辑都不依赖题目数量。
 * 以后整理好 8 道正式题目，只需替换 questions 数组即可。
 *
 * 题目字段说明：
 *   id        —— 题目编号（用于关联 DOM，需唯一）
 *   text      —— 题干
 *   dimension —— 所属维度（结果页按维度汇总得分）
 *   options   —— 选项数组，每项 { text: 选项文字, score: 该选项得分 }
 * ============================================================ */

/* ---------- 1. 题目数据（先用 2 道假题测试） ---------- */
const questions = [
    {
        id: 1,
        text: '你是否与用工方签订了书面劳动合同？',
        dimension: '劳动合同',
        options: [
            { text: '签了', score: 2 },
            { text: '没签', score: 0 },
        ],
    },
    {
        id: 2,
        text: '用工方是否为你缴纳了社会保险？',
        dimension: '社会保险',
        options: [
            { text: '缴了', score: 2 },
            { text: '没缴', score: 0 },
        ],
    },
];

/* ---------- 2. DOM 元素引用 ---------- */
const introSection = document.getElementById('intro');
const quizSection = document.getElementById('quiz');
const resultSection = document.getElementById('result');
const quizForm = document.getElementById('quiz-form');
const progressText = document.getElementById('progress');
const resultSummary = document.getElementById('result-summary');
const resultList = document.getElementById('result-list');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

/* ---------- 3. 渲染答题区：遍历 questions 动态生成 HTML ---------- */
function renderQuiz() {
    quizForm.innerHTML = questions
        .map((q) => {
            // 每个选项生成一个 .option 元素，用 data-* 记录所属题目和分值
            const optionsHtml = q.options
                .map(
                    (opt) =>
                        `<div class="option" data-question-id="${q.id}" data-score="${opt.score}">${opt.text}</div>`
                )
                .join('');
            return `
                <div class="question-block">
                    <h3 class="q-title">${q.id}. ${q.text}<span class="error-star" style="display: none; color: #e5484d; margin-left: 5px;">*</span></h3>
                    <div class="option-list">${optionsHtml}</div>
                </div>`;
        })
        .join('');
}

/* ---------- 4. 已答题数统计 ---------- */
function countAnswered() {
    const blocks = quizForm.querySelectorAll('.question-block');
    return Array.from(blocks).filter(
        (block) => block.querySelector('.option.selected') !== null
    ).length;
}

/* 找到第一道未作答的题目，用于提交时的防漏题校验和定位滚动 */
function findFirstUnanswered() {
    const blocks = quizForm.querySelectorAll('.question-block');
    return (
        Array.from(blocks).find(
            (block) => block.querySelector('.option.selected') === null
        ) || null
    );
}

/* 显示所有未作答题目的红色星号并添加高亮背景（提交时的防漏题高亮） */
function showUnansweredStars() {
    quizForm.querySelectorAll('.question-block').forEach((block) => {
        if (block.querySelector('.option.selected') === null) {
            const star = block.querySelector('.error-star');
            if (star) star.style.display = 'inline';
            block.classList.add('highlight-error');
        }
    });
}

/* 隐藏全部红色星号并清除高亮背景（重新测试时恢复初始状态） */
function hideAllStars() {
    quizForm.querySelectorAll('.question-block').forEach((block) => {
        const star = block.querySelector('.error-star');
        if (star) star.style.display = 'none';
        block.classList.remove('highlight-error');
    });
}

/* ---------- 5. 更新进度文本（已答数 / 总题数） ---------- */
function updateProgress() {
    progressText.textContent = `${countAnswered()}/${questions.length}`;
}

/* ---------- 6. 计算各维度得分 ---------- */
function calculateScores() {
    const dimensionScores = {}; // { 维度名: { earned: 已得分, total: 满分 } }
    questions.forEach((q) => {
        // 找到该题被选中的选项，未作答按 0 分处理
        const selected = quizForm.querySelector(
            `.option[data-question-id="${q.id}"].selected`
        );
        const earned = selected ? Number(selected.dataset.score) : 0;
        // 该题满分 = 所有选项中分值最高的一项
        const max = Math.max(...q.options.map((opt) => opt.score));

        if (!dimensionScores[q.dimension]) {
            dimensionScores[q.dimension] = { earned: 0, total: 0 };
        }
        dimensionScores[q.dimension].earned += earned;
        dimensionScores[q.dimension].total += max;
    });
    return dimensionScores;
}

/* ---------- 7. 结果展示：填充摘要区和列表区 ---------- */
function showResult() {
    const dimensionScores = calculateScores();
    const earnedAll = Object.values(dimensionScores).reduce(
        (sum, d) => sum + d.earned,
        0
    );
    const totalAll = Object.values(dimensionScores).reduce(
        (sum, d) => sum + d.total,
        0
    );
    // 得分比例，用于判断风险等级（防止满分合计为 0 导致除零）
    const ratio = totalAll === 0 ? 0 : earnedAll / totalAll;

    let conclusion;
    if (ratio >= 0.75) {
        conclusion = '你的权益保障情况良好。';
    } else if (ratio >= 0.4) {
        conclusion = '你的权益存在一定风险，建议查看「权益知识」页了解相关政策。';
    } else {
        conclusion = '你的权益风险较高，建议尽快咨询专业机构或寻求法律帮助。';
    }

    // 结果摘要区：总分 + 结论（.notice 是 A 的提示框样式）
    resultSummary.innerHTML = `
        <p>自测总分：<strong>${earnedAll}</strong> / ${totalAll} 分</p>
        <p class="notice">${conclusion}</p>`;

    // 结果列表区：按维度逐条展示得分
    resultList.innerHTML = Object.entries(dimensionScores)
        .map(
            ([dimension, s]) =>
                `<li>${dimension}：<strong>${s.earned}</strong> / ${s.total} 分</li>`
        )
        .join('');
}

/* ---------- 8. 事件绑定 ---------- */

// 8.1 开始自测：隐藏说明区，渲染题目，显示答题区
startBtn.addEventListener('click', () => {
    renderQuiz();
    progressText.textContent = `0/${questions.length}`;
    introSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
});

// 8.2 选项点击（事件委托）：同一题内单选，选中的选项加 .selected 类
quizForm.addEventListener('click', (e) => {
    const option = e.target.closest('.option');
    if (!option) return;
    // 先清除同组（同一题）所有选项的选中状态，再选中当前项
    option.parentElement
        .querySelectorAll('.option')
        .forEach((opt) => opt.classList.remove('selected'));
    option.classList.add('selected');
    // 交互优化：该题已有答案，自动隐藏红色星号并移除高亮背景
    // （选项当前是 div 点击实现，等效于单选按钮的 change 事件）
    const block = option.closest('.question-block');
    const star = block.querySelector('.error-star');
    if (star) star.style.display = 'none';
    block.classList.remove('highlight-error');
    updateProgress();
});

// 8.3 提交：submit-btn 通过 form="quiz-form" 关联此表单，
//     点击按钮或按回车都会触发 submit 事件，必须先阻止默认跳转
quizForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 防漏题：存在未作答的题目时，提示、高亮所有未作答题目的
    // 红色星号，并滚动到第一道未作答题目，中断提交
    const firstUnanswered = findFirstUnanswered();
    if (firstUnanswered) {
        alert('还有题目没有作答哦，请完成所有题目后提交');
        showUnansweredStars();
        firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    showResult();
});

// 8.4 重新测试：彻底清空状态，重置进度，回到说明区
restartBtn.addEventListener('click', () => {
    // 彻底清空：先移除所有选项的 .selected 高亮，再隐藏所有红色星号、
    // 清除高亮背景（highlight-error），最后清空表单内容。
    // 虽然 renderQuiz 每次都会重建 DOM，但显式清除可以保证
    // 任何情况下都不会残留状态
    quizForm.querySelectorAll('.option.selected').forEach((opt) => {
        opt.classList.remove('selected');
    });
    hideAllStars();
    quizForm.innerHTML = '';
    resultSummary.innerHTML = '';
    resultList.innerHTML = '';
    progressText.textContent = `0/${questions.length}`;
    resultSection.classList.add('hidden');
    introSection.classList.remove('hidden');
});

/* ============================================================
 * 9. AI 分析区逻辑（附加功能，不影响上方自测流程）
 * ============================================================ */
const aiInput = document.getElementById('ai-input');
const aiAnalyzeBtn = document.getElementById('ai-analyze-btn');
const aiResult = document.getElementById('ai-result');

// 9.1 监听"开始AI分析"按钮点击
aiAnalyzeBtn.addEventListener('click', () => {
    const description = aiInput.value.trim();

    // 9.2 空输入校验
    if (description === '') {
        alert('请先描述你遇到的情况');
        return;
    }

    // 9.3 显示"思考中"提示，并禁用按钮防止重复点击
    aiResult.style.display = 'block';
    aiResult.innerHTML = '<p>AI正在思考中...</p>';
    aiAnalyzeBtn.disabled = true;

    /* ----------------------------------------------------------
     * 后端接口就绪后：删掉下方 setTimeout 模拟代码块（9.4），
     * 启用这段真实 fetch 请求即可（description 已在上方取好）：
     *
     * fetch('https://你的后端地址/api/analyze', {
     *     method: 'POST',
     *     headers: { 'Content-Type': 'application/json' },
     *     body: JSON.stringify({ description: description }),
     * })
     *     .then((res) => {
     *         if (!res.ok) throw new Error('接口请求失败');
     *         return res.json();
     *     })
     *     .then((data) => {
     *         aiResult.innerHTML = `<p>${data.result}</p>`;
     *     })
     *     .catch(() => {
     *         aiResult.innerHTML = '<p>AI 分析失败，请稍后重试。</p>';
     *     })
     *     .finally(() => {
     *         aiAnalyzeBtn.disabled = false;
     *     });
     * ---------------------------------------------------------- */

    // 9.4 模拟后端接口：延迟 1.5 秒后返回假的分析结果
    setTimeout(() => {
        aiResult.innerHTML = `
            <p><strong>初步分析：</strong>涉及工资拖欠。</p>
            <p><strong>建议准备：</strong>工资流水、聊天记录。</p>
            <p><strong>下一步建议：</strong>向劳动监察大队投诉。</p>`;
        aiAnalyzeBtn.disabled = false;
    }, 1500);
});
