import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Conversation({props}) {
  const navigate=useNavigate();
  return (
    <div className="conversation-container " onClick={()=>{navigate('chat')}}>
        <div className="con-icon">{props.name[0]}</div>
        <div className="con-title">{props.name}</div>
        <div className="con-lastMessage">{props.lastMessage}</div>
        <div className="con-timeStamp">{props.timeStamp}</div>
    </div>
  )
}
