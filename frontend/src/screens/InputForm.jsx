import React, { useState , useEffect } from 'react';
import axios from 'axios';
import MixDesignResult from './ResultScreen';
import { useNavigate } from 'react-router-dom';
import { toast }from 'react-hot-toast';

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
    const navigate=useNavigate();


    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            // No token = not logged in
            toast.error('Please login first to access Mix Design Calculator '); // <-- THIS LINE
            navigate('/login'); // Redirect to login
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
        const authObj = JSON.parse(localStorage.getItem('authToken'));  // Parse the object

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
                        Authorization: `Bearer ${authToken}`,  // Use the authToken here
                    },
                }
            );

            toast.success('Mix Design Calculated Successfully! 🎯');
            setFormDataSend(formData);    // 🆕 Save the input also
            setResultData(res.data.data);
            navigate('/result');
        } catch (error) {
            console.error("Error:", error);
            toast.error('Failed to calculate mix design 😔');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
            <h2 className="text-2xl font-bold text-center mb-6">Concrete Mix Design Calculator</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form Inputs */}

                <div>
                    <label>Grade of Concrete</label>
                    <select name="grade" value={formData.grade} onChange={handleChange} className="input">
                        {["M20", "M25", "M30", "M35", "M40", "M45", "M50", "M55", "M60"].map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Exposure Condition</label>
                    <select name="exposure" value={formData.exposure} onChange={handleChange} className="input">
                        {["mild", "moderate", "severe", "very severe", "extreme"].map(exp => (
                            <option key={exp} value={exp}>{exp}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Maximum Aggregate Size (mm)</label>
                    <select name="maxAggSize" value={formData.maxAggSize} onChange={handleChange} className="input">
                        {[10, 20, 40].map(size => (
                            <option key={size} value={size}>{size} mm</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Slump (mm)</label>
                    <input type="number" name="slump" value={formData.slump} onChange={handleChange} className="input" />
                </div>

                <div>
                    <label>Aggregate Shape</label>
                    <select name="aggregateShape" value={formData.aggregateShape} onChange={handleChange} className="input">
                        {["angular", "rounded"].map(shape => (
                            <option key={shape} value={shape}>{shape}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Water-Cement Ratio</label>
                    <input type="number" step="0.01" name="wcrInput" value={formData.wcrInput} onChange={handleChange} className="input" />
                </div>

                <div>
                    <label>Zone of Fine Aggregate</label>
                    <select name="zone" value={formData.zone} onChange={handleChange} className="input">
                        {["Zone I", "Zone II", "Zone III", "Zone IV"].map(zone => (
                            <option key={zone} value={zone}>{zone}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Specific Gravity of Cement</label>
                    <input type="number" step="0.01" name="specificGravityCement" value={formData.specificGravityCement} onChange={handleChange} className="input" />
                </div>

                <div>
                    <label>Specific Gravity of Fine Aggregate</label>
                    <input type="number" step="0.01" name="specificGravityFA" value={formData.specificGravityFA} onChange={handleChange} className="input" />
                </div>

                <div>
                    <label>Specific Gravity of Coarse Aggregate</label>
                    <input type="number" step="0.01" name="specificGravityCA" value={formData.specificGravityCA} onChange={handleChange} className="input" />
                </div>

                <div>
                    <label>Admixture Percentage (%)</label>
                    <input type="number" step="0.1" name="admixturePercent" value={formData.admixturePercent} onChange={handleChange} className="input" />
                </div>

                <div>
                    <label>Volume of Concrete (m³)</label>
                    <input type="number" step="0.1" name="volume" value={formData.volume} onChange={handleChange} className="input" />
                </div>

            </form>

            <button type="submit" onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 p-2 rounded-lg">
                Calculate Mix Design
            </button>

            {/* Results Display */}
            {/* {result && (
                <MixDesignResult result={result} />
            )} */}
        </div>
    );
};

export default MixDesignForm;
