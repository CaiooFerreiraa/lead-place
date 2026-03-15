import { ILeadRepository } from "@/domain/repositories/lead-repository";
import { City, Category, Lead } from "@/domain/entities/types";
import { env } from "@/lib/env";

export class ApiLeadRepository implements ILeadRepository {
  private async fetchApi<T>(endpoint: string, queryParams?: Record<string, string>): Promise<T> {
    const baseUrl = env.NEXT_PUBLIC_API_BASE_URL.endsWith('/') 
      ? env.NEXT_PUBLIC_API_BASE_URL.slice(0, -1) 
      : env.NEXT_PUBLIC_API_BASE_URL;
    
    const url = new URL(`${baseUrl}${endpoint}`);
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    console.log(`🌐 Fetching: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-api-key": env.NEXT_PUBLIC_API_KEY,
        "Accept": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      cache: "no-store",
    });

    const contentType = response.headers.get("content-type");
    
    if (!response.ok) {
      if (contentType?.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }
      const textError = await response.text();
      console.error("🛑 HTML Error received instead of JSON:", textError.slice(0, 200));
      throw new Error(`API returned HTML (${response.status}). Verifique se a URL da NGROK está correta e ativa.`);
    }

    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error("🛑 Expected JSON but got:", text.slice(0, 100));
      throw new Error("A API retornou um formato inválido (provavelmente HTML/Página de erro da NGROK).");
    }

    const result = await response.json();
    return result.data || result;
  }

  async getCities(): Promise<City[]> {
    try {
      const data = await this.fetchApi<any[]>("/api/leads/cities");
      if (!Array.isArray(data)) return [];
      
      return data.map(city => ({
        id: String(city.id || city.slug),
        name: city.name,
        slug: city.slug,
        url: city.url
      }));
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      return [];
    }
  }

  async getCategories(): Promise<Category[]> {
    return [
      { id: "contabilidade", name: "Contabilidade" },
      { id: "advogados", name: "Advogados" },
      { id: "restaurantes", name: "Restaurantes" },
      { id: "oficinas", name: "Oficinas Mecânicas" },
      { id: "dentistas", name: "Dentistas" },
      { id: "farmacias", name: "Farmácias" },
      { id: "imobiliarias", name: "Imobiliárias" },
      { id: "academias", name: "Academias" },
      { id: "mercados", name: "Supermercados" },
      { id: "petshops", name: "Pet Shops" },
      { id: "estetica", name: "Beleza e Estética" },
    ];
  }

  async getLeadsByCategory(category: string, citySlug?: string): Promise<Lead[]> {
    const query = citySlug ? { citySlug } : undefined;
    const safeCategory = encodeURIComponent(category);
    return await this.fetchApi<Lead[]>(`/api/leads/category/${safeCategory}`, query);
  }

  async extractLead(productId: number): Promise<Lead> {
    return await this.fetchApi<Lead>(`/api/leads/extract/${productId}`);
  }
}
