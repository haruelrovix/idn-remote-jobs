import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import {
  FetchNotionDataUseCase,
  JobData,
} from 'src/application/use-cases/fetch-notion-data.use-case';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';
import { ApiKeyGuard } from 'src/infrastructure/guards/api-key.guard';

@Controller()
@UseGuards(ApiKeyGuard)
export class NotionController {
  constructor(
    private readonly fetchNotionDataUseCase: FetchNotionDataUseCase,
  ) {}

  @Post('notion/fetch')
  async fetchNotionData(@Body() body: any): Promise<JobData[]> {
    return this.fetchNotionDataUseCase.execute(body);
  }

  @Get('jobs')
  async fetchRemoteJobsData(
    @Query() query: { limit: number },
  ): Promise<JobData[]> {
    const body = NotionConfig.GET_OPTIONS(query.limit);

    return this.fetchNotionDataUseCase.execute(body);
  }
}
