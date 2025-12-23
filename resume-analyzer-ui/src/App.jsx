import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './redux/userSlice';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import OAuthCallback from './pages/Auth/OAuthCallback';
import Dashboard from './pages/Home/Dashboard';
import Home from './pages/Home/Home';
import Templates from './pages/Home/Templates';
import Pricing from './pages/Home/Pricing';
import About from './pages/Home/About';
import EditResume from './pages/ResumeUpdate/EditResume';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import Layout from './components/Layout';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getProfile } from './redux/userSlice';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/oauth/callback"
        element={
          <PublicRoute>
            <OAuthCallback />
          </PublicRoute>
        }
      />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analyze"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />
        <Route path="/templates" element={<Templates />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route
        path="/resume/:id"
        element={
          <ProtectedRoute>
            <EditResume />
          </ProtectedRoute>
        }
      />
      </Routes>
    </>
  );
}

export default App;
