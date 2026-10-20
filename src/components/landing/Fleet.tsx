"use client";

import { useEffect, useState } from "react";
import { ArrowLeftRight, Camera, Check, Copy, Eye, KeyRound, Lock, Snowflake, Truck, UserRound } from "lucide-react";
import { cn } from "@/lib/format";
import { Panel } from "./frame";
import { Eyebrow, Reveal, prefersStill, useInView, useStep } from "./motion";

// Fleet & Company: the things a dispatcher reaches for all day, as tiles.

function Tile({ title, body, className, children, delay = 0 }: { title: string; body: string; className?: string; children: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay} className={className}>
      <Panel className="flex h-full flex-col overflow-hidden">
        <div className="flex-1 p-5 sm:p-6">{children}</div>
        <div className="border-t border-line px-5 py-4 sm:px-6">
          <div className="text-[14px] font-semibold text-fg">{title}</div>
          <div className="mt-1 text-[13px] leading-relaxed text-fg-3">{body}</div>
        </div>
      </Panel>
    </Reveal>
  );
}

const PITCH = [
  "Apex Hauling LLC · MC 1428592 · DOT 31428592",
  "Truck #101 (2022 Freightliner Cascadia) · Trailer #TR-1010 · 53 ft Reefer",
  "Swing doors · Air ride",
  "Thermo King Precedent S-600 · -20°F to 70°F · Duct floor",
  "Location: Chicago, IL · Ready today 8:00 AM",
  "Driver: Mike Johnson · (312) 555-0144",
];

