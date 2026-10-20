"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/format";

// Motion for the landing page. Everything appears once, when it scrolls into view, and
// explains something (a load moving, a field filling in). Reduced motion: shown as is.

export const EASE = "cubic-bezier(.22,.8,.2,1)";

export const prefersStill = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** True once the element has been on screen (or right away with reduced motion). */
export function useInView<T extends Element>(opts: { margin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const { margin = "0px 0px -12% 0px", once = true } = opts;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersStill() || typeof IntersectionObserver === "undefined") {
      setInView(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin, once]);
  return [ref, inView] as const;
}

/** Fades and lifts its children in when they scroll into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as: Tag = "div",
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section" | "li" | "p" | "span" | "h2" | "h3";
  style?: CSSProperties;
}) {
  const [ref, on] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        ...style,
        opacity: on ? 1 : 0,
        transform: on ? "none" : `translateY(${y}px)`,
        filter: on ? "none" : "blur(6px)",
        transition: `opacity 800ms ${EASE} ${delay}ms, transform 900ms ${EASE} ${delay}ms, filter 800ms ${EASE} ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}

/** A headline whose words rise out of a mask one after another. */
export function Words({ text, className, delay = 0, step = 55 }: { text: string; className?: string; delay?: number; step?: number }) {
  const [ref, on] = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={cn("inline", className)} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span
            className="inline-block"
            style={{
              transform: on ? "none" : "translateY(105%)",
              transition: `transform 1000ms ${EASE} ${delay + i * step}ms`,
            }}
          >
            {w}
            {" "}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Counts up to `value` the first time it is seen. */
export function Count({ value, format = (n) => Math.round(n).toLocaleString("en-US"), duration = 1400, className }: { value: number; format?: (n: number) => string; duration?: number; className?: string }) {
  const [ref, on] = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (prefersStill()) {
      setShown(value); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setShown(value * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Hidden tabs pause animation frames: land on the value anyway.
    const done = window.setTimeout(() => setShown(value), duration + 200);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [on, value, duration]);
  return (
    <span ref={ref} className={cn("tnum", className)}>
      {format(shown)}
    </span>
  );
}

/** 0,1,2…n-1 on a timer while `active` (a demo playing its steps). */
export function useStep(n: number, ms: number, active: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (prefersStill()) {
      setI(n - 1); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const t = window.setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => window.clearInterval(t);
  }, [n, ms, active]);
  return i;
}

/** Small uppercase label with an index: "02 — Run the load". */
export function Eyebrow({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-4", className)}>
      {index && <span className="tnum text-fg-3">{index}</span>}
      {index && <span className="h-px w-8 bg-line-strong" />}
      <span>{children}</span>
    </div>
  );
}
