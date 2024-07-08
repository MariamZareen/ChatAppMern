import React, { useEffect, useState } from 'react';
import pic from './onlineUsers.png';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { refreshSidebar, addUser } from '../Features/sidebarSlice'; 
// import { addConversation } from '../Features/conversationSlice';

export default function Users() {
  const sidebarData = useSelector((state) => state.sidebar.sidebarData);
  const [refresh, setRefresh] = useState(true);
  const lightTheme = useSelector((state) => state.themeKey);
  const [users, setUsers] = useState([]);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const nav = useNavigate();
  const dispatch = useDispatch();
  // console.log(lightTheme)

  if (!userData) {
    // console.log("user not authenticated");
    nav(-1);
  }

  useEffect(() => {
    dispatch(refreshSidebar());
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`
      }
    };
    axios.get("http://localhost:5000/user/fetchUsers", config).then((data) => {
      // console.log("User Data from API ", data);
      setUsers(data.data);
    });
  }, [refresh, dispatch, userData]);

  const handleUserClick = (user) => {
    // console.log("Creating chat with", user.name);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.data.token}`
      }
    };
    axios.post("http://localhost:5000/chat/", { userId: user._id }, config)
      .then(() => {
        dispatch(addUser(user)); 
        console.log("Updated Sidebar Data:", sidebarData);
      });
  };

  return (
    <AnimatePresence>
    <motion.div
    initial={{opacity:0,scale:0}}
    animate={{opacity:1,scale:1}}
    exit={{opacity:0,scale:0}}
    transition={{ease:"anticipate",duration:0.3}}
     className={'list-container flex flex-col ' + (lightTheme ? '': 'darkClr2')}>
        <div className={"head bg-white rounded-[10px] p-2 flex items-center "+ (lightTheme ? "": "dark")}>
            <img src={pic} alt="" className='w-[50px]'/>
            <p className='pl-4 text-lg font-bold'>Available Users</p>
            <IconButton onClick={ ()=>{setRefresh(!refresh)}}>
                <RefreshIcon/>
            </IconButton>
        </div>
      
        <div className={"sb-search mt-3 box " + (lightTheme ? "": "dark")}>
          <IconButton className={lightTheme ? "": "dark"}>
          <SearchIcon/>
          </IconButton>
         <input type="text" className={"search border-none "+ (lightTheme ? "": "dark")} placeholder='Search' 
         />
       </div>

      <div className={'flex flex-col overflow-y-scroll scrollbar m-3 '+(lightTheme ? '': 'darkClr2 ')}>

       {
        users.map((user, index) => {
            return (
                <motion.div
                whileHover={{scale: 1.01}}
                whileTap={{scale: 0.98}}
                className={'p-2 m-2 bg-white flex rounded-[10px] items-center '+ (lightTheme ? '': 'dark')}
                key={index}
                onClick={()=>{
                    console.log("Creating chat with", user.name);
                    const config = {
                        headers: {
                            Authorization: `Bearer ${userData.data.token}`
                        }
                    }
                    axios.post("http://localhost:5000/chat/", {
                      userId: user._id
                  }, config)
                  .then(response => {
                    dispatch(addUser(user)); 
                    console.log("Updated Sidebar Data:", sidebarData);
                  })
                  .catch(error => {
                      console.error('Error adding to chat:', error);
                  });
                }}
                //onClick={handleUserClick(user)}
                >
                 <div className="con-icon ">{user.name[0]}</div>
                 <div className="con-title m-3">{user.name}</div>
                </motion.div>
            )
        })
       }
      </div>
    </motion.div>
    </AnimatePresence>
  );
}
