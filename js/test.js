/* ============================================================
 * 零工权益助手 —— 权益自测模块（js/test.js）
 *
 * 数据驱动设计：题目、选项、分值全部来自 questions 数组，
 * 渲染、计分、结果展示的逻辑都不依赖题目数量。
 * 增删或调整题目，只需修改 questions 数组即可。
 *
 * 题目字段说明：
 *   id        —— 题目编号（用于关联 DOM，需唯一）
 *   text      —— 题干
 *   dimension —— 所属维度（结果页按维度汇总得分）
 *   options   —— 选项数组，每项 { text: 选项文字, score: 该选项得分 }
 * ============================================================ */

/* ---------- 1. 题目数据（真实问卷：S0 定位题不计分，A/B/C/D/E/F 维度计分） ---------- */
const questions = [
    {
        id: 'S0-1',
        text: '您目前主要从事下列哪一类工作？',
        dimension: '定位',
        options: [
            { text: '出行类平台接单', score: 0 },
            { text: '即时配送类平台接单', score: 0 },
            { text: '同城货运类平台接单', score: 0 },
            { text: '家政服务', score: 0 },
            { text: '网络内容创作', score: 0 },
            { text: '线上零工与众包', score: 0 },
            { text: '技能服务接单', score: 0 },
            { text: '平台仓配与分拣等其他接单岗位', score: 0 },
            { text: '其他', score: 0 },
        ],
    },
    {
        id: 'S0-2',
        text: '您的工作任务主要通过何种方式获得？',
        dimension: '定位',
        options: [
            { text: '由某一互联网平台统一派单', score: 0 },
            { text: '在平台接单但可自主决定是否承接', score: 0 },
            { text: '自行揽活或直接与客户约定', score: 0 },
            { text: '多种方式混合', score: 0 },
        ],
    },
    {
        id: 'A1',
        text: '您与哪一方约定工作内容、报酬标准与日常管理？',
        dimension: 'A',
        options: [
            { text: '平台企业', score: 1 },
            { text: '劳务外包单位或加盟服务商', score: 1 },
            { text: '直接服务的客户', score: 0 },
            { text: '不清楚/多方交错', score: 1 },
        ],
    },
    {
        id: 'A2',
        text: '是否签订过书面用工协议或劳动合同？',
        dimension: 'A',
        options: [
            { text: '与平台企业签订', score: 1 },
            { text: '与外包或加盟商签订', score: 1 },
            { text: '与客户方签订', score: 0 },
            { text: '未签订任何书面协议', score: 2 },
        ],
    },
    {
        id: 'A3',
        text: '平台是否要求或引导您登记为个体工商户？',
        dimension: 'A',
        options: [
            { text: '是', score: 2 },
            { text: '否', score: 0 },
            { text: '不清楚', score: 1 },
        ],
    },
    {
        id: 'A4',
        text: '您能否自主决定是否接单、何时开始与结束工作？',
        dimension: 'A',
        options: [
            { text: '完全自主', score: 0 },
            { text: '基本自主但存在激励约束', score: 1 },
            { text: '须按排班或任务量要求接单', score: 2 },
            { text: '不清楚', score: 1 },
        ],
    },
    {
        id: 'B1',
        text: '每单报酬标准、派单顺序等是否由平台系统自动确定？',
        dimension: 'B',
        options: [
            { text: '是，由平台统一确定', score: 2 },
            { text: '部分由平台确定部分可协商', score: 1 },
            { text: '否，由我与客户自行约定', score: 0 },
        ],
    },
    {
        id: 'B2',
        text: '是否存在服务分、接单率、好评率等考核指标直接影响接单机会？',
        dimension: 'B',
        options: [
            { text: '是', score: 1 },
            { text: '否', score: 0 },
        ],
    },
    {
        id: 'B3',
        text: '对平台作出的扣分、罚款、限制接单等处理，是否设有可实际使用的申诉渠道？',
        dimension: 'B',
        options: [
            { text: '有且能实际处理', score: 0 },
            { text: '有渠道但形同虚设', score: 1 },
            { text: '没有申诉渠道', score: 2 },
        ],
    },
    {
        id: 'C1',
        text: '劳务报酬由谁实际支付？',
        dimension: 'C',
        options: [
            { text: '平台统一结算', score: 0 },
            { text: '外包或加盟商支付', score: 1 },
            { text: '客户直接支付', score: 0 },
            { text: '混合支付', score: 1 },
        ],
    },
    {
        id: 'C2',
        text: '报酬结算方式属于下列哪类？',
        dimension: 'C',
        options: [
            { text: '按单即时结算', score: 0 },
            { text: '按周期批量结算', score: 1 },
            { text: '含底薪或保底加提成', score: 0 },
            { text: '纯按件计酬无保底', score: 2 },
        ],
    },
    {
        id: 'C3',
        text: '平台是否从每笔报酬中收取信息服务费或抽成？',
        dimension: 'C',
        options: [
            { text: '是', score: 1 },
            { text: '否', score: 0 },
            { text: '不清楚', score: 2 },
        ],
    },
    {
        id: 'D1',
        text: '平均每天处于接单或待命状态的时间约为？',
        dimension: 'D',
        options: [
            { text: '4小时以内', score: 0 },
            { text: '4-8小时', score: 1 },
            { text: '8-12小时', score: 2 },
            { text: '12小时以上', score: 2 },
        ],
    },
    {
        id: 'D2',
        text: '是否存在最低在线时长、出勤打卡或连续工作等要求？',
        dimension: 'D',
        options: [
            { text: '有明确要求', score: 2 },
            { text: '无硬性要求', score: 0 },
            { text: '无硬性要求但存在隐性考核', score: 1 },
        ],
    },
    {
        id: 'E1',
        text: '工作中是否需要使用交通工具（电动自行车、汽车、摩托车等）？',
        dimension: 'E',
        options: [
            { text: '经常使用', score: 2 },
            { text: '偶尔使用', score: 1 },
            { text: '不需要', score: 0 },
        ],
    },
    {
        id: 'E2',
        text: '过去一年内，工作中是否发生过受伤或意外？',
        dimension: 'E',
        options: [
            { text: '发生过', score: 2 },
            { text: '险些发生', score: 1 },
            { text: '没有', score: 0 },
        ],
    },
    {
        id: 'E3',
        text: '如曾发生受伤，相关医疗等费用主要由谁承担？',
        dimension: 'E',
        options: [
            { text: '自行承担', score: 2 },
            { text: '平台或保险协助承担', score: 0 },
            { text: '不清楚', score: 1 },
        ],
    },
    {
        id: 'F1',
        text: '您是否以灵活就业人员身份自行参加了职工基本养老保险或医疗保险？',
        dimension: 'F',
        options: [
            { text: '是已参保', score: 0 },
            { text: '曾参保但已中断', score: 1 },
            { text: '从未参保', score: 2 },
        ],
    },
    {
        id: 'F2',
        text: '您所在平台是否曾为您缴纳过任何社会保险？',
        dimension: 'F',
        options: [
            { text: '是', score: 0 },
            { text: '否', score: 2 },
            { text: '不清楚', score: 1 },
        ],
    },
    {
        id: 'F3',
        text: '是否加入过工会组织或平台从业者代表机构？',
        dimension: 'F',
        options: [
            { text: '是', score: 0 },
            { text: '否', score: 1 },
            { text: '不清楚', score: 1 },
        ],
    },
];

