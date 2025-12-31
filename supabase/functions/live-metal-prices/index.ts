import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// GoldAPI.io endpoint
const GOLDAPI_BASE_URL = "https://www.goldapi.io/api";

// Convert USD to INR (approximate rate - in production you'd fetch this too)
const USD_TO_INR = 83.5;

interface GoldAPIResponse {
  timestamp: number;
  metal: string;
  currency: string;
  exchange: string;
  symbol: string;
  prev_close_price: number;
  open_price: number;
  low_price: number;
  high_price: number;
  open_time: number;
  price: number;
  ch: number;
  chp: number;
  ask: number;
  bid: number;
  price_gram_24k: number;
  price_gram_22k: number;
  price_gram_21k: number;
  price_gram_20k: number;
  price_gram_18k: number;
}

async function fetchMetalPrice(metal: string, apiKey: string): Promise<GoldAPIResponse | null> {
  try {
    const response = await fetch(`${GOLDAPI_BASE_URL}/${metal}/USD`, {
      headers: {
        'x-access-token': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`GoldAPI error for ${metal}:`, response.status, await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${metal} price:`, error);
    return null;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOLDAPI_KEY');
    
    if (!apiKey) {
      console.error("GOLDAPI_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    console.log("Fetching live metal prices from GoldAPI.io...");

    // Fetch gold and silver prices in parallel
    const [goldData, silverData] = await Promise.all([
      fetchMetalPrice('XAU', apiKey),
      fetchMetalPrice('XAG', apiKey),
    ]);

    if (!goldData) {
      console.error("Failed to fetch gold prices");
      return new Response(
        JSON.stringify({ error: "Failed to fetch gold prices from API" }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      );
    }

    // Convert prices from USD to INR
    const gold24kINR = Math.round(goldData.price_gram_24k * USD_TO_INR);
    const gold22kINR = Math.round(goldData.price_gram_22k * USD_TO_INR);
    const gold18kINR = Math.round(goldData.price_gram_18k * USD_TO_INR);
    
    // Silver price per gram (XAG is per troy ounce, 1 troy oz = 31.1035 grams)
    const silverPricePerGram = silverData ? (silverData.price / 31.1035) : 0;
    const silverINR = Math.round(silverPricePerGram * USD_TO_INR);

    const prices = {
      gold24k: {
        price: gold24kINR,
        change: { 
          value: Math.abs(goldData.chp || 0), 
          isPositive: (goldData.ch || 0) >= 0 
        },
        unit: "per gram",
        currency: "INR",
      },
      gold22k: {
        price: gold22kINR,
        change: { 
          value: Math.abs(goldData.chp || 0), 
          isPositive: (goldData.ch || 0) >= 0 
        },
        unit: "per gram",
        currency: "INR",
      },
      gold18k: {
        price: gold18kINR,
        change: { 
          value: Math.abs(goldData.chp || 0), 
          isPositive: (goldData.ch || 0) >= 0 
        },
        unit: "per gram",
        currency: "INR",
      },
      silver: {
        price: silverINR,
        change: { 
          value: Math.abs(silverData?.chp || 0), 
          isPositive: (silverData?.ch || 0) >= 0 
        },
        unit: "per gram",
        currency: "INR",
      },
      lastUpdated: new Date().toISOString(),
      source: "GoldAPI.io",
      usdToInrRate: USD_TO_INR,
    };

    console.log("Live prices fetched successfully:", prices);

    return new Response(JSON.stringify(prices), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching prices:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch live prices" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
