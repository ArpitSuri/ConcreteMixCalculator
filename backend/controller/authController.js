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

const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ success: false, message: "Missing authorization code" });
        }

        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        console.log("Google Tokens:", googleRes.tokens); // Debugging

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        console.log("User Info:", userRes.data); // Debugging

        const { email, name } = userRes.data;
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ name, email });
        }

        const { _id } = user;
        const token = jwt.sign({ id: _id, email, role: "student" }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        });

        res.status(200).json({ success: true, token, user });

    } catch (error) {
        console.error("Error while requesting google code:", error);
        res.status(500).json({ success: false, message: "Error while requesting google code" });
    }
};

export  { googleLogin };
