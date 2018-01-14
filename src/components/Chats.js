import React from 'react';
import { array, string } from 'prop-types';
import Moment from 'react-moment';
import classnames from 'classnames';

import './Chats.css';

const ChatHeader = ({ handle, timestamp }) => <h4>{handle} - <Moment fromNow>{timestamp}</Moment></h4>;

const ChatBody = ({ message }) => <h5>{message}</h5>;

const Chats = ({ chats = [], handle: userHandle }) => {
	return chats.length > 0 ? (
		<div className="chats">
			{
				chats.map(({ handle, message, timestamp }, i) => (
					message && message.length > 0 && (
						<div
							key={i} // eslint-disable-line
							className={classnames('chat', { right: handle === userHandle })}
						>
							<ChatHeader handle={handle} timestamp={timestamp} />
							<ChatBody message={message} />
						</div>
					)
				))
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
