import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import BackendError from '../components/ui/BackendError';
import axiosError from './axiosError';

function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [role, setRole] = useState('user');
  const [backendError, setBackendError] = useState('')
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();


  const handleNameChange = (val) => {
    setName(val);
    setNameError(
      !/^[a-zA-Z]+$/.test(val) ? 'Only letters allowed' :
      val.length < 2 ? 'Too short' : ''
    );
  };

  const handleUsernameChange = (val) => {
    setUsername(val);
    setUsernameError(
      !/^[a-zA-Z0-9_-]+$/.test(val) ? 'Only letters, numbers, - or _ allowed' :
      val.length < 3 ? 'Too short' : ''
    );
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    setPasswordError(val.length < 6 ? 'Too short' : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || usernameError || nameError) {
      return axiosError("Fix errors before submitting.", setBackendError);
    }

    setIsLoading(true)
    try {
      await api.post('auth/sign-up', { name, username, password, role });
      navigate('/login');
    } catch (error) {
      axiosError(`${error?.message}` || 'Sign up failed', setBackendError)
      console.error('Signup failed:', error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="max-w-md bg-gray-200 mx-auto mt-20 mb-6 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <BackendError backendError={backendError} />
      <form onSubmit={handleSubmit}>

        <InputField
          label={"Name"}
          type={"text"}
          val={name}
          onChange={handleNameChange}
          error={nameError}
        />

        <InputField
          label={"Username"}
          type={"text"}
          val={username}
          onChange={handleUsernameChange}
          error={usernameError}
        />

        <InputField
          label={"Password"}
          type={"password"}
          val={password}
          onChange={handlePasswordChange}
          error={passwordError}
        />


        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button
          type="submit"
          btn="Sign Up"
          isLoading={isLoading}
        />
        <p className=' mt-2 text-center'>
          Already have an account?
          <Link
            to='/login'
            className=' ml-2 text-blue-800'
          >
            Login
          </Link>
        </p>
      </form>
    </div >
  );
}


export default Signup;
