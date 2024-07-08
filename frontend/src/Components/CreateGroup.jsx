import { IconButton } from '@mui/material';
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutline";
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreateGroup() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const lightTheme = useSelector((state) => state.themeKey);
  const user = userData.data;
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const createGroup = () => {
    console.log(user.id, "this is from creategroup ");
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`
      }
    };
    axios.post("https://chat-app-mern-server-liard.vercel.app/chat/createGroup", {
      name: groupName,
      users: [user.id] 
    }, config)
    .then(() => {
      nav("/app/groups");
    })
    .catch(error => {
      console.error("There was an error creating the group!", error);
    });
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{opacity:0, scale:0}}
        animate={{opacity:1, scale:1}}
        exit={{opacity:0, scale:0}}
        transition={{ease:"anticipate", duration:0.3}}
        className={`create-group flex justify-between items-center w-[90%] bg-white h-[60px] mx-5 p-3 rounded-[15px] ${lightTheme ? '' : 'dark'}`}
      >
        <input 
          type="text" 
          placeholder='Enter your group name' 
          className={lightTheme ? '' : 'dark'}
          value={groupName} // Bind input value to groupName state
          onChange={(e) => setGroupName(e.target.value)} // Update groupName state on input change
        />
        <IconButton onClick={createGroup}> 
          <DoneOutlineRoundedIcon /> 
        </IconButton>
      </motion.div>
    </AnimatePresence>
  )
}
