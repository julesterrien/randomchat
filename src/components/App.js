import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import genghis from '../assets/genghis.png';
import { getData } from '../actions';

import './App.css';

class App extends Component {
	componentDidMount() {
		this.props.onMount();
	}
	render() {
		return (
			<div className="app">
				<h5>Hi there :)</h5>
				<br />
				<img src={genghis} alt="Genghis" />
			</div>
		);
	}
}

App.propTypes = {
	onMount: func.isRequired,
};

const mapDispatch = dispatch => ({
	onMount() {
		dispatch(getData());
	},
});

export default connect(null, mapDispatch)(App);
