import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDto } from './order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('place-order')
  placeOrder(@Body() order: OrderDto) {
    if (!order || !order.productName) {
      throw new Error('Invalid order data');
    }
    else{
      return this.ordersService.placeOrder(order);
    
    }
  }
  @Post('place-order-direct')
  placeOrderDirect(@Body() order: OrderDto){
    if (!order || !order.productName) {
      throw new Error('Invalid order data');
    }
    else{
      return this.ordersService.placeOrderDirect(order);
    }
  }
  @Post('place-order-topic')
  placeOrderTopic(@Body() order: OrderDto){
    if (!order || !order.productName) {
      throw new Error('Invalid order data');
    }
    else{
      return this.ordersService.placeOrderTopic(order);
    }
  }

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }
}
