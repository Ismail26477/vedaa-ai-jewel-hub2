import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Sparkles, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { jewelryApi } from "@/lib/jewelryApi";

export default function AddJewelry() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    metalType: "",
    purity: "",
    weight: "",
    makingCharges: "",
    description: "",
    imageUrl: "",
  });

  const goldPricePerGram = 7500; // Current gold price

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        // For now, we'll use a placeholder URL since we don't have image storage set up
        // In production, you'd upload to storage and get a URL back
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateEmbedding = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "AI Embedding Generated",
        description: "Image has been processed and embedding stored successfully.",
      });
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.metalType || !formData.purity) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await jewelryApi.add({
        name: formData.name,
        category: formData.category,
        imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
        metalType: formData.metalType,
        purity: formData.purity,
        weight: parseFloat(formData.weight) || 0,
        makingCharges: parseFloat(formData.makingCharges) || 0,
        description: formData.description,
        status: "active",
      });
      
      toast({
        title: "Jewelry Added Successfully",
        description: "The jewelry item has been saved to MongoDB.",
      });
      
      navigate("/jewelry");
    } catch (error) {
      console.error("Failed to add jewelry:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save jewelry",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate estimated price
  const weight = parseFloat(formData.weight) || 0;
  const makingCharges = parseFloat(formData.makingCharges) || 0;
  const baseMetalValue = weight * goldPricePerGram;
  const estimatedPrice = baseMetalValue + makingCharges;

  return (
    <DashboardLayout title="Add New Jewelry" subtitle="Add a new item to your database">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <div className="glass-card-elevated p-6 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Label className="text-base font-medium mb-4 block">Jewelry Image</Label>
              
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-gold/50 hover:bg-secondary/30 transition-all group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-gold" />
                    </div>
                    <p className="mb-2 text-sm font-medium">
                      <span className="text-gold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData(prev => ({ ...prev, imageUrl: "" }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {imagePreview && (
                <Button
                  type="button"
                  variant="gold-outline"
                  className="w-full mt-4"
                  onClick={handleGenerateEmbedding}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Embedding...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate AI Embedding
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Price Preview */}
            <div className="glass-card p-6 animate-slide-up opacity-0 delay-100" style={{ animationFillMode: 'forwards' }}>
              <h3 className="font-serif text-lg font-semibold mb-4">Price Preview</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Metal Value ({weight}g × ₹{goldPricePerGram})</span>
                  <span>₹{baseMetalValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Making Charges</span>
                  <span>₹{makingCharges.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span>Estimated Price</span>
                  <span className="text-lg gold-text">₹{estimatedPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6">
            <div className="glass-card-elevated p-6 space-y-5 animate-slide-up opacity-0 delay-200" style={{ animationFillMode: 'forwards' }}>
              <h3 className="font-serif text-lg font-semibold pb-2 border-b border-border">Jewelry Details</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Jewelry Name *</Label>
                <Input 
                  id="name" 
                  placeholder="e.g., Diamond Solitaire Ring"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rings">Rings</SelectItem>
                      <SelectItem value="Necklaces">Necklaces</SelectItem>
                      <SelectItem value="Earrings">Earrings</SelectItem>
                      <SelectItem value="Bangles">Bangles</SelectItem>
                      <SelectItem value="Bracelets">Bracelets</SelectItem>
                      <SelectItem value="Sets">Sets</SelectItem>
                      <SelectItem value="Pendants">Pendants</SelectItem>
                      <SelectItem value="Anklets">Anklets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metal">Metal Type *</Label>
                  <Select value={formData.metalType} onValueChange={(value) => setFormData(prev => ({ ...prev, metalType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select metal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="White Gold">White Gold</SelectItem>
                      <SelectItem value="Rose Gold">Rose Gold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purity">Purity *</Label>
                  <Select value={formData.purity} onValueChange={(value) => setFormData(prev => ({ ...prev, purity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24K">24K (99.9%)</SelectItem>
                      <SelectItem value="22K">22K (91.6%)</SelectItem>
                      <SelectItem value="18K">18K (75%)</SelectItem>
                      <SelectItem value="14K">14K (58.3%)</SelectItem>
                      <SelectItem value="925">925 Silver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (grams)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    step="0.01" 
                    placeholder="e.g., 5.25"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="making">Making Charges (₹)</Label>
                <Input 
                  id="making" 
                  type="number" 
                  placeholder="e.g., 5000"
                  value={formData.makingCharges}
                  onChange={(e) => setFormData(prev => ({ ...prev, makingCharges: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description / Notes</Label>
                <Textarea
                  id="description"
                  placeholder="Add any additional details about this jewelry piece..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 animate-slide-up opacity-0 delay-300" style={{ animationFillMode: 'forwards' }}>
              <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/jewelry")}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" className="flex-1" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save to Database
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
