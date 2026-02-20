const typeDesc = {
  INTJ: '战略家：独立、理性、擅长长期规划。',
  INTP: '逻辑学家：好奇心强，喜欢分析与抽象思考。',
  ENTJ: '指挥官：目标导向，善于组织和推动执行。',
  ENTP: '辩论家：点子很多，喜欢探索新可能。',
  INFJ: '提倡者：洞察力强，重视意义与价值。',
  INFP: '调停者：理想主义，真诚且富有同理心。',
  ENFJ: '主人公：擅长鼓舞他人，关注团队氛围。',
  ENFP: '竞选者：热情开放，喜欢新鲜和连接。',
  ISTJ: '物流师：务实可靠，重视规则和秩序。',
  ISFJ: '守卫者：细致温和，乐于支持身边的人。',
  ESTJ: '总经理：执行力强，偏好清晰标准。',
  ESFJ: '执政官：重视关系，善于协调与服务。',
  ISTP: '鉴赏家：冷静实干，喜欢动手解决问题。',
  ISFP: '探险家：随和敏感，追求体验与美感。',
  ESTP: '企业家：行动迅速，擅长临场应对。',
  ESFP: '表演者：活力十足，享受当下与互动。'
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
