import { JobEntity } from '@domain/entities/job.entity';
import { BaseJobsRepository } from '@domain/repositories/base.repository';

export class BasicRedisStrategy extends BaseJobsRepository {
  async getJobs(limit: number): Promise<JobEntity[] | null> {
    const pattern = `${this.namespace}:JobEntity:*`;
    const jobs: JobEntity[] = [];

    let cursor = 0;
    do {
      const reply = await this.redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: limit,
      });

      cursor = Number(reply.cursor);

      if (reply.keys.length) {
        const entities = await Promise.all(
          reply.keys.map(
            (key) => this.redisClient.json.get(key) as unknown as JobEntity,
          ),
        );

        jobs.push(
          ...entities.filter(Boolean).map(
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
          ),
        );
      }
    } while (cursor !== 0 && jobs.length < limit);

    if (jobs.length === 0) return null;

    return jobs.slice(0, limit);
  }
}
