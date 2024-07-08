import React from 'react'
import pic from './onlineUsers.png';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {AnimatePresence, motion} from 'framer-motion'


export default function Groups() {

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
        </div>
      
        <div className="sb-search mt-3 box">
          <IconButton>
          <SearchIcon/>
          </IconButton>
         <input type="text" className='search border-none ' placeholder='Search' 
         />
       </div>

      <div className='flex flex-col overflow-y-scroll scrollbar m-3'>

       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>

       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
      
       

      </div>


    </motion.div>
    </AnimatePresence>
  )
}



{/* <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div>
       <motion.div 
       whileHover={{scale:1.02}}
       whileTap={{scale:0.98}}
       className="p-2 m-2 bg-white flex rounded-[10px] items-center ">
           <div className="con-icon ">S</div>
           <div className="con-title m-3">Shivi</div>
       </motion.div> */}