/* ---------- 2. DOM 元素引用 ---------- */
const introSection = document.getElementById('intro');
const quizSection = document.getElementById('quiz');
const resultSection = document.getElementById('result');
const quizForm = document.getElementById('quiz-form');
const progressText = document.getElementById('progress');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const saveBtn = document.getElementById('save-record-btn');
const saveMessage = document.getElementById('save-message');

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

/* ============================================================
 * 6. 算分引擎
 * ============================================================ */

/* 结果区所有容器（若 HTML 中缺少某个容器，渲染时会跳过并警告，不会中断） */
const RESULT_CONTAINERS = [
    'result-summary',
    'result-conclusion',
    'result-red-flags',
    'result-risk-lights',
    'result-list',
    'recommendation-content',
];

/* 各维度满分与中文显示名 */
const DIMENSION_FULL = { A: 7, B: 5, C: 5, D: 4, E: 6, F: 5 };
const DIMENSION_NAMES = {
    A: '用工关系',
    B: '算法规则',
    C: '报酬支付',
    D: '工作时长',
    E: '职业安全',
    F: '社会保障',
};

/* 风险灯阈值：得分 >= red 亮红灯，>= yellow 亮黄灯，否则绿灯 */
const LIGHT_RULES = {
    A: { yellow: 3, red: 5 }, // 0-2绿 3-4黄 5-7红
    B: { yellow: 2, red: 4 }, // 0-1绿 2-3黄 4-5红
    C: { yellow: 2, red: 4 },
    D: { yellow: 2, red: 3 }, // 0-1绿 2黄 3-4红
    E: { yellow: 3, red: 5 }, // 0-2绿 3-4黄 5-6红
    F: { yellow: 2, red: 4 },
};

