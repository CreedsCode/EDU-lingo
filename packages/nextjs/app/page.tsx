"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { AcademicCapIcon, GlobeAltIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="flex items-center flex-col flex-grow pt-10">
      {/* Hero Section */}
      <div className="px-5 max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-6">
          <span className="text-pink-400">EDU</span>-Lingo
        </h1>
        <p className="text-2xl mb-8">Unlock the world one native speaker at a time</p>

        <div className="mb-8">
          <Link
            href="/start"
            className="bg-pink-400 text-white px-8 py-3 rounded-full text-lg hover:bg-pink-500 transition-colors"
          >
            Try it Now
          </Link>
        </div>

        <div className="flex justify-center items-center space-x-2 mb-8">
          <p className="font-medium">Connected as:</p>
          <Address address={connectedAddress} />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 px-8 py-12 max-w-6xl">
        <div className="bg-white bg-opacity-10 p-6 rounded-xl">
          <UserGroupIcon className="h-12 w-12 text-pink-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">1-on-1 Sessions</h3>
          <p className="text-gray-300">
            Connect with certified native speakers for personalized language learning experiences
          </p>
        </div>

        <div className="bg-white bg-opacity-10 p-6 rounded-xl">
          <GlobeAltIcon className="h-12 w-12 text-pink-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Global Network</h3>
          <p className="text-gray-300">Join a decentralized community of learners and teachers from around the world</p>
        </div>

        <div className="bg-white bg-opacity-10 p-6 rounded-xl">
          <AcademicCapIcon className="h-12 w-12 text-pink-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Verified Expertise</h3>
          <p className="text-gray-300">Soul-bound certifications and reputation system ensure quality education</p>
        </div>
      </div>

      {/* Network Benefits */}
      <div className="w-full bg-pink-400 bg-opacity-10 py-16">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">EDU-Lingo Network</h2>
          <p className="text-xl mb-6">A self-sovereign network empowering educators and learners with:</p>
          <ul className="text-lg space-y-3 mb-12">
            <li>✨ Transparent review system</li>
            <li>🔒 Secure escrow payments</li>
            <li>⚖️ Fair dispute resolution</li>
            <li>🌍 Borderless opportunities</li>
          </ul>

          <Link
            href="/start"
            className="inline-block bg-pink-400 text-white px-8 py-3 rounded-full text-lg hover:bg-pink-500 transition-colors"
          >
            Try how the future of education works!
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
