import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from "./schemas/order.schema";
import { InjectModel } from '@nestjs/mongoose';
import { ProductsService } from "../products/products.service";
@Injectable()
export class OrdersService {

  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const productResult = await this.productsService.findOne(
      createOrderDto.productId,
    );

    if (!productResult) {
      throw new NotFoundException('product not found');
    }

    const result = new this.orderModel(createOrderDto);
    return result.save();
  }

  async findAll(): Promise<Order[]> {
    const result = await this.orderModel.find().exec();
    return result;
    // return `This action returns all orders`;
  }
  
  async findOne(id: string): Promise<Order> {
    const order = this.orderModel.findById(id).populate('productId').exec();
    return order;
  }


}
