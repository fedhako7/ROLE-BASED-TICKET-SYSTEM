import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { setCredentials } from '../store/slices/authSlice';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import BackendError from '../components/ui/BackendError';
import axiosError from './axiosError';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [backendError, setBackendError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)

    try {
      const response = await api.post('auth/login', { username, password });
      dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('token', response.data.token);
      navigate(response.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      axiosError(`${error?.message}` || 'Login failed', setBackendError)
    } finally {
      setIsLoading(false)
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
          onChange={setUsername}
        />
        <InputField
          label="Password"
          type="password"
          val={password}
          onChange={setPassword}
        />
        <Button
          type="submit"
          btn="Login"
          isLoading={isLoading}
        />
        <p className=' mt-2 text-center'>
          Do not have an account?
          <Link
            to='/signup'
            className=' ml-2 text-blue-800'
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
