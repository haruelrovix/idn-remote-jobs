import { RedisService } from '@application/services/redis.service';
import { RedisOMJobsRepository } from '@domain/repositories/redis.repository';
import { Module, Global } from '@nestjs/common';

@Global()
@Module({
  providers: [
    RedisService,
    RedisOMJobsRepository,
    {
      provide: 'IJobsRepository',
      useExisting: RedisOMJobsRepository,
    },
  ],
  exports: [RedisService, RedisOMJobsRepository],
})
export class RedisModule {}
