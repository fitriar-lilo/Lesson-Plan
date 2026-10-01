import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  AlignmentType,
  Packer,
  ShadingType,
} from 'docx';
import { IGCSELessonPlan } from '../types/lessonPlan';

// Helper to strip LaTeX delimiters ($...$) for cleaner raw text in Word doc
function cleanMathForDocx(text: string): string {
  if (!text) return '';
  return text.replace(/\$\$([^$]+)\$\$/g, '$1').replace(/\$([^$]+)\$/g, '$1');
}

export async function exportToDocx(plan: IGCSELessonPlan, filename?: string): Promise<void> {
  const primaryColor = '1E3A8A'; // Navy blue
  const accentBg = 'F1F5F9'; // Light slate
  const borderColor = 'CBD5E1';

  const cellBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
    left: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
    right: { style: BorderStyle.SINGLE, size: 1, color: borderColor },
  };

  const createSectionHeader = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 24, // 12pt
          color: primaryColor,
          font: 'Calibri',
        }),
      ],
    });
  };

  const createBullet = (label: string, value: string) => {
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 60, after: 60 },
      children: [
        new TextRun({ text: `${label}: `, bold: true, font: 'Calibri', size: 22 }),
        new TextRun({ text: cleanMathForDocx(value), font: 'Calibri', size: 22 }),
      ],
    });
  };

  const doc = new Document({
    creator: 'SEMESTA SCHOOL IGCSE Math Department',
    title: `Lesson Plan - ${plan.header.topic}`,
    description: 'WASC-aligned IGCSE 0580 Grade 10 Lesson Plan',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // MAIN HEADER
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: 'SEMESTA SCHOOL (YEAR 10 SMA)',
                bold: true,
                size: 28, // 14pt
                color: primaryColor,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 160 },
            children: [
              new TextRun({
                text: 'CAMBRIDGE IGCSE MATHEMATICS 0580 — LESSON PLAN',
                bold: true,
                size: 22,
                color: '475569',
                font: 'Calibri',
              }),
            ],
          }),

          // METADATA TABLE
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    borders: cellBorder,
                    shading: { fill: accentBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Topic', bold: true, font: 'Calibri' })] })],
                  }),
                  new TableCell({
                    width: { size: 80, type: WidthType.PERCENTAGE },
                    borders: cellBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: cleanMathForDocx(plan.header.topic), font: 'Calibri' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: accentBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Sub-topics', bold: true, font: 'Calibri' })] })],
                  }),
                  new TableCell({
                    borders: cellBorder,
                    children: [new Paragraph({ children: [new TextRun({ text: cleanMathForDocx(plan.header.subtopics), font: 'Calibri' })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: accentBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Year Group', bold: true, font: 'Calibri' })] })],
                  }),
                  new TableCell({
                    borders: cellBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${plan.header.yearGroup}  |  Duration: ${plan.header.duration}  |  Total Meetings: ${plan.header.numberOfMeetings}`, font: 'Calibri' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: accentBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Teacher / Principal', bold: true, font: 'Calibri' })] })],
                  }),
                  new TableCell({
                    borders: cellBorder,
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `Teacher: ${plan.header.teacher}   |   Principal: ${plan.header.principal}`, font: 'Calibri' }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // SECTION 1: LEARNING OBJECTIVES
          createSectionHeader('1. LEARNING OBJECTIVES (WASC STANDARD)'),
          ...plan.learningObjectives.cambridgeAOs.map((ao) => createBullet('Cambridge AO', ao)),
          new Paragraph({
            spacing: { before: 80, after: 60 },
            children: [
              new TextRun({ text: 'WALT (We Are Learning To): ', bold: true, font: 'Calibri', size: 22 }),
              new TextRun({ text: cleanMathForDocx(plan.learningObjectives.walt), font: 'Calibri', size: 22 }),
            ],
          }),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'WILF (What I am Looking For - Success Criteria):', bold: true, font: 'Calibri', size: 22 })],
          }),
          ...plan.learningObjectives.wilf.map((item) => new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 40 },
            children: [new TextRun({ text: cleanMathForDocx(item), font: 'Calibri', size: 22 })],
          })),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'SLO (Schoolwide Learner Outcomes):', bold: true, font: 'Calibri', size: 22 })],
          }),
          ...plan.learningObjectives.slo.map((item) => new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 40 },
            children: [new TextRun({ text: item, font: 'Calibri', size: 22 })],
          })),

          // CLIL VOCABULARY TABLE
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({ text: 'Language Objectives (CLIL Bilingual English - Bahasa Indonesia): ', bold: true, font: 'Calibri', size: 22 }),
              new TextRun({ text: plan.learningObjectives.clilLanguageObjectives.keyLanguageFocus, font: 'Calibri', size: 22 }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: accentBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'English Term', bold: true, font: 'Calibri' })] })],
                  }),
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: accentBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Bahasa Indonesia', bold: true, font: 'Calibri' })] })],
                  }),
                  new TableCell({
                    borders: cellBorder,
                    shading: { fill: accentBg, type: ShadingType.CLEAR },
                    children: [new Paragraph({ children: [new TextRun({ text: 'Definition & Pedagogical Context', bold: true, font: 'Calibri' })] })],
                  }),
                ],
              }),
              ...plan.learningObjectives.clilLanguageObjectives.vocabularyList.map(
                (vocab) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        borders: cellBorder,
                        children: [new Paragraph({ children: [new TextRun({ text: vocab.englishTerm, bold: true, font: 'Calibri' })] })],
                      }),
                      new TableCell({
                        borders: cellBorder,
                        children: [new Paragraph({ children: [new TextRun({ text: vocab.indonesianTerm, font: 'Calibri' })] })],
                      }),
                      new TableCell({
                        borders: cellBorder,
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: `${vocab.definition} (${vocab.exampleContext})`, font: 'Calibri' }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // SECTION 2: DIFFERENTIATION
          createSectionHeader('2. DIFFERENTIATION PROVISIONS'),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'Struggled Scaffolding (Integer-based concrete support):', bold: true, font: 'Calibri' })],
          }),
          ...plan.differentiationProvisions.struggledScaffolding.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: cleanMathForDocx(item), font: 'Calibri' })],
          })),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'EAL Support (Bilingual & Visual aids):', bold: true, font: 'Calibri' })],
          }),
          ...plan.differentiationProvisions.ealSupport.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: item, font: 'Calibri' })],
          })),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'SEN Scaffolding (Chunked & Reduced cognitive load):', bold: true, font: 'Calibri' })],
          }),
          ...plan.differentiationProvisions.senScaffolding.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: item, font: 'Calibri' })],
          })),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'Extension Tasks (High-achieving students):', bold: true, font: 'Calibri' })],
          }),
          ...plan.differentiationProvisions.extensionTasks.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: cleanMathForDocx(item), font: 'Calibri' })],
          })),

          // SECTION 3: LESSON SEQUENCE — 5E INSTRUCTIONAL MODEL
          createSectionHeader(`3. LESSON SEQUENCE — 5E INSTRUCTIONAL MODEL (${plan.lessonSequence.length} MEETINGS)`),
          ...plan.lessonSequence.flatMap((meeting) => [
            new Paragraph({
              spacing: { before: 180, after: 80 },
              children: [
                new TextRun({
                  text: `Meeting ${meeting.meetingNumber}: ${meeting.focusTitle}`,
                  bold: true,
                  size: 24,
                  color: primaryColor,
                  font: 'Calibri',
                }),
              ],
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 15, type: WidthType.PERCENTAGE },
                      borders: cellBorder,
                      shading: { fill: accentBg, type: ShadingType.CLEAR },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Phase', bold: true, font: 'Calibri' })] })],
                    }),
                    new TableCell({
                      width: { size: 15, type: WidthType.PERCENTAGE },
                      borders: cellBorder,
                      shading: { fill: accentBg, type: ShadingType.CLEAR },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Time', bold: true, font: 'Calibri' })] })],
                    }),
                    new TableCell({
                      width: { size: 70, type: WidthType.PERCENTAGE },
                      borders: cellBorder,
                      shading: { fill: accentBg, type: ShadingType.CLEAR },
                      children: [new Paragraph({ children: [new TextRun({ text: 'Teacher & Student Activities (Modern Relatable Context)', bold: true, font: 'Calibri' })] })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Engage', bold: true, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: meeting.engage.time, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: cleanMathForDocx(meeting.engage.activity), font: 'Calibri' })] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Explore', bold: true, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: meeting.explore.time, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: cleanMathForDocx(meeting.explore.activity), font: 'Calibri' })] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Explain', bold: true, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: meeting.explain.time, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: cleanMathForDocx(meeting.explain.activity), font: 'Calibri' })] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Elaborate', bold: true, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: meeting.elaborate.time, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: cleanMathForDocx(meeting.elaborate.activity), font: 'Calibri' })] })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: 'Evaluate', bold: true, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: meeting.evaluate.time, font: 'Calibri' })] })] }),
                    new TableCell({ borders: cellBorder, children: [new Paragraph({ children: [new TextRun({ text: cleanMathForDocx(meeting.evaluate.activity), font: 'Calibri' })] })] }),
                  ],
                }),
              ],
            }),
          ]),

          // SECTION 4: POST-LESSON
          createSectionHeader('4. POST-LESSON & ASSESSMENT'),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'Formative Assessment (in class):', bold: true, font: 'Calibri' })],
          }),
          ...plan.postLesson.formativeAssessment.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: cleanMathForDocx(item), font: 'Calibri' })],
          })),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'Homework / Next Lesson Preview:', bold: true, font: 'Calibri' })],
          }),
          ...plan.postLesson.homeworkOrNextLesson.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: cleanMathForDocx(item), font: 'Calibri' })],
          })),
          new Paragraph({
            spacing: { before: 60, after: 40 },
            children: [new TextRun({ text: 'Resource List & Tools:', bold: true, font: 'Calibri' })],
          }),
          ...plan.postLesson.resourceList.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: item, font: 'Calibri' })],
          })),
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [new TextRun({ text: 'Teacher Post-Lesson Reflection (Fill in after class):', bold: true, font: 'Calibri' })],
          }),
          ...plan.postLesson.teacherReflectionPrompts.map((item) => new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: `${item}\nNotes: _____________________________________________________________________\n___________________________________________________________________________`, font: 'Calibri' })],
          })),

          // SECTION 5: APPROVAL / SIGNATURES
          createSectionHeader('5. APPROVAL / SIGNATURES'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    borders: cellBorder,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Subject Teacher', bold: true, font: 'Calibri' })] }),
                      new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: '____________________' })] }),
                      new Paragraph({ children: [new TextRun({ text: plan.approval.teacherName, bold: true, font: 'Calibri' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Teacher of Mathematics', font: 'Calibri', size: 18 })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 33, type: WidthType.PERCENTAGE },
                    borders: cellBorder,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'Head of Department (HoD)', bold: true, font: 'Calibri' })] }),
                      new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: '____________________' })] }),
                      new Paragraph({ children: [new TextRun({ text: '(                      )', bold: true, font: 'Calibri' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'HoD Mathematics', font: 'Calibri', size: 18 })] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 34, type: WidthType.PERCENTAGE },
                    borders: cellBorder,
                    children: [
                      new Paragraph({ children: [new TextRun({ text: 'School Principal', bold: true, font: 'Calibri' })] }),
                      new Paragraph({ spacing: { before: 400 }, children: [new TextRun({ text: '____________________' })] }),
                      new Paragraph({ children: [new TextRun({ text: plan.approval.principalName, bold: true, font: 'Calibri' })] }),
                      new Paragraph({ children: [new TextRun({ text: 'Principal, SEMESTA SCHOOL', font: 'Calibri', size: 18 })] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `Lesson_Plan_IGCSE_0580_${plan.header.topic.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
