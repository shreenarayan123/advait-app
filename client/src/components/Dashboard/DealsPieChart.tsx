import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useDashboardStats } from "../../hooks/useDashboadStats";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {payload[0].value} deals
        </p>
      </div>
    );
  }
  return null;
};

export const DealsPieChart = () => {
  const { dealsByStage } = useDashboardStats();
  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Deals by Stage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dealsByStage}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              stroke="none"
            >
              {dealsByStage.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{
                paddingTop: "20px",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
