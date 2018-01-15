import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, array, string } from 'prop-types';
import { init as initSocket } from '../actions';
import Chats from './Chats';
import Input from './Input';

import './App.css';

class App extends Component {
	componentDidMount() {
		this.props.onMount();
	}
	render() {
		const { chats, handle } = this.props;
		return (
			<div className="app">
				<Chats chats={chats} handle={handle} />
				<Input />
			</div>
		);
	}
}

App.propTypes = {
	onMount: func.isRequired,
	chats: array,
	handle: string,
};

App.defaultProps = {
	chats: [],
	handle: '',
};

const mapState = state => ({
	chats: state.app.chats,
	handle: state.app.handle,
});

const mapDispatch = dispatch => ({
	onMount() {
		dispatch(initSocket());
	},
});

export default connect(mapState, mapDispatch)(App);
