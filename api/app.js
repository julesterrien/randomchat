import express from 'express';

const app = express();

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin || req.headers.host); // '*'
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use((req, res) => {
	return res.status(200).json({
		success: 'Hello world',
	});
});

export default app;
