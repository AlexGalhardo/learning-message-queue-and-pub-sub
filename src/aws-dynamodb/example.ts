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
import { DynamoDBClient, CreateTableCommand, PutItemCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "node:crypto";

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
    forcePathStyle: true,
});

const dynamoDBClient = new DynamoDBClient({
    endpoint: "http://localhost:4566",
    region: "us-east-1",
    credentials: {
        accessKeyId: "test",
        secretAccessKey: "test",
    },
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

async function createDynamoDBTable(tableName: string) {
    const command = new CreateTableCommand({
        TableName: tableName,
        AttributeDefinitions: [{ AttributeName: "MessageId", AttributeType: "S" }],
        KeySchema: [{ AttributeName: "MessageId", KeyType: "HASH" }],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
    });
    const response = await dynamoDBClient.send(command);
    console.log("DynamoDB Table Created:", response.TableDescription?.TableName);
}

async function tableExists(tableName: string): Promise<boolean> {
    const command = new ListTablesCommand({});
    const response = await dynamoDBClient.send(command);
    return response.TableNames?.includes(tableName) ?? false;
}

async function saveMessageToDynamoDB(tableName: string, messageId: string, message: string) {
    const command = new PutItemCommand({
        TableName: tableName,
        Item: {
            MessageId: { S: messageId },
            Message: { S: message },
        },
    });
    const response = await dynamoDBClient.send(command);
    console.log("Message Saved to DynamoDB:", response);
}

(async () => {
    try {
        const topicArn = (await createTopic("test-topic")) as string;
        await listTopics();
        const queueUrl = (await createQueue("test-queue")) as string;
        await listQueues();
        const queueArn = await getQueueArn(queueUrl);
        await subscribeToTopic(topicArn, "sqs", queueArn!);
        await publishMessage(topicArn, "Hello, SNS to SQS to S3!");
        const messages = await receiveMessages(queueUrl);
        if (messages && messages.length > 0) {
            const bucketName = "aws-s3-test-bucket";
            await createBucket(bucketName);
            const messageKey = `message-${randomUUID()}.json`;
            const messageBody = JSON.stringify(messages[0]);
            await saveMessageToS3(bucketName, messageKey, messageBody);
            const tableName = "Messages";
            if (!(await tableExists(tableName))) {
                await createDynamoDBTable(tableName);
            }
            const messageId = messages[0].MessageId!;
            await saveMessageToDynamoDB(tableName, messageId, messageBody);
        }
    } catch (error) {
        console.error("Error:", error);
    }
})();
