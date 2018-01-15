import io from 'socket.io-client';
import { update } from 'novux';
import { COMMANDS } from '../constants';

const socket = io('http://localhost:8080');

/**
 * init
 * setup socket listeners
 * @returns {function} thunk
 */
export const init = () => (dispatch, getState) => {
	socket.on('init', ({ bot }) => {
		dispatch(update('app', 'Cache bot handle', { botHandle: bot }));
	});

	socket.on('chat', (msg) => {
		const { app: { chats = [] } } = getState();
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	});
};

/**
 * sendMessage
 * handle commands (/delay, /hop) and/or emit message
 * @param {string} val a message
 * @returns {function} thunk
 */
const sendMessage = val => (dispatch, getState) => {
	const { app: { handle, chats }, input: { value } } = getState();
	const message = val || value;
	const msg = { handle, message, timestamp: new Date() };
	socket.emit('chat', msg);
	dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
};

/**
 * handleInput
 * handle commands and/or send message
 * @returns {function} thunk
 */
const handleInput = () => (dispatch, getState) => {
	const { app: { handle, chats }, input: { value } } = getState();

	if (value && value.startsWith(COMMANDS.delay)) {
		const args = value.split(' ');
		const timeout = args[1] || 0;
		const msg = args[2];
		setTimeout(() => { dispatch(sendMessage(msg)); }, timeout);
	} else if (value && value.startsWith(COMMANDS.hop)) {
		socket.emit('hop');
		const msg = { handle, message: value, timestamp: new Date() };
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	} else {
		dispatch(sendMessage());
	}
};

/**
 * handleSubmit
 * 1. return if no input
 * 2. login user if handle is undefined || handleInput
 * 3. clear input value
 * @returns {function} thunk
 */
export const handleSubmit = () => (dispatch, getState) => {
	const { app: { handle, chats }, input: { value } } = getState();

	if (!value) return;

	if (value && value.startsWith(COMMANDS.help)) {
		socket.emit('help');
	} else if (!handle) {
		const msg = { handle: value, message: value, timestamp: new Date() };
		dispatch(update('app', 'cache username', { handle: value, chats: [...chats, msg] }));
		socket.emit('login');
	} else {
		dispatch(handleInput());
	}

	dispatch(update('input', 'Clear input', { value: '' }));
};
