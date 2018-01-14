import io from 'socket.io-client';
import { update } from 'novux';
import { chain } from 'redux-chain';
import { HANDLES } from '../constants';

const socket = io('http://localhost:8080');

export const init = () => (dispatch, getState) => {
	socket.on('connect', () => {
		// get & display number of users connected
		console.log('connect');
	});

	socket.on('init', () => {
		console.log('init');

		const { app: { chats = [] } } = getState();
		const msg = {
			handle: HANDLES.default,
			message: 'To start, choose a username',
			timestamp: new Date(),
		};
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	});

	socket.on('start', () => {
		console.log('start');
		dispatch(update('app', 'Let user know that a chat is active', {
			isChatting: true,
		}));

		// user should define handle before getting notified of anything else
		const { app: { chats, handle } } = getState();
		if (handle) {
			const msg = {
				handle: HANDLES.default,
				message: 'A new random chatter connected! Say hi',
				timestamp: new Date(),
			};
			dispatch(
				chain(
					update('app', 'Update chats', {
						chats: [...chats, msg],
					})
				),
			);
		}
	});

	socket.on('pending', () => {
		console.log('pending');
		const { app: { chats, isChatting } } = getState();
		if (isChatting) {
			const msg = {
				handle: HANDLES.default,
				message: 'The other chatter left. You\'ll be notified when a new chatter is online.',
				timestamp: new Date(),
			};
			dispatch(update('app', 'let user know that chat is pending', {
				chats: [...chats, msg],
			}));
		}
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

// 1. ensure that messages are queued until after signin
// 2. ensure db data is cleaned when a socket disconnects
// 3. implement slash commands
// 4. add animations
// 5. improve skin + helpers (user connected/vs not + diff. bckgrd color per chat..?)
// 6. improve UX around queue/dequeue
// 7. add tests

export const emit = () => (dispatch, getState) => {
	const {
		app: { handle, chats, isChatting },
		input: { value },
	} = getState();

	const msg = { handle: handle || value, message: value, timestamp: new Date() };

	if (!handle) {
		const chatStatus = isChatting
			? 'You can now chat to a random chatter. Start typing a message...'
			: 'I\'ll you know when another chatter is online. Until then, chat with me...';
		const msg2 = {
			handle: HANDLES.default,
			message: `Hi ${value}. ${chatStatus}`,
			timestamp: new Date(),
		};
		dispatch(update('app', 'cache username & save msg', { handle: value, chats: [...chats, msg, msg2] }));
		socket.emit('login');
	} else {
		socket.emit('chat', { handle, message: value });
		dispatch(update('app', 'Update chats', { chats: [...chats, msg] }));
	}

	dispatch(update('input', 'Clear input', { value: '' }));
};
