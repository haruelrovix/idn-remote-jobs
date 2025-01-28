import { FetchNotionBlockIdsUseCase } from '@application/use-cases/fetch-notion-block-ids.use-case';
import { FetchNotionPageUseCase } from '@application/use-cases/fetch-notion-page.use-case';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  buildInteractiveMessage,
  groupByCompany,
  truncateText,
} from '@utils/job.util';
import {
  FetchNotionDataUseCase,
  JobData,
} from 'src/application/use-cases/fetch-notion-data.use-case';
import { SendInteractiveMessageUseCase } from 'src/application/use-cases/send-interactive-message.use-case';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';
import { ApiKeyGuard } from 'src/infrastructure/guards/api-key.guard';
import { getNextValues } from 'src/utils/get-next-values.util';

@Controller('webhooks')
@UseGuards(ApiKeyGuard)
export class WebhooksController {
  constructor(
    private readonly fetchNotionBlockIds: FetchNotionBlockIdsUseCase,
    private readonly fetchNotionData: FetchNotionDataUseCase,
    private readonly fetchNotionPage: FetchNotionPageUseCase,
    private readonly sendInteractiveMessage: SendInteractiveMessageUseCase,
  ) {}

  @Post('remote-jobs')
  async handleRemoteJobsWebhook(@Body() body: any): Promise<JobData[]> {
    // Add type checking and default
    const limit = body?.limit ?? 9;
    const cursor = body?.cursor ?? '';
    const params = NotionConfig.GET_OPTIONS(limit);
    const blockIds = await this.fetchNotionBlockIds.execute(params);

    let jobs: JobData[] = [];
    let description: string = '';
    if (cursor) {
      const next = getNextValues(blockIds, cursor, Number(limit));

      jobs = await Promise.all(
        next.map((blockId) => this.fetchNotionPage.execute(blockId, 1)),
      );

      description = `${blockIds.findIndex((i) => i === next[next.length - 1]) + 1} of ${blockIds.length}`;
    } else {
      jobs = await this.fetchNotionData.execute(params);

      description = `${jobs.length} of ${blockIds.length}`;
    }

    if (jobs.length) {
      const groupedJobs = groupByCompany(jobs);
      const sections = Object.entries(groupedJobs).map(([company, jobs]) => ({
        title: truncateText(company),
        rows: jobs.map((job) => ({
          id: `${NotionConfig.IDN_REMOTE_JOBS_ID}|${job.id}`,
          title: truncateText(job.title),
          description: truncateText(job.country),
        })),
      }));

      sections.push({
        title: `${blockIds.length} jobs`,
        rows: [
          {
            id: `${NotionConfig.IDN_REMOTE_JOBS_ID}|${jobs[jobs.length - 1].id}|SEE_MORE`,
            title: 'See more',
            description,
          },
        ],
      });

      const message = buildInteractiveMessage(
        body.recipient,
        NotionConfig.LIST_MESSAGE_OPTIONS.body,
        sections,
        NotionConfig.LIST_MESSAGE_OPTIONS.poweredBy,
      );
      await this.sendInteractiveMessage.execute(message);
    }

    return jobs;
  }
}
