import { GetJobsUseCase } from '@application/use-cases/get-jobs.use-case';
import { SendInteractiveMessageUseCase } from '@application/use-cases/send-interactive-message.use-case';
import { GetJobsDto } from '@domain/dtos/get-jobs.dto';
import { GetUniqueValuesDto } from '@domain/dtos/get-unique-values.dto';
import { JobEntity, JobUniqueResponse } from '@domain/entities/job.entity';
import { NotionConfig } from '@infrastructure/configuration/notion.config';
import { ApiKeyGuard } from '@infrastructure/guards/api-key.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  buildInteractiveMessage,
  capitalize,
  groupByCompany,
  truncateText,
} from '@utils/job.util';

@Controller('remote-jobs')
@UseGuards(ApiKeyGuard)
export class JobsController {
  constructor(
    private readonly getJobs: GetJobsUseCase,
    private readonly sendInteractiveMessage: SendInteractiveMessageUseCase,
  ) {}

  @Get()
  async getJobsController(@Query() query: GetJobsDto): Promise<JobEntity[]> {
    const { searchKeyword, searchMethod, companyName, companyLocation } = query;
    const search = {
      searchKeyword,
      searchMethod,
      companyName,
      companyLocation,
    };

    const jobs: JobEntity[] = await this.getJobs.execute(query.limit, search);

    if (query.sendTo) {
      // Send jobs to a user
      const batchSize: number = 10;
      const batches: Promise<void>[] = [];

      let body: string = '';
      if (searchKeyword) {
        body += `\n- _${searchKeyword}_`;
      }
      if (companyName) {
        body += `\n- _${companyName}_`;
      }
      if (companyLocation) {
        body += `\n- _${companyLocation}_`;
      }
      if (searchMethod) {
        body += `\n- _${capitalize(searchMethod)} match_`;
      }

      for (let i: number = 0; i < jobs.length; i += batchSize) {
        const batch: JobEntity[] = jobs.slice(i, i + batchSize);

        const size: number = Math.min(i + batch.length, jobs.length);
        const info: string = `${size}/${jobs.length}`;
        const bodyInfo = `${body}\n\n*${info}* jobs found 💼`;

        batches.push(this.processJobsBatch(batch, bodyInfo, query.sendTo));
        console.info(`Queueing ${info} jobs 📦`);
      }

      await Promise.all(batches);
    }

    return jobs;
  }

  @Get('unique-values')
  async getUniqueValues(
    @Query() query: GetUniqueValuesDto,
  ): Promise<JobUniqueResponse> {
    await this.getJobs.execute(query.limit);

    return this.getJobs.getJobFilters(query.fields);
  }

  private async processJobsBatch(
    jobs: JobEntity[],
    body: string,
    to: string,
  ): Promise<void> {
    // Process each batch of 10 jobs
    const groupedJobs = groupByCompany(jobs);
    const sections = Object.entries(groupedJobs).map(([company, jobs]) => ({
      title: truncateText(company),
      rows: jobs.map((job) => ({
        id: `${NotionConfig.IDN_REMOTE_JOBS_ID}|${job.id}`,
        title: truncateText(job.title),
        description: truncateText(job.country),
      })),
    }));

    const message = buildInteractiveMessage(
      to,
      body,
      sections,
      NotionConfig.LIST_MESSAGE_OPTIONS.footer,
    );
    await this.sendInteractiveMessage.execute(message);
  }
}
