"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Users } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("employees");
    if (saved) setEmployees(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const handleAddEmployee = () => {
    if (!name || !email || !department) {
      alert("Please fill in all fields");
      return;
    }

    const newEmployee: Employee = {
      id: Date.now().toString(),
      name,
      email,
      department,
    };

    setEmployees([...employees, newEmployee]);
    setName("");
    setEmail("");
    setDepartment("");
  };

  const handleRemoveEmployee = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-2xl shadow-lg py-4 px-6 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Employees List
        </h2>
        <p className="text-slate-500 mb-2 text-sm">
          Total employees:{" "}
          <span className="font-bold text-emerald-600">{employees.length}</span>
        </p>

        {employees.length === 0 ? (
          <p className="text-slate-400 text-center py-12 text-sm">
            No employees added yet
          </p>
        ) : (
          <div className="space-y-3">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:shadow-md transition-all duration-200 hover:border-blue-400"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{emp.name}</p>
                  <p className="text-sm text-slate-500">{emp.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {emp.department}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveEmployee(emp.id)}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-emerald-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Add New Employee
            </h2>
            <p className="text-slate-500 text-sm">
              Add an employee to the system
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <input
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <input
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="px-4 py-3 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            onClick={handleAddEmployee}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>
      </div>
    </div>
  );
}
