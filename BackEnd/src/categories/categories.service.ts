import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../database/entities/category.entity';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PagedResult } from '../common/dto/paged-result.dto';
import { PagedQuery } from '../common/dto/paged-query.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(query: PagedQuery): Promise<PagedResult<CategoryDto>> {
    const { page = 1, pageSize = 10 } = query;
    const skip = (page - 1) * pageSize;

    const [categories, totalCount] = await this.categoryRepository.findAndCount({
      where: { isActive: true },
      skip,
      take: pageSize,
      relations: ['parentCategory'],
    });

    const categoryDtos = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      parentCategoryId: category.parentCategoryId,
      parentCategoryName: category.parentCategory ? category.parentCategory.name : null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      subCategories: [], // Populated in a separate query if needed, or lazy loaded
    }));

    return new PagedResult(categoryDtos, totalCount, page, pageSize);
  }

  async getCategoryById(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['parentCategory', 'subCategories'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      isActive: category.isActive,
      parentCategoryId: category.parentCategoryId,
      parentCategoryName: category.parentCategory ? category.parentCategory.name : null,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      subCategories: category.subCategories ? category.subCategories.map(sub => ({
        id: sub.id,
        name: sub.name,
        description: sub.description,
        isActive: sub.isActive,
        parentCategoryId: sub.parentCategoryId,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
      })) : [],
    };
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    if (createCategoryDto.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findOne({ where: { id: createCategoryDto.parentCategoryId, isActive: true } });
      if (!parentCategory) {
        throw new BadRequestException(`Parent category with ID ${createCategoryDto.parentCategoryId} not found or is inactive.`);
      }
    }

    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    return this.getCategoryById(category.id);
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id, isActive: true } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    if (updateCategoryDto.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findOne({ where: { id: updateCategoryDto.parentCategoryId, isActive: true } });
      if (!parentCategory) {
        throw new BadRequestException(`Parent category with ID ${updateCategoryDto.parentCategoryId} not found or is inactive.`);
      }
    }

    Object.assign(category, updateCategoryDto);
    await this.categoryRepository.save(category);

    return this.getCategoryById(category.id);
  }

  async deleteCategory(id: number): Promise<boolean> {
    const category = await this.categoryRepository.findOne({ where: { id, isActive: true } });
    if (!category) {
      return false;
    }
    category.isActive = false; // Soft delete
    await this.categoryRepository.save(category);
    return true;
  }
}
