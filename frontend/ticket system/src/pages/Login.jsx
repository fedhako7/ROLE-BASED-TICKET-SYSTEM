import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { setCredentials } from '../store/slices/authSlice';
import InputField from '../components/ui/InputField';
import Button from '../components/ui/Button';
import LogError from '../components/ui/BackendError'; // Assuming this is in src/components

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation functions
  const validateUsername = (value) => {
    if (!value) return 'Username is required';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return alert('Password is required');
    if (value.length < 6) return alert('Password must be at least 6 characters ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
      });
      return;
    }

    try {
      const response = await api.post('auth/login', { username, password });
      dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
      localStorage.setItem('token', response.data.token);
      navigate(response.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setErrors({ api: error.response?.data?.message || 'Login failed' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <LogError backendError={errors.api} />
      <form onSubmit={handleSubmit}>
        <InputField
          label="Username"
          type="text"
          val={username}
          setVal={setUsername}
          error={errors.username}
        />
        <InputField
          label="Password"
          type="password"
          val={password}
          setVal={setPassword}
          error={errors.password}
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
