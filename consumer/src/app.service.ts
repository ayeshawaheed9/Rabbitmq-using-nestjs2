import { Injectable } from '@nestjs/common';
import { OrderDto } from './order.dto';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class AppService {
  orders: OrderDto[] = [];

  handleOrderPlaced(order: OrderDto, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    if (!order || !order.productName) {
      throw new Error('Invalid order data');
    }
    this.orders.push(order);           
    channel.ack(originalMessage);
   console.log(`Order accepted, Email: ${order.email}`)
  }
  handleDirectOrder(order: OrderDto, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    if (!order || !order.productName) {
      throw new Error('Invalid order data');
    }
    this.orders.push(order);           
    channel.ack(originalMessage);
   console.log(`Order accepted, Email: ${order.email}`)
  }
  handleTopicOrder(order: OrderDto, context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    if (!order || !order.productName) {
      throw new Error('Invalid order data');
    }
    this.orders.push(order);
    channel.ack(originalMessage);
    console.log(`Topic order accepted, Email: ${order.email}`);
  }
  getOrders() {
    return this.orders;
  }
}
