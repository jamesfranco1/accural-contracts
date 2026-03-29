"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const highlights = [
  { label: "Settles", value: "<1 min", detail: "Fast on-chain royalty trading" },
  { label: "Structure", value: "Legal + NFT", detail: "Rights paired with a digital receipt" },
  { label: "Liquidity", value: "24/7", detail: "Creators raise upfront, investors trade anytime" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-10">
      <div className="pointer-events-none absolute inset-0 bg-premium-grid opacity-30 [background-size:72px_72px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:px-8 lg:py-28">
        <div className="flex max-w-3xl flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="premium-kicker"
          >
            Premium creator markets
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
            className="mt-8 text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            Buy and sell creator royalties with a market that feels built for capital.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: "easeOut" }}
            className="premium-muted mt-7 max-w-2xl text-lg leading-8 md:text-xl"
          >
            Creators monetize future revenue without giving up control. Investors access structured,
            tradeable cash-flow exposure on-chain through a cleaner, more credible marketplace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: "easeOut" }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/sell"
              className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-semibold text-slate-950 shadow-ambient hover:-translate-y-0.5 hover:bg-white/90"
            >
              Start Selling
              <motion.span className="ml-2 inline-block" initial={{ x: 0 }} whileHover={{ x: 4 }}>
                {"->"}
              </motion.span>
            </Link>

            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/[0.06] px-8 py-4 text-lg font-semibold text-white backdrop-blur-xl hover:bg-white/10"
            >
              Explore Marketplace
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.55, ease: "easeOut" }}
            className="mt-14 grid gap-4 sm:grid-cols-3"
          >
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">{item.label}</p>
                <p className="mt-4 text-2xl font-semibold text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">{item.detail}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
          className="premium-panel-strong hidden min-h-[560px] flex-col justify-between p-8 lg:flex"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/40">Market overview</p>
              <p className="mt-3 text-2xl font-semibold text-white">A premium home for creator cash flows</p>
            </div>
            <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Live
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.045] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-white/40">Primary listing</p>
                  <p className="mt-3 text-3xl font-semibold text-white">$125,000</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs text-white/65">
                  Music catalog
                </span>
              </div>
              <p className="mt-5 text-sm leading-6 text-white/55">
                Structured exposure to future streaming and licensing revenue with a verified creator profile.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Settlement</p>
                <p className="mt-3 text-xl font-semibold text-white">On-chain ownership</p>
                <p className="mt-2 text-sm leading-6 text-white/55">Every trade leaves a verifiable trail.</p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Secondary market</p>
                <p className="mt-3 text-xl font-semibold text-white">Continuous liquidity</p>
                <p className="mt-2 text-sm leading-6 text-white/55">Move from issuance to trading in one venue.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-white/40">Positioning</p>
                <p className="mt-2 text-lg font-medium text-white">
                  Built for creators, collectors, and more serious capital.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/45">Marketplace quality</p>
                <p className="mt-1 text-2xl font-semibold text-white">Premium</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
