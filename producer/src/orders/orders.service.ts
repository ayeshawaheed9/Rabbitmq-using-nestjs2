import { Inject, Injectable } from '@nestjs/common';
import { OrderDto } from './order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(@Inject('ORDERS_SERVICE') private rabbitClient: ClientProxy) {}
  placeOrder(order: OrderDto) {
    this.rabbitClient.emit('order-placed', order);
    return { message: 'Order Placed!' };
  }
  async placeOrderDirect(order: OrderDto) {
    const routingKey = 'direct_route'; // Define your routing key
    // Emit the order to the direct exchange
    this.rabbitClient.emit(routingKey, order);
    return { message: 'Order Placed to Direct Exchange!' };
  }
  async placeOrderTopic(order: OrderDto) {
    const routingKey = `order.${order.productName}`; // Topic exchange routing key
    this.rabbitClient.emit(routingKey, order);
    console.log('order placed');
    return { message: 'Order Placed to Topic Exchange!' };
  }
  getOrders() {
    return this.rabbitClient
      .send({ cmd: 'fetch-orders' }, {})
      .pipe(timeout(5000));
  }
}
