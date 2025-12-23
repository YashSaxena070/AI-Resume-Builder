import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginUser,
  selectIsLoading,
  selectIsAuthenticated,
  selectError,
  clearError,
} from "../../redux/userSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      
      {/* --- LEFT SIDE: Form Section --- */}
      {/* Added 'relative' to allow positioning the Logo and Footer absolutely */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative">
        
        {/* 1. LOGO: Updated to Currix & Aligned Left */}
        <div className="absolute top-8 left-8 md:left-16 lg:left-17 flex items-center gap-2">
           <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
             <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
           </div>
           <span className="text-xl font-bold text-slate-800">Currix</span>
        </div>

        {/* MAIN CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md" 
          // Removed 'mx-auto' so it stays left-aligned with the logo
        >
          {/* 2. HEADER: Updated text & strict left alignment */}
          <div className="mb-10 text-left">
            <h1 className="text-3xl font-bold text-slate-900">
              Sign In to Currix
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-500 rounded-r-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                E-mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or username"
                  className="w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-0 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
                <Mail className="absolute right-4 top-3.5 text-slate-400 opacity-0 group-focus-within:opacity-100 transition-opacity" size={20} />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400">or sign in with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              
              {/* Google */}
              <button 
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/google'}
                className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>

              {/* GitHub */}
              <button 
                type="button"
                onClick={() => window.location.href = 'http://localhost:8080/oauth2/authorization/github'}
                className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <svg className="h-6 w-6 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </button>
            </div>
          </div>

        </motion.div>

        {/* 3. FOOTER: Absolute Bottom Left alignment (matches image) */}
        <div className="absolute bottom-6 left-8 md:left-16 lg:left-24 text-sm text-slate-500">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </Link>
        </div>

      </div>

      {/* --- RIGHT SIDE: Image Section --- */}
      <div className="hidden md:block md:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
          alt="Abstract Fluid Art"
          className="w-full h-full object-cover"
        />
        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay"></div>
      </div>

    </div>
  );
};

export default Login;