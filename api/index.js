require('@std/esm');

import http from 'http';
import app from './app';
import socketIO from 'socket.io';
import {
	onInit,
	onChat,
	onLogin,
	onDisconnect,
	onHop,
	onHelp,
} from './socket';

const server = http.createServer(app);

const hostname = '127.0.0.1';
const port = 8080;

const io = socketIO(server);

server.listen(port, hostname, () => {
	console.log(`Server running on port ${hostname}:${port}`);
});

io.on('connection', (s1) => {
	onInit(s1);
	s1.on('chat', msg => onChat(s1, msg));
	s1.on('login', () => onLogin(s1));
	s1.on('disconnect', () => onDisconnect(s1));
	s1.on('hop', () => onHop(s1));
	s1.on('help', () => onHelp(s1));
});
