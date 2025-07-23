import { formatCurrencyShort } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useDashboardStats } from "../../hooks/useDashboadStats";


export const RevenueCard = () => {
  const { totalRevenue } = useDashboardStats();


  return (
    <Card className="border-border/50 shadow-card bg-gradient-to-br from-blue-50 to-blue-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">Total Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground">{formatCurrencyShort(totalRevenue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}