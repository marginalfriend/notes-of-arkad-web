"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      const response = await authFetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };
  
  return (
    <div>
      <h1>Dashboard</h1>
      {dashboardData && (
        <div>
          {/* Render your dashboard data here */}
        </div>
      )}
    </div>
  );
}