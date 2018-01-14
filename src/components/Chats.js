import React from 'react';

/* eslint-disable */
const Chats = ({ chats }) => chats.map(({ handle, message }, i) => (
	message && message.length > 0 && (
		<div key={i}>
			{handle}{' '}
			{message}
		</div>
	)
));
/* eslint-enable */

export default Chats;
