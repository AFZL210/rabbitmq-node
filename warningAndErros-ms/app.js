const amqp = require('amqplib')

/**
1: connect to rabbitmq server
2: create a new channel
3: create the exchange
4: create the queue
5: bind the queue to the exchange
6: consume messages from the queue
*/

async function consumeMessage() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange('logExchange', 'direct');

    const q = await channel.assertQueue("WarningAndErrorsQueue");

    // here the third param is the routing key for direct exchange
    await channel.bindQueue(q.queue, "logExchange", "Warning");

    channel.consume(q.queue, (msg) => {
        const data = JSON.parse(msg.content); // we stringify it earlier
        console.log(data);
        channel.ack(msg); // notify that this msg has consumed successfully -> safe to delete from queue
    })
}

consumeMessage();