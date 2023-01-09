import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  async searchProducts(@Query() query) {
    const { text } = query;
    return this.productService.searchForProducts(text);
  }
}
