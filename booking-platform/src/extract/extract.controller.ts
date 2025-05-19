import { Controller, Get, Param } from '@nestjs/common';
import { ExtractsService } from './extract.service';

@Controller('api/users')
export class ExtractsController {
    constructor(private readonly extractsService: ExtractsService) {}

    @Get(':id/extract')
    async userExtract(@Param('id') id: string) {
        const url = await this.extractsService.userExtract(parseInt(id));
        return { url };
    }
}