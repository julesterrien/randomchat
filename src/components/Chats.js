import React from 'react';
import { array, string, bool } from 'prop-types';
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

ChatHeader.propTypes = {
	handle: string.isRequired,
	timestamp: string.isRequired,
	isCurrentUser: bool.isRequired,
};

const ChatBody = ({ message }) => <p>{message}</p>;

ChatBody.propTypes = {
	message: string.isRequired,
};

const Chats = ({ chats = [], handle: userHandle }) => {
	return (
		<main className="chats">
			{
				chats.map(({ handle, message, timestamp }) => {
					const isCurrentUser = handle === userHandle;
					return message && message.length > 0 && (
						<div
							key={timestamp}
							className={classnames('chat', { right: isCurrentUser })}
						>
							<ChatHeader handle={handle} timestamp={timestamp} isCurrentUser={isCurrentUser} />
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
};

Chats.defaultProps = {
	handle: '',
};

export default Chats;
