import { Queue } from "bullmq";

// https://www.npmjs.com/package/ioredis
const myQueue = new Queue("bullmq", {
	connection: {
		host: "localhost",
		port: 6379,
	},
});

async function addJobs() {
	await myQueue.add("myJobName", { user: { name: 'alex', admin: true } });

	await myQueue.add("myJobName", { message: "Hello Alex!" });
}

await addJobs();
