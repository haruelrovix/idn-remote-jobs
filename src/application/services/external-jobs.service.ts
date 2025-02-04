import { JobEntity } from '@domain/entities/job.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ExternalJobsService {
  private readonly BASE_URL = process.env.GOSHAWK_API_URL ?? '';

  async fetchJobs(limit: number): Promise<JobEntity[]> {
    try {
      const response = await axios.get(`${this.BASE_URL}/jobs`, {
        params: { limit },
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.GOSHAWK_API_KEY ?? '',
        },
      });

      const jobsData = response.data;

      const jobs: JobEntity[] = jobsData.map(
        (job: any) =>
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

      return jobs;
    } catch (error) {
      console.error('Error fetching jobs from external API:', error.message);
      throw new HttpException(
        'Failed to fetch jobs from external service',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
