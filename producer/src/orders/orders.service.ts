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
        await channel.assertExchange('header_exchange', 'headers', {durable: true});
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
  async placeOrderFanout(order: OrderDto) {
    // Publish message directly to the fanout exchange without routing key
    const serializedOrder = msgpack.encode(order);
    const a = this.channel.publish('fanout_exchange', '', serializedOrder, {
      persistent: true,
    });
  if(a){
    console.log('Order published successfully to Fanout exchange')
  }    
  return { message: 'Order broadcasted to fanout exchange!' };
  }

  async placeOrderHeader(order: OrderDto){
    const headers = {
      'x-match': 'any', // 'all' for all headers to match, 'any' for any header to match
      header1: 'logged_in', 
      header2: 'authorized'
    };   
    const serializedOrder = msgpack.encode(order);
    const a = this.channel.publish('header_exchange','', serializedOrder, {
      headers,
      persistent: true,
    });
  if(a){
    console.log('Order published successfully on header exchange')
  }    
  return { message: 'Order broadcasted to Header exchange!' };
  }

  getOrders() {
    return this.rabbitClient
      .send({ cmd: 'fetch-orders' }, {})
      .pipe(timeout(5000));
  }
}
