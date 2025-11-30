import { useEffect, useState } from "react";
import getAllEmployees from "../action/getAllEmployees";
import toast from "react-hot-toast";
import { Employee } from "@prisma/client";

export function useGetEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadEmployees() {
      setLoading(true);
      const res = await getAllEmployees();
      if (typeof res !== "string") setEmployees(res);
      else setError("Error");
      setLoading(false);
    }
    loadEmployees();
  }, []);

  return { employees, error, loading };
}
