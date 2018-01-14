import React from 'react';
import { array, string } from 'prop-types';
import classnames from 'classnames';
import { moment } from '../modules/utils';

import './Chats.css';

const ChatHeader = ({ handle, timestamp }) => {
	return <h4>{handle} - {timestamp}</h4>;
};

const ChatBody = ({ message }) => {
	return <h5>{message}</h5>;
};

const Chats = ({ chats, handle: userHandle }) => {
	return (
		<div className="chats">
			{
				chats.map(({ handle, message, timestamp }, i) => (
					message && message.length > 0 && (
						<div
							key={i} // eslint-disable-line
							className={classnames('chat', { right: handle === userHandle })}
						>
							<ChatHeader handle={handle} timestamp={moment(timestamp)} />
							<ChatBody message={message} />
						</div>
					)
				))
			}
		</div>
	);
};

Chats.propTypes = {
	chats: array.isRequired,
	handle: string,
};

Chats.defaultProps = {
	handle: '',
};

export default Chats;
