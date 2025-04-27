import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MyDesigns = () => {
    const [mixDesigns, setMixDesigns] = useState([]);
    const navigate = useNavigate();
    const pdfRefs = useRef({}); // Store multiple refs for each design

    useEffect(() => {
        const fetchDesigns = async () => {
            const authData = JSON.parse(localStorage.getItem('authToken'));
            if (!authData?.token) {
                toast.error('Please login first to access your saved designs');
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/mix-design/my-designs`, {
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
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

    const handleDownloadPdf = async (id) => {
        const element = pdfRefs.current[id];
        if (!element) return;

        const canvas = await html2canvas(element);
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Concrete_Mix_Design.pdf');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Mix Design?")) return;

        try {
            const authData = JSON.parse(localStorage.getItem('authToken'));
            await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASE_URL}/api/mix-design/delete/${id}`, {
                headers: { Authorization: `Bearer ${authData.token}` },
            });

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

                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-amber-600 hover:bg-amber-700 text-white py-2 px-6 rounded-lg font-medium transition duration-300 shadow-sm"
                    >
                        Start New Mix Design
                    </button>
                </div>

                {mixDesigns.length === 0 ? (
                    <div className="text-center py-20 bg-amber-50 rounded-lg border border-amber-100">
                        <p className="text-amber-700 text-lg">No mix designs found. Start a new one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mixDesigns.map((design) => (
                            <div
                                key={design._id}
                                className="p-6 bg-amber-50 shadow-sm rounded-xl border border-amber-100 hover:shadow-md transition duration-300"
                                ref={(el) => (pdfRefs.current[design._id] = el)}
                            >
                                <h2 className="text-xl font-bold text-amber-800 border-b border-amber-200 pb-2 mb-4">
                                    {design.resultData?.grade || 'Grade'} Mix Design
                                </h2>

                                <p className="text-amber-700 mb-4">
                                    <strong>Date:</strong> {new Date(design.createdAt).toLocaleDateString()}
                                </p>

                                {/* Input Data */}
                                <section className="mb-4">
                                    <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-100 pb-1 mb-2">Input Data</h3>
                                    <div className="grid grid-cols-2 gap-2 text-amber-700">
                                        {[
                                            { label: 'Exposure', value: design.inputData?.exposure },
                                            { label: 'Max Agg Size', value: `${design.inputData?.maxAggSize} mm` },
                                            { label: 'Slump', value: `${design.inputData?.slump} mm` },
                                            { label: 'Aggregate Shape', value: design.inputData?.aggregateShape },
                                            { label: 'Water-Cement Ratio', value: design.inputData?.wcrInput },
                                            { label: 'Zone', value: design.inputData?.zone },
                                            { label: 'SG of Cement', value: design.inputData?.specificGravityCement },
                                            { label: 'SG of FA', value: design.inputData?.specificGravityFA },
                                            { label: 'SG of CA', value: design.inputData?.specificGravityCA },
                                            { label: 'Admixture %', value: `${design.inputData?.admixturePercent}%` },
                                            { label: 'Volume', value: `${design.inputData?.volume} m³` },
                                        ].map(({ label, value }, idx) => (
                                            <p key={idx}><strong>{label}:</strong> {value || 'NA'}</p>
                                        ))}
                                    </div>
                                </section>

                                {/* Result Data */}
                                <section className="bg-white p-4 rounded-lg border border-amber-100">
                                    <h3 className="text-lg font-semibold text-amber-700 border-b border-amber-100 pb-1 mb-2">Result Data</h3>
                                    <div className="grid grid-cols-2 gap-2 text-amber-700">
                                        {[
                                            { label: 'Target Strength', value: `${design.resultData?.targetStrength} MPa` },
                                            { label: 'Cement Content', value: `${design.resultData?.cementContent} kg` },
                                            { label: 'Cement Bags', value: `${design.resultData?.cementBags} bags` },
                                            { label: 'Water Content', value: `${design.resultData?.waterContent} liters` },
                                            { label: 'Fine Aggregate', value: `${design.resultData?.fineAggregateMass} kg` },
                                            { label: 'Coarse Aggregate', value: `${design.resultData?.coarseAggregateMass} kg` },
                                            { label: 'Admixture Weight', value: `${design.resultData?.admixtureWeight} kg` },
                                            {
                                                label: 'Mix Ratio',
                                                value: `1 : ${design.resultData?.mixRatio?.fineAggregate} : ${design.resultData?.mixRatio?.coarseAggregate}`
                                            },
                                        ].map(({ label, value }, idx) => (
                                            <p key={idx}><strong>{label}:</strong> {value || 'NA'}</p>
                                        ))}
                                    </div>
                                </section>

                                {/* Action Buttons */}
                                <div className="mt-6 flex flex-col gap-4">
                                    <button
                                        onClick={() => handleDownloadPdf(design._id)}
                                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
                                    >
                                        Download as PDF
                                    </button>
                                    <button
                                        onClick={() => handleDelete(design._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
                                    >
                                        Delete Design
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyDesigns;
