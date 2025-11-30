"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Send, LoaderIcon } from "lucide-react";
import { useGetEmployees } from "../hooks/useGetEmployees";
import { sendSalaryEmail } from "../action/sendEmail";

interface EmailDispatchData {
  id: string;
  subject: string;
  recipients: string[];
  recipientCount: number;
  attachmentName?: string;
  timestamp: number;
}

export default function EmailDispatch() {
  const { employees, error, loading } = useGetEmployees();

  const [subject, setSubject] = useState("Salary Slip -");
  const [sending, setSending] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const [monthAndYear, setMonthAndYear] = useState({
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().toLocaleString("default", { year: "numeric" }),
  });

  async function handleEmailSend() {
    try {
      const res = await sendSalaryEmail({
        employeeEmails: selectedRecipients,
        monthAndYear,
        subject,
      });
      console.log(res);
    } catch (error) {}
  }

  useEffect(() => {
    setSubject(`Salary Slip - ${monthAndYear.month} ${monthAndYear.year}`);
  }, [monthAndYear]);

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-100 p-3 rounded-lg">
            <Send className="w-6 h-6 text-cyan-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Send Email</h2>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-xl font-semibold text-slate-800 mb-3">
              Recipients
            </label>

            {loading ? (
              <div className="w-full flex justify-center py-6">
                <LoaderIcon className="animate-spin" />
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="mb-3">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={
                        employees.length > 0 &&
                        selectedRecipients.length === employees.length
                      }
                      onChange={(e) => {
                        setSelectedRecipients(
                          e.target.checked ? employees.map((e) => e.email) : []
                        );
                      }}
                    />
                    <label
                      htmlFor="select-all"
                      className="ml-2 font-bold cursor-pointer"
                    >
                      Select All
                    </label>
                  </div>
                  <div className="grid grid-cols-2">
                    {employees.map((employee) => (
                      <div key={employee.id} className="mb-1">
                        <input
                          type="checkbox"
                          id={employee.email}
                          checked={selectedRecipients.includes(employee.email)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecipients((prev) => [
                                ...prev,
                                employee.email,
                              ]);
                            } else {
                              setSelectedRecipients((prev) =>
                                prev.filter((email) => email !== employee.email)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={employee.email}
                          className="ml-2 cursor-pointer"
                        >
                          {employee.name}, {employee.email}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-800 mb-3">
                Email Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <MiniCalendar
              monthAndYear={monthAndYear}
              setMonthAndYear={setMonthAndYear}
            />
          </div>

          <button
            onClick={handleEmailSend}
            className={`w-full py-4 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              sending
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <Send className="w-5 h-5" />
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({
  monthAndYear,
  setMonthAndYear,
}: {
  monthAndYear: { month: string; year: string };
  setMonthAndYear: ({ month, year }: { month: string; year: string }) => void;
}) {
  const [date, setDate] = useState(new Date());

  const updateMonth = (newDate: Date) => {
    setDate(newDate);
    setMonthAndYear({
      month: newDate.toLocaleString("default", { month: "long" }),
      year: newDate.getFullYear().toString(),
    });
  };

  const nextMonth = () => {
    updateMonth(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    updateMonth(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  return (
    <div className="ml-4 flex-1 flex justify-end items-end ">
      <div className="px-4 py-3 border-2 border-cyan-200 rounded-lg bg-slate-50 flex items-center gap-3 shadow-sm">
        <button
          onClick={prevMonth}
          className="px-2 py-1 text-sm bg-slate-200 rounded-md hover:bg-slate-300"
        >
          ◀
        </button>

        <span className="font-semibold whitespace-nowrap">
          {monthAndYear.month} {monthAndYear.year}
        </span>

        <button
          onClick={nextMonth}
          className="px-2 py-1 text-sm bg-slate-200 rounded-md hover:bg-slate-300"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
