import { CheckCircle2, Clock } from "lucide-react";

const matches = [
  { id: 1, jewelry: "Diamond Solitaire Ring", similarity: 98.5, time: "2 mins ago", status: "exact" },
  { id: 2, jewelry: "Gold Chain Necklace", similarity: 92.3, time: "5 mins ago", status: "close" },
  { id: 3, jewelry: "Pearl Stud Earrings", similarity: 95.8, time: "12 mins ago", status: "exact" },
  { id: 4, jewelry: "Platinum Bangle", similarity: 87.2, time: "25 mins ago", status: "close" },
  { id: 5, jewelry: "Emerald Pendant", similarity: 99.1, time: "1 hour ago", status: "exact" },
];

export function RecentMatches() {
  return (
    <div className="glass-card-elevated p-6 animate-slide-up opacity-0 delay-300" style={{ animationFillMode: 'forwards' }}>
      <h3 className="font-serif text-lg font-semibold mb-4">Recent AI Matches</h3>
      <div className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{match.jewelry}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {match.time}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gold">{match.similarity}%</p>
              <p className={`text-xs ${match.status === 'exact' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {match.status === 'exact' ? 'Exact Match' : 'Close Match'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
