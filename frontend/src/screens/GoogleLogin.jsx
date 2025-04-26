import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../../api"; // Your backend API call to /auth/google
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const GoogleLogin = () => {
    const navigate = useNavigate();

    const responseGoogle = async (authResult) => {
        try {
            if (authResult["code"]) {
                const result = await googleAuth(authResult["code"]);
                const { email, name, role } = result.data.user;
                const token = result.data.token;
                const obj = { email, name, role, token };
                localStorage.setItem("authToken", JSON.stringify(obj));
                toast.success("Logged in successfully!");
                navigate("/dashboard");
            }
        } catch (error) {
            console.error(`Error while requesting Google code:`, error);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (err) => console.error("Google Login Error:", err),
        flow: "auth-code",
    });

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-xl shadow-lg text-center space-y-6">
                <h1 className="text-2xl font-bold text-gray-700">Login to Your Account</h1>
                <button
                    onClick={googleLogin}
                    className="flex items-center justify-center gap-4 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition duration-300"
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
                <p className="text-gray-400 text-sm">Safe, Secure and Fast Login</p>
            </div>
        </div>
    );
};

export default GoogleLogin;
