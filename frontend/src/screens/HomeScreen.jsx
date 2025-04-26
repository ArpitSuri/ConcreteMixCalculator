import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl bg-white shadow-xl rounded-2xl p-10 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Concrete Mix Design Calculator
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                    Calculate optimal material proportions based on IS 10262:2019 guidelines.
                </p>

                <Link
                    to="/dashboard"
                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-xl transition duration-200"
                >
                    Start Calculation
                </Link>
            </div>

            <footer className="mt-8 text-sm text-gray-500">
                Made by Arpit Suri • IS 10262:2019 Compliant
            </footer>
        </div>
    );
};

export default Homepage;
