import React from 'react';
import './styles.css';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { MyContextProvider } from './MyContext'; 
import { useSelector } from 'react-redux';

export default function MainContainer() {
  const lightTheme = useSelector((state) => state.themeKey)
  return (
    <div className={'App ' + (lightTheme ? '': '!bg-[#181f21]')}>
      <MyContextProvider>
        <div className={'main-container ' +(lightTheme ? '' : 'darkClr2') }>
          <Sidebar />
          <Outlet />
        </div>
      </MyContextProvider>
    </div>
  );
}

//!bg-[#0C1A1A]
