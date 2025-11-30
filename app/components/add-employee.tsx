"use client";

import { Plus, Users } from "lucide-react";
import React, { useState } from "react";
const ADD_EMPLOYEE = {
  name: "",
  email: "",
  department: "",
  pan: "",
  bank: "",
  bankAccNum: "",
  bankIFSC: "",
};
const AddEmployee = () => {
  const handleAddEmployee = () => {};
  const [addNewEmployee, setNewEmployee] = useState(ADD_EMPLOYEE);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-emerald-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-emerald-100 rounded-lg">
          <Users className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 ">
            Add New Employee
          </h2>
          <p className="text-slate-500 text-xs">
            Add an employee to the system
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AddEmployeeInputBox placeholder="Name" value={addNewEmployee.name} />
          <AddEmployeeInputBox placeholder="Name" value={addNewEmployee.name} />
          <AddEmployeeInputBox placeholder="Name" value={addNewEmployee.name} />
          <AddEmployeeInputBox placeholder="Name" value={addNewEmployee.name} />
          <AddEmployeeInputBox placeholder="Name" value={addNewEmployee.name} />
          <AddEmployeeInputBox placeholder="Name" value={addNewEmployee.name} />
          <AddEmployeeInputBox placeholder="Name" value={addNewEmployee.name} />
        </div>
        <button
          onClick={handleAddEmployee}
          className="w-full md:w-auto bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg "
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>
    </div>
  );
};

function AddEmployeeInputBox({
  value,
  placeholder,
}: {
  value: string;
  placeholder: string;
}) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      className="p-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
    />
  );
}

export default AddEmployee;
