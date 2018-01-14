import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, array } from 'prop-types';
// import { getData } from '../actions';
import { init as initSocket } from '../actions/socket';
import Chats from './Chats';
import Input from './Input';

import './App.css';

class App extends Component {
	componentDidMount() {
		this.props.onMount();
	}
	render() {
		const { chats } = this.props;
		return (
			<div className="app">
				<Chats chats={chats} />
				<Input />
			</div>
		);
	}
}

App.propTypes = {
	onMount: func.isRequired,
	chats: array,
};

App.defaultProps = {
	chats: [],
};

const mapState = state => ({
	chats: state.app.chats,
});

const mapDispatch = dispatch => ({
	onMount() {
		dispatch(initSocket());
		// dispatch(getData());
	},
});

export default connect(mapState, mapDispatch)(App);
