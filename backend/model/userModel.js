import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
    },

    role: {
        type: String,
        default: "student"
    },

    date: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);
export default User;