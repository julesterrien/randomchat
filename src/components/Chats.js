import React from 'react';

/* eslint-disable */
const Chats = ({ chats }) => chats.map((chat, i) => {
	return (
		<div key={i}>
			{chat.handle}
			{chat.message}
		</div>
	);
});
/* eslint-enable */

export default Chats;
