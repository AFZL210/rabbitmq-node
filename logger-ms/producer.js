const amqp = require('amqplib');
const config = require('./config');

/**
1: Connect to rabbitmq server
2: create a new channel on that connection
3: create the exchange
4: publish the message to the exchange with routing key
*/

class Producer {
    channel;

    async createChannel() {
        const connection = await amqp.connect(config.raddbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) {
            await this.createChannel();
        }
        const exchangeName = config.raddbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, "direct");

        const logDetails = {
            logType: routingKey,
            message: message,
            dateTime: new Date(),
        }

        await this.channel.publish(exchangeName, routingKey,
            Buffer.from(JSON.stringify(logDetails)));

        console.log(`The message ${message} is sent to exchange ${exchangeName}`);
    }
}

module.exports = Producer;