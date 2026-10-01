import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  Flame,
} from 'lucide-react';
import { LessonPlanFormData } from '../types/lessonPlan';

interface LessonFormProps {
  onSubmit: (data: LessonPlanFormData) => void;
  isLoading: boolean;
}

const PRESETS: Array<{
  name: string;
  badge: string;
  topic: string;
  subtopics: string;
  objective: string;
  method: string;
  duration: string;
  meetings: number;
}> = [
  {
    name: 'Linear Equations & Social Media',
    badge: 'Popular',
    topic: 'Linear Equations in One Variable (IGCSE 0580 C2.1/E2.1)',
    subtopics: 'Solving two-step linear equations, expanding brackets, integer modeling of follower growth',
    objective:
      'Students will be able to formulate and solve two-step linear equations with integer coefficients to model Instagram follower milestones and streaming revenue.',
    method: '5E Instructional Model',
    duration: '80 mins',
    meetings: 2,
  },
  {
    name: 'Percentages & E-Commerce Discounts',
    badge: 'Real-World',
    topic: 'Percentages & Financial Mathematics (IGCSE 0580 C1.12/E1.12)',
    subtopics: 'Percentage discounts, reverse percentage, successive discounts in flash sales',
    objective:
      'Students will calculate exact discounted prices and find original costs using integer-friendly pricing schemes during Shopee and Tokopedia 11.11 flash campaigns.',
    method: '5E Instructional Model',
    duration: '80 mins',
    meetings: 3,
  },
  {
    name: 'Probability & Gaming Loot Boxes',
    badge: 'Gamified',
    topic: 'Probability & Sample Spaces (IGCSE 0580 C8.1/E8.1)',
    subtopics: 'Single event probability, sample space diagrams, expected integer frequency in gaming pulls',
    objective:
      'Students will understand theoretical vs experimental probability and calculate integer outcomes of character pulls in Mobile Legends and Genshin Impact.',
    method: 'Discovery Learning',
    duration: '80 mins',
    meetings: 2,
  },
  {
    name: 'Pythagoras Theorem & Drone Flight',
    badge: 'STEM',
    topic: 'Pythagoras Theorem & Distance in 2D (IGCSE 0580 C4.7/E4.7)',
    subtopics: 'Pythagorean triples (3-4-5, 5-12-13, 8-15-17), finding hypotenuse and leg lengths with clean integer coordinates',
    objective:
      'Students will apply Pythagoras theorem using integer Pythagorean triples to calculate direct flight paths and battery ranges for urban delivery drones.',
    method: 'Problem-Based Learning',
    duration: '80 mins',
    meetings: 1,
  },
];

