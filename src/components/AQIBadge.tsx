import React, { useEffect, useState } from 'react';

interface AQIData {
  aqi: number;
  label: string;
  color: string;
  message: string;
}

const AQIBadge: React.FC = () => {
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Free, no-key API from Open-Meteo
          const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi`);
          const data = await res.json();
          
          if (data && data.current && data.current.european_aqi !== undefined) {
            const aqiValue = data.current.european_aqi;
            let label = 'Good';
            let color = 'bg-green-500';
            let message = 'The air is clean. Let\'s keep it that way!';

            if (aqiValue > 20 && aqiValue <= 40) {
              label = 'Fair';
              color = 'bg-yellow-400';
              message = 'Air quality is fair. Minor emissions add up!';
            } else if (aqiValue > 40 && aqiValue <= 60) {
              label = 'Moderate';
              color = 'bg-orange-400';
              message = 'Air quality is moderate. Time to reduce emissions!';
            } else if (aqiValue > 60 && aqiValue <= 80) {
              label = 'Poor';
              color = 'bg-red-500';
              message = 'Air quality is poor. Your actions matter now more than ever.';
            } else if (aqiValue > 80) {
              label = 'Very Poor';
              color = 'bg-purple-600';
              message = 'Hazardous air quality. Immediate action is needed!';
            }

            setAqiData({ aqi: aqiValue, label, color, message });
          }
        } catch (error) {
          console.error("Failed to fetch AQI", error);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  if (loading) return null;
  if (!aqiData) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 mt-8 flex items-center justify-between">
      <div>
        <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1 flex items-center">
          <span className="mr-2">🌍</span> Local Air Quality
        </h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-sm">
          {aqiData.message}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg ${aqiData.color}`}>
          {aqiData.aqi}
        </div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2">
          {aqiData.label}
        </span>
      </div>
    </div>
  );
};

export default AQIBadge;
