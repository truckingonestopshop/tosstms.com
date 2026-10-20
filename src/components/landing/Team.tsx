"use client";

import { useEffect, useState } from "react";
import { Moon, ShieldCheck, Sun } from "lucide-react";
import { cn } from "@/lib/format";
import { Panel } from "./frame";
import { Eyebrow, Reveal, useInView, useStep } from "./motion";

// The team side: who can do what, who people are, and everyone seeing the same thing.

const PEOPLE = [
  { name: "Dayana Villa", pos: "Senior Dispatcher", role: "Dispatcher", tz: "America/Chicago", initials: "DV", sa: false },
  { name: "Marco Ionescu", pos: "Billing", role: "Dispatcher", tz: "Europe/Chisinau", initials: "MI", sa: false },
  { name: "Victor Popa", pos: "Operations", role: "Owner", tz: "America/New_York", initials: "VP", sa: true },
];

function AdminCard() {
  return (
    <div className="space-y-2">
      {PEOPLE.map((p, i) => (
        <Reveal key={p.name} delay={i * 90} y={8} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/40 px-3.5 py-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-3 text-[10px] font-bold text-fg-2">{p.initials}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[12.5px] font-semibold text-fg">
              {p.name}
              {p.sa && <ShieldCheck className="h-3.5 w-3.5 text-fg-3" />}
            </div>
            <div className="truncate text-[11px] text-fg-4">{p.pos}</div>
          </div>
          <span className="rounded-md border border-line px-1.5 py-0.5 text-[10px] font-semibold text-fg-2">{p.role}</span>
        </Reveal>
      ))}
    </div>
  );
}

function LocalTimes() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date()); // eslint-disable-line react-hooks/set-state-in-effect
    const t = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="divide-y divide-line rounded-xl border border-line">
      {PEOPLE.map((p) => (
        <div key={p.name} className="flex items-center justify-between px-3.5 py-2.5">
          <div>
            <div className="text-[12.5px] font-semibold text-fg">{p.name}</div>
            <div className="text-[11px] text-fg-4">{p.tz.split("/")[1].replace("_", " ")}</div>
          </div>
          <span className="tnum text-[15px] font-semibold tracking-tight text-fg">
            {now ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: p.tz }) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}

const FEED = [
  ["Dayana", "moved #4471 to Delivered"],
  ["Marco", "recorded a $625.00 payment"],
  ["Mike Johnson", "POD added to #4471"],
  ["Dayana", "booked #4482 · Dallas, TX → Memphis, TN"],
  ["Victor", "invited Alina Rusu as Dispatcher"],
];

function LiveFeed() {
  const [ref, on] = useInView<HTMLDivElement>();
  const i = useStep(FEED.length, 1800, on);
  const shown = [0, 1, 2].map((k) => FEED[(i + FEED.length - k) % FEED.length]);
  return (
    <div ref={ref} className="space-y-2">
      {shown.map(([who, what], k) => (
        <div
          key={`${i}-${k}`}
          className={cn("flex items-center gap-2.5 rounded-xl border border-line px-3.5 py-2.5", k === 0 ? "animate-[lp-in_500ms_cubic-bezier(.22,.8,.2,1)_both] bg-surface-2/70" : "bg-surface-2/30")}
          style={{ opacity: 1 - k * 0.28 }}
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
          <span className="truncate text-[12px]">
            <span className="font-semibold text-fg">{who}</span> <span className="text-fg-3">{what}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

function Themes() {
  const [ref, on] = useInView<HTMLDivElement>();
  const light = useStep(2, 2200, on) === 1;
  return (
    <div ref={ref}>
      <div
        className={cn(
          "rounded-xl border p-3.5 transition-colors duration-700",
          light ? "border-zinc-200 bg-white text-zinc-900" : "border-line bg-surface-2 text-fg",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold">Load #4471</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors duration-700", light ? "bg-emerald-100 text-emerald-800" : "bg-emerald-500/10 text-emerald-300")}>Delivered</span>
        </div>
        <div className={cn("mt-2 text-[11px] transition-colors duration-700", light ? "text-zinc-500" : "text-fg-4")}>Chicago, IL → Atlanta, GA · $3,850</div>
        <div className={cn("mt-3 h-1.5 rounded-full transition-colors duration-700", light ? "bg-zinc-200" : "bg-surface-3")}>
          <div className={cn("h-full w-3/4 rounded-full transition-colors duration-700", light ? "bg-zinc-900" : "bg-fg")} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg bg-surface-2 p-0.5">
        {[
          { l: "Dark", i: Moon, on: !light },
          { l: "Light", i: Sun, on: light },
        ].map((o) => (
          <span key={o.l} className={cn("flex items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium transition-colors", o.on ? "bg-surface text-fg shadow-sm ring-1 ring-line" : "text-fg-4")}>
            <o.i className="h-3.5 w-3.5" /> {o.l}
          </span>
        ))}
      </div>
    </div>
  );
}

function Card({ title, body, children, delay = 0 }: { title: string; body: string; children: React.ReactNode; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <Panel className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex-1">{children}</div>
        <div className="mt-6">
          <div className="text-[14px] font-semibold text-fg">{title}</div>
          <div className="mt-1 text-[13px] leading-relaxed text-fg-3">{body}</div>
        </div>
      </Panel>
    </Reveal>
  );
}

export function Team() {
  return (
    <section id="team" className="border-t border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <Eyebrow>Team</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mt-5 max-w-[17ch] text-[36px] font-bold leading-[1.02] tracking-[-0.04em] text-fg sm:text-[56px]">
            One team, one screen, everyone in sync.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2">
          <Card title="Admin panel" body="Invite people, set their role and position, disable or remove a login. Every change is logged.">
            <AdminCard />
          </Card>
          <Card delay={80} title="Profiles" body="Photo, position, phone and extension, working hours and local time, with an email signature built in.">
            <LocalTimes />
          </Card>
          <Card delay={160} title="Live for everyone" body="A status change, a new document or a payment shows up on every dispatcher's screen as it happens.">
            <LiveFeed />
          </Card>
          <Card delay={240} title="Day and night shifts" body="Light and dark themes that follow the device, for the day desk and the night desk.">
            <Themes />
          </Card>
        </div>
      </div>
    </section>
  );
}
