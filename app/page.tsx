import Link from 'next/link';
import { ArrowRight, Radio, Target, RefreshCw, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium tracking-wider uppercase">
          Organizational Intelligence Platform
        </div>

        {/* Main headline */}
        <h1 className="text-center text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-[1.08]">
          The intelligence layer{' '}
          <span className="text-gradient">your organization</span>
          {' '}is missing.
        </h1>

        {/* Subtitle */}
        <p className="text-center text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
          Meridian closes the loop between executive strategy and frontline execution —
          capturing signal from the ground up and translating strategy from the top down.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5"
          >
            See the Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pulse"
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 hover:border-white/30 text-white/80 hover:text-white font-semibold transition-all hover:bg-white/5"
          >
            Submit a Signal
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Animated bidirectional diagram */}
        <div className="relative flex flex-col items-center">
          {/* Top node */}
          <div className="px-6 py-3 rounded-xl bg-blue-500/15 text-blue-300 text-sm font-semibold">
            Executive Strategy
          </div>

          {/* Down flow */}
          <div className="flex flex-col items-center my-2">
            <ArrowDownCircle className="w-5 h-5 text-blue-400 animate-bounce" />
            <div className="w-px h-8 bg-gradient-to-b from-blue-500/60 to-cyan-400/60" />
          </div>

          {/* Center */}
          <div className="relative w-32 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-white/5" />
            <div className="relative z-10 text-xs font-bold text-white/60 uppercase tracking-widest">Meridian</div>
            {/* Pulse dot */}
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
          </div>

          {/* Up flow */}
          <div className="flex flex-col items-center my-2">
            <div className="w-px h-8 bg-gradient-to-t from-cyan-500/60 to-blue-400/60" />
            <ArrowUpCircle className="w-5 h-5 text-cyan-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Bottom node */}
          <div className="px-6 py-3 rounded-xl bg-cyan-500/15 text-cyan-300 text-sm font-semibold">
            Frontline Signal
          </div>
        </div>

        {/* Tagline under diagram */}
        <p className="mt-6 text-sm text-white/30 italic">Where strategy meets signal.</p>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Radio className="w-6 h-6 text-cyan-400" />}
            iconBg="bg-cyan-500/15"
            title="Capture Signal"
            description="Frictionless micro-moment prompts that turn employee observation into organizational intelligence."
            href="/pulse"
            linkText="Open Pulse"
          />
          <FeatureCard
            icon={<Target className="w-6 h-6 text-blue-400" />}
            iconBg="bg-blue-500/15"
            title="Translate Strategy"
            description="Executive objectives automatically translated into role-specific, actionable guidance."
            href="/strategy"
            linkText="Enter Strategy"
          />
          <FeatureCard
            icon={<RefreshCw className="w-6 h-6 text-violet-400" />}
            iconBg="bg-violet-500/15"
            title="Close the Loop"
            description="Every signal and outcome feeds back in, building a living map of how your organization actually works."
            href="/insights"
            linkText="View Insights"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center">
        <p className="text-sm text-white/25">
          Built for organizations that take execution seriously. &nbsp;·&nbsp; Apex Advisory Group Demo
        </p>
        <div className="mt-3">
          <Link href="/splash" className="text-xs text-white/20 hover:text-white/40 transition-colors">
            View Intro →
          </Link>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
  href,
  linkText,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  href: string;
  linkText: string;
}) {
  return (
    <div className="group p-6 rounded-2xl bg-[#13161f] hover:bg-[#161a24] transition-all">
      <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed mb-4">{description}</p>
      <Link
        href={href}
        className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
      >
        {linkText}
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
