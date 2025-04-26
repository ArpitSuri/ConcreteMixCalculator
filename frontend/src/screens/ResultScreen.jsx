import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MixDesignResult = ({ formDataSend, result }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);


    if (!result) {
        return <div className="text-center mt-20">
            <h2 className="text-2xl font-bold text-red-600">No Result Found</h2>
            <button
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
                Start New Mix Design
            </button>
        </div>;
    }

    const handleSaveMixDesign = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('authToken'));
            if (!authData || !authData.token) {
                toast.error('Please login first to save mix design');
                navigate('/login');
                return;
            }

            console.log("Saving mix design with data:", formDataSend, result);

            await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/mix-design/save`,
                {
                    inputData: formDataSend,    // We'll discuss this below
                    resultData: result
                },
                {
                    headers: {
                        Authorization: `Bearer ${authData.token}`
                    }
                }
            );

            toast.success('Mix Design Saved Successfully! 🎯');
            setIsSaved(true);
        } catch (error) {
            console.error("Error saving mix design:", error);
            toast.error('Failed to save mix design');
        }
    };

    const {
        targetStrength,
        cementContent,
        cementBags,
        waterContent,
        fineAggregateMass,
        coarseAggregateMass,
        admixtureWeight,
        mixRatio
    } = result;


    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl flex items-center justify-center flex-col ">

            <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
                Concrete Mix Design Results
            </h2>

            <div className="space-y-4 text-gray-700 text-lg">

                <div>
                    <strong>🎯 Target Mean Strength:</strong> {targetStrength} MPa
                </div>

                <div>
                    <strong>🏗 Cement Required:</strong> {cementContent} kg ({cementBags} bags of 50 kg)
                </div>

                <div>
                    <strong>💧 Water Required:</strong> {waterContent} liters
                </div>

                <div>
                    <strong>🪨 Fine Aggregate Required:</strong> {fineAggregateMass} kg
                </div>

                <div>
                    <strong>🪨 Coarse Aggregate Required:</strong> {coarseAggregateMass} kg
                </div>

                <div>
                    <strong>🧪 Admixture:</strong> {admixtureWeight} kg
                </div>

                <div>
                    <strong>🧮 Final Mix Ratio:</strong> {`1 : ${mixRatio.fineAggregate} : ${mixRatio.coarseAggregate}`}
                </div>

            </div>
            {/* Save Mix Design Button */}
            <div className="text-center mt-8 space-y-4">
                {!isSaved && (
                    <button
                        onClick={handleSaveMixDesign}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
                    >
                        Save This Mix Design
                    </button>
                )}
                {isSaved && (
                    <div className="text-green-600 font-semibold">Saved Successfully! 🎯</div>
                )}
            
            <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
                Start New Mix Design
            </button>
            </div>
        </div>
    );
};

export default MixDesignResult;
