import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gem, Eye, EyeOff, ArrowRight, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate
    const schema = isSignUp ? signupSchema : loginSchema;
    const data = isSignUp ? { email, password, fullName } : { email, password };
    const result = schema.safeParse(data);
    
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string; fullName?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }
        toast({
          title: "Account created!",
          description: "Welcome to Vedaa AI. You're now logged in.",
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Invalid credentials",
              description: "Please check your email and password.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign in failed",
              description: error.message,
              variant: "destructive",
            });
          }
          setIsLoading(false);
          return;
        }
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      }
      navigate("/");
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-cream via-cream-dark to-secondary overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl animate-float" />
          <div className="absolute bottom-32 right-16 w-80 h-80 rounded-full bg-gold/5 blur-3xl animate-float delay-300" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-gold-light/20 blur-2xl animate-float delay-500" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-16">
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center shadow-gold mb-6">
              <Gem className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-serif text-5xl font-bold mb-4">
              <span className="gold-text">Vedaa AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Intelligent jewelry matching powered by advanced AI. Transform how you manage and match your jewelry inventory.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              "AI-powered image matching",
              "Smart inventory management",
              "Real-time price calculations",
              "Detailed analytics & reports"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Jewelry illustration */}
        <div className="absolute bottom-0 right-0 w-80 h-80 opacity-20">
          <svg viewBox="0 0 200 200" className="w-full h-full text-gold">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M100 20 L120 60 L100 100 L80 60 Z" fill="currentColor" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center shadow-gold">
              <Gem className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold gold-text">Vedaa AI</h1>
              <p className="text-xs text-muted-foreground">Jewelry Intelligence</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-serif text-3xl font-bold mb-2">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-muted-foreground">
              {isSignUp ? "Sign up to get started with Vedaa AI" : "Sign in to access your dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className={`h-12 ${errors.fullName ? "border-destructive" : ""}`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vedaa.ai"
                className={`h-12 ${errors.email ? "border-destructive" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <button 
                    type="button"
                    className="text-sm text-gold hover:text-gold-dark transition-colors"
                    onClick={() => toast({ title: "Password Reset", description: "Contact support@vedaa.ai to reset your password." })}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`h-12 pr-12 ${errors.password ? "border-destructive" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" variant="gold" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                <>
                  Create Account
                  <UserPlus className="w-5 h-5 ml-2" />
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                }}
                className="text-gold hover:text-gold-dark transition-colors font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact{" "}
              <a href="mailto:support@vedaa.ai" className="text-gold hover:text-gold-dark transition-colors">
                support@vedaa.ai
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 Vedaa AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
