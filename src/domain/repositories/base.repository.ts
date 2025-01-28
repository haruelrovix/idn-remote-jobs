import { JobEntity } from '@domain/entities/job.entity';
import { RedisClientType } from 'redis';

export abstract class BaseJobsRepository {
  constructor(
    protected readonly redisClient: RedisClientType,
    protected readonly namespace: string,
  ) {}

  abstract getJobs(limit: number): Promise<JobEntity[] | null>;
}
