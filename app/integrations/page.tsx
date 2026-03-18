'use client';

import { useState, useEffect } from 'react';
import { Link2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface WebhookEvent {
  id: string;
  source: string;
  text: string;
  receivedAt: string;
}

export default function IntegrationsPage() {
  const [slackExpanded, setSlackExpanded] = useState(false);
  const [teamsExpanded, setTeamsExpanded] = useState(false);
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);

  useEffect(() => {
    fetch('/api/webhooks/slack')
      .then((r) => r.json() as Promise<{ events: WebhookEvent[] }>)
      .then((d) => setWebhookEvents(d.events))
      .catch(console.error);
  }, []);

  const slackPayload = `{
  "text": "Just lost a deal to a competitor on pricing",
  "username": "Observation Bot",
  "channel": "#intel-feed"
}`;

  const teamsPayload = `{
  "type": "message",
  "text": "Client asked about our AI capabilities today"
}`;

  const webhookUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/webhooks/slack`
    : 'https://meridian.vercel.app/api/webhooks/slack';

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-2">
        <Link2 className="w-5 h-5 text-blue-400" />
        <h1 className="text-2xl md:text-3xl font-bold text-white">Integrations</h1>
      </div>
      <p className="text-white/40 text-sm mb-8">
        Connect Meridian to your existing tools to automatically capture observations from conversations, deals, and team activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Slack */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/3">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4A154B]/50 border border-[#4A154B]/50 flex items-center justify-center text-lg">
                💬
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Slack</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">Ready to Connect</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-white/50 mb-3 leading-relaxed">
            Post observations directly from Slack channels into Meridian&apos;s intelligence feed.
          </p>
          <div className="mb-3">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1.5">Webhook URL</p>
            <code className="block px-3 py-2 rounded-lg bg-black/30 text-xs text-cyan-300 font-mono break-all">
              {webhookUrl}
            </code>
          </div>
          <button
            onClick={() => setSlackExpanded(!slackExpanded)}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            View Sample Payload
            {slackExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {slackExpanded && (
            <pre className="mt-3 px-3 py-2 rounded-lg bg-black/30 text-xs text-white/60 overflow-x-auto">
              {slackPayload}
            </pre>
          )}
        </div>

        {/* Microsoft Teams */}
        <div className="p-5 rounded-2xl border border-white/10 bg-white/3">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#464EB8]/30 border border-[#464EB8]/30 flex items-center justify-center text-lg">
                🔷
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Microsoft Teams</h2>
                <div className="flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs text-emerald-400 font-medium">Ready to Connect</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-white/50 mb-3 leading-relaxed">
            Capture observations from Teams conversations and meeting notes.
          </p>
          <div className="mb-3">
            <p className="text-xs text-white/30 uppercase tracking-wider mb-1.5">Webhook URL</p>
            <code className="block px-3 py-2 rounded-lg bg-black/30 text-xs text-cyan-300 font-mono break-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/api/webhooks/crm` : 'https://meridian.vercel.app/api/webhooks/crm'}
            </code>
          </div>
          <button
            onClick={() => setTeamsExpanded(!teamsExpanded)}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            View Sample Payload
            {teamsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {teamsExpanded && (
            <pre className="mt-3 px-3 py-2 rounded-lg bg-black/30 text-xs text-white/60 overflow-x-auto">
              {teamsPayload}
            </pre>
          )}
        </div>
      </div>

      {/* Webhook Activity */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Incoming Webhook Activity</h2>
        {webhookEvents.length === 0 ? (
          <div className="p-6 rounded-xl border border-white/8 text-center">
            <p className="text-sm text-white/40">No webhook events received yet.</p>
            <p className="text-xs text-white/25 mt-1">Events will appear here when observations arrive via webhook.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {webhookEvents.map((event) => (
              <div key={event.id} className="p-4 rounded-xl border border-white/8 bg-white/3 flex items-start gap-3">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-xs font-medium shrink-0">{event.source}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">{event.text}</p>
                  <p className="text-xs text-white/30 mt-0.5">{new Date(event.receivedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
