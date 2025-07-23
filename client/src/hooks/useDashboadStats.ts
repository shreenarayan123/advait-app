import { useEffect, useState } from "react";
import axios from "axios";

interface DashboardStats {
  totalCustomers: number;
  totalDeals: number;
  totalDealValue: number;
  totalInteractions: number;
  dealsByStage: { name: string; value: number; color: string }[];
  loading: boolean;
  error: string | null;
}
const chartColors: Record<string, string> = {
  LEAD: "var(--chart-1)",
  QUALIFIED: "var(--chart-2)",
  PROPOSAL: "var(--chart-3)",
  NEGOTIATION: "var(--chart-4)",
  CLOSED_WON: "var(--chart-5)",
  CLOSED_LOST: "var(--chart-6)",
};

export const useDashboardStats = (): DashboardStats => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalDeals, setTotalDeals] = useState(0);
  const [totalDealValue, setTotalDealValue] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [dealsByStage, setDealsByStage] = useState<
    { name: string; value: number; color: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [customerRes, dealRes, interactionRes] = await Promise.all([
          axios.get(`${backendUrl}/customers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/deals`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendUrl}/interactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const customers = customerRes.data;
        const deals = dealRes.data;
        const interactions = interactionRes.data;

        const dealStageCount: Record<string, number> = {
          LEAD: 0,
          QUALIFIED: 0,
          PROPOSAL: 0,
          NEGOTIATION: 0,
          CLOSED_WON: 0,
          CLOSED_LOST: 0,
        };

        let totalAmount = 0;

        for (const deal of deals) {
          if (deal.stage in dealStageCount) {
            dealStageCount[deal.stage]++;
          }

          if (deal.amount) {
            totalAmount += deal.amount;
          }
        }
        const pieData = Object.entries(dealStageCount).map(
          ([stage, value]) => ({
            name: stage,
            value,
            color: chartColors[stage],
          })
        );
        setTotalCustomers(customers.length);
        setTotalDeals(deals.length);
        setTotalDealValue(totalAmount);
        setTotalInteractions(interactions.length);
        setDealsByStage(pieData);
        setError(null);
      } catch (err: any) {
        console.error("Error loading dashboard stats:", err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    totalCustomers,
    totalDeals,
    totalDealValue,
    totalInteractions,
    dealsByStage,
    loading,
    error,
  };
};
