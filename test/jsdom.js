// Disable webpack-specific features for tests since
// Mocha doesn't know what to do with them.
require.extensions['.css'] = () => null;
require.extensions['.png'] = () => null;
require.extensions['.jpg'] = () => null;

require('babel-register')();
require('es6-promise').polyfill();
require('isomorphic-fetch');
require('raf/polyfill');

const jsdom = require('jsdom');

const { JSDOM } = jsdom;

// load basic JSDOM setup
if (!global.document) {
	const dom = new JSDOM('<!DOCTYPE html><div id="root"></div>');
	global.window = dom.window;
	global.document = dom.window.document;
	global.navigator = { userAgent: 'node.js' };
	global.documentRef = document;
}
