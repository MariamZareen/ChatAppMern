import React from 'react';
import { useSelector, useDispatch } from 'react-redux';


export default function MessageSelf({ message }) {
    const lightTheme = useSelector((state) => state.themeKey);
    const dispatch = useDispatch();
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
        <div className={'self-message-container w-full flex justify-end my-3 '+ (lightTheme ? '': 'dark')}>
            <div className={"messageBox bg-green-200 max-w-[40%] p-3 rounded-[10px] "+(lightTheme ? "": "darkClr2")}>
                <p>{message.content}</p>
                <div className={"self-timeStamp text-xs flex justify-end mt-2 "+ (lightTheme ? " ": "darkClr2")}>{timestamp.toLocaleString()}</div>
            </div>
        </div>
    );
}


