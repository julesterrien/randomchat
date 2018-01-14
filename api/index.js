require('@std/esm');

import http from 'http';
import app from './app';
import socketIO from 'socket.io';

const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 8080;

const io = socketIO(server);

// in memory DB used for MVP
const chatRoom = [];
const queue = [];

server.listen(port, hostname, () => {
	console.log(`Server running on port ${hostname}:${port}`);
});

io.on('connection', (socket) => {
	console.log('api connected via socket', socket.id);

	if (chatRoom.length < 2) {
		chatRoom.push(socket);
		socket.emit('init');
	} else {
		queue.push(socket);
		socket.emit('enqueue');
	}

	socket.on('chat', (msg) => {
		console.log('Chat message received', msg);
		console.log('--- chatroom length', chatRoom.length);
		const otherSocket = chatRoom.find(s => s.id !== socket.id);
		if (otherSocket) {
			otherSocket.emit('chat', msg);
		}
	});

	socket.on('disconnect', (reason) => {
		console.log('user disconnected', reason);

		const i = chatRoom.indexOf(socket);
		chatRoom.splice(i, 1);
		console.log('chatRoom length', chatRoom.length);

		if (queue.length > 0) {
			const nextSocket = queue.shift();
			nextSocket.emit('dequeue');
		}
	});
});
