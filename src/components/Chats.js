import React from 'react';
import { array, string, bool, oneOfType, object } from 'prop-types';
import Moment from 'react-moment';
import classnames from 'classnames';

import './Chats.css';

const ChatHeader = ({ handle, timestamp, isCurrentUser, bot }) => {
	return (
		<h5 className={classnames('chat-header', { bot: handle.startsWith(bot), self: isCurrentUser })}>
			{handle}{' '}
			<Moment fromNow className="date">{timestamp}</Moment>
		</h5>
	);
};

ChatHeader.propTypes = {
	handle: string.isRequired,
	isCurrentUser: bool.isRequired,
	timestamp: oneOfType([string, object]),
	bot: string,
};

ChatHeader.defaultProps = {
	timestamp: '',
	bot: '',
};

const ChatBody = ({ message }) => <p>{message}</p>;

ChatBody.propTypes = {
	message: string.isRequired,
};

const Chats = ({ chats = [], handle: userHandle, bot }) => {
	return (
		<main className="chats">
			{
				chats.map(({ handle, message, timestamp }, i) => {
					const isCurrentUser = handle === userHandle;
					return message && message.length > 0 && (
						<div
							key={i} // eslint-disable-line
							className={classnames('chat', { right: isCurrentUser })}
						>
							<ChatHeader
								handle={handle}
								timestamp={timestamp}
								isCurrentUser={isCurrentUser}
								bot={bot}
							/>
							<ChatBody message={message} />
						</div>
					);
				})
			}
		</main>
	);
};

Chats.propTypes = {
	chats: array.isRequired,
	handle: string,
	bot: string,
};

Chats.defaultProps = {
	handle: '',
	bot: '',
};

export default Chats;