/* 结论等级对应的文案与配色（强红 / 中黄 / 弱绿） */
const LEVEL_META = {
    强: {
        text: '您的权益风险较高，建议尽快对照下方路径采取行动，并保留好相关证据。',
        bg: '#fdecea',
        border: '#e5484d',
    },
    中: {
        text: '您的权益存在一定风险，建议关注下方提示，并留意平台规则与政策变化。',
        bg: '#fff8e1',
        border: '#d99b00',
    },
    弱: {
        text: '您的权益保障情况总体良好，建议继续保持并关注相关政策变化。',
        bg: '#e8f5e9',
        border: '#2e7d32',
    },
};

/* 路径推荐映射：根据触发条件渲染对应的模板与法规 */
const RECOMMENDATIONS = [
    {
        id: 'injury',
        title: '职业伤害申报',
        level: '强',
        // 触发条件：曾受伤或担心受伤（E2 选「发生过」或「险些发生」）
        trigger: (answers) => ['发生过', '险些发生'].includes(answers['E2']),
        description: (answers) => {
            const job = answers['S0-1'] || '未知';
            return (
                '如曾受伤或担心受伤：系统将依据您的职业类型提示职业伤害保障覆盖可能性（您填写的职业类型：' +
                job +
                '）。属出行/即时配送/同城货运等行业可核对平台是否按单缴费，再走职业伤害确认与待遇申请。'
            );
        },
        templates: [
            '职业伤害确认结论书',
            '不予确认职业伤害结论书',
            '新就业形态人员职业伤害保障费缴费申报表',
            '职业伤害保障伤残待遇申请表',
            '职业伤害保障死亡待遇申请表',
            '劳动能力鉴定申请表',
            '职业伤害保障待遇垫付情况说明',
            '职业伤害保障待遇申请超期说明',
            '职业伤害保障跨省异地就医（康复）备案表',
            '职业伤害保障跨省异地配置辅助器具备案表',
            '职业伤害人员劳动能力初次（复查）鉴定结论书',
            '职业伤害人员劳动能力再次鉴定结论书',
            '知情同意确认书',
            '待遇申请表申报说明',
            '新就业形态人员职业伤害保障办法（试行）',
            '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）',
            '工伤认定申请表',
            '认定工伤决定书',
            '工伤认定申请受理决定书',
            '工伤认定申请不予受理决定书',
            '不予认定工伤决定书',
            '工伤认定办法',
        ],
        laws: [
            '人社部发〔2021〕110号',
            '新就业形态人员职业伤害保障办法（试行）',
            '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）',
            '工伤认定办法',
        ],
    },
    {
        id: 'labor-relation',
        title: '劳动关系认定',
        level: '强',
        // 触发条件：A 维度红灯（用工从属性强，需确认是否构成劳动关系）
        trigger: (_answers, lights) => lights['A'] === 'red',
        description:
            '想确认「是不是员工」：收集接单记录、考核、报酬、规则等证据，申请劳动仲裁确认劳动关系；存在事实劳动关系是走传统工伤认定（工伤保险）的前置条件。',
        templates: [
            '中华人民共和国劳动合同法',
            '关于审理劳动争议案件适用法律问题的解释（二）',
            '工伤认定办法',
        ],
        laws: ['劳动合同法', '最高法指导案例 237–240 号', '劳动争议司法解释（二）', '工伤认定办法'],
    },
    {
        id: 'pay',
        title: '报酬追索',
        level: '中',
        // 触发条件：C 维度红灯（报酬支付风险高）
        trigger: (_answers, lights) => lights['C'] === 'red',
        description: '报酬被拖、被乱扣：向劳动保障监察投诉或申请仲裁，要求按时足额支付。',
        templates: ['中华人民共和国劳动合同法', '中华人民共和国劳动法'],
        laws: ['56 号文', '劳动保障监察条例', '劳动法'],
    },
    {
        id: 'algorithm',
        title: '算法与规则申诉',
        level: '中',
        // 触发条件：B 维度红灯（平台算法与规则约束强）
        trigger: (_answers, lights) => lights['B'] === 'red',
        description:
            '派单、扣分、罚款不合理：要求平台公开算法、协商规则，通过申诉渠道或工会反映。',
        templates: [
            '《平台劳动规则和算法协商指引（试行）》',
            '关于维护新就业形态劳动者劳动保障权益的指导意见',
        ],
        laws: ['56 号文', '平台劳动规则和算法协商指引（试行）', '七部门外卖意见'],
    },
    {
        id: 'social-insurance',
        title: '社保参保',
        level: '中',
        // 触发条件：F 维度红灯（社保保障缺失）
        trigger: (_answers, lights) => lights['F'] === 'red',
        description:
            '养老 / 医疗没着落：以灵活就业身份个人参保，或关注地方「单项参加工伤保险」等办法。',
        templates: [
            '中华人民共和国社会保险法',
            '广东省税务局关于单位从业的灵活就业劳动者等特定人员参加工伤保险的办法',
        ],
        laws: ['社会保险法', '广东特定人员工伤办法', '超龄劳动者暂行规定'],
    },
];

