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
const auth = {};
const queues = {
	user: [],
};

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
		queues[socket.id] = [];
	} else {
		queues.user.push(socket);
		socket.emit('enqueue');
	}

	socket.on('chat', (msg) => {
		console.log('Chat received', msg);
		const otherSocket = chatRoom.find(s => s.id !== socket.id);
		const otherQueue = otherSocket && queues[otherSocket.id];
		if (otherSocket && !auth[otherSocket.id]) {
			otherQueue.push(msg);
		} else if (otherSocket) {
			otherSocket.emit('chat', msg);
		}
	});

	socket.on('login', () => {
		console.log('login', queues);
		const queue = queues[socket.id];
		if (queue && queue.length > 0) {
			queue.forEach(queuedMsg => socket.emit('chat', queuedMsg));
		}
		auth[socket.id] = true;
	});

	socket.on('disconnect', (reason) => {
		console.log('user disconnected', reason);

		const i = chatRoom.indexOf(socket);
		chatRoom.splice(i, 1);
		if (auth.hasOwnProperty(socket.id)) { delete auth[socket.id]; }
		if (queues.hasOwnProperty(socket.id)) { delete queues[socket.id]; }

		if (chatRoom.length === 1) {
			chatRoom[0].emit('pending');
		}

		if (queues.user.length > 0) {
			const nextSocket = queues.user.shift();
			nextSocket.emit('dequeue');
		}
	});
});
