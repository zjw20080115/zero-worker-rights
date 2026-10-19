/* ============================================================
   权益知识库 - 数据与交互
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
                { id: 'wage-payment',          title: '保障农民工工资支付条例（国务院令第724号）',                       tag: '工资支付' },
                { id: 'work-injury-insurance', title: '工伤保险条例',                                                   tag: '工伤保险' },
                { id: 'instant-delivery',      title: '国务院办公厅关于促进即时配送行业高质量发展的指导意见（国办发〔2024〕3号）', tag: '即时配送' },
                { id: 'new-consumption',       title: '国务院办公厅关于以新业态新模式引领新型消费加快发展的意见（国办发〔2020〕32号）', tag: '新业态新模式' },
                { id: 'flexible-employment',   title: '国务院办公厅关于支持多渠道灵活就业的意见（国办发〔2020〕27号）',    tag: '灵活就业' },
                { id: 'female-protection',     title: '女职工劳动保护特别规定',                                         tag: '女职工保护' },
                { id: 'employment-strategy',   title: '中共中央 国务院关于实施就业优先战略促进高质量充分就业的意见',      tag: '就业优先' }
            ]
        },
        {
            id: 'contract',
            name: '部门规章·部委文件',
            icon: '📄',
            desc: '人社部、交通部、市场监管总局等部门规章及部委文件',
            docs: [
                { id: 'guide-56',        title: '关于维护新就业形态劳动者劳动保障权益的指导意见（人社部发〔2021〕56号）', tag: '新就业形态' },
                { id: 'guide-rest',      title: '新就业形态劳动者休息和劳动报酬权益保障指引',                             tag: '新就业形态' },
                { id: 'guide-publicity', title: '新就业形态劳动者劳动规则公示指引',                                     tag: '新就业形态' },
                { id: 'guide-service',   title: '新就业形态劳动者权益维护服务指南',                                     tag: '新就业形态' },
                { id: 'guide-15th',      title: '全力做好"十五五"时期新就业形态劳动者权益保障工作——《人力资源和社会保障事业发展"十五五"规划》系列解读', tag: '政策解读' },
                { id: 'injury-protect',  title: '新就业形态人员职业伤害保障办法（试行）',                                tag: '职业伤害' },
                { id: 'injury-manage',   title: '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）',              tag: '职业伤害' },
                { id: 'transport-122',   title: '关于加强交通运输新业态从业人员权益保障工作的意见（交运发〔2021〕122号）', tag: '交通运输' },
                { id: 'takeaway-38',     title: '关于落实网络餐饮平台责任切实维护外卖送餐员权益的指导意见（国市监网监发〔2021〕38号）', tag: '外卖送餐' },
                { id: 'over-age',        title: '超龄劳动者基本权益保障暂行规定',                                       tag: '超龄劳动者' },
                { id: 'union-guide',     title: '平台企业工会工作指引',                                                 tag: '工会工作' },
                { id: 'cases-3',         title: '劳动人事争议典型案例（第三批）',                                        tag: '典型案例' },
                { id: 'cases-4',         title: '劳动人事争议典型案例（第四批）',                                        tag: '典型案例' }
            ]
        },
        {
            id: 'social',
            name: '司法解释·最高法和最高检指导案例',
            icon: '⚖️',
            desc: '司法解释及指导案例',
            docs: [
                { id: 'labor-interpretation-2', title: '最高人民法院关于审理劳动争议案件适用法律问题的解释（二）',           tag: '司法解释' },
                { id: 'spc-guiding-new',        title: '最高人民法院首批新就业形态劳动争议专题指导性案例（第42批）',        tag: '指导案例' },
                { id: 'spc-guiding-news',       title: '最高人民法院发布新就业形态劳动争议专题指导性案例（新闻发布会）',    tag: '指导案例' },
                { id: 'spc-guiding-237',        title: '指导性案例237号：郎溪某服务外包有限公司诉徐某申确认劳动关系纠纷案', tag: '指导案例' },
                { id: 'spc-guiding-238',        title: '指导性案例238号：圣某欢诉江苏某网络科技有限公司确认劳动关系纠纷案', tag: '指导案例' },
                { id: 'spc-guiding-239',        title: '指导性案例239号：王某诉北京某文化传媒有限公司劳动争议案',          tag: '指导案例' },
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
                { id: 'payment-regulation',   title: '保障农民工工资支付条例',                                              tag: '行政法规' },
                { id: 'mohrss-56',            title: '关于维护新就业形态劳动者劳动保障权益的指导意见（人社部发〔2021〕56号）', tag: '部门规章' },
                { id: 'rights-regulation',    title: '新就业形态劳动者权益保障办法（征求意见稿）',                          tag: '部门规章' },
                { id: 'occupational-injury',  title: '新就业形态人员职业伤害保障办法（试行）',                              tag: '职业伤害' },
                { id: 'occupational-manage',  title: '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）',            tag: '职业伤害' },
                { id: 'cpc-opinion',          title: '中共中央办公厅 国务院办公厅关于加强新就业群体服务管理的意见',          tag: '中央文件' },
                { id: 'spc-guiding',          title: '最高人民法院发布首批新就业形态劳动争议专题指导性案例',                tag: '指导案例' },
                { id: 'rights-defense',       title: '构筑权益防线 护航新就业群体全面发展',                                tag: '政策解读' }
            ]
        },
        {
            id: 'local',
            name: '地方政策',
            icon: '📝',
            desc: '地方性政策与规定',
            docs: [
                // ===== 直辖市 =====
                { id: 'beijing-measures',      title: '北京市关于促进新就业形态健康发展的若干措施（京就发〔2021〕3号）',        tag: '北京' },
                { id: 'beijing-flexible',      title: '北京市人力资源和社会保障局支持多渠道灵活就业实施办法（京人社就发〔2020〕19号）', tag: '北京' },
                { id: 'shanghai-opinion',      title: '上海市人力资源和社会保障局等八部门关于维护新就业形态劳动者劳动保障权益的实施意见', tag: '上海' },
                { id: 'tianjin-opinion',       title: '天津市关于维护新就业形态劳动者劳动保障权益的实施意见',                    tag: '天津' },
                { id: 'chongqing-opinion',     title: '重庆市人力资源和社会保障局等11个部门关于维护新就业形态劳动者劳动保障权益的实施意见（渝人社发〔2021〕38号）', tag: '重庆' },
                { id: 'chongqing-mediation',   title: '重庆市加强新就业形态劳动纠纷一站式调解工作实施方案（渝人社〔2024〕310号）', tag: '重庆' },

                // ===== 华东 =====
                { id: 'zhejiang-regulation',   title: '浙江省就业促进条例',                                                    tag: '浙江' },
                { id: 'zhejiang-measures',     title: '浙江省维护新就业形态劳动者劳动保障权益实施办法',                        tag: '浙江' },
                { id: 'jiangsu-opinion',       title: '江苏省关于维护新就业形态劳动者劳动保障权益的意见',                      tag: '江苏' },
                { id: 'anhui-plan',            title: '安徽省关于维护新就业形态劳动者劳动保障权益的实施方案',                  tag: '安徽' },
                { id: 'fujian-15measures',     title: '福建省贯彻落实人力资源社会保障部等八部委关于维护新就业形态劳动者劳动保障权益指导意见的十五条措施', tag: '福建' },
                { id: 'xiamen-regulation',     title: '厦门经济特区网约配送员劳动权益保障若干规定',                            tag: '福建·厦门' },
                { id: 'jiangxi-opinion',       title: '江西省关于维护新就业形态劳动者劳动保障权益的实施意见',                  tag: '江西' },
                { id: 'jiangxi-injury',        title: '江西省新就业形态人员职业伤害保障实施办法（试行）',                      tag: '江西' },
                { id: 'shandong-opinion',      title: '山东省人力资源和社会保障厅等八部门关于维护新就业形态劳动者劳动保障权益的实施意见（鲁人社发〔2021〕15号）', tag: '山东' },
                { id: 'shandong-12measures',   title: '山东省关于进一步加强新就业形态劳动者劳动权益保障十二条措施的通知（鲁人社字〔2022〕65号）', tag: '山东' },
                { id: 'shandong-injury',       title: '山东省关于做好新就业形态人员职业伤害保障试点工作的通知（鲁人社字〔2025〕61号）', tag: '山东' },
                { id: 'shandong-mediation',    title: '山东省关于加强新就业形态劳动纠纷一站式调解工作的通知（鲁人社字〔2024〕87号）', tag: '山东' },
                { id: 'shandong-specific',     title: '山东省超龄人员和实习学生等特定从业人员参加工伤保险办法（试行）（鲁人社规〔2024〕2号）', tag: '山东' },

                // ===== 华北 =====
                { id: 'hebei-implementation',  title: '河北省关于维护新就业形态劳动者劳动保障权益的实施办法（暂行）',          tag: '河北' },
                { id: 'hebei-reply',           title: '河北省对政协第十三届委员会第三次会议第0619号提案的答复',              tag: '河北' },
                { id: 'shanxi-opinion',        title: '山西省关于进一步加强互联网平台企业劳动用工管理的实施意见（试行）',      tag: '山西' },
                { id: 'neimenggu-opinion',     title: '内蒙古自治区关于维护新就业形态劳动者劳动保障权益的实施意见',            tag: '内蒙古' },

                // ===== 东北 =====
                { id: 'liaoning-measures',     title: '辽宁省关于维护新就业形态劳动者劳动保障权益的若干措施',                tag: '辽宁' },
                { id: 'jilin-measures',        title: '吉林省维护新就业形态劳动者劳动保障权益实施办法（试行）',              tag: '吉林' },
                { id: 'heilongjiang-opinion',  title: '黑龙江省关于维护新就业形态劳动者劳动保障权益的实施意见',              tag: '黑龙江' },

                // ===== 华中 =====
                { id: 'henan-implementation',  title: '河南省关于维护新就业形态劳动者劳动保障权益实施办法',                  tag: '河南' },
                { id: 'hubei-measures',        title: '湖北省关于切实维护新就业形态劳动者劳动保障权益的若干措施',            tag: '湖北' },
                { id: 'hunan-opinion',         title: '湖南省关于维护新就业形态劳动者劳动保障权益的实施意见（湘人社规〔2021〕24号）', tag: '湖南' },

                // ===== 华南 =====
                { id: 'guangdong-injury',      title: '广东省关于单位从业的灵活就业劳动者等特定人员参加工伤保险的办法',        tag: '广东' },
                { id: 'guangxi-opinion',       title: '广西壮族自治区关于维护新就业形态劳动者劳动保障权益的实施意见（桂人社发〔2021〕63号）', tag: '广西' },
                { id: 'hainan-measures',       title: '海南省维护新就业形态劳动者劳动保障权益实施办法',                      tag: '海南' },
                { id: 'shenzhen-decision',     title: '深圳市人民代表大会常务委员会关于加强新就业形态劳动者权益保障的决定',    tag: '广东·深圳' },

                // ===== 西南 =====
                { id: 'sichuan-opinion',       title: '四川省关于维护新就业形态劳动者劳动保障权益的实施意见（川人社发〔2021〕29号）', tag: '四川' },
                { id: 'guizhou-opinion',       title: '贵州省关于维护新就业形态劳动者劳动保障权益的实施意见',                tag: '贵州' },
                { id: 'yunnan-opinion',        title: '云南省关于维护新就业形态劳动者劳动保障权益的实施意见（云人社发〔2021〕40号）', tag: '云南' },

                // ===== 西北 =====
                { id: 'shaanxi-implementation',title: '陕西省维护新就业形态劳动者劳动保障权益实施办法',                      tag: '陕西' },
                { id: 'gansu-opinion',         title: '甘肃省关于维护新就业形态劳动者劳动保障权益的实施意见（甘人社厅发〔2021〕23号）', tag: '甘肃' },
                { id: 'qinghai-measures',      title: '青海省关于维护新就业形态劳动者劳动保障权益的若干措施',                tag: '青海' },
                { id: 'ningxia-measures',      title: '宁夏回族自治区维护新就业形态劳动者劳动保障权益实施办法',              tag: '宁夏' },
                { id: 'xinjiang-opinion',      title: '新疆自治区关于维护新就业形态劳动者劳动保障权益的实施意见',            tag: '新疆' },

                // ===== 其他 =====
                { id: 'xizang-report',         title: '西藏关于在全区互联网平台企业、快递企业实施用工报告制度的通知',        tag: '西藏' }
            ]
        },
        {
            id: 'rights',
            name: '其他',
            icon: '📁',
            desc: '国际公约、职业伤害、典型案例等',
            docs: [
                { id: 'ilo-r198',             title: '国际劳工组织第198号建议书（关于雇佣关系的建议书）',                    tag: '国际公约' },
                { id: 'ilo-2026',             title: '2026年平台经济体面劳动公约',                                          tag: '国际公约' },
                { id: 'eu-2024-2831',         title: '欧盟平台工作指令（Directive (EU) 2024/2831）',                        tag: '国际立法' },
                { id: 'oecd-future',          title: 'OECD：非标准就业社会保障未来',                                        tag: '国际研究' },
                { id: 'uber-judgment',        title: '欧洲骑手案件判决书（Uber BV v Aslam）',                                tag: '境外司法' },
                { id: 'resolving-disputes',   title: 'Resolution of labour disputes involving new forms of employment in China', tag: '国际研究' },

                { id: 'occupational-injury',  title: '新就业形态人员职业伤害保障办法（试行）',                                tag: '职业伤害' },
                { id: 'occupational-manage',  title: '新就业形态人员职业伤害保障业务经办和征收管理规程（试行）',              tag: '职业伤害' },
                { id: 'expand-pilot',         title: '关于扩大新就业形态人员职业伤害保障试点的通知',                          tag: '职业伤害' },
                { id: 'injury-practice',      title: '新就业形态人员职业伤害保障试点实践',                                    tag: '职业伤害' },

                { id: 'gb46862',              title: '外卖平台服务管理基本要求（GB/T 46862—2025）',                          tag: '国家标准' },
                { id: 'gb41836',              title: '共享经济 指导原则与基础框架（GB/T 41836—2022）',                       tag: '国家标准' },
                { id: 'platform-algorithm',   title: '平台劳动规则和算法协商指引（试行）',                                    tag: '部门文件' },
                { id: 'union-guide',          title: '平台企业工会工作指引',                                                  tag: '工会工作' },
                { id: 'skill-standard',       title: '关于颁布网约配送员等18个国家职业技能标准的通知',                        tag: '职业技能' },
                { id: 'marketing-skill',      title: '关于颁布互联网营销师国家职业技能标准的通知',                            tag: '职业技能' },

                { id: 'social-law-report',    title: '关于检查《中华人民共和国社会保险法》实施情况的报告',                    tag: '执法检查' },
                { id: 'flexible-report',      title: '国务院关于灵活就业和新就业形态劳动者权益保障工作情况的报告',            tag: '政策报告' },
                { id: 'flexible-system',      title: '加快建立健全灵活就业人员保障体系',                                      tag: '政策研究' },
                { id: 'union-expect',         title: '8400万新就业形态劳动者的期盼渐成现实',                                  tag: '政策宣传' },
                { id: 'rights-protection',    title: '新就业形态下，劳动者权益保障更细更实',                                  tag: '政策宣传' },
                { id: 'better-rights',        title: '如何更好保障新就业形态劳动者权益',                                      tag: '政策解读' },
                { id: 'mohrss-measures',      title: '人社部"四条措施"促进灵活就业和新就业形态劳动者权益保障',              tag: '政策解读' },
                { id: 'employment-strategy',  title: '实施就业优先战略"十五五"规划',                                          tag: '国家规划' },

                { id: 'eleme-agreement',      title: '饿了么签订平台算法和劳动规则协议',                                      tag: '平台实践' },
                { id: 'meituan-insurance',    title: '美团骑手社保补贴全国上线',                                              tag: '平台实践' },

                { id: 'case-3rd',             title: '劳动人事争议典型案例（第三批）',                                        tag: '典型案例' },
                { id: 'case-4th',             title: '劳动人事争议典型案例（第四批）',                                        tag: '典型案例' },
                { id: 'spc-guiding',          title: '最高人民法院首批新就业形态劳动争议专题指导性案例',                      tag: '典型案例' },
                { id: 'rights-cases',         title: '新就业形态劳动者权益保障典型案例',                                      tag: '典型案例' },

                { id: 'measuring-dpe',        title: '数字平台就业与工作测量手册',                                            tag: '国际研究' }
            ]
        }
    ]
};

const dom = {
    categoryList: document.getElementById('category-list'),
    quickCards: document.getElementById('quick-cards'),
    searchScope: document.getElementById('search-scope'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),

    welcomeView: document.getElementById('welcome-view'),
    docView: document.getElementById('doc-view'),
    detailView: document.getElementById('detail-view'),
    searchView: document.getElementById('search-view'),

    docCatTitle: document.getElementById('doc-cat-title'),
    docList: document.getElementById('doc-list'),

    detailCatTitle: document.getElementById('detail-cat-title'),
    detailDocTitle: document.getElementById('detail-doc-title'),
    detailTitle: document.getElementById('detail-title'),
    detailTag: document.getElementById('detail-tag'),
    detailContent: document.getElementById('detail-content'),
    backToDoc: document.getElementById('back-to-doc'),

    searchKeywordLabel: document.getElementById('search-keyword-label'),
    searchList: document.getElementById('search-list')
};

const state = {
    currentCategoryId: null,
    currentDocId: null,
    currentTab: 'main'
};

document.addEventListener('DOMContentLoaded', () => {
    renderCategoryList();
    renderQuickCards();
    renderSearchScope();
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
        card.dataset.id = cat.id;
        card.innerHTML = `
            <div class="icon">${cat.icon || '📘'}</div>
            <div class="label">${cat.name}</div>
        `;
        card.addEventListener('click', () => selectCategory(cat.id));
        dom.quickCards.appendChild(card);
    });
}

function renderSearchScope() {
    DATA.categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.name;
        dom.searchScope.appendChild(opt);
    });
}

function bindEvents() {
    dom.searchBtn.addEventListener('click', doSearch);
    dom.searchInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') doSearch();
    });

    dom.backToDoc.addEventListener('click', () => {
        if (state.currentCategoryId) {
            selectCategory(state.currentCategoryId);
        } else {
            showView('welcome');
        }
    });

    document.querySelectorAll('.hero-tabs .tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.hero-tabs .tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            state.currentTab = tab.dataset.tab;
            if (!dom.detailView.classList.contains('hidden') && state.currentDocId) {
                renderDetailContent();
            }
        });
    });
}

function selectCategory(catId) {
    const cat = DATA.categories.find(c => c.id === catId);
    if (!cat) return;

    state.currentCategoryId = catId;

    document.querySelectorAll('#category-list li').forEach(li => {
        li.classList.toggle('active', li.dataset.id === catId);
    });

    dom.docCatTitle.textContent = cat.name;
    dom.docList.innerHTML = '';

    if (!cat.docs || cat.docs.length === 0) {
        dom.docList.innerHTML = '<li class="doc-item"><h3>暂无文档</h3><div class="doc-meta">内容稍后补充</div></li>';
    } else {
        const tagColors = ['', 'orange', 'purple', 'green', 'red', 'cyan'];
        cat.docs.forEach((doc, i) => {
            const li = document.createElement('li');
            li.className = 'doc-item';
            li.innerHTML = `
                <div class="doc-icon">📖</div>
                <div class="doc-body">
                    <h3>${doc.title}</h3>
                    <div class="doc-meta">
                        <span class="tag ${tagColors[i % tagColors.length]}">${doc.tag || ''}</span>
                    </div>
                </div>
                <span class="doc-arrow">›</span>
            `;
            li.addEventListener('click', () => selectDoc(cat.id, doc.id));
            dom.docList.appendChild(li);
        });
    }

    showView('doc');
}

function selectDoc(catId, docId) {
    const cat = DATA.categories.find(c => c.id === catId);
    if (!cat) return;
    const doc = (cat.docs || []).find(d => d.id === docId);
    if (!doc) return;

    state.currentCategoryId = catId;
    state.currentDocId = docId;

    dom.detailCatTitle.textContent = cat.name;
    dom.detailDocTitle.textContent = doc.title;
    dom.detailTitle.textContent = doc.title;
    dom.detailTag.textContent = doc.tag || '';

    renderDetailContent();
    showView('detail');
}

function renderDetailContent() {
    if (!state.currentDocId) return;
    const cat = DATA.categories.find(c => c.id === state.currentCategoryId);
    if (!cat) return;
    const doc = (cat.docs || []).find(d => d.id === state.currentDocId);
    if (!doc) return;

    let text = '';
    if (state.currentTab === 'interpret') {
        text = doc.interpret || '暂无释义。';
    } else if (state.currentTab === 'summary') {
        text = doc.summary || '暂无条旨。';
    } else {
        text = doc.content || '暂无正文。';
    }

    dom.detailContent.innerHTML = text
        .split('\n')
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('');
}

function doSearch() {
    const keyword = dom.searchInput.value.trim();
    if (!keyword) { showView('welcome'); return; }

    const scope = dom.searchScope.value;
    const results = [];

    DATA.categories.forEach(cat => {
        if (scope !== 'all' && scope !== cat.id) return;
        (cat.docs || []).forEach(doc => {
            const text = [doc.title, doc.content, doc.interpret, doc.summary].filter(Boolean).join(' ');
            if (text.includes(keyword)) results.push({ cat, doc });
        });
    });

    dom.searchKeywordLabel.textContent = keyword;
    dom.searchList.innerHTML = '';

    if (results.length === 0) {
        dom.searchList.innerHTML = '<li class="doc-item"><h3>没有找到相关内容</h3></li>';
    } else {
        results.forEach(({ cat, doc }) => {
            const li = document.createElement('li');
            li.className = 'doc-item';
            li.innerHTML = `
                <div class="doc-icon">📖</div>
                <div class="doc-body">
                    <h3>${doc.title}</h3>
                    <div class="doc-meta">${cat.name} · ${doc.tag || ''}</div>
                </div>
                <span class="doc-arrow">›</span>
            `;
            li.addEventListener('click', () => selectDoc(cat.id, doc.id));
            dom.searchList.appendChild(li);
        });
    }

    showView('search');
}

function showView(view) {
    dom.welcomeView.classList.add('hidden');
    dom.docView.classList.add('hidden');
    dom.detailView.classList.add('hidden');
    dom.searchView.classList.add('hidden');

    switch (view) {
        case 'welcome': dom.welcomeView.classList.remove('hidden'); break;
        case 'doc':     dom.docView.classList.remove('hidden'); break;
        case 'detail':  dom.detailView.classList.remove('hidden'); break;
        case 'search':  dom.searchView.classList.remove('hidden'); break;
    }
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}