export const LessonForm: React.FC<LessonFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('Linear Equations in One Variable');
  const [subtopics, setSubtopics] = useState('Solving two-step linear equations with brackets, integer modeling');
  const [objective, setObjective] = useState(
    'Students will be able to construct and solve two-step linear equations involving integer terms and apply them to relatable social media follower growth scenarios.'
  );
  const [teachingMethod, setTeachingMethod] = useState('5E Instructional Model');
  const [duration, setDuration] = useState('80 mins');
  const [meetingsCount, setMeetingsCount] = useState<number>(2);
  const [validationError, setValidationError] = useState<string | null>(null);

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setTopic(preset.topic);
    setSubtopics(preset.subtopics);
    setObjective(preset.objective);
    setTeachingMethod(preset.method);
    setDuration(preset.duration);
    setMeetingsCount(preset.meetings);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setValidationError('Please enter a lesson topic.');
      return;
    }
    if (!subtopics.trim()) {
      setValidationError('Please specify sub-topics.');
      return;
    }
    if (meetingsCount < 1 || meetingsCount > 8) {
      setValidationError('Number of meetings should be between 1 and 8.');
      return;
    }

    setValidationError(null);
    onSubmit({
      topic: topic.trim(),
      subtopics: subtopics.trim(),
      objective: objective.trim(),
      teachingMethod: teachingMethod.trim(),
      duration: duration.trim(),
      meetingsCount: Number(meetingsCount),
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Preset Quick Fill Pills */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-900">
            <Flame className="h-4 w-4 text-amber-500" />
            <span>Quick-Start Relatable Presets</span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">Click to pre-fill form</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              disabled={isLoading}
              className="flex flex-col items-start justify-between rounded-xl border border-slate-200/90 bg-white p-3 text-left shadow-sm transition hover:border-blue-400 hover:shadow-md hover:bg-blue-50/20 active:scale-[0.99] disabled:opacity-50"
            >
              <div className="flex w-full items-center justify-between gap-1 mb-1">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                  {p.meetings} Mtg{p.meetings > 1 ? 's' : ''}
                </span>
                <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                  {p.badge}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800 line-clamp-1">{p.name}</div>
              <div className="mt-1 text-[11px] text-slate-500 line-clamp-2">{p.subtopics}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/60">
        <div className="border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Lesson Plan Configuration
              </h2>
              <p className="text-xs text-slate-500">
                WASC Standard • IGCSE 0580 • SEMESTA SCHOOL (Year 10 SMA) • Fitria Rakhmawati
              </p>
            </div>
          </div>
        </div>

        {validationError && (
          <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Topic <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Linear Equations in One Variable"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
              disabled={isLoading}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Cambridge IGCSE 0580 topic name or chapter title.
            </p>
          </div>

          {/* Row 2: Sub-topics */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Sub-topics <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={subtopics}
              onChange={(e) => setSubtopics(e.target.value)}
              placeholder="e.g., Solving two-step equations, expanding brackets, integer modeling"
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
              disabled={isLoading}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Specific syllabus skills or sub-themes covered across the meetings.
            </p>
          </div>

          {/* Row 3: Objective */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Objective (Learning Goals)
            </label>
            <textarea
              rows={3}
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe the desired learning outcomes, real-world context, or specific challenges to address..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition resize-none"
              disabled={isLoading}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              The AI will automatically structure this into Cambridge AOs, WALT, WILF, SLO, and CLIL objectives.
            </p>
          </div>

          {/* Row 4: Teaching Method, Duration, Number of Meetings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Teaching Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teaching Method
              </label>
              <select
                value={teachingMethod}
                onChange={(e) => setTeachingMethod(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
              >
                <option value="5E Instructional Model">5E Instructional Model (Engage-Explore-Explain-Elaborate-Evaluate)</option>
                <option value="Discovery Learning">Discovery Learning</option>
                <option value="Problem-Based Learning (PBL)">Problem-Based Learning (PBL)</option>
                <option value="Concrete-Pictorial-Abstract (CPA)">Concrete-Pictorial-Abstract (CPA)</option>
                <option value="Guided Inquiry & Modeling">Guided Inquiry &amp; Modeling</option>
                <option value="Flipped Classroom with Peer Instruction">Flipped Classroom with Peer Instruction</option>
              </select>
            </div>

            {/* One Session Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Session Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
              >
                <option value="40 mins">40 mins (Single Period)</option>
                <option value="60 mins">60 mins (Standard Period)</option>
                <option value="80 mins">80 mins (Double Period - Recommended)</option>
                <option value="90 mins">90 mins (Block Schedule)</option>
                <option value="100 mins">100 mins (Extended Double)</option>
              </select>
            </div>

            {/* Number of Meetings */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Number of Meetings
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={meetingsCount}
                  onChange={(e) => setMeetingsCount(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition font-semibold"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 pointer-events-none">
                  Meeting{meetingsCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Pedagogical Guarantees Callout */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-950 space-y-1">
                <p className="font-bold text-emerald-900">
                  Built-in Pedagogical Guarantees for Middle-to-Low Academic Input:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-emerald-800">
                  <div>• <strong>Integer Numbers Only:</strong> Eliminates arithmetic frustration so students focus on conceptual mastery.</div>
                  <div>• <strong>Modern Relatable Cases:</strong> Algorithms, gaming loot/levels, TikTok views, e-commerce flash sales.</div>
                  <div>• <strong>Full LaTeX Rendering:</strong> All formulas formatted in mathematical notation.</div>
                  <div>• <strong>WASC Standard Format:</strong> Exact SEMESTA SCHOOL header, CLIL table, and approval signatures.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/30 transition-all hover:from-blue-800 hover:via-indigo-800 hover:to-blue-900 hover:shadow-2xl hover:scale-[1.005] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Generating WASC Lesson Plan for {meetingsCount} Meeting{meetingsCount > 1 ? 's' : ''}...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <span>Generate Complete IGCSE 0580 Lesson Plan</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              Generates dynamic 5E meetings with Engage, Explore, Explain, Elaborate, and Evaluate.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
