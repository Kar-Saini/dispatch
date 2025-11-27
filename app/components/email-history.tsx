"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";

interface EmailDispatchData {
  id: string;
  subject: string;
  recipients: string[];
  recipientCount: number;
  attachmentName?: string;
  timestamp: number;
}

export default function EmailHistory() {
  const [history, setHistory] = useState<EmailDispatchData[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("emailHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-violet-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-violet-100 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Email Dispatch History
            </h2>
            <p className="text-slate-500">Last {history.length} emails sent</p>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No emails sent yet</p>
        ) : (
          <div className="space-y-4">
            {history.map((email) => (
              <div
                key={email.id}
                className="border-2 border-violet-200 rounded-xl overflow-hidden bg-gradient-to-r from-violet-50 to-purple-50"
              >
                <button
                  onClick={() => toggleExpand(email.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-violet-100/50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <p className="font-bold text-slate-900 text-lg">
                      {email.subject}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mt-2">
                      <span className="inline-block bg-violet-100 text-violet-700 px-3 py-1 rounded-full font-semibold">
                        {email.recipientCount} recipient
                        {email.recipientCount !== 1 ? "s" : ""}
                      </span>
                      <span className="text-slate-500">
                        {formatDate(email.timestamp)}
                      </span>
                      {email.attachmentName && (
                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          📎 {email.attachmentName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 text-violet-600">
                    {expandedId === email.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {expandedId === email.id && (
                  <div className="bg-white border-t-2 border-violet-200 p-4">
                    <p className="text-sm font-bold text-slate-900 mb-3">
                      Recipients:
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {email.recipients.map((recipient, idx) => (
                        <div
                          key={idx}
                          className="text-sm bg-violet-50 text-slate-700 p-3 rounded-lg break-all border-l-4 border-violet-400"
                        >
                          {recipient}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
