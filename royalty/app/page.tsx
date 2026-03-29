"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Hero from "@/components/Hero";

function FullSection({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`premium-section relative flex min-h-screen flex-col justify-center ${className}`}>
      {children}
    </section>
  );
}

function AnimatedHeadline({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const words = text.split(" ");

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}

const explanationCards = [
  {
    number: "01",
    title: "What are Royalties?",
    description:
      "Royalties are contractual rights to a share of future revenue. When you buy a royalty token, you gain legal ownership of a percentage of a creator's earnings.",
  },
  {
    number: "02",
    title: "Why Creators Sell",
    description:
      "Creators sell future revenue to raise upfront capital today. Fund a new project, cover production costs, or unlock liquidity without giving up creative control.",
  },
  {
    number: "03",
    title: "Why Investors Buy",
    description:
      "Investors buy royalties to participate in a creator's success. Earn passive income from revenue streams, speculate on future earnings, or trade tokens.",
  },
];

const howItWorksSteps = [
  { step: "01", title: "Verify", description: "Creator verifies identity and connects revenue accounts" },
  { step: "02", title: "Issue", description: "Creator issues a royalty contract with terms" },
  { step: "03", title: "Buy", description: "Investors purchase royalty tokens with USDC" },
  { step: "04", title: "Mint", description: "NFT receipt minted linking to legal contract" },
  { step: "05", title: "Report", description: "Creator reports revenue through the platform" },
  { step: "06", title: "Earn", description: "Token holders receive their share of revenue" },
  { step: "07", title: "Trade", description: "Tokens can be resold on secondary market" },
];

export default function Home() {
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);

  const section2InView = useInView(section2Ref, { once: true, margin: "-30%" });
  const section3InView = useInView(section3Ref, { once: true, margin: "-30%" });
  const section4InView = useInView(section4Ref, { once: true, margin: "-30%" });
  const section5InView = useInView(section5Ref, { once: true, margin: "-30%" });

  return (
    <div className="text-white">
      <Hero />

      <FullSection className="pt-6" id="understanding">
        <div ref={section2Ref} className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={section2InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="premium-kicker">Why royalties</span>
          </motion.div>

          <AnimatedHeadline
            text="A new financial primitive for the creator economy."
            className="mb-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-6xl"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={section2InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="premium-muted mb-14 max-w-3xl text-lg leading-8"
          >
            Royalties turn future creator income into something investors can understand, price, and trade.
            The platform works best when the experience feels credible, polished, and built for real capital.
          </motion.p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
            {explanationCards.map((card, index) => (
              <motion.div
                key={card.number}
                initial={{ opacity: 0, y: 60 }}
                animate={section2InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + index * 0.15 }}
                className="premium-panel group p-8"
              >
                <div className="border-t border-white/10 pt-6">
                  <span className="text-6xl font-semibold text-white/10 transition-colors group-hover:text-white/20">
                    {card.number}
                  </span>
                  <h3 className="mb-3 mt-4 text-xl font-semibold text-white">{card.title}</h3>
                  <p className="leading-relaxed text-white/60">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={section2InView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16 h-px origin-left bg-white/10"
          />
        </div>
      </FullSection>

      <FullSection id="how-it-works">
        <div ref={section3Ref} className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={section3InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="premium-kicker">How it works</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={section3InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="max-w-3xl text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-6xl"
          >
            From creation to trading.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={section3InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="premium-muted mb-16 mt-6 max-w-3xl text-lg leading-8"
          >
            A cleaner process gives both creators and investors confidence from issuance through secondary trading.
          </motion.p>

          <div className="premium-panel-strong relative p-8 md:p-10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={section3InView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="absolute left-10 right-10 top-16 hidden h-px origin-left bg-white/15 lg:block"
            />

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-7">
              {howItWorksSteps.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 40 }}
                  animate={section3InView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="relative"
                >
                  <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl">
                    <span className="text-xl font-semibold text-white">{item.step}</span>
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/50">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={section3InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-16 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/sell"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 font-semibold text-slate-950 hover:bg-white/90"
              >
                Start Selling
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-8 py-4 font-semibold text-white hover:bg-white/10"
              >
                Browse Marketplace
              </Link>
            </motion.div>
          </div>
        </div>
      </FullSection>

      <FullSection id="leaderboard">
        <div ref={section4Ref} className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={section4InView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="premium-kicker">Discovery</span>
          </motion.div>

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={section4InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mb-8 text-4xl font-semibold leading-[1.06] tracking-tight text-white md:text-5xl lg:text-6xl"
              >
                Join the leaders.
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={section4InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8 text-xl text-white/60"
              >
                Track creator performance and discover opportunities on the leaderboard.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={section4InView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Link href="/leaderboard" className="group inline-flex items-center gap-2 text-lg font-medium text-white">
                  View Leaderboard
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={section4InView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-center justify-center"
            >
              <div className="premium-panel-strong w-full max-w-xl p-12 text-center">
                <p className="mb-4 text-4xl font-semibold text-white">Leaderboard</p>
                <p className="text-white/60">Rankings based on real on-chain activity</p>
                <Link
                  href="/leaderboard"
                  className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-white/90"
                >
                  View Rankings
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </FullSection>

      <FullSection id="cta">
        <div ref={section5Ref} className="mx-auto w-full max-w-7xl px-6 py-24 text-center lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={section5InView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="premium-panel-strong px-6 py-16 md:px-10"
          >
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              animate={section5InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8 text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              The future of
              <br />
              creator financing.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={section5InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mx-auto mb-12 max-w-2xl text-xl text-white/60 md:text-2xl"
            >
              Join creators and investors using royalties.fun to unlock new opportunities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={section5InView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/sell"
                className="inline-flex items-center justify-center rounded-full bg-white px-10 py-5 text-lg font-semibold text-slate-950 hover:-translate-y-0.5 hover:bg-white/90"
              >
                Sell Royalties
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-10 py-5 text-lg font-semibold text-white hover:bg-white/10"
              >
                Explore Marketplace
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </FullSection>
    </div>
  );
}
