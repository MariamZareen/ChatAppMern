import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import { Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Toaster from './Toaster';

export default function Login() {
  const [showlogin, setShowLogin] = useState(false);
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [logInStatus, setLogInStatus] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowLogin(true); 
  }, []);

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const loginHandler = async () => {
    setLoading(true);
    // console.log(data);
    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const response = await axios.post('https://chat-app-mern-server-liard.vercel.app/user/login', data, config);
      // console.log('Login: ', response);
      setLogInStatus({ msg: 'Success', key: Math.random() });
      // setLoading(false);
      localStorage.setItem('userData', JSON.stringify(response));
      navigate('/app/welcome');
    } catch (error) {
      // console.log(error);
      setLogInStatus({ msg: 'Invalid userName Or Password', key: Math.random() });
    }
  };

  return (
    <div className='screen min-h-[90%] rounded flex m-10 p-5 overflow-y-hidden'>
      <div className='sidepage basis-1/3 flex justify-center items-center bg-slate-200'>
        <img src={logo} alt='' className='w-[300px]' />
      </div>

      <div className='loginpage basis-2/3 flex items-center justify-center'>
        <div className='login-container w-[50%] h-[500px] rounded-[10px] p-3 flex justify-center items-center'>
          {showlogin && (
            <center className='flex flex-col justify-around h-[300px] items-center '>
              <p className='font-bold text-[#06daaf] text-xl'> Login To Your Account</p>
              <TextField
                id='email'
                name='email' 
                label='Enter email address'
                variant='outlined'
                className='m-5'
                onKeyDown={(e)=>{ 
                  if(e.code === 'Enter'){
                    loginHandler();
                  }
                }}
                value={data.email}
                onChange={changeHandler}
              />

              <TextField
                id='password'
                name='password' 
                label='Enter your password'
                variant='outlined'
                className='m-5 w-[225px]'
                type={showPassword ? 'text' : 'password'} 
                value={data.password}
                onChange={changeHandler}
                onKeyDown={(e)=>{ 
                  if(e.code === 'Enter'){
                    loginHandler();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={handleTogglePassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant='outlined' className='m-5 bg-purple-900' onClick={loginHandler}>
                Login
              </Button>
              <p className='font-bold text-[#06daae]'>
                Already have an account? <Link to={'/'} className='text-purple-900'>SignUp</Link>
              </p>
              {logInStatus ? <Toaster key={logInStatus.key} message={logInStatus.msg} /> : null}
            </center>
          )}
        </div>
      </div>
    </div>
  );
}
