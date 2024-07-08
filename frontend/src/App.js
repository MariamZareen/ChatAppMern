import './App.css';
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import MainContainer from './Components/MainContainer';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Welcome from './Components/Welcome';
import ChatArea from './Components/ChatArea';
import Groups from './Components/Groups';
import Users from './Components/Users';
import CreateGroup from './Components/CreateGroup';


function App() {
  return (
  
    <Routes>
      <Route path="/" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/app" element={<MainContainer/>} >
         <Route path="welcome" element={<Welcome/>} />
         <Route path="chat/:_id" element={<ChatArea/>} />
         <Route path="users" element={<Users/>} />
         <Route path="groups" element={<Groups/>} />
         <Route path="create-groups" element={<CreateGroup/>} />
      </Route>

      
    </Routes>

    
  );
}

export default App;
