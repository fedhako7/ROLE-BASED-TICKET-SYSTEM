import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { logout } from '../store/slices/authSlice';

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Fetch tickets when user is available
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

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      const response = await api.put(`/ticket/${ticketId}`, { status }); // Corrected endpoint
      setTickets(tickets.map((t) => (t._id === ticketId ? response.data.ticket : t))); // Adjust based on response
      setError('');
    } catch (error) {
      console.error('Failed to update ticket:', error);
      setError(error.response?.data?.message || 'Failed to update ticket');
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex flex-col justify-between items-center mb-6 sm:flex-row">
        
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <h3 className="text-2xl font-bold">Welcome {user.username}!</h3>
        
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <h3 className="text-xl font-semibold mb-4">All Tickets</h3>
      {error && <p className="italic text-red-800 mb-4">{error}</p>}
      {isLoading ? (
        <div className="text-center">Loading tickets...</div>
      ) : tickets.length !== 0 ? (
        <ul>
          {tickets.map((ticket) => (
            <li
              key={ticket._id}
              className="mb-4 p-4 bg-gray-100 rounded flex justify-between items-center"
            >
              <div>
                <h4 className="font-bold">{ticket.title}</h4>
                <p>{ticket.description}</p>
                <p className="text-sm text-gray-600">Status: {ticket.status}</p>
              </div>
              <select
                value={ticket.status}
                onChange={(e) => handleUpdateStatus(ticket._id, e.target.value)}
                className="p-2 border rounded"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </li>
          ))}
        </ul>
      ) : (
        <div>No tickets available.</div>
      )}
    </div>
  );
}

export default AdminDashboard;
