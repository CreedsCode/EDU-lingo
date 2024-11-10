"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const router = useRouter();
  const { address: connectedAddress } = useAccount();
  const [isTeaching, setIsTeaching] = useState(true);
  const [language, setLanguage] = useState("");
  const [rate, setRate] = useState("");

  // Setup contract write hook for creating listing
  const { writeContractAsync: createListing, isMining: isCreatingListing } = useScaffoldWriteContract("EduLingo");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createListing({
        functionName: "createListing",
        args: [isTeaching, language, BigInt(rate)],
      });
      router.push("/discover");
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Create New</span>
            <span className="block text-4xl font-bold">Language Listing</span>
          </h1>

          {/* Create Listing Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Listing Type</h3>
              <div className="flex gap-4">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    checked={isTeaching}
                    onChange={() => setIsTeaching(true)}
                    className="radio mr-2"
                  />
                  Teaching
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    checked={!isTeaching}
                    onChange={() => setIsTeaching(false)}
                    className="radio mr-2"
                  />
                  Learning
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Language</h3>
              <input
                type="text"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter language"
                required
              />
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Rate (for one session)</h3>
              <input
                type="number"
                value={rate}
                onChange={e => setRate(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter rate"
                required
                min="0"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isCreatingListing}>
              {isCreatingListing ? "Creating..." : "Create Listing"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
