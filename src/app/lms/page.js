'use client';

import SystemLayout from '@/components/SystemLayout';

const inputDevices = [
  { id: 'bh1750', name: 'Light Intensity', unit: 'lux' },
  { id: 'as7265x', name: 'Spectral', unit: 'nm' },
  { id: 'tsl2591', name: 'Ambient Light', unit: 'lux' },
  { id: 'ldr', name: 'LDR', unit: 'Ω' }
];

const outputDevices = [
  { id: 'growLightsA', name: 'Grow Light A' },
  { id: 'growLightsB', name: 'Grow Light B' },
  { id: 'growLightsC', name: 'Grow Light C' },
  { id: 'dimmable', name: 'Dimmer' },
  { id: 'oled', name: 'OLED Display' }
];

export default function LMSPage() {
  return (
    <SystemLayout
      title="Light Monitoring System (LMS)"
      description="Advanced light management system with multiple spectral sensors and controllable grow lights. Monitors light intensity, spectral composition, and ambient light conditions for optimal plant growth."
      inputDevices={inputDevices}
      outputDevices={outputDevices}
      apiEndpoint="/api/lms"
    />
  );
} 