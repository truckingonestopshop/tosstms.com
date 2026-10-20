"use client";

import { cn } from "@/lib/format";
import { Panel, money } from "./frame";
import { Count, EASE, Eyebrow, Reveal, useInView, useStep } from "./motion";

// Analytics and getting paid: the numbers a dispatch business runs on.

const WEEKS = [21, 24, 19, 27, 31, 28, 33, 30, 36, 34, 39, 44];

const BREAKDOWNS: { by: string; rows: [string, number][] }[] = [
  { by: "Carrier", rows: [["Apex Hauling LLC", 72], ["Blue Line Transport", 58], ["Ridge Freight Inc", 41], ["North Star Carriers", 29]] },
  { by: "Driver", rows: [["Mike Johnson", 64], ["Carlos Mendez", 55], ["Andrei Popescu", 47], ["James Carter", 38]] },
  { by: "Truck", rows: [["#101", 66], ["#104", 54], ["#102", 49], ["#103", 35]] },
  { by: "Broker", rows: [["TQL", 61], ["Coyote", 52], ["Arrive Logistics", 44], ["Echo Global", 31]] },
  { by: "Lane", rows: [["Chicago, IL → Atlanta, GA", 58], ["Dallas, TX → Memphis, TN", 47], ["Laredo, TX → Kansas City, MO", 42], ["Denver, CO → Phoenix, AZ", 33]] },
  { by: "Dispatcher", rows: [["Dayana Villa", 70], ["Marco Ionescu", 56], ["Alina Rusu", 39], ["Victor Popa", 22]] },
];

function Trend() {
  const [ref, on] = useInView<HTMLDivElement>();
  const max = Math.max(...WEEKS);
  return (
    <div ref={ref} className="flex h-[180px] items-end gap-1.5 sm:gap-2">
      {WEEKS.map((w, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-2">
          <div
            className={cn("w-full rounded-t-[5px]", i === WEEKS.length - 1 ? "bg-fg" : "bg-fg/20")}
            style={{ height: on ? `${(w / max) * 150}px` : "2px", transition: `height 1100ms ${EASE} ${i * 55}ms` }}
          />
          <span className="tnum text-[9px] text-fg-4">{i === WEEKS.length - 1 ? "Now" : `W${i + 1}`}</span>
        </div>
      ))}
    </div>
  );
}

function Breakdown() {
  const [ref, on] = useInView<HTMLDivElement>();
  const i = useStep(BREAKDOWNS.length, 2600, on);
  const b = BREAKDOWNS[i];
  return (
    <div ref={ref}>
      <div className="mb-4 flex flex-wrap gap-1.5">
        {BREAKDOWNS.map((x, k) => (
          <span key={x.by} className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-500", k === i ? "bg-inverse text-inverse-fg" : "text-fg-4")}>
            {x.by}
          </span>
        ))}
      </div>
      <div key={b.by} className="space-y-3">
        {b.rows.map(([name, pct], k) => (
          <div key={name}>
            <div className="mb-1 flex justify-between gap-3 text-[12px]">
              <span className="truncate text-fg-2">{name}</span>
              <span className="tnum text-fg-4">{money(pct * 260)}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
              <div className="h-full origin-left rounded-full bg-fg-2" style={{ width: `${pct}%`, animation: `lp-grow 900ms ${EASE} ${k * 70}ms both` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AGING = [
  { label: "Current", amt: 12480, tone: "bg-emerald-400" },
  { label: "1–30 days", amt: 4210, tone: "bg-amber-300" },
  { label: "31–60 days", amt: 1640, tone: "bg-orange-400" },
  { label: "60+ days", amt: 620, tone: "bg-red-400" },
];

function Aging() {
  const [ref, on] = useInView<HTMLDivElement>();
  const total = AGING.reduce((s, a) => s + a.amt, 0);
  return (
    <div ref={ref}>
      <div className="flex h-3 overflow-hidden rounded-full bg-surface-3">
        {AGING.map((a, i) => (
          <div key={a.label} className={a.tone} style={{ width: on ? `${(a.amt / total) * 100}%` : "0%", transition: `width 1000ms ${EASE} ${i * 120}ms` }} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {AGING.map((a) => (
          <div key={a.label}>
            <div className="flex items-center gap-1.5 text-[11px] text-fg-4">
              <span className={cn("h-1.5 w-1.5 rounded-full", a.tone)} />
              {a.label}
            </div>
            <Count value={a.amt} format={(n) => money(n)} className="mt-0.5 block text-[15px] font-semibold text-fg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Money() {
  return (
    <section id="money" className="border-t border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>Analytics &amp; billing</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 max-w-[17ch] text-[36px] font-bold leading-[1.02] tracking-[-0.04em] text-fg sm:text-[56px]">
            Know what every truck earns. Get every fee paid.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 border-y border-line sm:mt-16 lg:grid-cols-4">
          {[
            { label: "Gross", v: 184320, f: (n: number) => money(n) },
            { label: "Dispatch fee", v: 18432, f: (n: number) => money(n) },
            { label: "Rate per mile", v: 2.71, f: (n: number) => `$${n.toFixed(2)}` },
            { label: "Loaded miles", v: 68011, f: (n: number) => Math.round(n).toLocaleString("en-US") },
          ].map((k, i) => (
            <Reveal key={k.label} delay={i * 80} className={cn("px-1 py-7 sm:px-6", i % 2 === 1 && "border-l border-line", i >= 2 && "border-t border-line lg:border-t-0", i === 2 && "lg:border-l")}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-4">{k.label}</div>
              <Count value={k.v} format={k.f} className="mt-2 block text-[34px] font-bold tracking-[-0.04em] text-fg sm:text-[44px]" />
              <div className="mt-1 text-[12px] text-fg-4">This month</div>
            </Reveal>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Panel className="h-full p-5 sm:p-7">
              <div className="mb-6 flex items-baseline justify-between">
                <div className="text-[14px] font-semibold text-fg">Dispatch fee by week</div>
                <div className="text-[12px] text-fg-4">Last 12 weeks</div>
              </div>
              <Trend />
            </Panel>
          </Reveal>
          <Reveal delay={100}>
            <Panel className="h-full p-5 sm:p-7">
              <div className="mb-5 text-[14px] font-semibold text-fg">Gross by</div>
              <Breakdown />
            </Panel>
          </Reveal>
        </div>

        <Reveal className="mt-4">
          <Panel className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <div className="text-[14px] font-semibold text-fg">Payments &amp; aging</div>
              <p className="mt-2 max-w-[40ch] text-[13px] leading-relaxed text-fg-3">
                Record each payment with its date, method and reference. Invoices settle themselves, their loads follow, and
                anything overdue shows up before it gets old.
              </p>
            </div>
            <Aging />
          </Panel>
        </Reveal>
      </div>
    </section>
  );
}
