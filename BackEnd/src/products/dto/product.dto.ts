export class ProductDto {
  id: number;
  name: string;
  description?: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  mileage: number;
  isActive: boolean;
  categoryId: number;
  categoryName: string | null;
  createdAt: Date;
  updatedAt?: Date;
}
