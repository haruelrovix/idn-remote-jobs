import { Injectable, Inject, Logger } from '@nestjs/common';
import { IJobsRepository } from '@domain/interfaces/jobs-repository.interface';
import {
  JobEntity,
  JobsType,
  JobUniqueResponse,
} from '@domain/entities/job.entity';
import { JobUniqueField } from '@domain/enums/job.enum';
import { ExternalJobsService } from '@application/services/external-jobs.service';
import { RedisConfig } from '@infrastructure/configuration/redis.config';
import { GetJobsDto } from '@domain/dtos/get-jobs.dto';

@Injectable()
export class GetJobsUseCase {
  private readonly logger = new Logger(GetJobsUseCase.name);

  constructor(
    @Inject('IJobsRepository') private readonly jobsRepository: IJobsRepository,
    private readonly externalJobsService: ExternalJobsService,
  ) {}

  async execute(
    limit: number,
    search?: Partial<GetJobsDto>,
  ): Promise<JobEntity[]> {
    // Attempt to get jobs from the repository (Redis OM)
    let jobs: JobsType = await this.jobsRepository.getJobs(limit);

    if (jobs) {
      this.logger.log('Cache hit: Returning jobs from Redis.');

      // @TODO: Check if there's better way. I don't like this two calls.
      if (search) {
        jobs = await this.jobsRepository.searchJobs(search, limit);
      }

      return jobs;
    }

    this.logger.log('Cache miss: Attempting to acquire lock.');

    // Cast to the concrete repository to access lock methods
    const repository = this.jobsRepository as any;
    const lockAcquired = await repository.acquireLock();

    if (lockAcquired) {
      try {
        this.logger.log('Lock acquired: Fetching jobs from external API.');
        jobs = await this.externalJobsService.fetchJobs(limit);

        await this.jobsRepository.saveJobs(jobs, RedisConfig.CACHE_TTL); // Save with TTL (10 minutes)

        this.logger.log('Jobs fetched and saved to Redis.');
      } catch (error) {
        this.logger.error('Error fetching jobs from external API:', error);
        throw error;
      } finally {
        await repository.releaseLock();
        this.logger.log('Lock released.');
      }
    } else {
      this.logger.log('Lock not acquired: Waiting for data to be populated.');

      // Wait for a short period and retry fetching from Redis
      await this.delay(1000); // Wait 1 second

      jobs = await this.jobsRepository.getJobs(limit);

      if (!jobs) {
        this.logger.warn('Data not available even after waiting.');
        throw new Error('Failed to retrieve jobs.');
      }
    }

    if (search) {
      jobs = await this.jobsRepository.searchJobs(search, limit);
    }

    return jobs;
  }

  async getJobFilters(fields: JobUniqueField[]): Promise<JobUniqueResponse> {
    return this.jobsRepository.getUniqueValues(fields);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
