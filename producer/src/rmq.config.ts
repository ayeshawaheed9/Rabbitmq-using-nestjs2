import amqp from 'amqp-connection-manager';

export async function createRMQConnection(){
    const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  
  // const exchange = 'direct_exchange';
  // const exchangeType ='direct'; 
  // const queue= 'direct_queue';
  // const routingKey = 'direct_route';
  
  // await channel.assertExchange(exchange, exchangeType, { durable: true });
  // await channel.assertQueue(queue, { durable: true });
  // await channel.bindQueue(queue, exchange, routingKey);
  
  ///// Topic Exchange 

  // const topicExchange = 'topic_exchange';
  // const topicExchangeType = 'topic';
  // const topicQueue = 'topic_queue';
  // const topicRoutingKey = 'order.*'; // Example pattern to match
  
  // await channel.assertExchange(topicExchange, topicExchangeType, { durable: true });
  // const q = await channel.assertQueue(topicQueue, { durable: true });
  // console.log(`Waiting for messages in queue: ${q.queue}`)
  // await channel.bindQueue(topicQueue, topicExchange, topicRoutingKey);
  const fanoutExchange = 'fanout_exchange';
  const fanoutExchangeType = 'fanout';
  const headerExchange = 'header_exchange';
  const headerExchangeType = 'headers';
  const headers = {
    'x-match': 'any', // 'all' for all headers to match, 'any' for any header to match
    header1: 'logged_in', 
    header2: 'authorized'
  };
  // Assert the fanout exchange
  await channel.assertExchange(fanoutExchange, fanoutExchangeType, { durable: true });
  await channel.assertExchange(headerExchange, headerExchangeType, {durable: true});

  // First queue bound to the fanout exchange
  const fanoutQueue1 = 'fanout_queue1';
  await channel.assertQueue(fanoutQueue1, { durable: true });
  await channel.bindQueue(fanoutQueue1, fanoutExchange, '');

  // Second queue bound to the fanout exchange
  const fanoutQueue2 = 'fanout_queue2';
  await channel.assertQueue(fanoutQueue2, { durable: true });
  await channel.bindQueue(fanoutQueue2, fanoutExchange, '');

  const headerQueue = 'header_queue';
  await channel.assertQueue(headerQueue, { durable: true });
  await channel.bindQueue(headerQueue, headerExchange, '',headers );


  return channel;
}