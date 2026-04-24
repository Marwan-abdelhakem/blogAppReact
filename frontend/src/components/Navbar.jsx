import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenSquare, LogOut, Home, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import CreatePostModal from './CreatePostModal';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully.');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Glassmorphism navbar */}
            <nav className="sticky top-0 z-30 w-full border-b border-white/60 backdrop-blur-md bg-white/70 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-15 py-3">

                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-700 transition-colors">
                                <span className="text-white text-sm font-bold">P</span>
                            </div>
                            <span className="font-semibold text-slate-900 text-[15px] tracking-tight">PostApp</span>
                        </Link>

                        {/* Right side */}
                        <div className="flex items-center gap-1.5">
                            {isAuthenticated ? (
                                <>
                                    {/* Nav links */}
                                    <Link
                                        to="/"
                                        className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive('/')
                                                ? 'bg-slate-100 text-slate-900'
                                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Home size={14} />
                                        Home
                                    </Link>

                                    {user?._id && (
                                        <Link
                                            to={`/profile/${user._id}`}
                                            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${location.pathname.startsWith('/profile')
                                                    ? 'bg-slate-100 text-slate-900'
                                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                }`}
                                        >
                                            <User size={14} />
                                            Profile
                                        </Link>
                                    )}

                                    {/* Divider */}
                                    <div className="hidden sm:block w-px h-5 bg-slate-200 mx-1" />

                                    {/* New Post CTA */}
                                    <button
                                        onClick={() => setModalOpen(true)}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        <PenSquare size={13} />
                                        <span className="hidden sm:inline">New Post</span>
                                    </button>

                                    {/* Logout */}
                                    <button
                                        onClick={handleLogout}
                                        title="Logout"
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                    >
                                        <LogOut size={14} />
                                        <span className="hidden sm:inline">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <CreatePostModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};

export default Navbar;
