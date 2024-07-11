import React, { useContext, useEffect, useState } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MessageSelf from './MessageSelf';
import MessageOthers from './MessageOthers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MyContext } from './MyContext';
import { io } from 'socket.io-client';
import CryptoJS from 'crypto-js';

const ENDPOINT = 'https://chat-app-mern-server-liard.vercel.app/';
var socket;

export default function ChatArea() {
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState('');
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split('&');
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { refresh, setRefresh } = useContext(MyContext);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [isGroupChat, setIsGroupChat] = useState(false);

  const secretKey = 'your-secret-key'; // Use a secure key for encryption

  const encryptMessage = (message) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
  };

  const decryptMessage = (encryptedMessage) => {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const sendMessage = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`
      }
    };

    const encryptedMessage = encryptMessage(messageContent);

    axios.post('https://chat-app-mern-server-liard.vercel.app/message/', {
      content: encryptedMessage,
      chatId: chat_id
    }, config)
    .then(() => {
      setMessageContent('');
      setRefresh(!refresh);
    });
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup', userData);
    socket.on('connection', () => {
      setSocketConnectionStatus(!socketConnectionStatus);
    });
  }, []);

  useEffect(() => {
    socket.on('message received', (newMessage) => {
      newMessage.content = decryptMessage(newMessage.content);
      if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {
        setAllMessages([...allMessages, newMessage]);
      } else {
        setAllMessages([...allMessages, newMessage]);
      }
    });
  }, [allMessages, allMessagesCopy]);

  useEffect(() => {
    if (!userData || !chat_id) {
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`
      }
    };

    axios.get(`https://chat-app-mern-server-liard.vercel.app/message/${chat_id}`, config)
      .then(response => {
        if (response && response.data) {
          const decryptedMessages = response.data.map(message => {
            message.content = decryptMessage(message.content);
            return message;
          });
          setAllMessages(decryptedMessages);
          setLoaded(true);
          socket.emit('join chat', chat_id);
          setAllMessagesCopy([...decryptedMessages]);
        }
      })
      .catch(error => {
        console.error('Error in chat area Axios:', error);
      });

    axios.get(`https://chat-app-mern-server-liard.vercel.app/chat/${chat_id}`, config)
      .then(response => {
        if (response && response.data) {
          if (response.data.isGroupChat) {
            setIsGroupChat(true);
            setGroupMembers(response.data.users);
          } else {
            setIsGroupChat(false);
          }
        }
      })
      .catch(error => {
        console.error('Error fetching chat details:', error);
      });

  }, [refresh, socketConnectionStatus, userData, chat_id]);

  return (
    <div className={'chatArea-container mx-9 ' + (lightTheme ? '' : 'darkClr2')}>
      <div className={'chatArea-header rounded-[20px] py-4 justify-between ' + (lightTheme ? '' : 'dark')}>
        <div className={'flex ' + (lightTheme ? '' : 'dark')}>
          <div className={'con-icon ' + (lightTheme ? '' : 'dark')}>{chat_user[0]}</div>
          <div className={'flex flex-col pl-3 items-start ml-3 ' + (lightTheme ? '' : 'dark')}>
            <div className="con-title text-lg">{chat_user}</div>
            {isGroupChat && (
              <div className="text-sm">
                {groupMembers.map(member => member.name).join(', ')}
              </div>
            )}
          </div>
        </div>
        <IconButton><DeleteIcon /></IconButton>
      </div>

      <div className={'message-container rounded px-3 overflow-y pb-5 ' + (lightTheme ? '' : 'dark')}>
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

      <div className={'textarea flex justify-between p-2 rounded-[20px] mt-1 ' + (lightTheme ? '' : 'dark rounded')}>
        <input 
          type="text" 
          className={'w-[90%] bg-sky p-3 input border-sky hover:border-none ' + (lightTheme ? '' : 'dark')} 
          placeholder='Type your message'
          value={messageContent} 
          onChange={(e) => { setMessageContent(e.target.value) }} 
          onKeyDown={(e) => {
            if (e.code === 'Enter') {
              sendMessage();
            }
          }} 
        />
        <IconButton
          className={'icon ' + (lightTheme ? '' : 'dark')}
          onClick={sendMessage}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}
