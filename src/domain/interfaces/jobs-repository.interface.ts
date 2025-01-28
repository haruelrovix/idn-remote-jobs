import { GetJobsDto } from '@domain/dtos/get-jobs.dto';
import { JobEntity, JobUniqueResponse } from '@domain/entities/job.entity';
import { JobUniqueField } from '@domain/enums/job.enum';

export interface IJobsRepository {
  getJobs(limit: number): Promise<JobEntity[] | null>;
  saveJobs(jobs: JobEntity[], ttlSeconds: number): Promise<void>;
  // Optional: Add search or other methods
  searchJobs(query: Partial<GetJobsDto>, limit: number): Promise<JobEntity[]>;
  getUniqueValues(fields: JobUniqueField[]): Promise<JobUniqueResponse>;
}