/* 免责声明 */
const DISCLAIMER =
    '免责声明：本自测仅作科普参考，不构成法律意见。用工关系的最终认定以劳动仲裁机构或人民法院依据用工事实（而非合同名称）判定为准；职业伤害保障覆盖以您所在行业与地方当年政策为准，本系统提示仅供参考';

/* 核心计算：返回答案、维度小计、风险灯、等级、红旗与命中推荐 */
function calcResult() {
    // 1) 收集答案：{ 题目id: 选中选项文字 }
    const answers = {};
    questions.forEach((q) => {
        const selected = quizForm.querySelector(
            `.option[data-question-id="${q.id}"].selected`
        );
        answers[q.id] = selected ? selected.textContent.trim() : null;
    });

    // 2) 各维度小计（仅 A-F 计分维度，定位题不计入）
    const dimensionScores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    questions.forEach((q) => {
        if (!DIMENSION_FULL[q.dimension]) return; // 跳过不计分维度
        const selected = quizForm.querySelector(
            `.option[data-question-id="${q.id}"].selected`
        );
        if (selected) {
            dimensionScores[q.dimension] += Number(selected.dataset.score);
        }
    });

    // 3) 各维度风险灯
    const lights = {};
    Object.keys(DIMENSION_FULL).forEach((dim) => {
        const score = dimensionScores[dim];
        const rule = LIGHT_RULES[dim];
        if (score >= rule.red) lights[dim] = 'red';
        else if (score >= rule.yellow) lights[dim] = 'yellow';
        else lights[dim] = 'green';
    });

    // 4) A+B 总分与基础等级：>=8 强；>=4 中；其余弱
    const abTotal = dimensionScores.A + dimensionScores.B;
    let baseLevel;
    if (abTotal >= 8) baseLevel = '强';
    else if (abTotal >= 4) baseLevel = '中';
    else baseLevel = '弱';

    // 5) 红旗拦截：任一触发即强制总体风险为【强】
    const redFlags = [];
    if (answers['A3'] === '是') {
        redFlags.push('平台要求或引导您登记为个体工商户（A3），是规避劳动关系的典型做法');
    }
    if (answers['E3'] === '自行承担') {
        redFlags.push('受伤后相关医疗费用需自行承担（E3），职业伤害保障可能缺失');
    }
    if (answers['A2'] === '未签订任何书面协议' && answers['D2'] === '有明确要求') {
        redFlags.push('未签订任何书面协议且平台有明确的出勤/在线要求（A2+D2），用工管理强度高');
    }
    if (answers['F2'] === '否' && answers['F1'] === '从未参保') {
        redFlags.push('平台未缴纳社保且您本人从未参保（F2+F1），社会保障处于真空状态');
    }
    const overallLevel = redFlags.length > 0 ? '强' : baseLevel;

    // 6) 命中路径推荐
    const recommendations = RECOMMENDATIONS.filter((rec) =>
        rec.trigger(answers, lights)
    );

    return {
        answers,
        dimensionScores,
        lights,
        abTotal,
        baseLevel,
        overallLevel,
        redFlags,
        recommendations,
    };
}

