import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  FetchNotionDataUseCase,
  JobData,
} from 'src/application/use-cases/fetch-notion-data.use-case';
import { SendInteractiveMessageUseCase } from 'src/application/use-cases/send-interactive-message.use-case';
import { NotionConfig } from 'src/infrastructure/configuration/notion.config';
import { ApiKeyGuard } from 'src/infrastructure/guards/api-key.guard';

@Controller('webhooks')
@UseGuards(ApiKeyGuard)
export class WebhooksController {
  constructor(
    private readonly fetchNotionData: FetchNotionDataUseCase,
    private readonly sendInteractiveMessage: SendInteractiveMessageUseCase,
  ) {}

  private groupByCompany(jobs: JobData[]): Record<string, JobData[]> {
    return jobs.reduce(
      (acc, job) => {
        const company = job.company;
        if (!acc[company]) {
          acc[company] = [];
        }
        acc[company].push(job);
        return acc;
      },
      {} as Record<string, JobData[]>,
    );
  }

  private truncateText(
    text: string,
    maxLength: number = 24,
    ellipsis: string = '...',
  ): string {
    return text.length > maxLength
      ? text.substring(0, maxLength - ellipsis.length) + ellipsis
      : text;
  }

  @Post('remote-jobs')
  async handleRemoteJobsWebhook(@Body() body: any): Promise<JobData[]> {
    // Add type checking and default
    const limit = body?.limit ?? 10;

    const params = NotionConfig.GET_OPTIONS(limit);
    const jobsData = await this.fetchNotionData.execute(params);

    if (jobsData.length) {
      const groupedJobs = this.groupByCompany(jobsData);
      const sections = Object.entries(groupedJobs).map(([company, jobs]) => ({
        title: this.truncateText(company),
        rows: jobs.map((job) => ({
          id: `${NotionConfig.IDN_REMOTE_JOBS_ID}|${job.id}`,
          title: this.truncateText(job.title),
          description: this.truncateText(job.country),
        })),
      }));

      await this.sendInteractiveMessage.execute({
        message: {
          to: body.recipient,
          type: 'list',
          header: {
            type: 'text',
            text: NotionConfig.LIST_MESSAGE_OPTIONS.header,
          },
          body: {
            text: NotionConfig.LIST_MESSAGE_OPTIONS.body,
          },
          action: {
            button: NotionConfig.LIST_MESSAGE_OPTIONS.actionButton,
            sections,
          },
          footer: {
            text: NotionConfig.LIST_MESSAGE_OPTIONS.footer,
          },
        },
      });
    }

    return jobsData;
  }
}
