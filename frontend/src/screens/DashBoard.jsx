import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const authData = localStorage.getItem('authToken');
        if (authData) {
            const parsed = JSON.parse(authData);
            setUser(parsed);
        } else {
            // No token? redirect to login
            toast.error('Please login first to access Dashboard');
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        toast.success("Logged out successfully!");
        navigate("/login");
    };

    const handleStartMixDesign = () => {
        navigate('/input');
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-amber-50">
            <div className="bg-white p-10 rounded-xl shadow-md border border-amber-100 text-center space-y-8 w-full max-w-md">
                {user ? (
                    <>
                        <div className="mb-8">
                            <div className="inline-block p-4 bg-amber-100 rounded-full mb-4">
                                {/* Display user's Google profile image */}
                                <img
                                    src={user.picture}
                                    alt="User Profile"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                            </div>
                            <h1 className="text-3xl font-bold text-amber-800">
                                Welcome, {user.name}! 🎉
                            </h1>
                            <p className="text-amber-600 mt-2">Role: {user.role}</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handleStartMixDesign}
                                className="w-full px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition duration-300 shadow-sm"
                            >
                                Start New Mix Design
                            </button>

                            <button
                                onClick={() => navigate('/my-designs')}
                                className="w-full px-6 py-4 bg-white border border-amber-300 hover:bg-amber-50 text-amber-800 font-semibold rounded-lg transition duration-300 shadow-sm"
                            >
                                View My Designs
                            </button>

                            <button
                                onClick={handleLogout}
                                className="mt-6 text-amber-600 hover:text-amber-800 font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-pulse flex space-x-4">
                            <div className="rounded-full bg-amber-200 h-12 w-12"></div>
                            <div className="flex-1 space-y-4 py-1">
                                <div className="h-4 bg-amber-200 rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-amber-200 rounded"></div>
                                    <div className="h-4 bg-amber-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