/* ============================================================
 * 7. 结果渲染
 * ============================================================ */

/* 按 id 取容器：缺失时警告并返回 null，防止 HTML 未同步时脚本中断 */
function getResultEl(id) {
    const el = document.getElementById(id);
    if (!el) {
        console.warn(`[test.js] 未找到结果容器 #${id}，已跳过该区域渲染`);
    }
    return el;
}

const LIGHT_ICONS = { green: '🟢', yellow: '🟡', red: '🔴' };
const LIGHT_TEXT = { green: '绿灯', yellow: '黄灯', red: '红灯' };

/* 暂存最近一次 calcResult() 的结果，供"保存到我的权益记录"按钮组装数据 */
let lastCalcResult = null;

function renderResult(result) {
    lastCalcResult = result;
    const {
        answers,
        dimensionScores,
        lights,
        abTotal,
        overallLevel,
        redFlags,
        recommendations,
    } = result;
    const meta = LEVEL_META[overallLevel];

    // ① 摘要区：A+B 得分与总体等级
    const summary = getResultEl('result-summary');
    if (summary) {
        summary.innerHTML = `
            <p>核心风险得分（A+B 维度）：<strong>${abTotal}</strong> / 12 分</p>
            <p>总体风险等级：<strong>【${overallLevel}】</strong>（${
            redFlags.length > 0
                ? `触发 ${redFlags.length} 条红旗拦截，强制按【强】处理`
                : '未触发红旗拦截'
        }）</p>`;
    }

    // ② 结论区：按等级换背景色（强红 / 中黄 / 弱绿）
    const conclusion = getResultEl('result-conclusion');
    if (conclusion) {
        conclusion.innerHTML = `<strong>【${overallLevel}】</strong> ${meta.text}`;
        conclusion.style.background = meta.bg;
        conclusion.style.borderLeft = `4px solid ${meta.border}`;
        conclusion.style.padding = '12px 15px';
        conclusion.style.borderRadius = '8px';
    }

    // ③ 红旗区：列出触发的拦截条件
    const redFlagsEl = getResultEl('result-red-flags');
    if (redFlagsEl) {
        redFlagsEl.innerHTML =
            redFlags.length > 0
                ? `<ul>${redFlags.map((f) => `<li>${f}</li>`).join('')}</ul>`
                : '<p>未触发红旗拦截条件。</p>';
    }

    // ④ 风险灯区：6 个维度对应的绿灯/黄灯/红灯图标
    const lightsEl = getResultEl('result-risk-lights');
    if (lightsEl) {
        const lightBg = { green: '#e8f5e9', yellow: '#fff8e1', red: '#fdecea' };
        lightsEl.innerHTML = Object.keys(DIMENSION_FULL)
            .map((dim) => {
                const light = lights[dim];
                return `<span class="risk-light risk-light-${light}" style="display:inline-block;margin:4px 8px 4px 0;padding:6px 14px;border-radius:20px;background:${lightBg[light]};">${LIGHT_ICONS[light]} ${DIMENSION_NAMES[dim]} ${dimensionScores[dim]}/${DIMENSION_FULL[dim]}分</span>`;
            })
            .join('');
    }

    // ⑤ 维度小计列表
    const listEl = getResultEl('result-list');
    if (listEl) {
        listEl.innerHTML = Object.keys(DIMENSION_FULL)
            .map(
                (dim) =>
                    `<li>${DIMENSION_NAMES[dim]}：<strong>${dimensionScores[dim]}</strong> / ${DIMENSION_FULL[dim]} 分（${LIGHT_TEXT[lights[dim]]}）</li>`
            )
            .join('');
    }

    // ⑥ 路径推荐 + 免责声明
    const recEl = getResultEl('recommendation-content');
    if (recEl) {
        const cardsHtml =
            recommendations.length > 0
                ? recommendations
                      .map((rec) => {
                          const badgeBg = rec.level === '强' ? '#e5484d' : '#d99b00';
                          const description =
                              typeof rec.description === 'function'
                                  ? rec.description(answers)
                                  : rec.description;
                          return `
                <div class="recommendation-card" style="margin-bottom:16px;padding:16px;border:1px solid #edf0f4;border-radius:9px;background:#f7f9fc;">
                    <h4 style="margin:0 0 8px;">${rec.title}<span style="font-size:12px;background:${badgeBg};color:white;padding:2px 8px;border-radius:10px;margin-left:8px;">${rec.level}</span></h4>
                    <p>${description}</p>
                    <p style="margin:0 0 4px;"><strong>相关模板：</strong>${rec.templates.join('、')}</p>
                    <p style="margin:0;"><strong>相关法规：</strong>${rec.laws.join('、')}</p>
                </div>`;
                      })
                      .join('')
                : '<p>根据您的作答，暂无命中特定维权路径。如仍有疑问，可在下方描述具体情况，让 AI 助手进一步分析。</p>';
        recEl.innerHTML = `${cardsHtml}<p class="notice" style="margin-top:16px;">${DISCLAIMER}</p>`;
    }
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
    renderResult(calcResult());
    // 渲染完成后平滑滚动到结果区顶部：答题区较高，隐藏后页面会缩短，
    // 若不主动滚动，视口会停留在原位置（约等于结果页底部的 AI 分析区）
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // 显示"保存到我的权益记录"按钮，并复位提示区
    if (saveBtn) saveBtn.style.display = 'block';
    if (saveMessage) {
        saveMessage.style.display = 'none';
        saveMessage.textContent = '';
    }
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
    // 清空结果区所有容器（含后增的结论/红旗/风险灯/推荐容器，均做空值保护）
    RESULT_CONTAINERS.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });
    // 复位结论框的行内样式（renderResult 每次会按等级重写）
    const conclusionEl = document.getElementById('result-conclusion');
    if (conclusionEl) {
        conclusionEl.style.background = '';
        conclusionEl.style.borderLeft = '';
        conclusionEl.style.padding = '';
        conclusionEl.style.borderRadius = '';
    }
    progressText.textContent = `0/${questions.length}`;
    // 隐藏保存按钮与提示区，等待下一次提交后重新显示
    if (saveBtn) {
        saveBtn.style.display = 'none';
        saveBtn.disabled = false;
    }
    if (saveMessage) {
        saveMessage.style.display = 'none';
        saveMessage.textContent = '';
    }
    window.currentAiResult = null; // 新一轮自测开始，旧的 AI 分析不再计入保存数据
    resultSection.classList.add('hidden');
    introSection.classList.remove('hidden');
});

