"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Users, LoaderIcon } from "lucide-react";
import getAllEmployees from "../action/getAllEmployees";
import { Employee } from "@prisma/client";
import toast from "react-hot-toast";
import { useGetEmployees } from "../hooks/useGetEmployees";

export default function EmployeeManagement() {
  const { employees, error, loading } = useGetEmployees();
  console.log(employees);

  const handleRemoveEmployee = (id: string) => {};

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-2xl shadow-lg py-4 px-6 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Employees List
        </h2>
        {loading ? (
          <div className="w-full h-full justify-center flex ">
            <LoaderIcon className="animate-spin " />
          </div>
        ) : (
          <>
            <p className="text-slate-500 mb-2 text-sm">
              Total employees:{" "}
              <span className="font-bold text-emerald-600">
                {employees.length}
              </span>
            </p>

            {!loading && employees.length === 0 ? (
              <p className="text-slate-400 text-center py-12 text-sm">
                No employees added yet
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className="  p-4 bg-linear-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:shadow-md transition-all duration-200 hover:border-blue-400"
                  >
                    <div className="">
                      <p className="font-semibold text-slate-800 text-md">
                        Name : {emp.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        Email : {emp.email}
                      </p>
                      <span className="inline-block py-1 text-xs">
                        Designation : {emp.designation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
