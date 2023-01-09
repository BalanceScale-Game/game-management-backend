import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from 'src/entities/product.entity';
import { SearchModule } from '../search/search.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SearchModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
