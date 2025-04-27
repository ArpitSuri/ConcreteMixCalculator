import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../api"; // Your backend API call to /auth/google
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleLogin = () => {
    const navigate = useNavigate();

    const responseGoogle = async (authResult) => {
        try {
            if (authResult.code) {
                // Before calling backend: clear any old login
                localStorage.removeItem("authToken");

                const res = await googleAuth(authResult.code);
                const { token, user } = res.data;
                const { email, name, role, picture } = user;

                const userData = { email, name, role, picture, token };
                localStorage.setItem("authToken", JSON.stringify(userData));

                toast.success(`Welcome, ${name}!`);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            toast.error("Login failed. Please try again.");
        }
    };


    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (err) => console.error("Google Login Error:", err),
        flow: "auth-code",
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-amber-50">
            <div className="bg-white p-10 rounded-xl shadow-md border border-amber-100 text-center space-y-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-amber-800">Welcome Back</h1>
                <p className="text-amber-600 mb-6">Login to access your mix designs</p>

                <button
                    onClick={googleLogin}
                    className="flex items-center justify-center gap-4 px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition duration-300 shadow-sm w-full"
                >
                    <svg
                        className="w-6 h-6"
                        viewBox="0 0 488 512"
                        fill="white"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M488 261.8C488 403.3 391.7 496 248.5 496 109.3 496 0 386.7 0 247.5 0 108.3 109.3-1 248.5-1c66.3 0 120.6 24.5 162.5 64.7l-65.8 63.2C317.1 84.6 286.4 72 248.5 72c-96.2 0-174.2 77.9-174.2 175.5S152.3 423 248.5 423c88.2 0 143-50.9 148.9-122.5H248.5V261.8h239.5z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="pt-4 border-t border-amber-100">
                    <p className="text-amber-500 text-sm">Safe, Secure and Fast Login</p>
                </div>

                <div className="mt-8 text-sm text-amber-600">
                    <p>Powered by IS 10262:2019 Concrete Mix Design</p>
                </div>
            </div>
        </div>
    );
};

export default GoogleLogin;