import { createReducer } from 'novux';

const reducers = {
	app: createReducer('app', {}),
	input: createReducer('input', {}),
};

export default reducers;
