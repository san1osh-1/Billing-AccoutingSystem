import { Check, BarChart2, TrendingUp, ShieldCheck } from 'lucide-react'

export default function AuthShowcasePanel() {
  return (
    <div className="relative flex flex-col justify-between h-full p-8 md:p-10 lg:p-12 bg-gradient-to-b from-brand-50/60 via-slate-50/50 to-brand-50/25 overflow-hidden border-r border-slate-200/60">
      {/* Decorative ambient blurred background bubbles */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-brand-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-brand-100/20 blur-3xl pointer-events-none" />

      {/* Top Brand Logo — HisaabKit */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white font-bold text-base shadow-md shadow-brand-500/30">
          ह
        </div>
        <div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">HisaabKit</span>
          <span className="text-xs text-slate-400 font-medium ml-1.5">• Nepal Business Suite</span>
        </div>
      </div>

      {/* Middle Content */}
      <div className="relative z-10 my-8">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Everything you need to manage your business.
        </h1>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-sm">
          Create invoices, manage customers, track payments, and keep your business organized from one smart workspace.
        </p>

        {/* Illustrated Floating Invoice & Recent Invoices Mockup */}
        <div className="relative mt-8 h-64 w-full max-w-sm">
          {/* Back Tilted Invoice Mockup */}
          <div className="absolute left-2 top-4 w-44 h-36 bg-white rounded-xl shadow-md border border-slate-200/80 p-3 -rotate-6 transition-transform">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <div className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">INVOICE</div>
              <div className="w-6 h-1.5 bg-slate-200 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-24 bg-slate-200 rounded-full" />
              <div className="h-1.5 w-32 bg-slate-100 rounded-full" />
              <div className="h-1.5 w-20 bg-slate-100 rounded-full" />
            </div>
            <div className="mt-4 pt-2 border-t border-slate-100 flex justify-between items-center">
              <div className="h-2 w-12 bg-brand-200 rounded-full" />
              <div className="h-2 w-10 bg-slate-300 rounded-full" />
            </div>

            {/* Checkmark Floating Badge */}
            <div className="absolute -bottom-3 -left-3 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>

            {/* Mini Chart Floating Badge */}
            <div className="absolute -bottom-2 right-4 w-7 h-7 rounded-lg bg-white border border-slate-200 text-brand-600 flex items-center justify-center shadow-md">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>

          {/* Front Recent Invoices Card */}
          <div className="absolute right-0 top-6 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-4 transition-all hover:shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-slate-800">Recent invoices</div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                3 paid
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Invoice Row 1 */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">INV-2026-0148</div>
                  <div className="text-[10px] text-slate-400">HisaabKit invoice • Today</div>
                </div>
                <div className="font-bold text-slate-900 text-xs">NPR 24,500</div>
              </div>

              {/* Invoice Row 2 */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                <div>
                  <div className="font-semibold text-slate-900">INV-2026-0147</div>
                  <div className="text-[10px] text-slate-400">HisaabKit invoice • Yesterday</div>
                </div>
                <div className="font-bold text-slate-900 text-xs">NPR 12,800</div>
              </div>

              {/* Invoice Row 3 */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900">INV-2026-0146</div>
                  <div className="text-[10px] text-slate-400">HisaabKit invoice • Sep 18</div>
                </div>
                <div className="font-bold text-slate-900 text-xs">NPR 8,750</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Badges — replaced with Nepal-focused features */}
      <div className="relative z-10 pt-4 border-t border-slate-200/60 flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
        <div className="inline-flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
          <span>PAN / VAT ready</span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          <span>Multi-user access</span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <BarChart2 className="w-3.5 h-3.5 text-brand-600" />
          <span>Real-time reports</span>
        </div>
      </div>
    </div>
  )
}
