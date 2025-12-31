import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Save, 
  History,
  IndianRupee,
  Coins,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GSTInvoice } from "@/components/invoice/GSTInvoice";
import { supabase } from "@/integrations/supabase/client";

interface PriceData {
  price: number;
  change: { value: number; isPositive: boolean };
  unit: string;
  currency: string;
}

interface LivePrices {
  gold24k: PriceData;
  gold22k: PriceData;
  gold18k: PriceData;
  silver: PriceData;
  lastUpdated: string;
  source: string;
}

const priceHistory = [
  { date: "Dec 25, 2024", gold22k: 6850, gold18k: 5600, silver: 92, change: "+1.2%" },
  { date: "Dec 24, 2024", gold22k: 6770, gold18k: 5535, silver: 91, change: "-0.5%" },
  { date: "Dec 23, 2024", gold22k: 6804, gold18k: 5563, silver: 90, change: "+0.8%" },
  { date: "Dec 22, 2024", gold22k: 6750, gold18k: 5520, silver: 89, change: "+0.3%" },
  { date: "Dec 21, 2024", gold22k: 6730, gold18k: 5503, silver: 88, change: "-0.2%" },
  { date: "Dec 20, 2024", gold22k: 6743, gold18k: 5514, silver: 89, change: "+1.5%" },
  { date: "Dec 19, 2024", gold22k: 6643, gold18k: 5432, silver: 87, change: "+0.7%" },
];

const shopDetails = {
  name: "Vedaa Jewellers",
  address: "123, Gold Market, Mumbai - 400001, Maharashtra, India",
  gstin: "27AABCU9603R1ZM",
  phone: "+91 98765 43210",
};

