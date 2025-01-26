import { RedisService } from '@application/services/redis.service';
import { JobEntity } from '@domain/entities/job.entity';
import { IJobsRepository } from '@domain/interfaces/jobs-repository.interface';
import { BaseJobsRepository } from '@domain/repositories/base.repository';
import { BasicRedisStrategy } from '@domain/repositories/basic-redis.strategy';
import { RedisSearchStrategy } from '@domain/repositories/redis-search.strategy';
import { JobSchema, namespace } from '@domain/schemas/job.schema';
import { RedisConfig } from '@infrastructure/configuration/redis.config';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { RedisConnection, Repository } from 'redis-om';

@Injectable()
export class RedisOMJobsRepository implements IJobsRepository, OnModuleInit {
  private repository: Repository<Record<string, any>>;
  private redisClient: RedisClientType;
  private strategy: BaseJobsRepository;

  private readonly LOCK_KEY = `${namespace}:locks:jobs:fetch`;
  private readonly LOCK_TTL = 5000; // 5 seconds

  constructor(private readonly redisService: RedisService) {}

  private async initializeRepository(
    client: RedisClientType | RedisConnection,
  ): Promise<void> {
    this.repository = new Repository(JobSchema, client);

    if (RedisConfig.IS_SEARCH_ENABLED) {
      await this.repository.createIndex();
      this.strategy = new RedisSearchStrategy(
        this.redisClient,
        namespace,
        this.repository,
      );
    } else {
      this.strategy = new BasicRedisStrategy(this.redisClient, namespace);
    }
  }

  async onModuleInit(): Promise<void> {
    this.redisClient = await this.redisService.getClient();

    await this.initializeRepository(this.redisClient);
  }

  /**
   * Acquire a lock to prevent cache stampede
   */
  async acquireLock(): Promise<boolean> {
    const result = await this.redisClient.set(this.LOCK_KEY, 'locked', {
      NX: true,
      PX: this.LOCK_TTL,
    });
    return result === 'OK';
  }

  /**
   * Release the previously acquired lock
   */
  async releaseLock(): Promise<void> {
    await this.redisClient.del(this.LOCK_KEY);
  }

  /**
   * Retrieve jobs from Redis using redis-om repository
   */
  async getJobs(limit: number): Promise<JobEntity[] | null> {
    // Check if lock is active
    const isLocked = await this.redisClient.get(this.LOCK_KEY);

    if (isLocked) {
      // Optionally implement a wait or retry mechanism
      return null;
    }

    return this.strategy.getJobs(limit);
  }

  /**
   * Save jobs to Redis using redis-om repository
   */
  async saveJobs(jobs: JobEntity[], ttlSeconds: number): Promise<void> {
    const jobEntities: JobEntity[] = jobs.map((job) => {
      const entity: JobEntity = {
        id: job.id,
        title: job.title,
        description: job.description,
        company: job.company,
        country: job.country,
        tags: job.tags,
        url: job.url,
      };

      return entity;
    });

    const ids: string[] = [];
    await Promise.all(
      jobEntities.map(async (job) => {
        const entity = await this.repository.save(job.id, job);

        ids.push(entity.id);
      }),
    );

    // Manage the TTL
    await this.repository.expire(ids, ttlSeconds);
  }

  /**
   * Search jobs based on a query
   */
  async searchJobs(query: string, limit: number): Promise<JobEntity[]> {
    const jobs = await this.repository
      .search()
      .where('title')
      .matches(query)
      .or('description')
      .matches(query)
      .returnPage(0, limit);

    return jobs.map(
      (job) =>
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
