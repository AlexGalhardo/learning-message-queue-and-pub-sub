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
- [ ] AWS SQS Message Queue Example using LocalStack
- [ ] AWS SNS Example using LocalStack

## Prerequisites
- Install Bun: <https://bun.sh/docs/installation>
- Install LocalStack: <https://docs.localstack.cloud/getting-started/installation/>
- Install Docker & Docker-Compose: <https://docs.docker.com/engine/install/>

1. Install depencencies & up docker-compose
```bash
sudo chmod +x setup.sh && ./setup.sh
```

## Observer Pattern Example

- Credits: <https://youtu.be/ioYkXh8NhKc>

1. Run
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

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) June 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
