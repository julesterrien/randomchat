require('@std/esm');

import http from 'http';
import app from './app';
import socketIO from 'socket.io';

const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 8080;
server.listen(port, hostname, () => {
	console.log(`Server running on port ${hostname}:${port}`);
});

const io = socketIO(server);
io.on('connection', (socket) => {
	socket.emit('news', { hello: 'world' });
	socket.on('other', (data) => {
		console.log('other event', data);
	});
});
