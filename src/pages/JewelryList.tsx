import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { JewelryCard } from "@/components/jewelry/JewelryCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Grid3X3, List, RefreshCw, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { jewelryApi, JewelryItem } from "@/lib/jewelryApi";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function JewelryList() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jewelryItems, setJewelryItems] = useState<JewelryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchJewelry = async () => {
    setIsLoading(true);
    try {
      const items = await jewelryApi.list();
      setJewelryItems(items);
    } catch (error) {
      console.error("Failed to fetch jewelry:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch jewelry",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    try {
      const message = await jewelryApi.seedSampleData();
      toast({
        title: "Sample Data Added",
        description: message,
      });
      fetchJewelry();
    } catch (error) {
      console.error("Failed to seed data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add sample data",
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    fetchJewelry();
  }, []);

  // Filter items
  const filteredItems = jewelryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Format price for display
  const formatPrice = (item: JewelryItem) => {
    const goldPrice = 7500; // Price per gram
    const total = (item.weight * goldPrice) + item.makingCharges;
    return `₹${total.toLocaleString('en-IN')}`;
  };

  return (
    <DashboardLayout title="Jewelry Database" subtitle="Manage your jewelry inventory">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, category, or purity..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="rings">Rings</SelectItem>
              <SelectItem value="necklaces">Necklaces</SelectItem>
              <SelectItem value="earrings">Earrings</SelectItem>
              <SelectItem value="bangles">Bangles</SelectItem>
              <SelectItem value="bracelets">Bracelets</SelectItem>
              <SelectItem value="sets">Sets</SelectItem>
              <SelectItem value="anklets">Anklets</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-10"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-none h-10"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Refresh Button */}
          <Button variant="outline" size="icon" onClick={fetchJewelry} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>

          {/* Seed Sample Data Button */}
          <Button variant="gold-outline" onClick={handleSeedData} disabled={isSeeding}>
            <Database className="w-4 h-4 mr-2" />
            {isSeeding ? "Adding..." : "Add Samples"}
          </Button>

          {/* Add Button */}
          <Button variant="gold" asChild>
            <Link to="/jewelry/add">
              <Plus className="w-4 h-4 mr-2" />
              Add Jewelry
            </Link>
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
        <span>Showing {filteredItems.length} items</span>
        <Select defaultValue="newest">
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-4 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="glass-card p-12 text-center">
          <Database className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Jewelry Found</h3>
          <p className="text-muted-foreground mb-6">
            {jewelryItems.length === 0 
              ? "Your database is empty. Add sample data or create new jewelry items."
              : "No items match your search criteria."}
          </p>
          {jewelryItems.length === 0 && (
            <div className="flex gap-4 justify-center">
              <Button variant="gold-outline" onClick={handleSeedData} disabled={isSeeding}>
                <Database className="w-4 h-4 mr-2" />
                Add Sample Data
              </Button>
              <Button variant="gold" asChild>
                <Link to="/jewelry/add">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Jewelry
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === "grid" && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item._id}
              className="animate-slide-up opacity-0"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <JewelryCard
                id={item._id}
                name={item.name}
                category={item.category}
                purity={`${item.purity} ${item.metalType}`}
                weight={`${item.weight}g`}
                price={formatPrice(item)}
                image={item.imageUrl}
                status={item.status}
              />
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && viewMode === "list" && filteredItems.length > 0 && (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Image</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Purity</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Weight</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-t border-border hover:bg-secondary/30 transition-colors animate-slide-up opacity-0"
                  style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="p-4">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs bg-gold/10 text-gold rounded-full">{item.category}</span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{item.purity} {item.metalType}</td>
                  <td className="p-4 text-sm">{item.weight}g</td>
                  <td className="p-4 font-serif font-semibold gold-text">{formatPrice(item)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
