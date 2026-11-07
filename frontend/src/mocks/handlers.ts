import { http, HttpResponse } from 'msw';

const API_BASE = '*/api/v1';

export const mockQuestions = [
  {
    id: 'q-demo-01',
    code: 'MED-CLM-001',
    area: 'Clínica Médica',
    topicName: 'Cardiologia - Síndrome Coronariana Aguda',
    difficulty: 'MEDIUM',
    year: 2025,
    source: 'Simulado MedLevel (Demonstração)',
    status: 'PUBLISHED',
    stem: 'Um homem de 58 anos, hipertenso e tabagista, chega à UPA com dor retroesternal em aperto iniciada há 2 horas, irradiada para o membro superior esquerdo e mandíbula, acompanhada de sudorese fria. O ECG revela supradesnivelamento do segmento ST de 2,5 mm em DII, DIII e aVF. O tempo estimado de transferência para centro com hemodinâmica é de 180 minutos. Qual é a conduta farmacológica prioritária imediata recomendada?',
    disclaimer: 'Material de estudo para demonstração. Não substitui diretrizes oficiais nem orientação clínica.',
    alternatives: [
      {
        id: 'alt-01-a',
        letter: 'A',
        text: 'Administrar terapia trombolítica com fibrinolítico intravenoso (ex.: tenecteplase ou alteplase) associada a dupla antiagregação plaquetária.',
        isCorrect: true,
        explanation: 'No IAM com supra de ST, quando o tempo previsto porta-balão exceder 120 minutos, a trombólise imediata em até 30 minutos é a indicação padrão classe I.',
      },
      {
        id: 'alt-01-b',
        letter: 'B',
        text: 'Aguardar o resultado da primeira dosagem sérica de troponina ultrassensível antes de qualquer intervenção de reperfusão.',
        isCorrect: false,
        explanation: 'A decisão de reperfusão em IAM com supra é clínica e eletrocardiográfica; nunca se deve aguardar marcadores de necrose.',
      },
      {
        id: 'alt-01-c',
        letter: 'C',
        text: 'Iniciar heparinização plena isolada e prescrever betabloqueador intravenoso em altas doses.',
        isCorrect: false,
        explanation: 'Betabloqueador intravenoso imediato pode induzir choque cardiogênico e heparina isolada não recanaliza artéria ocluída.',
      },
      {
        id: 'alt-01-d',
        letter: 'D',
        text: 'Indicar transferência imediata para angioplastia primária, independentemente do tempo de deslocamento previsto.',
        isCorrect: false,
        explanation: 'Tempo previsto superior a 120 minutos impõe fibrinólise imediata com estratégia fármaco-invasiva subsequente.',
      },
    ],
  },
  {
    id: 'q-demo-02',
    code: 'MED-CIR-001',
    area: 'Cirurgia',
    topicName: 'Abdome Agudo Inflamatório - Apendicite',
    difficulty: 'EASY',
    year: 2025,
    source: 'Simulado MedLevel (Demonstração)',
    status: 'PUBLISHED',
    stem: 'Jovem de 21 anos é admitido com dor periumbilical iniciada há 18 horas, que migrou para a fossa ilíaca direita há 6 horas. Apresenta febre de 38,1 °C, náuseas e inapetência. Exame físico: descompressão dolorosa positiva no ponto de McBurney e dor na fossa ilíaca direita provocada pela palpação da fossa ilíaca esquerda. Quais são, respectivamente, esses dois sinais clínicos?',
    disclaimer: 'Material de estudo para demonstração. Não substitui diretrizes oficiais nem orientação clínica.',
    alternatives: [
      {
        id: 'alt-02-a',
        letter: 'A',
        text: 'Sinal de Blumberg e Sinal de Rovsing.',
        isCorrect: true,
        explanation: 'Descompressão brusca dolorosa em McBurney = Blumberg; dor na FID à palpação na FIE (deslocamento retrógrado de gases) = Rovsing.',
      },
      {
        id: 'alt-02-b',
        letter: 'B',
        text: 'Sinal de Murphy e Sinal de Cullen.',
        isCorrect: false,
        explanation: 'Murphy é parada respiratória na palpação da vesícula; Cullen é equimose periumbilical.',
      },
      {
        id: 'alt-02-c',
        letter: 'C',
        text: 'Sinal do Obturador e Sinal de Dunphy.',
        isCorrect: false,
        explanation: 'Obturador envolve rotação da coxa flexionada; Dunphy é dor na FID ao tossir.',
      },
      {
        id: 'alt-02-d',
        letter: 'D',
        text: 'Sinal de Kehr e Sinal de Jobert.',
        isCorrect: false,
        explanation: 'Kehr é dor escapular referida; Jobert é perda de macicez hepática por pneumoperitônio.',
      },
    ],
  },
  {
    id: 'q-demo-03',
    code: 'MED-PED-001',
    area: 'Pediatria',
    topicName: 'Bronquiolite Viral Aguda',
    difficulty: 'MEDIUM',
    year: 2025,
    source: 'Simulado MedLevel (Demonstração)',
    status: 'PUBLISHED',
    stem: 'Lactente de 4 meses apresenta tosse e coriza há 3 dias, evoluindo com taquipneia (FR 62 irpm), tiragem subcostal moderada e tempo expiratório prolongado com sibilos e estertores crepitantes bilaterais. Teste rápido para VSR é positivo. Qual é a conduta preconizada segundo as diretrizes pediátricas vigentes?',
    disclaimer: 'Material de estudo para demonstração. Não substitui diretrizes oficiais nem orientação clínica.',
    alternatives: [
      {
        id: 'alt-03-a',
        letter: 'A',
        text: 'Suporte clínico com lavagem nasal com soro fisiológico, oxigenoterapia se SpO2 < 90-92% e hidratação adequada.',
        isCorrect: true,
        explanation: 'Na BVA em lactente, as diretrizes da SBP contraindicam corticoides, broncodilatadores rotineiros e antibióticos.',
      },
      {
        id: 'alt-03-b',
        letter: 'B',
        text: 'Prednisolona oral por 7 dias associada a nebulizações frequentes de fenoterol.',
        isCorrect: false,
        explanation: 'Corticoides sistêmicos não alteram tempo de internação nem desfechos clínicos na bronquiolite típica.',
      },
      {
        id: 'alt-03-c',
        letter: 'C',
        text: 'Amoxicilina com clavulanato profilática para evitar infecção bacteriana secundária.',
        isCorrect: false,
        explanation: 'Antibioticoterapia empírica é proscrita sem foco bacteriano comprovado.',
      },
      {
        id: 'alt-03-d',
        letter: 'D',
        text: 'Fisioterapia respiratória motora vigorosa com drenagem postural.',
        isCorrect: false,
        explanation: 'Fisioterapia motora de rotina pode aumentar a reatividade de via aérea em lactentes pequenos.',
      },
    ],
  },
  {
    id: 'q-demo-04',
    code: 'MED-GO-001',
    area: 'Ginecologia e Obstetrícia',
    topicName: 'Síndromes Hipertensivas da Gestação - Pré-eclâmpsia',
    difficulty: 'MEDIUM',
    year: 2025,
    source: 'Simulado MedLevel (Demonstração)',
    status: 'PUBLISHED',
    stem: 'Primigesta de 34 semanas comparece com cefaleia frontal intensa, escotomas cintilantes e dor epigástrica em barra. Ao exame: PA 165/110 mmHg e hiper-reflexia patelar. Plaquetas 82.000/mm³ e TGO 140 U/L. Qual é o diagnóstico e o esquema medicamentoso imediato indicado para profilaxia de convulsões?',
    disclaimer: 'Material de estudo para demonstração. Não substitui diretrizes oficiais nem orientação clínica.',
    alternatives: [
      {
        id: 'alt-04-a',
        letter: 'A',
        text: 'Pré-eclâmpsia grave com iminência de eclâmpsia e Síndrome HELLP; conduta imediata: Sulfato de Magnésio e anti-hipertensivo venoso.',
        isCorrect: true,
        explanation: 'Cefaleia, escotomas e epigastralgia em barra indicam iminência de eclâmpsia. O sulfato de magnésio é a droga de escolha incontestável.',
      },
      {
        id: 'alt-04-b',
        letter: 'B',
        text: 'Hipertensão gestacional transitória; repouso absoluto no leito sem uso de medicações anticonvulsivantes.',
        isCorrect: false,
        explanation: 'A presença de plaquetopenia, transaminases elevadas e sintomas neurológicos fecha pré-eclâmpsia grave.',
      },
      {
        id: 'alt-04-c',
        letter: 'C',
        text: 'Diazepam 10 mg venoso contínuo e diurético de alça para controle do edema.',
        isCorrect: false,
        explanation: 'Diazepam é inferior ao sulfato de magnésio e diuréticos agravam a hipovolemia relativa da pré-eclâmpsia.',
      },
      {
        id: 'alt-04-d',
        letter: 'D',
        text: 'Cesariana imediata sob anestesia geral antes de administrar qualquer anticonvulsivante.',
        isCorrect: false,
        explanation: 'A estabilização hemodinâmica e administração de sulfato de magnésio devem sempre preceder o parto.',
      },
    ],
  },
  {
    id: 'q-demo-05',
    code: 'MED-SC-001',
    area: 'Saúde Coletiva',
    topicName: 'Princípios e Diretrizes do SUS',
    difficulty: 'EASY',
    year: 2025,
    source: 'Simulado MedLevel (Demonstração)',
    status: 'PUBLISHED',
    stem: 'Médico da Estratégia Saúde da Família planeja ações de atendimento prioritário em domicílio para idosos acamados e famílias em vulnerabilidade extrema, oferecendo mais atenção a quem tem maior necessidade social e clínica. Qual princípio doutrinário do SUS fundamenta essa conduta?',
    disclaimer: 'Material de estudo para demonstração. Não substitui diretrizes oficiais nem orientação clínica.',
    alternatives: [
      {
        id: 'alt-05-a',
        letter: 'A',
        text: 'Equidade.',
        isCorrect: true,
        explanation: 'A equidade visa diminuir as desigualdades sociais e sanitárias tratando os desiguais conforme suas carências específicas.',
      },
      {
        id: 'alt-05-b',
        letter: 'B',
        text: 'Integralidade.',
        isCorrect: false,
        explanation: 'Integralidade articula ações de promoção, prevenção e tratamento nas diversas fases da vida.',
      },
      {
        id: 'alt-05-c',
        letter: 'C',
        text: 'Universalidade.',
        isCorrect: false,
        explanation: 'Universalidade garante acesso à saúde como direito de cidadania a toda a população.',
      },
      {
        id: 'alt-05-d',
        letter: 'D',
        text: 'Descentralização.',
        isCorrect: false,
        explanation: 'Descentralização diz respeito à partilha de competências com ênfase na municipalização.',
      },
    ],
  },
];

