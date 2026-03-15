import { ILeadRepository } from "../repositories/lead-repository";

export class GetLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(category: string, citySlug?: string) {
    return await this.leadRepository.getLeadsByCategory(category, citySlug);
  }
}

export class ExtractLeadUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async execute(productId: number) {
    return await this.leadRepository.extractLead(productId);
  }
}

export class GetMetadataUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async getCities() {
    return await this.leadRepository.getCities();
  }

  async getCategories() {
    return await this.leadRepository.getCategories();
  }
}
