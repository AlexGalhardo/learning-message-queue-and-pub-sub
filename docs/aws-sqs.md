## SWS SQS

- References
   - <https://dev.to/flflima/rodando-sqs-localmente-com-localstack-3nap>


Creating QUEUE
```bash
aws sqs create-queue --endpoint-url http://localhost:4566 --queue-name cli-test-queue --profile localstack
```

Listing QUEUEs
```bash
aws sqs list-queues --endpoint-url http://localhost:4566 --profile localstack
```

Sending Messages
```bash
aws sqs send-message --endpoint-url http://localhost:4566 --queue-url http://localhost:4566/000000000000/cli-test-queue --message-body "Testing Message" --message-attributes file://./src/aws-sqs/message.json --profile localstack
```

Receiving Messages
```bash
aws sqs receive-message --endpoint-url http://localhost:4566 --queue-url http://localhost:4566/000000000000/cli-test-queue --attribute-names All --message-attribute-names All  --profile localstack
```
