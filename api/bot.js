const handle = '@rando';
const BOT = {
	intro: {
		handle,
		message: 'To start, choose a username',
	},
	newChat: {
		handle,
		message: 'A new random chatter connected! Say hi',
	},
	startChat: {
		handle,
		message: 'You can now chat to a random chatter. Start typing a message...',
	},
	pendingChat: {
		handle,
		message: 'I\'ll you know when another chatter is online. Until then, chat with me...',
	},
	endChat: {
		handle,
		message: 'The other chatter left. You\'ll be notified when a new chatter is online.',
	},
	enqueue: {
		handle,
		message: 'You have been placed in a queue',
	},
	dequeue: {
		handle,
		message: 'It\'s your turn to chat!',
	},
};

export default BOT;
