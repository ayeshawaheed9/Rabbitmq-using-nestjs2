import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as msgpack from 'msgpack-lite';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { OrderDto } from './order.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order-placed')
  handleOrderPlaced(@Payload() order: OrderDto, @Ctx() context:RmqContext) {
    return this.appService.handleOrderPlaced(order, context);
  }
  @EventPattern('direct_route')
  handleDirectOrder(@Payload() order:OrderDto, @Ctx() context: RmqContext){
    console.log ('Recieved direct order: ', order);
    return this.appService.handleDirectOrder(order,context)
  }
  @EventPattern('order.*')
  handleTopicOrder(@Payload() order: OrderDto, @Ctx() context: RmqContext) {
    console.log('Recieved topic order: ', order);
    return this.appService.handleTopicOrder(order, context);
  }
  @MessagePattern({ headers: { 'x-match': 'all', header1: 'logged_in', header2: 'authorized' } })
  handleHeaderExchangeQueue(@Payload() order: any, @Ctx() context: RmqContext) {
    console.log('Received message from header exchange queue:');
    const orderDto = msgpack.decode(order) as OrderDto;
    return this.appService.handleHeaderQueue(orderDto, context);
  }
  @MessagePattern()
    handleFanout(@Payload() order: any, @Ctx() context: RmqContext) {
      console.log('Message received from fanout_queue1 and 2:');
      const orderdto = msgpack.decode(order) as OrderDto;
      return this.appService.handleFanoutQueue(orderdto,context);
    }
  @MessagePattern({ cmd: 'fetch-orders' })
  getOrders(@Ctx() context: RmqContext) {
    console.log(context.getMessage());
    return this.appService.getOrders();
  }
}
