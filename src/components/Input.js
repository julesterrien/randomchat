import React, { Component } from 'react';
import { connect } from 'react-redux';
import { func, string } from 'prop-types';
import { update } from 'novux';
import { emit } from '../actions/socket';

import './Input.css';

class Input extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
	componentDidMount() {
		window.addEventListener('keydown', this.onSubmit);
	}
	componentWillUnmount() {
		window.removeEventListener('keydown', this.onSubmit);
	}
	onSubmit(e) {
		this.props.onSubmit({ key: e.key });
	}
	render() {
		const { onChange, onSubmit, value } = this.props;
		return (
			<div className="input-wrapper">
				<div className="centered">
					<input
						className="input"
						placeholder="Type something..."
						onChange={e => onChange(e.target.value)}
						value={value}
						autoFocus
					/>
					<button className="submit" onClick={() => onSubmit({ key: 'Enter' })}>Send</button>
				</div>
			</div>
		);
	}
}

Input.propTypes = {
	onChange: func.isRequired,
	onSubmit: func.isRequired,
	value: string,
};

Input.defaultProps = {
	value: '',
};

const mapState = state => ({
	value: state.input.value,
});

const mapDispatch = dispatch => ({
	onChange(value) {
		dispatch(update('input', value, { value }));
	},
	onSubmit({ key }) {
		if (key && key === 'Enter') {
			dispatch(emit());
		}
	},
});

export default connect(mapState, mapDispatch)(Input);
