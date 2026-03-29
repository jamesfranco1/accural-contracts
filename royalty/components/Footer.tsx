import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 pb-6 sm:px-6 lg:px-8 lg:pb-8">
        <div className="premium-panel-strong grid grid-cols-1 gap-12 px-6 py-12 md:grid-cols-4 md:px-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/newlogo.jpg" 
                alt="royalties.fun logo" 
                width={32} 
                height={32}
                className="rounded-xl"
              />
              <div>
                <span className="block text-lg font-semibold text-white">royalties.fun</span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-white/40">premium creator markets</span>
              </div>
            </div>
            <p className="text-sm text-white/60">
              The on-chain marketplace for creator royalties.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-white/55">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/marketplace" className="text-sm text-white/60 hover:text-white transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-sm text-white/60 hover:text-white transition-colors">
                  Sell Royalties
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-sm text-white/60 hover:text-white transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-white/60 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-white/55">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-sm text-white/60 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-white/55">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://x.com/royaltiesfun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/jamesdfranco/royalties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
