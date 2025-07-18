'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';

// Add refresh icon component
const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Dashboard Components
const SystemCard = ({ title, description, sensorData, deviceStates, onClick }) => {
  // Function to check if data is active (within 15 minutes)
  const isDataActive = () => {
    if (!sensorData || Object.keys(sensorData).length === 0) return false;
    
    // Check if the isDataCurrent flag is available
    if (typeof sensorData.isDataCurrent === 'boolean') {
      return sensorData.isDataCurrent;
    }
    
    // Get the most recent timestamp from sensor data
    const timestamps = Object.values(sensorData).map(data => {
      if (!data.time) return null;
      // data.time: "19/6/2025, 2:56:30 pm"
      const [datePart, timePart] = data.time.split(',');
      const [day, month, year] = datePart.trim().split('/').map(Number);
      const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${timePart.trim()}`;
      return new Date(dateString);
    }).filter(Boolean);

    if (timestamps.length === 0) return false;

    const mostRecentTime = new Date(Math.max(...timestamps));
    const currentTime = new Date();
    const timeDiffInSeconds = (currentTime - mostRecentTime) / 1000;
    
    return timeDiffInSeconds <= 900; // 15 minutes
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all duration-300 border border-gray-700 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-bold text-gray-100">{title}</h2>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          isDataActive() 
            ? 'bg-green-900 text-green-100' 
            : 'bg-red-900 text-red-100'
        }`}>
          {isDataActive() ? 'Active' : 'Inactive'}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-3">{description}</p>

      {/* Sensor Readings */}
      {sensorData && Object.keys(sensorData).length > 0 && <div className="mb-3">
        <h3 className="text-xs font-semibold text-gray-400 mb-2">Sensor Readings</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(sensorData).map(([key, data], index) => {
            // Skip non-sensor data properties
            if (['isDataCurrent', 'lastUpdated'].includes(key)) return null;
            return (
              <div key={index} className="bg-gray-900 p-2 rounded">
                <p className="text-xs text-gray-400">{key}</p>
                <p className="text-sm font-semibold text-gray-100">
                  {data.value}
                  <span className="text-xs text-gray-400 ml-1">{data.unit}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {data.time.split(',')[1].trim()}
                </p>
              </div>
            );
          })}
        </div>
      </div>}

      {/* Device States */}
      {deviceStates && Object.keys(deviceStates).length > 0 && <div>
        <h3 className="text-xs font-semibold text-gray-400 mb-2">Device States</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(deviceStates).map(([key, data], index) => (
            <div key={index} className="flex items-center justify-between bg-gray-900 p-2 rounded">
              <div>
                <span className="text-xs text-gray-300">{key}</span>
                <p className="text-xs text-gray-500">
                  {data.lastActiveTime ? data.lastActiveTime.split(',')[1].trim() : 'Never'}
                </p>
              </div>
              <div className="flex items-center">
                <div className={`w-1.5 h-1.5 rounded-full mr-1 ${data.currentState ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                <span className={`px-1.5 py-0.5 rounded text-xs ${data.currentState ? 'bg-green-900 text-green-100' : 'bg-gray-700 text-gray-300'
                  }`}>
                  {data.currentState ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>}
    </div>
  );
};

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [systemData, setSystemData] = useState({
    ems: null,
    lms: null,
    nfads: null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchSystemData(token);
    }
  }, []);

  // Add auto-refresh effect
  useEffect(() => {
    let intervalId;
    if (isLoggedIn) {
      intervalId = setInterval(() => {
        const token = localStorage.getItem('token');
        if (token) {
          fetchSystemData(token);
        }
      }, 30000); // Refresh every 30 seconds
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoggedIn]);

  const fetchSystemData = async (token) => {
    try {
      setIsRefreshing(true);
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch data from all systems
      const [emsRes, lmsRes, nfadsRes] = await Promise.all([
        fetch('/api/ems/recent', { headers }),
        fetch('/api/lms/recent', { headers }),
        fetch('/api/nfads/recent', { headers })
      ]);

      const [emsData, lmsData, nfadsData] = await Promise.all([
        emsRes.json(),
        lmsRes.json(),
        nfadsRes.json()
      ]);

      setSystemData({
        ems: {
          sensorData: {
            'Temperature': {
              value: emsData.sensorData?.dht22Temp || 'N/A',
              unit: '°C',
              time: emsData.lastUpdated
            },
            'Humidity': {
              value: emsData.sensorData?.dht22Moisture || 'N/A',
              unit: '%',
              time: emsData.lastUpdated
            },
            'CO2': {
              value: emsData.sensorData?.carbonDioxide || 'N/A',
              unit: 'ppm',
              time: emsData.lastUpdated
            },
            'O2': {
              value: emsData.sensorData?.oxygen || 'N/A',
              unit: '%',
              time: emsData.lastUpdated
            },
            'Pressure': {
              value: emsData.sensorData?.pressure || 'N/A',
              unit: 'kPa',
              time: emsData.lastUpdated
            },
            isDataCurrent: emsData.isDataCurrent,
            lastUpdated: emsData.lastUpdated
          },
          deviceStates: emsData.deviceStatus || {}
        },
        lms: {
          sensorData: {
            'Light Intensity': {
              value: lmsData.sensorData?.bh1750 || 'N/A',
              unit: 'lux',
              time: lmsData.lastUpdated
            },
            'Spectral': {
              value: lmsData.sensorData?.as7265x || 'N/A',
              unit: 'nm',
              time: lmsData.lastUpdated
            },
            'Ambient': {
              value: lmsData.sensorData?.tsl2591 || 'N/A',
              unit: 'lux',
              time: lmsData.lastUpdated
            },
            'LDR': {
              value: lmsData.sensorData?.ldr || 'N/A',
              unit: 'Ω',
              time: lmsData.lastUpdated
            },
            'Dimmer': {
              value: lmsData.sensorData?.dimmable || 'N/A',
              unit: '0-100%',
              time: lmsData.lastUpdated
            },
            isDataCurrent: lmsData.isDataCurrent,
            lastUpdated: lmsData.lastUpdated
          },
          deviceStates: lmsData.deviceStatus || {}
        },
        nfads: {
          sensorData: {
            'pH Level': {
              value: nfadsData.sensorData?.ph || 'N/A',
              unit: 'pH',
              time: nfadsData.lastUpdated
            },
            'EC': {
              value: nfadsData.sensorData?.ec || 'N/A',
              unit: 'mS/cm',
              time: nfadsData.lastUpdated
            },
            'TDS': {
              value: nfadsData.sensorData?.tds || 'N/A',
              unit: 'ppm',
              time: nfadsData.lastUpdated
            },
            'Water Temp': {
              value: nfadsData.sensorData?.waterTemp || 'N/A',
              unit: '°C',
              time: nfadsData.lastUpdated
            },
            'Flow Rate': {
              value: nfadsData.sensorData?.waterFlow || 'N/A',
              unit: 'L/min',
              time: nfadsData.lastUpdated
            },
            isDataCurrent: nfadsData.isDataCurrent,
            lastUpdated: nfadsData.lastUpdated
          },
          deviceStates: nfadsData.deviceStatus || {}
        }
      });
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      const token = data.token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
      fetchSystemData(token);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setSystemData({ ems: null, lms: null, nfads: null });
  };

  const handleSystemClick = (system) => {
    router.push(`/${system}`);
  };

  return isLoggedIn ? (
    <div className="min-h-screen bg-gray-900">
      <Topbar
        onRefresh={() => {
          const token = localStorage.getItem('token');
          if (token) fetchSystemData(token);
        }}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
        lastRefresh={lastRefresh ? lastRefresh.toLocaleTimeString() : null}
      />

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <SystemCard
            title="Environmental Monitoring System (EMS)"
            description="Environmental monitoring and control system for temperature, humidity, CO₂, O₂, and pressure."
            sensorData={systemData.ems?.sensorData || {}}
            deviceStates={systemData.ems?.deviceStates || {}}
            onClick={() => handleSystemClick('ems')}
          />
          <SystemCard
            title="Light Monitoring System (LMS)"
            description="Light management system with spectral sensors and grow lights control."
            sensorData={systemData.lms?.sensorData || {}}
            deviceStates={systemData.lms?.deviceStates || {}}
            onClick={() => handleSystemClick('lms')}
          />
          <SystemCard
            title="Nutrient Fertilizer and Dosing System (NFADS)"
            description="Nutrient and water management system for pH, EC, TDS monitoring and automated dosing."
            sensorData={systemData.nfads?.sensorData || {}}
            deviceStates={systemData.nfads?.deviceStates || {}}
            onClick={() => handleSystemClick('nfads')}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-100">Hydroponics Dashboard</h1>
        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-100 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-gray-100 py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
