import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-lg rounded-xl p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, className = '', type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out disabled:bg-indigo-300 ${className}`}
  >
    {children}
  </button>
);

export default function GatePassForm({ loggedInUser }) {
  const [formData, setFormData] = useState({
    studentId: loggedInUser.id,
    studentName: loggedInUser.name,
    rollNumber: '',
    mobileNumber: '',
    department: '',
    year: '',
    classSection: '',
    purpose: '',
    tutorId: '', // New field
    wardenId: '', // New field
  });

  const [tutors, setTutors] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const tutorData = await api.getUsersByRole('TUTOR');
        const wardenData = await api.getUsersByRole('WARDEN');
        setTutors(tutorData);
        setWardens(wardenData);
      } catch (error) {
        setMessage('Error: Could not load tutor/warden list.');
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
    if (!formData.tutorId || !formData.wardenId) {
        setMessage("Error: Please select a tutor and a warden.");
        return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await api.submitRequest(formData);
      setMessage(`Request submitted successfully! Status: ${response.status}`);
      setFormData(prev => ({
        ...prev,
        purpose: '',
        mobileNumber: '',
        tutorId: '',
        wardenId: ''
      }));
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-8">
      <Card className="w-full max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">New Gate Pass Request</h2>
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center ${message.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="studentName" value={formData.studentName} className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100" disabled/>
          </div>
          <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
              <input type="text" id="rollNumber" value={formData.rollNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required/>
          </div>
          <div>
              <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" id="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required/>
          </div>
          <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select id="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select Department...</option>
                  <option value="CSE">Computer Science</option>
                  <option value="ECE">Electronics & Communication</option>
              </select>
          </div>
          <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select id="year" value={formData.year} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select Year...</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
              </select>
          </div>
          <div>
              <label htmlFor="classSection" className="block text-sm font-medium text-gray-700 mb-1">Class / Section</label>
              <select id="classSection" value={formData.classSection} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                  <option value="">Select Class...</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
              </select>
          </div>
          <div>
            <label htmlFor="tutorId" className="block text-sm font-medium text-gray-700 mb-1">Select Tutor</label>
            <select id="tutorId" name="tutorId" value={formData.tutorId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
              <option value="">Choose a tutor...</option>
              {tutors.map(tutor => (
                <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="wardenId" className="block text-sm font-medium text-gray-700 mb-1">Select Warden</label>
            <select id="wardenId" name="wardenId" value={formData.wardenId} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
              <option value="">Choose a warden...</option>
              {wardens.map(warden => (
                <option key={warden.id} value={warden.id}>{warden.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">Purpose of Leave</label>
              <textarea id="purpose" rows="4" value={formData.purpose} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required></textarea>
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
