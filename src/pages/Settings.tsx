import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Settings2, 
  Palette, 
  IndianRupee, 
  Brain, 
  Bell, 
  Shield, 
  Database,
  Upload,
  Save,
  RotateCcw,
  Sparkles,
  Globe,
  Moon,
  Sun,
  Zap,
  Server,
  Key,
  Clock,
  Languages,
  HardDrive,
  Cloud,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Info,
  ExternalLink,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Activity,
  Cpu,
  Wifi,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { settings, loading, saving, saveSettings, resetSettings } = useUserSettings();
  
  // Local state for form (synced from settings)
  const [brandName, setBrandName] = useState(settings.brand_name);
  const [tagline, setTagline] = useState("AI-Powered Jewelry Matching");
  const [currency, setCurrency] = useState(settings.currency);
  const [goldPricePerGram, setGoldPricePerGram] = useState(String(settings.gold_rate));
  const [priceRounding, setPriceRounding] = useState("nearest-100");
  const [includeTax, setIncludeTax] = useState(true);
  const [taxRate, setTaxRate] = useState("3");
  const [aiSensitivity, setAiSensitivity] = useState([settings.ai_sensitivity]);
  const [minConfidence, setMinConfidence] = useState([60]);
  const [maxResults, setMaxResults] = useState("10");
  const [autoMatch, setAutoMatch] = useState(settings.auto_match);
  const [aiModel, setAiModel] = useState("gemini-flash");
  const [emailNotifications, setEmailNotifications] = useState(settings.email_notifications);
  const [matchAlerts, setMatchAlerts] = useState(settings.match_alerts);
  const [priceAlerts, setPriceAlerts] = useState(settings.price_alerts);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(settings.dark_mode);
  const [compactView, setCompactView] = useState(settings.compact_view);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [language, setLanguage] = useState(settings.language);
  const [timezone, setTimezone] = useState(settings.timezone);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState("vd_ai_xxxxx...xxxxx");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiRateLimit, setApiRateLimit] = useState("100");
  const [autoBackup, setAutoBackup] = useState(settings.auto_backup);
  const [backupFrequency, setBackupFrequency] = useState(settings.backup_frequency);
  const [retentionDays, setRetentionDays] = useState("30");
  const [twoFactorAuth, setTwoFactorAuth] = useState(settings.two_factor_enabled);
  const [sessionTimeout, setSessionTimeout] = useState(String(settings.session_timeout));
  const [ipWhitelist, setIpWhitelist] = useState("");

  // Sync local state when settings load
  useEffect(() => {
    if (!loading) {
      setBrandName(settings.brand_name);
      setCurrency(settings.currency);
      setGoldPricePerGram(String(settings.gold_rate));
      setAiSensitivity([settings.ai_sensitivity]);
      setAutoMatch(settings.auto_match);
      setEmailNotifications(settings.email_notifications);
      setMatchAlerts(settings.match_alerts);
      setPriceAlerts(settings.price_alerts);
      setDarkMode(settings.dark_mode);
      setCompactView(settings.compact_view);
      setLanguage(settings.language);
      setTimezone(settings.timezone);
      setAutoBackup(settings.auto_backup);
      setBackupFrequency(settings.backup_frequency);
      setTwoFactorAuth(settings.two_factor_enabled);
      setSessionTimeout(String(settings.session_timeout));
    }
  }, [loading, settings]);

  // System Status (mock data)
  const systemStatus = {
    database: { status: "connected", latency: "12ms" },
    ai: { status: "operational", usage: 68 },
    storage: { used: 2.4, total: 10 },
    api: { requests: 1247, limit: 5000 }
  };

  const handleSave = async () => {
    await saveSettings({
      brand_name: brandName,
      currency,
      gold_rate: Number(goldPricePerGram),
      ai_sensitivity: aiSensitivity[0],
      auto_match: autoMatch,
      email_notifications: emailNotifications,
      match_alerts: matchAlerts,
      price_alerts: priceAlerts,
      dark_mode: darkMode,
      compact_view: compactView,
      language,
      timezone,
      auto_backup: autoBackup,
      backup_frequency: backupFrequency,
      two_factor_enabled: twoFactorAuth,
      session_timeout: Number(sessionTimeout),
    });
  };

  const handleReset = async () => {
    await resetSettings();
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup Started",
      description: "Creating a backup of your data. This may take a few minutes.",
    });
  };

  const handleRegenerateApiKey = () => {
    toast({
      title: "API Key Regenerated",
      description: "Your new API key has been generated. Please update your integrations.",
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Settings" subtitle="Configure your Vedaa AI dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings" subtitle="Configure your Vedaa AI dashboard">
      <div className="max-w-4xl space-y-8">
        
        {/* System Status */}
        <section className="glass-card p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">System Status</h2>
              <p className="text-sm text-muted-foreground">Real-time system health monitoring</p>
            </div>
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              All Systems Operational
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Database</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Connected • {systemStatus.database.latency}</span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI Engine</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Usage</span>
                  <span className="text-xs font-medium">{systemStatus.ai.usage}%</span>
                </div>
                <Progress value={systemStatus.ai.usage} className="h-1.5" />
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{systemStatus.storage.used}GB / {systemStatus.storage.total}GB</span>
                </div>
                <Progress value={(systemStatus.storage.used / systemStatus.storage.total) * 100} className="h-1.5" />
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">API Requests</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{systemStatus.api.requests.toLocaleString()} / {systemStatus.api.limit.toLocaleString()}</span>
                </div>
                <Progress value={(systemStatus.api.requests / systemStatus.api.limit) * 100} className="h-1.5" />
              </div>
            </div>
          </div>
        </section>

        {/* Brand Settings */}
        <section className="glass-card p-6 animate-fade-in delay-100" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Brand Settings</h2>
              <p className="text-sm text-muted-foreground">Customize your brand identity</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input 
                id="brandName" 
                value={brandName} 
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter brand name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input 
                id="tagline" 
                value={tagline} 
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Enter tagline"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Brand Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-border flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Brand Colors</Label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary border-2 border-border cursor-pointer hover:scale-105 transition-transform" title="Primary Color" />
                <div className="w-10 h-10 rounded-lg bg-secondary border-2 border-border cursor-pointer hover:scale-105 transition-transform" title="Secondary Color" />
                <div className="w-10 h-10 rounded-lg bg-accent border-2 border-border cursor-pointer hover:scale-105 transition-transform" title="Accent Color" />
                <Button variant="ghost" size="sm" className="text-xs">
                  Customize
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Currency & Pricing */}
        <section className="glass-card p-6 animate-fade-in delay-100" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <IndianRupee className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Currency & Pricing</h2>
              <p className="text-sm text-muted-foreground">Set your pricing preferences</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">₹ Indian Rupee (INR)</SelectItem>
                  <SelectItem value="USD">$ US Dollar (USD)</SelectItem>
                  <SelectItem value="EUR">€ Euro (EUR)</SelectItem>
                  <SelectItem value="GBP">£ British Pound (GBP)</SelectItem>
                  <SelectItem value="AED">د.إ UAE Dirham (AED)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goldPrice">Gold Price per Gram (22K)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <Input 
                  id="goldPrice" 
                  value={goldPricePerGram} 
                  onChange={(e) => setGoldPricePerGram(e.target.value)}
                  className="pl-8"
                  type="number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rounding">Price Rounding</Label>
              <Select value={priceRounding} onValueChange={setPriceRounding}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rounding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Rounding</SelectItem>
                  <SelectItem value="nearest-10">Nearest ₹10</SelectItem>
                  <SelectItem value="nearest-50">Nearest ₹50</SelectItem>
                  <SelectItem value="nearest-100">Nearest ₹100</SelectItem>
                  <SelectItem value="nearest-500">Nearest ₹500</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="includeTax">Include GST</Label>
                  <p className="text-xs text-muted-foreground">Add tax to displayed prices</p>
                </div>
                <Switch 
                  id="includeTax" 
                  checked={includeTax} 
                  onCheckedChange={setIncludeTax}
                />
              </div>
              
              {includeTax && (
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input 
                    id="taxRate" 
                    value={taxRate} 
                    onChange={(e) => setTaxRate(e.target.value)}
                    type="number"
                    className="w-24"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* AI Matching Settings */}
        <section className="glass-card p-6 animate-fade-in delay-200" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl font-semibold">AI Matching</h2>
                <p className="text-sm text-muted-foreground">Configure AI matching sensitivity</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                <Zap className="w-3 h-3 mr-1" />
                Powered by AI
              </Badge>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="aiModel">AI Model</Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini-flash">Gemini 2.5 Flash (Balanced)</SelectItem>
                  <SelectItem value="gemini-pro">Gemini 2.5 Pro (Most Accurate)</SelectItem>
                  <SelectItem value="gemini-lite">Gemini Flash Lite (Fastest)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose the AI model based on your accuracy vs speed preference</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Matching Sensitivity</Label>
                <span className="text-sm font-medium text-primary">{aiSensitivity[0]}%</span>
              </div>
              <Slider 
                value={aiSensitivity} 
                onValueChange={setAiSensitivity}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher values require closer matches. Lower values show more results with varying similarity.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Minimum Confidence Threshold</Label>
                <span className="text-sm font-medium text-primary">{minConfidence[0]}%</span>
              </div>
              <Slider 
                value={minConfidence} 
                onValueChange={setMinConfidence}
                max={100}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Only show matches above this confidence level.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxResults">Maximum Results per Search</Label>
                <Select value={maxResults} onValueChange={setMaxResults}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select max results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 results</SelectItem>
                    <SelectItem value="10">10 results</SelectItem>
                    <SelectItem value="15">15 results</SelectItem>
                    <SelectItem value="20">20 results</SelectItem>
                    <SelectItem value="50">50 results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="space-y-0.5">
                  <Label htmlFor="autoMatch">Auto-Match on Upload</Label>
                  <p className="text-xs text-muted-foreground">Automatically find matches when adding new jewelry</p>
                </div>
                <Switch 
                  id="autoMatch" 
                  checked={autoMatch} 
                  onCheckedChange={setAutoMatch}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Localization */}
        <section className="glass-card p-6 animate-fade-in delay-200" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Languages className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Localization</h2>
              <p className="text-sm text-muted-foreground">Language and regional settings</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                  <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">India Standard Time (IST)</SelectItem>
                  <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                  <SelectItem value="Asia/Singapore">Singapore Time (SGT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* API Configuration */}
        <section className="glass-card p-6 animate-fade-in delay-200" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">API Configuration</h2>
              <p className="text-sm text-muted-foreground">Manage API access and webhooks</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input 
                    id="apiKey" 
                    value={apiKey}
                    type={showApiKey ? "text" : "password"}
                    readOnly
                    className="pr-10 font-mono text-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0 h-full"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <Button variant="outline" onClick={handleRegenerateApiKey}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Use this key to authenticate API requests</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input 
                id="webhookUrl" 
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-domain.com/webhook"
              />
              <p className="text-xs text-muted-foreground">Receive real-time notifications for match events</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiRateLimit">Rate Limit (requests/hour)</Label>
              <Select value={apiRateLimit} onValueChange={setApiRateLimit}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 requests/hour</SelectItem>
                  <SelectItem value="500">500 requests/hour</SelectItem>
                  <SelectItem value="1000">1,000 requests/hour</SelectItem>
                  <SelectItem value="5000">5,000 requests/hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="glass-card p-6 animate-fade-in delay-300" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
              </div>
              <Switch 
                id="emailNotifications" 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Browser push notifications</p>
                </div>
              </div>
              <Switch 
                id="pushNotifications" 
                checked={pushNotifications} 
                onCheckedChange={setPushNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="matchAlerts">Match Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when AI finds high-confidence matches</p>
                </div>
              </div>
              <Switch 
                id="matchAlerts" 
                checked={matchAlerts} 
                onCheckedChange={setMatchAlerts}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="priceAlerts">Price Change Alerts</Label>
                  <p className="text-xs text-muted-foreground">Notify when gold prices change significantly</p>
                </div>
              </div>
              <Switch 
                id="priceAlerts" 
                checked={priceAlerts} 
                onCheckedChange={setPriceAlerts}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="weeklyReports">Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Receive weekly analytics summary</p>
                </div>
              </div>
              <Switch 
                id="weeklyReports" 
                checked={weeklyReports} 
                onCheckedChange={setWeeklyReports}
              />
            </div>
          </div>
        </section>

        {/* Backup & Recovery */}
        <section className="glass-card p-6 animate-fade-in delay-300" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Cloud className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Backup & Recovery</h2>
              <p className="text-sm text-muted-foreground">Manage data backups and restoration</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="space-y-0.5">
                <Label htmlFor="autoBackup">Automatic Backups</Label>
                <p className="text-xs text-muted-foreground">Automatically backup your data</p>
              </div>
              <Switch 
                id="autoBackup" 
                checked={autoBackup} 
                onCheckedChange={setAutoBackup}
              />
            </div>
            
            {autoBackup && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="retentionDays">Retention Period</Label>
                  <Select value={retentionDays} onValueChange={setRetentionDays}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select retention" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Last Backup: Today at 3:45 AM</p>
                <p className="text-xs text-muted-foreground">All 847 jewelry items backed up successfully</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleBackupNow}>
                <Download className="w-4 h-4 mr-2" />
                Backup Now
              </Button>
            </div>
          </div>
        </section>

        {/* Display Settings */}
        <section className="glass-card p-6 animate-fade-in delay-400" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Display</h2>
              <p className="text-sm text-muted-foreground">Customize your viewing experience</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
                <Label htmlFor="darkMode">Dark Mode</Label>
              </div>
              <Switch 
                id="darkMode" 
                checked={darkMode} 
                onCheckedChange={setDarkMode}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary" />
                <Label htmlFor="compactView">Compact View</Label>
              </div>
              <Switch 
                id="compactView" 
                checked={compactView} 
                onCheckedChange={setCompactView}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label htmlFor="animations">Animations</Label>
              </div>
              <Switch 
                id="animations" 
                checked={animationsEnabled} 
                onCheckedChange={setAnimationsEnabled}
              />
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="glass-card p-6 animate-fade-in delay-400" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Security</h2>
              <p className="text-sm text-muted-foreground">Protect your account and data</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch 
                id="twoFactorAuth" 
                checked={twoFactorAuth} 
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                    <SelectItem value="480">8 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Input 
                  id="ipWhitelist" 
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  placeholder="192.168.1.1, 10.0.0.1"
                />
                <p className="text-xs text-muted-foreground">Comma-separated list (leave empty to allow all)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="glass-card p-6 animate-fade-in delay-500" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Data Management</h2>
              <p className="text-sm text-muted-foreground">Import, export, and manage your data</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <Download className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Export Data</div>
                <div className="text-xs text-muted-foreground">Download as CSV/JSON</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <Upload className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-medium">Import Data</div>
                <div className="text-xs text-muted-foreground">Upload from file</div>
              </div>
            </Button>
            
            <Button variant="outline" className="justify-start h-auto p-4 text-destructive hover:text-destructive">
              <Trash2 className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">Clear All Data</div>
                <div className="text-xs opacity-70">This cannot be undone</div>
              </div>
            </Button>
          </div>
        </section>

        {/* Help & Support */}
        <section className="glass-card p-6 animate-fade-in delay-500" style={{ animationFillMode: 'backwards' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Help & Support</h2>
              <p className="text-sm text-muted-foreground">Get assistance and learn more</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="ghost" className="justify-start h-auto p-4">
              <FileText className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left flex-1">
                <div className="font-medium">Documentation</div>
                <div className="text-xs text-muted-foreground">Read the user guide</div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Button>
            
            <Button variant="ghost" className="justify-start h-auto p-4">
              <MessageSquare className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left flex-1">
                <div className="font-medium">Contact Support</div>
                <div className="text-xs text-muted-foreground">Get help from our team</div>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Button>
            
            <Button variant="ghost" className="justify-start h-auto p-4">
              <Phone className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left flex-1">
                <div className="font-medium">Call Us</div>
                <div className="text-xs text-muted-foreground">+91 98765 43210</div>
              </div>
            </Button>
            
            <Button variant="ghost" className="justify-start h-auto p-4">
              <Mail className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left flex-1">
                <div className="font-medium">Email</div>
                <div className="text-xs text-muted-foreground">support@vedaa.ai</div>
              </div>
            </Button>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <Button variant="ghost" onClick={handleReset} disabled={saving}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          
          <Button variant="gold" onClick={handleSave} size="lg" disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>

        {/* Footer Info */}
        <Separator />
        <div className="text-center py-6 space-y-3">
          <p className="font-serif text-xl gold-text">{brandName}</p>
          <p className="text-sm text-muted-foreground">{tagline}</p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>© {new Date().getFullYear()} All rights reserved</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}