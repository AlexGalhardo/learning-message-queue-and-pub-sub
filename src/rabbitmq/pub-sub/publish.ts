import { connect } from "amqplib/callback_api.js";

connect("amqp://localhost", function (error0, connection) {
	if (error0) {
		throw error0;
	}
	connection.createChannel(function (error1, channel) {
		if (error1) {
			throw error1;
		}
		const exchange = "logs";
		const message = process.argv.slice(2).join(" ") || "Hello World!";

		channel.assertExchange(exchange, "fanout", {
			durable: false,
		});
		channel.publish(exchange, "", Buffer.from(message));
		console.log("...Publishing message: ", message);
	});

	setTimeout(function () {
		connection.close();
		process.exit(0);
	}, 500);
});
