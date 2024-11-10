"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useScaffoldEventHistory } from "~~/hooks/scaffold-eth";

interface Listing {
  creator: string;
  isTeaching: boolean;
  language: string;
  rate: bigint;
  blockNumber: bigint;
  listingId: bigint;
}

const Home: NextPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  // Get all listing events
  const { data: listingEvents, isLoading } = useScaffoldEventHistory({
    contractName: "EduLingo",
    eventName: "ListingCreated",
    fromBlock: 0n,
    watch: true,
  });

  useEffect(() => {
    if (listingEvents) {
      const formattedListings = listingEvents.map((event, index) => ({
        creator: event.args.creator,
        isTeaching: event.args.isTeaching,
        language: event.args.language,
        rate: event.args.rate,
        blockNumber: event.blockNumber,
        listingId: event.args.listingId,
      }));
      setListings(formattedListings);
    }
  }, [listingEvents]);

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5">
        <h1 className="text-center mb-8">
          <span className="block text-4xl font-bold">Language Listings</span>
        </h1>

        <Link href="/discover/create" className="btn btn-primary mb-8">
          Create New Listing
        </Link>

        {isLoading ? (
          <div className="text-center">Loading listings...</div>
        ) : (
          <div className="grid gap-4 max-w-2xl mx-auto">
            {listings.map((listing, index) => (
              <Link
                href={`/discover/${listing.creator}/${listing.listingId}`}
                key={`${listing.creator}-${listing.listingId}`}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <div className="card-body">
                  <h2 className="card-title">
                    {listing.isTeaching ? "Teaching" : "Learning"} {listing.language}
                  </h2>
                  <p>Rate: {listing.rate.toString()} tokens per session</p>
                  <div className="text-sm opacity-70">Created by: {listing.creator}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
