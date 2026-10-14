/* ============================================================
 * 零工权益助手 —— 我的权益记录模块（js/records.js）
 *
 * 数据全部来自 rights_records 表（不使用 /api/questionnaires）：
 *   GET    /api/rights-records/user/{userId}   拉取列表
 *   DELETE /api/rights-records/{id}            删除单条
 *
 * 卡片内两个折叠区域：
 *   历史问卷（rawAnswers 解析后以只读问卷形式展示）
 *   我的权益诊断（fullResult 完整报告 + 四个 AI 字段）
 *
 * 兼容性与容错：
 *   - 所有 JSON.parse 均用 try...catch 包裹，解析失败不中断渲染
 *   - rawAnswers 同时兼容数组格式与对象格式（历史数据）
 *   - 事件全部用事件委托绑定在 #records-list 上，列表重建后依然有效
 * ============================================================ */

console.log("records.js 成功加载！");
/* ---------- 1. 用户 ID 与接口地址 ---------- */
const userId = localStorage.getItem('userId') || 1;
const RECORDS_API_BASE = 'http://10.72.39.141:8080/api/rights-records';
const RECORDS_API_URL = `${RECORDS_API_BASE}/user/${userId}`;

/* 当前记录列表（渲染与点击展开时共用） */
let currentRecords = [];

/* ---------- 2. 展示用的静态映射（与 test.js 中的定义保持一致） ---------- */

/* 题目编号 -> 题干（原始问卷展示用） */
const QUESTION_TEXTS = {
    'S0-1': '您目前主要从事下列哪一类工作？',
    'S0-2': '您的工作任务主要通过何种方式获得？',
    A1: '您与哪一方约定工作内容、报酬标准与日常管理？',
    A2: '是否签订过书面用工协议或劳动合同？',
    A3: '平台是否要求或引导您登记为个体工商户？',
    A4: '您能否自主决定是否接单、何时开始与结束工作？',
    B1: '每单报酬标准、派单顺序等是否由平台系统自动确定？',
    B2: '是否存在服务分、接单率、好评率等考核指标直接影响接单机会？',
    B3: '对平台作出的扣分、罚款、限制接单等处理，是否设有可实际使用的申诉渠道？',
    C1: '劳务报酬由谁实际支付？',
    C2: '报酬结算方式属于下列哪类？',
    C3: '平台是否从每笔报酬中收取信息服务费或抽成？',
    D1: '平均每天处于接单或待命状态的时间约为？',
    D2: '是否存在最低在线时长、出勤打卡或连续工作等要求？',
    E1: '工作中是否需要使用交通工具（电动自行车、汽车、摩托车等）？',
    E2: '过去一年内，工作中是否发生过受伤或意外？',
    E3: '如曾发生受伤，相关医疗等费用主要由谁承担？',
    F1: '您是否以灵活就业人员身份自行参加了职工基本养老保险或医疗保险？',
    F2: '您所在平台是否曾为您缴纳过任何社会保险？',
    F3: '是否加入过工会组织或平台从业者代表机构？',
};

/* 维度满分与中文名 */
const DIMENSION_FULL = { A: 7, B: 5, C: 5, D: 4, E: 6, F: 5 };
const DIMENSION_NAMES = {
    A: '用工关系',
    B: '算法规则',
    C: '报酬支付',
    D: '工作时长',
    E: '职业安全',
    F: '社会保障',
};

/* 风险灯图标与底色 */
const LIGHT_ICONS = { green: '🟢', yellow: '🟡', red: '🔴' };
const LIGHT_BG = { green: '#e8f5e9', yellow: '#fff8e1', red: '#fdecea' };

/* 总体等级配色（与 test.js 的 LEVEL_META 一致） */
const LEVEL_COLORS = { 强: '#e5484d', 中: '#d99b00', 弱: '#2e7d32' };

/* ---------- 3. 工具函数 ---------- */

/* 转义 HTML，防止后端返回的文本被当成标签渲染 */
function escapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/* 安全解析 JSON 字符串：空值 / 非法 JSON 一律返回 null，不抛异常 */
function safeParse(json) {
    if (typeof json !== 'string' || json.trim() === '') return null;
    try {
        return JSON.parse(json);
    } catch (err) {
        console.warn('[records.js] JSON 解析失败，已按空数据处理：', err);
        return null;
    }
}

