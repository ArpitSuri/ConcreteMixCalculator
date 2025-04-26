import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyDesigns = () => {
    const [mixDesigns, setMixDesigns] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDesigns = async () => {
            const authData = JSON.parse(localStorage.getItem('authToken'));
            if (!authData || !authData.token) {
                token.error('Please login first to access your saved designs');
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/mix-design/my-designs`, {
                    headers: {
                        Authorization: `Bearer ${authData.token}`
                    }
                });

                setMixDesigns(res.data.data);
            } catch (error) {
                console.error("Error fetching mix designs:", error);
                toast.error('Failed to fetch mix designs. Please try again later.');
                navigate('/login');
            }
        };

        fetchDesigns();
    }, [navigate]);
    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">My Saved Mix Designs</h1>
            <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
                Start New Mix Design
            </button>

            {mixDesigns.length === 0 ? (
                <p className="text-center text-gray-500">No mix designs found. Start a new one!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mixDesigns.map((design) => (
                        <div key={design._id} className="p-6 bg-white shadow-md rounded-xl space-y-4">
                            <h2 className="text-xl font-bold text-gray-700">{design.resultData.grade} Mix Design</h2>
                            <p className="text-gray-600"><strong>Date:</strong> {new Date(design.createdAt).toLocaleDateString()}</p>

                            {/* Display Input Data */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Input Data</h3>
                                <p><strong>Exposure:</strong> {design.inputData?.exposure || "NA"}</p>
                                <p><strong>Max Agg Size:</strong> {design.inputData?.maxAggSize || "NA"} mm</p>
                                <p><strong>Slump:</strong> {design.inputData?.slump || "NA"} mm</p>
                                <p><strong>Aggregate Shape:</strong> {design.inputData?.aggregateShape || "NA"}</p>
                                <p><strong>Water-Cement Ratio:</strong> {design.inputData?.wcrInput || "NA"}</p>
                                <p><strong>Zone:</strong> {design.inputData?.zone || "NA"}</p>
                                <p><strong>Specific Gravity of Cement:</strong> {design.inputData?.specificGravityCement || "NA"}</p>
                                <p><strong>Specific Gravity of FA:</strong> {design.inputData?.specificGravityFA || "NA"}</p>
                                <p><strong>Specific Gravity of CA:</strong> {design.inputData?.specificGravityCA || "NA"}</p>
                                <p><strong>Admixture Percent:</strong> {design.inputData?.admixturePercent || "NA"} %</p>
                                <p><strong>Volume:</strong> {design.inputData?.volume || "NA"} m³</p>
                            </div>

                            {/* Display Result Data */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Result Data</h3>
                                <p><strong>Target Strength:</strong> {design.resultData.targetStrength || "NA"} MPa</p>
                                <p><strong>Cement Content:</strong> {design.resultData.cementContent || "NA"} kg</p>
                                <p><strong>Cement Bags:</strong> {design.resultData.cementBags || "NA"} bags</p>
                                <p><strong>Water Content:</strong> {design.resultData.waterContent || "NA"} liters</p>
                                <p><strong>Fine Aggregate Mass:</strong> {design.resultData.fineAggregateMass || "NA"} kg</p>
                                <p><strong>Coarse Aggregate Mass:</strong> {design.resultData.coarseAggregateMass || "NA"} kg</p>
                                <p><strong>Admixture Weight:</strong> {design.resultData.admixtureWeight || "NA"} kg</p>
                                <p><strong>Mix Ratio:</strong> 1 : {design.resultData.mixRatio.fineAggregate || "NA"} : {design.resultData.mixRatio.coarseAggregate || "NA"}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

};

export default MyDesigns;
