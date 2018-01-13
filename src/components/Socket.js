import { Component } from 'react';
import io from 'socket.io-client';

class Socket extends Component {
	componentDidMount() {
		const socket = io('http://localhost:8080');
		socket.on('connect', () => {
			console.log('Connected');
		});
		socket.on('news', (data) => {
			console.log('news', data);
			socket.emit('other', { my: 'other event' });
		});
		socket.on('disconnect', () => {
			console.log('Disconnect');
		});
	}
	render() {
		return null;
	}
}

export default Socket;
