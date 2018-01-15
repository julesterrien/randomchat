import io from 'socket.io-client';
import { update } from 'novux';
import { HANDLES } from '../constants';

const socket = io('http://localhost:8080');

export const init = () => (dispatch, getState) => {
	socket.on('connect', () => {
		// get & display number of users connected
		console.log('connect');
	});

	socket.on('chat', (msg) => {
		console.log('newChat', msg);
		const { app: { chats = [] } } = getState();
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	});
};

export const emit = () => (dispatch, getState) => {
	const {
		app: { handle, chats },
		input: { value },
	} = getState();

	if (!value) return;

	const msg = { handle: handle || value, message: value, timestamp: new Date() };
	if (!handle) {
		dispatch(update('app', 'cache username', { handle: value, chats: [...chats, msg] }));
		socket.emit('login');
	} else {
		socket.emit('chat', { handle, message: value });
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	}

	dispatch(update('input', 'Clear input', { value: '' }));
};
