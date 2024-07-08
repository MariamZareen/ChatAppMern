import React, { useEffect, useState } from 'react'
import pic from './onlineUsers.png';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import logo from './logo.png'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {AnimatePresence, motion} from 'framer-motion'
import { useSelector } from 'react-redux';



export default function Groups() {
    const [groups, setGroups] = useState([]);
    const userData = JSON.parse(localStorage.getItem('userData'));
  const lightTheme = useSelector((state) => state.themeKey);
    const nav = useNavigate();
    const [refresh, setRefresh] = useState(true);
    // const lightTheme = useSelector((state) => state.themeKey);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (!userData) {
            console.log("User not authenticated in groups . jsx");
            nav(-1);
            return; // Exit the useEffect early if userData is null
        }

        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`
            }
        };

        axios.get("http://localhost:5000/chat/fetchGroups", config)
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                // console.error("Error fetching groups:", error);
            });
            console.log("fetchGroups function called")

    }, [refresh, userData, nav]);

    if (!userData) {
        return (
            <h1>this is error code</h1>
        ); // or return a message indicating that the user is not authenticated
    }

    const user = userData.data;

    return (
        <AnimatePresence>
            <motion.div
    initial={{opacity:0,scale:0}}
    animate={{opacity:1,scale:1}}
    exit={{opacity:0,scale:0}}
    transition={{ease:"anticipate",duration:0.3}}
     className='list-container flex flex-col '>
        <div className="head bg-white rounded-[10px] p-2 flex items-center">
            <img src={pic} alt="" className='w-[50px]'/>
            <p className='pl-4 text-lg font-bold'>Available Groups</p>
            <IconButton onClick={ ()=>{setRefresh(!refresh)}}>
                <RefreshIcon/>
            </IconButton>
        </div>
      
        <div className="sb-search mt-3 box">
          <IconButton>
          <SearchIcon/>
          </IconButton>
         <input type="text" className='search border-none ' placeholder='Search' 
         />
       </div>

       <div className='flex flex-col overflow-y-scroll scrollbar m-3'>
            {groups.length === 0 ? (
                <p> No groups available</p>
            ) : (
                groups.map((user, index) => {
                    return (
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className={'p-2 m-2 bg-white flex rounded-[10px] items-center ' + (lightTheme ? '' : 'dark')}
                            key={index}
                            onClick={() => {
                                
                                const config = {
                                    headers: {
                                        Authorization: `Bearer ${userData.data.token}`
                                    }
                                };
                                axios.put("http://localhost:5000/chat/addSelfToGroup", {
                                    chatId: user._id,
                                    userId: userData.data.id,
                                }, config)
                                .then(response => {
                                    // Handle success if needed
                                    // handleUserClick(user);
                                    console.log('Added to group:', response.data);
                                })
                                .catch(error => {
                                    // Handle error if needed
                                    console.error('Error adding to group:', error);
                                });
        
                            }}
                        >
                            <div className="con-icon">{user.chatName[0]}</div>
                            <div className="con-title m-3">{user.chatName}</div>
                        </motion.div>
                    );
                })
            )}
        </div>
    </motion.div>
        </AnimatePresence>
    );
}


