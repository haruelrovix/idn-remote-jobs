import { FetchNotionBlockIdsUseCase } from '@application/use-cases/fetch-notion-block-ids.use-case';
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
import {
  FetchNotionPageUseCase,
  JobDetail,
} from 'src/application/use-cases/fetch-notion-page.use-case';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';
import { ApiKeyGuard } from 'src/infrastructure/guards/api-key.guard';
import { getNextValues } from 'src/utils/get-next-values.util';

@Controller()
@UseGuards(ApiKeyGuard)
export class NotionController {
  constructor(
    private readonly fetchNotionBlockIds: FetchNotionBlockIdsUseCase,
    private readonly fetchNotionData: FetchNotionDataUseCase,
    private readonly fetchNotionPage: FetchNotionPageUseCase,
  ) {}

  @Post('notion/fetch')
  async fetchNotionDataController(@Body() body: any): Promise<JobData[]> {
    return this.fetchNotionData.execute(body);
  }

  @Get('jobs')
  async fetchRemoteJobsData(
    @Query() query: { limit: number; cursor?: string },
  ): Promise<JobData[]> {
    const { cursor, limit } = query;
    if (cursor) {
      const body = NotionConfig.GET_OPTIONS(1);

      const blockIds = await this.fetchNotionBlockIds.execute(body);
      const next = getNextValues(blockIds, cursor, Number(limit));

      const jobData = await Promise.all(
        next.map((blockId) => this.fetchNotionPage.execute(blockId, 1)),
      );
      return jobData;
    }

    const body = NotionConfig.GET_OPTIONS(limit);

    return this.fetchNotionData.execute(body);
  }

  @Get('jobs/:uid')
  async fetchRemoteJobDetail(@Param('uid') uid: string): Promise<JobDetail> {
    return this.fetchNotionPage.execute(uid);
  }
}
