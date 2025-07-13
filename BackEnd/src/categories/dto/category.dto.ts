export class CategoryDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  parentCategoryId?: number;
  parentCategoryName?: string | null;
  createdAt: Date;
  updatedAt?: Date;
  subCategories?: CategoryDto[];
}
