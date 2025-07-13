import { IsInt, IsString, IsOptional } from 'class-validator';
import { PagedQuery } from '../../common/dto/paged-query.dto';

export class ProductQuery extends PagedQuery {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;
}
