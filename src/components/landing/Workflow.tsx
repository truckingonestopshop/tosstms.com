"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, FileText, Files, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/format";
import { Pill, money } from "./frame";
import { EASE, Eyebrow, Reveal, useStep } from "./motion";

// "From rate con to paid": four chapters. On wide screens the product panel stays pinned
// while the text scrolls, and each chapter plays its own step. Phones: panel under each text.

const CHAPTERS = [
  {
    key: "book",
    eyebrow: "Book",
    title: "Drop the rate con. The load fills itself in.",
    body: "Broker, MC, rate, every stop with its appointment, commodity, weight and highway miles come straight off the rate confirmation, with deadhead routed from where the truck is empty. Check it, change anything, save.",
    points: ["PDF or scanned rate cons", "Multi-stop loads", "Loaded + deadhead miles"],
  },
  {
    key: "run",
    eyebrow: "Run",
    title: "Every stop, every status, on one page.",
    body: "Move the load from booked to delivered stop by stop. Re-assign the truck or driver, watch the route on the map, and keep notes in an activity log the whole team sees as it happens.",
    points: ["Board, list and calendar views", "Re-assign truck & driver", "Live for every dispatcher"],
  },
  {
    key: "paper",
    eyebrow: "Paperwork",
    title: "RC, BOL, POD. Then one packet for factoring.",
    body: "Each load shows what paperwork it still needs for its stage. When the POD is in, one click merges the rate con, BOL and POD into a single factoring packet.",
    points: ["Checklist per load stage", "One-click factoring packet", "Files kept private"],
  },
  {
    key: "bill",
    eyebrow: "Bill",
    title: "Invoice the fee. Track it until it’s paid.",
    body: "Delivered loads wait under “Ready to bill” per carrier. Build the invoice, add charges or credits, send the PDF, then record payments as they land. Overdue invoices surface on their own.",
    points: ["Truck and driver under each lane", "Charges & credits in the total", "Payments and aging"],
  },
] as const;

function DemoShell({ title, tag = "Load #4471", children }: { title: string; tag?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-line bg-surface">
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <span className="text-[12px] font-semibold text-fg">{title}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-4">{tag}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

const FIELDS = [
  ["Broker", "TQL · MC 411443"],
  ["Rate", "$3,850.00"],
  ["Pickup", "Chicago, IL · Oct 21, 08:00"],
  ["Delivery", "Atlanta, GA · Oct 22, 06:00"],
  ["Miles", "716 loaded · 42 deadhead"],
  ["Commodity", "Frozen food · 42,000 lb"],
] as const;

function BookDemo({ active }: { active: boolean }) {
  const step = useStep(FIELDS.length + 4, 700, active);
  const filled = Math.max(0, step - 2);
  return (
    <DemoShell title="New load">
      <div className={cn("flex items-center gap-3 rounded-xl border border-dashed p-3 transition-colors duration-500", step >= 1 ? "border-line-strong bg-surface-2/60" : "border-line")}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-3">
          <FileText className="h-4 w-4 text-fg-2" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] font-semibold text-fg">RC_TQL_88731.pdf</div>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full bg-fg-2" style={{ width: step >= 1 ? "100%" : "0%", transition: `width 1200ms ${EASE}` }} />
          </div>
        </div>
        <span className="text-[10px] font-semibold text-fg-4">{step >= 2 ? "Read" : "Reading…"}</span>
      </div>
      <div className="mt-4 divide-y divide-line rounded-xl border border-line">
        {FIELDS.map(([k, v], i) => {
          const on = i < filled;
          return (
            <div key={k} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <span className="text-[11px] text-fg-4">{k}</span>
              <span
                className="tnum flex items-center gap-2 text-right text-[12px] font-semibold text-fg"
                style={{ opacity: on ? 1 : 0, transform: on ? "none" : "translateX(8px)", transition: `all 500ms ${EASE}` }}
              >
                {v}
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              </span>
            </div>
          );
        })}
      </div>
    </DemoShell>
  );
}

const ROUTE = "M 30 150 C 110 120, 150 60, 230 70 S 330 40, 370 30";

function RunDemo({ active }: { active: boolean }) {
  const step = useStep(5, 1500, active);
  const stage = (["booked", "booked", "in_transit", "in_transit", "delivered"] as const)[step];
  const log = [
    ["Dayana Villa", "Booked · Truck #101, Mike Johnson"],
    ["Mike Johnson", "Picked up · Chicago, IL"],
    ["Dayana Villa", "Note · ETA 05:40, receiver confirmed"],
    ["Mike Johnson", "Delivered · Atlanta, GA"],
  ].slice(0, Math.max(1, step));
  return (
    <DemoShell title="Load page">
      <div className="mb-4 flex items-center justify-between">
        <Pill status={stage} />
        <span className="text-[11px] text-fg-4">Chicago, IL → Atlanta, GA</span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-line bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] [background-size:18px_18px]">
        <svg viewBox="0 0 400 180" className="h-[170px] w-full">
          <path d={ROUTE} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round" />
          <path
            d={ROUTE}
            fill="none"
            stroke="#f4f4f5"
            strokeWidth="3"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            style={{ strokeDashoffset: 1 - Math.min(1, step / 4), transition: `stroke-dashoffset 1400ms ${EASE}` }}
          />
          <circle cx="30" cy="150" r="6" fill="#0d0d0f" stroke="#f4f4f5" strokeWidth="2.5" />
          <circle cx="370" cy="30" r="6" fill="#0d0d0f" stroke={step >= 4 ? "#34d399" : "#5c5c65"} strokeWidth="2.5" style={{ transition: "stroke 400ms" }} />
        </svg>
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-[10px] text-fg-2 backdrop-blur">
          <Truck className="h-3 w-3" /> 716 mi · 42 deadhead
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {log.map(([who, what], i) => (
          <div key={what} className="flex items-start gap-2.5 animate-[lp-in_500ms_cubic-bezier(.22,.8,.2,1)_both]" style={{ animationDelay: `${i === log.length - 1 ? 0 : 0}ms` }}>
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-fg-4" />
            <div className="text-[12px] leading-snug">
              <span className="font-semibold text-fg">{who}</span> <span className="text-fg-3">{what}</span>
            </div>
          </div>
        ))}
      </div>
    </DemoShell>
  );
}

