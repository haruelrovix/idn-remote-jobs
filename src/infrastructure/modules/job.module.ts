import { ExternalJobsService } from '@application/services/external-jobs.service';
import { GetJobsUseCase } from '@application/use-cases/get-jobs.use-case';
import { JobsController } from '@controllers/jobs.controller';
import { RedisOMJobsRepository } from '@domain/repositories/redis.repository';
import { RedisModule } from '@infrastructure/modules/redis.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [RedisModule],
  controllers: [JobsController],
  providers: [
    ExternalJobsService,
    GetJobsUseCase,
    {
      provide: 'IJobsRepository',
      useExisting: RedisOMJobsRepository,
    },
  ],
})
export class JobsModule {}
