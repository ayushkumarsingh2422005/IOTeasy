'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Add refresh icon component
const RefreshIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// Dashboard Components
const SystemCard = ({ title, description, sensorData, deviceStates, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
    </div>
    <p className="text-gray-600 mb-6">{description}</p>
    
    {/* Sensor Readings */}
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Sensor Readings</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(sensorData).map(([key, data], index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">{key}</p>
            <p className="text-lg font-semibold text-gray-800">
              {data.value}
              <span className="text-sm text-gray-500 ml-1">{data.unit}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {data.time ? new Date(data.time).toLocaleTimeString() : 'No timestamp'}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* Device States */}
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-3">Device States</h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(deviceStates).map(([key, data], index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <span className="text-sm text-gray-600">{key}</span>
              <p className="text-xs text-gray-400 mt-1">
                {data.time ? new Date(data.time).toLocaleTimeString() : 'No timestamp'}
              </p>
            </div>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${data.value ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                data.value ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {data.value ? '1 (ON)' : '0 (OFF)'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
        fetch('/api/ems', { headers }),
        fetch('/api/lms', { headers }),
        fetch('/api/nfads', { headers })
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
              value: emsData.dht22Temp?.[0]?.Value || 'N/A', 
              unit: '°C',
              time: emsData.dht22Temp?.[0]?.createdAtIST
            },
            'Humidity': { 
              value: emsData.dht22Moisture?.[0]?.Value || 'N/A', 
              unit: '%',
              time: emsData.dht22Moisture?.[0]?.createdAtIST
            },
            'CO2': { 
              value: emsData.carbonDioxide?.[0]?.Value || 'N/A', 
              unit: 'ppm',
              time: emsData.carbonDioxide?.[0]?.createdAtIST
            },
            'O2': { 
              value: emsData.oxygen?.[0]?.Value || 'N/A', 
              unit: '%',
              time: emsData.oxygen?.[0]?.createdAtIST
            },
            'Pressure': { 
              value: emsData.pressure?.[0]?.Value || 'N/A', 
              unit: 'kPa',
              time: emsData.pressure?.[0]?.createdAtIST
            }
          },
          deviceStates: {
            'Exhaust Fan': { 
              value: emsData.exhaustFan?.[0]?.Value === 1,
              time: emsData.exhaustFan?.[0]?.createdAtIST
            },
            'Cooling System': { 
              value: emsData.indoorCooling?.[0]?.Value === 1,
              time: emsData.indoorCooling?.[0]?.createdAtIST
            },
            'Diaphragm Pump': { 
              value: emsData.diaphragmPump?.[0]?.Value === 1,
              time: emsData.diaphragmPump?.[0]?.createdAtIST
            },
            'OLED Display': { 
              value: emsData.oled?.[0]?.Value === 1,
              time: emsData.oled?.[0]?.createdAtIST
            }
          }
        },
        lms: {
          sensorData: {
            'Light Intensity': { 
              value: lmsData.bh1750?.[0]?.Value || 'N/A', 
              unit: 'lux',
              time: lmsData.bh1750?.[0]?.createdAtIST
            },
            'Spectral': { 
              value: lmsData.as7265x?.[0]?.Value || 'N/A', 
              unit: 'nm',
              time: lmsData.as7265x?.[0]?.createdAtIST
            },
            'Ambient': { 
              value: lmsData.tsl2591?.[0]?.Value || 'N/A', 
              unit: 'lux',
              time: lmsData.tsl2591?.[0]?.createdAtIST
            },
            'LDR': { 
              value: lmsData.ldr?.[0]?.Value || 'N/A', 
              unit: 'Ω',
              time: lmsData.ldr?.[0]?.createdAtIST
            }
          },
          deviceStates: {
            'Grow Light A': { 
              value: lmsData.growLightsA?.[0]?.Value === 1,
              time: lmsData.growLightsA?.[0]?.createdAtIST
            },
            'Grow Light B': { 
              value: lmsData.growLightsB?.[0]?.Value === 1,
              time: lmsData.growLightsB?.[0]?.createdAtIST
            },
            'Grow Light C': { 
              value: lmsData.growLightsC?.[0]?.Value === 1,
              time: lmsData.growLightsC?.[0]?.createdAtIST
            },
            'Dimmer': { 
              value: lmsData.dimmable?.[0]?.Value === 1,
              time: lmsData.dimmable?.[0]?.createdAtIST
            },
            'OLED Display': { 
              value: lmsData.oled?.[0]?.Value === 1,
              time: lmsData.oled?.[0]?.createdAtIST
            }
          }
        },
        nfads: {
          sensorData: {
            'pH Level': { 
              value: nfadsData.ph?.[0]?.Value || 'N/A', 
              unit: 'pH',
              time: nfadsData.ph?.[0]?.createdAtIST
            },
            'EC': { 
              value: nfadsData.ec?.[0]?.Value || 'N/A', 
              unit: 'mS/cm',
              time: nfadsData.ec?.[0]?.createdAtIST
            },
            'TDS': { 
              value: nfadsData.tds?.[0]?.Value || 'N/A', 
              unit: 'ppm',
              time: nfadsData.tds?.[0]?.createdAtIST
            },
            'Water Temp': { 
              value: nfadsData.waterTemp?.[0]?.Value || 'N/A', 
              unit: '°C',
              time: nfadsData.waterTemp?.[0]?.createdAtIST
            },
            'Flow Rate': { 
              value: nfadsData.waterFlow?.[0]?.Value || 'N/A', 
              unit: 'L/min',
              time: nfadsData.waterFlow?.[0]?.createdAtIST
            }
          },
          deviceStates: {
            'Water Pump': { 
              value: nfadsData.waterPump?.[0]?.Value === 1,
              time: nfadsData.waterPump?.[0]?.createdAtIST
            },
            'Valve': { 
              value: nfadsData.solenoidValve?.[0]?.Value === 1,
              time: nfadsData.solenoidValve?.[0]?.createdAtIST
            },
            'Pump A': { 
              value: nfadsData.peristalticPumpA?.[0]?.Value === 1,
              time: nfadsData.peristalticPumpA?.[0]?.createdAtIST
            },
            'Pump B': { 
              value: nfadsData.peristalticPumpB?.[0]?.Value === 1,
              time: nfadsData.peristalticPumpB?.[0]?.createdAtIST
            },
            'pH Up Pump': { 
              value: nfadsData.peristalticPumpPhup?.[0]?.Value === 1,
              time: nfadsData.peristalticPumpPhup?.[0]?.createdAtIST
            },
            'pH Down Pump': { 
              value: nfadsData.peristalticPumpPhdown?.[0]?.Value === 1,
              time: nfadsData.peristalticPumpPhdown?.[0]?.createdAtIST
            },
            'Compressor': { 
              value: nfadsData.compressor?.[0]?.Value === 1,
              time: nfadsData.compressor?.[0]?.createdAtIST
            },
            'Peltier': { 
              value: nfadsData.peltier?.[0]?.Value === 1,
              time: nfadsData.peltier?.[0]?.createdAtIST
            },
            'OLED Display': { 
              value: nfadsData.oled?.[0]?.Value === 1,
              time: nfadsData.oled?.[0]?.createdAtIST
            }
          }
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hydroponics Monitoring Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring and control of all systems</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const token = localStorage.getItem('token');
                if (token) fetchSystemData(token);
              }}
              className={`flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow text-gray-700 hover:bg-gray-50 ${
                isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isRefreshing}
            >
              <RefreshIcon />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Last Refresh Time */}
        {lastRefresh && (
          <p className="text-sm text-gray-500 mb-6">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        )}

        {/* System Cards */}
        <div className="grid grid-cols-1 gap-8">
          <SystemCard
            title="Environmental Monitoring System (EMS)"
            description="Monitors and controls environmental conditions including temperature, humidity, CO₂, O₂, and air pressure. Features automated climate control through exhaust fans and cooling systems."
            sensorData={systemData.ems?.sensorData || {}}
            deviceStates={systemData.ems?.deviceStates || {}}
            onClick={() => handleSystemClick('ems')}
          />
          <SystemCard
            title="Light Monitoring System (LMS)"
            description="Advanced light management system with multiple spectral sensors and controllable grow lights. Monitors light intensity, spectral composition, and ambient light conditions for optimal plant growth."
            sensorData={systemData.lms?.sensorData || {}}
            deviceStates={systemData.lms?.deviceStates || {}}
            onClick={() => handleSystemClick('lms')}
          />
          <SystemCard
            title="Nutrient Film Aquaponic Distribution System (NFADS)"
            description="Comprehensive nutrient and water management system monitoring pH, EC, TDS, and water conditions. Features automated nutrient dosing, water circulation, and temperature control for optimal nutrient delivery."
            sensorData={systemData.nfads?.sensorData || {}}
            deviceStates={systemData.nfads?.deviceStates || {}}
            onClick={() => handleSystemClick('nfads')}
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-8">Hydroponics Dashboard</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
