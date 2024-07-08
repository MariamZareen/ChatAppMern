import React from 'react'
import { useSelector } from 'react-redux'

export default function MessageOthers({ message }) {
  const lightTheme = useSelector((state) => state.themeKey);
  const { sender, content } = message;
  const timestamp = getTimestampFromObjectId(message._id);
    function getTimestampFromObjectId(objectId) {
      const timestampHex = objectId.substring(0, 8);
      const timestamp = new Date(parseInt(timestampHex, 16) * 1000);
      const hours = timestamp.getHours().toString().padStart(2, '0');
      const minutes = timestamp.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      return timeString;
  }

  return (
    <div className='other-message-container'>
      <div className="conversation-container">
        <p className="con-icon">{sender.name[0]}</p>
        <div className={"other-text-content bg-blue-100 w-[40%] max-w-[40%] p-3 rounded-[10px] "+ (lightTheme ? " ": "darkClr2")}>
          <p className="con-title text-xs flex justify-start">{sender.name}</p>
          <p className="con-lastMessage flex text-left">{content}</p>
          <p className="self-timeStamp text-xs flex justify-end mt-2">{timestamp}</p>
        </div>
      </div>
    </div>
  );
}

