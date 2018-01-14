/**
 * getUrlParameter
 * https://davidwalsh.name/query-string-javascript
 * @param {string} key the query param key to match
 * @return {null||string} the query param value
 */
export const getUrlParameter = (key) => {
	const name = key.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
	const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
	const results = regex.exec(location.search); // eslint-disable-line
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

export const moment = timestamp => timestamp && timestamp.toTimeString().split(' ')[0];
