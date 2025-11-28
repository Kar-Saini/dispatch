"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Send, FileUp } from "lucide-react";
import transporter from "@/mailer";
import { testMailer } from "../action/testmail";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

interface EmailDispatchData {
  id: string;
  subject: string;
  recipients: string[];
  recipientCount: number;
  attachmentName?: string;
  timestamp: number;
}

export default function EmailDispatch() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [subject, setSubject] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("employees");
    if (saved) {
      const parsedEmployees = JSON.parse(saved);
      setEmployees(parsedEmployees);

      const uniqueDepts = Array.from(
        new Set(parsedEmployees.map((e: Employee) => e.department))
      );
      setDepartments(uniqueDepts as string[]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentFile(file);
      setAttachmentName(file.name);
    }
  };

  const getRecipients = () => {
    if (selectedDepartment === "all") {
      return employees;
    }
    return employees.filter((emp) => emp.department === selectedDepartment);
  };

  const handleSendEmail = () => {
    if (!subject.trim()) {
      alert("Please enter an email subject");
      return;
    }

    const recipients = getRecipients();
    if (recipients.length === 0) {
      alert("No employees selected");
      return;
    }

    setSending(true);

    setTimeout(() => {
      const emailData: EmailDispatchData = {
        id: Date.now().toString(),
        subject,
        recipients: recipients.map((r) => r.email),
        recipientCount: recipients.length,
        attachmentName: attachmentFile ? attachmentName : undefined,
        timestamp: Date.now(),
      };

      const existingHistory = localStorage.getItem("emailHistory");
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      history.unshift(emailData);
      localStorage.setItem(
        "emailHistory",
        JSON.stringify(history.slice(0, 50))
      );

      setSending(false);
      setSubject("");
      setAttachmentFile(null);
      setAttachmentName("");
      setSelectedDepartment("all");
      alert(`Email sent to ${recipients.length} recipient(s)!`);
    }, 1000);
  };

  const recipients = getRecipients();

  return (
    <div className="space-y-6">
      <button onClick={testMailer}>SEND TEST MAIL</button>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-cyan-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-cyan-100 p-3 rounded-lg">
            <Send className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Send Email</h2>
            <p className="text-slate-500">
              Compose and send emails to employees with optional PDF attachment
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-3">
              Select Recipients by Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors bg-white"
            >
              <option value="all">All Employees</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-3">
              Email Subject
            </label>
            <input
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-3">
              Attach PDF (Optional)
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center px-4 py-3 border-2 border-dashed border-cyan-300 rounded-lg cursor-pointer hover:bg-cyan-50 transition-colors">
                <div className="flex items-center gap-2 text-slate-600">
                  <FileUp className="w-5 h-5" />
                  <span>Choose PDF file</span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {attachmentFile && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-2 rounded-lg whitespace-nowrap">
                  ✓ {attachmentName}
                </span>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-xl border-2 border-cyan-300">
            <p className="text-sm font-bold text-slate-800 mb-4">
              Email Preview
            </p>
            <div className="space-y-3 text-sm">
              <p className="text-slate-700">
                <span className="font-bold text-slate-900">To:</span>{" "}
                {recipients.length} recipient
                {recipients.length !== 1 ? "s" : ""}
              </p>
              <p className="text-slate-700">
                <span className="font-bold text-slate-900">Subject:</span>{" "}
                {subject || <em className="text-slate-400">(empty)</em>}
              </p>
              {attachmentFile && (
                <p className="text-slate-700">
                  <span className="font-bold text-slate-900">Attachment:</span>{" "}
                  {attachmentName}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleSendEmail}
            disabled={sending || recipients.length === 0}
            className={`w-full py-4 font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ${
              sending || recipients.length === 0
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            <Send className="w-5 h-5" />
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-rose-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Recipients</h2>
        <p className="text-slate-500 mb-6">
          {selectedDepartment === "all"
            ? `Showing all ${recipients.length} employees`
            : `Showing ${recipients.length} employees from ${selectedDepartment}`}
        </p>

        {recipients.length === 0 ? (
          <p className="text-slate-400 text-center py-12">
            No employees to send to
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recipients.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-slate-800">{emp.name}</p>
                  <p className="text-sm text-slate-500">{emp.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
