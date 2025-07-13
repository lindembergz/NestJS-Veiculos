import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../database/entities/product.entity';
import { Category } from '../database/entities/category.entity';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PagedResult } from '../common/dto/paged-result.dto';
import { ProductQuery } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getProducts(query: ProductQuery): Promise<PagedResult<ProductDto>> {
    const { page = 1, pageSize = 10, name, brand, model, color, categoryId } = query;
    const skip = (page - 1) * pageSize;

    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (name) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }
    if (brand) {
      queryBuilder.andWhere('product.brand LIKE :brand', { brand: `%${brand}%` });
    }
    if (model) {
      queryBuilder.andWhere('product.model LIKE :model', { model: `%${model}%` });
    }
    if (color) {
      queryBuilder.andWhere('product.color LIKE :color', { color: `%${color}%` });
    }
    if (categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    const [products, totalCount] = await queryBuilder
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    const productDtos = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      model: product.model,
      year: product.year,
      color: product.color,
      mileage: product.mileage,
      isActive: product.isActive,
      categoryId: product.categoryId,
      categoryName: product.category ? product.category.name : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return new PagedResult(productDtos, totalCount, page, pageSize);
  }

  async getProductById(id: number): Promise<ProductDto> {
    const product = await this.productRepository.findOne({
      where: { id, isActive: true },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      model: product.model,
      year: product.year,
      color: product.color,
      mileage: product.mileage,
      isActive: product.isActive,
      categoryId: product.categoryId,
      categoryName: product.category ? product.category.name : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductDto> {
    const category = await this.categoryRepository.findOne({ where: { id: createProductDto.categoryId, isActive: true } });
    if (!category) {
      throw new BadRequestException(`Category with ID ${createProductDto.categoryId} not found or is inactive.`);
    }

    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);

    return this.getProductById(product.id);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<ProductDto> {
    const product = await this.productRepository.findOne({ where: { id, isActive: true } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found.`);
    }

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: updateProductDto.categoryId, isActive: true } });
      if (!category) {
        throw new BadRequestException(`Category with ID ${updateProductDto.categoryId} not found or is inactive.`);
      }
    }

    Object.assign(product, updateProductDto);
    await this.productRepository.save(product);

    return this.getProductById(product.id);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id, isActive: true } });
    if (!product) {
      return false;
    }
    product.isActive = false; // Soft delete
    await this.productRepository.save(product);
    return true;
  }

  async activateProduct(id: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      return false;
    }
    product.isActive = true;
    await this.productRepository.save(product);
    return true;
  }

  async deactivateProduct(id: number): Promise<boolean> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      return false;
    }
    product.isActive = false;
    await this.productRepository.save(product);
    return true;
  }
}