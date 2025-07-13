import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PagedResult } from '../common/dto/paged-result.dto';
import { ProductQuery } from './dto/product-query.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/v1/products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: ProductQuery): Promise<PagedResult<ProductDto>> {
    return this.productsService.getProducts(query);
  }

  @Get(':id')
  async getProduct(@Param('id') id: number): Promise<ProductDto> {
    return this.productsService.getProductById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return this.productsService.createProduct(createProductDto);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto): Promise<ProductDto> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: number): Promise<void> {
    await this.productsService.deleteProduct(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async activateProduct(@Param('id') id: number): Promise<void> {
    await this.productsService.activateProduct(id);
  }

  @Patch(':id/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivateProduct(@Param('id') id: number): Promise<void> {
    await this.productsService.deactivateProduct(id);
  }
}
