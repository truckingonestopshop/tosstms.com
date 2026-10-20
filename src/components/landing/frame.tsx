import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { cn } from "@/lib/format";

/** The app window: the real TOSS TMS header bar over a piece of the product. */
export function AppFrame({ active = "Loads", children, className, bodyClassName }: { active?: string; children: ReactNode; className?: string; bodyClassName?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]", className)}>
      <div className="flex h-11 items-center gap-4 border-b border-line bg-surface/95 px-4">
        <div className="flex items-center gap-1.5 text-fg">
          <LogoMark className="h-[15px] w-auto" />
          <span className="rounded border border-line-strong px-1 text-[8px] font-bold uppercase tracking-[0.14em] text-fg-3">TMS</span>
        </div>
        <div className="hidden h-4 w-px bg-line sm:block" />
        <nav className="hidden items-center gap-0.5 sm:flex">
          {["Dashboard", "Loads", "Invoices", "Analytics", "Fleet & Company"].map((t) => (
            <span key={t} className={cn("rounded-md px-2 py-1 text-[11px] font-medium", t === active ? "bg-surface-2 text-fg" : "text-fg-4")}>
              {t}
            </span>
          ))}
        </nav>
        <span className="ml-auto h-6 w-6 rounded-full bg-surface-3 ring-1 ring-line-strong" />
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

/** Rounded panel used for the feature tiles. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-[20px] border border-line bg-surface", className)}>{children}</div>;
}

export const STATUS: Record<string, { label: string; dot: string; pill: string }> = {
  booked: { label: "Booked", dot: "bg-sky-400", pill: "bg-sky-500/10 text-sky-300 ring-sky-400/20" },
  in_transit: { label: "In transit", dot: "bg-amber-400", pill: "bg-amber-500/10 text-amber-300 ring-amber-400/20" },
  delivered: { label: "Delivered", dot: "bg-emerald-400", pill: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20" },
  invoiced: { label: "Invoiced", dot: "bg-zinc-300", pill: "bg-zinc-400/10 text-zinc-300 ring-zinc-300/20" },
  paid: { label: "Paid", dot: "bg-emerald-300", pill: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/25" },
};

export function Pill({ status, className }: { status: keyof typeof STATUS; className?: string }) {
  const s = STATUS[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset", s.pill, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export const money = (n: number, cents = false) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
