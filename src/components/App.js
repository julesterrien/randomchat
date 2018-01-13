import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, array } from 'prop-types';
import { getData } from '../actions';
import Socket from './Socket';
import Chats from './Chats';

import './App.css';

class App extends Component {
	componentDidMount() {
		this.props.onMount();
	}
	render() {
		const { chats } = this.props;
		return (
			<div className="app">
				<Socket />
				<h5>Hi there :)</h5>
				<Chats chats={chats} />
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
		dispatch(getData());
	},
});

export default connect(mapState, mapDispatch)(App);
