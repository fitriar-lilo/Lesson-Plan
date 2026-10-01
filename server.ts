import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY environment variable is not set. Gemini API calls will fail.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/generate-lesson-plan', async (req: Request, res: Response) => {
  try {
    const {
      topic,
      subtopics,
      objective,
      teachingMethod,
      duration,
      meetingsCount,
    } = req.body;

    if (!topic || !subtopics) {
      return res.status(400).json({ error: 'Topic and Sub-topics are required.' });
    }

    const meetingsNum = Math.max(1, Math.min(10, parseInt(String(meetingsCount || 1), 10)));
    const sessionDuration = duration?.trim() || '80 mins';
    const method = teachingMethod?.trim() || '5E Instructional Model';

    const systemPrompt = `You are an expert Cambridge IGCSE Mathematics (0580) Curriculum Specialist, Master Teacher, and Pedagogical Designer at SEMESTA SCHOOL.
Generate a comprehensive, fully formatted Grade 10 Math lesson plan based on the WASC Initial Report standard.

STRICT CONSTRAINTS & RULES:
1. Target Audience Constraint: The lesson plan MUST be simple, applicative, and specifically tailored for students with middle-to-low academic input. Break down complex cognitive steps, use intuitive visual/graphic scaffolds, and provide explicit scaffolding.
2. Mathematical Constraint: All sample questions, worked examples, and practice problems generated MUST use INTEGER numbers (clean positive/negative integers, e.g. $2x + 6 = 18$, $x = 6$; discounts like $20\\%$ off $150$ giving $120$; speeds like $60\\text{ km/h}$; gaming points like $250$). Avoid cumbersome decimals or awkward non-integer fractions to eliminate unnecessary cognitive load.
3. Real-World Application: Sample word problems, Explore activities, and formative tasks MUST use modern, relatable cases that teenagers love (e.g. TikTok / Instagram algorithm follower growth, Discord server moderation rates, Mobile Legends / Genshin Impact gacha pull mechanics and level-ups, Shopee / Tokopedia 11.11 flash sale discounts, Spotify streaming bitrate & data bundles, e-sports tournament brackets).
4. Math Equations: Format ALL mathematical expressions, variables, formulas, and equations in valid LaTeX (enclosed with single dollar signs for inline, e.g. $x^2 + 5x + 6 = 0$ or double dollar signs for display equations).
5. Fixed Names & Institutional Details:
   - School: SEMESTA SCHOOL (Year 10 SMA)
   - Subject: IGCSE Mathematics 0580
   - Teacher: Fitria Rakhmawati
   - Principal: Ahmad Nurani, S.T., M.Pd.
   - Head of Department (HoD): (Leave blank for signature)
6. Dynamic Meetings Requirement:
   You MUST generate the 5E sequence for EXACTLY ${meetingsNum} meeting(s). Each meeting MUST contain realistic time allocations summing up to approximately ${sessionDuration}, with:
   - Engage: Real-world hook with relatable modern case
   - Explore: Hands-on discovery or collaborative case analysis using integer data
   - Explain: Teacher-guided concept formulation, key rules, and LaTeX notation
   - Elaborate: Structured guided-to-independent practice using relatable modern scenario
   - Evaluate: Formative check / exit ticket with integer-based questions
7. CLIL & Bilingual Support: Provide English-Bahasa Indonesia bilingual vocabulary with definitions and pedagogical usage context for Indonesian Year 10 students.`;

    const userPrompt = `Generate the IGCSE 0580 Grade 10 lesson plan for:
- Topic: ${topic}
- Sub-topics: ${subtopics}
- User Objective: ${objective || 'Develop conceptual mastery and practical problem-solving using integer-based modern applications.'}
- Teaching Method: ${method}
- One Session Duration: ${sessionDuration}
- Number of Meetings: ${meetingsNum}

Return a valid JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            header: {
              type: Type.OBJECT,
              properties: {
                school: { type: Type.STRING },
                subjectCode: { type: Type.STRING },
                topic: { type: Type.STRING },
                subtopics: { type: Type.STRING },
                yearGroup: { type: Type.STRING },
                duration: { type: Type.STRING },
                numberOfMeetings: { type: Type.INTEGER },
                teacher: { type: Type.STRING },
                principal: { type: Type.STRING },
              },
              required: [
                'school',
                'subjectCode',
                'topic',
                'subtopics',
                'yearGroup',
                'duration',
                'numberOfMeetings',
                'teacher',
                'principal',
              ],
            },
            learningObjectives: {
              type: Type.OBJECT,
              properties: {
                cambridgeAOs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Cambridge Assessment Objectives, e.g. AO1 & AO2',
                },
                walt: {
                  type: Type.STRING,
                  description: 'We Are Learning To statement',
                },
                wilf: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'What I am Looking For (measurable success criteria)',
                },
                slo: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Schoolwide Learner Outcomes (e.g. Critical Thinker, Tech-Empowered Problem Solver)',
                },
                clilLanguageObjectives: {
                  type: Type.OBJECT,
                  properties: {
                    keyLanguageFocus: { type: Type.STRING },
                    vocabularyList: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          englishTerm: { type: Type.STRING },
                          indonesianTerm: { type: Type.STRING },
                          definition: { type: Type.STRING },
                          exampleContext: { type: Type.STRING },
                        },
                        required: ['englishTerm', 'indonesianTerm', 'definition', 'exampleContext'],
                      },
                    },
                  },
                  required: ['keyLanguageFocus', 'vocabularyList'],
                },
              },
              required: ['cambridgeAOs', 'walt', 'wilf', 'slo', 'clilLanguageObjectives'],
            },
            differentiationProvisions: {
              type: Type.OBJECT,
              properties: {
                struggledScaffolding: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Concrete integer-based scaffolds, visual organizers, step-by-step cue sheets',
                },
                ealSupport: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Bilingual cue cards, vocabulary walls, English sentence frames',
                },
                senScaffolding: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Chunked instructions, reduced question density, high-contrast integer manipulative cards',
                },
                extensionTasks: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'High-achiever extension challenges with deeper modern scenario modeling',
                },
              },
              required: ['struggledScaffolding', 'ealSupport', 'senScaffolding', 'extensionTasks'],
            },
            lessonSequence: {
              type: Type.ARRAY,
              description: 'Array of meetings corresponding to the exact number of meetings requested',
              items: {
                type: Type.OBJECT,
                properties: {
                  meetingNumber: { type: Type.INTEGER },
                  focusTitle: { type: Type.STRING },
                  engage: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                    },
                    required: ['time', 'activity'],
                  },
                  explore: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                    },
                    required: ['time', 'activity'],
                  },
                  explain: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                    },
                    required: ['time', 'activity'],
                  },
                  elaborate: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                    },
                    required: ['time', 'activity'],
                  },
                  evaluate: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                    },
                    required: ['time', 'activity'],
                  },
                },
                required: ['meetingNumber', 'focusTitle', 'engage', 'explore', 'explain', 'elaborate', 'evaluate'],
              },
            },
            postLesson: {
              type: Type.OBJECT,
              properties: {
                formativeAssessment: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific integer-based formative checks used in class',
                },
                homeworkOrNextLesson: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Applicative homework task using modern context and preview for next lesson',
                },
                teacherReflectionPrompts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Guiding reflection questions with blank note space for the teacher after class',
                },
                resourceList: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Textbook chapters, online tools, manipulatives, digital worksheets',
                },
              },
              required: ['formativeAssessment', 'homeworkOrNextLesson', 'teacherReflectionPrompts', 'resourceList'],
            },
            approval: {
              type: Type.OBJECT,
              properties: {
                teacherName: { type: Type.STRING },
                hodName: { type: Type.STRING },
                principalName: { type: Type.STRING },
              },
              required: ['teacherName', 'hodName', 'principalName'],
            },
          },
          required: [
            'header',
            'learningObjectives',
            'differentiationProvisions',
            'lessonSequence',
            'postLesson',
            'approval',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No content received from Gemini.');
    }

    const lessonPlan = JSON.parse(text);
    return res.json({ success: true, lessonPlan });
  } catch (err: any) {
    console.error('Error generating lesson plan:', err);
    return res.status(500).json({
      error: err.message || 'Failed to generate lesson plan.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
