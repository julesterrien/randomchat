import express from 'express';
import router from './router';

const app = express();

// enable CORS as api is on :8080, client is on :3000
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

app.use('/', router);

export default app;
