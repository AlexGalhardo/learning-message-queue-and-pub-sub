import {
    SNSClient,
    CreateTopicCommand,
    ListTopicsCommand,
    PublishCommand,
    SubscribeCommand,
} from "@aws-sdk/client-sns";
import {
    SQSClient,
    CreateQueueCommand,
    ListQueuesCommand,
    ReceiveMessageCommand,
    GetQueueAttributesCommand,
} from "@aws-sdk/client-sqs";
import { S3Client, CreateBucketCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

// Configure the SNS, SQS, and S3 clients to point to LocalStack
const snsClient = new SNSClient({
    endpoint: "http://localhost:4566",
    region: "us-east-1",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
});

const sqsClient = new SQSClient({
    endpoint: "http://localhost:4566",
    region: "us-east-1",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
});

const s3Client = new S3Client({
    endpoint: "http://localhost:4566",
    region: "us-east-1",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
    forcePathStyle: true, // Needed for LocalStack
});

async function createTopic(topicName: string) {
    const command = new CreateTopicCommand({ Name: topicName });
    const response = await snsClient.send(command);
    console.log("Topic Created:", response.TopicArn);
    return response.TopicArn;
}

async function listTopics() {
    const command = new ListTopicsCommand({});
    const response = await snsClient.send(command);
    console.log("List of Topics:", response.Topics);
    return response.Topics;
}

async function createQueue(queueName: string) {
    const command = new CreateQueueCommand({ QueueName: queueName });
    const response = await sqsClient.send(command);
    console.log("Queue Created:", response.QueueUrl);
    return response.QueueUrl;
}

async function listQueues() {
    const command = new ListQueuesCommand({});
    const response = await sqsClient.send(command);
    console.log("List of Queues:", response.QueueUrls);
    return response.QueueUrls;
}

async function getQueueArn(queueUrl: string) {
    const command = new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: ["QueueArn"],
    });
    const response = await sqsClient.send(command);
    return response.Attributes?.QueueArn;
}

async function subscribeToTopic(topicArn: string, protocol: string, endpoint: string) {
    const command = new SubscribeCommand({
        TopicArn: topicArn,
        Protocol: protocol,
        Endpoint: endpoint,
    });
    const response = await snsClient.send(command);
    console.log("Subscription ARN:", response.SubscriptionArn);
    return response.SubscriptionArn;
}

async function publishMessage(topicArn: string, message: string) {
    const command = new PublishCommand({
        TopicArn: topicArn,
        Message: message,
    });
    const response = await snsClient.send(command);
    console.log("Message Published:", response.MessageId);
    return response.MessageId;
}

async function receiveMessages(queueUrl: string) {
    const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
    });
    const response = await sqsClient.send(command);
    console.log("Messages Received:", response.Messages);
    return response.Messages;
}

async function createBucket(bucketName: string) {
    const command = new CreateBucketCommand({ Bucket: bucketName });
    const response = await s3Client.send(command);
    console.log("Bucket Created:", response.Location);
}

async function saveMessageToS3(bucketName: string, key: string, message: string) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: message,
        ContentType: "application/json",
    });
    const response = await s3Client.send(command);
    console.log("Message Saved to S3:", response.ETag);
}

(async () => {
    try {
        // Create an SNS topic
        const topicArn = (await createTopic("test-topic")) as string;

        // List SNS topics
        await listTopics();

        // Create an SQS queue
        const queueUrl = (await createQueue("test-queue")) as string;

        // List SQS queues
        await listQueues();

        // Get the SQS queue ARN
        const queueArn = await getQueueArn(queueUrl);

        // Subscribe the SQS queue to the SNS topic
        await subscribeToTopic(topicArn, "sqs", queueArn!);

        // Publish a message to the SNS topic
        await publishMessage(topicArn, "Hello, SNS to SQS to S3!");

        // Receive messages from the SQS queue
        const messages = await receiveMessages(queueUrl);

        if (messages && messages.length > 0) {
            // Create an S3 bucket
            const bucketName = "aws-s3-test-bucket";
            await createBucket(bucketName);

            // Save the received message to S3
            const messageKey = `message-${randomUUID()}.json`;
            const messageBody = JSON.stringify(messages[0]);
            await saveMessageToS3(bucketName, messageKey, messageBody);
        }
    } catch (error) {
        console.error("Error:", error);
    }
})();
