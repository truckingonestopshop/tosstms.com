"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { AppFrame, Pill, money, STATUS } from "./frame";
import { Count, EASE, Reveal, Words, prefersStill, useInView } from "./motion";

// First screen: the promise, one way in (Sign in), and the product doing its job right
// away — loads moving across the board from Booked to Paid.

type Stage = keyof typeof STATUS;
const STAGES: Stage[] = ["booked", "in_transit", "delivered", "invoiced", "paid"];

interface DemoLoad {
  n: number;
  from: string;
  to: string;
  truck: string;
  driver: string;
  gross: number;
  miles: number;
  stage: number;
}

const START: DemoLoad[] = [
  { n: 4471, from: "Chicago, IL", to: "Atlanta, GA", truck: "101", driver: "Mike Johnson", gross: 3850, miles: 716, stage: 0 },
  { n: 4468, from: "Dallas, TX", to: "Memphis, TN", truck: "104", driver: "Carlos Mendez", gross: 2400, miles: 452, stage: 1 },
  { n: 4466, from: "Columbus, OH", to: "Nashville, TN", truck: "102", driver: "Andrei Popescu", gross: 2150, miles: 380, stage: 1 },
  { n: 4459, from: "Indianapolis, IN", to: "Charlotte, NC", truck: "103", driver: "James Carter", gross: 3100, miles: 590, stage: 2 },
  { n: 4455, from: "Laredo, TX", to: "Kansas City, MO", truck: "106", driver: "Ion Rusu", gross: 3450, miles: 812, stage: 3 },
  { n: 4452, from: "Denver, CO", to: "Phoenix, AZ", truck: "105", driver: "Luis Garcia", gross: 3600, miles: 820, stage: 4 },
];

function useBoard(active: boolean) {
  const [loads, setLoads] = useState(START);
  const turn = useRef(0);
  useEffect(() => {
    if (!active || prefersStill()) return;
    const t = window.setInterval(() => {
      setLoads((ls) => {
        const i = turn.current % ls.length;
        turn.current++;
        return ls.map((l, k) => {
          if (k !== i) return l;
          // Paid loads come back as a new booking.
          return l.stage === 4 ? { ...l, stage: 0, n: l.n + 37 } : { ...l, stage: l.stage + 1 };
        });
      });
    }, 1900);
    return () => window.clearInterval(t);
  }, [active]);
  return loads;
}

function LoadCard({ l }: { l: DemoLoad }) {
  const rpm = l.gross / l.miles;
  return (
    <div className="animate-[lp-in_620ms_cubic-bezier(.22,.8,.2,1)_both] rounded-xl border border-line bg-surface-2/60 p-3">
      <div className="flex items-center justify-between">
        <span className="tnum text-[10px] font-semibold text-fg-4">#{l.n}</span>
        <span className="tnum text-[11px] font-semibold text-fg">{money(l.gross)}</span>
      </div>
      <div className="mt-1.5 text-[12px] font-semibold leading-tight text-fg">{l.from}</div>
      <div className="text-[12px] leading-tight text-fg-3">→ {l.to}</div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-fg-4">
        <span className="truncate">Truck #{l.truck} · {l.driver.split(" ")[0]}</span>
        <span className="tnum">${rpm.toFixed(2)}/mi</span>
      </div>
    </div>
  );
}

function Board() {
  const [ref, on] = useInView<HTMLDivElement>({ margin: "0px" });
  const loads = useBoard(on);
  return (
    <div ref={ref}>
      <AppFrame active="Loads" bodyClassName="p-4 sm:p-5">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: "Gross this month", v: 184320, f: (n: number) => money(n) },
            { label: "Dispatch fee", v: 18432, f: (n: number) => money(n) },
            { label: "On the road", v: 6, f: (n: number) => String(Math.round(n)) },
            { label: "Ready to bill", v: 4960, f: (n: number) => money(n) },
          ].map((k) => (
            <div key={k.label} className="rounded-xl border border-line px-3 py-2.5">
              <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-fg-4">{k.label}</div>
              <Count value={k.v} format={k.f} className="mt-0.5 block text-[17px] font-semibold tracking-tight text-fg" />
            </div>
          ))}
        </div>
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          <div className="grid min-w-[760px] grid-cols-5 gap-2.5">
            {STAGES.map((s) => {
              const here = loads.filter((l) => STAGES[l.stage] === s);
              return (
                <div key={s} className="min-h-[300px] rounded-[14px] bg-surface-2/40 p-2">
                  <div className="mb-2 flex items-center justify-between px-1 pt-0.5">
                    <Pill status={s} />
                    <span className="tnum text-[10px] text-fg-4">{here.length}</span>
                  </div>
                  <div className="space-y-2">
                    {here.map((l) => (
                      <LoadCard key={`${l.n}-${l.stage}`} l={l} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AppFrame>
    </div>
  );
}

export function Hero() {
  // The photo eases in and drifts slower than the page.
  const photo = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersStill()) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (photo.current) photo.current.style.transform = `translate3d(0, ${Math.min(window.scrollY, 900) * 0.28}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden">
      <div ref={photo} aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[86vh] min-h-[620px] will-change-transform">
        <Image
          src="/brand/login-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-[lp-ken_2600ms_cubic-bezier(.22,.8,.2,1)_both] object-cover object-[65%_center] opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/55 to-bg" />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-[1240px] px-5 pb-10 pt-36 sm:px-8 sm:pt-44 lg:pt-48">
        <Reveal>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Dispatch platform<span className="hidden sm:inline"> · Trucking One Stop Shop</span>
          </div>
        </Reveal>
        <h1 className="max-w-[15ch] text-[44px] font-bold leading-[0.98] tracking-[-0.045em] text-fg sm:text-[68px] lg:text-[92px]">
          <Words text="Dispatch" className="text-brand" />
          <Words text="every load. Keep every truck moving." delay={90} />
        </h1>
        <Reveal delay={420}>
          <p className="mt-7 max-w-[56ch] text-[16px] leading-relaxed text-fg-2 sm:text-[18px]">
            Book a load straight from the rate confirmation, run it stop by stop, keep every carrier&apos;s paperwork current
            and bill the dispatch fee on time. One workspace for the whole dispatch team.
          </p>
        </Reveal>
        <Reveal delay={560} className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/login"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[15px] font-semibold text-brand-fg transition-colors hover:bg-brand-hover"
          >
            Sign in
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#workflow"
            className="group inline-flex h-12 items-center gap-2 rounded-full border border-white/15 px-6 text-[15px] font-semibold text-fg transition-colors hover:border-white/30 hover:bg-white/5"
          >
            See how it works
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </Reveal>
      </div>

      <div className="mx-auto max-w-[1240px] px-5 pb-24 sm:px-8 sm:pb-32">
        <div style={{ animation: `lp-lift 1400ms ${EASE} 380ms both` }}>
          <Board />
        </div>
      </div>
    </section>
  );
}
