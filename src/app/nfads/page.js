'use client';

import SystemLayout from '@/components/SystemLayout';

const inputDevices = [
  { id: 'ph', name: 'pH Level', unit: 'pH' },
  { id: 'ec', name: 'EC', unit: 'mS/cm' },
  { id: 'tds', name: 'TDS', unit: 'ppm' },
  { id: 'waterTemp', name: 'Water Temperature', unit: '°C' },
  { id: 'waterFlow', name: 'Flow Rate', unit: 'L/min' }
];

const outputDevices = [
  { id: 'waterPump', name: 'Water Pump' },
  { id: 'solenoidValve', name: 'Solenoid Valve' },
  { id: 'peristalticPumpA', name: 'Pump A' },
  { id: 'peristalticPumpB', name: 'Pump B' },
  { id: 'peristalticPumpPhup', name: 'pH Up Pump' },
  { id: 'peristalticPumpPhdown', name: 'pH Down Pump' },
  { id: 'compressor', name: 'Compressor' },
  { id: 'peltier', name: 'Peltier Module' },
  { id: 'oled', name: 'OLED Display' }
];

export default function NFADSPage() {
  return (
    <SystemLayout
      title="Nutrient Film Aquaponic Distribution System (NFADS)"
      description="Comprehensive nutrient and water management system monitoring pH, EC, TDS, and water conditions. Features automated nutrient dosing, water circulation, and temperature control for optimal nutrient delivery."
      inputDevices={inputDevices}
      outputDevices={outputDevices}
      apiEndpoint="/api/nfads"
    />
  );
} 