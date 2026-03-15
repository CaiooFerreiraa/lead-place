export interface City {
  id: string;
  name: string;
  slug: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Lead {
  productId: number;
  name: string | null;
  phone: string | null;
  isWhatsapp: boolean;
  url: string;
  category?: string;
  city?: string;
}
