import amqp from "amqplib";

const queue = "product_inventory";

const message = {
    item_id: "macbook",
    text: "This is a sample message to send receiver to check the ordered Item Availablility",
};

(async () => {
    let connection;
    try {
        connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log("...Message sent: ", message);
        await channel.close();
    } catch (err) {
        console.warn(err);
    } finally {
        if (connection) await connection.close();
    }
})();
