"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import PlaceholderCrownLogo from "./PlaceholderCrownLogo";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/companies", label: "Companies", isNew: true },
  { href: "/sell", label: "Sell" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/docs", label: "Docs" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { connected, publicKey, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering wallet state after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleConnectWallet = () => {
    setVisible(true);
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8">
        <div className="premium-panel flex h-16 items-center justify-between px-5 sm:px-6">
          {/* Left side - Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
            <PlaceholderCrownLogo size={32} />
            <div>
              <span className="block text-base font-semibold tracking-tight text-white sm:text-lg">royalties.fun</span>
              <span className="hidden text-[11px] uppercase tracking-[0.24em] text-white/45 sm:block">
                creator finance
              </span>
            </div>
          </Link>

          {/* Center - Nav links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-sm font-medium transition-colors relative
                  ${pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) 
                    ? "text-white" 
                    : "text-white/55 hover:text-white"}
                `}
              >
                {link.label}
                {link.isNew && (
                  <span className="absolute -top-2 -right-3 rounded-full border border-white/10 bg-white/10 px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Right side - Wallet */}
          <div className="hidden md:flex items-center">
            {!mounted ? (
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/75">
                Loading...
              </div>
            ) : connected && publicKey ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3.5 py-2 shadow-panel">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                  <span className="font-mono text-sm text-white/85">{truncateAddress(publicKey.toString())}</span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-white/55 hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="rounded-full border border-white/12 bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-panel hover:bg-white/90"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
