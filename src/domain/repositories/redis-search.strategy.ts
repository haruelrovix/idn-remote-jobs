import { JobEntity } from '@domain/entities/job.entity';
import { BaseJobsRepository } from '@domain/repositories/base.repository';
import { RedisClientType } from 'redis';
import { Repository } from 'redis-om';

export class RedisSearchStrategy extends BaseJobsRepository {
  constructor(
    protected readonly redisClient: RedisClientType,
    protected readonly namespace: string,
    private readonly repository: Repository<Record<string, any>>,
  ) {
    super(redisClient, namespace);
  }

  async getJobs(limit: number): Promise<JobEntity[] | null> {
    const jobs = await this.repository.search().returnPage(0, limit);

    if (jobs.length === 0) return null;

    return jobs.map(
      (job: JobEntity) =>
        new JobEntity({
          id: job.id,
          title: job.title,
          description: job.description,
          company: job.company,
          country: job.country,
          tags: job.tags,
          url: job.url,
        }),
    );
  }
}
