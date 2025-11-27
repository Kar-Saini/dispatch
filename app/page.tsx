"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-xl bg-white rounded-2xl shadow-lg p-8 border-2 border-blue-200">
        <h2
          className="text-2xl font-bold text-slate-800 border-b-2
           border-neutral-200 pb-3 text-center mb-8"
        >
          Dispatch System
        </h2>

        <div className=" flex flex-col w-sm mx-auto space-y-2">
          <input
            placeholder="Email Address (admin)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
          <button className="w-full md:w-auto bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg hover:cursor-pointer mt-2">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
