// File: src/services/api.ts — Frontend API service layer

import { UserInputData } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const calculateCarbonFootprint = async (data: UserInputData) => {
  const response = await fetch(`${API_BASE}/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to calculate footprint');
  }

  return response.json();
};

export const scanReceipt = async (base64Image: string, mimeType: string) => {
  const response = await fetch(`${API_BASE}/scan-receipt`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image, mimeType })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }

  return response.json();
};

export const parseVoiceTranscript = async (transcript: string) => {
  const response = await fetch(`${API_BASE}/parse-voice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ transcript })
  });

  if (!response.ok) {
    throw new Error('Failed to parse voice');
  }

  return response.json();
};

export const sortWaste = async (base64Image: string, mimeType: string) => {
  const response = await fetch(`${API_BASE}/sort-waste`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: base64Image, mimeType })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze waste');
  }

  return response.json();
};

export const analyzeProduct = async (productName: string, category?: string) => {
  const response = await fetch(`${API_BASE}/analyze-product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productName, category })
  });

  if (!response.ok) {
    throw new Error('Failed to analyze product');
  }

  return response.json();
};

export const getTimeMachineLetter = async (data: UserInputData) => {
  const response = await fetch(`${API_BASE}/time-machine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to generate 2050 letter');
  }

  return response.json();
};
