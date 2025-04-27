import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const MixDesignResult = ({ formDataSend, result }) => {
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);

    if (!result) {
        return (
            <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md border border-amber-100 text-center max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-6">No Result Found</h2>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-medium transition duration-300 shadow-sm"
                    >
                        Start New Mix Design
                    </button>
                </div>
            </div>
        );
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
                    inputData: formDataSend,
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
        <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full mx-auto p-8 bg-white shadow-md rounded-xl border border-amber-100">
                <h2 className="text-2xl font-bold text-center text-amber-800 mb-8 pb-2 border-b border-amber-100">
                    Concrete Mix Design Results
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                        <div className="text-center mb-4">
                            <span className="inline-block p-2 bg-amber-100 rounded-full mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </span>
                            <h3 className="font-semibold text-amber-800">Target Strength</h3>
                        </div>
                        <p className="text-2xl font-bold text-center text-amber-700">{targetStrength} MPa</p>
                    </div>

                    <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
                        <div className="text-center mb-4">
                            <span className="inline-block p-2 bg-amber-100 rounded-full mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </span>
                            <h3 className="font-semibold text-amber-800">Cement Required</h3>
                        </div>
                        <p className="text-2xl font-bold text-center text-amber-700">{cementContent} kg</p>
                        <p className="text-center text-amber-600">({cementBags} bags of 50 kg)</p>
                    </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 mb-8">
                    <h3 className="font-semibold text-amber-800 mb-4 pb-2 border-b border-amber-100">Material Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-700">
                        <div>
                            <strong>💧 Water Required:</strong> {waterContent} liters
                        </div>
                        <div>
                            <strong>🪨 Fine Aggregate:</strong> {fineAggregateMass} kg
                        </div>
                        <div>
                            <strong>🪨 Coarse Aggregate:</strong> {coarseAggregateMass} kg
                        </div>
                        <div>
                            <strong>🧪 Admixture:</strong> {admixtureWeight} kg
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg border border-amber-100 mb-8 text-center">
                    <h3 className="font-semibold text-amber-800 mb-2">Final Mix Ratio</h3>
                    <p className="text-2xl font-bold text-amber-700">{`1 : ${mixRatio.fineAggregate} : ${mixRatio.coarseAggregate}`}</p>
                </div>

                <div className="text-center space-y-4">
                    {!isSaved && (
                        <button
                            onClick={handleSaveMixDesign}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-sm"
                        >
                            Save This Mix Design
                        </button>
                    )}
                    {isSaved && (
                        <div className="text-green-600 font-semibold py-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Saved Successfully! 🎯
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-4 bg-amber-600 hover:bg-amber-700 text-white py-3 px-8 rounded-lg font-medium transition duration-300 shadow-sm"
                    >
                        Start New Mix Design
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MixDesignResult;