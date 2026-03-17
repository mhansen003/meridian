'use client';

import { useState, useEffect } from 'react';
import { LogOut, Loader2, CheckCircle2 } from 'lucide-react';

interface ExitResponse {
  question: string;
  answer: string;
}

interface AnonymizedInterview {
  id: string;
  department: string;
  tenureYears: number;
  knowledgeExtract: string;
  submittedAt: string;
}

const QUESTIONS = [
  'What role and department are you leaving?',
  'How many years were you with the organization?',
  'What are the 2-3 most important things you learned?',
  'What challenges went unresolved during your time here?',
  'What opportunity did the organization miss that you saw clearly?',
  'What would you tell your replacement?',
];

export default function ExitPage() {
  const [answers, setAnswers] = useState<string[]>(new Array(QUESTIONS.length).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const [knowledgeExtract, setKnowledgeExtract] = useState('');
  const [pastInterviews, setPastInterviews] = useState<AnonymizedInterview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/exit')
      .then((r) => r.json() as Promise<{ interviews: AnonymizedInterview[] }>)
      .then((d) => setPastInterviews(d.interviews))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const roleLine = answers[0] ?? '';
    const tenureStr = answers[1] ?? '1';
    const tenureMatch = tenureStr.match(/\d+/);
    const tenureYears = tenureMatch ? parseInt(tenureMatch[0], 10) : 1;

    // Parse department from first answer
    const parts = roleLine.split(/[,/]/);
    const role = parts[0]?.trim() ?? 'Unknown';
    const department = parts[1]?.trim() ?? 'Unknown';

    const responses: ExitResponse[] = QUESTIONS.slice(2).map((q, i) => ({
      question: q,
      answer: answers[i + 2] ?? '',
    }));

    setSubmitting(true);
    try {
      const res = await fetch('/api/exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, department, tenureYears, responses }),
      });
      const data = (await res.json()) as { interview: { knowledgeExtract: string; department: string; tenureYears: number; submittedAt: string; id: string } };
      setKnowledgeExtract(data.interview.knowledgeExtract);
      setPastInterviews((prev) => [
        {
          id: data.interview.id,
          department: data.interview.department,
          tenureYears: data.interview.tenureYears,
          knowledgeExtract: data.interview.knowledgeExtract,
          submittedAt: data.interview.submittedAt,
        },
        ...prev,
      ]);
      setAnswers(new Array(QUESTIONS.length).fill(''));
    } catch (err) {
      console.error('Exit interview failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <LogOut className="w-5 h-5 text-amber-400" />
        <h1 className="text-3xl font-bold text-white">Exit Interview Intelligence</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Capture institutional knowledge before it walks out the door. Responses are synthesized by AI and stored anonymously.
      </p>

      {/* Form */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/3 mb-8">
        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-5">
          {QUESTIONS.map((q, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-white/70 mb-2">
                <span className="text-amber-400 font-bold mr-2">{i + 1}.</span>
                {q}
              </label>
              {i === 0 || i === 1 ? (
                <input
                  type="text"
                  value={answers[i]}
                  onChange={(e) => {
                    const updated = [...answers];
                    updated[i] = e.target.value;
                    setAnswers(updated);
                  }}
                  placeholder={i === 0 ? 'e.g. Senior Consultant, Strategy Practice' : 'e.g. 4'}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-white/25 text-sm transition-all"
                />
              ) : (
                <textarea
                  value={answers[i]}
                  onChange={(e) => {
                    const updated = [...answers];
                    updated[i] = e.target.value;
                    setAnswers(updated);
                  }}
                  rows={3}
                  placeholder="Share what you know..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder-white/25 text-sm resize-none transition-all"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={submitting || answers.some((a) => !a.trim())}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : 'Submit Exit Interview'}
          </button>
        </form>
      </div>

      {/* Knowledge Extract Result */}
      {knowledgeExtract && (
        <div className="mb-8 p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Knowledge Extract Generated</span>
          </div>
          <p className="text-sm text-white/80 leading-relaxed">{knowledgeExtract}</p>
        </div>
      )}

      {/* Past Interviews */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Past Exit Interview Knowledge</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-white/3 animate-pulse" />)}
          </div>
        ) : pastInterviews.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/8 text-center">
            <p className="text-sm text-white/40">No exit interviews recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastInterviews.map((interview) => (
              <div key={interview.id} className="p-4 rounded-xl border border-white/8 bg-white/3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-xs font-medium">
                    {interview.department}
                  </span>
                  <span className="text-xs text-white/30">{interview.tenureYears}yr tenure</span>
                  <span className="text-xs text-white/20 ml-auto">{new Date(interview.submittedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{interview.knowledgeExtract}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
