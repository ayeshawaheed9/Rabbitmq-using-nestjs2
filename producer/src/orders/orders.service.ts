import { Inject, Injectable } from '@nestjs/common';
import { OrderDto } from './order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { timeout } from 'rxjs';
import amqp from 'amqp-connection-manager';
import * as msgpack from 'msgpack-lite';
@Injectable()
export class OrdersService {
  public channel;
  constructor(@Inject('ORDERS_SERVICE') private rabbitClient: ClientProxy) {
    const connection = amqp.connect(['amqp://localhost:5672']);
    this.channel = connection.createChannel({
      json: true,
      setup: async (channel) => {
        await channel.assertExchange('fanout_exchange', 'fanout', { durable: true });
      },
    });
  }
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
  // async placeOrderFanout(order: OrderDto) {
  //   const exchange = 'fanout_exchange';  // Specify the fanout exchange
  //   // Emit the message to the fanout exchange
  //   this.rabbitClient.emit('', order);
  //   return { message: 'Order Placed to Fanout Exchange!' };
  // }
  
  async placeOrderFanout(order: OrderDto) {
    // Publish message directly to the fanout exchange without routing key
    const serializedOrder = msgpack.encode(order);
    const a = this.channel.publish('fanout_exchange', '', serializedOrder, {
      persistent: true,
    });
  if(a){
    console.log('Order published successfully')
  }    
  return { message: 'Order broadcasted to fanout exchange!' };
  }
  getOrders() {
    return this.rabbitClient
      .send({ cmd: 'fetch-orders' }, {})
      .pipe(timeout(5000));
  }
}