export const handlers = [
  // Auth
  http.post(`${API_BASE}/auth/login`, async () => {
    return HttpResponse.json({
      user: {
        id: 'usr-demo-student',
        name: 'Camila Rocha da Silva',
        email: 'estudante@medlevel.com.br',
        role: 'STUDENT',
        targetExamDate: '2026-11-20',
        weeklyHoursGoal: 20,
      },
      tokens: {
        accessToken: 'mocked-jwt-access-token',
        refreshToken: 'mocked-jwt-refresh-token',
      },
    });
  }),

  http.post(`${API_BASE}/auth/register`, async () => {
    return HttpResponse.json({
      user: {
        id: 'usr-new-student',
        name: 'Novo Estudante',
        email: 'estudante@medlevel.com.br',
        role: 'STUDENT',
        targetExamDate: '2026-11-20',
        weeklyHoursGoal: 20,
      },
      tokens: {
        accessToken: 'mocked-jwt-access-token',
        refreshToken: 'mocked-jwt-refresh-token',
      },
    });
  }),

  http.get(`${API_BASE}/auth/me`, async () => {
    return HttpResponse.json({
      id: 'usr-demo-student',
      name: 'Camila Rocha da Silva',
      email: 'estudante@medlevel.com.br',
      role: 'STUDENT',
      targetExamDate: '2026-11-20',
      weeklyHoursGoal: 20,
    });
  }),

  // Questions
  http.get(`${API_BASE}/questions`, ({ request }) => {
    const url = new URL(request.url);
    const area = url.searchParams.get('area');
    const search = url.searchParams.get('search')?.toLowerCase();

    let filtered = mockQuestions;
    if (area && area !== 'all') {
      filtered = filtered.filter((q) => q.area === area);
    }
    if (search) {
      filtered = filtered.filter(
        (q) => q.stem.toLowerCase().includes(search) || q.code.toLowerCase().includes(search),
      );
    }

    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
      page: 1,
      totalPages: 1,
    });
  }),

  http.get(`${API_BASE}/questions/:id`, ({ params }) => {
    const q = mockQuestions.find((item) => item.id === params.id) || mockQuestions[0];
    return HttpResponse.json(q);
  }),

  http.post(`${API_BASE}/questions/:id/attempt`, async ({ request, params }) => {
    const body = (await request.json()) as any;
    const q = mockQuestions.find((item) => item.id === params.id) || mockQuestions[0];
    const selected = q.alternatives.find((alt) => alt.id === body.alternativeId);
    const correct = q.alternatives.find((alt) => alt.isCorrect);

    const isCorrect = selected?.isCorrect || false;

    return HttpResponse.json({
      id: 'att-mock-' + Date.now(),
      questionId: q.id,
      isCorrect,
      selectedAlternativeId: body.alternativeId,
      correctAlternativeId: correct?.id,
      explanation: selected?.explanation,
      durationSeconds: body.durationSeconds || 60,
      inReviewDeck: !isCorrect,
      alternativesFeedback: q.alternatives,
    });
  }),

  // Dashboard Stats
  http.get(`${API_BASE}/dashboard/stats`, () => {
    return HttpResponse.json({
      totalAttempts: 142,
      overallAccuracy: 76.8,
      averageTimeSeconds: 114,
      completedExamsCount: 3,
      activeReviewCardsCount: 8,
      areaAccuracy: [
        { area: 'Clínica Médica', accuracy: 82.5, attempts: 40 },
        { area: 'Cirurgia', accuracy: 78.0, attempts: 32 },
        { area: 'Pediatria', accuracy: 75.0, attempts: 28 },
        { area: 'Ginecologia e Obstetrícia', accuracy: 68.4, attempts: 22 },
        { area: 'Saúde Coletiva', accuracy: 85.0, attempts: 20 },
      ],
      weeklyEvolution: [
        { week: 'Semana 1', accuracy: 62.0, questionsDone: 30 },
        { week: 'Semana 2', accuracy: 68.5, questionsDone: 35 },
        { week: 'Semana 3', accuracy: 74.0, questionsDone: 42 },
        { week: 'Semana 4 (atual)', accuracy: 76.8, questionsDone: 35 },
      ],
      weakTopics: [
        { name: 'Síndromes Hipertensivas na Gestação', area: 'Ginecologia e Obstetrícia', accuracy: 50.0 },
        { name: 'Injúria Renal Aguda e NTA', area: 'Clínica Médica', accuracy: 55.0 },
        { name: 'Doenças Exantemáticas na Infância', area: 'Pediatria', accuracy: 60.0 },
      ],
      strongTopics: [
        { name: 'Princípios e Diretrizes do SUS', area: 'Saúde Coletiva', accuracy: 92.0 },
        { name: 'Apendicite e Abdome Agudo', area: 'Cirurgia', accuracy: 88.0 },
        { name: 'Síndrome Coronariana Aguda', area: 'Clínica Médica', accuracy: 85.0 },
      ],
    });
  }),

  // Reviews SM-2
  http.get(`${API_BASE}/reviews/today`, () => {
    return HttpResponse.json([
      {
        id: 'rev-card-01',
        questionId: mockQuestions[3].id,
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5,
        dueDate: new Date().toISOString(),
        question: mockQuestions[3],
      },
      {
        id: 'rev-card-02',
        questionId: mockQuestions[1].id,
        repetitions: 1,
        interval: 6,
        easeFactor: 2.36,
        dueDate: new Date().toISOString(),
        question: mockQuestions[1],
      },
    ]);
  }),

  http.post(`${API_BASE}/reviews/:id/grade`, async ({ request, params }) => {
    const body = (await request.json()) as any;
    return HttpResponse.json({
      id: params.id,
      easeFactor: 2.5,
      interval: body.grade >= 3 ? 6 : 1,
      repetitions: body.grade >= 3 ? 2 : 0,
      dueDate: new Date(Date.now() + 86400000 * (body.grade >= 3 ? 6 : 1)).toISOString(),
    });
  }),

  // Study Plan
  http.get(`${API_BASE}/study-plan`, () => {
    return HttpResponse.json({
      targetExamDate: '2026-11-20',
      daysRemaining: 18,
      weeklyHoursGoal: 20,
      dailySuggestedTopics: [
        {
          id: 'go-pre-eclampsia',
          topicName: 'Síndromes Hipertensivas da Gestação (Pré-eclâmpsia)',
          area: 'Ginecologia e Obstetrícia',
          reason: 'Foco prioritário por incidência de erros recentes no Caderno de Erros',
          recommendedQuestions: 15,
        },
        {
          id: 'cardio-sca',
          topicName: 'Síndrome Coronariana Aguda e Reperfusão',
          area: 'Clínica Médica',
          reason: 'Tema de altíssima cobrança na matriz oficial do ENAMED',
          recommendedQuestions: 15,
        },
        {
          id: 'sc-principios-sus',
          topicName: 'Diretrizes Doutrinárias e Lei 8.142 do SUS',
          area: 'Saúde Coletiva',
          reason: 'Revisão periódica recomendada para consolidação',
          recommendedQuestions: 10,
        },
      ],
    });
  }),

  // Exams
  http.post(`${API_BASE}/exams`, async ({ request }) => {
    const body = (await request.json()) as any;
    const isOfficial = body.mode === 'ENAMED_OFFICIAL';

    return HttpResponse.json({
      id: 'exam-sess-001',
      mode: body.mode,
      status: 'IN_PROGRESS',
      totalQuestions: mockQuestions.length,
      durationMinutes: isOfficial ? 300 : 60,
      startedAt: new Date().toISOString(),
      remainingSeconds: isOfficial ? 18000 : 3600,
      questions: mockQuestions.map((q, idx) => ({
        id: q.id,
        orderIndex: idx + 1,
        code: q.code,
        area: q.area,
        topicName: q.topicName,
        stem: q.stem,
        alternatives: q.alternatives.map((alt) => ({
          id: alt.id,
          letter: alt.letter,
          text: alt.text,
        })),
      })),
      answers: {},
    });
  }),

  http.get(`${API_BASE}/exams/:id`, () => {
    return HttpResponse.json({
      id: 'exam-sess-001',
      mode: 'ENAMED_OFFICIAL',
      status: 'IN_PROGRESS',
      totalQuestions: mockQuestions.length,
      durationMinutes: 300,
      startedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      remainingSeconds: 17100,
      questions: mockQuestions.map((q, idx) => ({
        id: q.id,
        orderIndex: idx + 1,
        code: q.code,
        area: q.area,
        topicName: q.topicName,
        stem: q.stem,
        alternatives: q.alternatives.map((alt) => ({
          id: alt.id,
          letter: alt.letter,
          text: alt.text,
        })),
      })),
      answers: {
        'q-demo-01': { alternativeId: 'alt-01-a', flaggedForReview: false },
      },
    });
  }),

  http.post(`${API_BASE}/exams/:id/answers`, async () => {
    return HttpResponse.json({ success: true });
  }),

  http.post(`${API_BASE}/exams/:id/finish`, async () => {
    return HttpResponse.json({
      id: 'exam-sess-001',
      mode: 'ENAMED_OFFICIAL',
      status: 'FINISHED',
      totalQuestions: 5,
      correctCount: 4,
      scorePercentage: 80.0,
      totalDurationSeconds: 4200,
      areaBreakdown: [
        { area: 'Clínica Médica', total: 1, correct: 1, percentage: 100.0 },
        { area: 'Cirurgia', total: 1, correct: 1, percentage: 100.0 },
        { area: 'Pediatria', total: 1, correct: 1, percentage: 100.0 },
        { area: 'Ginecologia e Obstetrícia', total: 1, correct: 0, percentage: 0.0 },
        { area: 'Saúde Coletiva', total: 1, correct: 1, percentage: 100.0 },
      ],
    });
  }),

  http.get(`${API_BASE}/exams/:id/report`, () => {
    return HttpResponse.json({
      id: 'exam-sess-001',
      mode: 'ENAMED_OFFICIAL',
      status: 'FINISHED',
      totalQuestions: 5,
      correctCount: 4,
      scorePercentage: 80.0,
      totalDurationSeconds: 4200,
      areaBreakdown: [
        { area: 'Clínica Médica', total: 1, correct: 1, percentage: 100.0 },
        { area: 'Cirurgia', total: 1, correct: 1, percentage: 100.0 },
        { area: 'Pediatria', total: 1, correct: 1, percentage: 100.0 },
        { area: 'Ginecologia e Obstetrícia', total: 1, correct: 0, percentage: 0.0 },
        { area: 'Saúde Coletiva', total: 1, correct: 1, percentage: 100.0 },
      ],
      questionsReview: mockQuestions.map((q, idx) => ({
        orderIndex: idx + 1,
        questionId: q.id,
        stem: q.stem,
        code: q.code,
        area: q.area,
        topicName: q.topicName,
        selectedAlternativeId: q.alternatives[0].id,
        isCorrect: q.alternatives[0].isCorrect,
        alternatives: q.alternatives,
      })),
    });
  }),
];