/* ---------- 4. 渲染记录列表 ---------- */
function renderRecords(records) {
    const list = document.getElementById('records-list');
    if (!list) return;

    currentRecords = Array.isArray(records) ? records : [];

    if (currentRecords.length === 0) {
        list.innerHTML = '<p>暂无记录，快去自测吧！</p>';
        return;
    }

    list.innerHTML = currentRecords
        .map(
            (r) => `
        <div class="record-card">
            <div class="card-header">
                <span class="problem-badge">${escapeHtml(r.problemType)}</span>
                <div class="header-right">
                    <span class="record-date">${escapeHtml(r.createTime)}</span>
                    <button class="delete-btn" data-id="${r.id}">删除</button>
                </div>
            </div>
            <p class="record-desc">${escapeHtml(r.description || '无描述')}</p>
            <div class="detail-link" data-target="raw-answers-${r.id}">历史问卷</div>
            <div id="raw-answers-${r.id}" class="detail-content" style="display: none;"></div>
            <div class="detail-link" data-target="full-result-${r.id}">我的权益诊断</div>
            <div id="full-result-${r.id}" class="detail-content" style="display: none;"></div>
        </div>`
        )
        .join('');
}

/* ---------- 5. 折叠区域的内容渲染 ---------- */

/* AI 分析区块（诊断区下方附带显示） */
function renderAiBlock(r) {
    if (!r.aiAnalysis) {
        return '<p>您尚未进行 AI 分析，无法生成诊断结果</p>';
    }
    return `
        <p>💡 初步分析：${escapeHtml(r.aiAnalysis)}</p>
        <p>📋 建议材料：${escapeHtml(r.materials)}</p>
        <p>✅ 申报前检查：${escapeHtml(r.checkResult)}</p>
        <p>➡️ 下一步建议：${escapeHtml(r.nextStep)}</p>`;
}

/* 原始问卷：rawAnswers -> 只读问答列表。
 * 同时兼容两种历史格式：
 *   新格式（数组）：[{"A1":"平台企业"},{"A2":"未签订任何书面协议"}]
 *   旧格式（对象）：{"A1":"平台企业","A2":"未签订任何书面协议"} */
function renderRawAnswers(r) {
    console.log('准备渲染的历史问卷数据:', r.rawAnswers);
    const raw = safeParse(r.rawAnswers);
    let entries = [];

    if (Array.isArray(raw)) {
        // 数组格式：逐个元素展开成 [题目id, 作答] 对
        raw.forEach((item) => {
            if (item && typeof item === 'object') {
                Object.entries(item).forEach(([qid, answer]) => {
                    entries.push([qid, answer]);
                });
            }
        });
    } else if (raw && typeof raw === 'object') {
        // 对象格式：直接取键值对
        entries = Object.entries(raw);
    }

    if (entries.length === 0) {
        return '<p>数据损坏或暂无记录</p>';
    }

    return entries
        .map(([qid, answer]) => {
            // 未收录的新题目退回显示编号，作答为空显示"未作答"
            const text = QUESTION_TEXTS[qid] || qid;
            const answerText = escapeHtml(answer) || '（未作答）';
            return `
            <p class="qa-item"><strong>题目：${text}</strong><br>您的作答：${answerText}</p>`;
        })
        .join('');
}

/* 完整报告：fullResult -> 等级/维度得分/风险灯/路径推荐 + 四个 AI 字段 */
function renderFullResult(r) {
    const full = safeParse(r.fullResult);
    let html = '';

    // 自测总结（一条简洁的总结字符串，新旧数据都有）
    if (r.selfTestResult) {
        html += `<p><strong>自测总结：</strong>${escapeHtml(r.selfTestResult)}</p>`;
    }

    if (full && typeof full === 'object') {
        // ① 总分与总体风险等级（带颜色）
        const level = full.overallLevel || '未知';
        const color = LEVEL_COLORS[level] || '#666666';
        html += `
            <p><strong>总体风险等级：</strong><span class="report-level" style="background:${color};">${escapeHtml(level)}</span>A+B 核心得分：${full.abTotal ?? '—'} / 12 分</p>`;

        // ② 各维度得分与风险灯（绿/黄/红）
        const scores = full.dimensionScores || {};
        const lights = full.lights || {};
        html += `<div>${Object.keys(DIMENSION_FULL)
            .map((dim) => {
                const light = lights[dim] || '';
                const icon = LIGHT_ICONS[light] || '';
                const bg = LIGHT_BG[light] || '#f7f9fc';
                return `<span class="risk-light" style="background:${bg};">${icon} ${DIMENSION_NAMES[dim]} ${scores[dim] ?? 0}/${DIMENSION_FULL[dim]}分</span>`;
            })
            .join('')}</div>`;

        // ③ 红旗拦截（如有）
        if (Array.isArray(full.redFlags) && full.redFlags.length > 0) {
            html += `<p><strong>⚠️ 红旗拦截：</strong>${full.redFlags
                .map(escapeHtml)
                .join('、')}</p>`;
        }

        // ④ 路径推荐（如有）
        const recs = full.recommendations;
        if (Array.isArray(recs) && recs.length > 0) {
            html += recs
                .map((rec) => {
                    const badgeBg = rec.level === '强' ? '#e5484d' : '#d99b00';
                    return `
                <div class="rec-card">
                    <p style="margin:0 0 4px;"><strong>${escapeHtml(rec.title)}</strong><span style="font-size:12px;background:${badgeBg};color:#ffffff;padding:1px 8px;border-radius:10px;margin-left:8px;">${escapeHtml(rec.level)}</span></p>
                    ${rec.description ? `<p style="margin:0 0 4px;">${escapeHtml(rec.description)}</p>` : ''}
                    ${rec.templates && rec.templates.length ? `<p style="margin:0;"><strong>相关模板：</strong>${rec.templates.map(escapeHtml).join('、')}</p>` : ''}
                    ${rec.laws && rec.laws.length ? `<p style="margin:0;"><strong>相关法规：</strong>${rec.laws.map(escapeHtml).join('、')}</p>` : ''}
                </div>`;
                })
                .join('');
        }
    } else if (!r.selfTestResult) {
        // 旧数据且连自测总结都没有：显示容错文案
        html += '<p>暂无详细报告</p>';
    }

    // ⑤ 四个 AI 字段（如有，一并显示在下方）
    html += renderAiBlock(r);
    return html;
}

