import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
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
  @MessagePattern({ cmd: 'fetch-orders' })
  getOrders(@Ctx() context: RmqContext) {
    console.log(context.getMessage());
    return this.appService.getOrders();
  }
}
