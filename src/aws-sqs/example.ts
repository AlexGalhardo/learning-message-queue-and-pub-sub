import {
    SQSClient,
    CreateQueueCommand,
    ListQueuesCommand,
    SendMessageCommand,
    ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";

const client = new SQSClient({
    endpoint: "http://localhost:4566",
    region: "us-east-1",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
});

async function createQueue(queueName: string) {
    const command = new CreateQueueCommand({ QueueName: queueName });
    const response = await client.send(command);
    console.log("Queue Created:", response.QueueUrl);
    return response.QueueUrl;
}

async function listQueues() {
    const command = new ListQueuesCommand({});
    const response = await client.send(command);
    console.log("List of Queues:", response.QueueUrls);
    return response.QueueUrls;
}

async function sendMessage(queueUrl: string, messageBody: string) {
    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
    });
    const response = await client.send(command);
    console.log("Message Sent:", response.MessageId);
    return response.MessageId;
}

async function receiveMessages(queueUrl: string) {
    const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
    });
    const response = await client.send(command);
    console.log("Messages Received:", response.Messages);
    return response.Messages;
}

(async () => {
    try {
        // Create a queue
        const queueUrl = (await createQueue("aws-sqs-test-queue")) as string;

        // List queues
        await listQueues();

        // Send a message
        await sendMessage(queueUrl, "Hello, World!");

        // Receive messages
        await receiveMessages(queueUrl);
    } catch (error) {
        console.error("Error:", error);
    }
})();
