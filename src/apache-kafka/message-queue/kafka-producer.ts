import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "queue-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
    await producer.connect();
    console.log("Producer connected");

    await producer.send({
        topic: "queue-topic",
        messages: [{ value: "Message for queue consumers" }],
    });

    console.log("Message sent");

    await producer.disconnect();
};

run().catch(console.error);
