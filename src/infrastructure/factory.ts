import { ApiLeadRepository } from "./repositories/api-lead-repository";
import { GetLeadsUseCase, ExtractLeadUseCase, GetMetadataUseCase } from "@/domain/use-cases/lead-use-cases";

const leadRepository = new ApiLeadRepository();

export const getLeadsUseCase = new GetLeadsUseCase(leadRepository);
export const extractLeadUseCase = new ExtractLeadUseCase(leadRepository);
export const getMetadataUseCase = new GetMetadataUseCase(leadRepository);