/* ============================================================
 * 9. AI 分析区逻辑（附加功能，不影响上方自测流程）
 * ============================================================ */
const aiInput = document.getElementById('ai-input');
const aiAnalyzeBtn = document.getElementById('ai-analyze-btn');
const aiResult = document.getElementById('ai-result');

/* 模拟开关：后端接口未通时改为 true，使用 setTimeout 假数据联调 */
const USE_MOCK = false;

/* 真实后端接口地址 */
const AI_API_URL = 'http://10.72.39.141:8080/api/ai/analyze';

/* 请求超时时间（毫秒）：后端电脑未开机时避免一直停留在"思考中" */
const AI_TIMEOUT = 10000;

/* 模拟返回数据：字段结构与后端 JSON 完全一致 */
const MOCK_AI_RESPONSE = {
    aiAnalysis: '初步分析：涉及工资拖欠。',
    materials: '工资流水、聊天记录、平台账号信息。',
    checkResult: '确认用工事实与报酬标准约定情况。',
    nextStep: '向劳动监察大队投诉。',
};

/* 全局保存最近一次 AI 分析结果，供"保存到我的权益记录"直接取用 */
window.currentAiResult = null;

/* 转义 HTML，防止后端返回的文本被当成标签渲染 */
function escapeHtml(str) {
    return String(str ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/* 把 AI 返回的 JSON 结构化为四个区块渲染到 #ai-result */
function renderAiResult(data) {
    const blocks = [
        { icon: '💡', title: '初步分析', text: data.aiAnalysis },
        { icon: '📋', title: '建议材料', text: data.materials },
        { icon: '✅', title: '申报前检查', text: data.checkResult },
        { icon: '➡️', title: '下一步建议', text: data.nextStep },
    ];
    aiResult.innerHTML = blocks
        .map(
            (b) => `
            <div style="margin-bottom: 12px;">
                <h4 style="margin:0 0 4px;color:#1769aa;">${b.icon} ${b.title}</h4>
                <p style="margin:0;">${escapeHtml(b.text) || '无'}</p>
            </div>`
        )
        .join('');
}

// 9.1 监听"开始AI分析"按钮点击
aiAnalyzeBtn.addEventListener('click', async () => {
    const description = aiInput.value.trim();

    // 9.2 空输入校验
    if (description === '') {
        alert('请先描述你遇到的情况');
        return;
    }

    // 9.3 显示"思考中"提示，并禁用按钮防止重复点击
    aiResult.style.display = 'block';
    aiResult.style.color = ''; // 复位上次失败时的红色样式
    aiResult.innerHTML = '<p>AI正在思考中...</p>';
    aiAnalyzeBtn.disabled = true;

    try {
        let data;
        if (USE_MOCK) {
            // 9.4 模拟模式：延迟 1.5 秒后返回与后端同结构的假数据
            await new Promise((resolve) => setTimeout(resolve, 1500));
            data = MOCK_AI_RESPONSE;
        } else {
            // 9.5 真实模式：POST 请求，返回 JSON 对象
            //     { aiAnalysis, materials, checkResult, nextStep }
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), AI_TIMEOUT);
            const res = await fetch(AI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userInput: description }),
                signal: controller.signal,
            });
            clearTimeout(timer);
            if (!res.ok) {
                throw new Error(`接口返回状态码 ${res.status}`);
            }
            data = await res.json();
        }
        // 9.6 分析成功：存入全局变量并结构化渲染四个区块
        window.currentAiResult = data;
        renderAiResult(data);
    } catch (err) {
        // 9.7 请求失败（后端未启动、网络不通、CORS 跨域拦截等）：显示红色提示
        console.error('[test.js] AI 请求失败：', err);
        window.currentAiResult = null;
        aiResult.style.color = '#e5484d';
        aiResult.innerHTML = '<p>AI 连接失败，请检查网络或联系管理员</p>';
    } finally {
        aiAnalyzeBtn.disabled = false;
    }
});

