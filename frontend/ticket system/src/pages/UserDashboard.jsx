import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { logout } from '../store/slices/authSlice';

function UserDashboard() {
  const [tickets, setTickets] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return; // Wait for rehydration

    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/ticket'); 
        setTickets(response.data.tickets); 
        setError('');
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        setError(error.response?.data?.message || 'Failed to fetch tickets');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/ticket', { title, description }); 
      setTickets([...tickets, response.data.ticket]); 
      setTitle('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setError(error.response?.data?.message || 'Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Show loading state during rehydration
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl bg-gray-200 mx-auto mt-10 mb-6 p-6 rounded-lg shadow-md">
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
        {error && <p className="italic text-red-800 mb-4">{error}</p>}
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
        <button
          disabled={isLoading}
          type="submit"
          className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 
            ${isLoading ? 'cursor-not-allowed' : 'hover:bg-blue-800'}`}
        >
          {isLoading ? 'Please wait...' : 'Create Ticket'}
        </button>
      </form>
      <h3 className="text-xl font-semibold mb-4">My Tickets</h3>
      {isLoading ? (
        <div className="text-center">Loading tickets...</div>
      ) : tickets.length !== 0 ? (
        <ul>
          {tickets.map((ticket, index) => (
            <li key={index} className="mb-4 p-4 bg-gray-100 rounded">
              <h4 className="font-bold">{ticket?.title}</h4>
              <p>{ticket?.description}</p>
              <p className="text-sm text-gray-600">Status: {ticket?.status}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>Create tickets to see them here.</div>
      )}
    </div>
  );
}

export default UserDashboard;
