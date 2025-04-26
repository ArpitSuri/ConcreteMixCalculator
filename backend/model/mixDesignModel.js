import mongoose from "mongoose";
const mixDesignSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inputData: {
        type: Object,
        required: true
    },
    resultData: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

 const MixDesign = mongoose.model('MixDesign', mixDesignSchema);
 export default MixDesign;
