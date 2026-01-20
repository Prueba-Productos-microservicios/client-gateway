import { Body, Controller, Delete, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PRODUCT_SERVICE } from 'src/config/services';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) { }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send(
      { cmd: 'create_product' },
      createProductDto,
    );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find_all_products' },
      paginationDto,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_product' }, { id })
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'delete_product' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

}
