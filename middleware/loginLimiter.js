const rateLimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: {
		message: "Too many logins, please try again",
	},
	handler: (req, res, next, option) => {
		logEvents(
			`Too Many Requests: ${option.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
			"errLog.log"
		);
		res.status(option.statusCode).send(option.message);
	},
	standardHeaders: true,
	legacyHeaders: true,
});

module.exports = loginLimiter;
