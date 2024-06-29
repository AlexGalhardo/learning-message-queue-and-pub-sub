import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "pubsub-app",
    brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const run = async () => {
    await producer.connect();
    console.log("Producer connected");

    await producer.send({
        topic: "pubsub-topic",
        messages: [{ value: "Message for pub-sub consumers" }],
    });

    console.log("Message sent");

    await producer.disconnect();
};

run().catch(console.error);
