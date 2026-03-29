"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ListingCard, { ListingData } from "@/components/ListingCard";
import AnimatedSection from "@/components/AnimatedSection";
import { fetchAllListings, fetchPayoutPool } from "@/lib/solana";

// Helper to parse metadata
function parseMetadata(uri: string): { source: string; work: string; description?: string; imageUrl?: string } {
  if (uri.startsWith('data:application/json;base64,')) {
    try {
      const base64 = uri.replace('data:application/json;base64,', '');
      const json = JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
      return { source: json.source || 'other', work: json.work || 'Unknown', description: json.description, imageUrl: json.imageUrl };
    } catch (e) { return { source: 'other', work: uri }; }
  }
  if (uri.startsWith('ipfs://')) {
    const parts = uri.replace('ipfs://', '').split('/');
    return { source: parts[0] || 'other', work: parts.slice(1).join('/') || 'Unknown' };
  }
  return { source: 'other', work: uri };
}

const sourceLabels: Record<string, string> = {
  youtube: "YouTube", spotify: "Spotify", twitch: "Twitch", patreon: "Patreon",
  steam: "Steam", amazon: "Amazon KDP", substack: "Substack", podcast: "Podcast", other: "Various",
};

interface CreatorData {
  address: string;
  shortAddress: string;
  listings: ListingData[];
  totalRaised: number;
  contractsSold: number;
  totalPayouts: number;
  primaryPlatform: string;
}

export default function CreatorProfilePage() {
  const params = useParams();
  const creatorAddress = params.handle as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);

  // Fetch creator data from chain
  useEffect(() => {
    async function loadCreatorData() {
      setIsLoading(true);
      try {
        const allListings = await fetchAllListings();
        
        // Filter listings by this creator
        const creatorListings = allListings.filter(l => l.creator === creatorAddress);
        
        if (creatorListings.length === 0) {
          setCreatorData(null);
          setIsLoading(false);
          return;
        }

        // Calculate stats
        let totalRaised = 0;
        let contractsSold = 0;
        let totalPayouts = 0;
        const platformCounts: Record<string, number> = {};

        // Format listings and gather stats
        const formattedListings: ListingData[] = [];
        
        for (const l of creatorListings) {
          const metadata = parseMetadata(l.metadataUri || '');
          
          // Count platforms
          platformCounts[metadata.source] = (platformCounts[metadata.source] || 0) + 1;
          
          // Count sold listings
          if (l.status === 'Sold') {
            contractsSold++;
            totalRaised += l.priceUsdc;
          }

          // Check for payouts
          try {
            const pool = await fetchPayoutPool(l.publicKey);
            if (pool) {
              totalPayouts += pool.totalDepositedUsdc;
            }
          } catch (e) {}

          formattedListings.push({
            id: l.publicKey,
            creatorName: `${creatorAddress.slice(0, 4)}...${creatorAddress.slice(-4)}`,
            creatorAddress: creatorAddress,
            revenueSource: metadata.work !== 'Unknown' 
              ? `${sourceLabels[metadata.source] || metadata.source} - ${metadata.work}`
              : sourceLabels[metadata.source] || 'On-chain Listing',
            percentageOffered: l.percentage,
            duration: l.durationSeconds === 0 ? "Perpetual" : `${Math.floor(l.durationSeconds / (30 * 24 * 60 * 60))} months`,
            durationSeconds: l.durationSeconds,
            startTimestamp: l.startTimestamp,
            price: l.priceUsdc,
            imageUrl: metadata.imageUrl,
            description: metadata.description,
            platformIcon: metadata.source,
          });
        }

        // Find primary platform
        const primaryPlatform = Object.entries(platformCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'other';

        setCreatorData({
          address: creatorAddress,
          shortAddress: `${creatorAddress.slice(0, 4)}...${creatorAddress.slice(-4)}`,
          listings: formattedListings,
          totalRaised,
          contractsSold,
          totalPayouts,
          primaryPlatform,
        });
      } catch (error) {
        console.error("Failed to fetch creator data:", error);
        setCreatorData(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (creatorAddress && creatorAddress.length > 30) {
      loadCreatorData();
    } else {
      setIsLoading(false);
    }
  }, [creatorAddress]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/60">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!creatorData) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h1 className="text-3xl font-bold mb-4">Creator Not Found</h1>
          <p className="text-black/60 mb-8">
            This creator hasn't created any listings yet, or the address is invalid.
          </p>
          <Link
            href="/marketplace"
            className="inline-block px-6 py-3 bg-black text-white font-medium hover:bg-black/80 transition-colors"
          >
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  // Active listings only
  const activeListings = creatorData.listings.filter(l => !l.isSecondary);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 bg-black flex items-center justify-center text-white font-bold text-4xl">
                    {sourceLabels[creatorData.primaryPlatform]?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold font-mono">{creatorData.shortAddress}</h1>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 font-medium">
                        ON-CHAIN
                      </span>
                    </div>
                    <p className="text-black/60 text-sm font-mono break-all">{creatorData.address}</p>
                    <p className="text-black/60 mt-2">
                      Primary: {sourceLabels[creatorData.primaryPlatform] || 'Various'} • 
                      {creatorData.listings.length} listing{creatorData.listings.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <a
                    href={`https://explorer.solana.com/address/${creatorData.address}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-black/30 hover:border-black transition-colors"
                  >
                    View on Explorer ↗
                  </a>
                </div>
              </AnimatedSection>
            </div>

            {/* Stats Card */}
            <div className="lg:col-span-1">
              <AnimatedSection delay={0.2} direction="right">
                <div className="border border-black p-6">
                  <h3 className="font-bold mb-6">Creator Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-black/10">
                      <span className="text-black/60">Total Raised</span>
                      <span className="font-bold">${creatorData.totalRaised.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-black/10">
                      <span className="text-black/60">Contracts Sold</span>
                      <span className="font-bold">{creatorData.contractsSold}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-black/10">
                      <span className="text-black/60">Total Payouts</span>
                      <span className="font-bold text-green-600">${creatorData.totalPayouts.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-black/60">Active Listings</span>
                      <span className="font-medium">{activeListings.length}</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="border-b border-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-black p-4"
            >
              <p className="text-sm text-black/60">Total Listings</p>
              <p className="text-2xl font-bold">{creatorData.listings.length}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-black p-4"
            >
              <p className="text-sm text-black/60">Contracts Sold</p>
              <p className="text-2xl font-bold">{creatorData.contractsSold}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-black p-4"
            >
              <p className="text-sm text-black/60">Total Raised</p>
              <p className="text-2xl font-bold">${creatorData.totalRaised.toLocaleString()}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="border border-black p-4"
            >
              <p className="text-sm text-black/60">Paid Out</p>
              <p className="text-2xl font-bold text-green-600">${creatorData.totalPayouts.toLocaleString()}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-8">
              All Listings 
              <span className="text-black/40 font-normal ml-2">({creatorData.listings.length})</span>
            </h2>
          </AnimatedSection>

          {creatorData.listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creatorData.listings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="border border-black/20 p-12 text-center">
              <p className="text-black/60">No listings yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Interested in this creator's royalties?</h3>
              <p className="text-white/60">
                Browse their listings or explore more creators on the marketplace.
              </p>
            </div>
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Explore Marketplace
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


