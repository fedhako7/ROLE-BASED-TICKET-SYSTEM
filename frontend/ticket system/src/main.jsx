import React, { StrictMode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store/store';
import api from './api/api';
import { setCredentials, logout } from './store/slices/authSlice';
import App from './App';
import './index.css';

// Wrapper component to rehydrate auth state
function AuthInitializer({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rehydrateAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/check');
          dispatch(setCredentials({ user: response.data.user, token }));
        } catch (error) {
          console.error('Failed to rehydrate auth:', error);
          dispatch(logout());
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    rehydrateAuth();
  }, [dispatch]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