/* ---------- 6. 加载记录（真实接口） ---------- */
async function loadRecords() {
    console.log('[records.js] ① loadRecords 开始执行，请求地址：', RECORDS_API_URL);
    const list = document.getElementById('records-list');
    if (!list) {
        console.error('[records.js] 未找到 #records-list 容器，渲染中止');
        return;
    }
    list.innerHTML = '<p>加载中...</p>';

    try {
        const res = await fetch(RECORDS_API_URL);
        console.log('[records.js] ② 收到响应，状态码：', res.status);
        if (!res.ok) {
            throw new Error(`接口返回状态码 ${res.status}`);
        }
        const data = await res.json();
        console.log(
            '[records.js] ③ 数据解析成功，记录条数：',
            Array.isArray(data) ? data.length : '非数组，按空列表处理'
        );
        // 防御：后端若意外返回非数组（如 { data: [...] } 包了一层），按空列表处理
        renderRecords(Array.isArray(data) ? data : []);
        console.log('[records.js] ④ 列表渲染完成');
    } catch (err) {
        console.error('[records.js] ⑤ 加载权益记录失败：', err);
        if (list) {
            list.innerHTML =
                '<p style="color:#e5484d;font-weight:bold;">❌ 加载失败，请检查网络或查看F12报错</p>';
        }
    }
}

/* ---------- 7. 删除记录 ---------- */
async function deleteRecord(recordId, btn) {
    console.log('[records.js] 准备删除记录，请求地址：', `${RECORDS_API_BASE}/${recordId}`);
    btn.disabled = true;
    try {
        const res = await fetch(`${RECORDS_API_BASE}/${recordId}`, {
            method: 'DELETE',
        });
        if (!res.ok) {
            throw new Error(`接口返回状态码 ${res.status}`);
        }
        alert('✅ 删除成功');
        loadRecords(); // 删除成功后刷新列表
    } catch (err) {
        console.error('[records.js] 删除记录失败：', err);
        alert('❌ 删除失败，请检查网络或查看F12报错');
    } finally {
        btn.disabled = false;
    }
}

/* ---------- 8. 事件委托（绑定在 #records-list 上，列表重建后依然有效） ---------- */
const recordsList = document.getElementById('records-list');
if (recordsList) {
    recordsList.addEventListener('click', (e) => {
        // 分支一：删除按钮
        console.log('=== 点击被触发了！目标：', e.target);
        const delBtn = e.target.closest('.delete-btn');
        if (delBtn) {
            const recordId = delBtn.dataset.id;
            if (!confirm(`确定删除这条记录（ID：${recordId}）吗？`)) return;
            deleteRecord(recordId, delBtn);
            return;
        }

        // 分支二：详情链接（历史问卷 / 我的权益诊断）
        const link = e.target.closest('.detail-link');
        if (!link) return;

        const targetId = link.dataset.target; // 形如 raw-answers-3 / full-result-3
        const target = document.getElementById(targetId);
        if (!target) return;

        // 根据 data-target 找到对应记录并渲染内容
        const recordId = targetId.replace(/^(raw-answers|full-result)-/, '');
        const record = currentRecords.find((r) => String(r.id) === recordId);
        if (!record) return;

        if (targetId.startsWith('raw-answers')) {
            target.innerHTML = renderRawAnswers(record);
        } else {
            target.innerHTML = renderFullResult(record);
        }
        // 用内联样式直接控制显隐（绕过任何 CSS 类与 !important 的冲突）：
        // 当前隐藏（none 或空）则显示，否则隐藏
        target.style.display =
            target.style.display === 'none' || target.style.display === ''
                ? 'block'
                : 'none';
        console.log('显示状态切换为:', target.style.display);
    });
}

/* ---------- 9. 页面加载时拉取数据 ---------- */
/* 绑定在 DOMContentLoaded 上，确保 DOM 就绪后再发请求；
   若脚本执行时 DOM 已就绪（readyState 非 loading），直接执行 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRecords);
} else {
    loadRecords();
}
