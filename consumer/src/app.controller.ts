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
  // @EventPattern('') // Empty pattern for fanout
  // handleFanoutQueue(@Payload() order: OrderDto, @Ctx() context: RmqContext) {
  //   this.appService.handleFanoutQueue(order, context);
  // }

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