export default function PriceManagement() {
  const { toast } = useToast();
  const [goldPrice22k, setGoldPrice22k] = useState("6850");
  const [goldPrice18k, setGoldPrice18k] = useState("5600");
  const [silverPrice, setSilverPrice] = useState("92");
  const [weight, setWeight] = useState("10");
  const [makingCharges, setMakingCharges] = useState("2000");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGstInclusive, setIsGstInclusive] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedMetal, setSelectedMetal] = useState<"gold22k" | "gold18k" | "silver">("gold22k");
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [livePrices, setLivePrices] = useState<LivePrices | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    phone: "",
    gstin: "",
  });

  const GST_RATE = 3; // 3% GST on gold jewelry
  const CGST_RATE = 1.5; // Central GST
  const SGST_RATE = 1.5; // State GST

  const fetchLivePrices = async () => {
    setIsLoadingPrices(true);
    try {
      const { data, error } = await supabase.functions.invoke('live-metal-prices');
      
      if (error) throw error;
      
      setLivePrices(data);
      setGoldPrice22k(data.gold22k.price.toString());
      setGoldPrice18k(data.gold18k.price.toString());
      setSilverPrice(data.silver.price.toString());
      setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString('en-IN'));
      
      toast({
        title: "Live Prices Updated",
        description: `Fetched at ${new Date().toLocaleTimeString('en-IN')}`,
      });
    } catch (error) {
      console.error('Error fetching live prices:', error);
      toast({
        title: "Failed to fetch prices",
        description: "Using cached prices instead",
        variant: "destructive",
      });
    } finally {
      setIsLoadingPrices(false);
    }
  };

  useEffect(() => {
    fetchLivePrices();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchLivePrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const calculatePriceDetails = (pricePerGram: number) => {
    const w = parseFloat(weight) || 0;
    const m = parseFloat(makingCharges) || 0;
    const basePrice = w * pricePerGram + m;
    const cgst = (basePrice * CGST_RATE) / 100;
    const sgst = (basePrice * SGST_RATE) / 100;
    const totalGst = cgst + sgst;
    const totalPrice = basePrice + totalGst;
    
    return {
      basePrice,
      cgst,
      sgst,
      totalGst,
      totalPrice
    };
  };

  const formatPrice = (price: number) => price.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const getDisplayPrice = (pricePerGram: number) => {
    const details = calculatePriceDetails(pricePerGram);
    return isGstInclusive ? details.totalPrice : details.basePrice;
  };

  const handleUpdateRates = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: "Rates Updated Successfully",
        description: "Today's metal rates have been saved.",
      });
    }, 1500);
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  };

  const getMetalDetails = () => {
    const metalConfig = {
      gold22k: { description: "Gold Jewelry (22K)", hsnCode: "7113", rate: parseFloat(goldPrice22k) },
      gold18k: { description: "Gold Jewelry (18K)", hsnCode: "7113", rate: parseFloat(goldPrice18k) },
      silver: { description: "Silver Jewelry", hsnCode: "7114", rate: parseFloat(silverPrice) },
    };
    return metalConfig[selectedMetal];
  };

  const handleGenerateInvoice = (metal: "gold22k" | "gold18k" | "silver") => {
    setSelectedMetal(metal);
    setShowInvoice(true);
  };

  const getInvoiceItems = () => {
    const metalDetails = getMetalDetails();
    const priceDetails = calculatePriceDetails(metalDetails.rate);
    return [{
      description: metalDetails.description,
      hsnCode: metalDetails.hsnCode,
      weight: parseFloat(weight) || 0,
      rate: metalDetails.rate,
      makingCharges: parseFloat(makingCharges) || 0,
      basePrice: priceDetails.basePrice,
      cgst: priceDetails.cgst,
      sgst: priceDetails.sgst,
      total: priceDetails.totalPrice,
    }];
  };

  return (
    <DashboardLayout title="Price Management" subtitle="Manage daily metal rates and calculations">
      {/* Live Price Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Market Prices
          </div>
          {lastUpdated && (
            <span className="text-sm text-muted-foreground">Last updated: {lastUpdated}</span>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLivePrices}
          disabled={isLoadingPrices}
        >
          {isLoadingPrices ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span className="ml-2">Refresh</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gold 22K Card */}
        <div className="glass-card-elevated p-6 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-gold">
              <Coins className="w-6 h-6 text-primary-foreground" />
            </div>
            {livePrices?.gold22k ? (
              <span className={`flex items-center gap-1 text-sm font-medium ${livePrices.gold22k.change.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {livePrices.gold22k.change.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {livePrices.gold22k.change.isPositive ? '+' : '-'}{livePrices.gold22k.change.value.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                <TrendingUp className="w-4 h-4" />+1.2%
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">Gold 22K (per gram)</p>
          <p className="text-3xl font-serif font-bold gold-text">
            {isLoadingPrices ? <Loader2 className="w-6 h-6 animate-spin" /> : `₹${parseInt(goldPrice22k).toLocaleString('en-IN')}`}
          </p>
        </div>

        {/* Gold 18K Card */}
        <div className="glass-card-elevated p-6 animate-slide-up opacity-0 delay-100" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Coins className="w-6 h-6 text-amber-600" />
            </div>
            {livePrices?.gold18k ? (
              <span className={`flex items-center gap-1 text-sm font-medium ${livePrices.gold18k.change.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {livePrices.gold18k.change.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {livePrices.gold18k.change.isPositive ? '+' : '-'}{livePrices.gold18k.change.value.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                <TrendingUp className="w-4 h-4" />+0.9%
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">Gold 18K (per gram)</p>
          <p className="text-3xl font-serif font-bold text-amber-600">
            {isLoadingPrices ? <Loader2 className="w-6 h-6 animate-spin" /> : `₹${parseInt(goldPrice18k).toLocaleString('en-IN')}`}
          </p>
        </div>

        {/* Silver Card */}
        <div className="glass-card-elevated p-6 animate-slide-up opacity-0 delay-200" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <Coins className="w-6 h-6 text-slate-500" />
            </div>
            {livePrices?.silver ? (
              <span className={`flex items-center gap-1 text-sm font-medium ${livePrices.silver.change.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {livePrices.silver.change.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {livePrices.silver.change.isPositive ? '+' : '-'}{livePrices.silver.change.value.toFixed(1)}%
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-red-500 font-medium">
                <TrendingDown className="w-4 h-4" />-0.3%
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">Silver (per gram)</p>
          <p className="text-3xl font-serif font-bold text-slate-600">
            {isLoadingPrices ? <Loader2 className="w-6 h-6 animate-spin" /> : `₹${parseInt(silverPrice).toLocaleString('en-IN')}`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Update Rates Form */}
        <div className="glass-card-elevated p-6 animate-slide-up opacity-0 delay-300" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold">Update Daily Rates</h3>
              <p className="text-sm text-muted-foreground">Set today's metal prices</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gold22k">Gold 22K (₹/gram)</Label>
                <Input
                  id="gold22k"
                  type="number"
                  value={goldPrice22k}
                  onChange={(e) => setGoldPrice22k(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gold18k">Gold 18K (₹/gram)</Label>
                <Input
                  id="gold18k"
                  type="number"
                  value={goldPrice18k}
                  onChange={(e) => setGoldPrice18k(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="silver">Silver (₹/gram)</Label>
              <Input
                id="silver"
                type="number"
                value={silverPrice}
                onChange={(e) => setSilverPrice(e.target.value)}
                className="h-11"
              />
            </div>

            <Button 
              variant="gold" 
              className="w-full mt-2"
              onClick={handleUpdateRates}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Today's Rates
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Price Calculator */}
        <div className="glass-card-elevated p-6 animate-slide-up opacity-0 delay-400" style={{ animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">Price Calculator</h3>
                <p className="text-sm text-muted-foreground">Preview jewelry pricing</p>
              </div>
            </div>
            {/* GST Toggle */}
            <div className="flex items-center gap-3 p-2 px-3 rounded-lg bg-secondary/50">
              <span className={`text-sm ${!isGstInclusive ? 'font-medium' : 'text-muted-foreground'}`}>Excl. GST</span>
              <Switch
                checked={isGstInclusive}
                onCheckedChange={setIsGstInclusive}
              />
              <span className={`text-sm ${isGstInclusive ? 'font-medium' : 'text-muted-foreground'}`}>Incl. GST</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calcWeight">Weight (grams)</Label>
                <Input
                  id="calcWeight"
                  type="number"
                  step="0.01"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="making">Making Charges (₹)</Label>
                <Input
                  id="making"
                  type="number"
                  value={makingCharges}
                  onChange={(e) => setMakingCharges(e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Gold 22K Breakdown */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/30 space-y-2">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold gold-text">Gold 22K Pricing</p>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleGenerateInvoice("gold22k")}>
                  <FileText className="w-3 h-3 mr-1" />
                  Invoice
                </Button>
              </div>
              {isGstInclusive ? (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice22k)).basePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">CGST ({CGST_RATE}%)</span>
                    <span className="font-medium text-emerald-600">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice22k)).cgst)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">SGST ({SGST_RATE}%)</span>
                    <span className="font-medium text-emerald-600">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice22k)).sgst)}</span>
                  </div>
                  <div className="border-t border-amber-200/50 dark:border-amber-800/30 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Total (incl. GST)</span>
                      <span className="font-serif font-bold gold-text text-lg">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice22k)).totalPrice)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Price (excl. GST)</span>
                  <span className="font-serif font-bold gold-text text-lg">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice22k)).basePrice)}</span>
                </div>
              )}
            </div>

            {/* Gold 18K Breakdown */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border border-orange-200/50 dark:border-orange-800/30 space-y-2">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-amber-600">Gold 18K Pricing</p>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleGenerateInvoice("gold18k")}>
                  <FileText className="w-3 h-3 mr-1" />
                  Invoice
                </Button>
              </div>
              {isGstInclusive ? (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice18k)).basePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">CGST ({CGST_RATE}%)</span>
                    <span className="font-medium text-emerald-600">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice18k)).cgst)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">SGST ({SGST_RATE}%)</span>
                    <span className="font-medium text-emerald-600">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice18k)).sgst)}</span>
                  </div>
                  <div className="border-t border-orange-200/50 dark:border-orange-800/30 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Total (incl. GST)</span>
                      <span className="font-serif font-bold text-amber-600 text-lg">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice18k)).totalPrice)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Price (excl. GST)</span>
                  <span className="font-serif font-bold text-amber-600 text-lg">₹{formatPrice(calculatePriceDetails(parseFloat(goldPrice18k)).basePrice)}</span>
                </div>
              )}
            </div>

            {/* Silver Breakdown */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/10 border border-slate-200/50 dark:border-slate-800/30 space-y-2">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Silver Pricing</p>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleGenerateInvoice("silver")}>
                  <FileText className="w-3 h-3 mr-1" />
                  Invoice
                </Button>
              </div>
              {isGstInclusive ? (
                <>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">₹{formatPrice(calculatePriceDetails(parseFloat(silverPrice)).basePrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">CGST ({CGST_RATE}%)</span>
                    <span className="font-medium text-emerald-600">₹{formatPrice(calculatePriceDetails(parseFloat(silverPrice)).cgst)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">SGST ({SGST_RATE}%)</span>
                    <span className="font-medium text-emerald-600">₹{formatPrice(calculatePriceDetails(parseFloat(silverPrice)).sgst)}</span>
                  </div>
                  <div className="border-t border-slate-200/50 dark:border-slate-800/30 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold">Total (incl. GST)</span>
                      <span className="font-serif font-bold text-slate-600 dark:text-slate-400 text-lg">₹{formatPrice(calculatePriceDetails(parseFloat(silverPrice)).totalPrice)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold">Price (excl. GST)</span>
                  <span className="font-serif font-bold text-slate-600 dark:text-slate-400 text-lg">₹{formatPrice(calculatePriceDetails(parseFloat(silverPrice)).basePrice)}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Formula: Base = (Weight × Rate) + Making Charges | GST = {GST_RATE}% (CGST {CGST_RATE}% + SGST {SGST_RATE}%)
            </p>
          </div>
        </div>
      </div>

      {/* Price History Table */}
      <div className="glass-card-elevated p-6 mt-6 animate-slide-up opacity-0 delay-500" style={{ animationFillMode: 'forwards' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
            <History className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">Price History</h3>
            <p className="text-sm text-muted-foreground">Last 7 days rate changes</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Gold 22K</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Gold 18K</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Silver</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              {priceHistory.map((row, index) => (
                <tr 
                  key={row.date} 
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors animate-slide-up opacity-0"
                  style={{ animationDelay: `${600 + index * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <td className="py-3 px-4 text-sm font-medium">{row.date}</td>
                  <td className="py-3 px-4 text-right text-sm gold-text font-semibold">₹{row.gold22k.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-sm text-amber-600 font-semibold">₹{row.gold18k.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-sm text-slate-600 font-semibold">₹{row.silver}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                      row.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {row.change.startsWith('+') ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {row.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GST Invoice Dialog */}
      <GSTInvoice
        open={showInvoice}
        onClose={() => setShowInvoice(false)}
        items={getInvoiceItems()}
        customer={customer}
        onCustomerChange={setCustomer}
        invoiceNumber={generateInvoiceNumber()}
        invoiceDate={new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        shopDetails={shopDetails}
        cgstRate={CGST_RATE}
        sgstRate={SGST_RATE}
      />
    </DashboardLayout>
  );
}