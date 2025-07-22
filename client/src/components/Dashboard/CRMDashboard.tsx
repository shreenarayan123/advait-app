import { Users, TrendingUp, DollarSign } from "lucide-react";
import { StatCard } from "./StatCard";
import { DealsPieChart } from "./DealsPieChart";
import { InteractionsCard } from "./InteractionsCard";
import { useDashboardStats } from "../../hooks/useDashboadStats";

export const CRMDashboard = () => {
  const { totalCustomers, totalDeals, totalDealValue   } = useDashboardStats();
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2"> Dashboard</h1>
          <p className="text-muted-foreground">Track your sales performance and customer engagement metrics</p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Customers"
            value={totalCustomers.toString()}
            icon={Users}
            growth={{ value: 8.2, trend: "up" }}
            variant="info"
          />
          <StatCard
            title="Total Deals"
            value={totalDeals.toString()}
            icon={TrendingUp}
            growth={{ value: 15.3, trend: "up" }}
            variant="success"
          />
          <StatCard
            title="Pipeline Value"
            value={totalDealValue.toString()}
            icon={DollarSign}
            growth={{ value: 12.5, trend: "up" }}
            variant="warning"
          />
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DealsPieChart />
          <InteractionsCard />
        </div>
      </div>
    </div>
  );
};