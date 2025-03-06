import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { setCredentials } from '../store/slices/authSlice';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import BackendError from '../components/ui/BackendError'; 
import axiosError from './axiosError';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [backendError, setBackendError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('auth/login', { username, password });
      dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('token', response.data.token);
      navigate(response.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      axiosError(`${error.response?.data?.message}` || 'Login failed', setBackendError)
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-md bg-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <BackendError backendError={backendError} />
      <form onSubmit={handleSubmit}>
        <InputField
          label="Username"
          type="text"
          val={username}
          setVal={setUsername}
        />
        <InputField
          label="Password"
          type="password"
          val={password}
          setVal={setPassword}
        />
        <Button
          type="submit"
          btn="Sign Up"
        />
      </form>
    </div>
  );
}

export default Login;
