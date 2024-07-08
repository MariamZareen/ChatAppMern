import React from 'react';
import logo from './logo.png';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

export default function Welcome() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem('userData'));

  return (
    <div className={'welcome flex justify-center items-center flex-col mx-5 rounded-[30px] border-b-[10px] border-[#63d7b0] '+(lightTheme ? '': 'dark')}>
      <motion.img
        drag
        whileDrag={{ scale: 1.05, rotate: 360 }}
        src={logo}
        alt='logo'
        className={'welcome-logo w-[300px] '+(lightTheme ? '': 'dark')}
      />
      {userData && userData.data && <b className='mt-5'>Hi, {userData.data.name}</b>}
      <p className='mt-9'>View and text directly to people present in chat rooms</p>
    </div>
  );
}
