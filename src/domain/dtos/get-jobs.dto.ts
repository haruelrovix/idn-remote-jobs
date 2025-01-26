import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';

export class GetJobsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
