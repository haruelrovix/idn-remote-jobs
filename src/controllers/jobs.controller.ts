import { GetJobsUseCase } from '@application/use-cases/get-jobs.use-case';
import { GetJobsDto } from '@domain/dtos/get-jobs.dto';
import { GetUniqueValuesDto } from '@domain/dtos/get-unique-values.dto';
import { JobEntity, JobUniqueResponse } from '@domain/entities/job.entity';
import { ApiKeyGuard } from '@infrastructure/guards/api-key.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';

@Controller('remote-jobs')
@UseGuards(ApiKeyGuard)
export class JobsController {
  constructor(private readonly getJobsUseCase: GetJobsUseCase) {}

  @Get()
  async getJobs(@Query() query: GetJobsDto): Promise<JobEntity[]> {
    return this.getJobsUseCase.execute(query.limit, query.search);
  }

  @Get('unique-values')
  async getUniqueValues(
    @Query() query: GetUniqueValuesDto,
  ): Promise<JobUniqueResponse> {
    await this.getJobsUseCase.execute(query.limit);

    return this.getJobsUseCase.getJobFilters(query.fields);
  }
}
