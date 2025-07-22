import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useDashboardStats } from "../../hooks/useDashboadStats";


export const InteractionsCard = () => {
  const { totalInteractions } = useDashboardStats();


  return (
    <Card className="border-border/50 shadow-card bg-gradient-to-br from-blue-50 to-blue-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">Total Interactions Logged</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground">{totalInteractions.toLocaleString()}</p>          </div>
        </div>
      </CardContent>
    </Card>
  );
}