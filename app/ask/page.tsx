'use client';

import { useState, useEffect } from 'react';
import { ROLES } from '@/lib/store';
import type { OrgQuestion, Role } from '@/lib/types';
import { Search, Loader2, MessageSquare, BookOpen } from 'lucide-react';

export default function AskPage() {
  const [question, setQuestion] = useState('');
  const [askedBy, setAskedBy] = useState<Role>('CEO');
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<OrgQuestion | null>(null);
  const [recentQuestions, setRecentQuestions] = useState<OrgQuestion[]>([]);

  useEffect(() => {
    fetch('/api/ask')
      .then((r) => r.json() as Promise<{ questions: OrgQuestion[] }>)
      .then((d) => setRecentQuestions(d.questions))
      .catch(console.error);
  }, []);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    setCurrentAnswer(null);
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, askedBy }),
      });
      const data = (await res.json()) as { question: OrgQuestion };
      setCurrentAnswer(data.question);
      setRecentQuestions((prev) => [data.question, ...prev]);
      setQuestion('');
    } catch (err) {
      console.error('Ask failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Search className="w-5 h-5 text-blue-400" />
        <h1 className="text-3xl font-bold text-white">Ask the Organization</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Ask any question and get an answer grounded in your organization&apos;s observation data.
      </p>

      <form onSubmit={(e) => { void handleAsk(e); }} className="mb-8">
        <div className="flex gap-2 mb-3">
          <select
            value={askedBy}
            onChange={(e) => setAskedBy(e.target.value as Role)}
            className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none text-white text-sm transition-all appearance-none cursor-pointer min-w-[160px]"
          >
            {ROLES.map((r) => (
              <option key={r} value={r} className="bg-[#1a1d26]">{r}</option>
            ))}
          </select>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What is the biggest risk to our AI strategy right now?"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 text-white placeholder-white/25 text-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all flex items-center gap-2 whitespace-nowrap"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask →'}
          </button>
        </div>
      </form>

      {/* Loading thinking animation */}
      {loading && (
        <div className="mb-6 p-5 rounded-xl border border-blue-500/20 bg-blue-500/5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <p className="text-sm text-blue-300">Searching organizational observations...</p>
          </div>
        </div>
      )}

      {/* Answer card */}
      {currentAnswer && (
        <div className="mb-8 p-5 rounded-xl border border-white/10 bg-white/3">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Answer</span>
          </div>
          <p className="text-white/90 leading-relaxed mb-4">{currentAnswer.answer}</p>
          {currentAnswer.citations.length > 0 && (
            <div>
              <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Observation Citations</p>
              <div className="flex gap-2 flex-wrap">
                {currentAnswer.citations.map((cit) => (
                  <span key={cit} className="px-2 py-0.5 rounded-full bg-white/8 text-white/50 text-xs font-mono">
                    {cit}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent questions */}
      {recentQuestions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-white/40" />
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Recent Questions</h2>
          </div>
          <div className="space-y-3">
            {recentQuestions.slice(0, 5).map((q) => (
              <div key={q.id} className="p-4 rounded-xl border border-white/8 bg-white/3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-white/80">{q.question}</p>
                  <span className="text-xs text-white/30 whitespace-nowrap shrink-0">{q.askedBy}</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed line-clamp-2">{q.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
