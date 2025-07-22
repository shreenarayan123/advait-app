import { Card, CardContent } from "../../components/ui/card";
import type { LucideIcon } from "lucide-react";


interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  growth?: {
    value: number;
    trend: "up" | "down";
  };
  variant?: "default" | "success" | "info" | "warning";
}

export const StatCard = ({ title, value, icon: Icon, variant = "default" }: StatCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-green-300 bg-gradient-to-br from-green-50 to-green-200";
      case "info":
        return "border-blue-300 bg-gradient-to-br from-blue-50 to-blue-200";
      case "warning":
        return "border-orange-300 bg-gradient-to-br from-orange-50 to-orange-200";
      default:
        return "border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10";
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-success";
      case "info":
        return "text-info";
      case "warning":
        return "text-warning";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className={`${getVariantStyles()} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </div>
          <div className={`p-3 rounded-full bg-background/50 ${getIconStyles()}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};