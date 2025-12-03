"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Users, Lock, Mail, History } from "lucide-react";
import EmployeeManagement from "./components/employee-management";
import EmailDispatch from "./components/email-dispatch";
import EmailHistory from "./components/email-history";

type TabValue = "employees" | "dispatch" | "history";
interface Tab {
  value: TabValue;
  label: string;
  icon: React.ReactNode;
}
//@ts-ignore
const TAB: Tab[] = [
  {
    value: "employees",
    label: "Employees",
    icon: <Users className="w-4 h-4" />,
  },
  {
    value: "dispatch",
    label: "Dispatch",
    icon: <Mail className="w-4 h-4" />,
  },
  ,
  {
    value: "history",
    label: "History",
    icon: <History className="w-4 h-4" />,
  },
];
export default function Home() {
  const [activeTab, setActiveTab] = useState<TabValue>("employees");

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <div className="bg-linear-to-r border-b border-purple-200 shadow-sm">
        <div className="max-w-7xl mx-auto py-4">
          <h1 className="text-3xl font-bold ">Employee Dispatch System</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4 mb-4">
          {TAB.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap hover:cursor-pointer text-sm ${
                activeTab === tab.value
                  ? "bg-white text-blue-600 shadow-lg scale-105"
                  : "bg-white/90 text-slate-600 hover:bg-white/80"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline ">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="min-h-screen">
          {activeTab === "employees" && <EmployeeManagement />}
          {activeTab === "dispatch" && <EmailDispatch />}
          {activeTab === "history" && <EmailHistory />}
        </div>
      </div>
    </div>
  );
}
