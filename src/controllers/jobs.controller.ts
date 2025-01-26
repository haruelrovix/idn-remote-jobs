import { GetJobsUseCase } from '@application/use-cases/get-jobs.use-case';
import { GetJobsDto } from '@domain/dtos/get-jobs.dto';
import { JobEntity } from '@domain/entities/job.entity';
import { ApiKeyGuard } from '@infrastructure/guards/api-key.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(ApiKeyGuard)
export class JobsController {
  constructor(private readonly getJobsUseCase: GetJobsUseCase) {}

  @Get('remote-jobs')
  async getJobs(@Query() query: GetJobsDto): Promise<JobEntity[]> {
    return this.getJobsUseCase.execute(query.limit, query.search);
  }
}
