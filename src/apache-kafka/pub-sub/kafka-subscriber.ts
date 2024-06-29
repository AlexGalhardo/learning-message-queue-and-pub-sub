import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "pubsub-app",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: `pubsub-group-${Math.random()}` });

const run = async () => {
    await consumer.connect();
    console.log("Consumer connected");

    await consumer.subscribe({ topic: "pubsub-topic", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                consumer: `pubsub-group-${Math.random()}`,
                topic,
                partition,
                value: message.value?.toString(),
            });
        },
    });
};

run().catch(console.error);