function PaperDemo({ active }: { active: boolean }) {
  const step = useStep(6, 1100, active);
  const docs = [
    ["Rate confirmation", "RC_TQL_88731.pdf"],
    ["Bill of lading (BOL)", "BOL_4471.pdf"],
    ["Proof of delivery (POD)", "POD_4471_signed.pdf"],
  ];
  const packet = step >= 4;
  return (
    <DemoShell title="Paperwork">
      <div className="space-y-2">
        {docs.map(([name, file], i) => {
          const done = step > i;
          return (
            <div key={name} className={cn("flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-500", done ? "border-line bg-surface-2/50" : "border-dashed border-line")}>
              <span className={cn("grid h-6 w-6 place-items-center rounded-full transition-colors duration-500", done ? "bg-emerald-400 text-black" : "bg-surface-3 text-fg-4")}>
                <Check className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-fg">{name}</div>
                <div className="truncate text-[11px] text-fg-4">{done ? file : "Needed before delivered"}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className={cn("mt-4 flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-700", packet ? "border-line-strong bg-surface-2" : "border-line opacity-50")}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-3">
          <Files className="h-4 w-4 text-fg" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[12px] font-semibold text-fg">{packet ? "Packet_4471.pdf" : "Factoring packet"}</div>
          <div className="text-[11px] text-fg-4">{packet ? "RC + BOL + POD merged into one PDF" : "Ready once the POD is in"}</div>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-[11px] font-semibold transition-colors", packet ? "bg-inverse text-inverse-fg" : "bg-surface-3 text-fg-4")}>
          {packet ? "Download" : "Merge"}
        </span>
      </div>
    </DemoShell>
  );
}

function BillDemo({ active }: { active: boolean }) {
  const step = useStep(5, 1300, active);
  const lines = [
    { lane: "Chicago, IL → Atlanta, GA", sub: "Truck #101 · Mike Johnson · 716 mi", amt: 385 },
    { lane: "Dallas, TX → Memphis, TN", sub: "Truck #104 · Carlos Mendez · 452 mi", amt: 240 },
  ];
  const charge = step >= 1 ? 150 : 0;
  const credit = step >= 2 ? 75 : 0;
  const total = 625 + charge - credit;
  const paid = step >= 4 ? total : step >= 3 ? 300 : 0;
  const status = step >= 4 ? "paid" : step >= 3 ? "invoiced" : "delivered";
  return (
    <DemoShell title="Invoice TOSS-2026-1042" tag="Due Oct 29">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] text-fg-4">Apex Hauling LLC · Net 7</span>
        <Pill status={status} />
      </div>
      <div className="divide-y divide-line rounded-xl border border-line">
        {lines.map((l) => (
          <div key={l.lane} className="flex items-start justify-between gap-3 px-3.5 py-2.5">
            <div>
              <div className="text-[12px] font-semibold text-fg">{l.lane}</div>
              <div className="text-[10.5px] text-fg-4">{l.sub}</div>
            </div>
            <span className="tnum text-[12px] font-semibold text-fg">{money(l.amt, true)}</span>
          </div>
        ))}
        <div className="flex justify-between px-3.5 py-2 text-[11.5px]" style={{ opacity: charge ? 1 : 0.35, transition: `opacity 500ms` }}>
          <span className="text-fg-3">+ Detention</span>
          <span className="tnum text-fg-2">{money(150, true)}</span>
        </div>
        <div className="flex justify-between px-3.5 py-2 text-[11.5px]" style={{ opacity: credit ? 1 : 0.35, transition: `opacity 500ms` }}>
          <span className="text-fg-3">− Credit · lumper reimbursed</span>
          <span className="tnum text-fg-2">−{money(75, true)}</span>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-4">Dispatch fee due</div>
          <div className="tnum text-[26px] font-bold tracking-tight text-fg">{money(total - paid, true)}</div>
        </div>
        <div className="w-[45%]">
          <div className="mb-1 flex justify-between text-[10px] text-fg-4">
            <span>Paid</span>
            <span className="tnum">{money(paid, true)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full bg-emerald-400" style={{ width: `${(paid / total) * 100}%`, transition: `width 900ms ${EASE}` }} />
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

const DEMOS = { book: BookDemo, run: RunDemo, paper: PaperDemo, bill: BillDemo };

/** Which chapter sits in the middle of the screen. */
function useActiveChapter(count: number) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.slice(0, count).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [count]);
  return { refs, active };
}

export function Workflow() {
  const { refs, active } = useActiveChapter(CHAPTERS.length);

  return (
    <section id="workflow" className="relative border-t border-line">
      <div className="mx-auto max-w-[1240px] px-5 pt-24 sm:px-8 sm:pt-32">
        <Reveal>
          <Eyebrow>How it works</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 max-w-[18ch] text-[36px] font-bold leading-[1.02] tracking-[-0.04em] text-fg sm:text-[56px]">
            From rate con to paid, without leaving the page.
          </h2>
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-[1240px] gap-x-16 px-5 pb-24 sm:px-8 sm:pb-32 lg:grid-cols-[1fr_1.05fr]">
        <div>
          {CHAPTERS.map((c, i) => {
            const Demo = DEMOS[c.key];
            const on = active === i;
            return (
              <article
                key={c.key}
                data-i={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex flex-col justify-center py-14 lg:min-h-[78vh] lg:py-0"
              >
                <div className={cn("transition-opacity duration-700", !on && "lg:opacity-[0.28]")}>
                  <Eyebrow index={`0${i + 1}`}>{c.eyebrow}</Eyebrow>
                  <h3 className="mt-5 max-w-[20ch] text-[28px] font-bold leading-[1.08] tracking-[-0.035em] text-fg sm:text-[38px]">{c.title}</h3>
                  <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-fg-3 sm:text-[16px]">{c.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {c.points.map((p) => (
                      <li key={p} className="rounded-full border border-line px-3 py-1.5 text-[12px] text-fg-2">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <Reveal className="mt-8 lg:hidden">
                  <Demo active />
                </Reveal>
              </article>
            );
          })}
        </div>
        <div className="relative hidden lg:block">
            <div className="sticky top-[14vh] h-[72vh]">
              {CHAPTERS.map((c, i) => {
                const Demo = DEMOS[c.key];
                const on = active === i;
                return (
                  <div
                    key={c.key}
                    className="absolute inset-0 flex items-center"
                    aria-hidden={!on}
                    style={{
                      opacity: on ? 1 : 0,
                      transform: on ? "none" : `translateY(${i < active ? -24 : 24}px) scale(.98)`,
                      transition: `opacity 700ms ${EASE}, transform 900ms ${EASE}`,
                      pointerEvents: on ? "auto" : "none",
                    }}
                  >
                    <div className="w-full">
                      <Demo active={on} />
                    </div>
                  </div>
                );
              })}
            </div>
        </div>
      </div>
    </section>
  );
}
