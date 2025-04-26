// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//     const [userInfo, setUserInfo] = useState({});
//     const navigate = useNavigate(); // ✅ Use useNavigate hook

//     useEffect(() => {
//         const user = JSON.parse(localStorage.getItem("authToken"));
//         setUserInfo(user);
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem("authToken");
//         navigate("/login"); // ✅ Correct way to navigate
//     };

//     return (
//         <div>
//             <h1>Welcome {userInfo?.name}</h1>
//             <h2>Email: {userInfo?.email}</h2>
//             <h3>Role: {userInfo?.role}</h3>
//             <button onClick={handleLogout}> Logout</button>
//         </div>
//     );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';

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
            toast.error('Please login first to access Dashboard'); // <-- THIS LINE
            navigate('/login');
        }
    }, [navigate]);

        const handleLogout = () => {
            localStorage.removeItem("authToken");
            toast.success("Logged out successfully!");
            navigate("/login"); // ✅ Correct way to navigate
        };

    const handleStartMixDesign = () => {
        navigate('/input'); // Navigate to mix design calculator (home page)
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center space-y-6">
                {user ? (
                    <>
                        <h1 className="text-3xl font-bold text-gray-700">
                            Welcome, {user.name}! 🎉
                        </h1>
                        <p className="text-gray-500">Role: {user.role}</p>
                        <button
                            onClick={handleStartMixDesign}
                            className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
                        >
                            Start New Mix Design
                        </button>

                        <button
                            onClick={() => navigate('/my-designs')}
                            className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg"
                        >
                            View My Designs
                        </button>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
