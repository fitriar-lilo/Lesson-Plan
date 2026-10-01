import { IGCSELessonPlan } from '../types/lessonPlan';

export const SAMPLE_LESSON_PLAN: IGCSELessonPlan = {
  header: {
    school: 'SEMESTA SCHOOL',
    subjectCode: 'IGCSE Mathematics 0580',
    topic: 'Linear Equations in One Variable (0580 C2.1/E2.1)',
    subtopics: 'Solving two-step linear equations, expanding brackets with integer constants, and algebraic modeling',
    yearGroup: 'Year 10 (SMA)',
    duration: '80 mins',
    numberOfMeetings: 2,
    teacher: 'Fitria Rakhmawati',
    principal: 'Ahmad Nurani, S.T., M.Pd.',
  },
  learningObjectives: {
    cambridgeAOs: [
      'AO1: Mathematical techniques — Recall and carry out arithmetic operations and algebraic manipulation with integer terms ($ax + b = c$).',
      'AO2: Reason, interpret and communicate mathematically — Formulate simple linear models from relatable digital media scenarios.',
    ],
    walt: 'We Are Learning To formulate and solve two-step linear equations involving integer coefficients and expand single brackets to solve practical problems.',
    wilf: [
      'Isolate the variable term by applying inverse operations using integer addition and subtraction ($ax + b = c \\implies ax = c - b$).',
      'Expand single brackets with positive and negative integers correctly ($2(x + 4) = 2x + 8$).',
      'Translate word problems from social media follower growth into single-variable linear equations.',
      'Check answers by substituting the calculated integer root back into the original equation.',
    ],
    slo: [
      'SLO 1: Critical Thinkers — Analyze real-world patterns systematically using symbolic logic.',
      'SLO 2: Resilient Learners — Persevere through multi-step algebraic operations using structured visual cues.',
      'SLO 3: Effective Communicators — Express mathematical reasoning verbally and in formal algebraic notation.',
    ],
    clilLanguageObjectives: {
      keyLanguageFocus: 'Formulating algebraic statements and justifying inverse operations using bilingual terminology.',
      vocabularyList: [
        {
          englishTerm: 'Linear Equation',
          indonesianTerm: 'Persamaan Linear',
          definition: 'An algebraic equation where the highest exponent of the variable is 1 ($x^1$).',
          exampleContext: 'e.g., $3x + 12 = 30$',
        },
        {
          englishTerm: 'Inverse Operation',
          indonesianTerm: 'Operasi Kebalikan',
          definition: 'Opposite mathematical operation used to isolate a variable (addition reverses subtraction).',
          exampleContext: 'Subtract 6 from both sides to balance',
        },
        {
          englishTerm: 'Coefficient',
          indonesianTerm: 'Koefisien',
          definition: 'The integer numerical factor multiplied by a variable.',
          exampleContext: 'In $5x$, the coefficient is $5$',
        },
        {
          englishTerm: 'Substitute',
          indonesianTerm: 'Substitusi / Mengganti',
          definition: 'Plugging a calculated integer back into the variable to check validity.',
          exampleContext: 'Check: $3(6) + 2 = 20$',
        },
      ],
    },
  },
  differentiationProvisions: {
    struggledScaffolding: [
      'Balance Scale Graphic Organizer: Visual two-pan balance showing equation balance with integer blocks.',
      'Integer Operation Strip: Color-coded cards (+ green, - red) to avoid sign confusion during integer subtraction.',
      'Two-Step Flowchart: Step 1: Undo addition/subtraction; Step 2: Undo multiplication/division.',
      'Pair work with dedicated integer calculation checklists.',
    ],
    ealSupport: [
      'Bilingual word problem flashcards (English terms paired with Bahasa Indonesia counterparts).',
      'Sentence starters: "To isolate $x$, I first subtract ... from both sides because ..."',
      'Visual mathematical dictionary displayed on classroom wall.',
    ],
    senScaffolding: [
      'Task chunking: Maximum of 2 problems presented per worksheet segment.',
      'Pre-highlighted coefficients and constant terms using high-contrast borders.',
      'Physical integer counters / algebra tiles provided to reinforce inverse operations concretely.',
    ],
    extensionTasks: [
      'Multi-bracket challenge: Formulate and solve $3(x + 2) + 2(x - 1) = 24$ for an e-sports tournament prize distribution.',
      'Reverse-engineering problem: Write a relatable TikTok follower growth scenario that yields the solution $x = 15$ days.',
    ],
  },
  lessonSequence: [
    {
      meetingNumber: 1,
      focusTitle: 'Two-Step Linear Equations & Social Media Growth',
      engage: {
        time: '10 mins',
        activity:
          'Hook Activity: Teacher Fitria presents a relatable scenario: "A student gamer starts a Twitch channel with $100$ followers. Every week, through viral short clips, they gain $25$ new followers. How many weeks until they reach $250$ followers?" Students estimate mentally using mental addition. Teacher writes $100 + 25w = 250$ on the board to bridge concrete curiosity to algebraic representation.',
      },
      explore: {
        time: '20 mins',
        activity:
          'Collaborative Discovery: In pairs, students receive three relatable integer scenarios: (1) In-game diamond inventory ($50 + 10d = 120$), (2) Shopee e-wallet balance reload ($200 - 15p = 50$), and (3) Gym workout challenge points ($30 + 8s = 70$). Using balance tiles and integer number lines, students discover the systematic pattern: "Eliminate the loose constant first, then divide by the coefficient."',
      },
      explain: {
        time: '20 mins',
        activity:
          'Formal Synthesis & LaTeX Notation: Teacher Fitria formalizes the two golden rules of inverse operations: (1) Golden Rule of Equality: Whatever you do to one side of the equation, you must do to the other side ($ax + b = c \\iff ax = c - b$). (2) Division to isolate: $\\frac{ax}{a} = \\frac{c-b}{a}$. Teacher demonstrates clean worked examples on board with integer roots: Solve $4x + 8 = 32 \\implies 4x = 24 \\implies x = 6$. Students copy into structured bilingual formula notebooks.',
      },
      elaborate: {
        time: '20 mins',
        activity:
          'Differentiated Peer Practice ("Level-Up Quest"): Students solve 4 integer-based problem cards arranged by tier: Tier 1 (Bronze): $2x + 6 = 18$ ($x = 6$); Tier 2 (Silver): $5x - 15 = 35$ ($x = 10$); Tier 3 (Gold): $7x + 14 = 70$ ($x = 8$). Students switch cards with peers and use the "Substitution Check" ($4(6) + 8 = 32$) to self-verify before calling the teacher.',
      },
      evaluate: {
        time: '10 mins',
        activity:
          'Formative Exit Ticket (Integer Challenge): 2 quick questions on slip: (1) Solve $3x + 9 = 24$ (Solution: $x = 5$). (2) Relatable challenge: "A TikTok creator has $40$ views. If views increase by $12$ each hour, in how many hours will they reach $100$ views?" ($40 + 12h = 100 \\implies 12h = 60 \\implies h = 5$). Slips collected for targeted grouping in Meeting 2.',
      },
    },
    {
      meetingNumber: 2,
      focusTitle: 'Expanding Brackets in Equations & E-Commerce Cart Discounts',
      engage: {
        time: '10 mins',
        activity:
          'Flashback & Relatable Hook: Teacher Fitria shows a Shopee checkout screen: "A group of 3 friends buy identical phone cases on sale. Each phone case was originally $x$ thousand Rupiah, but received a flash voucher discount of $5$ thousand Rupiah ($x - 5$). If the total bill paid for all 3 friends is $60$ thousand Rupiah, how much was the original price?" Teacher asks: "Can we write this as $3(x - 5) = 60$?"',
      },
      explore: {
        time: '20 mins',
        activity:
          'Hands-On Area Model Exploration: Students use rectangular grid models to visually expand brackets before solving. For $3(x - 5)$, students draw a rectangle with height $3$ and width $x - 5$, visualizing area as $3x - 15$. They test whether expanding first ($3x - 15 = 60 \\implies 3x = 75 \\implies x = 25$) gives the same answer as dividing first ($x - 5 = 20 \\implies x = 25$). All calculations deliberately use clean integers.',
      },
      explain: {
        time: '20 mins',
        activity:
          'Distributive Property Instruction: Teacher clarifies the distributive law: $a(bx + c) = abx + ac$. Explicit visual arrows drawn from outer integer to each inner term. Common pitfall highlighted: forgetting to multiply the second term ($2(x + 3) \\neq 2x + 3$). Worked example modeled: $4(x + 2) = 36 \\implies 4x + 8 = 36 \\implies 4x = 28 \\implies x = 7$.',
      },
      elaborate: {
        time: '20 mins',
        activity:
          'Team Relay Race ("Algorithm Optimizer"): In groups of 4, each student completes one step of a multi-bracket equation on a shared mini-whiteboard: Student 1 expands bracket, Student 2 isolates variable term, Student 3 divides by coefficient, Student 4 checks via substitution. Equations feature gaming tournament scenarios ($2(x + 10) = 50$, $5(x - 4) = 40$).',
      },
      evaluate: {
        time: '10 mins',
        activity:
          'Formative Assessment & Self-Reflection: Digital exit quiz via Google Form / Paper Slip: Solve $3(x + 4) = 27$ (Answer: $x = 5$). Rate confidence from 1 to 5. Students identify whether they preferred expanding first or dividing first.',
      },
    },
  ],
  postLesson: {
    formativeAssessment: [
      'Meeting 1 Exit Ticket: 2-step equation evaluation ($3x + 9 = 24$, $x = 5$).',
      'Meeting 2 Distributive check: Bracket expansion problem ($3(x + 4) = 27$, $x = 5$).',
      'Whiteboard rapid check during Explain phase for instantaneous error detection.',
      'Peer-reviewed substitution check worksheets.',
    ],
    homeworkOrNextLesson: [
      'Relatable Homework Sheet: "The E-Sports Manager Challenge" — 4 integer equations modeling team salary caps and victory points.',
      'Next Lesson Preview: Introduction to Equations with Variables on Both Sides ($3x + 4 = x + 16$).',
    ],
    teacherReflectionPrompts: [
      'Did the integer-only constraint successfully eliminate student arithmetic hesitation and keep focus on algebraic logic?',
      'Which modern real-world scenario (gaming vs social media) generated the highest student engagement among Year 10 students?',
      'Were struggled scaffolding cards utilized effectively by students needing additional support during the Elaborate phase?',
    ],
    resourceList: [
      'Cambridge IGCSE Mathematics 0580 Extended Student Book (Hodder / Cambridge University Press) Chapter 2.',
      'Interactive Algebra Balance Applet / PhET Simulation "Equality Explorer".',
      'Custom printed Integer Scaffolding Cue Cards & Bilingual English-Indonesian Glossaries.',
      'Scientific calculator (Casio fx-991EX / fx-82ES) — strictly used for verification, not initial problem formulation.',
    ],
  },
  approval: {
    teacherName: 'Fitria Rakhmawati',
    hodName: '',
    principalName: 'Ahmad Nurani, S.T., M.Pd.',
  },
};
