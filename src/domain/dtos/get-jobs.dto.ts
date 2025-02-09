import { SearchMethod } from '@domain/enums/search.enum';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';

export class GetJobsDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @IsOptional()
  @IsEnum(SearchMethod)
  searchMethod?: SearchMethod;

  @IsOptional()
  @IsString()
  companyLocation?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  sendTo?: string;
}
