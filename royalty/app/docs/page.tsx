"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  { id: "fees", label: "Fee Structure" },
  { id: "trading", label: "Trading Mechanics" },
  { id: "nft", label: "NFT Mechanics" },
  { id: "legality", label: "Contract Legality" },
  { id: "payouts", label: "Payout Mechanics" },
  { id: "protection", label: "Buyer Protection" },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("fees");

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => ({
        id: s.id,
        element: document.getElementById(s.id)
      }));

      // Find which section is currently in view
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const { id, element } = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
            <p className="text-xl text-black/60 max-w-2xl">
              Complete technical and legal documentation for the Royalties.fun platform.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-12">
          {/* Sidebar Navigation */}
          <nav className="hidden lg:block py-12 sticky top-20 self-start">
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-black text-white font-medium"
                        : "text-black/60 hover:text-black hover:bg-gray-100"
                    }`}
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="lg:col-span-3 py-12 border-l border-black/10 lg:pl-12">
            {/* Fee Structure */}
            <section id="fees" className="mb-20 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">Fee Structure</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Primary Sale Fee</h3>
                  <p className="text-black/70 mb-4">
                    When a creator sells royalties for the first time, the platform takes a percentage 
                    of the sale as a fee. This fee funds platform operations and triggers token buybacks.
                  </p>
                  <div className="border border-black p-4 inline-block">
                    <span className="text-sm text-black/60">Platform Fee</span>
                    <p className="text-2xl font-bold">5%</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Secondary Resale Fee</h3>
                  <p className="text-black/70 mb-4">
                    When royalty tokens are resold on the secondary market, fees are collected from 
                    both the platform and optionally the original creator.
                  </p>
                  <div className="flex gap-4">
                    <div className="border border-black p-4">
                      <span className="text-sm text-black/60">Platform Fee</span>
                      <p className="text-2xl font-bold">2.5%</p>
                    </div>
                    <div className="border border-black p-4">
                      <span className="text-sm text-black/60">Creator Royalty</span>
                      <p className="text-2xl font-bold">0-10%</p>
                      <p className="text-xs text-black/40">Set by creator</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Buyback Trigger</h3>
                  <p className="text-black/70 mb-4">
                    Fees are collected in USDC and held in the platform treasury. A backend server 
                    monitors all transactions and calculates platform revenue in real-time.
                  </p>
                  <div className="bg-gray-50 border border-black/10 p-6">
                    <p className="font-medium mb-2">Process:</p>
                    <ol className="list-decimal list-inside space-y-2 text-black/70">
                      <li>Transaction completes on-chain</li>
                      <li>Server listener detects fee collection</li>
                      <li>Revenue is calculated (platform cut only)</li>
                      <li>3× the revenue is used to buy tokens</li>
                      <li>Purchased tokens are sent to Sol Incinerator</li>
                    </ol>
                  </div>
                </div>
              </div>
            </section>

            {/* Trading Mechanics */}
            <section id="trading" className="mb-20 pt-8 border-t border-black/10 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">Trading Mechanics</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Royalty Token Minting</h3>
                  <p className="text-black/70 mb-4">
                    When a creator lists royalties for sale, a token (NFT or SFT) is minted representing 
                    ownership of those royalty rights. The token contains metadata linking to the legal contract.
                  </p>
                  <div className="bg-gray-50 border border-black/10 p-6 font-mono text-sm">
                    <p className="text-black/40 mb-2">// Token metadata structure</p>
                    <p>{`{`}</p>
                    <p className="pl-4">&quot;name&quot;: &quot;ROYALTY-[CREATOR]-[ID]&quot;,</p>
                    <p className="pl-4">&quot;symbol&quot;: &quot;ROYAL&quot;,</p>
                    <p className="pl-4">&quot;uri&quot;: &quot;ipfs://[CONTRACT_PDF_HASH]&quot;,</p>
                    <p className="pl-4">&quot;attributes&quot;: [{`...`}]</p>
                    <p>{`}`}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Buy and Sell Orders</h3>
                  <p className="text-black/70 mb-4">
                    All trades are executed through smart contracts that ensure proper fee distribution:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Seller lists token with asking price</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Buyer submits purchase transaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Smart contract splits payment: seller, platform fee, creator royalty</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Token transfers to buyer atomically</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Price Discovery</h3>
                  <p className="text-black/70">
                    Prices are set by sellers on the secondary market. The platform displays historical 
                    price data, trading volume, and comparable sales to help buyers make informed decisions. 
                    No automated market making is used—all trades are peer-to-peer.
                  </p>
                </div>
              </div>
            </section>

            {/* NFT Mechanics */}
            <section id="nft" className="mb-20 pt-8 border-t border-black/10 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">NFT Mechanics</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Token Representation</h3>
                  <p className="text-black/70 mb-4">
                    Each royalty contract is represented by an NFT (or SFT for fractional ownership). 
                    The token metadata includes an IPFS link to the legally binding PDF contract.
                  </p>
                  <div className="border border-black p-6">
                    <p className="font-medium mb-4">Token = Ownership</p>
                    <p className="text-black/60">
                      Holding the NFT means you own the royalty rights defined in the contract. 
                      The blockchain provides immutable proof of ownership and transfer history.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Transferability</h3>
                  <p className="text-black/70 mb-4">
                    By default, tokens can be freely transferred or sold on the secondary market. 
                    Creators can optionally disable resale, locking the token to the initial buyer.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border border-black p-4">
                      <p className="font-medium mb-2">Resale Enabled</p>
                      <p className="text-sm text-black/60">Token can be listed and sold on secondary market</p>
                    </div>
                    <div className="border border-black p-4">
                      <p className="font-medium mb-2">Resale Disabled</p>
                      <p className="text-sm text-black/60">Token is soulbound to initial buyer</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Payout Identification</h3>
                  <p className="text-black/70">
                    The payout smart contract queries on-chain ownership to determine who receives 
                    royalty distributions. Current holder at time of payout receives the funds—no 
                    manual updates required.
                  </p>
                </div>
              </div>
            </section>

            {/* Contract Legality */}
            <section id="legality" className="mb-20 pt-8 border-t border-black/10 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">Contract Legality</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Digital Signature</h3>
                  <p className="text-black/70 mb-4">
                    Creators sign the contract by signing a transaction with their wallet. 
                    This cryptographic signature serves as a legally binding electronic signature 
                    under electronic signature laws in most jurisdictions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Contract Contents</h3>
                  <p className="text-black/70 mb-4">The PDF contract includes:</p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Creator legal name or publicly known alias</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Identifiable X/Twitter account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Wallet address used for signing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Revenue source and percentage being sold</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Duration and payment terms</span>
                    </li>
                  </ul>
                  <div className="bg-gray-50 border border-black/10 p-6">
                    <p className="font-medium mb-2">Wallet Signature + Published PDF = Legally Binding</p>
                    <p className="text-sm text-black/60">
                      The combination of cryptographic wallet signature and the immutable PDF 
                      stored on IPFS creates an enforceable agreement in most jurisdictions 
                      under electronic signature laws (ESIGN Act, eIDAS, etc.).
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Transfer of Rights</h3>
                  <p className="text-black/70">
                    Buyers own royalty rights as long as they hold the NFT. Transfer of the NFT 
                    equals transfer of the legal royalty rights defined in the contract. 
                    Blockchain ownership serves as proof of assignment.
                  </p>
                </div>

                <div className="border-2 border-black p-6 bg-gray-50">
                  <p className="font-bold mb-2">Key Points</p>
                  <ul className="space-y-2 text-black/70">
                    <li>• The agreement is enforceable in traditional courts</li>
                    <li>• Blockchain ownership acts as proof of assignment</li>
                    <li>• Transfer of NFT = Transfer of legal royalty rights</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payout Mechanics */}
            <section id="payouts" className="mb-20 pt-8 border-t border-black/10 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">Payout Mechanics</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Revenue Reporting (v1)</h3>
                  <p className="text-black/70 mb-4">
                    In the initial version, creators manually report and submit revenue. 
                    Automated integrations with platforms like YouTube, Spotify, and Patreon 
                    are planned for future versions.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Payout Process</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <div>
                        <p className="font-medium">Creator Deposits</p>
                        <p className="text-sm text-black/60">Creator deposits USDC into the payout contract</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <div>
                        <p className="font-medium">Holder Identification</p>
                        <p className="text-sm text-black/60">Contract queries current NFT holders</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <div>
                        <p className="font-medium">Pro-Rata Distribution</p>
                        <p className="text-sm text-black/60">Smart contract distributes funds proportionally to all holders</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Distribution Example</h3>
                  <div className="bg-gray-50 border border-black/10 p-6">
                    <p className="text-sm text-black/60 mb-4">Creator sold 10% of royalties split into 10 tokens (1% each)</p>
                    <p className="text-sm text-black/60 mb-2">Creator reports $1,000 monthly revenue</p>
                    <p className="font-medium">Each token holder receives: <span className="text-xl">$10/month</span></p>
                  </div>
                </div>
              </div>
            </section>

            {/* Buyer Protection */}
            <section id="protection" className="mb-20 pt-8 border-t border-black/10 scroll-mt-24">
              <h2 className="text-3xl font-bold mb-8">Buyer Protection</h2>
              
              <div className="space-y-8">
                <div className="border-2 border-black p-6 bg-gray-50">
                  <h3 className="text-xl font-bold mb-4">Platform-Sponsored Enforcement</h3>
                  <p className="text-black/70 mb-4">
                    Royalties.fun actively protects buyers. If discrepancies arise between 
                    reported revenue and actual earnings, the platform sponsors enforcement 
                    actions on behalf of token holders.
                  </p>
                  <p className="text-black/70">
                    This means you don&apos;t have to pursue legal action alone—the platform 
                    handles disputes and enforcement at no additional cost to buyers.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Verified Revenue Reporting</h3>
                  <p className="text-black/70 mb-4">
                    Creators are required to provide proof of revenue with each payout submission:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Platform dashboard screenshots (YouTube Studio, Spotify for Artists, etc.)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Payment receipts and bank statements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>API integrations where available</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Dispute Resolution</h3>
                  <p className="text-black/70 mb-4">
                    If you believe a creator is underreporting revenue:
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                      <div>
                        <p className="font-medium">Submit a Dispute</p>
                        <p className="text-sm text-black/60">Flag the contract through your dashboard with evidence</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                      <div>
                        <p className="font-medium">Platform Review</p>
                        <p className="text-sm text-black/60">Our team investigates and requests documentation from the creator</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                      <div>
                        <p className="font-medium">Resolution & Enforcement</p>
                        <p className="text-sm text-black/60">Platform-sponsored legal action if necessary, at no cost to buyers</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Creator Accountability</h3>
                  <p className="text-black/70 mb-4">
                    Every creator on the platform is verified through:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Linked and verified social accounts (X/Twitter required)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Wallet signature on legally binding contract</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Public reputation tied to their royalty performance</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 bg-black mt-2 flex-shrink-0" />
                      <span>Leaderboard ranking based on payout history</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black text-white p-6">
                  <p className="font-bold mb-2">Your Investment is Protected</p>
                  <p className="text-white/70">
                    We require proof of revenue, actively monitor for discrepancies, and 
                    sponsor enforcement when needed. Creators who fail to meet their obligations 
                    are publicly flagged and permanently banned from the platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Back to Token */}
            <div className="pt-8 border-t border-black/10">
              <Link
                href="/token"
                className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Token
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
