import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  FetchNotionDataUseCase,
  JobData,
} from 'src/application/use-cases/fetch-notion-data.use-case';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';
import { ApiKeyGuard } from 'src/infrastructure/guards/api-key.guard';

@Controller('webhooks')
@UseGuards(ApiKeyGuard)
export class WebhooksController {
  constructor(
    private readonly fetchNotionDataUseCase: FetchNotionDataUseCase,
  ) {}

  @Post('remote-jobs')
  async handleRemoteJobsWebhook(@Body() body: any): Promise<JobData[]> {
    // Add type checking and default
    const limit = body?.limit ?? 10;

    const params = NotionConfig.GET_OPTIONS(limit);
    const jobsData = await this.fetchNotionDataUseCase.execute(params);

    return jobsData;
  }
}
