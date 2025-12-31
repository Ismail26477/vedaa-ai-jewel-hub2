import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
}

export function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: StatsCardProps) {
  return (
    <div 
      className="glass-card-elevated p-6 animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-serif font-bold text-foreground">{value}</p>
          {change && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
              changeType === "positive" && "bg-emerald-100 text-emerald-700",
              changeType === "negative" && "bg-red-100 text-red-700",
              changeType === "neutral" && "bg-secondary text-secondary-foreground"
            )}>
              {changeType === "positive" && "↑"}
              {changeType === "negative" && "↓"}
              {change}
            </div>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-gold">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}
