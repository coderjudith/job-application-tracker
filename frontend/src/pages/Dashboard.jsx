import React, { useState } from 'react';
import { authService } from '../services/auth';

const Dashboard = ({ user, onLogout }) => {
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
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>
          <p className="text-gray-600">
            ✅ Authentication is working! You're logged in.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900">Next Steps:</h3>
            <ul className="mt-2 text-blue-800 list-disc list-inside">
              <li>Add job applications</li>
              <li>View application list</li>
              <li>Track follow-up dates</li>
              <li>Set up email reminders</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;