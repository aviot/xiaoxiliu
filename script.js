const typeDesc = {
  INTJ: '战略家（INTJ）：你擅长独立思考与系统规划，做事追求长期价值和效率。面对复杂问题时，你会先搭建框架再推进执行；在人际上偏克制，但对重要关系非常真诚。适合在需要战略判断、结构化分析和持续优化的场景中发光。',
  INTP: '逻辑学家（INTP）：你有强烈的求知欲和抽象思维能力，喜欢拆解问题本质。你通常不盲从结论，更愿意自己验证逻辑；在兴趣驱动下会爆发极高专注力。适合研究、产品设计、技术探索等需要创造性思考的方向。',
  ENTJ: '指挥官（ENTJ）：你目标感强，善于定方向、配资源、推执行。你习惯站在全局看问题，决策果断，抗压能力强；同时也需要注意沟通中的温度。适合管理、创业、业务推进等需要领导力与结果导向的岗位。',
  ENTP: '辩论家（ENTP）：你反应快、点子多，擅长从不同角度发现机会。你喜欢挑战既有路径，敢于尝试新方法；在变化环境中往往越战越勇。适合创新业务、策略、内容创意、增长实验等高变化领域。',
  INFJ: '提倡者（INFJ）：你洞察细腻，能看到人和事情背后的动机与意义。你重视价值感与长期影响，既有理想也愿意踏实落地。适合教育、咨询、内容策划、品牌叙事等需要理解人心与愿景驱动的方向。',
  INFP: '调停者（INFP）：你真诚温和，内在价值观稳定，富有同理心和想象力。你更在意“这件事是否值得”，而不仅是“是否高效”；在被认可与信任的环境中创造力很强。适合创作、设计、心理支持、公益相关工作。',
  ENFJ: '主人公（ENFJ）：你善于激励他人，能够把团队目标和个人成长连接起来。你沟通自然、感染力强，常常是团队中的润滑剂和组织者。适合培训、管理、运营、社群和对外协作等高沟通场景。',
  ENFP: '竞选者（ENFP）：你热情开放，好奇心旺盛，擅长连接人和机会。你对新鲜事物敏感，能快速进入状态并带动气氛；需要注意聚焦和节奏管理。适合市场、内容、商务拓展、创意策划等动态岗位。',
  ISTJ: '物流师（ISTJ）：你务实可靠，重视规则与承诺，做事严谨稳定。你习惯用清晰流程保障质量，对细节和风险有很强把控力。适合财务、法务、项目管理、供应链、质量管理等强调规范性的工作。',
  ISFJ: '守卫者（ISFJ）：你细致体贴、责任心强，擅长在幕后把事情照顾周全。你对人和关系非常用心，执行稳健，值得长期信赖。适合行政、人力支持、客户成功、医疗照护、教育服务等岗位。',
  ESTJ: '总经理（ESTJ）：你执行力强，擅长建立标准、明确分工并推动结果。你对时间与秩序敏感，善于把混乱变成可管理流程。适合运营管理、团队带领、项目落地、组织协调等任务型角色。',
  ESFJ: '执政官（ESFJ）：你亲和力高，重视合作与稳定关系，乐于营造正向氛围。你擅长关注群体需求并推动协作落地，在服务型和组织型场景表现突出。适合客户运营、人力、社群、活动与服务管理方向。',
  ISTP: '鉴赏家（ISTP）：你冷静务实，偏好用行动解决真实问题。你面对突发状况时判断迅速，手脑配合能力强；不喜欢繁琐流程，更看重有效结果。适合工程、运维、产品实现、应急处理等实操导向岗位。',
  ISFP: '探险家（ISFP）：你温和敏感，审美在线，重体验也重真实感受。你不爱高调表达，但会通过作品和行动传递态度；在自由度较高环境里更能发挥。适合视觉设计、内容创作、品牌表达、体验优化等领域。',
  ESTP: '企业家（ESTP）：你行动快、胆子大，擅长在不确定中抓住机会。你实战能力强，偏好边做边调，遇到挑战反而更兴奋；需要注意长期规划与风险边界。适合销售、商务、增长、现场运营等前线岗位。',
  ESFP: '表演者（ESFP）：你活力足、感染力强，善于让现场“活起来”。你重视当下体验，社交直觉好，能够快速建立连接并带来情绪价值。适合内容出镜、活动主持、用户运营、服务体验等互动型工作。'
};

