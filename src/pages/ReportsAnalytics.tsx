import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  Area,
  AreaChart
} from "recharts";
import { 
  TrendingUp, 
  Download, 
  Calendar,
  Target,
  Zap,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from "lucide-react";

const ReportsAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d");

  // Most matched jewelry data
  const mostMatchedData = [
    { name: "Diamond Solitaire Ring", matches: 156, category: "Rings" },
    { name: "Gold Temple Necklace", matches: 134, category: "Necklaces" },
    { name: "Pearl Drop Earrings", matches: 98, category: "Earrings" },
    { name: "Kundan Bridal Set", matches: 87, category: "Sets" },
    { name: "Rose Gold Bracelet", matches: 76, category: "Bracelets" },
    { name: "Antique Jhumkas", matches: 65, category: "Earrings" },
    { name: "Polki Diamond Choker", matches: 54, category: "Necklaces" },
    { name: "Gold Kada Bangle", matches: 48, category: "Bangles" },
  ];

  // Category demand data
  const categoryDemandData = [
    { name: "Rings", value: 35, color: "hsl(var(--gold))" },
    { name: "Necklaces", value: 28, color: "hsl(var(--gold-dark))" },
    { name: "Earrings", value: 18, color: "hsl(var(--primary))" },
    { name: "Bangles", value: 12, color: "hsl(var(--accent))" },
    { name: "Bracelets", value: 7, color: "hsl(var(--muted-foreground))" },
  ];

  // AI performance data over time
  const aiPerformanceData = [
    { date: "Mon", accuracy: 92, avgConfidence: 88, matchRate: 85 },
    { date: "Tue", accuracy: 94, avgConfidence: 91, matchRate: 88 },
    { date: "Wed", accuracy: 91, avgConfidence: 87, matchRate: 82 },
    { date: "Thu", accuracy: 96, avgConfidence: 93, matchRate: 91 },
    { date: "Fri", accuracy: 95, avgConfidence: 90, matchRate: 89 },
    { date: "Sat", accuracy: 93, avgConfidence: 89, matchRate: 86 },
    { date: "Sun", accuracy: 97, avgConfidence: 94, matchRate: 92 },
  ];

  // Match distribution by time
  const matchDistributionData = [
    { hour: "6AM", matches: 12 },
    { hour: "9AM", matches: 45 },
    { hour: "12PM", matches: 78 },
    { hour: "3PM", matches: 92 },
    { hour: "6PM", matches: 67 },
    { hour: "9PM", matches: 34 },
    { hour: "12AM", matches: 8 },
  ];

  // Performance metrics
  const performanceMetrics = [
    { 
      title: "Average Accuracy", 
      value: "94.2%", 
      change: "+2.3%", 
      icon: Target,
      color: "text-green-600"
    },
    { 
      title: "Match Success Rate", 
      value: "87.8%", 
      change: "+5.1%", 
      icon: Zap,
      color: "text-green-600"
    },
    { 
      title: "Avg Response Time", 
      value: "1.2s", 
      change: "-0.3s", 
      icon: Activity,
      color: "text-green-600"
    },
    { 
      title: "Top Performer", 
      value: "Rings", 
      change: "156 matches", 
      icon: Award,
      color: "text-gold"
    },
  ];

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="AI matching insights and performance metrics">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-1">
              AI matching insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="gold-outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics.map((metric, index) => (
            <Card 
              key={metric.title} 
              className="glass-card hover-lift"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-gold/10">
                    <metric.icon className="h-5 w-5 text-gold" />
                  </div>
                  <Badge variant="secondary" className={metric.color}>
                    {metric.change}
                  </Badge>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Most Matched Jewelry */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gold" />
                <CardTitle className="text-lg">Most Matched Jewelry</CardTitle>
              </div>
              <Badge variant="outline">Top 8</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mostMatchedData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={120} 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`${value} matches`, "Matches"]}
                    />
                    <Bar 
                      dataKey="matches" 
                      fill="hsl(var(--gold))" 
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Demand */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-gold" />
                <CardTitle className="text-lg">Category Demand</CardTitle>
              </div>
              <Badge variant="outline">Distribution</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDemandData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryDemandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`${value}%`, "Demand"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {categoryDemandData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Performance Over Time */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-gold" />
                <CardTitle className="text-lg">AI Performance Trends</CardTitle>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gold" />
                  <span className="text-muted-foreground">Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Match Rate</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aiPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[75, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`${value}%`]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="hsl(var(--gold))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--gold))", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="avgConfidence" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="matchRate" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--accent))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Match Distribution by Time */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-gold" />
                <CardTitle className="text-lg">Match Distribution by Time</CardTitle>
              </div>
              <Badge variant="outline">Peak Hours</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={matchDistributionData}>
                    <defs>
                      <linearGradient id="matchGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--gold))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--gold))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                      formatter={(value: number) => [`${value} matches`, "Matches"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="matches" 
                      stroke="hsl(var(--gold))" 
                      strokeWidth={2}
                      fill="url(#matchGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsAnalytics;
