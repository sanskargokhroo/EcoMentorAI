// File: src/components/CarbonForm.tsx — Form for user footprint inputs

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { UserInputData } from '../types';
import { scanReceipt, parseVoiceTranscript } from '../services/api';

// For Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface CarbonFormProps {
  onSubmit: (data: UserInputData) => void;
  isLoading: boolean;
}

const CarbonForm: React.FC<CarbonFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<any>({
    name: '',
    dailyTravelKm: '10',
    transportType: 'car',
    monthlyElectricityKWh: '200',
    dietType: 'omnivore',
    shoppingFrequency: '2'
  });

  const [isScanning, setIsScanning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return 98; // Hold at 98% until actual completion
          return prev + 2; // Increment by 2% every second (approx 50s total)
        });
      }, 1000);
    } else {
      setProgress(100);
      const timeout = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timeout);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const res = await scanReceipt(base64Data, file.type);
        if (res.success && res.data) {
          setFormData((prev: any) => ({ ...prev, ...res.data }));
          alert('Receipt scanned successfully! Form auto-filled.');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      alert('Failed to scan receipt.');
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startVoiceCoach = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setIsScanning(true); // Re-use loading state for API call
      try {
        const res = await parseVoiceTranscript(transcript);
        if (res.success && res.data) {
          setFormData((prev: any) => ({ ...prev, ...res.data }));
          alert(`Heard: "${transcript}"\nForm auto-filled!`);
        }
      } catch (error) {
        console.error(error);
        alert('Failed to parse voice data.');
      } finally {
        setIsScanning(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
      alert('Voice recognition error. Try again.');
    };

    recognition.start();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData: UserInputData = {
      ...formData,
      dailyTravelKm: Number(formData.dailyTravelKm) || 0,
      monthlyElectricityKWh: Number(formData.monthlyElectricityKWh) || 0,
      shoppingFrequency: Number(formData.shoppingFrequency) || 0,
    };
    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-200">
      
      {/* AI Assistant Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-green-800 dark:text-green-400">✨ AI Auto-Fill</h4>
          <p className="text-xs text-green-700 dark:text-green-500">Scan a bill or speak your habits to let AI fill this form.</p>
        </div>
        <div className="flex gap-2 items-center">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            className="hidden" 
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning || isListening}
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-700 border border-green-300 dark:border-green-600 rounded shadow-sm text-sm font-medium text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            📸 {isScanning ? 'Scanning...' : 'Scan Bill'}
          </button>
          
          <button
            type="button"
            onClick={startVoiceCoach}
            disabled={isScanning || isListening}
            className={`flex items-center px-3 py-2 border rounded shadow-sm text-sm font-medium disabled:opacity-50 ${
              isListening 
                ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 animate-pulse' 
                : 'bg-white border-green-300 text-green-700 dark:bg-gray-700 dark:border-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-600'
            }`}
          >
            🎙️ {isListening ? 'Listening...' : 'Voice Coach'}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          minLength={2}
          maxLength={50}
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          aria-label={t('form.name')}
        />
      </div>

      <div>
        <label htmlFor="dailyTravelKm" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.travel')}
        </label>
        <input
          type="number"
          id="dailyTravelKm"
          name="dailyTravelKm"
          min="0"
          value={formData.dailyTravelKm}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          aria-label={t('form.travel')}
        />
      </div>

      <div>
        <label htmlFor="transportType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.transport')}
        </label>
        <select
          id="transportType"
          name="transportType"
          value={formData.transportType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          aria-label={t('form.transport')}
        >
          <option value="car">Car</option>
          <option value="bike">Bike/Motorcycle</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="flight">Flight</option>
        </select>
      </div>

      <div>
        <label htmlFor="monthlyElectricityKWh" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.electricity')}
        </label>
        <input
          type="number"
          id="monthlyElectricityKWh"
          name="monthlyElectricityKWh"
          min="0"
          value={formData.monthlyElectricityKWh}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          aria-label={t('form.electricity')}
        />
      </div>

      <div>
        <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.diet')}
        </label>
        <select
          id="dietType"
          name="dietType"
          value={formData.dietType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          aria-label={t('form.diet')}
        >
          <option value="vegan">{t('diet.vegan')}</option>
          <option value="vegetarian">{t('diet.vegetarian')}</option>
          <option value="omnivore">{t('diet.omnivore')}</option>
          <option value="heavy-meat">{t('diet.heavy-meat')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="shoppingFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('form.shopping')}
        </label>
        <input
          type="number"
          id="shoppingFrequency"
          name="shoppingFrequency"
          min="0"
          value={formData.shoppingFrequency}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2 border"
          aria-label={t('form.shopping')}
        />
      </div>

      {isLoading ? (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-md h-10 overflow-hidden relative shadow-inner">
          <div 
            className="h-full bg-green-500 transition-all duration-1000 ease-out flex items-center justify-center"
            style={{ width: `${progress}%` }}
          >
          </div>
          <div className="absolute inset-0 flex items-center justify-center w-full h-full text-sm font-medium text-gray-800 dark:text-gray-100 drop-shadow-sm mix-blend-difference z-10">
            {t('form.submit')}... {progress}%
          </div>
        </div>
      ) : (
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors"
        >
          {t('form.submit')}
        </button>
      )}
    </form>
  );
};

export default CarbonForm;