function PitchCard() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [copied, setCopied] = useState(false);
  // Plays the copy once when it comes into view; then it's a real button.
  useEffect(() => {
    if (!on || prefersStill()) return;
    const a = window.setTimeout(() => setCopied(true), 1400);
    const b = window.setTimeout(() => setCopied(false), 3600);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [on]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PITCH.join("\n"));
    } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div ref={ref}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-fg-4">Broker pitch</span>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-300",
            copied ? "bg-emerald-400 text-black" : "bg-inverse text-inverse-fg hover:opacity-90",
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy pitch"}
        </button>
      </div>
      <div className={cn("rounded-xl border p-4 font-mono text-[12px] leading-[1.75] text-fg-2 transition-colors duration-500", copied ? "border-emerald-400/40 bg-emerald-400/[0.04]" : "border-line bg-surface-2/40")}>
        {PITCH.map((l) => (
          <div key={l} className="truncate">
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function UnitsCard() {
  const [ref, on] = useInView<HTMLDivElement>();
  const step = useStep(2, 2600, on);
  const trailer = step ? { n: "TR-5300", t: "53 ft Dry Van" } : { n: "TR-1010", t: "53 ft Reefer" };
  return (
    <div ref={ref} className="space-y-2.5">
      {[
        { icon: Truck, label: "Truck", value: "#101 · 2022 Freightliner Cascadia", sub: "IL-P88291 · Ready now" },
        { icon: Snowflake, label: "Trailer", value: `#${trailer.n} · ${trailer.t}`, sub: step ? "Hooked in Chicago, IL" : "Thermo King · Duct floor", swap: true },
        { icon: UserRound, label: "Driver", value: "Mike Johnson", sub: "CDL-A · Medical card valid" },
      ].map((r) => (
        <div key={r.label} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-3">
            <r.icon className="h-4 w-4 text-fg-2" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-fg-4">{r.label}</div>
            <div key={r.value} className={cn("truncate text-[13px] font-semibold text-fg", r.swap && "animate-[lp-in_600ms_cubic-bezier(.22,.8,.2,1)_both]")}>
              {r.value}
            </div>
            <div className="truncate text-[11px] text-fg-4">{r.sub}</div>
          </div>
          {r.swap && (
            <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-1 text-[10px] font-semibold text-fg-3">
              <ArrowLeftRight className="h-3 w-3" /> Drop &amp; hook
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const SLOTS = ["Side views", "Reefer unit", "Interior", "Rear", "Air chute", "License plate"];

function PhotosCard() {
  const [ref, on] = useInView<HTMLDivElement>();
  const step = useStep(SLOTS.length + 3, 650, on);
  return (
    <div ref={ref}>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map((s, i) => {
          const has = step > i;
          return (
            <div
              key={s}
              className={cn(
                "relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-lg border p-2 transition-colors duration-500",
                has ? "border-line bg-[linear-gradient(160deg,#2a2a30,#121215)]" : "border-dashed border-line-strong",
              )}
            >
              <Camera className={cn("absolute right-2 top-2 h-3.5 w-3.5 transition-colors", has ? "text-fg-3" : "text-fg-4")} />
              {has && <Check className="absolute left-2 top-2 h-3.5 w-3.5 animate-[lp-in_400ms_both] text-emerald-400" />}
              <span className="text-[10px] font-medium leading-tight text-fg-3">{s}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-fg-4">
        <span>Trailer #TR-1010</span>
        <span className="tnum">{Math.min(step, SLOTS.length)}/6 photos</span>
      </div>
    </div>
  );
}

const EXPIRING = [
  { what: "Medical card", who: "Carlos Mendez", days: -3 },
  { what: "Certificate of insurance", who: "Apex Hauling LLC", days: 12 },
  { what: "Annual truck inspection", who: "Truck #104", days: 21 },
  { what: "CDL", who: "Andrei Popescu", days: 45 },
];

function ExpiringCard() {
  return (
    <div className="divide-y divide-line rounded-xl border border-line">
      {EXPIRING.map((e, i) => (
        <Reveal key={e.what} delay={i * 90} y={8} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
          <div className="min-w-0">
            <div className="truncate text-[12.5px] font-semibold text-fg">{e.what}</div>
            <div className="truncate text-[11px] text-fg-4">{e.who}</div>
          </div>
          <span
            className={cn(
              "tnum shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
              e.days < 0 ? "bg-red-500/10 text-red-300 ring-red-400/25" : e.days <= 30 ? "bg-amber-500/10 text-amber-300 ring-amber-400/25" : "bg-surface-2 text-fg-3 ring-line",
            )}
          >
            {e.days < 0 ? `Expired ${-e.days}d ago` : `${e.days} days`}
          </span>
        </Reveal>
      ))}
    </div>
  );
}

function VaultCard() {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      {[
        { t: "Factoring portal", u: "dispatch@apexhauling.com", p: "Kp9#vT2m!rQ" },
        { t: "ELD", u: "apex.admin", p: "m4Z!wq83Lx" },
        { t: "Fuel card", u: "Acct 7741 0092", p: "4471" },
      ].map((v) => (
        <div key={v.t} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-2.5">
          <KeyRound className="h-4 w-4 shrink-0 text-fg-4" />
          <div className="min-w-0 flex-1">
            <div className="text-[12.5px] font-semibold text-fg">{v.t}</div>
            <div className="truncate text-[11px] text-fg-4">{v.u}</div>
          </div>
          <span className="tnum font-mono text-[12px] text-fg-2">{show ? v.p : "••••••••"}</span>
        </div>
      ))}
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-fg-3 transition-colors hover:text-fg"
      >
        <Eye className="h-3.5 w-3.5" /> Hover to reveal · <Lock className="h-3 w-3" /> encrypted at rest
      </button>
    </div>
  );
}

export function Fleet() {
  return (
    <section id="fleet" className="border-t border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <Eyebrow>Fleet &amp; Company</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 max-w-[16ch] text-[36px] font-bold leading-[1.02] tracking-[-0.04em] text-fg sm:text-[56px]">
                Every carrier, truck, trailer and driver.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-fg-3 sm:text-[16px] lg:ml-auto">
              Each carrier gets its own profile and fee terms, its trucks and trailers, its drivers and their paperwork, with
              expiry dates watched for you.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:mt-16 lg:grid-cols-6">
          <Tile className="lg:col-span-3" title="Broker sheet & pitch" body="Everything a broker asks about the truck, written once and copied in one tap. Every line stays editable.">
            <PitchCard />
          </Tile>
          <Tile className="lg:col-span-3" delay={80} title="Units board" body="Truck, trailer and driver as one unit. Drop a trailer, hook another, run power only.">
            <UnitsCard />
          </Tile>
          <Tile className="lg:col-span-2" title="Trailer photos & specs" body="Six photo slots per trailer, and specs that follow the type: reefer unit, air chute, floor, deck, capacity.">
            <PhotosCard />
          </Tile>
          <Tile className="lg:col-span-2" delay={80} title="Expiry watch" body="CDL, medical card, insurance, registration and inspection dates, flagged before they lapse.">
            <ExpiringCard />
          </Tile>
          <Tile className="lg:col-span-2" delay={160} title="Credentials vault" body="Portal logins, accounts and contacts per carrier. Passwords are encrypted, readable only by the team.">
            <VaultCard />
          </Tile>
        </div>
      </div>
    </section>
  );
}

