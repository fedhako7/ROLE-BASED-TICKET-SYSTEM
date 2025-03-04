import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/ticket', {
          headers: {
            Authorization: 'Bearer ' + token 
          }
        });
        setTickets(response.data.tickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/ticket', { title, description });
      setTickets([...tickets, response.data.tickets]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to create ticket:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Create a Ticket</h3>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Create Ticket
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">My Tickets</h3>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id} className="mb-4 p-4 bg-gray-100 rounded">
            <h4 className="font-bold">{ticket?.title}</h4>
            <p>{ticket?.description}</p>
            <p className="text-sm text-gray-600">Status: {ticket?.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDashboard;
