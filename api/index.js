require('@std/esm');

/* eslint-disable */
import http from 'http';
import app from './app';
/* eslint-enable */

const server = http.createServer(app);
const hostname = '127.0.0.1';
const port = 8000;

server.listen(port, hostname, () => {
	console.log(`Server running on port ${hostname}:${port}`);
});
