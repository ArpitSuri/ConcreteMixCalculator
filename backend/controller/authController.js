// const { oauth2Client } = require("../config/googleConfig.js");
// const Test = require("../models/testModel");
// const jwt = require("jsonwebtoken");
// const axios = require("axios");
// const dotenv = require("dotenv");
import { oauth2Client } from "../config/googleConfig.js";
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv"


dotenv.config();

// const googleLogin = async (req, res) => {
//     try {
//         const { code } = req.query;

//         if (!code) {
//             return res.status(400).json({ success: false, message: "Missing authorization code" });
//         }

//         const googleRes = await oauth2Client.getToken(code);
//         oauth2Client.setCredentials(googleRes.tokens);

//         console.log("Google Tokens:", googleRes.tokens); // Debugging

//         const userRes = await axios.get(
//             `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
//         );

//         console.log("User Info:", userRes.data); // Debugging

//         const { email, name } = userRes.data;
//         let user = await User.findOne({ email });

//         if (!user) {
//             user = await User.create({ name, email });
//         }

//         const { _id } = user;
//         const token = jwt.sign({ id: _id, email, role: "student" }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN || "1d",
//         });

//         res.status(200).json({ success: true, token, user });

//     } catch (error) {
//         console.error("Error while requesting google code:", error);
//         res.status(500).json({ success: false, message: "Error while requesting google code" });
//     }
// };



const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ success: false, message: "Missing authorization code" });
        }

        // Get tokens using authorization code
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        // Get user information from Google (use OpenID endpoint)
        const userRes = await axios.get(
            `https://openidconnect.googleapis.com/v1/userinfo?access_token=${googleRes.tokens.access_token}`
        );

        console.log("User Info:", userRes.data);

        // Extract the necessary user info
        const { email, name, sub: googleId, picture } = userRes.data;

        if (!email) {
            return res.status(400).json({ success: false, message: "No email found from Google" });
        }

        // Check if user exists by email (email is safest and unique)
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                picture,
                role: 'student', // or default
                createdVia: 'google' // optional
            });
        } else {
            // Update googleId if not saved before
            if (!user.googleId) {
                user.googleId = googleId;
            }
            user.picture = picture;
            await user.save();
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
        );

        // Send back the response with token and user info
        res.status(200).json({ success: true, token, user });

    } catch (error) {
        console.error("Error during Google Login:", error);
        res.status(500).json({ success: false, message: "Google login failed" });
    }
};




export  { googleLogin };
