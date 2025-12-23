import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  clearError,
  clearMessage,
  selectError,
  selectIsLoading,
  selectIsAuthenticated,
} from "../../redux/userSlice";
import { BASE_URL } from "../../utils/apiPaths";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    dispatch(clearMessage());

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    const { confirmPassword, ...payload } = formData;
    try {
      await dispatch(registerUser(payload)).unwrap();
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      // Error is handled by Redux state and displayed in the UI
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">

      {/* --- LEFT SIDE: Image Section --- */}
      {/* Now placed first in the DOM so it appears on the left */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          // New Abstract Image URL
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop"
          alt="Abstract Geometric Waves"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
      </div>

      {/* --- RIGHT SIDE: Form Section --- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative">

        {/* 1. LOGO */}
        <div className="absolute top-5 left-8 md:left-14 lg:left-15 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
          </div>
          <span className="text-xl font-bold text-slate-800">Currix</span>
        </div>

        {/* MAIN CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} // Animation coming from right
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* 2. HEADER */}
          <div className="mb-8 text-left">
            <p className="text-slate-500 text-sm font-medium mb-1">Start your journey</p>
            <h1 className="text-3xl font-bold text-slate-900">
              Sign Up to Currix
            </h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border-l-4 border-red-500 rounded-r-md">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div className="relative group">
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="peer w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-white"
              />
              <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                Full Name
              </label>
              <User className="absolute right-4 top-3.5 text-slate-400 opacity-50 peer-focus:opacity-100 peer-focus:text-blue-600 transition-all" size={20} />
            </div>

            {/* Email */}
            <div className="relative group">
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="peer w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-white"
              />
              <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                E-mail
              </label>
              <Mail className="absolute right-4 top-3.5 text-slate-400 opacity-50 peer-focus:opacity-100 peer-focus:text-blue-600 transition-all" size={20} />
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="peer w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-white"
              />
              <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="peer w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-white"
              />
              <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-blue-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Profile Image URL (Optional) */}
            <div className="relative group">
              <input
                name="profileImageUrl"
                type="url"
                value={formData.profileImageUrl}
                onChange={handleChange}
                placeholder="Profile Image URL"
                className="peer w-full px-4 py-3.5 rounded-lg border border-slate-200 text-slate-900 placeholder-transparent focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all bg-white"
              />
              <label className="absolute left-3 -top-2.5 bg-white px-1 text-sm font-medium text-slate-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                Profile Image URL (Optional)
              </label>
              <Upload className="absolute right-4 top-3.5 text-slate-400 opacity-50 peer-focus:opacity-100 peer-focus:text-blue-600 transition-all" size={20} />
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Social Login Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-400">
                  or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">

              {/* Google */}
              <button
                type="button"
                onClick={() =>
                (window.location.href =
                  `${BASE_URL}/oauth2/authorization/google`)
                }
                className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() =>
                (window.location.href =
                  `${BASE_URL}/oauth2/authorization/github`)
                }
                className="flex items-center justify-center py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <svg
                  className="h-6 w-6 text-slate-900"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.419-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </button>

            </div>
          </div>


        </motion.div>

        {/* 3. FOOTER */}
        <div className="absolute bottom-6 left-8 md:left-16 lg:left-24 text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Register;
