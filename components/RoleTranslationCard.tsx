import type { RoleTranslation } from '@/lib/types';
import { ROLE_COLORS } from '@/lib/store';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

interface RoleTranslationCardProps {
  translation: RoleTranslation;
  index: number;
}

export default function RoleTranslationCard({ translation, index }: RoleTranslationCardProps) {
  return (
    <div
      className="p-5 rounded-xl border border-white/10 bg-white/3 animate-[slideUp_0.4s_ease-out_both]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[translation.role] ?? 'bg-gray-500/20 text-gray-300'}`}>
          {translation.role}
        </span>
      </div>

      <p className="text-sm text-white/75 leading-relaxed mb-4">
        {translation.context}
      </p>

      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">This Week&apos;s Focus</span>
        </div>
        <ul className="space-y-1.5">
          {translation.focus.map((item, i) => (
            <li key={i} className="text-sm text-white/70 flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Watch For</span>
        </div>
        <ul className="space-y-1.5">
          {translation.watchFor.map((item, i) => (
            <li key={i} className="text-sm text-white/60 flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500/60 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
