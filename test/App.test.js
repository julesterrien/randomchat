import React from 'react';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { chainMiddleware } from 'redux-chain';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import reducers from '../src/modules/reducers';

import App from '../src/components/App';

configure({ adapter: new Adapter() });

chai.use(chaiAsPromised);
const { assert } = chai;

const middlewares = [chainMiddleware, thunk];
const store = createStore(combineReducers(reducers), applyMiddleware(...middlewares));

describe('components', () => {
	const app = mount(<Provider store={store}><App /></Provider>);

	it('renders without crashing', () => {
		assert.strictEqual(app.find('.app').length, 1, 'app should be mounted');
		assert.strictEqual(app.find('.chats').length, 1, 'chats wrapper should be mounted');
		assert.strictEqual(app.find('.input').length, 1, 'input should be mounted');
		assert.strictEqual(app.find('.submit').length, 1, 'submit should be mounted');
	});

	it('updates state when the input value is changed', () => {
		app.find('.input').simulate('change', { target: { value: 'Bob' } });
		assert.strictEqual(store.getState().input.value, 'Bob');
	});
});
