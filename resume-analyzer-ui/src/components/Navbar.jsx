import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated, logout, selectUser, updateUser } from "../redux/userSlice";
import { User, Menu, X, LogOut, FileText, Layout, Home as HomeIcon, Info, Zap, Camera, ChevronDown } from "lucide-react";
import { uploadImage } from "../utils/uploadImage";
import toast from "react-hot-toast";

const Navbar = ({ isScrolled }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsSidebarOpen(false);
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      toast.loading("Uploading image...", { id: "upload" });
      const response = await uploadImage(file);
      
      // Update user in Redux
      dispatch(updateUser({ profileImageUrl: response.imageUrl || response.url }));
      
      toast.success("Profile picture updated!", { id: "upload" });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image", { id: "upload" });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/20 backdrop-blur-lg border-b border-white/20 shadow-lg"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <div className="w-5 h-5 border-2 border-white transform rotate-45" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Currix
            </span>
          </Link>

          {/* Links - Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink href="/#hero">Home</NavLink>
            <NavLink to="/dashboard">Resumes</NavLink>
            <NavLink to="/templates">Templates</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
          </div>

          {/* Auth buttons / Profile */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Desktop Profile Dropdown */}
                <div className="hidden sm:block relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-white/10 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-blue-500/30 group-hover:border-blue-500 transition-colors">
                      {user?.profileImageUrl ? (
                        <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-sm">{user?.name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <span className="text-slate-200 text-sm font-medium hidden lg:block max-w-[150px] truncate">
                      {user?.name || "User"}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {/* User Info Header */}
                      <div className="p-4 border-b border-white/10 bg-slate-800/50">
                        <div className="flex items-center gap-4">
                          <div className="relative group cursor-pointer shrink-0" onClick={triggerFileInput}>
                            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-slate-900 shadow-xl">
                              {user?.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white font-bold text-xl">{user?.name?.charAt(0) || "U"}</span>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Camera size={18} className="text-white" />
                            </div>
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h3 className="text-white font-bold text-base truncate">{user?.name || "User"}</h3>
                            <p className="text-slate-400 text-xs truncate">{user?.email || "user@example.com"}</p>
                            <div className="mt-1.5 inline-flex self-start px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-medium border border-blue-500/20 capitalize">
                              {user?.subscriptionPlan || "Basic"} Plan
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <Layout size={18} />
                          <span>Dashboard</span>
                        </Link>
                        <Link 
                          to="/profile" 
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          <User size={18} />
                          <span>Profile Settings</span>
                        </Link>
                        <div className="h-px bg-white/10 my-1 mx-2" />
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-left"
                        >
                          <LogOut size={18} />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="sm:hidden p-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Menu size={24} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-5 py-2.5 text-sm font-medium rounded-full border border-white/20 text-white hover:bg-white/5 hover:border-blue-500 hover:text-blue-400 transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex px-5 py-2.5 text-sm font-semibold rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          
          {/* Sidebar Panel */}
          <div className="absolute right-0 top-0 h-full w-80 bg-slate-900 border-l border-white/10 shadow-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xl font-bold text-white">Menu</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile User Profile */}
            {isAuthenticated && (
              <div className="mb-8 p-4 bg-slate-800/50 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-2 border-blue-500/30">
                    {user?.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-bold text-lg">{user?.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{user?.name || "User"}</h3>
                    <p className="text-slate-400 text-xs truncate max-w-[150px]">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <HomeIcon size={20} />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/dashboard" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Layout size={20} />
                <span>Resumes</span>
              </Link>
              <Link 
                to="/templates" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <FileText size={20} />
                <span>Templates</span>
              </Link>
              
              {isAuthenticated && (
                <Link 
                  to="/profile" 
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span>Profile</span>
                </Link>
              )}
              
              <Link 
                to="/about" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Info size={20} />
                <span>About</span>
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Zap size={20} />
                <span>Pricing</span>
              </Link>
            </div>

            {isAuthenticated && (
              <div className="pt-6 border-t border-white/10">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Log out</span>
                </button>
              </div>
            )}
            
            {!isAuthenticated && (
              <div className="pt-6 border-t border-white/10 space-y-3">
                <Link 
                  to="/login"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg border border-white/20 text-slate-300 hover:text-white hover:border-white/40 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsSidebarOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const NavLink = ({ to, href, children }) => {
  const content = (
    <>
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full" />
    </>
  );

  const className = "relative group text-slate-300 hover:text-white transition-colors cursor-pointer";

  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
};

export default Navbar;
