import React , {useContext , useEffect, useState} from 'react'
import { IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MessageSelf from './MessageSelf';
import MessageOthers from './MessageOthers';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import axios from 'axios';
import { MyContext } from './MyContext'; 
import {io} from 'socket.io-client'
import { light } from '@mui/material/styles/createPalette';


const ENDPOINT = 'https://chat-app-mern-server-liard.vercel.app/'
var socket, chat;

export default function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent ] = useState("");
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const {refresh, setRefresh} = useContext(MyContext);
  const [socketConnectionStatus, setSocketConnectionStatus] =useState(false);


  const sendMessage= () =>{
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`
      }
    }
   
    axios.post("https://chat-app-mern-server-liard.vercel.app/message/", {
      content: messageContent,
      chatId: chat_id
    }, config)
    .then(({res})=>{
      // console.log(messageContent, "Message Fired")
    })
  }

  //connecting socket.io
useEffect(()=>{
  socket = io(ENDPOINT);
  socket.emit("setup", userData)
  socket.on("connection", ()=>{
    setSocketConnectionStatus(!socketConnectionStatus);
  })
},[])


useEffect(()=>{
  socket.on("message recieved", (newMessage)=>{
    if(!allMessagesCopy || allMessagesCopy._id !== newMessage._id){
      setAllMessages([...allMessages], newMessage);
    }else{
      setAllMessages([...allMessages], newMessage);
    }
  })
},[])

useEffect(() => {
  if (!userData || !chat_id) {
    // console.log("userData or chat_id is not available.");
    return;
  }

  // console.log(userData);
  const config = {
    headers: {
      Authorization: `Bearer ${userData.data.token}`
    }
  };

  // console.log(chat_id);

  axios.get(`https://chat-app-mern-server-liard.vercel.app/message/${chat_id}`, config)
    .then(response => {
      if (response && response.data) {
        // Proceed with handling the data
        setAllMessages(response.data);
       // console.log(response.data, "this is from all messages"); // Change this to response.data
        setLoaded(true);
        socket.emit("join chat", chat_id);
        setAllMessagesCopy([...response.data]);
      } else {
        // console.log("Empty response or missing data.");
      }
    })
    .catch(error => {
      // console.log("Error in chat area Axios:", error);
    });

}, [refresh, socketConnectionStatus, userData, chat_id, setAllMessages, socket, setLoaded, setAllMessagesCopy]);


  return (
    <div className={'chatArea-container mx-9 ' + (lightTheme ? '' : 'darkClr2')}>
        <div className={"chatArea-header rounded-[20px] py-4 justify-between " +(lightTheme ? '': 'dark')}>
        <div className={"flex "+ (lightTheme ? '': 'dark')}>
           <div className={"con-icon "+ (lightTheme ? '': 'dark')}>{chat_user[0]}</div>
            <div className={'flex flex-col pl-3 items-start ml-3 '+(lightTheme ? '': 'dark')}>
               <div className="con-title text-lg">{chat_user}</div>
               <div className="text-sm ">Online</div>
            </div>
        </div>
        <IconButton><DeleteIcon/></IconButton>

        </div>




  <div className={"message-container rounded px-3 overflow-y pb-5 " + ( lightTheme ? " ": "dark")}>
  {allMessages.slice(0).map((message, index) => {
    const sender = message.sender;
    const self_id = userData.data.id;
    
    if (sender._id === self_id) {
      return <MessageSelf key={index} message={message} />;
    } else {
      return <MessageOthers key={index} message={message} />;
    }
  })}
</div>





        <div className={"textarea flex justify-between p-2 rounded-[20px] mt-1 " + (lightTheme ? "": "dark rounded")}>
        <input 
      type="text" 
      className={'w-[90%] bg-sky p-3 input border-sky hover:border-none '+ (lightTheme ? '': 'dark')} 
      placeholder='Type your message'
      value={messageContent} 
      onChange={(e) => { setMessageContent(e.target.value) }} 
      onKeyDown={(e) => {
        if (e.code === 'Enter') {
          sendMessage();
          setMessageContent("");  
          setRefresh(!refresh);  
        }
      }} 
    />
            <IconButton
            className={'icon '+ (lightTheme ? '': 'dark')}
            onClick={()=>{
              sendMessage();
              setRefresh(!refresh);
            }}
            >
              
              <SendIcon/></IconButton>
        </div>

    </div>
  )
}

