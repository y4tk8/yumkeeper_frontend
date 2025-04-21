import { Ingredient } from "@/types/ingredient";
import { Video } from "@/types/video";

export interface Recipe {
  id: number;
  user_id: number;
  name: string;
  notes: string;
  created_at: string;
  updated_at: string;
  ingredients?: Ingredient[];
  video?: Video;
}

export interface RecipeCard {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  thumbnail_url: string;
}

// 材料 & 調味料 の入力フォーム
export interface ItemEntry {
  name: string;
  amount: string;
}
