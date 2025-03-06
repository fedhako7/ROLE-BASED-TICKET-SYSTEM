import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '../api/api';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/ticket');
        setTickets(response.data.tickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      }
    };
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId, status) => {
    try {
      const response = await api.put(`/ticket/${ticketId}`, { status });
      setTickets(tickets.map((t) => (t._id === ticketId ? response.data.ticket : t)));
    } catch (error) {
      console.error('Failed to update ticket:', error);
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
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <h3 className="text-xl font-semibold mb-4">All Tickets</h3>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket._id} className="mb-4 p-4 bg-gray-100 rounded flex justify-between items-center">
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
    </div>
  );
}

export default AdminDashboard;
