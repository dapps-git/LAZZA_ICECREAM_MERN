'use client';

import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend,
  trendType = 'up',
}) {
  const variantStyles = {
    purple: 'bg-white border-purple-100/90 text-slate-900',
    amber: 'bg-white border-amber-200/80 text-slate-900',
    emerald: 'bg-white border-emerald-100 text-slate-900',
    rose: 'bg-white border-rose-100 text-slate-900',
    default: 'bg-white border-slate-100 text-slate-900',
  };

  const iconBgStyles = {
    purple: 'bg-[#3b185f] text-amber-300',
    amber: 'bg-gradient-to-tr from-amber-400 to-yellow-400 text-violet-950 shadow-xs',
    emerald: 'bg-emerald-600 text-white',
    rose: 'bg-rose-500 text-white',
    default: 'bg-purple-50 text-[#3b185f]',
  };

  return (
    <div
      className={`p-4 rounded-2xl border ${variantStyles[variant]} card-hover shadow-card flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-[#3b185f]/80 uppercase tracking-widest">
          {title}
        </span>
        {Icon && (
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${iconBgStyles[variant]}`}
          >
            <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-xl sm:text-2xl font-light text-slate-900 tracking-tight">
          {value}
        </div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center justify-between text-xs text-slate-400 font-light">
            <span className="truncate">{subtitle}</span>
            {trend && (
              <span
                className={`font-normal text-[10px] px-1.5 py-0.2 rounded-md ${
                  trendType === 'up'
                    ? 'text-amber-800 bg-amber-50 border border-amber-200'
                    : 'text-rose-700 bg-rose-50 border border-rose-200'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
