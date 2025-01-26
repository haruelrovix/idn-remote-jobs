import { JobUniqueField } from '@domain/entities/job.entity';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';

export class GetUniqueValuesDto {
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((item) => item.trim())
      : value,
  )
  @IsArray()
  @ArrayUnique()
  @IsEnum(JobUniqueField, { each: true })
  fields: JobUniqueField[];

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 1000;
}
