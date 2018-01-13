require('@std/esm');

import http from 'http';
import app from './app';

const server = http.createServer(app);
const hostname = '127.0.0.1';
const port = 8080;

server.listen(port, hostname, () => {
	console.log(`Server running on port ${hostname}:${port}`);
});
