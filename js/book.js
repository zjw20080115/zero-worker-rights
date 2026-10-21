/* ============================================================
   权益知识库 - 完整代码 (支持自动翻页)
============================================================ */

const DATA = {
    categories: [
        {
            id: 'salary',
            name: '国家法律',
            icon: '📜',
            desc: '劳动、合同、社保、安全等基础法律',
            docs: [
                { id: 'civil-code',       title: '中华人民共和国民法典',             tag: '基础大法' },
                { id: 'labor-law',        title: '中华人民共和国劳动法',             tag: '劳动基础' },
                { id: 'labor-contract',   title: '中华人民共和国劳动合同法',         tag: '劳动合同' },
                { id: 'social-insurance', title: '中华人民共和国社会保险法',         tag: '社会保险' },
                { id: 'employment',       title: '中华人民共和国就业促进法',         tag: '就业促进' },
                { id: 'dispute',          title: '中华人民共和国劳动争议调解仲裁法', tag: '争议处理' },
                { id: 'safety',           title: '中华人民共和国安全生产法',         tag: '安全生产' },
                { id: 'occupational',     title: '中华人民共和国职业病防治法',       tag: '职业病防治' },
                { id: 'union',            title: '中华人民共和国工会法',             tag: '工会组织' }
            ]
        },
        {
            id: 'injury',
            name: '行政法规',
            icon: '📋',
            desc: '行政法规相关文件',
            docs: [
                { id: 'wage-payment',          title: '保障农民工工资支付条例', tag: '工资支付' },
                { id: 'work-injury-insurance', title: '工伤保险条例', tag: '工伤保险' },
                { id: 'instant-delivery',      title: '国务院办公厅关于促进即时配送行业高质量发展的指导意见', tag: '即时配送' },
                { id: 'new-consumption',       title: '国务院办公厅关于以新业态新模式引领新型消费加快发展的意见', tag: '新业态新模式' },
                { id: 'flexible-employment',   title: '国务院办公厅关于支持多渠道灵活就业的意见', tag: '灵活就业' },
                { id: 'female-protection',     title: '女职工劳动保护特别规定', tag: '女职工保护' },
                { id: 'employment-strategy',   title: '中共中央 国务院关于实施就业优先战略促进高质量充分就业的意见', tag: '就业优先' }
            ]
        },
        {
            id: 'contract',
            name: '部门规章·部委文件',
            icon: '📄',
            desc: '人社部等部委文件',
            docs: [
                { id: 'injury-certificates', title: '认定书归档（工伤认定表单及文书）', tag: '认定文书' },
                { id: 'injury-attachments', title: '职业伤害保障试行附件申请（表单文书汇编）', tag: '职业伤害' },
                { id: 'mohrss-56',        title: '关于维护新就业形态劳动者劳动保障权益的指导意见', tag: '新就业形态' },
                { id: 'guide-rest',      title: '新就业形态劳动者休息和劳动报酬权益保障指引', tag: '新就业形态' },
                { id: 'guide-publicity', title: '新就业形态劳动者劳动规则公示指引', tag: '新就业形态' },
                { id: 'guide-service',   title: '新就业形态劳动者权益维护服务指南', tag: '新就业形态' },
                { id: 'policy-over-age', title: '超龄劳动者基本权益保障暂行规定', tag: '超龄劳动者' },
                { id: 'policy-transport',title: '关于加强交通运输新业态从业人员权益保障工作的意见', tag: '交通运输' },
                { id: 'policy-takeaway', title: '关于落实网络餐饮平台责任切实维护外卖送餐员权益的指导意见', tag: '外卖送餐' },
                { id: 'occupational-injury',  title: '新就业形态人员职业伤害保障办法（试行）', tag: '职业伤害' },
                { id: 'occupational-manage',   title: '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）', tag: '职业伤害' },
                { id: 'case-3rd',        title: '劳动人事争议典型案例（第三批）', tag: '典型案例' },
                { id: 'case-4th',        title: '劳动人事争议典型案例（第四批）', tag: '典型案例' }
            ]
        },
        {
            id: 'social',
            name: '司法解释·最高法和最高检指导案例',
            icon: '⚖️',
            desc: '司法解释及指导案例',
            docs: [
                { id: 'labor-interpretation-2', title: '最高人民法院关于审理劳动争议案件适用法律问题的解释（二）', tag: '司法解释' },
                { id: 'spc-guiding-new',        title: '最高人民法院首批新就业形态劳动争议专题指导性案例', tag: '指导案例' },
                { id: 'spc-guiding-news',       title: '最高人民法院发布新就业形态劳动争议专题指导性案例', tag: '指导案例' },
                { id: 'spc-guiding-237',        title: '指导性案例237号：郎溪某服务外包有限公司诉徐某申确认劳动关系纠纷案', tag: '指导案例' },
                { id: 'spc-guiding-238',        title: '指导性案例238号：圣某欢诉江苏某网络科技有限公司确认劳动关系纠纷案', tag: '指导案例' },
                { id: 'spc-guiding-239',        title: '指导性案例239号：王某诉北京某文化传媒有限公司劳动争议案', tag: '指导案例' },
                { id: 'spc-guiding-240',        title: '指导性案例240号：秦某丹诉北京某汽车技术开发服务有限公司劳动争议案', tag: '指导案例' },
                { id: 'over-age-injury',        title: '聚焦劳动法律监督"一函两书"典型案例：明确超龄劳动者能否享受工伤保险待遇', tag: '典型案例' },
                { id: 'yihanshu-cases-2025',    title: '全国总工会、最高法、最高检联合发布2025年劳动法律监督"一函两书"典型案例', tag: '典型案例' }
            ]
        },
        {
            id: 'national',
            name: '国家统一',
            icon: '📝',
            desc: '国家统一政策与规定',
            docs: [
                { id: 'payment-regulation',   title: '保障农民工工资支付条例', tag: '行政法规' },
                { id: 'mohrss-56',            title: '关于维护新就业形态劳动者劳动保障权益的指导意见', tag: '部门规章' },
                { id: 'rights-regulation',    title: '新就业形态劳动者权益保障办法（征求意见稿）', tag: '部门规章' },
                { id: 'occupational-injury',  title: '新就业形态人员职业伤害保障办法（试行）', tag: '职业伤害' },
                { id: 'occupational-manage',  title: '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）', tag: '职业伤害' },
                { id: 'cpc-opinion',          title: '中共中央办公厅 国务院办公厅关于加强新就业群体服务管理的意见', tag: '中央文件' },
                { id: 'rights-defense',       title: '构筑权益防线 护航新就业群体全面发展', tag: '政策解读' }
            ]
        },
        {
            id: 'local',
            name: '地方政策',
            icon: '📝',
            desc: '地方性政策与规定',
            docs: [
                { id: 'beijing-measures',      title: '北京市关于促进新就业形态健康发展的若干措施（京就发〔2021〕3号）', tag: '北京' },
                { id: 'beijing-flexible',      title: '北京市人力资源和社会保障局支持多渠道灵活就业实施办法（京人社就发〔2020〕19号）', tag: '北京' },
                { id: 'shanghai-opinion',      title: '上海市人力资源和社会保障局等八部门关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '上海' },
                { id: 'tianjin-opinion',       title: '天津市关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '天津' },
                { id: 'cq-implementation',     title: '重庆市人力资源和社会保障局等11个部门关于维护新就业形态劳动者劳动保障权益的实施意见（渝人社发〔2021〕38号）', tag: '重庆' },
                { id: 'cq-mediation',          title: '重庆市加强新就业形态劳动纠纷一站式调解工作实施方案（渝人社〔2024〕310号）', tag: '重庆' },
                { id: 'zhejiang-employment',   title: '浙江省就业促进条例', tag: '浙江' },
                { id: 'zhejiang-measures',     title: '浙江省维护新就业形态劳动者劳动保障权益实施办法', tag: '浙江' },
                { id: 'jiangsu-opinion',       title: '江苏省关于维护新就业形态劳动者劳动保障权益的意见', tag: '江苏' },
                { id: 'anhui-regulation',      title: '安徽省关于维护新就业形态劳动者劳动保障权益的实施方案', tag: '安徽' },
                { id: 'fujian-15measures',     title: '福建省贯彻落实人力资源社会保障部等八部委关于维护新就业形态劳动者劳动保障权益指导意见的十五条措施', tag: '福建' },
                { id: 'xiamen-regulation',     title: '厦门经济特区网约配送员劳动权益保障若干规定', tag: '福建·厦门' },
                { id: 'jiangxi-opinion',       title: '江西省关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '江西' },
                { id: 'jiangxi-injury',        title: '江西省新就业形态人员职业伤害保障实施办法（试行）', tag: '江西' },
                { id: 'shandong-opinion',      title: '山东省人力资源和社会保障厅等八部门关于维护新就业形态劳动者劳动保障权益的实施意见（鲁人社发〔2021〕15号）', tag: '山东' },
                { id: 'shandong-12measures',   title: '山东省关于进一步加强新就业形态劳动者劳动权益保障十二条措施的通知（鲁人社字〔2022〕65号）', tag: '山东' },
                { id: 'shandong-injury',       title: '山东省关于做好新就业形态人员职业伤害保障试点工作的通知（鲁人社字〔2025〕61号）', tag: '山东' },
                { id: 'shandong-mediation',    title: '山东省关于加强新就业形态劳动纠纷一站式调解工作的通知（鲁人社字〔2024〕87号）', tag: '山东' },
                { id: 'shandong-specific',     title: '山东省超龄人员和实习学生等特定从业人员参加工伤保险办法（试行）（鲁人社规〔2024〕2号）', tag: '山东' },
                { id: 'hebei-implementation',  title: '河北省关于维护新就业形态劳动者劳动保障权益的实施办法（暂行）', tag: '河北' },
                { id: 'hebei-reply',           title: '河北省对政协第十三届委员会第三次会议第0619号提案的答复', tag: '河北' },
                { id: 'shanxi-opinion',        title: '山西省关于进一步加强互联网平台企业劳动用工管理的实施意见（试行）', tag: '山西' },
                { id: 'neimenggu-opinion',     title: '内蒙古自治区关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '内蒙古' },
                { id: 'liaoning-measures',     title: '辽宁省关于维护新就业形态劳动者劳动保障权益的若干措施', tag: '辽宁' },
                { id: 'jilin-measures',        title: '吉林省维护新就业形态劳动者劳动保障权益实施办法（试行）', tag: '吉林' },
                { id: 'heilongjiang-opinion',  title: '黑龙江省关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '黑龙江' },
                { id: 'henan-implementation',  title: '河南省关于维护新就业形态劳动者劳动保障权益实施办法', tag: '河南' },
                { id: 'hubei-measures',        title: '湖北省关于切实维护新就业形态劳动者劳动保障权益的若干措施', tag: '湖北' },
                { id: 'hunan-opinion',         title: '湖南省关于维护新就业形态劳动者劳动保障权益的实施意见（湘人社规〔2021〕24号）', tag: '湖南' },
                { id: 'guangdong-injury',      title: '广东省关于单位从业的灵活就业劳动者等特定人员参加工伤保险的办法', tag: '广东' },
                { id: 'guangxi-opinion',       title: '广西壮族自治区关于维护新就业形态劳动者劳动保障权益的实施意见（桂人社发〔2021〕63号）', tag: '广西' },
                { id: 'hainan-measures',       title: '海南省维护新就业形态劳动者劳动保障权益实施办法', tag: '海南' },
                { id: 'shenzhen-decision',     title: '深圳市人民代表大会常务委员会关于加强新就业形态劳动者权益保障的决定', tag: '广东·深圳' },
                { id: 'sichuan-opinion',       title: '四川省关于维护新就业形态劳动者劳动保障权益的实施意见（川人社发〔2021〕29号）', tag: '四川' },
                { id: 'guizhou-opinion',       title: '贵州省关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '贵州' },
                { id: 'yunnan-opinion',        title: '云南省关于维护新就业形态劳动者劳动保障权益的实施意见（云人社发〔2021〕40号）', tag: '云南' },
                { id: 'shaanxi-implementation',title: '陕西省维护新就业形态劳动者劳动保障权益实施办法', tag: '陕西' },
                { id: 'gansu-opinion',         title: '甘肃省关于维护新就业形态劳动者劳动保障权益的实施意见（甘人社厅发〔2021〕23号）', tag: '甘肃' },
                { id: 'qinghai-measures',      title: '青海省关于维护新就业形态劳动者劳动保障权益的若干措施', tag: '青海' },
                { id: 'ningxia-measures',      title: '宁夏回族自治区维护新就业形态劳动者劳动保障权益实施办法', tag: '宁夏' },
                { id: 'xinjiang-opinion',      title: '新疆自治区关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '新疆' },
                { id: 'xizang-report',         title: '西藏关于在全区互联网平台企业、快递企业实施用工报告制度的通知', tag: '西藏' }
            ]
        },
        {
            id: 'rights',
            name: '其他',
            icon: '📁',
            desc: '国际公约、职业伤害、典型案例等',
            docs: [
                // 已删除你说的这四个报错的文件
                { id: 'occupational-injury',  title: '新就业形态人员职业伤害保障办法（试行）', tag: '职业伤害' },
                { id: 'occupational-manage',  title: '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）', tag: '职业伤害' },
                { id: 'delivery-platform-standard', title: '外卖平台服务管理基本要求（GB/T 46862—2025）', tag: '国家标准' },
                { id: 'shared-economy-gb',    title: '共享经济 指导原则与基础框架（GB/T 41836—2022）', tag: '国家标准' },
                { id: 'platform-algo-guide',  title: '平台劳动规则和算法协商指引（试行）', tag: '部门文件' },
                { id: 'social-insurance-report',title: '关于检查《中华人民共和国社会保险法》实施情况的报告', tag: '执法检查' },
                { id: 'flexible-employment-system', title: '加快建立健全灵活就业人员保障体系', tag: '政策研究' },
                { id: '8400w-workers-news',   title: '8400万新就业形态劳动者的期盼渐成现实', tag: '政策宣传' },
                { id: 'mohrss-4-measures',    title: '人社部"四条措施"促进灵活就业和新就业形态劳动者权益保障', tag: '政策解读' },
                { id: 'employment-strategy',  title: '实施就业优先战略"十五五"规划', tag: '国家规划' },
                { id: 'eleme-agreement',      title: '饿了么签订平台算法和劳动规则协议', tag: '平台实践' },
                { id: 'meituan-insurance',    title: '美团骑手社保补贴全国上线', tag: '平台实践' },
                { id: 'case-3rd',             title: '劳动人事争议典型案例（第三批）', tag: '典型案例' },
                { id: 'case-4th',             title: '劳动人事争议典型案例（第四批）', tag: '典型案例' }
            ]
        }
    ]
};


// 附件子列表... 以下代码保持不变

let DB = {};

// 获取 DOM 元素
const dom = {
    categoryList: document.getElementById('category-list'),
    quickCards: document.getElementById('quick-cards'),
    docList: document.getElementById('doc-list'),
    docCatTitle: document.getElementById('doc-cat-title'),
    detailTitle: document.getElementById('detail-title'),
    detailTag: document.getElementById('detail-tag'),
    detailContent: document.getElementById('detail-content'),
    welcomeView: document.getElementById('welcome-view'),
    docView: document.getElementById('doc-view'),
    detailView: document.getElementById('detail-view'),
    backToDoc: document.getElementById('back-to-doc')
};

const state = { currentCategoryId: null, currentDocId: null, currentTab: 'main', currentPage: 1 };

// 启动加载
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../data/docs.json');
        DB = await response.json();
    } catch (err) {
        console.error("数据加载失败，请确保使用 Live Server 运行", err);
    }

    renderCategoryList();
    renderQuickCards();
    bindEvents();
    showView('welcome');
});

function renderCategoryList() {
    dom.categoryList.innerHTML = '';
    DATA.categories.forEach(cat => {
        const li = document.createElement('li');
        li.dataset.id = cat.id;
        li.innerHTML = `
            <div class="folder-icon"></div>
            <div class="cat-text">
                <span class="cat-name">${cat.name}</span>
                <span class="cat-sub">${cat.docs.length} 项</span>
            </div>
            <span class="cat-arrow">›</span>
        `;
        li.addEventListener('click', () => selectCategory(cat.id));
        dom.categoryList.appendChild(li);
    });
}

function renderQuickCards() {
    dom.quickCards.innerHTML = '';
    DATA.categories.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div class="icon">${cat.icon || '📘'}</div><div class="label">${cat.name}</div>`;
        card.addEventListener('click', () => selectCategory(cat.id));
        dom.quickCards.appendChild(card);
    });
}

function bindEvents() {
    dom.backToDoc.addEventListener('click', () => {
        if (state.currentCategoryId) selectCategory(state.currentCategoryId);
        else showView('welcome');
    });
}

function selectCategory(catId) {
    const cat = DATA.categories.find(c => c.id === catId);
    if (!cat) return;
    state.currentCategoryId = catId;

    document.querySelectorAll('#category-list li').forEach(li => li.classList.toggle('active', li.dataset.id === catId));
    dom.docCatTitle.textContent = cat.name;
    dom.docList.innerHTML = '';

    cat.docs.forEach((doc) => {
        const li = document.createElement('li');
        li.className = 'doc-item';
        li.innerHTML = `
            <div class="doc-icon">📖</div>
            <div class="doc-body">
                <h3>${doc.title}</h3>
                <div class="doc-meta"><span class="tag">${doc.tag || ''}</span></div>
            </div>
            <span class="doc-arrow">›</span>
        `;
        li.addEventListener('click', () => selectDoc(cat.id, doc.id));
        dom.docList.appendChild(li);
    });
    showView('doc');
}

async function selectDoc(catId, docId) {
    const cat = DATA.categories.find(c => c.id === catId);
    const doc = (cat.docs || []).find(d => d.id === docId);
    if (!doc) return;

    state.currentCategoryId = catId;
    state.currentDocId = docId;
    state.currentPage = 1; // 每次点开新文章，重置到第一页

    dom.detailTitle.textContent = doc.title;
    dom.detailTag.textContent = doc.tag || '';

    if (docId === 'injury-certificates' || docId === 'injury-attachments') {
        renderAttachmentList(docId);
        showView('detail');
    } else {
        if (DB[docId]) {
            // 1. 先在 docs.json 里找（短文本、附件）
            dom.detailContent.innerHTML = parseMarkdownAndAttachments(DB[docId]);
            showView('detail');
        } else {
            // 2. 如果没找到，去 laws 或 source-docs 找 txt
            dom.detailContent.innerHTML = '<p style="color:#666;">正在加载长文本...</p>';
            showView('detail');
            
                         try {
                let text = null;
                let response;

                // 优先去新建立的 regulations 文件夹找这 7 个行政法规
                response = await fetch(`../data/regulations/${docId}.txt`);
                
                // 如果没找到，按顺序去 judicial, others, national, laws, local 找
                if (!response.ok) response = await fetch(`../data/judicial/${docId}.txt`);
                if (!response.ok) response = await fetch(`../data/others/${docId}.txt`);
                if (!response.ok) response = await fetch(`../data/others/others/${docId}.txt`);
                if (!response.ok) response = await fetch(`../data/national/${docId}.txt`);
                if (!response.ok) response = await fetch(`../data/laws/${docId}.txt`);
                if (!response.ok) response = await fetch(`../data/local/${docId}.txt`);

                // 读取内容
                if (response.ok) {
                    text = await response.text();
                    window.currentLawPages = text.split('---');
                    renderPageContent(); 
                } else {
                    dom.detailContent.innerHTML = `<p style="color:red;">未找到文件：请检查 ${docId}.txt 是否在对应文件夹中。</p>`;
                }
            } catch (error) {
                dom.detailContent.innerHTML = `<p style="color:red;">加载失败：请确保使用 Live Server 运行。</p>`;
            }
        }
    }
}

// 渲染附件子菜单
function renderAttachmentList(targetId) {
    const list = ATTACHMENT_LISTS[targetId];
    dom.detailContent.innerHTML = '<p style="margin-bottom: 16px; color: #666;">点击下方文件名称，查看详细内容：</p>';
    
    list.forEach(item => {
        const p = document.createElement('p');
        p.style.margin = '10px 0';
        
        const a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.className = 'att-link';
        a.textContent = '📎 ' + item.title;
        a.addEventListener('click', function(e) {
            e.preventDefault(); 
            openAttachment(item.id, item.title, item.tag);
        });

        p.appendChild(a);
        dom.detailContent.appendChild(p);
    });
}

function openAttachment(attId, title, tag) {
    dom.detailTitle.textContent = title;
    dom.detailTag.textContent = tag || '';
    
    const content = DB[attId] ? DB[attId] : '暂无正文。';
    dom.detailContent.innerHTML = parseMarkdownAndAttachments(content);

    const backWrap = document.createElement('div');
    backWrap.style.marginTop = '18px';
    const backBtn = document.createElement('button');
    backBtn.className = 'btn book-back';
    backBtn.textContent = '← 返回上级';
    backBtn.onclick = () => selectDoc(state.currentCategoryId, state.currentDocId);
    backWrap.appendChild(backBtn);
    dom.detailContent.appendChild(backWrap);
}

// 解析文本和表格
function parseMarkdownAndAttachments(text) {
    if(!text) return '';
    const lines = text.split('\n');
    let inTable = false, tableHtml = '', resultHtml = '';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
            if (line.replace(/[|\-\s]/g, '') === '') continue;
            if (!inTable) { 
                inTable = true; 
                tableHtml = '<table class="doc-table" style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 15px; border: 1px solid #000;">'; 
            }
            const cells = line.split('|').slice(1, -1);
            tableHtml += '<tr>';
            cells.forEach(cell => { 
                let cellText = cell.trim().replace(/&lt;br&gt;/g, '<br>');
                tableHtml += `<td style="border: 1px solid #000; padding: 12px 14px; vertical-align: middle; text-align: left; color: #333;">${cellText || '&nbsp;'}</td>`; 
            });
            tableHtml += '</tr>';
        } else {
            if (inTable) { 
                inTable = false; 
                tableHtml += '</table>'; 
                resultHtml += tableHtml + '\n'; 
            }
            if (line !== '') {
                if (line.startsWith('<div') || line.startsWith('<p') || line.startsWith('<span')) {
                    resultHtml += line;
                } else {
                    resultHtml += `<p>${line}</p>`;
                }
            }
        }
    }
    if (inTable) resultHtml += tableHtml + '</table>';
    return resultHtml;
}

// 渲染长篇法律的分页内容
function renderPageContent() {
    const pages = window.currentLawPages;
    if (!pages || pages.length === 0) return;

    // 获取当前页的文字
    let pageText = pages[state.currentPage - 1];
    
    // 如果是第一页，自动把第一行变成大标题
    if (state.currentPage === 1) {
        const lines = pageText.split('\n');
        let html = `<h2 style="text-align: center; margin-bottom: 20px;">${lines[0]}</h2>\n`;
        html += lines.slice(1).join('\n');
        dom.detailContent.innerHTML = parseMarkdownAndAttachments(html);
    } else {
        dom.detailContent.innerHTML = parseMarkdownAndAttachments(pageText);
    }

    // 生成底部的翻页按钮区域
    const navDiv = document.createElement('div');
    navDiv.style.marginTop = '30px';
    navDiv.style.paddingTop = '15px';
    navDiv.style.borderTop = '1px dashed #ccc';
    navDiv.style.display = 'flex';
    navDiv.style.justifyContent = 'space-between';
    navDiv.style.alignItems = 'center';

    // 上一页按钮
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn book-back';
    prevBtn.textContent = '← 上一页';
    prevBtn.disabled = state.currentPage === 1;
    if (prevBtn.disabled) prevBtn.style.opacity = '0.5';
    prevBtn.onclick = () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderPageContent();
            dom.detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // 页码提示
    const pageNum = document.createElement('span');
    pageNum.textContent = `第 ${state.currentPage} 页 / 共 ${pages.length} 页`;
    pageNum.style.color = '#666';

    // 下一页按钮
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn book-back';
    nextBtn.textContent = '下一页 →';
    nextBtn.disabled = state.currentPage === pages.length;
    if (nextBtn.disabled) nextBtn.style.opacity = '0.5';
    nextBtn.onclick = () => {
        if (state.currentPage < pages.length) {
            state.currentPage++;
            renderPageContent();
            dom.detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    navDiv.appendChild(prevBtn);
    navDiv.appendChild(pageNum);
    navDiv.appendChild(nextBtn);

    dom.detailContent.appendChild(navDiv);
}

function showView(view) {
    dom.welcomeView.classList.add('hidden');
    dom.docView.classList.add('hidden');
    dom.detailView.classList.add('hidden');

    if (view === 'welcome') dom.welcomeView.classList.remove('hidden');
    else if (view === 'doc') dom.docView.classList.remove('hidden');
    else if (view === 'detail') dom.detailView.classList.remove('hidden');
}

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}