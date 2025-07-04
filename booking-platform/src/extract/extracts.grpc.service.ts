// src/extracts/extracts.grpc.service.ts
import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExtractsService } from './extract.service';

interface GenerateUserExtractRequest {
    user_id: number;
}

interface GenerateUserExtractResponse {
    url: string;
}

@Injectable()
export class ExtractsGrpcService {
    constructor(private readonly extractsService: ExtractsService) {}

    @GrpcMethod('Extracts', 'GenerateUserExtract')
    async generateUserExtract(data: GenerateUserExtractRequest): Promise<GenerateUserExtractResponse> {
        const url = await this.extractsService.userExtract(data.user_id);
        return { url };
    }
}
