import Promise from 'bluebird';
import * as chai from 'chai';
import sinon from 'sinon';
import { chainMiddleware } from 'redux-chain';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { COMMANDS } from '../src/constants';

import {
	init,
	sendMessage,
	handleInput,
	handleSubmit,
} from '../src/actions';

const { assert } = chai;

const initialState = {
	app: {
		handle: 'rando',
		chats: [],
	},
	input: {
		value: '',
	},
};

describe('actions', () => {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});
	afterEach(() => {
		sandbox.restore();
	});

	describe('init', () => {
		it('caches bot handle', () => {
			const store = configureStore([chainMiddleware, thunk])(initialState);
			const socket = { emit: sandbox.stub(), on: (key, cb) => { cb({ bot: 'rando' }); } };
			store.dispatch(init({ socket }));
			const actions = store.getActions();
			assert.strictEqual(actions[0].state.botHandle, 'rando');
		});
	});

	describe('sendMessage', () => {
		it('updates chats array', () => {
			const store = configureStore([chainMiddleware, thunk])(initialState);
			const socket = { emit: sandbox.stub() };
			store.dispatch(sendMessage({ value: 'Some message', socket }));
			const action = store.getActions()[0];
			assert.strictEqual(action.state.chats[0].handle, 'rando');
			assert.strictEqual(action.state.chats[0].message, 'Some message');
			assert.strictEqual(socket.emit.callCount, 1, 'the socket was called');
			assert.strictEqual(socket.emit.getCall(0).args[1].message, 'Some message');
		});
	});

	describe('handleInput', () => {
		it('handles /delay command', () => {
			const store = configureStore([chainMiddleware, thunk])({
				...initialState,
				input: { value: `${COMMANDS.delay} 500 hello` },
			});
			const socket = { emit: sandbox.stub() };
			return Promise.resolve()
				.then(() => store.dispatch(handleInput({ socket })))
				.delay(550)
				.then(() => {
					const action = store.getActions()[0];
					assert.strictEqual(action.state.chats[0].handle, 'rando');
					assert.strictEqual(action.state.chats[0].message, 'hello');
					assert.strictEqual(socket.emit.getCall(0).args[1].message, 'hello');
				});
		});

		it('handles /hop command', () => {
			const store = configureStore([chainMiddleware, thunk])({
				...initialState,
				input: { value: `${COMMANDS.hop}` },
			});
			const socket = { emit: sandbox.stub() };
			store.dispatch(handleInput({ socket }));
			const action = store.getActions()[0];
			assert.strictEqual(action.state.chats[0].handle, 'rando');
			assert.strictEqual(action.state.chats[0].message, '/hop');
			assert.strictEqual(socket.emit.getCall(0).args[0], 'hop');
		});

		it('default is to sendMessage', () => {
			const store = configureStore([chainMiddleware, thunk])({
				...initialState,
				input: { value: 'Some message' },
			});
			const socket = { emit: sandbox.stub() };
			store.dispatch(handleInput({ socket }));
			const action = store.getActions()[0];
			assert.strictEqual(action.state.chats[0].handle, 'rando');
			assert.strictEqual(action.state.chats[0].message, 'Some message');
			assert.strictEqual(socket.emit.getCall(0).args[1].message, 'Some message');
		});
	});

	describe('handleSubmit', () => {
		it('handles /help', () => {
			const store = configureStore([chainMiddleware, thunk])({
				...initialState,
				input: { value: `${COMMANDS.help}` },
			});
			const socket = { emit: sandbox.stub() };
			store.dispatch(handleSubmit({ socket }));
			assert.strictEqual(socket.emit.getCall(0).args[0], 'help');
		});

		it('handles login', () => {
			const store = configureStore([chainMiddleware, thunk])({
				...initialState,
				app: { ...initialState.app, handle: undefined },
				input: { value: 'bob' },
			});
			const socket = { emit: sandbox.stub() };
			store.dispatch(handleSubmit({ socket }));
			assert.strictEqual(socket.emit.getCall(0).args[0], 'login');
			const action = store.getActions()[0];
			assert.strictEqual(action.state.handle, 'bob');
		});

		it('defaults to updating chats array', () => {
			const store = configureStore([chainMiddleware, thunk])({
				...initialState,
				input: { value: 'some message' },
			});
			const socket = { emit: sandbox.stub() };
			store.dispatch(handleSubmit({ socket }));
			assert.strictEqual(socket.emit.getCall(0).args[0], 'chat');
			assert.strictEqual(socket.emit.getCall(0).args[1].message, 'some message');
			const action = store.getActions()[0];
			assert.strictEqual(action.state.chats[0].message, 'some message');
		});
	});
});
