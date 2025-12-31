const categories = [
  { name: "Rings", count: 245, percentage: 35, color: "bg-gold" },
  { name: "Necklaces", count: 189, percentage: 27, color: "bg-gold-light" },
  { name: "Earrings", count: 156, percentage: 22, color: "bg-amber-400" },
  { name: "Bangles", count: 112, percentage: 16, color: "bg-amber-300" },
];

export function CategoryChart() {
  return (
    <div className="glass-card-elevated p-6 animate-slide-up opacity-0 delay-400" style={{ animationFillMode: 'forwards' }}>
      <h3 className="font-serif text-lg font-semibold mb-4">Jewelry by Category</h3>
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{category.name}</span>
              <span className="text-sm text-muted-foreground">{category.count} items</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${category.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${category.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Items</span>
          <span className="font-semibold text-gold">702</span>
        </div>
      </div>
    </div>
  );
}
