import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  History,
  FileCheck2,
  AlertTriangle,
  ArrowLeft,
  School,
  ExternalLink,
} from 'lucide-react';
import { IGCSELessonPlan, LessonPlanFormData } from './types/lessonPlan';
import { LessonForm } from './components/LessonForm';
import { LessonPlanView } from './components/LessonPlanView';
import { SAMPLE_LESSON_PLAN } from './data/samplePlan';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<IGCSELessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [history, setHistory] = useState<IGCSELessonPlan[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Load history from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem('semesta_igcse_lesson_plans');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not read history from localStorage', e);
    }
  }, []);

  const saveToHistory = (newPlan: IGCSELessonPlan) => {
    try {
      const planWithMeta: IGCSELessonPlan = {
        ...newPlan,
        id: newPlan.id || `plan_${Date.now()}`,
        createdAt: newPlan.createdAt || new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setHistory((prev) => {
        const updated = [planWithMeta, ...prev.filter((p) => p.header.topic !== planWithMeta.header.topic)].slice(0, 10);
        localStorage.setItem('semesta_igcse_lesson_plans', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn('Could not save to localStorage', err);
    }
  };

  const handleGenerate = async (formData: LessonPlanFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setGenerationStep('Contacting SEMESTA IGCSE Curriculum Engine...');

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev.includes('Contacting')) {
          return 'Applying WASC Initial Report standards & Cambridge Assessment Objectives...';
        }
        if (prev.includes('WASC Initial Report')) {
          return 'Enforcing middle-to-low academic scaffolding with integer arithmetic...';
        }
        if (prev.includes('middle-to-low')) {
          return 'Integrating modern relatable scenarios (gaming, social media, e-commerce)...';
        }
        if (prev.includes('relatable scenarios')) {
          return `Formulating 5E instructional phases across ${formData.meetingsCount} dynamic meetings...`;
        }
        if (prev.includes('5E instructional')) {
          return 'Generating English-Bahasa Indonesia CLIL vocabulary & LaTeX formulas...';
        }
        return 'Finalizing lesson plan sheet...';
      });
    }, 1600);

    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate lesson plan from backend.');
      }

      const generatedPlan: IGCSELessonPlan = data.lessonPlan;
      setCurrentPlan(generatedPlan);
      saveToHistory(generatedPlan);
    } catch (error: any) {
      clearInterval(stepInterval);
      console.error('Generation failure:', error);
      setErrorMessage(
        error.message || 'An unexpected error occurred while communicating with the server.'
      );
    } finally {
      setIsLoading(false);
      setGenerationStep('');
    }
  };

  const loadSamplePlan = () => {
    setCurrentPlan(SAMPLE_LESSON_PLAN);
    saveToHistory(SAMPLE_LESSON_PLAN);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <header className="no-print border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-700 text-white shadow-md shadow-blue-900/20">
              <School className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900">
                  SEMESTA SCHOOL
                </h1>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                  IGCSE 0580
                </span>
                <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  WASC Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Grade 10 Mathematics Lesson Plan Generator • Year 10 SMA
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            {currentPlan && (
              <button
                type="button"
                onClick={() => setCurrentPlan(null)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Back to Form</span>
                <span className="sm:hidden">Form</span>
              </button>
            )}

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900"
              >
                <History className="h-3.5 w-3.5 text-blue-600" />
                <span className="hidden sm:inline">Saved Plans ({history.length})</span>
                <span className="sm:hidden">({history.length})</span>
              </button>
            )}

            {!currentPlan && (
              <button
                type="button"
                onClick={loadSamplePlan}
                className="flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                <FileCheck2 className="h-3.5 w-3.5" />
                <span>View Sample Plan</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner (Only when on form view) */}
      {!currentPlan && (
        <div className="no-print border-b border-slate-200/80 bg-white px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-800 mb-3 shadow-xs">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Tailored for Middle-to-Low Academic Input • 100% Integer Arithmetic</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              IGCSE 0580 Grade 10 Math Lesson Plan Generator
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Auto-generate comprehensive, WASC-aligned lesson plans for <strong>Fitria Rakhmawati</strong> at <strong>SEMESTA SCHOOL</strong>. Equipped with 5E instructional sequences, modern real-world cases (gaming, algorithms, streaming, e-commerce), bilingual CLIL vocabulary, and LaTeX math rendering.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                Teacher: Fitria Rakhmawati
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                Principal: Ahmad Nurani, S.T., M.Pd.
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                Export: PDF &amp; Word (.docx)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Error notification */}
        {errorMessage && (
          <div className="no-print mx-auto max-w-4xl mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="font-bold text-rose-900">Generation Failed</div>
                <div className="text-rose-700 mt-0.5">{errorMessage}</div>
                <div className="mt-2 text-rose-600">
                  Tip: You can also click "View Sample Plan" in the top bar to inspect a fully populated lesson plan immediately.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="no-print mx-auto max-w-2xl my-12 rounded-3xl border border-blue-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Sparkles className="h-8 w-8 animate-pulse text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Generating Your IGCSE 0580 Lesson Plan</h3>
            <p className="mt-1 text-xs text-slate-500">
              Synthesizing pedagogy, 5E phases, and integer-constrained mathematical models...
            </p>

            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs font-medium text-blue-800 flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <span>{generationStep}</span>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500">
              <div className="rounded-lg bg-slate-50 p-2">✓ WASC Layout</div>
              <div className="rounded-lg bg-slate-50 p-2">✓ Integer Numbers</div>
              <div className="rounded-lg bg-slate-50 p-2">✓ 5E Sequences</div>
              <div className="rounded-lg bg-slate-50 p-2">✓ LaTeX Math</div>
            </div>
          </div>
        )}

        {/* Views: either Input Form or Generated Plan */}
        {!isLoading && (
          <>
            {currentPlan ? (
              <LessonPlanView
                plan={currentPlan}
                onModifyRequest={() => setCurrentPlan(null)}
              />
            ) : (
              <LessonForm onSubmit={handleGenerate} isLoading={isLoading} />
            )}
          </>
        )}
      </main>

      {/* History / Saved Plans Modal */}
      {showHistoryModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Saved Lesson Plans</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {history.map((plan, idx) => (
                <div
                  key={plan.id || idx}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:border-blue-400 hover:bg-blue-50/20 transition cursor-pointer"
                  onClick={() => {
                    setCurrentPlan(plan);
                    setShowHistoryModal(false);
                  }}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {plan.header.topic}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {plan.header.numberOfMeetings} Meetings ({plan.header.duration}) • {plan.header.yearGroup}
                    </div>
                    {plan.createdAt && (
                      <div className="text-[10px] text-slate-400">{plan.createdAt}</div>
                    )}
                  </div>
                  <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    Open
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center border-t border-slate-100 pt-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('semesta_igcse_lesson_plans');
                  setHistory([]);
                  setShowHistoryModal(false);
                }}
                className="text-rose-600 hover:underline"
              >
                Clear Saved Plans
              </button>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="no-print mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SEMESTA SCHOOL</span>
            <span>•</span>
            <span>Year 10 SMA Mathematics Department</span>
          </div>
          <div>
            Teacher: <span className="font-semibold text-slate-700">Fitria Rakhmawati</span> &nbsp;|&nbsp;
            Principal: <span className="font-semibold text-slate-700">Ahmad Nurani, S.T., M.Pd.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
