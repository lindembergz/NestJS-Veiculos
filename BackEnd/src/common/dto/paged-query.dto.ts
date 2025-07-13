import { IsInt, Min, IsOptional } from 'class-validator';

export class PagedQuery {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  pageSize?: number = 10;
}
