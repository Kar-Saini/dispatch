"use client";

import axios from "axios";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [email, setEmail] = useState<null | string>(null);
  const [password, setPassword] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleClick() {
    if (!email || !password) {
      toast.error("Invalid input");
      setEmail("");
      setPassword("");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post("/api/sign-in", {
        email,
        password,
      });
      if (result.data.id) router.push("/dashboard");
    } catch (error) {
      console.log("Error", error);
      toast.error("Error while sign in");
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  }
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-xl bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <h2
          className="text-4xl font-bold text-slate-800 border-b-2
           border-neutral-200 pb-3 text-center mb-8"
        >
          Dispatch System
        </h2>

        <div className=" flex flex-col w-sm mx-auto space-y-2">
          <input
            disabled={loading}
            placeholder="Email (Admin)"
            type="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
          <input
            disabled={loading}
            placeholder="Password"
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
          <button
            disabled={loading || email === "" || password === ""}
            className={`bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg hover:cursor-pointer mt-2 disabled:bg-gray-50`}
            onClick={handleClick}
          >
            {loading ? <LoaderIcon className="animate-spin" /> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
