import { Worker } from "bullmq";

const worker = new Worker(
	"bullmq",
	async (job) => {
		// Will print { foo: 'bar'} for the first job
		// and { qux: 'baz' } for the second.
		console.log('...Worker processing: ', job.data);
	},
	{
		connection: {
			host: "localhost",
			port: 6379,
		},
	},
);
