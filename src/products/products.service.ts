import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const result = new this.productModel(createProductDto);
    return result.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    return this.productModel.findById(id).exec();

  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }
  async remove(id: string) {
    try {
      const result = await this.productModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('id not found')
      }

      //await this.productModel.deleteMany().exec() delete all
      return {
        message: 'delete successfuly '
      }
    } catch (error) {
      throw error;
    }
  }
}
