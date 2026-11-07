import { PrismaClient, Difficulty, QuestionStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const DISCLAIMER_TEXT =
  'Conteúdo de demonstração, não revisado por banca examinadora oficial. Destinado exclusivamente para validação e testes da plataforma MedLevel.';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Cleanup existing tables if any
  await prisma.reviewCard.deleteMany();
  await prisma.examSessionQuestion.deleteMany();
  await prisma.examSession.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.alternative.deleteMany();
  await prisma.question.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.studyPlan.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users (Demo Student and Admin)
  const studentPasswordHash = await bcrypt.hash('Senha123#', 10);
  const adminPasswordHash = await bcrypt.hash('Admin123#', 10);

  const studentUser = await prisma.user.create({
    data: {
      id: 'usr_student_demo_01',
      name: 'Camila Rocha da Silva',
      email: 'estudante@medlevel.com.br',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      targetExamDate: new Date('2026-11-20'),
      weeklyHoursGoal: 20,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      id: 'usr_admin_demo_01',
      name: 'Dr. Roberto Medeiros (Admin)',
      email: 'admin@medlevel.com.br',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('✅ Created users:', studentUser.email, adminUser.email);

  // 3. Create Topics Hierarchy (5 Broad Areas and Subtopics)
  const areasData = [
    {
      name: 'Clínica Médica',
      slug: 'clinica-medica',
      description: 'Cardiologia, Pneumologia, Nefrologia, Gastroenterologia e Infectologia',
      children: [
        { name: 'Cardiologia - Síndrome Coronariana Aguda', slug: 'cardio-sca' },
        { name: 'Pneumologia - Asma e DPOC', slug: 'pneumo-dpoc' },
        { name: 'Infectologia - Arboviroses e Dengue', slug: 'infecto-dengue' },
        { name: 'Nefrologia - Injúria Renal Aguda', slug: 'nefro-ira' },
      ],
    },
    {
      name: 'Cirurgia',
      slug: 'cirurgia',
      description: 'Cirurgia Geral, Trauma, Abdome Agudo e Urologia',
      children: [
        { name: 'Abdome Agudo Inflamatório - Apendicite', slug: 'cir-apendicite' },
        { name: 'Trauma - Suporte Avançado de Vida (ATLS)', slug: 'cir-trauma-atls' },
        { name: 'Hérnias da Parede Abdominal', slug: 'cir-hernias' },
        { name: 'Hemorragia Digestiva Alta', slug: 'cir-hda' },
      ],
    },
    {
      name: 'Pediatria',
      slug: 'pediatria',
      description: 'Puericultura, Neonatologia, Doenças Exantemáticas e Respiratórias',
      children: [
        { name: 'Bronquiolite Viral Aguda', slug: 'ped-bva' },
        { name: 'Reanimação Neonatal em Sala de Parto', slug: 'ped-neonatologia' },
        { name: 'Doenças Exantemáticas na Infância', slug: 'ped-exantematicas' },
        { name: 'Crescimento e Desenvolvimento Infantil', slug: 'ped-puericultura' },
      ],
    },
    {
      name: 'Ginecologia e Obstetrícia',
      slug: 'ginecologia-obstetricia',
      description: 'Pré-natal, Síndromes Hipertensivas, Hemorragias e Rastreio Ginecológico',
      children: [
        { name: 'Síndromes Hipertensivas da Gestação - Pré-eclâmpsia', slug: 'go-pre-eclampsia' },
        { name: 'Assistência ao Parto e Mecanismo de Parto', slug: 'go-parto' },
        { name: 'Sangramento Uterino Anormal (SUA)', slug: 'go-sua' },
        { name: 'Rastreio do Câncer de Colo Uterino', slug: 'go-colo-uterino' },
      ],
    },
    {
      name: 'Saúde Coletiva',
      slug: 'saude-coletiva',
      description: 'Epidemiologia, Bioestatística, Atenção Primária e Princípios do SUS',
      children: [
        { name: 'Princípios e Diretrizes do SUS', slug: 'sc-principios-sus' },
        { name: 'Estudos Epidemiológicos e Medidas de Associação', slug: 'sc-epidemiologia' },
        { name: 'Estratégia Saúde da Família e Método Clínico Centrado na Pessoa', slug: 'sc-esf-mccp' },
        { name: 'Vigilância em Saúde e Notificação Compulsória', slug: 'sc-vigilancia' },
      ],
    },
  ];

  const topicMap: Record<string, string> = {};

  for (const area of areasData) {
    const parentTopic = await prisma.topic.create({
      data: {
        name: area.name,
        slug: area.slug,
        description: area.description,
      },
    });
    topicMap[area.slug] = parentTopic.id;

    for (const child of area.children) {
      const childTopic = await prisma.topic.create({
        data: {
          name: child.name,
          slug: child.slug,
          parentId: parentTopic.id,
        },
      });
      topicMap[child.slug] = childTopic.id;
    }
  }

  console.log('✅ Created hierarchical topics and core medical areas');

  // 4. Create 40 Original Questions (8 per area)
  const questionsData = [
    // --- CLÍNICA MÉDICA (1-8) ---
    {
      code: 'MED-CLM-001',
      area: 'Clínica Médica',
      topicSlug: 'cardio-sca',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Um homem de 58 anos, hipertenso e tabagista, chega à Unidade de Pronto Atendimento com dor retroesternal em aperto iniciada há 2 horas, irradiada para o membro superior esquerdo e mandíbula, acompanhada de sudorese fria. O eletrocardiograma de 12 derivações revela supradesnivelamento do segmento ST de 2,5 mm em DII, DIII e aVF. A pressão arterial é de 135/85 mmHg e a frequência cardíaca é de 76 bpm. O serviço não dispõe de laboratório de hemodinâmica, e o tempo estimado de transferência para hospital terciário com angioplastia primária é de 180 minutos. Qual é a conduta farmacológica prioritária imediata recomendada?',
      alternatives: [
        {
          letter: 'A',
          text: 'Administrar terapia trombolítica com fibrinolítico intravenoso (ex.: tenecteplase ou alteplase) associada a dupla antiagregação plaquetária.',
          isCorrect: true,
          explanation: 'No IAM com supra de ST, quando o tempo previsto entre o primeiro contato médico e a abertura do vaso por angioplastia primária for superior a 120 minutos, a reperfusão farmacológica imediata com fibrinolítico é formalmente indicada dentro dos primeiros 30 minutos (tempo porta-agulha).',
        },
        {
          letter: 'B',
          text: 'Aguardar o resultado da primeira dosagem sérica de troponina ultrassensível antes de qualquer intervenção de reperfusão.',
          isCorrect: false,
          explanation: 'No IAM com supra de ST, o diagnóstico e a decisão de reperfusão são eletrocardiográficos e clínicos; nunca se deve atrasar a reperfusão para aguardar marcadores de necrose miocárdica.',
        },
        {
          letter: 'C',
          text: 'Iniciar heparinização plena isolada e prescrever betabloqueador intravenoso em altas doses.',
          isCorrect: false,
          explanation: 'A anticoagulação isolada não promove reperfusão coronariana em IAM com supra; ademais, betabloqueadores venosos imediatos não substituem a reperfusão e podem precipitar choque cardiogênico.',
        },
        {
          letter: 'D',
          text: 'Indicar transferência imediata para angioplastia primária, independentemente do tempo de deslocamento previsto.',
          isCorrect: false,
          explanation: 'Se a transferência até a dilatação do balão ultrapassar 120 minutos, a indicação padrão classe I é trombólise imediata no local, seguida de encaminhamento para estratégia fármaco-invasiva.',
        },
      ],
    },
    {
      code: 'MED-CLM-002',
      area: 'Clínica Médica',
      topicSlug: 'pneumo-dpoc',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Um homem de 67 anos com diagnóstico prévio de DPOC grave apresenta-se na emergência com piora progressiva da dispneia há 3 dias, aumento do volume do escarro e escarro francamente purulento. À oximetria de pulso em ar ambiente, apresenta SpO2 de 85%. Gasometria arterial revela pH 7,32, PaCO2 56 mmHg, PaO2 54 mmHg e HCO3 28 mEq/L. Segundo as diretrizes GOLD, quais são as medidas terapêuticas fundamentais a serem instituídas de imediato?',
      alternatives: [
        {
          letter: 'A',
          text: 'Oxigenoterapia controlada com alvo de SpO2 88-92%, broncodilatadores inalatórios de curta ação, corticoide sistêmico oral ou venoso e antibioticoterapia.',
          isCorrect: true,
          explanation: 'A exacerbação de DPOC com os três critérios de Anthonisen (piora da dispneia, aumento do volume e purulência do escarro) exige antibioticoterapia empírica, broncodilatadores de resgate, corticoide sistêmico por 5 dias e oxigênio com alvo de 88-92% para evitar hipercapnia induzida.',
        },
        {
          letter: 'B',
          text: 'Oxigenoterapia em máscara com reservatório a 15 L/min com alvo de saturação de 99-100% e alta imediata com teofilina oral.',
          isCorrect: false,
          explanation: 'Hiperóxia em pacientes retentores de CO2 suprime o drive respiratório hipóxico e agrava a acidose respiratória aguda.',
        },
        {
          letter: 'C',
          text: 'Sedação venosa profunda com intubação orotraqueal imediata antes de qualquer tentativa de broncodilatação.',
          isCorrect: false,
          explanation: 'A ventilação mecânica não invasiva (VNI) ou suporte com broncodilatadores deve ser tentada inicialmente caso o paciente não apresente rebaixamento grave do sensório ou instabilidade hemodinâmica.',
        },
        {
          letter: 'D',
          text: 'Prescrição isolada de anti-histamínicos orais e fisioterapia respiratória vigorosa sem corticoterapia.',
          isCorrect: false,
          explanation: 'Corticoides sistêmicos reduzem tempo de internação e falha terapêutica; anti-histamínicos não têm papel na exacerbação de DPOC.',
        },
      ],
    },
    {
      code: 'MED-CLM-003',
      area: 'Clínica Médica',
      topicSlug: 'infecto-dengue',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Uma mulher de 32 anos procura o pronto-atendimento com febre alta há 4 dias, cefaleia retro-orbitária, mialgia e náuseas. No 5º dia, com o desaparecimento da febre, evolui com dor abdominal intensa e contínua, vômitos persistentes e tontura ao se levantar. O exame físico revela PA sentada de 110/70 mmHg e em pé de 90/60 mmHg, pulso de 102 bpm, dor à palpação do hipocôndrio direito com hepatometria a 3 cm do RCD. De acordo com a classificação de risco do Ministério da Saúde para dengue, em qual grupo ela se enquadra e qual a conduta indicada?',
      alternatives: [
        {
          letter: 'A',
          text: 'Grupo C (presença de sinais de alarme); conduta: hidratação venosa imediata com 10 mL/kg na primeira hora e internação em leito de observação.',
          isCorrect: true,
          explanation: 'A presença de dor abdominal intensa/contínua, vômitos frequentes e hipotensão postural caracterizam sinais de alarme no período de defervescência da dengue (Grupo C), exigindo hidratação venosa rápida supervisionada e hemograma urgente.',
        },
        {
          letter: 'B',
          text: 'Grupo A (caso clássico sem comorbidades); conduta: hidratação oral ambulatorial e retorno se piorar.',
          isCorrect: false,
          explanation: 'Sinais de alarme afastam o Grupo A e contraindicam liberação ambulatorial sem observação.',
        },
        {
          letter: 'C',
          text: 'Grupo B; conduta: hidratação oral e aguardar o resultado de sorologia para internar.',
          isCorrect: false,
          explanation: 'Grupo B abrange pacientes com sangramento espontâneo de pele ou fatores de risco clínicos, mas sem sinais de alarme.',
        },
        {
          letter: 'D',
          text: 'Grupo D; conduta: intubação traqueal e infusão imediata de noradrenalina em bomba.',
          isCorrect: false,
          explanation: 'Grupo D requer choque estabelecido, pulso filiforme ou sangramento grave. Neste caso há sinais de alarme com desidratação (Grupo C).',
        },
      ],
    },
    {
      code: 'MED-CLM-004',
      area: 'Clínica Médica',
      topicSlug: 'nefro-ira',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Um homem de 72 anos, em tratamento para pneumonia comunitária com ceftriaxona e claritromicina, evolui no 4º dia com oligúria (diurese de 200 mL em 24h). A creatinina sérica subiu de 1,0 mg/dL na admissão para 3,8 mg/dL e a ureia de 38 mg/dL para 142 mg/dL. O sedimento urinário mostra sódio urinário de 55 mEq/L, fração de excreção de sódio (FeNa) de 2,8% e presença de cilindros granulosos pigmentares escuros (marrons). Qual é o diagnóstico mais provável da injúria renal aguda?',
      alternatives: [
        {
          letter: 'A',
          text: 'Necrose Tubular Aguda (NTA) de etiologia intrínseca/isquêmico-tóxica.',
          isCorrect: true,
          explanation: 'FeNa > 1%, sódio urinário elevado (> 40 mEq/L) e presença de cilindros marrom-escuros (cilindros granulosos epiteliais) são patognomônicos de lesão tubular intrínseca (Necrose Tubular Aguda).',
        },
        {
          letter: 'B',
          text: 'Injúria renal aguda pré-renal por hipovolemia pura.',
          isCorrect: false,
          explanation: 'Na azotemia pré-renal pura a FeNa é < 1%, o sódio urinário é baixo (< 20 mEq/L) e o sedimento mostra cilindros hialinos limpos.',
        },
        {
          letter: 'C',
          text: 'Glomerulonefrite proliferativa difusa aguda pós-infecciosa.',
          isCorrect: false,
          explanation: 'Apresentaria hematúria dismórfica, cilindros hemáticos e proteinúria de faixa nefrítica.',
        },
        {
          letter: 'D',
          text: 'Uropatia obstrutiva bilateral aguda pós-renal.',
          isCorrect: false,
          explanation: 'Obstrução pós-renal gera anúria súbita ou padrão flutuante e ausência típica de cilindros granulosos escuros.',
        },
      ],
    },
    {
      code: 'MED-CLM-005',
      area: 'Clínica Médica',
      topicSlug: 'cardio-sca',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Paciente feminina de 62 anos, com diabetes mellitus tipo 2 e dislipidemia, é diagnosticada com insuficiência cardíaca com fração de ejeção reduzida (ICFEr = 32%), classe funcional NYHA II. Qual é a quadrupla terapia farmacológica fundamental modificadora de prognóstico que reduz mortalidade cardiovascular nesse cenário?',
      alternatives: [
        {
          letter: 'A',
          text: 'Inibidor do receptor de angiotensina-neprilisina (ARNI) ou IECA/BRA, Betabloqueador cardioseletivo, Antagonista de receptor mineralocorticoide (Espironolactona) e Inibidor de SGLT2 (Dapagliflozina ou Empagliflozina).',
          isCorrect: true,
          explanation: 'A terapia quádrupla neuro-hormonal (ARNI/IECA, Betabloqueador, Espironolactona e iSGLT2) é a base comprovada de redução de mortalidade total e hospitalizações em ICFEr.',
        },
        {
          letter: 'B',
          text: 'Furosemida em altas doses, Digoxina, Bloqueador de canal de cálcio di-hidropiridínico e Aspirina.',
          isCorrect: false,
          explanation: 'Furosemida apenas alivia sintomas congestivos sem mudar mortalidade; digoxina e bloqueadores de cálcio não constituem primeira linha prognóstica.',
        },
        {
          letter: 'C',
          text: 'Diltiazem, Hidralazina isolada, Sinvastatina e Varfarina plena.',
          isCorrect: false,
          explanation: 'Bloqueadores de cálcio não di-hidropiridínicos (diltiazem, verapamil) são contraindicados na ICFEr por inotropismo negativo.',
        },
        {
          letter: 'D',
          text: 'Amiodarona contínua, Mononitrato de isossorbida isolado e Diurético tiazídico em monoterapia.',
          isCorrect: false,
          explanation: 'Antiarrítmicos profiláticos de rotina não aumentam sobrevida em ICFEr assintomática de arritmias ventriculares.',
        },
      ],
    },
    {
      code: 'MED-CLM-006',
      area: 'Clínica Médica',
      topicSlug: 'pneumo-dpoc',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Uma paciente de 24 anos com asma brônquica procura consulta ambulatorial. Relata sintomas diurnos 4 dias por semana, despertares noturnos por tosse e sibilância duas vezes por mês, com uso frequente de salbutamol de alívio. Conforme a iniciativa GINA, qual é o grau de controle da asma e a terapêutica de manutenção recomendada?',
      alternatives: [
        {
          letter: 'A',
          text: 'Asma parcialmente controlada; indicação de corticoide inalatório associado a formoterol em dose baixa como manutenção e alívio.',
          isCorrect: true,
          explanation: 'A presença de 1 ou 2 critérios GINA positivos (sintomas diurnos > 2x/sem e despertares) classifica como parcialmente controlada. A via preferencial da GINA preconiza corticoide inalatório + formoterol.',
        },
        {
          letter: 'B',
          text: 'Asma totalmente controlada; manutenção apenas de beta-2 agonista de curta ação sob demanda exclusiva.',
          isCorrect: false,
          explanation: 'O uso de SABA isolado sem corticoide inalatório foi formalmente abandonado pela GINA pelo risco de exacerbações fatais.',
        },
        {
          letter: 'C',
          text: 'Asma grave não controlada; indicação imediata de corticoterapia oral contínua e omalizumabe.',
          isCorrect: false,
          explanation: 'Imunobiológicos e corticoide oral são reservados para asma grave estágio 5 refratária.',
        },
        {
          letter: 'D',
          text: 'Asma intermitente controlada; nenhuma medicação necessária.',
          isCorrect: false,
          explanation: 'A paciente apresenta sintomas regulares e despertares noturnos, caracterizando doença persistente parcialmente controlada.',
        },
      ],
    },
    {
      code: 'MED-CLM-007',
      area: 'Clínica Médica',
      topicSlug: 'infecto-dengue',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Homem de 45 anos, procedente de área urbana, apresenta febre, mialgia intensa, dor nas panturrilhas e sufusão conjuntival há 6 dias. Evolui no 7º dia com icterícia rubínica, oligúria e hemoptise discreta. Exames laboratoriais: bilirrubina total 14 mg/dL (fração direta 11,5 mg/dL), CPK 1.200 U/L, plaquetas 60.000/mm³, ureia 180 mg/dL e creatinina 4,2 mg/dL com potássio de 3,1 mEq/L (hipocalemia). Qual é a principal hipótese diagnóstica?',
      alternatives: [
        {
          letter: 'A',
          text: 'Leptospirose grave (Síndrome de Weil).',
          isCorrect: true,
          explanation: 'A tríade clássica de icterícia flavínica/rubínica, sufusão conjuntival, dor em panturrilhas, plaquetopenia e lesão renal aguda com hipocalemia (pela inibição do cotransportador Na-K-2Cl) é característica da Síndrome de Weil.',
        },
        {
          letter: 'B',
          text: 'Hepatite viral fulminante por vírus B.',
          isCorrect: false,
          explanation: 'Hepatite fulminante cursa com necrose hepatocelular maciça, transaminases na casa dos milhares e coagulopatia grave precoce com encefalopatia.',
        },
        {
          letter: 'C',
          text: 'Malária por Plasmodium vivax não complicada.',
          isCorrect: false,
          explanation: 'Malária não complicada não apresenta sufusão conjuntival clássica com injúria renal aguda hipocalêmica proeminente.',
        },
        {
          letter: 'D',
          text: 'Febre Tifoide com perfuração intestinal.',
          isCorrect: false,
          explanation: 'A febre tifoide apresenta sinal de Faget (dissociação pulso-temperatura), dor abdominal e esplenomegalia, sem padrão de insuficiência renal hipocalêmica com CPK elevada.',
        },
      ],
    },
    {
      code: 'MED-CLM-008',
      area: 'Clínica Médica',
      topicSlug: 'nefro-ira',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Mulher de 35 anos, com lúpus eritematoso sistêmico, comparece com edema de membros inferiores e anasarca. Urina I demonstra proteinúria maciça (4+), cilindros gordurosos (corpos ovais graxos) e ausência de hemácias. A proteinúria de 24 horas é de 6,2 g e a albumina sérica é de 1,9 g/dL. O colesterol total é de 380 mg/dL. Qual é a complicação trombótica mais temida associada a essa síndrome, especialmente em nefropatia membranosa?',
      alternatives: [
        {
          letter: 'A',
          text: 'Trombose de veia renal.',
          isCorrect: true,
          explanation: 'A síndrome nefrótica gera estado de hipercoagulabilidade por perda urinária de antitrombina III, proteína C e S. A complicação trombótica venosa clássica mais frequente em nefropatia membranosa é a trombose da veia renal.',
        },
        {
          letter: 'B',
          text: 'Acidente vascular encefálico hemorrágico primário.',
          isCorrect: false,
          explanation: 'O estado nefrótico predispõe a eventos isquêmicos e trombóticos, não a sangramentos primários intracranianos.',
        },
        {
          letter: 'C',
          text: 'Trombose aguda de artéria mesentérica superior.',
          isCorrect: false,
          explanation: 'Embora tromboses arteriais possam ocorrer raramente, a trombose de veia renal é a manifestação clássica descrita em provas de medicina.',
        },
        {
          letter: 'D',
          text: 'Aneurisma dissecante de aorta torácica.',
          isCorrect: false,
          explanation: 'Dissecção aórtica associa-se a hipertensão crônica grave ou doenças do colágeno/Marfan, não sendo complicação primária da síndrome nefrótica.',
        },
      ],
    },

    // --- CIRURGIA (9-16) ---
    {
      code: 'MED-CIR-001',
      area: 'Cirurgia',
      topicSlug: 'cir-apendicite',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Um jovem de 21 anos é admitido com dor periumbilical de início há 18 horas, que migrou para a fossa ilíaca direita nas últimas 6 horas. Apresenta febre de 38,1 °C, náuseas e inapetência total. Ao exame físico: descompressão dolorosa positiva no ponto de McBurney e dor na fossa ilíaca direita à palpação do quadrante inferior esquerdo. Quais são, respectivamente, os nomes semiológicos desses dois sinais clínicos?',
      alternatives: [
        {
          letter: 'A',
          text: 'Sinal de Blumberg e Sinal de Rovsing.',
          isCorrect: true,
          explanation: 'A dor à descompressão brusca no ponto de McBurney é o Sinal de Blumberg. A dor na fossa ilíaca direita provocada pela palpação retrógrada e compressão da fossa ilíaca esquerda é o Sinal de Rovsing.',
        },
        {
          letter: 'B',
          text: 'Sinal de Murphy e Sinal de Cullen.',
          isCorrect: false,
          explanation: 'Sinal de Murphy é parada inspiratória na palpação do ponto cístico (colecistite); Cullen é equimose periumbilical.',
        },
        {
          letter: 'C',
          text: 'Sinal do Obturador e Sinal de Dunphy.',
          isCorrect: false,
          explanation: 'Sinal do Obturador é dor à rotação interna da coxa flexionada; Dunphy é piora da dor na FID com a tosse.',
        },
        {
          letter: 'D',
          text: 'Sinal de Kehr e Sinal de Jobert.',
          isCorrect: false,
          explanation: 'Sinal de Kehr é dor no ombro por irritação frênica (esplenomegalia/rotura); Jobert é perda da macicez hepática por pneumoperitônio.',
        },
      ],
    },
    {
      code: 'MED-CIR-002',
      area: 'Cirurgia',
      topicSlug: 'cir-trauma-atls',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Vítima de colisão moto x anteparo fixo chega ao pronto-socorro em prancha rígida e colar cervical. Está taquipneico (FR: 34 irpm), com sudorese fria, murmúrio vesicular abolido em hemitórax direito, hipertimpanismo à percussão ipsilateral e turgência jugular patológica bilateral. A pressão arterial é de 70/40 mmHg. De acordo com o protocolo ATLS 10ª edição, qual é a conduta terapêutica IMEDIATA obrigatória?',
      alternatives: [
        {
          letter: 'A',
          text: 'Descompressão torácica imediata com agulha (toracocentese) no 5º espaço intercostal entre a linha axilar anterior e média, seguida de drenagem em selo d’água.',
          isCorrect: true,
          explanation: 'O quadro descreve pneumotórax hipertensivo em choque obstrutivo. No ATLS 10ª edição, a descompressão imediata no adulto é realizada no 5º espaço intercostal ligeiramente anterior à linha médio-axilar.',
        },
        {
          letter: 'B',
          text: 'Solicitar tomografia de tórax helicoidal com contraste para confirmar a presença de ar intrapleural.',
          isCorrect: false,
          explanation: 'O pneumotórax hipertensivo é um diagnóstico estritamente clínico e qualquer atraso para exames de imagem pode levar à PCR iminente.',
        },
        {
          letter: 'C',
          text: 'Proceder à intubação orotraqueal imediata com ventilação por pressão positiva vigorosa antes de drenar o hemitórax.',
          isCorrect: false,
          explanation: 'A ventilação com pressão positiva sem descompressão agrava o pneumotórax hipertensivo e colapsa totalmente o retorno venoso.',
        },
        {
          letter: 'D',
          text: 'Infusão rápida de 2.000 mL de solução fisiológica e pericardiocentese subxifoidiana.',
          isCorrect: false,
          explanation: 'O hipertimpanismo e abolição do murmúrio apontam para pneumotórax hipertensivo e não tamponamento cardíaco (que apresenta bulhas hipofonéticas e som claro pulmonar).',
        },
      ],
    },
    {
      code: 'MED-CIR-003',
      area: 'Cirurgia',
      topicSlug: 'cir-hernias',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Um homem de 52 anos apresenta abaulamento na região inguinal direita aos esforços. Ao exame físico na posição ortostática, o examinador introduz a polpa digital pelo canal inguinal externo e, durante a manobra de Valsalva, percebe o impacto da massa contra a ponta do dedo indicador. Pela classificação de Nyhus, qual é a anatomopatologia clássica desse defeito?',
      alternatives: [
        {
          letter: 'A',
          text: 'Hérnia inguinal indireta (passa através do anel inguinal profundo lateralmente aos vasos epigástricos inferiores).',
          isCorrect: true,
          explanation: 'O impacto na ponta do dedo pelo trajeto do canal inguinal define a hérnia indireta (congênita/persistência do conduto peritônio-vaginal), situando-se lateral aos vasos epigástricos.',
        },
        {
          letter: 'B',
          text: 'Hérnia inguinal direta originada por fraqueza da fáscia transversal no triângulo de Hesselbach.',
          isCorrect: false,
          explanation: 'A hérnia direta toca a polpa/face lateral do dedo indicador que examina o canal e situa-se medialmente aos vasos epigástricos.',
        },
        {
          letter: 'C',
          text: 'Hérnia femoral protruindo pelo canal femoral abaixo do ligamento inguinal.',
          isCorrect: false,
          explanation: 'Hérnias femorais localizam-se abaixo da linha do ligamento inguinal no trígono de Scarpa.',
        },
        {
          letter: 'D',
          text: 'Hérnia obturatória com compressão do nervo obturador no membro inferior.',
          isCorrect: false,
          explanation: 'Hérnia obturatória é rara, profunda na pelve e manifesta-se tipicamente pelo sinal de Howship-Romberg.',
        },
      ],
    },
    {
      code: 'MED-CIR-004',
      area: 'Cirurgia',
      topicSlug: 'cir-hda',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Paciente cirrótico com histórico de hipertensão portal é admitido com hematêmese volumosa e melena. À admissão: FC 122 bpm, PA 85/50 mmHg. Após estabilização volêmica inicial e início de ceftriaxona venosa profilática e terlipressina, realiza endoscopia digestiva alta (EDA) de urgência. O laudo revela varizes esofágicas de médio calibre com sangramento ativo em jato. Qual é o tratamento endoscópico de primeira escolha e a classificação de Forrest aplicável a lesões pépticas ativas em jato?',
      alternatives: [
        {
          letter: 'A',
          text: 'Ligadura elástica de varizes esofágicas; no caso de úlcera com jato seria Forrest Ia.',
          isCorrect: true,
          explanation: 'Para sangramento varicoso esofágico, a ligadura elástica é o padrão-ouro superior à escleroterapia. Em úlceras pépticas, o sangramento ativo arterial em jato corresponde a Forrest Ia.',
        },
        {
          letter: 'B',
          text: 'Injeção de cola de cianoacrilato em esôfago; Forrest IIb.',
          isCorrect: false,
          explanation: 'Cianoacrilato é reservado primariamente para varizes de fundo gástrico. Forrest IIb é coágulo aderido.',
        },
        {
          letter: 'C',
          text: 'Colocação imediata de balão de Sengstaken-Blakemore como terapia definitiva de primeira linha.',
          isCorrect: false,
          explanation: 'O balão é medida transitória de salvamento temporário (ponte para EDA ou TIPS) em sangramentos refratários catastróficos, não terapia definitiva de 1ª linha.',
        },
        {
          letter: 'D',
          text: 'Passagem rotineira de sonda nasogástrica com lavagem de água gelada e observação clínica.',
          isCorrect: false,
          explanation: 'Lavagem com água gelada não tem papel comprovado e retarda o tratamento hemostático endoscópico obrigatório.',
        },
      ],
    },
    {
      code: 'MED-CIR-005',
      area: 'Cirurgia',
      topicSlug: 'cir-apendicite',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Mulher de 44 anos, multípara, com sobrepeso, dá entrada com dor intensa tipo cólica em hipocôndrio direito irradiada para a região interescapular há 12 horas, associada a vômitos e febre de 38,4 °C. Ao exame: Sinal de Murphy positivo. A ultrassonografia de abdome demonstra espessamento da parede da vesícula biliar de 5 mm, líquido perivesicular e cálculo impactado no infundíbulo. Qual é o diagnóstico e a conduta recomendada?',
      alternatives: [
        {
          letter: 'A',
          text: 'Colecistite aguda litiásica; conduta: antibioticoterapia parenteral e colecistectomia videolaparoscópica precoce (idealmente nas primeiras 72 horas).',
          isCorrect: true,
          explanation: 'O quadro de dor contínua > 6h, febre, Murphy positivo e USG com parede > 4 mm e líquido perivesicular firma o diagnóstico de colecistite aguda. A cirurgia precoce por videolaparoscopia reduz tempo de internação e complicações.',
        },
        {
          letter: 'B',
          text: 'Cólica biliar simples; analgesia ambulatorial e encaminhamento para cirurgia eletiva em 6 meses.',
          isCorrect: false,
          explanation: 'Cólica biliar cede em menos de 6 horas e não cursa com febre, espessamento de parede vesicular nem sinal de Murphy.',
        },
        {
          letter: 'C',
          text: 'Coledocolitíase isolada; indicação mandatória de CPRE antes de qualquer avaliação cirúrgica.',
          isCorrect: false,
          explanation: 'A paciente não apresenta icterícia, colúria ou dilatação de via biliar comum, afastando coledocolitíase primária.',
        },
        {
          letter: 'D',
          text: 'Colangite esclerosante primária; tratamento clínico exclusivo com ácido ursodesoxicólico.',
          isCorrect: false,
          explanation: 'Doença autoimune colestática crônica das vias biliares intra e extra-hepáticas, sem relação com apresentação inflamatória litiásica aguda.',
        },
      ],
    },
    {
      code: 'MED-CIR-006',
      area: 'Cirurgia',
      topicSlug: 'cir-trauma-atls',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Um motorista de 30 anos sofre colisão frontal em alta velocidade sem cinto de segurança. É admitido com PA de 80/50 mmHg, pulso paradoxal, estase jugular evidente e bulhas cardíacas abafadas. O hemitórax expande simetricamente e a ausculta pulmonar revela murmúrio vesicular universalmente preservado e simétrico. A tomografia e o ultrassom FAST identificam líquido na janela pericárdica. Essa apresentação clínica corresponde a qual afecção e tríade semiológica?',
      alternatives: [
        {
          letter: 'A',
          text: 'Tamponamento cardíaco; Tríade de Beck (hipotensão, bulhas abafadas e turgência jugular).',
          isCorrect: true,
          explanation: 'A Tríade de Beck (hipotensão arterial, abafamento de bulhas cardíacas e estase de veias jugulares) aliada à presença de derrame pericárdico traumático sela o diagnóstico de tamponamento cardíaco.',
        },
        {
          letter: 'B',
          text: 'Pneumotórax aberto; Tríade de Cushing.',
          isCorrect: false,
          explanation: 'Tríade de Cushing é hipertensão, bradicardia e alteração respiratória na hipertensão intracraniana grave.',
        },
        {
          letter: 'C',
          text: 'Rotura traumática de diafragma; Tríade de Charcot.',
          isCorrect: false,
          explanation: 'Tríade de Charcot é febre com calafrios, icterícia e dor abdominal em colangite aguda.',
        },
        {
          letter: 'D',
          text: 'Contusão pulmonar grave; Tríade de Virchow.',
          isCorrect: false,
          explanation: 'Tríade de Virchow envolve estase, lesão endotelial e hipercoagulabilidade para trombogênese.',
        },
      ],
    },
    {
      code: 'MED-CIR-007',
      area: 'Cirurgia',
      topicSlug: 'cir-hernias',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Idoso de 78 anos chega à urgência com dor abdominal difusa em cólica, náuseas, vômitos biliosos e parada de eliminação de gases e fezes há 2 dias. Apresenta distensão abdominal simétrica, ruídos hidroaéreos com timbre metálico e cicatriz cirúrgica mediana prévia de apendicectomia há 30 anos. A radiografia de abdome em ortostase revela alças de delgado dilatadas centralmente com nível hidroaéreo em degrau e ausência de gás na ampola retal. Qual é a etiologia mais comum dessa obstrução mecânica?',
      alternatives: [
        {
          letter: 'A',
          text: 'Bridas / Aderências peritoneais pós-operatórias.',
          isCorrect: true,
          explanation: 'As bridas ou aderências pós-operatórias respondem por mais de 60-70% das causas de obstrução mecânica do intestino delgado no adulto com cirurgia prévia.',
        },
        {
          letter: 'B',
          text: 'Adenocarcinoma primário de jejuno.',
          isCorrect: false,
          explanation: 'Neoplasias malignas do intestino delgado são raras e muito menos frequentes que bridas como causa de oclusão aguda.',
        },
        {
          letter: 'C',
          text: 'Íleo biliar por fístula colecistoduodenal com cálculo em válvula ileocecal.',
          isCorrect: false,
          explanation: 'Íleo biliar apresentaria a tríade de Rigler (pneumobilia, cálculo ectópico radiopaco e distensão de delgado).',
        },
        {
          letter: 'D',
          text: 'Volvo de sigmoide com imagem de grão de café.',
          isCorrect: false,
          explanation: 'Volvo de sigmoide causa obstrução de intestino grosso, com imagem em U invertido / bico de pássaro.',
        },
      ],
    },
    {
      code: 'MED-CIR-008',
      area: 'Cirurgia',
      topicSlug: 'cir-hda',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Durante avaliação de abdome agudo vascular em paciente de 75 anos com fibrilação atrial em uso irregular de anticoagulante oral, o médico constata dor abdominal súbita desproporcional ao exame físico (abdome flácido sem irritação peritoneal evidente). A gasometria revela acidose metabólica grave com hiperlactatemia importante. Qual é a principal suspeita clínica e o exame padrão-ouro para o diagnóstico confirmatório?',
      alternatives: [
        {
          letter: 'A',
          text: 'Isquemia mesentérica aguda por embolia da artéria mesentérica superior; Angiotomografia computadorizada de abdome.',
          isCorrect: true,
          explanation: 'A dor intensa desproporcional ao exame físico em cardiopata com FA, acompanhada de acidose lática, é a apresentação clássica de embolia da artéria mesentérica superior. O exame de escolha é a angiotomografia com contraste venoso.',
        },
        {
          letter: 'B',
          text: 'Pancreatite aguda biliar necro-hemorrágica; Ultrassonografia de abdome total.',
          isCorrect: false,
          explanation: 'Pancreatite tem dor em barra típica com hiperamilasemia e lipase elevada, sem relação típica com cardioembolismo por FA.',
        },
        {
          letter: 'C',
          text: 'Perfuração de úlcera duodenal; Radiografia simples de tórax em cúpulas.',
          isCorrect: false,
          explanation: 'Úlcera perfurada cursa com abdome em tábua (defesa involuntária precoce) e pneumoperitônio no raio-X.',
        },
        {
          letter: 'D',
          text: 'Colite isquêmica não gangrenosa transitória; Colonoscopia diagnóstica imediata.',
          isCorrect: false,
          explanation: 'Colite isquêmica compromete áreas de baixo fluxo em idosos (flexura esplênica) com diarreia sanguinolenta e dor branda, sem acidose fulminante.',
        },
      ],
    },

    // --- PEDIATRIA (17-24) ---
    {
      code: 'MED-PED-001',
      area: 'Pediatria',
      topicSlug: 'ped-bva',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Um lactente de 4 meses de vida é levado à UBS com história de coriza hialina e tosse há 3 dias, evoluindo nas últimas 24 horas com cansaço para mamar e taquipneia. Ao exame: FR de 62 irpm, tiragem subcostal moderada, batimento de asa de nariz e tempo expiratório prolongado com sibilos e estertores crepitantes bilaterais. Não há histórico familiar de atopia. O teste rápido para Vírus Sincicial Respiratório (VSR) é positivo. Qual é a conduta preconizada segundo as diretrizes pediátricas vigentes?',
      alternatives: [
        {
          letter: 'A',
          text: 'Suporte clínico com lavagem nasal com soro fisiológico, oxigenoterapia se SpO2 < 90-92% e hidratação/fracionamento alimentar, sem indicação de broncodilatador rotineiro ou corticoide.',
          isCorrect: true,
          explanation: 'Na bronquiolite viral aguda (BVA), as diretrizes da SBP e AAP contraindicam o uso rotineiro de corticoides sistêmicos, broncodilatadores beta-2 ou antibióticos, focando o tratamento em suporte ventilatório e hidratação.',
        },
        {
          letter: 'B',
          text: 'Prescrição imediata de prednisolona oral por 7 dias associada a nebulizações contínuas de fenoterol a cada 20 minutos.',
          isCorrect: false,
          explanation: 'Corticoides sistêmicos não alteram a história natural nem reduzem internações na BVA em primeiro episódio.',
        },
        {
          letter: 'C',
          text: 'Iniciar amoxicilina com clavulanato profilática para prevenir pneumonia bacteriana secundária.',
          isCorrect: false,
          explanation: 'Antibioticoterapia não é indicada na ausência de evidência clara de infecção bacteriana bacteriana concomitante comprovada.',
        },
        {
          letter: 'D',
          text: 'Fisioterapia respiratória motora vigorosa com drenagem postural e aspiração profunda.',
          isCorrect: false,
          explanation: 'A fisioterapia respiratória de rotina pode aumentar o estresse e a obstrução de via aérea em lactentes pequenos com BVA.',
        },
      ],
    },
    {
      code: 'MED-PED-002',
      area: 'Pediatria',
      topicSlug: 'ped-neonatologia',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Recém-nascido a termo (39 semanas de idade gestacional), nascido de parto vaginal sem intercorrências, com líquido amniótico claro. Logo após o nascimento, chora vigorosamente, apresenta tônus muscular em flexão ativa e FC > 100 bpm. De acordo com as diretrizes do Programa de Reanimação Neonatal da Sociedade Brasileira de Pediatria (SBP), qual deve ser a conduta na sala de parto?',
      alternatives: [
        {
          letter: 'A',
          text: 'Clampeamento tardio do cordão umbilical (1 a 3 minutos), contato pele a pele imediato junto ao tórax materno e promoção precoce do aleitamento materno.',
          isCorrect: true,
          explanation: 'RN a termo que respira/chora e tem bom tônus é considerado com vitalidade ao nascer; deve ter cordão clampeado entre 1-3 minutos e ser colocado em contato pele a pele contínuo junto à mãe.',
        },
        {
          letter: 'B',
          text: 'Clampeamento imediato do cordão umbilical e aspiração sistemática da orofaringe e narinas sob fonte de calor radiante.',
          isCorrect: false,
          explanation: 'RN vigoroso não deve ter via aérea aspirada de rotina e o clampeamento imediato só é indicado em RN não vigoroso ou complicações materno-fetais.',
        },
        {
          letter: 'C',
          text: 'Ventilação com pressão positiva em ar ambiente por máscara facial durante 30 segundos.',
          isCorrect: false,
          explanation: 'VPP é o passo crucial da reanimação neonatal apenas para recém-nascidos em apneia, respiração irregular ou FC < 100 bpm.',
        },
        {
          letter: 'D',
          text: 'Administração profilática de oxigênio a 100% em fluxo livre e banho de imersão imediato.',
          isCorrect: false,
          explanation: 'Oxigênio a 100% é deletério por estresse oxidativo e o banho precoce causa hipotermia severa.',
        },
      ],
    },
    {
      code: 'MED-PED-003',
      area: 'Pediatria',
      topicSlug: 'ped-exantematicas',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Menina de 5 anos apresenta febre alta de início súbito, dor de garganta e vômitos. Vinte e quatro horas depois surge exantema micropapular áspero que confere aspecto de "lixa" à pele, com início no pescoço e tronco, acentuando-se nas dobras cutâneas com linhas avermelhadas que não desaparecem à digitopressão. Há palidez perioral evidente e língua recoberta por induto branco com papilas hipertrofiadas (língua em framboesa). Qual é o agente etiológico e a afecção descrita?',
      alternatives: [
        {
          letter: 'A',
          text: 'Escarlatina; provocada por cepas produtoras de toxina pirogênica de Streptococcus pyogenes (Streptococcus do grupo A).',
          isCorrect: true,
          explanation: 'O quadro descreve clássica escarlatina: exantema em lixa, sinal de Pastia (linhas em dobras), sinal de Filatov (palidez perioral) e língua em framboesa causados pelas exotoxinas eritrogênicas do Streptococcus pyogenes.',
        },
        {
          letter: 'B',
          text: 'Sarampo; infecção viral provocada por Morbillivirus com manchas de Koplik.',
          isCorrect: false,
          explanation: 'Sarampo tem pródromo com tosse, coriza e conjuntivite fotofóbica com manchas de Koplik na mucosa jugal e exantema morbiliforme com descamação furfurácea.',
        },
        {
          letter: 'C',
          text: 'Eritema Infeccioso; causado pelo Parvovírus B19 com aspecto de bochecha esbofeteada.',
          isCorrect: false,
          explanation: 'Eritema infeccioso não cursa com exantema em lixa nem faringite exsudativa estreptocócica; apresenta face esbofeteada e aspecto rendilhado.',
        },
        {
          letter: 'D',
          text: 'Rubéola; infecção por Togavírus com manchas de Forchheimer.',
          isCorrect: false,
          explanation: 'Rubéola tem linfonodomegalias suboccipitais e retroauriculares proeminentes com exantema róseo não conflituoso e curso benigno.',
        },
      ],
    },
    {
      code: 'MED-PED-004',
      area: 'Pediatria',
      topicSlug: 'ped-puericultura',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Durante a consulta de puericultura de uma criança de 6 meses de vida, a mãe questiona sobre a introdução alimentar e suplementação profilática de ferro e vitamina D. A criança nasceu a termo, com peso adequado para a idade gestacional e esteve em aleitamento materno exclusivo até a presente data. Qual é a recomendação correta da Sociedade Brasileira de Pediatria?',
      alternatives: [
        {
          letter: 'A',
          text: 'Iniciar alimentação complementar mantendo o aleitamento materno; manter vitamina D (400 UI/dia no 1º ano) e iniciar suplementação profilática de ferro elementar (1 mg/kg/dia) até os 24 meses.',
          isCorrect: true,
          explanation: 'Conforme o consenso da SBP, o ferro profilático para nascidos a termo em AME inicia-se aos 180 dias de vida (1 mg/kg/dia até os 2 anos) e a vitamina D é indicada desde a primeira semana de vida.',
        },
        {
          letter: 'B',
          text: 'Suspender totalmente o leite materno e introduzir leite de vaca integral associado a farináceos.',
          isCorrect: false,
          explanation: 'O leite de vaca integral é proscrito antes de 1 ano pelo risco de microssangramentos digestivos e sobrecarga renal de solutos.',
        },
        {
          letter: 'C',
          text: 'Não suplementar ferro nem vitamina D, pois o leite materno supre 100% de todas as necessidades metabólicas de micronutrientes até 2 anos.',
          isCorrect: false,
          explanation: 'Após os 6 meses, os estoques hepáticos fetais de ferro se esgotam e a concentração de ferro no leite materno é insuficiente isoladamente.',
        },
        {
          letter: 'D',
          text: 'Iniciar alimentos exclusivamente na forma de sucos cítricos adoçados e caldos coados.',
          isCorrect: false,
          explanation: 'Sucos não são recomendados no primeiro ano de vida; a introdução deve ser de comida amassada com consistência pastosa (papas salgadas e frutas in natura).',
        },
      ],
    },
    {
      code: 'MED-PED-005',
      area: 'Pediatria',
      topicSlug: 'ped-bva',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Menino de 2 anos é trazido ao pronto-socorro com tosse metálica ("tosse de cachorro" ou ladrante), rouquidão e estridor inspiratório audível apenas quando a criança fica agitada e chora. Não há estridor em repouso nem tiragens graves. A saturação de O2 é de 96% em ar ambiente. Qual é o diagnóstico e o tratamento farmacológico de escolha para este caso de laringotraqueobronquite aguda (crupe viral)?',
      alternatives: [
        {
          letter: 'A',
          text: 'Crupe viral leve a moderado; administração de dose única de Dexametasona oral (0,15 a 0,6 mg/kg).',
          isCorrect: true,
          explanation: 'Para todo paciente com crupe viral (mesmo leve a moderado), uma dose única de dexametasona oral reduz a intensidade dos sintomas, retorno à emergência e necessidade de nebulização com adrenalina.',
        },
        {
          letter: 'B',
          text: 'Epiglotite bacteriana aguda; antibioticoterapia imediata com vancomicina e intubação profilática.',
          isCorrect: false,
          explanation: 'Epiglotite tem início hiperagudo com febre alta, sialorreia intensa, disfagia e posição de tripé, sem a tosse ladrante típica do crupe.',
        },
        {
          letter: 'C',
          text: 'Aspiração de corpo estranho em traqueia; broncoscopia rígida de emergência sem medicação.',
          isCorrect: false,
          explanation: 'Corpo estranho surge subitamente com engasgo durante alimentação ou brincadeira, sem pródromo catarral infeccioso.',
        },
        {
          letter: 'D',
          text: 'Asma aguda grave; nebulização com brometo de ipratrópio e salbutamol de 20 em 20 minutos.',
          isCorrect: false,
          explanation: 'Asma é doença de vias aéreas inferiores com sibilos expiratórios, não causando estridor inspiratório nem rouquidão alta.',
        },
      ],
    },
    {
      code: 'MED-PED-006',
      area: 'Pediatria',
      topicSlug: 'ped-neonatologia',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Recém-nascido a termo de 38 semanas, com peso de 3.200 g, apresenta icterícia na zona III de Kramer com 18 horas de vida pós-natal. Mãe multípara tipagem sanguínea O Rh negativo com teste de Coombs indireto positivo na gestação. O RN tem tipagem sanguínea A Rh positivo. Exames do RN revelam bilirrubina total de 14 mg/dL (fração indireta 13,3 mg/dL), hemoglobina de 11 g/dL, reticulócitos de 9% e Teste de Coombs Direto francamente positivo. Qual é o mecanismo da icterícia e a conduta inicial prioritária?',
      alternatives: [
        {
          letter: 'A',
          text: 'Doença hemolítica perinatal por aloimunização Rh; fototerapia intensiva imediata e monitoramento rigoroso para eventual exsanguineotransfusão.',
          isCorrect: true,
          explanation: 'Icterícia nas primeiras 24 horas de vida é sempre patológica. Coombs direto positivo com anemia e reticulocitose em mãe Rh- e RN Rh+ confirma incompatibilidade Rh, exigindo fototerapia de alta irradiância imediata.',
        },
        {
          letter: 'B',
          text: 'Icterícia fisiológica do recém-nascido; orientação de banho de sol e alta hospitalar.',
          isCorrect: false,
          explanation: 'Icterícia fisiológica nunca surge com menos de 24 horas de vida e não apresenta hemólise imune com Coombs positivo.',
        },
        {
          letter: 'C',
          text: 'Icterícia do leite materno; suspensão do aleitamento materno por 48 horas.',
          isCorrect: false,
          explanation: 'Icterícia do leite materno é tardia (surge após o 7º dia de vida e persiste por semanas em crianças saudáveis).',
        },
        {
          letter: 'D',
          text: 'Atresia de vias biliares extra-hepáticas; indicação imediata de cirurgia de Kasai.',
          isCorrect: false,
          explanation: 'Atresia de vias biliares cursa com hiperbilirrubinemia direta (colestase), acolia fecal e colúria após a segunda semana de vida.',
        },
      ],
    },
    {
      code: 'MED-PED-007',
      area: 'Pediatria',
      topicSlug: 'ped-exantematicas',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Lactente de 11 meses apresenta quadro de febre alta (39,5 °C) de início súbito que dura exatamente 3 dias, sem foco infeccioso evidente ao exame clínico, apesar de bom estado geral quando afebril. No quarto dia, a febre cede abruptamente (em crise) e surge um exantema maculopapular róseo no tronco, que se dissemina centrifugamente para membros e pescoço. Qual é o diagnóstico e o agente etiológico provável?',
      alternatives: [
        {
          letter: 'A',
          text: 'Exantema Súbito (Roséola Infantil); provocado pelo Herpes-vírus humano tipo 6 (HHV-6).',
          isCorrect: true,
          explanation: 'O aparecimento do exantema maculopapular coincidindo com o desaparecimento súbito da febre alta em lactente é a apresentação patognomônica da roséola infantil (exantema súbito por HHV-6).',
        },
        {
          letter: 'B',
          text: 'Mononucleose infecciosa por vírus Epstein-Barr.',
          isCorrect: false,
          explanation: 'Mononucleose causa febre prolongada, faringite exsudativa, esplenomegalia e linfadenopatia generalizada com linfocitose atípica.',
        },
        {
          letter: 'C',
          text: 'Varicela provocada pelo vírus Varicela-Zóster.',
          isCorrect: false,
          explanation: 'Varicela caracteriza-se por lesões em múltiplos estágios evolutivos simultâneos (mácula, pápula, vesícula, pústula e crosta com polimorfismo regional).',
        },
        {
          letter: 'D',
          text: 'Doença de Kawasaki.',
          isCorrect: false,
          explanation: 'Kawasaki exige pelo menos 5 dias de febre alta associada a conjuntivite não exsudativa, alterações orais, adenopatia cervical e edema/eritema de extremidades.',
        },
      ],
    },
    {
      code: 'MED-PED-008',
      area: 'Pediatria',
      topicSlug: 'ped-puericultura',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Na avaliação do desenvolvimento neuropsicomotor aos 9 meses de vida, qual dos seguintes marcos motores e cognitivos é esperado que a criança já tenha consolidado de acordo com a caderneta de saúde da criança do Ministério da Saúde?',
      alternatives: [
        {
          letter: 'A',
          text: 'Sentar-se sem apoio, engatinhar ou arrastar-se e procurar objeto que caiu fora do seu campo visual direto (permanência do objeto).',
          isCorrect: true,
          explanation: 'Aos 9 meses a criança senta sem apoio, transfere objetos de uma mão para a outra, utiliza pinça inferior/radial e já compreende a permanência de objetos ocultos.',
        },
        {
          letter: 'B',
          text: 'Correr livremente, chutar bola e formular frases completas com sujeito e predicado.',
          isCorrect: false,
          explanation: 'Marcos típicos de crianças entre 2 e 3 anos de idade.',
        },
        {
          letter: 'C',
          text: 'Subir escadas alternando os pés e desenhar círculo perfeito.',
          isCorrect: false,
          explanation: 'Marcos de motricidade fina e ampla esperados entre 3 e 4 anos de vida.',
        },
        {
          letter: 'D',
          text: 'Apenas sorrir socialmente e manter controle cefálico sustentado ao ser puxada pelas mãos.',
          isCorrect: false,
          explanation: 'Marcos motores do primeiro trimestre de vida (2 a 3 meses).',
        },
      ],
    },

    // --- GINECOLOGIA E OBSTETRÍCIA (25-32) ---
    {
      code: 'MED-GO-001',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-pre-eclampsia',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Primigesta de 34 semanas comparece à maternidade com queixa de cefaleia frontal persistente, escotomas cintilantes e dor epigástrica em barra. Ao exame físico: PA de 165/110 mmHg confirmada, edema de membros inferiores 3+/4+ e reflexos osteotendíneos vivos (hiper-reflexia patelar). BCF: 144 bpm. Exames: plaquetas 82.000/mm³, TGO 140 U/L e creatinina 1,3 mg/dL. Qual é o diagnóstico e o esquema terapêutico imediato para prevenção de convulsões eclâmpticas?',
      alternatives: [
        {
          letter: 'A',
          text: 'Pré-eclâmpsia grave com sinais de iminência de eclâmpsia e Síndrome HELLP; conduta imediata: Sulfato de Magnésio (esquema de Pritchard ou Zuspan) e anti-hipertensivo venoso (hidralazina).',
          isCorrect: true,
          explanation: 'A tríade de cefaleia, escotomas e epigastralgia em barra caracteriza iminência de eclâmpsia. Associada à plaquetopenia e elevação de transaminases, indica sulfato de magnésio para neuroproteção maternal e controle pressórico com hidralazina ou labetalol EV.',
        },
        {
          letter: 'B',
          text: 'Hipertensão gestacional transitória; repouso absoluto no leito sem uso de medicações anticonvulsivantes.',
          isCorrect: false,
          explanation: 'Há critérios inequívocos de gravidade (sintomas neurológicos, plaquetopenia < 100.000 e TGO > 2x o limite), o que define pré-eclâmpsia grave.',
        },
        {
          letter: 'C',
          text: 'Prescrição imediata de Diazepam 10 mg venoso contínuo e diurético de alça para controle do edema.',
          isCorrect: false,
          explanation: 'O sulfato de magnésio é a droga de escolha e superior aos benzodiazepínicos na eclâmpsia; diuréticos diminuem a perfusão placentária já comprometida.',
        },
        {
          letter: 'D',
          text: 'Eclâmpsia consumada; realização de cesariana sob anestesia geral antes de administrar magnésio.',
          isCorrect: false,
          explanation: 'Não houve convulsão para definir eclâmpsia. A paciente deve ser primeiro estabilizada com sulfato de magnésio antes de qualquer parto programado.',
        },
      ],
    },
    {
      code: 'MED-GO-002',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-parto',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Gestante de 39 semanas em trabalho de parto ativo apresenta dilatação cervical de 8 cm com dinâmica uterina de 4 contrações em 10 minutos com duração de 45 segundos. Ao toque vaginal, o ponto de referência fetal palpável é a fontanela posterior (pequena fontanela / lâmbda), localizada na região anterior da pelve materna à esquerda. Qual é a apresentação, atitude e variedade de posição fetal?',
      alternatives: [
        {
          letter: 'A',
          text: 'Apresentação cefálica, atitude fletida (vértice) e variedade de posição Occípito-Esquerda-Anterior (OEA).',
          isCorrect: true,
          explanation: 'A fontanela posterior (lâmbda/occipício) palpada indica apresentação cefálica fletida (de vértice). Estando voltada para o quadrante anterior esquerdo da bacia materna, define a variedade OEA.',
        },
        {
          letter: 'B',
          text: 'Apresentação cefálica defletida de 1º grau (bregma) em Bregmo-Posterior.',
          isCorrect: false,
          explanation: 'Na defletida de 1º grau o ponto de referência é a grande fontanela (bregma / losango), e não o lâmbda.',
        },
        {
          letter: 'C',
          text: 'Apresentação pélvica completa com crista ilíaca em Sacro-Anterior.',
          isCorrect: false,
          explanation: 'Na apresentação pélvica palpam-se o sacro ou nádegas/pés, e não as fontanelas cranianas.',
        },
        {
          letter: 'D',
          text: 'Apresentação córmica com acrômio fetal palpável no estreito superior.',
          isCorrect: false,
          explanation: 'Apresentação córmica ocorre em situação transversa com ombro/acrômio no estreito.',
        },
      ],
    },
    {
      code: 'MED-GO-003',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-sua',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Mulher de 42 anos queixa-se de sangramento menstrual excessivo e duradouro há 8 meses, com eliminação de coágulos e cólicas menstruais moderadas (dismenorreia secundária). O exame físico e o toque bimanual evidenciam útero aumentado de volume (equivalente a 12 semanas), de superfície irregular e consistência fibroelástica indolor. Ultrassonografia transvaginal revela nódulos hipoecoicos bem delimitados na parede miometrial corporal, o maior medindo 4,5 cm intramural com componente submucoso abaulando a cavidade endometrial (Classificação FIGO 2). Pelo sistema PALM-COEIN, qual é a categoria dessa etiologia?',
      alternatives: [
        {
          letter: 'A',
          text: 'PALM (estrutural) - Leiomioma uterino (L).',
          isCorrect: true,
          explanation: 'O sistema PALM-COEIN classifica sangramento uterino anormal em estruturais (Pólipo, Adenomiose, Leiomioma, Malignidade) e não estruturais (Coagulopatia, Disfunção ovulatória, Endometrial, Iatrogênica, Não classificada).',
        },
        {
          letter: 'B',
          text: 'COEIN (não estrutural) - Coagulopatia primária de von Willebrand (C).',
          isCorrect: false,
          explanation: 'O nódulo uterino estrutural evidente explica o sangramento e dismenorreia.',
        },
        {
          letter: 'C',
          text: 'PALM (estrutural) - Adenomiose focal pura (A).',
          isCorrect: false,
          explanation: 'Adenomiose apresenta útero aumentado uniformemente e globular com miométrio heterogêneo sem nódulos fibroelásticos bem circunscritos.',
        },
        {
          letter: 'D',
          text: 'COEIN (não estrutural) - Disfunção ovulatória por anovulação crônica (O).',
          isCorrect: false,
          explanation: 'A presença de nódulo submucoso/intramural confirma mioma uterino estrutural (L da sigla PALM).',
        },
      ],
    },
    {
      code: 'MED-GO-004',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-colo-uterino',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Mulher de 31 anos, assintomática, realiza exame citopatológico de colo uterino (Papanicolau) de rotina na Unidade Básica de Saúde. O resultado revela: "Lesão intraepitelial de baixo grau (LSIL)". A paciente não possui imunossupressão ou infecção por HIV. Conforme as Diretrizes Brasileiras para o Rastreamento do Câncer do Colo do Útero do Ministério da Saúde/INCA, qual é a conduta preconizada?',
      alternatives: [
        {
          letter: 'A',
          text: 'Repetir o exame citopatológico em 6 meses na própria unidade básica de saúde.',
          isCorrect: true,
          explanation: 'Para mulheres com 30 anos ou mais com citologia LSIL (baixo grau), a recomendação do Ministério da Saúde é repetir o exame citopatológico em 6 meses devido à alta taxa de regressão espontânea.',
        },
        {
          letter: 'B',
          text: 'Encaminhamento imediato para colposcopia com biópsia dirigida.',
          isCorrect: false,
          explanation: 'Colposcopia imediata em LSIL é indicada para mulheres acima de 30 anos apenas após repetição positiva ou inicialmente se lesão de alto grau (HSIL).',
        },
        {
          letter: 'C',
          text: 'Realização imediata de conização do colo uterino por cirurgia de alta frequência (CAF).',
          isCorrect: false,
          explanation: 'Conização cirúrgica sem colposcopia e confirmação histológica prévia de lesão de alto grau é conduta iatrogênica contraindicada.',
        },
        {
          letter: 'D',
          text: 'Alta do rastreamento e retorno em 5 anos.',
          isCorrect: false,
          explanation: 'LSIL requer vigilância citológica ativa e não liberação para o intervalo padrão de 3 anos de rotina normal.',
        },
      ],
    },
    {
      code: 'MED-GO-005',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-pre-eclampsia',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Gestante de 32 semanas, diagnosticada com pré-eclâmpsia grave, está em infusão contínua de sulfato de magnésio endovenoso para profilaxia de convulsões. Durante a avaliação de enfermagem, o médico é chamado devido à suspeita de intoxicação magnésica. Qual dos seguintes sinais clínicos é o indicador mais precoce e sensível de hipermagnesemia tóxica, e qual é o antídoto que deve ser mantido à beira do leito?',
      alternatives: [
        {
          letter: 'A',
          text: 'Abolição do reflexo patelar (tendinoso profundo); antídoto: Gluconato de Cálcio a 10% endovenoso.',
          isCorrect: true,
          explanation: 'O primeiro sinal clínico de toxicidade por magnésio (nível sérico > 7-10 mEq/L) é a perda dos reflexos patelares, que precede a depressão respiratória. O antídoto mandatório imediato é o gluconato de cálcio 10% (1g EV em 3-5 minutos).',
        },
        {
          letter: 'B',
          text: 'Aparecimento de diarreia aquosa; antídoto: Bicarbonato de sódio a 8,4%.',
          isCorrect: false,
          explanation: 'Hipermagnesemia gera paralisia muscular e vasodilatação, e não diarreia aguda.',
        },
        {
          letter: 'C',
          text: 'Hipertensão arterial rebote; antídoto: Nitroprussiato de sódio.',
          isCorrect: false,
          explanation: 'O sulfato de magnésio é um vasodilatador fraco, mas a toxicidade manifesta-se por hipotensão e paralisia neuromuscular.',
        },
        {
          letter: 'D',
          text: 'Midríase paralítica fixa; antídoto: Fisostigmina venosa.',
          isCorrect: false,
          explanation: 'O reflexo patelar e a frequência respiratória são os monitores clínicos padrão da infusão do sulfato de magnésio.',
        },
      ],
    },
    {
      code: 'MED-GO-006',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-parto',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Puérpera imediata (30 minutos pós-parto vaginal de feto macrossômico pesando 4.250 g) apresenta sangramento vaginal contínuo e profuso em jato. Ao exame físico: paciente sudorética, taquicárdica (FC 125 bpm), PA 80/45 mmHg. À palpação abdominal: útero amolecido, atônico, com fundo uterino palpável 3 cm acima da cicatriz umbilical. Qual é a causa mais frequente de hemorragia pós-parto e a conduta medicamentosa inicial imediata recomendada?',
      alternatives: [
        {
          letter: 'A',
          text: 'Atonia uterina (componente "Tônus" dos 4 Ts); conduta: Massagem uterina bimanual de Hamilton + Ocitocina endovenosa + Ácido Tranexâmico.',
          isCorrect: true,
          explanation: 'A atonia uterina responde por 70-80% dos casos de hemorragia pós-parto. A abordagem inicial inclui massagem uterina bimanual compressiva, uterotônicos (ocitocina primeira linha, ergometrina/misoprostol) e ácido tranexâmico precoce.',
        },
        {
          letter: 'B',
          text: 'Inversão uterina aguda de 3º grau; conduta: Manobra de Taxe imediata.',
          isCorrect: false,
          explanation: 'Na inversão uterina não se palpa o corpo uterino no abdome (sinal da cratera) e nota-se massa carnosa exteriorizada na vulva.',
        },
        {
          letter: 'C',
          text: 'Coagulopatia congênita por hemofilia; conduta: Infusão de crioprecipitado e fator VIII.',
          isCorrect: false,
          explanation: 'A ausência de contratilidade uterina ao exame firma atonia mecânica como etiologia primária.',
        },
        {
          letter: 'D',
          text: 'Laceração de trajeto perineal grau IV com rotura de esfíncter anal; rafia cirúrgica isolada.',
          isCorrect: false,
          explanation: 'Se a causa fosse laceração pura de trajeto, o útero estaria bem contraído e endurecido (globo de segurança de Pinard).',
        },
      ],
    },
    {
      code: 'MED-GO-007',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-sua',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Mulher de 26 anos procura o ginecologista com queixa de irregularidade menstrual (ciclos de 45 a 60 dias) há 3 anos, ganho de peso, acne e aumento de pelos faciais e na linha alba (escore de Ferriman-Gallwey = 10). Exames laboratoriais afastam hiperprolactinemia, disfunção tireoidiana e hiperplasia adrenal congênita de início tardio. Ultrassonografia pélvica demonstra ovários aumentados com múltiplos folículos periféricos de 3 a 7 mm. Pelo Consenso de Rotterdam, qual é o diagnóstico e o pilar do tratamento para regulação do ciclo menstrual sem desejo reprodutivo atual?',
      alternatives: [
        {
          letter: 'A',
          text: 'Síndrome dos Ovários Policísticos (SOP); mudança no estilo de vida associada a anticoncepcional hormonal combinado oral.',
          isCorrect: true,
          explanation: 'O preenchimento de 3 critérios de Rotterdam (oligo/anovulação, hiperandrogenismo clínico/laboratorial e ovários policísticos ao USG) fecha SOP. O tratamento de 1ª linha para controle hormonal e proteção endometrial é o ACO combinado associado a dieta/exercício.',
        },
        {
          letter: 'B',
          text: 'Insuficiência ovariana prematura; terapia de reposição hormonal com estrogênio conjugado.',
          isCorrect: false,
          explanation: 'A insuficiência ovariana prematura apresenta amenorreia hipoestrogênica com FSH muito elevado (> 25-40 UI/L) e ausência de folículos ovarianos.',
        },
        {
          letter: 'C',
          text: 'Síndrome de Cushing subclínica; adrenalectomia bilateral profilática.',
          isCorrect: false,
          explanation: 'Cushing cursa com estrias violáceas largas, giba dorsal, pletora facial e miopatia proximal, requerendo rastreio com cortisol livre.',
        },
        {
          letter: 'D',
          text: 'Endometriose ovariana profunda; laparoscopia diagnóstica de urgência.',
          isCorrect: false,
          explanation: 'Endometriose causa dismenorreia progressiva, dispareunia e dor pélvica crônica, sem manifestações de hiperandrogenismo cutâneo.',
        },
      ],
    },
    {
      code: 'MED-GO-008',
      area: 'Ginecologia e Obstetrícia',
      topicSlug: 'go-colo-uterino',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Mulher de 56 anos, na pós-menopausa há 6 anos, comparece à consulta com queixa de sangramento vaginal avermelhado em pequena quantidade iniciado há 3 semanas. Nega uso de terapia de reposição hormonal. Ao exame especular: colo atrófico, sem lesões exofíticas visíveis, com discreto sangramento oriundo do orifício externo cervical. A ultrassonografia transvaginal revela espessura endometrial de 11 mm. Qual é a conduta diagnóstica obrigatória para afastar câncer de endométrio?',
      alternatives: [
        {
          letter: 'A',
          text: 'Biópsia endometrial histopatológica (idealmente por histeroscopia diagnóstica com biópsia dirigida ou curetagem uterina).',
          isCorrect: true,
          explanation: 'Em mulher na pós-menopausa sem TRH, espessura endometrial > 4-5 mm associada a sangramento pós-menopausa é indicação formal mandatória de amostragem histológica endometrial para exclusão de adenocarcinoma.',
        },
        {
          letter: 'B',
          text: 'Prescrição empírica de progesterona oral cíclica por 6 meses e reavaliação clínica.',
          isCorrect: false,
          explanation: 'Nunca se deve prescrever medicação empírica em sangramento na pós-menopausa sem investigação histológica prévia do endométrio.',
        },
        {
          letter: 'C',
          text: 'Repetir a ultrassonografia transvaginal em 12 meses para avaliar crescimento.',
          isCorrect: false,
          explanation: 'Endométrio de 11 mm é manifestamente anormal na menopausa (> 4 mm) e postergar a biópsia atrasa o diagnóstico de malignidade.',
        },
        {
          letter: 'D',
          text: 'Solicitar dosagem sérica de CA-125 e ressonância magnética de mamas.',
          isCorrect: false,
          explanation: 'CA-125 não é método diagnóstico de câncer de endométrio; a biópsia tecidual do endométrio é o padrão-ouro indispensável.',
        },
      ],
    },

    // --- SAÚDE COLETIVA (33-40) ---
    {
      code: 'MED-SC-001',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-principios-sus',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Um médico recém-formado assume uma equipe de Saúde da Família e planeja ações de atendimento prioritário em domicílio para idosos acamados e famílias em situação de extrema vulnerabilidade social, oferecendo mais recursos e atenção diferenciada a quem possui maior necessidade em saúde, sem perder a garantia de assistência a todos os cidadãos do território. Qual princípio doutrinário do Sistema Único de Saúde (SUS) fundamenta essa prática?',
      alternatives: [
        {
          letter: 'A',
          text: 'Equidade.',
          isCorrect: true,
          explanation: 'A equidade consiste em "tratar desigualmente os desiguais", investindo mais onde a vulnerabilidade e carência são maiores, reduzindo disparidades sociais e injustiças no acesso à saúde.',
        },
        {
          letter: 'B',
          text: 'Integralidade.',
          isCorrect: false,
          explanation: 'Integralidade refere-se a enxergar o indivíduo como um todo biopsicossocial e articular ações preventivas, curativas e reabilitadoras.',
        },
        {
          letter: 'C',
          text: 'Universalidade.',
          isCorrect: false,
          explanation: 'Universalidade significa que a saúde é direito de todos e dever do Estado, sem distinção de raça, classe ou renda.',
        },
        {
          letter: 'D',
          text: 'Descentralização.',
          isCorrect: false,
          explanation: 'Descentralização é um princípio organizativo que redistribui poder e responsabilidades para o nível municipal (mais próximo do cidadão).',
        },
      ],
    },
    {
      code: 'MED-SC-002',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-epidemiologia',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Para investigar a associação entre o uso prolongado de determinado anti-inflamatório não esteroidal e o desenvolvimento de insuficiência renal crônica, pesquisadores selecionaram 300 pacientes com diagnóstico confirmado de nefropatia terminal e 600 indivíduos saudáveis sem disfunção renal, comparáveis em idade e sexo. Em seguida, entrevistaram os participantes sobre o histórico de consumo prévio do medicamento nos últimos 10 anos. Qual é o delineamento metodológico desse estudo e a medida de associação adequada a ser calculada?',
      alternatives: [
        {
          letter: 'A',
          text: 'Estudo de Caso-Controle; medida de associação: Razão de Chances (Odds Ratio).',
          isCorrect: true,
          explanation: 'O estudo parte do desfecho (casos doentes vs. controles não doentes) e investiga retrospectivamente a exposição prévia. Em estudos de caso-controle a medida clássica de associação é o Odds Ratio.',
        },
        {
          letter: 'B',
          text: 'Estudo de Coorte Prospectivo; medida: Risco Relativo (RR).',
          isCorrect: false,
          explanation: 'Na coorte prospectiva parte-se de indivíduos sadios expostos e não expostos, acompanhando-os ao longo do tempo em direção ao desfecho futuro.',
        },
        {
          letter: 'C',
          text: 'Ensaio Clínico Randomizado Triplo-Cego; medida: Redução Absoluta do Risco (RAR).',
          isCorrect: false,
          explanation: 'Trata-se de estudo observacional retrospectivo, sem qualquer alocação aleatória ou intervenção experimental do pesquisador.',
        },
        {
          letter: 'D',
          text: 'Estudo Ecológico Agregado; medida: Coeficiente de Correlação de Pearson.',
          isCorrect: false,
          explanation: 'O estudo ecológico utiliza dados populacionais agregados (cidades, países), e não dados individuais como os descritos.',
        },
      ],
    },
    {
      code: 'MED-SC-003',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-esf-mccp',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Durante consulta médica na Atenção Primária, um senhor de 58 anos com diabetes mellitus mal controlado expressa medo de ficar cego como ocorreu com seu pai, queixando-se de que a dieta recomendada não condiz com sua cultura familiar. O médico acolhe a angústia, explora as crenças e expectativas do paciente, compartilha o plano terapêutico em comum acordo e agenda retorno próximo. Essa abordagem clínica é orientada pelo:',
      alternatives: [
        {
          letter: 'A',
          text: 'Método Clínico Centrado na Pessoa (MCCP).',
          isCorrect: true,
          explanation: 'O MCCP baseia-se em quatro componentes: explorando a saúde, a doença e a experiência da pessoa com a doença; entendendo a pessoa como um todo; elaborando um plano conjunto de manejo; e intensificando a relação médico-paciente.',
        },
        {
          letter: 'B',
          text: 'Modelo Biomédico Flexneriano Tradicional.',
          isCorrect: false,
          explanation: 'O modelo biomédico tradicional foca estritamente na fisiopatologia da doença, excluindo aspectos psicossociais e a vivência subjetiva do paciente.',
        },
        {
          letter: 'C',
          text: 'Princípio do Paternalismo Médico Hipocrático.',
          isCorrect: false,
          explanation: 'O paternalismo médico impõe condutas verticalizadas sem ouvir as preferências ou construir decisões compartilhadas com o paciente.',
        },
        {
          letter: 'D',
          text: 'Protocolo de Notificação Compulsória Sentinela.',
          isCorrect: false,
          explanation: 'Notificação compulsória é instrumento de vigilância epidemiológica, sem relação com método de entrevista clínica humanizada.',
        },
      ],
    },
    {
      code: 'MED-SC-004',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-vigilancia',
      difficulty: Difficulty.EASY,
      year: 2025,
      stem: 'Um médico que atua em Unidade de Pronto Atendimento (UPA) atende um homem de 30 anos com ferimento pérfuro-cortante grave provocado por mordedura de morcego hematófago na zona rural. Conforme a Portaria de Notificação Compulsória do Ministério da Saúde do Brasil, qual é o prazo e o fluxo correto para notificação de acidente por animal potencialmente transmissor da raiva humana?',
      alternatives: [
        {
          letter: 'A',
          text: 'Notificação compulsória semanal (em até 7 dias) via ficha padrão do SINAN para a Secretaria Municipal de Saúde.',
          isCorrect: true,
          explanation: 'Atendimento antirrábico humano é evento de notificação compulsória padrão com periodicidade semanal (salvo casos suspeitos de raiva humana em si, cuja notificação de doença estabelecida é imediata em 24h).',
        },
        {
          letter: 'B',
          text: 'Não é um agravo de notificação compulsória, devendo apenas ser registrado no prontuário do paciente.',
          isCorrect: false,
          explanation: 'O acidente por animal potencialmente transmissor da raiva humana integra a Lista Nacional de Notificação Compulsória.',
        },
        {
          letter: 'C',
          text: 'Notificação facultativa exclusiva para centros de pesquisa universitários.',
          isCorrect: false,
          explanation: 'A notificação é obrigatória para todos os profissionais de saúde e serviços públicos e privados em território nacional.',
        },
        {
          letter: 'D',
          text: 'Notificação exclusivamente internacional via OMS em até 1 hora.',
          isCorrect: false,
          explanation: 'O fluxo ordinário de agravos segue as instâncias municipais, estaduais e federais brasileiras através do SINAN.',
        },
      ],
    },
    {
      code: 'MED-SC-005',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-principios-sus',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'A Lei Federal nº 8.142/1990 estabelece os mecanismos de participação da comunidade na gestão do Sistema Único de Saúde (SUS). Sobre a composição e o funcionamento das Conferências de Saúde e dos Conselhos de Saúde nas três esferas de governo, é CORRETO afirmar que:',
      alternatives: [
        {
          letter: 'A',
          text: 'A representação dos usuários nos Conselhos e Conferências de Saúde é paritária (50% do total) em relação ao conjunto dos demais segmentos (trabalhadores da saúde, prestadores e gestores governamentais).',
          isCorrect: true,
          explanation: 'A Lei 8.142/90 estipula representação paritária dos usuários (50% usuários, 25% profissionais de saúde, e 25% gestores e prestadores de serviços de saúde).',
        },
        {
          letter: 'B',
          text: 'Os Conselhos de Saúde são instâncias meramente consultivas sem poder deliberativo sobre o orçamento da saúde.',
          isCorrect: false,
          explanation: 'Os Conselhos de Saúde têm caráter deliberativo e permanente, atuando na formulação de estratégias e controle da execução da política de saúde, inclusive nos aspectos econômicos.',
        },
        {
          letter: 'C',
          text: 'As Conferências de Saúde reúnem-se anualmente por convocação exclusiva do Presidente da República.',
          isCorrect: false,
          explanation: 'As Conferências de Saúde reúnem-se a cada 4 anos com a representação dos vários segmentos sociais para avaliar a situação de saúde e propor diretrizes.',
        },
        {
          letter: 'D',
          text: 'Médicos e enfermeiros ocupam obrigatoriamente 80% das vagas dos Conselhos de Saúde.',
          isCorrect: false,
          explanation: 'Os trabalhadores de saúde representam 25% do colegiado conforme a resolução 453 do Conselho Nacional de Saúde.',
        },
      ],
    },
    {
      code: 'MED-SC-006',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-epidemiologia',
      difficulty: Difficulty.HARD,
      year: 2025,
      stem: 'Um teste diagnóstico recém-desenvolvido para triagem de tuberculose pulmonar foi aplicado em 1.000 pacientes suspeitos. Dos 200 pacientes verdadeiramente doentes (padrão-ouro positivo), o teste foi positivo em 180. Dos 800 pacientes sem tuberculose (padrão-ouro negativo), o teste foi negativo em 720. Quais são, respectivamente, a Sensibilidade e a Especificidade desse novo teste?',
      alternatives: [
        {
          letter: 'A',
          text: 'Sensibilidade de 90% e Especificidade de 90%.',
          isCorrect: true,
          explanation: 'Sensibilidade = Verdadeiros Positivos / Total de Doentes = 180 / 200 = 0,90 (90%). Especificidade = Verdadeiros Negativos / Total de Não Doentes = 720 / 800 = 0,90 (90%).',
        },
        {
          letter: 'B',
          text: 'Sensibilidade de 20% e Especificidade de 80%.',
          isCorrect: false,
          explanation: 'Cálculo incorreto que confunde prevalência amostral com parâmetros intrínsecos de acurácia do teste.',
        },
        {
          letter: 'C',
          text: 'Sensibilidade de 95% e Especificidade de 72%.',
          isCorrect: false,
          explanation: 'Erros na razão entre verdadeiros positivos e falsos negativos.',
        },
        {
          letter: 'D',
          text: 'Sensibilidade de 72% e Especificidade de 95%.',
          isCorrect: false,
          explanation: 'Valores invertidos e numericamente incompatíveis com os dados fornecidos.',
        },
      ],
    },
    {
      code: 'MED-SC-007',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-esf-mccp',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Segundo a Política Nacional de Atenção Básica (PNAB) e os atributos da Atenção Primária à Saúde definidos por Barbara Starfield, o atributo que expressa a capacidade do serviço de responder à maioria das necessidades de saúde da população, incluindo ações de promoção, prevenção, cura, reabilitação e cuidados paliativos, denomina-se:',
      alternatives: [
        {
          letter: 'A',
          text: 'Integralidade (ou Abrangência).',
          isCorrect: true,
          explanation: 'A integralidade (abrangência) como atributo da APS refere-se à prestação de uma gama ampla de serviços clínicos e de saúde coletiva compatíveis com o contexto comunitário.',
        },
        {
          letter: 'B',
          text: 'Acesso de primeiro contato.',
          isCorrect: false,
          explanation: 'Acesso de primeiro contato implica na acessibilidade e no uso da unidade básica como porta de entrada preferencial a cada novo problema.',
        },
        {
          letter: 'C',
          text: 'Longitudinalidade.',
          isCorrect: false,
          explanation: 'Longitudinalidade é o vínculo e continuidade da relação de cuidado entre o paciente e a mesma equipe profissional ao longo do tempo.',
        },
        {
          letter: 'D',
          text: 'Coordenação do cuidado.',
          isCorrect: false,
          explanation: 'Coordenação pressupõe a capacidade de integrar e sincronizar o cuidado do paciente através dos diversos pontos da Rede de Atenção à Saúde.',
        },
      ],
    },
    {
      code: 'MED-SC-008',
      area: 'Saúde Coletiva',
      topicSlug: 'sc-vigilancia',
      difficulty: Difficulty.MEDIUM,
      year: 2025,
      stem: 'Durante um surto epidêmico de infecção gastrointestinal em uma creche municipal que atende 120 crianças, 36 crianças apresentaram quadro de vômitos e diarreia aquosa 6 horas após a merenda escolar comum. Na epidemiologia de campo, qual é o indicador epidemiológico que expressa a proporção de casos novos entre os indivíduos expostos a essa fonte pontual?',
      alternatives: [
        {
          letter: 'A',
          text: 'Taxa de Ataque (ou Coeficiente de Ataque), que neste surto foi de 30%.',
          isCorrect: true,
          explanation: 'A taxa de ataque é uma forma particular de coeficiente de incidência aplicada a uma população bem definida e restrita exposta a uma fonte comum em curto período de tempo. Aqui: 36 / 120 = 30%.',
        },
        {
          letter: 'B',
          text: 'Coeficiente de Letalidade de 30%.',
          isCorrect: false,
          explanation: 'Letalidade afere a proporção de óbitos entre os indivíduos que adoeceram, inexistindo mortes neste enunciado.',
        },
        {
          letter: 'C',
          text: 'Taxa de Prevalência Pontual de 12%.',
          isCorrect: false,
          explanation: 'Em surtos agudos com exposição em fonte pontual, calcula-se a taxa de ataque do evento.',
        },
        {
          letter: 'D',
          text: 'Mortalidade Proporcional por causas externas de 50%.',
          isCorrect: false,
          explanation: 'Mortalidade proporcional avalia fração de mortes por um grupo de causas sobre o total de mortes.',
        },
      ],
    },
  ];

  for (const q of questionsData) {
    const topicId = topicMap[q.topicSlug];
    if (!topicId) {
      throw new Error(`Topic not found for slug: ${q.topicSlug}`);
    }

    const createdQuestion = await prisma.question.create({
      data: {
        code: q.code,
        area: q.area,
        topicId: topicId,
        difficulty: q.difficulty,
        year: q.year,
        source: `Simulado MedLevel 2025 (${DISCLAIMER_TEXT})`,
        status: QuestionStatus.PUBLISHED,
        stem: q.stem,
        alternatives: {
          create: q.alternatives.map((alt) => ({
            letter: alt.letter,
            text: alt.text,
            isCorrect: alt.isCorrect,
            explanation: alt.explanation,
          })),
        },
      },
    });

    console.log(`  + Question created: [${q.code}] - ${q.area}`);
  }

  console.log(`✅ Seed finished successfully! 40 original questions created.`);
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
