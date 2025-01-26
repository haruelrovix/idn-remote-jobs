import { JobEntity } from '@domain/entities/job.entity';

export interface IJobsRepository {
  getJobs(limit: number): Promise<JobEntity[] | null>;
  saveJobs(jobs: JobEntity[], ttlSeconds: number): Promise<void>;
  // Optional: Add search or other methods
  searchJobs(query: string, limit: number): Promise<JobEntity[]>;
}
