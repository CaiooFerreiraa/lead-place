"use server";

import { getLeadsUseCase, extractLeadUseCase, getMetadataUseCase } from "@/infrastructure/factory";

export async function getLeadsAction(category: string, city?: string) {
  try {
    const leads = await getLeadsUseCase.execute(category, city);
    return { data: leads, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function extractLeadAction(productId: number) {
  try {
    const lead = await extractLeadUseCase.execute(productId);
    return { data: lead, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}

export async function getMetadataAction() {
  try {
    const [cities, categories] = await Promise.all([
      getMetadataUseCase.getCities(),
      getMetadataUseCase.getCategories(),
    ]);
    return { data: { cities, categories }, error: null };
  } catch (error) {
    return { data: null, error: (error as Error).message };
  }
}
