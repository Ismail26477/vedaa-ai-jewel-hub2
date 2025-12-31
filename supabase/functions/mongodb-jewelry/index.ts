import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "npm:mongodb@6.11.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

let cachedClient: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }
  
  const uri = Deno.env.get("MONGODB_URI");
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }
  
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  console.log("Connected to MongoDB");
  return client;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const client = await getMongoClient();
    const db = client.db("vedaa_ai_jewelry");
    const collection = db.collection("jewelry");
    
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    console.log(`MongoDB action: ${action}`);

    // GET - List all jewelry
    if (req.method === "GET" && action === "list") {
      const jewelry = await collection.find({}).toArray();
      console.log(`Found ${jewelry.length} jewelry items`);
      return new Response(JSON.stringify({ success: true, data: jewelry }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET - Get single jewelry by ID
    if (req.method === "GET" && action === "get") {
      const id = url.searchParams.get("id");
      if (!id) {
        return new Response(JSON.stringify({ success: false, error: "ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { ObjectId } = await import("npm:mongodb@6.11.0");
      const item = await collection.findOne({ _id: new ObjectId(id) });
      return new Response(JSON.stringify({ success: true, data: item }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST - Add new jewelry
    if (req.method === "POST" && action === "add") {
      const body = await req.json();
      const { name, category, imageUrl, metalType, purity, weight, makingCharges, description, status } = body;
      
      const newJewelry = {
        name,
        category,
        imageUrl,
        metalType,
        purity,
        weight: parseFloat(weight) || 0,
        makingCharges: parseFloat(makingCharges) || 0,
        description,
        status: status || "active",
        aiEmbeddingGenerated: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const result = await collection.insertOne(newJewelry);
      console.log(`Inserted jewelry with ID: ${result.insertedId}`);
      return new Response(JSON.stringify({ success: true, data: { _id: result.insertedId, ...newJewelry } }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST - Add sample jewelry data
    if (req.method === "POST" && action === "seed") {
      const sampleJewelry = [
        {
          name: "Diamond Solitaire Ring",
          category: "Rings",
          imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400",
          metalType: "Gold",
          purity: "22K",
          weight: 4.5,
          makingCharges: 2500,
          description: "Elegant solitaire ring with certified diamond",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Gold Temple Necklace",
          category: "Necklaces",
          imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400",
          metalType: "Gold",
          purity: "22K",
          weight: 45.0,
          makingCharges: 15000,
          description: "Traditional temple design necklace with intricate work",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Pearl Drop Earrings",
          category: "Earrings",
          imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400",
          metalType: "Gold",
          purity: "18K",
          weight: 8.2,
          makingCharges: 3500,
          description: "Elegant pearl drop earrings with gold frame",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Kundan Bridal Set",
          category: "Sets",
          imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
          metalType: "Gold",
          purity: "22K",
          weight: 120.0,
          makingCharges: 45000,
          description: "Complete bridal kundan set with necklace, earrings, and maang tikka",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Rose Gold Bracelet",
          category: "Bracelets",
          imageUrl: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400",
          metalType: "Gold",
          purity: "18K",
          weight: 12.5,
          makingCharges: 4500,
          description: "Modern rose gold bracelet with delicate chain design",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Antique Jhumka Earrings",
          category: "Earrings",
          imageUrl: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400",
          metalType: "Gold",
          purity: "22K",
          weight: 18.0,
          makingCharges: 6500,
          description: "Traditional jhumka earrings with antique finish",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Polki Diamond Choker",
          category: "Necklaces",
          imageUrl: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400",
          metalType: "Gold",
          purity: "22K",
          weight: 65.0,
          makingCharges: 28000,
          description: "Royal polki diamond choker with meenakari work",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Gold Kada Bangle",
          category: "Bangles",
          imageUrl: "https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=400",
          metalType: "Gold",
          purity: "22K",
          weight: 32.0,
          makingCharges: 8500,
          description: "Heavy gold kada with traditional design",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Silver Anklet Pair",
          category: "Anklets",
          imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400",
          metalType: "Silver",
          purity: "925",
          weight: 45.0,
          makingCharges: 1200,
          description: "Traditional silver anklet pair with bells",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Diamond Tennis Bracelet",
          category: "Bracelets",
          imageUrl: "https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=400",
          metalType: "Gold",
          purity: "18K",
          weight: 15.0,
          makingCharges: 12000,
          description: "Classic diamond tennis bracelet with certified stones",
          status: "active",
          aiEmbeddingGenerated: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      
      const result = await collection.insertMany(sampleJewelry);
      console.log(`Inserted ${result.insertedCount} sample jewelry items`);
      return new Response(JSON.stringify({ 
        success: true, 
        message: `Added ${result.insertedCount} sample jewelry items`,
        insertedIds: result.insertedIds 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT - Update jewelry
    if (req.method === "PUT" && action === "update") {
      const body = await req.json();
      const { id, ...updates } = body;
      
      if (!id) {
        return new Response(JSON.stringify({ success: false, error: "ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const { ObjectId } = await import("npm:mongodb@6.11.0");
      updates.updatedAt = new Date();
      
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
      
      console.log(`Updated jewelry ${id}: ${result.modifiedCount} modified`);
      return new Response(JSON.stringify({ success: true, modifiedCount: result.modifiedCount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE - Delete jewelry
    if (req.method === "DELETE" && action === "delete") {
      const id = url.searchParams.get("id");
      
      if (!id) {
        return new Response(JSON.stringify({ success: false, error: "ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      const { ObjectId } = await import("npm:mongodb@6.11.0");
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      
      console.log(`Deleted jewelry ${id}: ${result.deletedCount} deleted`);
      return new Response(JSON.stringify({ success: true, deletedCount: result.deletedCount }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: false, error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("MongoDB error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
