require('@std/esm');

import http from 'http';
import app from './app';
import socketIO from 'socket.io';

const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 8080;

const io = socketIO(server);

// minimal in memory/non scalable DB used just for this MVP
// message history is not persisted and just passed from one socket/client to the next
// we could use redis and/or an actual db if we wanted to persist history
const chatRoom = [];
const queue = [];

server.listen(port, hostname, () => {
	console.log(`Server running on port ${hostname}:${port}`);
});

io.on('connection', (socket) => {
	console.log('api connected via socket', socket.id);

	if (chatRoom.length < 2) {
		socket.emit('init');
		if (chatRoom.length === 1) {
			[...chatRoom, socket].forEach(sckt => sckt.emit('start'));
		}
		chatRoom.push(socket);
	} else {
		queue.push(socket);
		socket.emit('enqueue');
	}

	socket.on('chat', (msg) => {
		console.log('Chat message received', msg);
		const otherSocket = chatRoom.find(s => s.id !== socket.id);
		if (otherSocket) {
			otherSocket.emit('chat', msg);
		}
	});

	socket.on('disconnect', (reason) => {
		console.log('user disconnected', reason);

		const i = chatRoom.indexOf(socket);
		chatRoom.splice(i, 1);

		if (chatRoom.length === 1) {
			chatRoom[0].emit('pending');
		}

		if (queue.length > 0) {
			const nextSocket = queue.shift();
			nextSocket.emit('dequeue');
		}
	});
});
