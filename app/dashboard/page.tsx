"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownOnSquareIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
	ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();
  const authFetch = useAuthFetch();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await authFetch("/api/dashboard");
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  return (
    <>
      <div className="p-2 container">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <div className="p-2 w-full border rounded-lg">
              <div className="flex w-full justify-between text-green-700">
                <h1 className="text-sm">Income</h1>
                <ArrowDownOnSquareIcon className="w-4 h-4" />
              </div>

              <h1 className="text-xl font-bold mb-1">Rp 15.400.000</h1>

              <div className="flex text-xs items-center gap-2 text-green-700">
                <ArrowTrendingUpIcon className="w-4 h-4" />
                <p>Increased 23% since last month</p>
              </div>
            </div>

            <div className="p-2 w-full border rounded-lg">
              <div className="flex w-full justify-between text-red-700">
                <h1 className="text-sm">Expense</h1>
                <ArrowUpOnSquareIcon className="w-4 h-4" />
              </div>

              <h1 className="text-xl font-bold mb-1">Rp 5.435.000</h1>

              <div className="flex text-xs items-center gap-2 text-green-700">
                <ArrowTrendingDownIcon className="w-4 h-4" />
                <p>Decreased 10% since last month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
