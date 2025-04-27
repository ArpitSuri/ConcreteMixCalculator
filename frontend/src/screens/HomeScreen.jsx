import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center px-4">
            <div className="max-w-2xl bg-white shadow-md rounded-2xl overflow-hidden">
                <div className="bg-amber-600 p-8 text-white text-center">
                    <h1 className="text-4xl font-bold mb-2">
                        Concrete Mix Design Calculator
                    </h1>
                    <p className="text-amber-100">
                        Professional Engineering Solutions
                    </p>
                </div>

                <div className="p-10 text-center">
                    <div className="mb-8">
                        <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-amber-700 text-lg mb-6">
                            Calculate optimal material proportions based on IS 10262:2019 guidelines for your construction projects.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Link
                            to="/dashboard"
                            className="inline-block w-full px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white text-lg font-medium rounded-xl transition duration-300 shadow-sm"
                        >
                            Start Calculation
                        </Link>

                        <Link
                            to="/login"
                            className="inline-block text-amber-600 hover:text-amber-800 font-medium"
                        >
                            Already have an account? Login
                        </Link>
                    </div>
                </div>

                <div className="bg-amber-50 p-6 border-t border-amber-100">
                    <div className="flex flex-col md:flex-row justify-between items-center text-amber-700">
                        <p className="text-sm mb-2 md:mb-0">
                            IS 10262:2019 Compliant
                        </p>
                        <p className="text-sm">
                            Made by Arpit Suri
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;