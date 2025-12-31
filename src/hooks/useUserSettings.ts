import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface UserSettings {
  brand_name: string;
  currency: string;
  gold_rate: number;
  silver_rate: number;
  making_charge: number;
  ai_sensitivity: number;
  auto_match: boolean;
  email_notifications: boolean;
  match_alerts: boolean;
  price_alerts: boolean;
  dark_mode: boolean;
  compact_view: boolean;
  language: string;
  timezone: string;
  auto_backup: boolean;
  backup_frequency: string;
  two_factor_enabled: boolean;
  session_timeout: number;
}

const defaultSettings: UserSettings = {
  brand_name: "Vedaa AI",
  currency: "INR",
  gold_rate: 6500,
  silver_rate: 85,
  making_charge: 12,
  ai_sensitivity: 75,
  auto_match: true,
  email_notifications: true,
  match_alerts: true,
  price_alerts: false,
  dark_mode: false,
  compact_view: false,
  language: "en",
  timezone: "Asia/Kolkata",
  auto_backup: true,
  backup_frequency: "daily",
  two_factor_enabled: false,
  session_timeout: 30,
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          brand_name: data.brand_name || defaultSettings.brand_name,
          currency: data.currency || defaultSettings.currency,
          gold_rate: Number(data.gold_rate) || defaultSettings.gold_rate,
          silver_rate: Number(data.silver_rate) || defaultSettings.silver_rate,
          making_charge: Number(data.making_charge) || defaultSettings.making_charge,
          ai_sensitivity: Number(data.ai_sensitivity) || defaultSettings.ai_sensitivity,
          auto_match: data.auto_match ?? defaultSettings.auto_match,
          email_notifications: data.email_notifications ?? defaultSettings.email_notifications,
          match_alerts: data.match_alerts ?? defaultSettings.match_alerts,
          price_alerts: data.price_alerts ?? defaultSettings.price_alerts,
          dark_mode: data.dark_mode ?? defaultSettings.dark_mode,
          compact_view: data.compact_view ?? defaultSettings.compact_view,
          language: data.language || defaultSettings.language,
          timezone: data.timezone || defaultSettings.timezone,
          auto_backup: data.auto_backup ?? defaultSettings.auto_backup,
          backup_frequency: data.backup_frequency || defaultSettings.backup_frequency,
          two_factor_enabled: data.two_factor_enabled ?? defaultSettings.two_factor_enabled,
          session_timeout: data.session_timeout ?? defaultSettings.session_timeout,
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from("user_settings")
        .update({
          brand_name: updatedSettings.brand_name,
          currency: updatedSettings.currency,
          gold_rate: updatedSettings.gold_rate,
          silver_rate: updatedSettings.silver_rate,
          making_charge: updatedSettings.making_charge,
          ai_sensitivity: updatedSettings.ai_sensitivity,
          auto_match: updatedSettings.auto_match,
          email_notifications: updatedSettings.email_notifications,
          match_alerts: updatedSettings.match_alerts,
          price_alerts: updatedSettings.price_alerts,
          dark_mode: updatedSettings.dark_mode,
          compact_view: updatedSettings.compact_view,
          language: updatedSettings.language,
          timezone: updatedSettings.timezone,
          auto_backup: updatedSettings.auto_backup,
          backup_frequency: updatedSettings.backup_frequency,
          two_factor_enabled: updatedSettings.two_factor_enabled,
          session_timeout: updatedSettings.session_timeout,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings(updatedSettings);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = async () => {
    await saveSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults.",
    });
  };

  return {
    settings,
    setSettings,
    loading,
    saving,
    saveSettings,
    resetSettings,
    refetch: fetchSettings,
  };
}
