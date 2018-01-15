import io from 'socket.io-client';
import { update } from 'novux';
import { COMMANDS } from '../constants';

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

const sendMessage = val => (dispatch, getState) => {
	const { app: { handle, chats }, input: { value } } = getState();
	const message = val || value;
	const msg = { handle, message, timestamp: new Date() };
	socket.emit('chat', { handle, message });
	dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
};

const handleInput = () => (dispatch, getState) => {
	const { input: { value } } = getState();

	if (value && value.startsWith(COMMANDS.delay)) {
		const args = value.split(' ');
		const timeout = args[1] || 0;
		const msg = args[2];
		setTimeout(() => { dispatch(sendMessage(msg)); }, timeout);
	} else if (value && value.startsWith(COMMANDS.hop)) {
		// /hop: attempt to repair with another user or wait until another is available.
	} else {
		dispatch(sendMessage());
	}
};

export const handleSubmit = () => (dispatch, getState) => {
	const { app: { handle, chats }, input: { value } } = getState();

	if (!value) return;

	if (!handle) {
		const msg = { handle: value, message: value, timestamp: new Date() };
		dispatch(update('app', 'cache username', { handle: value, chats: [...chats, msg] }));
		socket.emit('login');
	} else {
		dispatch(handleInput());
	}

	dispatch(update('input', 'Clear input', { value: '' }));
};
