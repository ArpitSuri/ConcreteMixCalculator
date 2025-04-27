// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//     name: {
//         type: String,
//     },

//     email: {
//         type: String,
//     },

//     role: {
//         type: String,
//         default: "student"
//     },

//     date: {
//         type: Date,
//         default: Date.now,
//     },
// });

// const User = mongoose.model('User', UserSchema);
// export default User;


import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
        unique: true,  // Ensure the email is unique
    },

    googleId: {
        type: String, // Store the Google user ID for linking the account
        unique: true, // Make sure it's unique
    },

    picture: {
        type: String, // Google profile picture URL
    },

    role: {
        type: String,
        default: "student", // Default role
    },

    date: {
        type: Date,
        default: Date.now, // Date when the user was created
    },
});

// Create the User model based on the schema
const User = mongoose.model('User', UserSchema);

export default User;
