import amqb from 'amqplib';


let ch: amqb.Channel = null;

async function connectToQueueServer() {
    try {
        const queueConnection = await amqb.connect("amqps://enrvmhtm:NmzQwosH6Zay6-OH9wdVNBE07C7QEtQy@eagle.rmq.cloudamqp.com/enrvmhtm");
        const channel = await queueConnection.createChannel();
        ch = channel;
    } catch (e) {
        console.error(e);
    }
}

export { ch, connectToQueueServer };