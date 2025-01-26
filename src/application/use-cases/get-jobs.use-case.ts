import { Injectable, Inject, Logger } from '@nestjs/common';
import { IJobsRepository } from '@domain/interfaces/jobs-repository.interface';
import { JobEntity } from '@domain/entities/job.entity';
import { ExternalJobsService } from '@application/services/external-jobs.service';

@Injectable()
export class GetJobsUseCase {
  private readonly logger = new Logger(GetJobsUseCase.name);

  constructor(
    @Inject('IJobsRepository') private readonly jobsRepository: IJobsRepository,
    private readonly externalJobsService: ExternalJobsService,
  ) {}

  async execute(limit: number): Promise<JobEntity[]> {
    // Attempt to get jobs from the repository (Redis OM)
    let jobs = await this.jobsRepository.getJobs(limit);

    if (jobs) {
      this.logger.log('Cache hit: Returning jobs from Redis.');
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

        await this.jobsRepository.saveJobs(jobs, 600); // Save with TTL (10 minutes)

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

    return jobs;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
