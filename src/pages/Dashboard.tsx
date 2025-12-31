import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentMatches } from "@/components/dashboard/RecentMatches";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { Gem, Brain, Image, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back, Admin">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Jewelry Items"
          value="702"
          change="+24 this week"
          changeType="positive"
          icon={Gem}
          delay={0}
        />
        <StatsCard
          title="AI Matches Today"
          value="156"
          change="+12% from yesterday"
          changeType="positive"
          icon={Brain}
          delay={100}
        />
        <StatsCard
          title="Database Images"
          value="1,847"
          change="98% embedded"
          changeType="neutral"
          icon={Image}
          delay={200}
        />
        <StatsCard
          title="Match Success Rate"
          value="94.7%"
          change="+2.3% this month"
          changeType="positive"
          icon={TrendingUp}
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentMatches />
        <CategoryChart />
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6 animate-slide-up opacity-0 delay-500" style={{ animationFillMode: 'forwards' }}>
        <h3 className="font-serif text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Add New Jewelry", icon: "➕", path: "/jewelry/add" },
            { label: "View Reports", icon: "📊", path: "/reports" },
            { label: "Update Prices", icon: "💰", path: "/prices" },
          ].map((action) => (
            <button
              key={action.label}
              className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center group"
            >
              <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