const questions = [
  {
    text: '周末你更愿意？',
    options: [
      { label: '约朋友出去玩', dimension: 'E' },
      { label: '独处休息充电', dimension: 'I' }
    ]
  },
  {
    text: '开会时你通常？',
    options: [
      { label: '边想边说', dimension: 'E' },
      { label: '想好再说', dimension: 'I' }
    ]
  },
  {
    text: '你更相信？',
    options: [
      { label: '事实与经验', dimension: 'S' },
      { label: '直觉与灵感', dimension: 'N' }
    ]
  },
  {
    text: '学习新东西时更偏好？',
    options: [
      { label: '步骤明确、可落地', dimension: 'S' },
      { label: '先理解整体概念', dimension: 'N' }
    ]
  },
  {
    text: '做决定时你更看重？',
    options: [
      { label: '逻辑和结果', dimension: 'T' },
      { label: '感受和影响', dimension: 'F' }
    ]
  },
  {
    text: '同事求助但会拖慢你进度，你会？',
    options: [
      { label: '先评估效率再决定', dimension: 'T' },
      { label: '优先照顾对方感受', dimension: 'F' }
    ]
  },
  {
    text: '旅行前你会？',
    options: [
      { label: '提前列好计划', dimension: 'J' },
      { label: '到时候随机应变', dimension: 'P' }
    ]
  },
  {
    text: '面对任务截止时间，你更常？',
    options: [
      { label: '提前完成更安心', dimension: 'J' },
      { label: '最后冲刺效率高', dimension: 'P' }
    ]
  }
];

const state = {
  current: 0,
  scores: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
};

const progressEl = document.getElementById('progress');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const quizViewEl = document.getElementById('quiz-view');
const resultViewEl = document.getElementById('result-view');
const resultTypeEl = document.getElementById('result-type');
const resultDescEl = document.getElementById('result-desc');
const scoreLinesEl = document.getElementById('score-lines');
const restartBtnEl = document.getElementById('restart-btn');

function renderQuestion() {
  const currentQuestion = questions[state.current];
  progressEl.textContent = `第 ${state.current + 1} / ${questions.length} 题`;
  questionEl.textContent = currentQuestion.text;

  optionsEl.innerHTML = '';
  currentQuestion.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option.label;
    button.addEventListener('click', () => answer(option.dimension));
    optionsEl.appendChild(button);
  });
}

function answer(dimension) {
  state.scores[dimension] += 1;
  state.current += 1;

  if (state.current >= questions.length) {
    showResult();
    return;
  }

  renderQuestion();
}

function showResult() {
  const resultType = [
    state.scores.E >= state.scores.I ? 'E' : 'I',
    state.scores.S >= state.scores.N ? 'S' : 'N',
    state.scores.T >= state.scores.F ? 'T' : 'F',
    state.scores.J >= state.scores.P ? 'J' : 'P'
  ].join('');

  resultTypeEl.textContent = resultType;
  resultDescEl.textContent = typeDesc[resultType];

  const lines = [
    { name: '精力来源', left: 'E', leftValue: state.scores.E, right: 'I', rightValue: state.scores.I },
    { name: '信息处理', left: 'S', leftValue: state.scores.S, right: 'N', rightValue: state.scores.N },
    { name: '决策方式', left: 'T', leftValue: state.scores.T, right: 'F', rightValue: state.scores.F },
    { name: '生活方式', left: 'J', leftValue: state.scores.J, right: 'P', rightValue: state.scores.P }
  ];

  scoreLinesEl.innerHTML = lines
    .map(
      (line) =>
        `<div class="score-line"><span>${line.name}</span><span>${line.left} ${line.leftValue} : ${line.rightValue} ${line.right}</span></div>`
    )
    .join('');

  quizViewEl.classList.add('hidden');
  resultViewEl.classList.remove('hidden');
}

function restart() {
  state.current = 0;
  state.scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  resultViewEl.classList.add('hidden');
  quizViewEl.classList.remove('hidden');
  renderQuestion();
}

restartBtnEl.addEventListener('click', restart);
renderQuestion();
