import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";

// tosstms.com for visitors (proxy.ts shows this at "/" when nobody is signed in).
export const metadata: Metadata = {
  title: { absolute: "TOSS TMS · Dispatch every load, keep every truck moving" },
  description:
    "The dispatch platform of Trucking One Stop Shop: book loads from the rate confirmation, run them stop by stop, keep carrier paperwork current and bill the dispatch fee on time.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "TOSS TMS",
    description: "Dispatch every load. Keep every truck moving.",
    images: ["/brand/login-hero.png"],
  },
};

export default function WelcomePage() {
  return <Landing />;
}
