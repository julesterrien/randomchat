const handle = 'rando';
const BOT = {
	intro: {
		handle,
		message: 'Welcome to RandomChat! Hi I\'m rando, a simple bot here to help. To start, type a username...',
	},
	newChat: {
		handle,
		message: 'A new random chatter connected! Say hi',
	},
	startChat: {
		handle,
		message: 'You can now chat to a random chatter. Start typing a message...',
	},
	endChat: {
		handle,
		message: 'The other chatter left. You\'ll be notified when a new chatter is online.',
	},
	enqueue: {
		handle,
		message: 'I\'ll you know when another chatter is online. Until then, chat with me...',
	},
	dequeue: {
		handle,
		message: 'It\'s your turn to chat!',
	},
};

export default BOT;
