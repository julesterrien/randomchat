import { update } from 'novux';
// import { chain } from 'redux-chain';

const baseUrl = `http://${window.location.hostname || 'localhost'}:8080/`;

export const getData = () => (dispatch) => {
	fetch(baseUrl, {
		method: 'GET',
	})
		.then(res => res.json())
		.then((body) => {
			console.log('Response body:', body);
		});
};
