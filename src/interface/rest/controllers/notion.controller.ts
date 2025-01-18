import { Controller, Post, Body } from '@nestjs/common';
import { FetchNotionDataUseCase, JobData } from 'src/application/use-cases/fetch-notion-data.use-case';

@Controller('notion')
export class NotionController {
  constructor(private readonly fetchNotionDataUseCase: FetchNotionDataUseCase) {}

  @Post('fetch')
  async fetchNotionData(@Body() body: any): Promise<JobData[]> {
    return this.fetchNotionDataUseCase.execute(body);
  }
}
