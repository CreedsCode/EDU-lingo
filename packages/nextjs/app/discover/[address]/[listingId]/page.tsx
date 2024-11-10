"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatEther, parseEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface Listing {
  creator: string;
  isTeaching: boolean;
  language: string;
  rate: bigint;
  isActive: boolean;
}

export default function ListingDetail() {
  const params = useParams();
  const address = params.address as string;
  const listingId = parseInt(params.listingId as string);

  const [listing, setListing] = useState<Listing | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  // Get contract instances
  const { data: eduContract } = useScaffoldContract({ contractName: "EduLingo" });
  const { data: tokenContract } = useScaffoldContract({ contractName: "MockERC20" });

  // Read user's listings
  const { data: userListings } = useScaffoldReadContract({
    contractName: "EduLingo",
    functionName: "getUserListings",
    args: [address as `0x${string}`],
  });

  // Get token allowance
  const { data: allowance } = useScaffoldReadContract({
    contractName: "MockERC20",
    functionName: "allowance",
    args: [address as `0x${string}`, eduContract?.address as `0x${string}`],
  });

  const { writeContractAsync: eduLingoWrite } = useScaffoldWriteContract("EduLingo");
  const { writeContractAsync: approveTokens } = useScaffoldWriteContract("MockERC20");

  useEffect(() => {
    if (userListings && userListings.length > listingId) {
      setListing(userListings[listingId]);
    }
  }, [userListings, listingId]);

  useEffect(() => {
    if (allowance && listing) {
      setIsApproved(allowance >= listing.rate);
    }
  }, [allowance, listing]);

  const handleApprove = async () => {
    if (!eduContract?.address || !listing) return;

    try {
      await approveTokens({
        functionName: "approve",
        args: [eduContract.address, listing.rate],
      });
      setIsApproved(true);
    } catch (error) {
      console.error("Error approving tokens:", error);
    }
  };

  const handleBuy = async () => {
    if (!listing) return;

    try {
      await eduLingoWrite({
        functionName: "purchaseListing",
        args: [address as `0x${string}`, BigInt(listingId)],
      });
      // Optionally refresh the listing status after purchase
      if (userListings && userListings.length > listingId) {
        setListing(userListings[listingId]);
      }
    } catch (error) {
      console.error("Error purchasing lesson:", error);
    }
  };

  if (!listing) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="card bg-base-200 shadow-xl p-6">
        <h1 className="text-3xl font-bold mb-6">
          {listing.isTeaching ? "Teaching" : "Learning"} {listing.language}
        </h1>

        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Creator:</span>
            <Address address={listing.creator} />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">Rate:</span>
            <span>{formatEther(listing.rate)} MOCK</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">Status:</span>
            <span className={`badge ${listing.isActive ? "badge-success" : "badge-error"}`}>
              {listing.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="flex gap-4 mt-6">
            {!isApproved && (
              <button className="btn btn-primary" onClick={handleApprove}>
                Approve MOCK Token
              </button>
            )}

            <button className="btn btn-secondary" onClick={handleBuy} disabled={!isApproved}>
              Book Lesson
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
