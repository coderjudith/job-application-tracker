import React, { useState, useEffect } from 'react';
import { authService } from '../services/auth';
import { api } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      setApiStatus('Connecting to backend...');
      const data = await api.getApplications();
      
      if (data.success && data.items) {
        setApplications(data.items);
        setApiStatus(`✅ Connected! Found ${data.items.length} applications`);
      } else {
        setApiStatus('⚠️ Connected but no data received');
      }
    } catch (error) {
      setApiStatus(`❌ Connection failed: ${error.message}`);
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.signOut();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Job Application Tracker
              </h1>
              <p className="text-sm text-gray-500">
                Welcome, {user?.email || 'User'}!
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Backend Connection</h2>
          <div className={`p-4 rounded-lg mb-4 ${
            apiStatus.includes('✅') ? 'bg-green-50 text-green-800' : 
            apiStatus.includes('❌') ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            {apiStatus || 'Testing connection...'}
            <div className="text-sm mt-2 opacity-75">
              API URL: {import.meta.env.VITE_API_URL || 'Not configured'}
            </div>
          </div>
          
          <button
            onClick={fetchApplications}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : 'Refresh Applications'}
          </button>
        </div>

        {/* Applications List Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Your Applications ({applications.length})
            </h2>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              + Add Application
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500">Start by adding your first job application!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((app) => (
                <div key={app.applicationId} className="border rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{app.companyName}</h3>
                      <p className="text-gray-700">{app.jobTitle}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                      app.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' :
                      app.status === 'Offer' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span className="font-medium">Applied:</span>
                      <span>{app.dateApplied}</span>
                    </div>
                    
                    {app.followUpDate && (
                      <div className="flex justify-between">
                        <span className="font-medium">Follow-up:</span>
                        <span className="text-blue-600">{app.followUpDate}</span>
                      </div>
                    )}
                    
                    {app.jobPostUrl && (
                      <div>
                        <a 
                          href={app.jobPostUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Job Post →
                        </a>
                      </div>
                    )}
                    
                    {app.notes && (
                      <div className="pt-2 border-t">
                        <p className="font-medium">Notes:</p>
                        <p className="text-gray-700 mt-1">{app.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;