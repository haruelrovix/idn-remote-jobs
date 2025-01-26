import { GetJobsUseCase } from '@application/use-cases/get-jobs.use-case';
import { JobEntity } from '@domain/entities/job.entity';
import { ApiKeyGuard } from '@infrastructure/guards/api-key.guard';
import { Controller, Get, Query, BadRequestException, UseGuards } from '@nestjs/common';

@Controller()
@UseGuards(ApiKeyGuard)
export class JobsController {
  constructor(private readonly getJobsUseCase: GetJobsUseCase) {}

  @Get('remote-jobs')
  async getJobs(@Query('limit') limit: string = '10'): Promise<JobEntity[]> {
    const limitNumber = parseInt(limit, 10);

    if (isNaN(limitNumber) || limitNumber <= 0) {
      throw new BadRequestException('Invalid limit parameter.');
    }

    return this.getJobsUseCase.execute(limitNumber);
  }
}
