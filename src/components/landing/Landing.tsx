"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/format";
import { Fleet } from "./Fleet";
import { Hero } from "./Hero";
import { Money } from "./Money";
import { Team } from "./Team";
import { Workflow } from "./Workflow";
import { Eyebrow, Reveal, Words } from "./motion";

// tosstms.com for visitors: what TOSS TMS does, shown with the product itself, and one way
// in (Sign in). Always dark, like the sign-in page. Signed-in people get the app at "/".

function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        solid ? "border-b border-line bg-bg/75 backdrop-blur-xl" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-fg" aria-label="TOSS TMS">
          <LogoMark className="h-[22px] w-auto" />
          <span className="rounded border border-line-strong px-1 py-px text-[9px] font-bold uppercase tracking-[0.14em] text-fg-3">TMS</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {[
            ["How it works", "#workflow"],
            ["Fleet", "#fleet"],
            ["Analytics", "#money"],
            ["Team", "#team"],
            ["Everything", "#everything"],
          ].map(([l, h]) => (
            <a key={h} href={h} className="rounded-full px-3 py-1.5 text-[13px] font-medium text-fg-3 transition-colors hover:text-fg">
              {l}
            </a>
          ))}
        </nav>
        <Link href="/login" className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-semibold text-brand-fg transition-colors hover:bg-brand-hover">
          Sign in
        </Link>
      </div>
    </header>
  );
}

const EVERYTHING: { group: string; items: string[] }[] = [
  {
    group: "Loads",
    items: [
      "Board, list and calendar views",
      "Rate con reading, reviewed before saving",
      "Multi-stop editor with appointments",
      "Highway miles and deadhead",
      "Status stepper and per-stop progress",
      "Re-assign truck, trailer and driver",
      "Activity log and notes",
      "Filters, bulk status, CSV and printable report",
    ],
  },
  {
    group: "Paperwork",
    items: [
      "Required documents per load stage",
      "One-click factoring packet",
      "Document types with expiry rules",
      "Private storage with short-lived links",
    ],
  },
  {
    group: "Billing",
    items: [
      "Ready to bill, per carrier",
      "Invoices from delivered loads",
      "Edit the invoice right on the page",
      "Additional charges and credits",
      "Payments, aging and overdue",
      "Custom invoices and PDF",
    ],
  },
  {
    group: "Fleet & Company",
    items: [
      "Carrier profiles and dispatch fee terms",
      "Trucks with broker sheet and pitch",
      "Trailers with specs, photos and drop & hook",
      "Units board",
      "Drivers with CDL and medical expiry",
      "Encrypted credentials vault",
    ],
  },
  {
    group: "Dashboard & analytics",
    items: [
      "Month KPIs and 12-week trend",
      "Which trucks need a load",
      "Today's pickups and deliveries",
      "By carrier, driver, truck, broker, lane and dispatcher",
    ],
  },
  {
    group: "Team",
    items: ["Admin panel with roles and activity log", "Profiles, hours and email signature", "Live updates for every dispatcher", "Light and dark, phone and desktop"],
  },
];

function Everything() {
  return (
    <section id="everything" className="border-t border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <Reveal>
              <Eyebrow>Everything in TOSS TMS</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-5 text-[32px] font-bold leading-[1.04] tracking-[-0.04em] text-fg sm:text-[44px]">The full list.</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-fg-3">Every field stays editable by hand. Nothing is locked behind a setting.</p>
            </Reveal>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {EVERYTHING.map((g, gi) => (
              <Reveal key={g.group} delay={(gi % 3) * 70}>
                <div className="border-t border-line-strong pt-4 text-[13px] font-semibold text-fg">{g.group}</div>
                <ul className="mt-3 space-y-2.5">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2.5 text-[13.5px] leading-snug text-fg-3">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-fg-4" />
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center text-[22vw] font-bold leading-[0.75] tracking-[-0.06em] text-white/[0.025]">
        TOSS
      </div>
      <div className="relative mx-auto max-w-[1240px] px-5 py-28 text-center sm:px-8 sm:py-40">
        <h2 className="mx-auto max-w-[16ch] text-[40px] font-bold leading-[1] tracking-[-0.045em] text-fg sm:text-[72px]">
          <Words text="Your desk is ready." />
        </h2>
        <Reveal delay={300}>
          <p className="mx-auto mt-6 max-w-[44ch] text-[15px] leading-relaxed text-fg-3 sm:text-[16px]">
            Sign in with the account your admin invited. Loads, fleets, paperwork and billing are waiting where you left them.
          </p>
        </Reveal>
        <Reveal delay={420} className="mt-10 flex justify-center">
          <Link
            href="/login"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-brand px-8 text-[16px] font-semibold text-brand-fg transition-colors hover:bg-brand-hover"
          >
            Sign in to TOSS TMS
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <Reveal delay={500}>
          <p className="mt-5 text-[12px] text-fg-4">Team access only. Accounts are created by an admin.</p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-10 text-[12px] text-fg-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5 text-fg">
          <LogoMark className="h-[18px] w-auto" />
          <span className="text-fg-4">TMS · Trucking One Stop Shop</span>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <a href="https://www.truckingonestopshop.net" className="transition-colors hover:text-fg">
            truckingonestopshop.net
          </a>
          <Link href="/login" className="transition-colors hover:text-fg">
            Sign in
          </Link>
          <span>© {new Date().getFullYear()} Trucking One Stop Shop</span>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <div className="dark min-h-dvh bg-bg text-fg [color-scheme:dark]">
      <Nav />
      <main>
        <Hero />
        <Workflow />
        <Fleet />
        <Money />
        <Team />
        <Everything />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
