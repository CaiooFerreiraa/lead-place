import { City, Category, Lead } from "../entities/types";

export interface ILeadRepository {
  getCities(): Promise<City[]>;
  getCategories(): Promise<Category[]>;
  getLeadsByCategory(category: string, citySlug?: string): Promise<Lead[]>;
  extractLead(productId: number): Promise<Lead>;
}
