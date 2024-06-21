<div align="center">
	<h1 align="center">Learning Message Queues & Pub Sub</h1>
</div>

## Introduction

- Simple project I created with references and examples to learn about message queues and publisher/subscriber pattern with different technologies.

## To Do

- [x] [RabbitMQ](https://www.rabbitmq.com/) Message Queue Example
- [x] [RabbitMQ](https://www.rabbitmq.com/) PubSub Example
- [x] Observer Pattern (GoF) Example
- [x] [BullMQ](https://bullmq.io/) Message Queue Example
- [x] AWS SQS Example using LocalStack
- [x] AWS SNS Example using LocalStack
- [x] AWS S3 Example using LocalStack

## Prerequisites
- Install Bun: <https://bun.sh/docs/installation>
- Install LocalStack: <https://docs.localstack.cloud/getting-started/installation/>
- Install Docker & Docker-Compose: <https://docs.docker.com/engine/install/>

a. Install dependencies & up docker-compose
```bash
sudo chmod +x setup.sh && ./setup.sh
```

b. To see RabbitMQ Management UI, go to: <http://localhost:15672>
   - Username: `guest`
   - Password: `guest`

c. To see LocalStack UI, go to: <https://app.localstack.cloud/inst/default/status>

## Observer Pattern Example

- Credits: <https://youtu.be/ioYkXh8NhKc>

1. Run script
```bash
bun run observer-pattern
```

## RabbitMQ Message Queue Example

1. Run producer (send message)
```bash
bun run rabbitmq-mq-producer
```

2. Run consumer (consume message)
```bash
bun run rabbitmq-mq-consumer
```

## RabbitMQ PubSub Example

1. Run subscriber to stay listening... (receive notifications in subscriber)
```bash
bun run rabbitmq-pubsub-subscriber
```

2. Run publish (publish message to subscribers consume)
```bash
bun run rabbitmq-pubsub-publish
```

## BullMQ Message Queue Example

1. Run job
```bash
bun run bullmq-mq-job
```

2. Run worker
```bash
bun run bullmq-mq-worker
```

## AWS SQS Example

### CLI
- Prerequisites
   - Install AWS CLI: <https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html>
   - Verify your AWS Credentials:
	```bash
	aws --version
	export AWS_ACCESS_KEY_ID="test"
	export AWS_SECRET_ACCESS_KEY="test"
	export AWS_DEFAULT_REGION="us-east-1"
	aws configure --profile localstack
	aws configure list
	```

1. Creating QUEUE
```bash
aws sqs create-queue --endpoint-url http://localhost:4566 --queue-name cli-test-queue --profile localstack
```

2. Listing QUEUEs
```bash
aws sqs list-queues --endpoint-url http://localhost:4566 --profile localstack
```

3. Sending Messages
```bash
aws sqs send-message --endpoint-url http://localhost:4566 --queue-url http://localhost:4566/000000000000/cli-test-queue --message-body "Testing Message" --message-attributes file://./src/aws-sqs/message.json --profile localstack
```

4. Receiving Messages
```bash
aws sqs receive-message --endpoint-url http://localhost:4566 --queue-url http://localhost:4566/000000000000/cli-test-queue --attribute-names All --message-attribute-names All  --profile localstack
```

### Code
1. Run example
```bash
bun run aws-sqs-example
```

## AWS SNS Example

1. Run example
```bash
bun run aws-sns-example
```

## AWS S3 Example

1. Run example
```bash
bun run aws-s3-example
```

## Images Example

![rabbit-mq-management](https://github.com/AlexGalhardo/learning-message-queue-and-pub-sub/assets/19540357/cb4c3f92-c541-406b-905d-9590c0b50153)

![localstack-instances](https://github.com/AlexGalhardo/learning-message-queue-and-pub-sub/assets/19540357/f0ca9af2-dd4e-4faa-be0b-0bc4c47d00df)

![aws-s3-example-code](https://github.com/AlexGalhardo/learning-message-queue-and-pub-sub/assets/19540357/e2700003-62f1-4706-a104-40b465db2f11)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) June 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
