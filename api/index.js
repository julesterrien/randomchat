require('@std/esm');

import http from 'http';
import app from './app';
import socketIO from 'socket.io';
import BOT from './bot';

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

	socket.emit('chat', { ...BOT.intro, timestamp: new Date() });

	if (chatRoom.length < 2) {
		const otherSocket = chatRoom.find(s => s.id !== socket.id);
		const msg = { ...BOT.newChat, timestamp: new Date() };
		if (otherSocket && auth[otherSocket.id]) {
			chatRoom[0].emit('chat', msg);
		} else if (otherSocket) {
			queues[otherSocket.id].push(msg);
		}
		chatRoom.push(socket);
		queues[socket.id] = [];
	} else {
		queues.user.push(socket);
	}

	console.log('----chatroom', chatRoom.length);

	socket.on('chat', (msg) => {
		console.log('Chat received', msg);
		const otherSocket = chatRoom.find(s => s.id !== socket.id);
		const msgQueue = otherSocket && queues[otherSocket.id];
		if (otherSocket && !auth[otherSocket.id]) {
			msgQueue.push(msg);
		} else if (otherSocket) {
			otherSocket.emit('chat', msg);
		}
	});

	socket.on('login', () => {
		console.log('login');

		const otherSocket = chatRoom.find(s => s.id !== socket.id);
		const pairIsLoggedIn = otherSocket && auth[otherSocket.id];
		if (pairIsLoggedIn && !queues.user.includes(socket)) {
			socket.emit('chat', BOT.startChat);
		} else {
			socket.emit('chat', BOT.enqueue);
		}

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
			chatRoom[0].emit('chat', { ...BOT.endChat, timestamp: new Date() });
		}

		if (queues.user.length > 0) {
			const nextSocket = queues.user.shift();
			nextSocket.emit('chat', { ...BOT.dequeue, timestamp: new Date() });
		}
	});
});
