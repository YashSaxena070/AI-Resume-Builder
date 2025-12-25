import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setToken, getProfile } from '../../redux/userSlice';
import toast from 'react-hot-toast';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      searchParams.get('token') ||
      searchParams.get('accessToken');

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Update Redux state
      dispatch(setToken(token));

      // Fetch user profile
      dispatch(getProfile())
        .unwrap()
        .then(() => {
          toast.success('Login successful!');
          navigate('/');
        })
        .catch((error) => {
          console.error('Failed to fetch profile:', error);
          toast.error('Failed to load user profile');
          navigate('/login');
        });

    } else {
      toast.error('Login failed. No token received.');
      navigate('/login');
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500">Logging in...</div>
    </div>
  );
};

export default OAuthCallback;
