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
  const [languages, setLanguages] = useState<string[]>([""]);
  const [certifications, setCertifications] = useState<string[]>([""]);

  // Setup contract write hook using Scaffold-ETH hook
  const { writeContractAsync: createUser, isMining: isCreatingUser } = useScaffoldWriteContract("EduLingo");
  // Handle adding/removing form fields
  const addLanguage = () => setLanguages([...languages, ""]);
  const removeLanguage = (index: number) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
  };

  const addCertification = () => setCertifications([...certifications, ""]);
  const removeCertification = (index: number) => {
    const newCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(newCertifications);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const filteredLanguages = languages.filter(lang => lang.trim() !== "");
      const filteredCertifications = certifications.filter(cert => cert.trim() !== "");

      await createUser({
        functionName: "createUser",
        args: [filteredLanguages, filteredCertifications],
      });

      router.push("/create");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">EDU-Lingo</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          {/* Create User Form */}
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              {languages.map((language, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={language}
                    onChange={e => {
                      const newLanguages = [...languages];
                      newLanguages[index] = e.target.value;
                      setLanguages(newLanguages);
                    }}
                    className="input input-bordered flex-1"
                    placeholder="Enter language"
                  />
                  <button type="button" onClick={() => removeLanguage(index)} className="btn btn-error">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addLanguage} className="btn btn-secondary">
                Add Language
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Certifications</h3>
              {certifications.map((cert, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={e => {
                      const newCertifications = [...certifications];
                      newCertifications[index] = e.target.value;
                      setCertifications(newCertifications);
                    }}
                    className="input input-bordered flex-1"
                    placeholder="Enter certification"
                  />
                  <button type="button" onClick={() => removeCertification(index)} className="btn btn-error">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addCertification} className="btn btn-secondary">
                Add Certification
              </button>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isCreatingUser}>
              {isCreatingUser ? "Creating..." : "Create Profile"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
