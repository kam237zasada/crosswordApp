import React from 'react';

function Message({message, isError}) {
    if(isError===true) {
        return (
            <div className="message-container message-error">{message}</div>
        )
    } else {
    return (
        <div className="message-container">{message}</div>
    )
    }
}

export default Message