import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Button from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import BackendError from '../components/ui/BackendError';

function Signup() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [backendError, setBackendError] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('auth/sign-up', { name, username, password, role });
      navigate('/login');
    } catch (error) {
      setBackendError(error?.data?.msg || error.message)

      setTimeout(() => {
        setBackendError("")
      }, 3000)
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>

        <InputField
          label={"Name"}
          type={"text"}
          val={name}
          setVal={setName}
        />

        <InputField
          label={"Username"}
          type={"text"}
          val={username}
          setVal={setUsername}
        />

        <InputField
          label={"Password"}
          type={"password"}
          val={password}
          setVal={setPassword}
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
       <BackendError backendError={backendError} />

        <Button
          type="submit"
          btn="Sign Up"
        />

      </form>
    </div>
  );
}


export default Signup;
