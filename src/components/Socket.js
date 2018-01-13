import { Component } from 'react';
import { func } from 'prop-types';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { updateChats } from '../actions';

const socket = io('http://localhost:8080');

class Socket extends Component {
	componentDidMount() {
		this.props.onMount();
	}
	render() {
		return null;
	}
}

Socket.propTypes = {
	onMount: func.isRequired,
};

function getUrlParameter(key) {
	const name = key.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
	const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
	const results = regex.exec(location.search); // eslint-disable-line
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const mapDispatch = dispatch => ({
	onMount() {
		socket.on('connect', () => {
			// get & display number of users connected
			console.log('connect');
		});

		socket.on('init', () => {
			console.log('init: connected to a chat');

			// when a connected user sends a msg
			setInterval(() => {
				const msg = {
					handle: getUrlParameter('handle'),
					message: 'Hello world',
				};
				dispatch(updateChats(msg));
				socket.emit('chat', msg);
			}, 5000);
		});

		socket.on('onchat', (msg) => {
			console.log('newChat', msg);
			dispatch(updateChats(msg));
		});

		socket.on('enqueue', () => {
			// show queue loader
			console.log('you have been queued');
		});

		socket.on('dequeue', () => {
			console.log('you have been dequeued. Time to chat!');
		});
	},
});

export default connect(null, mapDispatch)(Socket);
