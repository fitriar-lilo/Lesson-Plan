import React, { useState } from 'react';
import {
  Download,
  FileText,
  Printer,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Users,
  Target,
  Clock,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { IGCSELessonPlan } from '../types/lessonPlan';
import { MathRenderer } from './MathRenderer';
import { exportToDocx } from '../utils/docxExport';
import { exportToPdf } from '../utils/pdfExport';

interface LessonPlanViewProps {
  plan: IGCSELessonPlan;
  onModifyRequest?: () => void;
}

export const LessonPlanView: React.FC<LessonPlanViewProps> = ({ plan, onModifyRequest }) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'sequence' | 'differentiation'>('all');
  const [expandedMeetings, setExpandedMeetings] = useState<Record<number, boolean>>(() => {
    const init: Record<number, boolean> = {};
    plan.lessonSequence.forEach((_, idx) => {
      init[idx] = true;
    });
    return init;
  });

  const toggleMeeting = (idx: number) => {
    setExpandedMeetings((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const cleanName = `IGCSE_0580_LessonPlan_${plan.header.topic.replace(/[^a-zA-Z0-9]/g, '_')}`;
      await exportToPdf('lesson-plan-printable-area', cleanName);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    try {
      await exportToDocx(plan);
    } catch (err) {
      console.error('DOCX generation error:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const markdown = `# SEMESTA SCHOOL (YEAR 10 SMA)
## CAMBRIDGE IGCSE MATHEMATICS 0580 — LESSON PLAN
- **Topic**: ${plan.header.topic}
- **Sub-topics**: ${plan.header.subtopics}
- **Year Group**: ${plan.header.yearGroup}
- **Duration**: ${plan.header.duration} (${plan.header.numberOfMeetings} Meetings)
- **Teacher**: ${plan.header.teacher}
- **Principal**: ${plan.header.principal}

### 1. LEARNING OBJECTIVES
- **Cambridge AOs**: ${plan.learningObjectives.cambridgeAOs.join('; ')}
- **WALT**: ${plan.learningObjectives.walt}
- **WILF**:
${plan.learningObjectives.wilf.map((w) => `  * ${w}`).join('\n')}
- **SLO**: ${plan.learningObjectives.slo.join('; ')}
- **Language Objectives (CLIL)**: ${plan.learningObjectives.clilLanguageObjectives.keyLanguageFocus}

### 2. DIFFERENTIATION PROVISIONS
- **Struggled Scaffolding**: ${plan.differentiationProvisions.struggledScaffolding.join('; ')}
- **EAL Support**: ${plan.differentiationProvisions.ealSupport.join('; ')}
- **SEN Scaffolding**: ${plan.differentiationProvisions.senScaffolding.join('; ')}
- **Extension Tasks**: ${plan.differentiationProvisions.extensionTasks.join('; ')}

### 3. LESSON SEQUENCE (5E MODEL)
${plan.lessonSequence
  .map(
    (m) => `#### Meeting ${m.meetingNumber}: ${m.focusTitle}
- **Engage (${m.engage.time})**: ${m.engage.activity}
- **Explore (${m.explore.time})**: ${m.explore.activity}
- **Explain (${m.explain.time})**: ${m.explain.activity}
- **Elaborate (${m.elaborate.time})**: ${m.elaborate.activity}
- **Evaluate (${m.evaluate.time})**: ${m.evaluate.activity}`
  )
  .join('\n\n')}

### 4. POST-LESSON
- **Formative Assessment**: ${plan.postLesson.formativeAssessment.join('; ')}
- **Homework / Next Lesson**: ${plan.postLesson.homeworkOrNextLesson.join('; ')}
- **Resources**: ${plan.postLesson.resourceList.join('; ')}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="no-print sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-3.5 shadow-lg shadow-slate-200/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                WASC Standard
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Integer Scaffolding Active
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-800">
              {plan.header.topic} ({plan.header.numberOfMeetings} Meetings)
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-red-500/25 transition-all hover:from-red-700 hover:to-rose-700 hover:shadow-lg disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isExportingPdf ? 'Exporting PDF...' : 'Download as PDF'}
          </button>

          {/* Download DOCX Button */}
          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-600/25 transition-all hover:from-blue-800 hover:to-indigo-800 hover:shadow-lg disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            {isExportingDocx ? 'Generating Word...' : 'Download as DOCX'}
          </button>

          {/* Print button */}
          <button
            type="button"
            onClick={handlePrint}
            title="Open browser print dialog"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Copy Markdown button */}
          <button
            type="button"
            onClick={handleCopyText}
            title="Copy as Markdown"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>

          {onModifyRequest && (
            <button
              type="button"
              onClick={onModifyRequest}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              <Sparkles className="h-4 w-4" />
              <span>New Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs for quick on-screen navigation */}
      <div className="no-print flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-medium text-slate-600">
        <span className="text-slate-400">View Mode:</span>
        <button
          onClick={() => setActiveTab('all')}
          className={`rounded-lg px-3 py-1.5 transition ${
            activeTab === 'all' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          Full Document (WASC Sheet)
        </button>
        <button
          onClick={() => setActiveTab('sequence')}
          className={`rounded-lg px-3 py-1.5 transition ${
            activeTab === 'sequence' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          5E Lesson Sequences ({plan.lessonSequence.length})
        </button>
        <button
          onClick={() => setActiveTab('differentiation')}
          className={`rounded-lg px-3 py-1.5 transition ${
            activeTab === 'differentiation' ? 'bg-slate-800 text-white font-semibold shadow-sm' : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          Scaffolding & Differentiation
        </button>
      </div>

      {/* Main Printable Document Sheet (Styled with Comfortaa font, 11pt, line-height 1.25) */}
      <div
        id="lesson-plan-printable-area"
        className="lesson-plan-document mx-auto max-w-4xl rounded-2xl border border-slate-300 bg-white p-6 sm:p-10 shadow-xl transition-all"
        style={{
          fontFamily: "'Comfortaa', cursive, sans-serif",
          fontSize: '11pt',
          lineHeight: '1.25',
          color: '#1e293b',
        }}
      >
        {/* ============================================================== */}
        {/* HEADER SECTION                                                */}
        {/* ============================================================== */}
        <div className="border-b-2 border-blue-900 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-center sm:text-left">
            <div>
              <div className="text-xl font-bold tracking-tight text-blue-950 uppercase">
                {plan.header.school}
              </div>
              <div className="text-sm font-semibold text-blue-800 tracking-wide uppercase">
                {plan.header.subjectCode} — LESSON PLAN (WASC INITIAL REPORT STANDARD)
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs text-blue-900 font-medium">
              <div>Year Group: <span className="font-bold">{plan.header.yearGroup}</span></div>
              <div>Duration: <span className="font-bold">{plan.header.duration}</span> ({plan.header.numberOfMeetings} Meetings)</div>
            </div>
          </div>

          {/* Metadata Table */}
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-300">
            <table className="w-full text-left text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-36 bg-slate-100 px-3 py-2 font-bold text-slate-800 border-r border-slate-300">
                    Topic
                  </td>
                  <td className="px-3 py-2 font-semibold text-slate-900">
                    <MathRenderer text={plan.header.topic} />
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-r border-slate-300">
                    Sub-topics
                  </td>
                  <td className="px-3 py-2 text-slate-800">
                    <MathRenderer text={plan.header.subtopics} />
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-r border-slate-300">
                    Teacher & Principal
                  </td>
                  <td className="px-3 py-2 text-slate-800">
                    <span className="font-semibold">Teacher:</span> {plan.header.teacher} &nbsp;|&nbsp;{' '}
                    <span className="font-semibold">Principal:</span> {plan.header.principal}
                  </td>
                </tr>
                <tr>
                  <td className="bg-slate-100 px-3 py-2 font-bold text-slate-800 border-r border-slate-300">
                    Target Academic Profile
                  </td>
                  <td className="px-3 py-2 text-slate-700 italic">
                    Middle-to-low academic input scaffolding; cognitive load reduced with integer-only arithmetic and relatable real-world contexts.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 1: LEARNING OBJECTIVES                                */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'differentiation') && (
          <section className="mt-6">
            <div className="flex items-center gap-2 border-b border-blue-900/30 pb-1.5 text-blue-900 font-bold text-sm uppercase">
              <Target className="h-4 w-4" />
              <span>1. Learning Objectives</span>
            </div>

            <div className="mt-3 space-y-3">
              {/* Cambridge AOs */}
              <div>
                <span className="font-bold text-slate-900">Cambridge AOs:</span>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-800">
                  {plan.learningObjectives.cambridgeAOs.map((ao, i) => (
                    <li key={i}>
                      <MathRenderer text={ao} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* WALT */}
              <div className="rounded-lg bg-blue-50/70 p-3 border border-blue-200/80">
                <span className="font-bold text-blue-950">WALT (We Are Learning To):</span>{' '}
                <span className="text-blue-900">
                  <MathRenderer text={plan.learningObjectives.walt} />
                </span>
              </div>

              {/* WILF */}
              <div>
                <span className="font-bold text-slate-900">WILF (What I'm Looking For — Success Criteria):</span>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-800">
                  {plan.learningObjectives.wilf.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* SLO */}
              <div>
                <span className="font-bold text-slate-900">SLO (Schoolwide Learner Outcomes):</span>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-800">
                  {plan.learningObjectives.slo.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* CLIL & Vocabulary Support */}
              <div className="mt-4">
                <div className="font-bold text-slate-900">
                  Language Objectives (CLIL Bilingual English — Bahasa Indonesia):
                </div>
                <div className="text-xs text-slate-600 mb-2 italic">
                  Key Focus: {plan.learningObjectives.clilLanguageObjectives.keyLanguageFocus}
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-300">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                        <th className="px-3 py-2 font-bold border-r border-slate-300 w-1/4">English Term</th>
                        <th className="px-3 py-2 font-bold border-r border-slate-300 w-1/4">Bahasa Indonesia</th>
                        <th className="px-3 py-2 font-bold">Definition &amp; Relatable Context</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.learningObjectives.clilLanguageObjectives.vocabularyList.map((item, idx) => (
                        <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                          <td className="px-3 py-1.5 font-bold text-slate-900 border-r border-slate-200">
                            {item.englishTerm}
                          </td>
                          <td className="px-3 py-1.5 text-slate-800 border-r border-slate-200 font-medium">
                            {item.indonesianTerm}
                          </td>
                          <td className="px-3 py-1.5 text-slate-700">
                            {item.definition} <span className="text-slate-500">({item.exampleContext})</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: DIFFERENTIATION PROVISIONS                         */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'differentiation') && (
          <section className="mt-6">
            <div className="flex items-center gap-2 border-b border-blue-900/30 pb-1.5 text-blue-900 font-bold text-sm uppercase">
              <Users className="h-4 w-4" />
              <span>2. Differentiation Provisions</span>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {/* Struggled Scaffolding */}
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  Struggled Scaffolding (Integer-Based Supports)
                </div>
                <ul className="mt-2 list-disc pl-4 space-y-1 text-amber-900">
                  {plan.differentiationProvisions.struggledScaffolding.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* EAL Support */}
              <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-3">
                <div className="font-bold text-teal-950 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-teal-500"></span>
                  EAL Support (Bilingual Scaffolds)
                </div>
                <ul className="mt-2 list-disc pl-4 space-y-1 text-teal-900">
                  {plan.differentiationProvisions.ealSupport.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* SEN Scaffolding */}
              <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-3">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                  SEN Scaffolding (Cognitive Chunking)
                </div>
                <ul className="mt-2 list-disc pl-4 space-y-1 text-indigo-900">
                  {plan.differentiationProvisions.senScaffolding.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Extension Tasks */}
              <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-3">
                <div className="font-bold text-purple-950 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                  Extension Tasks (High-Achieving Students)
                </div>
                <ul className="mt-2 list-disc pl-4 space-y-1 text-purple-900">
                  {plan.differentiationProvisions.extensionTasks.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: LESSON SEQUENCE — 5E INSTRUCTIONAL MODEL           */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'sequence') && (
          <section className="mt-6">
            <div className="flex items-center justify-between border-b border-blue-900/30 pb-1.5 text-blue-900 font-bold text-sm uppercase">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>3. Lesson Sequence — 5E Instructional Model ({plan.lessonSequence.length} Meetings)</span>
              </div>
              <span className="no-print text-xs font-normal text-slate-500 lowercase">
                Target: {plan.header.duration}/meeting
              </span>
            </div>

            <div className="mt-4 space-y-6">
              {plan.lessonSequence.map((meeting, mIdx) => {
                const isExpanded = expandedMeetings[mIdx] ?? true;

                return (
                  <div key={mIdx} className="rounded-xl border border-slate-300 overflow-hidden shadow-sm">
                    {/* Meeting header bar */}
                    <div
                      onClick={() => toggleMeeting(mIdx)}
                      className="flex cursor-pointer items-center justify-between bg-slate-100 px-4 py-2.5 font-bold text-slate-900 transition hover:bg-slate-200/80"
                    >
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-blue-700 px-2 py-0.5 text-xs text-white">
                          Meeting {meeting.meetingNumber}
                        </span>
                        <span className="text-sm text-blue-950 font-bold">
                          {meeting.focusTitle}
                        </span>
                      </div>
                      <div className="no-print flex items-center gap-1 text-slate-500 text-xs">
                        <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>

                    {/* 5E Table */}
                    {isExpanded && (
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 border-y border-slate-300">
                            <th className="px-3 py-2 font-bold w-24 border-r border-slate-300">Phase</th>
                            <th className="px-3 py-2 font-bold w-20 border-r border-slate-300 text-center">Time</th>
                            <th className="px-3 py-2 font-bold">Teacher &amp; Student Activities (Modern Relatable Context &amp; Integer Math)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {/* Engage */}
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-3 py-2.5 font-bold text-blue-900 border-r border-slate-300 align-top">
                              Engage
                            </td>
                            <td className="px-3 py-2.5 text-slate-600 border-r border-slate-300 text-center align-top whitespace-nowrap">
                              {meeting.engage.time}
                            </td>
                            <td className="px-3 py-2.5 text-slate-800 leading-snug">
                              <MathRenderer text={meeting.engage.activity} />
                            </td>
                          </tr>

                          {/* Explore */}
                          <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                            <td className="px-3 py-2.5 font-bold text-emerald-900 border-r border-slate-300 align-top">
                              Explore
                            </td>
                            <td className="px-3 py-2.5 text-slate-600 border-r border-slate-300 text-center align-top whitespace-nowrap">
                              {meeting.explore.time}
                            </td>
                            <td className="px-3 py-2.5 text-slate-800 leading-snug">
                              <MathRenderer text={meeting.explore.activity} />
                            </td>
                          </tr>

                          {/* Explain */}
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-3 py-2.5 font-bold text-indigo-900 border-r border-slate-300 align-top">
                              Explain
                            </td>
                            <td className="px-3 py-2.5 text-slate-600 border-r border-slate-300 text-center align-top whitespace-nowrap">
                              {meeting.explain.time}
                            </td>
                            <td className="px-3 py-2.5 text-slate-800 leading-snug">
                              <MathRenderer text={meeting.explain.activity} />
                            </td>
                          </tr>

                          {/* Elaborate */}
                          <tr className="hover:bg-slate-50/50 bg-slate-50/30">
                            <td className="px-3 py-2.5 font-bold text-amber-900 border-r border-slate-300 align-top">
                              Elaborate
                            </td>
                            <td className="px-3 py-2.5 text-slate-600 border-r border-slate-300 text-center align-top whitespace-nowrap">
                              {meeting.elaborate.time}
                            </td>
                            <td className="px-3 py-2.5 text-slate-800 leading-snug">
                              <MathRenderer text={meeting.elaborate.activity} />
                            </td>
                          </tr>

                          {/* Evaluate */}
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-3 py-2.5 font-bold text-rose-900 border-r border-slate-300 align-top">
                              Evaluate
                            </td>
                            <td className="px-3 py-2.5 text-slate-600 border-r border-slate-300 text-center align-top whitespace-nowrap">
                              {meeting.evaluate.time}
                            </td>
                            <td className="px-3 py-2.5 text-slate-800 leading-snug">
                              <MathRenderer text={meeting.evaluate.activity} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SECTION 4: POST-LESSON                                        */}
        {/* ============================================================== */}
        {(activeTab === 'all' || activeTab === 'differentiation') && (
          <section className="mt-6">
            <div className="flex items-center gap-2 border-b border-blue-900/30 pb-1.5 text-blue-900 font-bold text-sm uppercase">
              <Clock className="h-4 w-4" />
              <span>4. Post-Lesson &amp; Assessment</span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              {/* Formative assessment */}
              <div>
                <span className="font-bold text-slate-900">Formative Assessment (In-Class Checks):</span>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-800">
                  {plan.postLesson.formativeAssessment.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Homework / Next Lesson */}
              <div>
                <span className="font-bold text-slate-900">Homework &amp; Next Lesson Preview:</span>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-800">
                  {plan.postLesson.homeworkOrNextLesson.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resource list */}
              <div>
                <span className="font-bold text-slate-900">Resource List &amp; Digital Tools:</span>
                <ul className="mt-1 list-disc pl-5 space-y-1 text-slate-800">
                  {plan.postLesson.resourceList.map((item, i) => (
                    <li key={i}>
                      <MathRenderer text={item} />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Teacher Reflection Prompts (With printed writing blank lines) */}
              <div className="mt-4 rounded-xl border border-slate-300 bg-slate-50/50 p-4">
                <span className="font-bold text-slate-900 block mb-2">
                  Teacher Post-Lesson Reflection (For Post-Class Completion):
                </span>
                <div className="space-y-4">
                  {plan.postLesson.teacherReflectionPrompts.map((prompt, i) => (
                    <div key={i} className="text-slate-800">
                      <div className="font-medium text-slate-800 mb-1">
                        • {prompt}
                      </div>
                      <div className="space-y-1.5 pl-3">
                        <div className="border-b border-dashed border-slate-400 h-4 w-full"></div>
                        <div className="border-b border-dashed border-slate-400 h-4 w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* SECTION 5: APPROVAL / SIGNATURES                              */}
        {/* ============================================================== */}
        <section className="mt-8 border-t-2 border-slate-300 pt-4">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm uppercase mb-3">
            <Award className="h-4 w-4" />
            <span>5. Approval &amp; Institutional Signatures</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
            {/* Subject Teacher */}
            <div className="rounded-xl border border-slate-300 p-4 bg-white flex flex-col justify-between h-40">
              <div className="font-bold text-slate-700">Subject Teacher</div>
              <div className="my-auto">
                <div className="mx-auto w-32 border-b border-slate-400 pt-8"></div>
              </div>
              <div>
                <div className="font-bold text-slate-900">{plan.approval.teacherName}</div>
                <div className="text-[10px] text-slate-500">Teacher of Mathematics (SMA)</div>
              </div>
            </div>

            {/* HoD */}
            <div className="rounded-xl border border-slate-300 p-4 bg-white flex flex-col justify-between h-40">
              <div className="font-bold text-slate-700">Head of Department (HoD)</div>
              <div className="my-auto">
                <div className="mx-auto w-32 border-b border-slate-400 pt-8"></div>
              </div>
              <div>
                <div className="font-bold text-slate-900">{plan.approval.hodName || '(                               )'}</div>
                <div className="text-[10px] text-slate-500">HoD Mathematics &amp; Sciences</div>
              </div>
            </div>

            {/* Principal */}
            <div className="rounded-xl border border-slate-300 p-4 bg-white flex flex-col justify-between h-40">
              <div className="font-bold text-slate-700">School Principal</div>
              <div className="my-auto">
                <div className="mx-auto w-32 border-b border-slate-400 pt-8"></div>
              </div>
              <div>
                <div className="font-bold text-slate-900">{plan.approval.principalName}</div>
                <div className="text-[10px] text-slate-500">Principal, SEMESTA SCHOOL</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-6 border-t border-slate-200 pt-2 text-center text-[10px] text-slate-400">
          SEMESTA SCHOOL SEMARANG • CAMBRIDGE ASSESSMENT INTERNATIONAL EDUCATION (0580) • WASC ACCREDITED
        </div>
      </div>
    </div>
  );
};
