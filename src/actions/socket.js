import io from 'socket.io-client';
import { update } from 'novux';

const socket = io('http://localhost:8080');

export const init = () => (dispatch, getState) => {
	socket.on('connect', () => {
		// get & display number of users connected
		console.log('connect');
	});

	socket.on('init', () => {
		console.log('init: connected to a chat');

		const { app: { chats = [] } } = getState();
		const msg = {
			handle: '@randoBot',
			message: 'To start, choose a username',
		};
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	});

	socket.on('chat', (msg) => {
		console.log('newChat', msg);
		const { app: { chats = [] } } = getState();
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	});

	socket.on('enqueue', () => {
		// show queue loader
		console.log('you have been queued');
	});

	socket.on('dequeue', () => {
		console.log('you have been dequeued. Time to chat!');
	});
};

export const emit = () => (dispatch, getState) => {
	const {
		app: { handle, chats },
		input: { value },
	} = getState();

	if (!handle) {
		const msg = {
			handle: '@randoBot',
			message: `Hi ${value}. Let's get you chatting`,
		};
		dispatch(update('app', 'cache username & save msg', { handle: value, chats: [...chats, msg] }));
	} else {
		const msg = { handle, message: value };
		socket.emit('chat', msg);
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	}

	dispatch(update('input', 'Clear input', { value: '' }));
};
