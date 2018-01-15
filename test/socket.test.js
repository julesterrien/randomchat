import * as chai from 'chai';
import sinon from 'sinon';
import {
	onInit,
} from '../api/socket';

const { assert } = chai;

describe('socket', () => {
	let sandbox;
	let rooms;
	let roomMap;
	let auth;
	let msgQueues;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		rooms = [[]];
		roomMap = {};
		auth = {};
		msgQueues = {};
	});
	afterEach(() => {
		sandbox.restore();
	});

	describe('onInit', () => {
		it('pushes this socket to a room', () => {
			const s1 = { emit: sandbox.stub(), id: 'SOCKET' };
			onInit({ s1, rooms, roomMap, auth, msgQueues });
			assert.strictEqual(rooms[0][0].id, 'SOCKET');
			assert.strictEqual(roomMap['SOCKET'], 0);
			assert.strictEqual(msgQueues['SOCKET'].length, 0);
			assert.strictEqual(s1.emit.getCall(0).args[0], 'init');
			assert.strictEqual(s1.emit.getCall(1).args[0], 'chat');
		});

		it('notifies the other socket that a new socket has joined the room', () => {
			const s1 = { emit: sandbox.stub(), id: 's1' };
			const s2 = { emit: sandbox.stub(), id: 's2' };
			rooms[0].push(s2);
			auth.s2 = true;
			onInit({ s1, rooms, roomMap, auth, msgQueues });
			assert.strictEqual(s2.emit.getCall(0).args[0], 'chat');
		});

		it('queues up messages to s2 if s2 is not yet logged in', () => {
			const s1 = { emit: sandbox.stub(), id: 's1' };
			const s2 = { emit: sandbox.stub(), id: 's2' };
			rooms[0].push(s2);
			msgQueues['s2'] = [];
			// auth.s2 = true; // -> not logged in
			onInit({ s1, rooms, roomMap, auth, msgQueues });
			assert.strictEqual(s2.emit.callCount, 0);
		});
	});
});
