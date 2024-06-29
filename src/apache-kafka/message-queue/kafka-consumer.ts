import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "queue-app",
    brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "queue-group" });

const run = async () => {
    await consumer.connect();
    console.log("Consumer connected");

    await consumer.subscribe({ topic: "queue-topic", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                consumer: "queue-group",
                topic,
                partition,
                value: message.value?.toString(),
            });
        },
    });
};

run().catch(console.error);
