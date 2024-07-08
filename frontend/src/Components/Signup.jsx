import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';
import { Button, TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import Toaster from './Toaster';

const PASSWORD_STRENGTH_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function Signup() {
  const [data, setData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [signInStatus, setSignInStatus] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Weak'); // Default password strength
  const [showPassword, setShowPassword] = useState(false); // Toggle state for showing password
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));

    // Check password strength on each change
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (PASSWORD_STRENGTH_REGEX.test(password)) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Weak');
    }
  };

  const handleTogglePassword = () => {
    setShowPassword((prevShow) => !prevShow);
  };

  const signUpHandler = async () => {
    setLoading(true);
    try {
      // const { name, email, password } = data;

      if (passwordStrength !=='Strong') {
        setSignInStatus('Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await axios.post('https://chat-app-mern-server-liard.vercel.app/user/register/', data, config);
      // console.log('Signup:', response);

      if (response) {
        setSignInStatus('Success');
        setLoading(false);
        localStorage.setItem('userData', JSON.stringify(response.data));
        navigate('/app/welcome');
      } else {
        // console.log('Error: Invalid response data');
        setSignInStatus('Error: Invalid response data');
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 405) {
        // console.log('User with this email already exists');
        setSignInStatus('User with this email already exists');
      } else {
        // console.log('Error:', error);
        setSignInStatus('Error during signup');
      }
      setLoading(false);
    }
  };

  return (
    <div className='screen min-h-[90%] rounded flex m-10 p-5 overflow-y-hidden'>
      <div className="sidepage basis-1/3 flex justify-center items-center bg-slate-200">
        <img src={logo} alt="Logo" className='w-[300px]' />
      </div>
      <div className="loginpage basis-2/3 flex items-center justify-center">
        <div className="login-container w-[50%] h-[500px] rounded-[10px] p-3 flex justify-center items-center">
          <center className='flex flex-col justify-around h-[400px] items-center '>
            <p className='font-bold text-[#06daaf] text-xl'> Create Your Account</p>
            <TextField
              id="name"
              name="name"
              label="Enter your name"
              variant="outlined"
              className='m-5'
              value={data.name}
              onChange={handleChange}
            />
            <TextField
              id="email"
              name="email"
              label="Enter email address"
              variant="outlined"
              className='m-5'
              value={data.email}
              onKeyDown={(e)=>{ 
                if(e.code == 'Enter'){
                  signUpHandler();
                }
              }}
              onChange={handleChange}
            />
            <TextField
              id="password"
              name="password"
              label="Enter password"
              variant="outlined"
              className='m-5 w-[225px]'
              type={showPassword ? 'text' : 'password'} 
              value={data.password}
              onChange={handleChange}
              onKeyDown={(e)=>{ 
                if(e.code == 'Enter'){
                  signUpHandler();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={`Password Strength: ${passwordStrength}`} 
            />
            <Button
              variant='outlined'
              className='m-5'
              onClick={signUpHandler}
              disabled={loading || !data.name || !data.email || !data.password || passwordStrength !== 'Strong'}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </Button>
            <p className='font-bold text-[#06daae]'>
              Already have an account? <Link to='/login' className='text-purple-900'>Login</Link>
            </p>
            {signInStatus && <p>{signInStatus}</p>}
            {signInStatus ? <Toaster key={signInStatus.key} message={signInStatus.msg} /> : null}
          </center>
        </div>
      </div>
    </div>
  );
}
