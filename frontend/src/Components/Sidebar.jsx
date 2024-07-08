import React, { useState, useEffect } from 'react';
import './styles.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toggleTheme } from '../Features/themeSlice';
import { useSelector, useDispatch } from 'react-redux';

export default function Sidebar() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.sidebar.sidebarData);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConversations, setFilteredConversations] = useState(conversations);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredConversations(conversations);
    } else {
      setFilteredConversations(conversations.filter((conversation) => {
        let chatName = "";
        if (conversation.isGroupChat) {
          chatName = conversation.chatName;
        } else if (Array.isArray(conversation.users)) {
          conversation.users.forEach((user) => {
            if (user._id !== userData.data._id) {
              chatName = user.name;
            }
          });
        }
        return chatName.toLowerCase().includes(searchQuery.toLowerCase());
      }));
    }
  }, [searchQuery, conversations, userData]);

  if (!userData) {
    return null;
  }

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className={'sidebar ' + (lightTheme ? '' : 'darkClr2')}>
      <div className={'sb-header ' + (lightTheme ? '' : 'dark')}>
        <IconButton onClick={() => { navigate('welcome') }}>
          <AccountCircleIcon className={'icon ' + (lightTheme ? '' : 'dark')} />
        </IconButton>

        <div className='sb-header-subdiv'>
          <IconButton onClick={() => { navigate('users') }}>
            <PersonAddIcon className={'icon ' + (lightTheme ? '' : 'dark')} />
          </IconButton>

          <IconButton onClick={() => { navigate('groups') }}>
            <GroupAddIcon className={'icon ' + (lightTheme ? '' : 'dark')} />
          </IconButton>

          <IconButton onClick={() => { navigate('create-groups') }}>
            <AddCircleIcon className={'icon ' + (lightTheme ? '' : 'dark')} />
          </IconButton>

          <span onClick={handleThemeToggle} className={(lightTheme) ? '' : 'dark'}>
            {lightTheme ? (
              <IconButton>
                <NightlightIcon />
              </IconButton>
            ) : (
              <IconButton>
                <LightModeIcon className={'icon ' + (lightTheme ? '' : 'dark')} />
              </IconButton>
            )}
          </span>
        </div>
      </div>

      <div className={'sb-search ' + (lightTheme ? '' : 'dark shadow')}>
        <IconButton>
          <SearchIcon className={'icon ' + (lightTheme ? '' : 'dark ')} />
        </IconButton>
        <input
          type="text"
          className={'search border none ' + (lightTheme ? '' : 'dark ')}
          placeholder='Search'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={'sb-conversation ' + (lightTheme ? '' : 'dark')}>
        {filteredConversations.map((conversation) => {
          let chatName = '';

          if (conversation.isGroupChat) {
            chatName = conversation.chatName;
            chatName = chatName + ":G";
          } else if (Array.isArray(conversation.users)) {
            conversation.users.forEach((user) => {
              if (user._id !== userData.data._id) {
                chatName = user.name;
              }
            });
          }

          if (chatName) {
            return (
              <div
                key={conversation._id}
                className='conversation-container'
                onClick={() => {
                  navigate('chat/' + conversation._id + '&' + chatName);
                }}
              >
                <p className='con-icon'>{chatName[0]?.toUpperCase()}</p>
                <p className='con-title'>{chatName}</p>
                {/* <p className='con-lastMessage'>{conversation.latestMessage.content}</p> */}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
