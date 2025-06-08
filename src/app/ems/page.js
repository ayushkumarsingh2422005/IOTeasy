'use client';

import SystemLayout from '@/components/SystemLayout';

const inputDevices = [
  { id: 'dht22Temp', name: 'Temperature', unit: '°C' },
  { id: 'dht22Moisture', name: 'Humidity', unit: '%' },
  { id: 'carbonDioxide', name: 'CO2', unit: 'ppm' },
  { id: 'oxygen', name: 'O2', unit: '%' },
  { id: 'pressure', name: 'Pressure', unit: 'kPa' }
];

const outputDevices = [
  { id: 'exhaustFan', name: 'Exhaust Fan' },
  { id: 'indoorCooling', name: 'Cooling System' },
  { id: 'diaphragmPump', name: 'Diaphragm Pump' },
  { id: 'oled', name: 'OLED Display' }
];

export default function EMSPage() {
  return (
    <SystemLayout
      title="Environmental Monitoring System (EMS)"
      description="Monitor and control environmental conditions including temperature, humidity, CO₂, O₂, and air pressure. Features automated climate control through exhaust fans and cooling systems."
      inputDevices={inputDevices}
      outputDevices={outputDevices}
      apiEndpoint="/api/ems"
    />
  );
} 