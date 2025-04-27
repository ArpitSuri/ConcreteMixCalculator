import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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


    const handleDownloadPdf = async () => {
        const element = pdfRef.current;
        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Concrete_Mix_Design.pdf');
    };

    const handleDelete = async (id) => {
        console.log(id)
        const confirmDelete = window.confirm("Are you sure you want to delete this Mix Design?");
        if (!confirmDelete) return;

        try {
            const authData = JSON.parse(localStorage.getItem('authToken'));

            await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/mix-design/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${authData.token}`
                }
            });

            // Remove deleted design from UI
            setMixDesigns((prev) => prev.filter((design) => design._id !== id));

            toast.success("Mix Design Deleted Successfully!");
        } catch (error) {
            console.error("Error deleting mix design:", error);
            toast.error("Failed to delete mix design");
        }
    };

    return (
        <div className="min-h-screen bg-amber-50 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-8 border border-amber-100">
                <h1 className="text-3xl font-bold text-center mb-8 text-amber-800">My Saved Mix Designs</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-4 bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-lg font-medium transition duration-300 shadow-sm"
                >
                    Start New Mix Design
                </button>

                {mixDesigns.length === 0 ? (
                    <div className="text-center mt-16 mb-16 py-12 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-amber-700 text-lg">No mix designs found. Start a new one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        {mixDesigns.map((design) => (
                            <div key={design._id} className="p-6 bg-amber-50 shadow-sm rounded-xl border border-amber-100 hover:shadow-md transition duration-300">
                                <h2 className="text-xl font-bold text-amber-800 border-b border-amber-200 pb-2 mb-4">{design.resultData.grade} Mix Design</h2>
                                <p className="text-amber-700 mb-4"><strong>Date:</strong> {new Date(design.createdAt).toLocaleDateString()}</p>

                                {/* Display Input Data */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-100 pb-1 mb-2">Input Data</h3>
                                    <div className="grid grid-cols-2 gap-2 text-amber-700">
                                        <p><strong>Exposure:</strong> {design.inputData?.exposure || "NA"}</p>
                                        <p><strong>Max Agg Size:</strong> {design.inputData?.maxAggSize || "NA"} mm</p>
                                        <p><strong>Slump:</strong> {design.inputData?.slump || "NA"} mm</p>
                                        <p><strong>Aggregate Shape:</strong> {design.inputData?.aggregateShape || "NA"}</p>
                                        <p><strong>Water-Cement Ratio:</strong> {design.inputData?.wcrInput || "NA"}</p>
                                        <p><strong>Zone:</strong> {design.inputData?.zone || "NA"}</p>
                                        <p><strong>SG of Cement:</strong> {design.inputData?.specificGravityCement || "NA"}</p>
                                        <p><strong>SG of FA:</strong> {design.inputData?.specificGravityFA || "NA"}</p>
                                        <p><strong>SG of CA:</strong> {design.inputData?.specificGravityCA || "NA"}</p>
                                        <p><strong>Admixture %:</strong> {design.inputData?.admixturePercent || "NA"} %</p>
                                        <p><strong>Volume:</strong> {design.inputData?.volume || "NA"} m³</p>
                                    </div>
                                </div>

                                {/* Display Result Data */}
                                <div className="bg-white p-4 rounded-lg border border-amber-100">
                                    <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-100 pb-1 mb-2">Result Data</h3>
                                    <div className="grid grid-cols-2 gap-2 text-amber-700">
                                        <p><strong>Target Strength:</strong> {design.resultData.targetStrength || "NA"} MPa</p>
                                        <p><strong>Cement Content:</strong> {design.resultData.cementContent || "NA"} kg</p>
                                        <p><strong>Cement Bags:</strong> {design.resultData.cementBags || "NA"} bags</p>
                                        <p><strong>Water Content:</strong> {design.resultData.waterContent || "NA"} liters</p>
                                        <p><strong>Fine Aggregate:</strong> {design.resultData.fineAggregateMass || "NA"} kg</p>
                                        <p><strong>Coarse Aggregate:</strong> {design.resultData.coarseAggregateMass || "NA"} kg</p>
                                        <p><strong>Admixture Weight:</strong> {design.resultData.admixtureWeight || "NA"} kg</p>
                                        <p><strong>Mix Ratio:</strong> 1 : {design.resultData.mixRatio.fineAggregate || "NA"} : {design.resultData.mixRatio.coarseAggregate || "NA"}</p>
                                    </div>
                                </div>
                                {/* Download PDF Button */}
                                <button
                                    onClick={handleDownloadPdf}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg"
                                >
                                    Download as PDF
                                </button>
                                <button
                                    onClick={() => handleDelete(design._id)}
                                    className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition duration-300 shadow-sm"
                                >
                                    Delete Design
                                </button>
                                
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDesigns;