import React from 'react';
import { connect } from 'react-redux';
import genghis from '../assets/genghis.png';
// import { array } from 'prop-types';

import './App.css';

const App = () => (
	<div className="app">
		<h5>Hi there :)</h5>
		<br />
		<img src={genghis} alt="Genghis" />
	</div>
);

App.propTypes = {};

const mapState = state => ({});

export default connect(mapState)(App);