/* ============================================================
 * 10. 保存到我的权益记录（真实接口对接，无 Mock）
 * ============================================================ */

/* 保存接口地址 */
const SAVE_API_URL = 'http://10.72.39.141:8080/api/rights-records';

/* 在 #save-message 中显示提示文字（绿色成功 / 红色失败） */
function showSaveMessage(text, color) {
    if (!saveMessage) return;
    saveMessage.style.display = 'block';
    saveMessage.style.color = color;
    saveMessage.textContent = text;
}

/* 组装要保存的权益记录（字段名与后端约定严格一致，勿改） */
function buildSavePayload() {
    const { dimensionScores, overallLevel } = lastCalcResult;

    // userId：暂时从 localStorage 取，取不到默认 1（TODO 登录做好后替换）
    const userId = Number(localStorage.getItem('userId')) || 1;

    // problemType：取本次自测得分最高的维度简单映射；
    // 全部 0 分时兜底"权益咨询"。如需写死，把下面两行换成 '权益咨询' 即可
    const topDim = Object.keys(DIMENSION_FULL).reduce(
        (best, dim) =>
            dimensionScores[dim] > dimensionScores[best] ? dim : best,
        'A'
    );
    const problemType =
        dimensionScores[topDim] > 0 ? `${DIMENSION_NAMES[topDim]}问题` : '权益咨询';

    // description：用户在 #ai-input 里输入的原话（未填写则为空字符串）
    const description = aiInput.value.trim();

    // selfTestResult：拼接总分与风险等级，例如：【中】风险，A:3/7，B:2/5...
    const dimParts = Object.keys(DIMENSION_FULL)
        .map((dim) => `${dim}:${dimensionScores[dim]}/${DIMENSION_FULL[dim]}`)
        .join('，');
    const selfTestResult = `【${overallLevel}】风险，${dimParts}`;

    // 四个 AI 字段：取全局变量中存储的最新 AI 分析结果；
    // 未进行 AI 分析就保存时，四个字段都传空字符串
    const ai = window.currentAiResult || {};
    const aiAnalysis = ai.aiAnalysis || '';
    const materials = ai.materials || '';
    const checkResult = ai.checkResult || '';
    const nextStep = ai.nextStep || '';

    return {
        userId: userId,
        problemType: problemType,
        description: description,
        selfTestResult: selfTestResult,
        aiAnalysis: aiAnalysis,
        materials: materials,
        checkResult: checkResult,
        nextStep: nextStep,
    };
}

// 10.1 点击"保存到我的权益记录"
if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
        if (!lastCalcResult) {
            showSaveMessage('暂无自测结果可保存，请先完成自测', '#e5484d');
            return;
        }

        // 组装数据并打印到控制台，方便与 C 核对字段格式
        const payload = buildSavePayload();
        console.log('[test.js] 即将保存的权益记录：', payload);

        // 按钮变灰、文字改为"正在保存..."，防止重复提交
        saveBtn.disabled = true;
        saveBtn.textContent = '正在保存...';

        try {
            const res = await fetch(SAVE_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                throw new Error(`接口返回状态码 ${res.status}`);
            }
            // 状态码 200：绿色成功提示
            showSaveMessage('✅ 保存成功！已存入数据库', '#28a745');
        } catch (err) {
            console.error('[test.js] 保存失败：', err);
            showSaveMessage('❌ 保存失败，请检查网络或查看F12报错', '#e5484d');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = '保存到我的权益记录';
        }
    });
}
