'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import Topbar from '@/components/Topbar';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InputDeviceButton = ({ name, isActive, onClick, value, unit, timestamp }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 mb-2 rounded-lg border transition-all ${
      isActive 
        ? 'border-blue-500 bg-blue-50 text-blue-700' 
        : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="font-medium">{name}</span>
        {value !== undefined && (
          <span className="text-sm text-gray-600">
            {value} {unit}
          </span>
        )}
      </div>
      {timestamp && (
        <span className="text-xs text-gray-400 mt-1">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      )}
    </div>
  </button>
);

const OutputDeviceStatus = ({ name, value, timestamp }) => {
  const isOn = value === '1' || value === 1 || value?.toLowerCase() === 'on';
  return (
    <div className="flex justify-between items-center p-4 border rounded-lg mb-2">
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        {timestamp && (
          <span className="text-xs text-gray-400 mt-1">
            {new Date(timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${isOn ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          isOn ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isOn ? '1 (ON)' : '0 (OFF)'}
        </span>
      </div>
    </div>
  );
};

export default function SystemLayout({ 
  title,
  description,
  inputDevices,
  outputDevices,
  apiEndpoint
}) {
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(apiEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const newData = await response.json();
      setData(newData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error(`Error fetching ${title} data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDevice = (deviceId) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const getChartData = () => {
    if (!data || selectedDevices.length === 0) return null;

    // Collect all unique timestamps from selected devices
    const allTimestamps = new Set();
    selectedDevices.forEach(deviceId => {
      const deviceData = data[deviceId] || [];
      deviceData.forEach(d => allTimestamps.add(d.createdAtIST));
    });

    // Convert to array and sort chronologically
    const sortedTimestamps = Array.from(allTimestamps).sort((a, b) => 
      new Date(a) - new Date(b)
    );

    const datasets = selectedDevices.map(deviceId => {
      const deviceData = data[deviceId] || [];
      const deviceInfo = inputDevices.find(d => d.id === deviceId);
      
      // Create a map of timestamp to value for quick lookup
      const valueMap = new Map(
        deviceData.map(d => [d.createdAtIST, parseFloat(d.Value) || 0])
      );
      
      // Generate data points for all timestamps
      const dataPoints = sortedTimestamps.map(timestamp => ({
        x: timestamp,
        y: valueMap.get(timestamp) || null // Use null for missing values
      }));

      return {
        label: deviceInfo?.name || deviceId,
        data: dataPoints,
        borderColor: getRandomColor(),
        fill: false,
        tension: 0.1,
        spanGaps: true // Connect points across gaps
      };
    });

    return {
      labels: sortedTimestamps,
      datasets
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxRotation: 90,
          minRotation: 90,
          autoSkip: false,
          font: {
            size: 11
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${title} Sensor Data`
      }
    },
    maintainAspectRatio: false
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getCurrentValue = (deviceId) => {
    if (!data || !data[deviceId] || !data[deviceId][0]) return undefined;
    return data[deviceId][0].Value;
  };

  const getTimestamp = (deviceId) => {
    if (!data || !data[deviceId] || !data[deviceId][0]) return undefined;
    return data[deviceId][0].createdAtIST;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">{description}</p>
          {lastRefresh && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Devices */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Input Devices</h2>
            {inputDevices.map((device) => (
              <InputDeviceButton
                key={device.id}
                name={device.name}
                isActive={selectedDevices.includes(device.id)}
                onClick={() => toggleDevice(device.id)}
                value={getCurrentValue(device.id)}
                unit={device.unit}
                timestamp={getTimestamp(device.id)}
              />
            ))}
          </div>

          {/* Graph */}
          <div className="lg:col-span-6">
            <div className="bg-white p-6 rounded-xl shadow-lg h-[600px]">
              {selectedDevices.length > 0 ? (
                <Line data={getChartData()} options={chartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Select input devices to view their data
                </div>
              )}
            </div>
          </div>

          {/* Output Devices */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">Output Devices</h2>
            {outputDevices.map((device) => (
              <OutputDeviceStatus
                key={device.id}
                name={device.name}
                value={getCurrentValue(device.id)}
                timestamp={getTimestamp(device.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 