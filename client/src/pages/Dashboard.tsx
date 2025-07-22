import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Bell, UserCircle, ChevronDown, PlusCircle, FileText, Briefcase, ListTodo, AlertTriangle, Users } from "lucide-react";
import React from "react";

const Dashboard = () => {
  return (
    <div className="bg-gray-50/50">
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600" />
          </div>
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <UserCircle className="h-8 w-8 text-purple-600" />
            <div>
              <p className="font-semibold">Panze Pro</p>
            </div>
            <ChevronDown className="h-5 w-5" />
          </div>
          <Button>
            Events
          </Button>
          <Button variant="outline">
            Page Setup
          </Button>
        </div>
      </header>

      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          <StatCard icon={PlusCircle} title="New Leads" value="7089" />
          <StatCard icon={Users} title="New Customers" value="65" />
          <StatCard icon={FileText} title="Sent Invoices" value="628" />
          <StatCard icon={Briefcase} title="Current Tasks" value="5" />
          <StatCard icon={ListTodo} title="Leads Tasks" value="120" />
          <StatCard icon={AlertTriangle} title="Overdue Task" value="48" color="text-red-500" />
        </div>
        {/* The rest of the dashboard components will go here */}
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color = "text-gray-900" }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </CardContent>
  </Card>
);

export default Dashboard;