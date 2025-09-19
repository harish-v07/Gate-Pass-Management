import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-lg rounded-xl p-6 md:p-8 ${className}`}>
        {children}
    </div>
);

export default function GatePassForm({ user }) {
    // Initialize form state with empty values
    const [formData, setFormData] = useState({
        studentId: '',
        studentName: '',
        rollNumber: '',
        mobileNumber: '',
        department: '',
        year: '',
        classSection: '',
        purpose: '',
        tutorId: '',
        wardenId: ''
    });

    const [tutors, setTutors] = useState([]);
    const [wardens, setWardens] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Safely set student data once the 'user' prop is available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                studentId: user.id,
                studentName: user.name,
            }));
        }
    }, [user]); // This effect runs when the component mounts and if the user prop changes

    // Fetch tutors and wardens
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const tutorList = await api.getUsersByRole('TUTOR');
                const wardenList = await api.getUsersByRole('WARDEN');
                setTutors(tutorList);
                setWardens(wardenList);
            } catch (err) {
                setError('Could not load tutor/warden list.');
            }
        };
        fetchStaff();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Basic validation
        for (const key in formData) {
            if (formData[key] === '') {
                setError('Please fill out all fields.');
                return;
            }
        }

        try {
            await api.submitRequest(formData);
            setSuccessMessage('Gate pass request submitted successfully!');
            // Reset form fields except for student info
            setFormData(prev => ({
                ...prev,
                rollNumber: '',
                mobileNumber: '',
                department: '',
                year: '',
                classSection: '',
                purpose: '',
                tutorId: '',
                wardenId: ''
            }));
        } catch (err) {
            setError(`Submission failed: ${err.message}`);
        }
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Apply for Gate Pass</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{successMessage}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Student Info (Read-only) */}
                    <div>
                        <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="studentName" value={formData.studentName} className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm py-2 px-3" disabled />
                    </div>
                    {/* Editable Fields */}
                     <div>
                        <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700">Roll Number</label>
                        <input type="text" id="rollNumber" value={formData.rollNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                     <div>
                        <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
                        <input type="tel" id="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                     <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                        <input type="text" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                     <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                        <input type="number" id="year" value={formData.year} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                     <div>
                        <label htmlFor="classSection" className="block text-sm font-medium text-gray-700">Class / Section</label>
                        <input type="text" id="classSection" value={formData.classSection} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                    </div>
                     <div>
                        <label htmlFor="tutorId" className="block text-sm font-medium text-gray-700">Select Tutor</label>
                        <select id="tutorId" value={formData.tutorId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                            <option value="" disabled>-- Select a Tutor --</option>
                            {tutors.map(tutor => <option key={tutor.id} value={tutor.id}>{tutor.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="wardenId" className="block text-sm font-medium text-gray-700">Select Warden</label>
                        <select id="wardenId" value={formData.wardenId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                             <option value="" disabled>-- Select a Warden --</option>
                            {wardens.map(warden => <option key={warden.id} value={warden.id}>{warden.name}</option>)}
                        </select>
                    </div>
                </div>
                {/* Purpose */}
                <div>
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose of Leave</label>
                    <textarea id="purpose" value={formData.purpose} onChange={handleChange} rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"></textarea>
                </div>
                {/* Submit Button */}
                <div className="pt-4">
                    <button type="submit" className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300">Submit Request</button>
                </div>
            </form>
        </Card>
    );
}
