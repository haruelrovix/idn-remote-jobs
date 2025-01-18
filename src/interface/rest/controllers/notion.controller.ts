import { Controller, Post, Body } from '@nestjs/common';
import { FetchNotionDataUseCase } from 'src/application/use-cases/fetch-notion-data.use-case';

@Controller('notion')
export class NotionController {
  constructor(private readonly fetchNotionDataUseCase: FetchNotionDataUseCase) {}

  @Post('fetch')
  async fetchNotionData(@Body() body: any): Promise<void> {
    return this.fetchNotionDataUseCase.execute(body);
  }
}
