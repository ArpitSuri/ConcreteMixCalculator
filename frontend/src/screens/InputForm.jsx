import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MixDesignResult from './ResultScreen';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MixDesignForm = ({ setResultData, setFormDataSend }) => {
    const [formData, setFormData] = useState({
        grade: "M30",
        exposure: "moderate",
        maxAggSize: 20,
        slump: 100,
        aggregateShape: "angular",
        wcrInput: 0.45,
        zone: "Zone II",
        specificGravityCement: 3.15,
        specificGravityFA: 2.65,
        specificGravityCA: 2.7,
        admixturePercent: 1.0,
        volume: 1,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // No token = not logged in
            toast.error('Please login first to access Mix Design Calculator');
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve token from localStorage inside the handleSubmit function
        const authObj = JSON.parse(localStorage.getItem('authToken'));

        if (!authObj || !authObj.token) {
            toast.error('Please login first to access Mix Design Calculator');
            navigate('/login');
            return;
        }

        const authToken = authObj.token;

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/mix/calculate`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            toast.success('Mix Design Calculated Successfully! 🎯');
            setFormDataSend(formData);
            setResultData(res.data.data);
            navigate('/result');
        } catch (error) {
            console.error("Error:", error);
            toast.error('Failed to calculate mix design 😔');
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl border border-amber-100 overflow-hidden">
                <div className="bg-amber-600 p-6 text-white">
                    <h2 className="text-2xl font-bold text-center">Concrete Mix Design Calculator</h2>
                    <p className="text-center text-amber-100 mt-2">Based on IS 10262:2019 guidelines</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Form Inputs */}
                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Grade of Concrete</label>
                            <select
                                name="grade"
                                value={formData.grade}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            >
                                {["M20", "M25", "M30", "M35", "M40", "M45", "M50", "M55", "M60"].map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Exposure Condition</label>
                            <select
                                name="exposure"
                                value={formData.exposure}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            >
                                {["mild", "moderate", "severe", "very severe", "extreme"].map(exp => (
                                    <option key={exp} value={exp}>{exp}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Maximum Aggregate Size (mm)</label>
                            <select
                                name="maxAggSize"
                                value={formData.maxAggSize}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            >
                                {[10, 20, 40].map(size => (
                                    <option key={size} value={size}>{size} mm</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Slump (mm)</label>
                            <input
                                type="number"
                                name="slump"
                                value={formData.slump}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Aggregate Shape</label>
                            <select
                                name="aggregateShape"
                                value={formData.aggregateShape}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            >
                                {["angular", "rounded"].map(shape => (
                                    <option key={shape} value={shape}>{shape}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Water-Cement Ratio</label>
                            <input
                                type="number"
                                step="0.01"
                                name="wcrInput"
                                value={formData.wcrInput}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Zone of Fine Aggregate</label>
                            <select
                                name="zone"
                                value={formData.zone}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            >
                                {["Zone I", "Zone II", "Zone III", "Zone IV"].map(zone => (
                                    <option key={zone} value={zone}>{zone}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Specific Gravity of Cement</label>
                            <input
                                type="number"
                                step="0.01"
                                name="specificGravityCement"
                                value={formData.specificGravityCement}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Specific Gravity of Fine Aggregate</label>
                            <input
                                type="number"
                                step="0.01"
                                name="specificGravityFA"
                                value={formData.specificGravityFA}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Specific Gravity of Coarse Aggregate</label>
                            <input
                                type="number"
                                step="0.01"
                                name="specificGravityCA"
                                value={formData.specificGravityCA}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Admixture Percentage (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="admixturePercent"
                                value={formData.admixturePercent}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-amber-800 font-medium">Volume of Concrete (m³)</label>
                            <input
                                type="number"
                                step="0.1"
                                name="volume"
                                value={formData.volume}
                                onChange={handleChange}
                                className="w-full p-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-amber-500 bg-amber-50"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white mt-8 p-3 rounded-lg font-medium transition duration-300 shadow-sm"
                    >
                        Calculate Mix Design
                    </button>
                </form>

                <div className="bg-amber-50 p-4 border-t border-amber-100 text-center">
                    <p className="text-amber-600 text-sm">
                        This calculator follows IS 10262:2019 guidelines for concrete mix design
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MixDesignForm;