import MixDesign from "../model/mixDesignModel.js";

const saveMixDesign = async (req, res) => {
    try {
        const { inputData, resultData } = req.body;
        const userId = req.user.id;

        const newMixDesign = await MixDesign.create({
            user: userId,
            inputData,
            resultData
        });

        res.status(201).json({ success: true, data: newMixDesign });
    } catch (error) {
        console.error("Error saving mix design:", error);
        res.status(500).json({ success: false, message: "Error saving mix design" });
    }
};

const getMyMixDesigns = async (req, res) => {
    try {
        const userId = req.user.id;

        const myMixDesigns = await MixDesign.find({ user: userId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: myMixDesigns });
    } catch (error) {
        console.error("Error fetching mix designs:", error);
        res.status(500).json({ success: false, message: "Error fetching mix designs" });
    }
};

const deleteMixDesign = async (req, res) => {
    try {
        const designId = req.params.id;
        const userId = req.user.id;

        const design = await MixDesign.findById(designId);

        if (!design) {
            return res.status(404).json({ success: false, message: "Mix Design not found" });
        }

        if (design.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this design" });
        }

        await MixDesign.findByIdAndDelete(designId);

        res.status(200).json({ success: true, message: "Mix Design deleted successfully" });
    } catch (error) {
        console.error("Error deleting mix design:", error);
        res.status(500).json({ success: false, message: "Error deleting mix design" });
    }
};



export  { saveMixDesign, getMyMixDesigns , deleteMixDesign };
