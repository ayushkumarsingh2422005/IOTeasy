'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';

const DeviceStatus = ({ name, status, lastUpdate, lastActiveTime }) => (
  <div className={`flex items-center justify-between p-2 rounded-md ${status ? 'bg-green-900/20' : 'bg-gray-800'}`}>
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-gray-600'}`} />
      <span className="text-sm text-gray-300">{name}</span>
    </div>
    <div className="flex items-center">
      <span className={`text-xs px-1.5 py-0.5 rounded ${
        status ? 'bg-green-900/50 text-green-100' : 'bg-gray-700/50 text-gray-400'
      }`}>
        {status ? 'ON' : 'OFF'}
      </span>
      {lastActiveTime && (
        <span className="text-xs text-gray-500 ml-2">
          {lastActiveTime.split(',')[1].trim()}
        </span>
      )}
    </div>
  </div>
);

const SensorButton = ({ name, isSelected, onClick, unit }) => (
  <button
    onClick={onClick}
    className={`w-full p-3 rounded-lg mb-2 text-left transition-colors ${
      isSelected 
        ? 'bg-blue-900 text-blue-100 border-l-4 border-blue-500' 
        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    }`}
  >
    <div className="font-medium">{name}</div>
    <div className="text-xs opacity-75">Unit: {unit}</div>
  </button>
);

export default function EmsPage() {
  const [data, setData] = useState([]);
  const [deviceStates, setDeviceStates] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState('dht22Temp');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const sensors = {
    dht22Temp: { name: 'Temperature', unit: '°C' },
    dht22Moisture: { name: 'Humidity', unit: '%' },
    carbonDioxide: { name: 'CO₂', unit: 'ppm' },
    oxygen: { name: 'O₂', unit: '%' },
    pressure: { name: 'Pressure', unit: 'kPa' }
  };

  const devices = {
    exhaustFan: 'Exhaust Fan',
    indoorCooling: 'Cooling System',
    diaphragmPump: 'Diaphragm Pump',
    oled: 'OLED Display'
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      // Fetch historical data for graph
      const historicalResponse = await fetch('/api/ems', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Fetch recent data for device states
      const recentResponse = await fetch('/api/ems/recent', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!historicalResponse.ok || !recentResponse.ok) {
        if (historicalResponse.status === 401 || recentResponse.status === 401) {
          localStorage.removeItem('token');
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch data');
      }
      
      const historicalData = await historicalResponse.json();
      const recentData = await recentResponse.json();
      
      // Process historical data for the chart
      const processedData = historicalData.map(item => ({
        time: item.createdAtIST,
        dht22Temp: item.dht22Temp,
        dht22Moisture: item.dht22Moisture,
        carbonDioxide: item.carbonDioxide,
        oxygen: item.oxygen,
        pressure: item.pressure,
        createdAtIST: item.createdAtIST
      })).reverse();

      setData(processedData);
      setDeviceStates(recentData);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('unauthorized')) {
        localStorage.removeItem('token');
        router.push('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Topbar 
        onRefresh={() => {
          const token = localStorage.getItem('token');
          if (token) fetchData();
        }}
        onLogout={() => {
          localStorage.removeItem('token');
          router.push('/');
        }}
        isRefreshing={isLoading}
        lastRefresh={deviceStates?.lastUpdated}
      />

      <div className="h-[calc(100vh-3.5rem)] grid grid-cols-12 gap-2 p-2">
        {/* Left Column - Sensor Selection */}
        <div className="col-span-2 bg-gray-800 rounded-lg p-2 flex flex-col gap-1">
          <button
            onClick={() => router.push('/ems/raw')}
            className="mb-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            View Raw Data
          </button>
          {Object.entries(sensors).map(([key, { name, unit }]) => (
            <button
              key={key}
              onClick={() => setSelectedSensor(key)}
              className={`text-left px-2 py-1.5 rounded text-sm transition-colors ${
                selectedSensor === key
                  ? 'bg-blue-900/50 text-blue-100'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {name} ({unit})
            </button>
          ))}
        </div>

        {/* Middle Column - Graph */}
        <div className="col-span-8 bg-gray-800 rounded-lg p-2">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-red-400">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickMargin={10}
                  angle={-90}
                  textAnchor="end"
                  height={120}
                  interval={0}
                />
                <YAxis
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickMargin={10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.375rem',
                  }}
                  labelStyle={{ color: '#9CA3AF' }}
                  itemStyle={{ color: '#60A5FA' }}
                />
                <Line
                  type="monotone"
                  dataKey={selectedSensor}
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Right Column - Device Status */}
        <div className="col-span-2 bg-gray-800 rounded-lg p-2 flex flex-col gap-1">
          {deviceStates && deviceStates.deviceStatus && Object.entries(devices).map(([key, name]) => (
            <DeviceStatus
              key={key}
              name={name}
              status={deviceStates.deviceStatus[key]?.currentState || false}
              lastActiveTime={deviceStates.deviceStatus[key]?.lastActiveTime}
            />
          ))}
          <div className="mt-auto text-xs text-gray-500 text-center pt-2 border-t border-gray-700">
            {deviceStates?.isDataCurrent ? 'Data is current' : 'Data is stale (>15 min old)'}
            <div>Last update: {deviceStates?.lastUpdated?.split(',')[1].trim()}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 