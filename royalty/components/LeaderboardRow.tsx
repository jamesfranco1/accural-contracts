import Link from "next/link";

export interface LeaderboardRowProps {
  rank: number;
  creatorName: string;
  totalRaised: string;
  contractsSold: number;
  profileLink: string;
  handle?: string;
}

export default function LeaderboardRow({
  rank,
  creatorName,
  totalRaised,
  contractsSold,
  profileLink,
  handle,
}: LeaderboardRowProps) {
  return (
    <tr className="bg-white hover:bg-gray-50 transition-colors">
      <td className="border border-black p-4 text-center font-bold text-lg">
        {rank}
      </td>
      <td className="border border-black p-4">
        <div className="flex items-center gap-3">
          {/* Placeholder avatar */}
          <div className="w-10 h-10 bg-black flex items-center justify-center text-white font-bold text-sm">
            {creatorName.charAt(0)}
          </div>
          <div>
            <p className="font-bold">{creatorName}</p>
            {handle && (
              <p className="text-sm text-black/60">@{handle}</p>
            )}
          </div>
        </div>
      </td>
      <td className="border border-black p-4 text-right font-bold">
        {totalRaised}
      </td>
      <td className="border border-black p-4 text-center font-medium">
        {contractsSold}
      </td>
      <td className="border border-black p-4 text-center">
        <Link
          href={profileLink}
          className="inline-block px-4 py-2 border border-black text-sm font-medium hover:bg-black hover:text-white transition-colors"
        >
          View Profile
        </Link>
      </td>
    </tr>
  );
}


