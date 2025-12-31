const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mongodb-jewelry`;

export interface JewelryItem {
  _id: string;
  name: string;
  category: string;
  imageUrl: string;
  metalType: string;
  purity: string;
  weight: number;
  makingCharges: number;
  description?: string;
  status: "active" | "inactive";
  aiEmbeddingGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const jewelryApi = {
  // Fetch all jewelry items
  async list(): Promise<JewelryItem[]> {
    const response = await fetch(`${FUNCTION_URL}?action=list`);
    const result: ApiResponse<JewelryItem[]> = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch jewelry");
    }
    return result.data || [];
  },

  // Get single jewelry item
  async get(id: string): Promise<JewelryItem | null> {
    const response = await fetch(`${FUNCTION_URL}?action=get&id=${id}`);
    const result: ApiResponse<JewelryItem> = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to fetch jewelry");
    }
    return result.data || null;
  },

  // Add new jewelry
  async add(jewelry: Omit<JewelryItem, "_id" | "createdAt" | "updatedAt" | "aiEmbeddingGenerated">): Promise<JewelryItem> {
    const response = await fetch(`${FUNCTION_URL}?action=add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jewelry),
    });
    const result: ApiResponse<JewelryItem> = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to add jewelry");
    }
    return result.data!;
  },

  // Update jewelry
  async update(id: string, updates: Partial<JewelryItem>): Promise<void> {
    const response = await fetch(`${FUNCTION_URL}?action=update`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    const result: ApiResponse<void> = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to update jewelry");
    }
  },

  // Delete jewelry
  async delete(id: string): Promise<void> {
    const response = await fetch(`${FUNCTION_URL}?action=delete&id=${id}`, {
      method: "DELETE",
    });
    const result: ApiResponse<void> = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to delete jewelry");
    }
  },

  // Seed sample data
  async seedSampleData(): Promise<string> {
    const response = await fetch(`${FUNCTION_URL}?action=seed`, {
      method: "POST",
    });
    const result: ApiResponse<void> & { message?: string } = await response.json();
    if (!result.success) {
      throw new Error(result.error || "Failed to seed sample data");
    }
    return result.message || "Sample data added successfully";
  },
};
