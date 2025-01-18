import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import {
  FetchNotionDataUseCase,
  JobData,
} from 'src/application/use-cases/fetch-notion-data.use-case';
import { FetchNotionPageUseCase } from 'src/application/use-cases/fetch-notion-page.use-case';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';
import { ApiKeyGuard } from 'src/infrastructure/guards/api-key.guard';

@Controller()
@UseGuards(ApiKeyGuard)
export class NotionController {
  constructor(
    private readonly fetchNotionDataUseCase: FetchNotionDataUseCase,
    private readonly fetchNotionPageUseCase: FetchNotionPageUseCase,
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

  @Get('jobs/:uid')
  async fetchRemoteJobDetail(@Param('uid') uid: string): Promise<JobData> {
    return this.fetchNotionPageUseCase.execute(uid);
  }
}
