import React from 'react';
import { array, string } from 'prop-types';
import Moment from 'react-moment';
import classnames from 'classnames';

import './Chats.css';

const BOT = 'rando';

const ChatHeader = ({ handle, timestamp, isCurrentUser }) => {
	return (
		<h5 className={classnames('chat-header', { bot: handle.startsWith(BOT), self: isCurrentUser })}>
			{handle}{' '}
			<Moment fromNow className="date">{timestamp}</Moment>
		</h5>
	);
};

const ChatBody = ({ message }) => <p>{message}</p>;

const Chats = ({ chats = [], handle: userHandle }) => {
	return chats.length > 0 ? (
		<div className="chats">
			{
				chats.map(({ handle, message, timestamp }, i) => {
					const isCurrentUser = handle === userHandle;
					return message && message.length > 0 && (
						<div
							key={i} // eslint-disable-line
							className={classnames('chat', { right: isCurrentUser })}
						>
							<ChatHeader handle={handle} timestamp={timestamp} isCurrentUser={isCurrentUser} />
							<ChatBody message={message} />
						</div>
					);
				})
			}
		</div>
	) : <div className="chats" />;
};

Chats.propTypes = {
	chats: array.isRequired,
	handle: string,
};

Chats.defaultProps = {
	handle: '',
};

export default Chats;
