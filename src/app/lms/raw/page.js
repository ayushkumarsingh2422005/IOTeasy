'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/Topbar';

export default function RawDataPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const exportToCSV = () => {
    const headers = [
      'Time',
      'Light Intensity (lux)',
      'Spectral (nm)',
      'Ambient (lux)',
      'LDR (Ω)',
      'Grow Light',
      'Dimmer',
      'OLED Display'
    ];

    const csvData = data.map(item => [
      item.createdAtIST,
      item.bh1750,
      // item.as7265x,
      item.tsl2591,
      item.ldr,
      item.growLights ? 'ON' : 'OFF',
      item.dimmable,
      item.oled ? 'ON' : 'OFF'
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lms_data_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `lms_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/');
          return;
        }

        const response = await fetch('/api/lms/all', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch data');
        }

        const rawData = await response.json();
        setData(rawData);
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
        lastRefresh={data[0]?.createdAtIST}
      />

      <div className="p-4">
        {/* Navigation and Export Buttons */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push('/lms')}
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go Back
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export CSV
            </button>
            <button
              onClick={exportToJSON}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Export JSON
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <table className="w-full text-left text-gray-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 bg-gray-700">Time</th>
                    <th className="px-6 py-3 bg-gray-700">Light Intensity (lux)</th>
                    <th className="px-6 py-3 bg-gray-700">Spectral (nm)</th>
                    <th className="px-6 py-3 bg-gray-700">Ambient (lux)</th>
                    <th className="px-6 py-3 bg-gray-700">LDR (Ω)</th>
                    <th className="px-6 py-3 bg-gray-700">Grow Light</th>
                    <th className="px-6 py-3 bg-gray-700">Dimmer</th>
                    <th className="px-6 py-3 bg-gray-700">OLED Display</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item._id} className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'}`}>
                        <td className="px-6 py-4">{item.createdAtIST}</td>
                        <td className="px-6 py-4">{item.bh1750}</td>
                        {/* <td className="px-6 py-4">{item.as7265x}</td> */}
                        <td className="px-6 py-4">{item.tsl2591}</td>
                        <td className="px-6 py-4">{item.ldr}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${item.growLights ? 'bg-green-900/50 text-green-100' : 'bg-gray-700/50 text-gray-400'}`}>
                            {item.growLights ? 'ON' : 'OFF'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {item.dimmable}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs ${item.oled ? 'bg-green-900/50 text-green-100' : 'bg-gray-700/50 text-gray-400'}`}>
                            {item.oled ? 'ON' : 'OFF'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 