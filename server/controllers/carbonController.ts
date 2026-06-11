// File: server/controllers/carbonController.ts — Request handler for carbon calculations and AI coaching

import { Request, Response, NextFunction } from 'express';
import { UserInputSchema } from '../validators/index.js';
import { generateAICoachResponse, generateTimeMachineLetter } from '../services/aiService.js';
import { analyzeReceipt } from '../services/visionService.js';
import { analyzeVoiceTranscript } from '../services/voiceService.js';
import { analyzeWasteImage } from '../services/wasteService.js';
import { analyzeProductEco } from '../services/productService.js';

export const calculateAndCoach = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // SECURITY: Validate request body using Zod schema (.strict() prevents unknown fields)
    const validatedData = UserInputSchema.parse(req.body);

    const aiResponse = await generateAICoachResponse(validatedData);

    res.status(200).json({
      success: true,
      data: aiResponse
    });
  } catch (error) {
    next(error);
  }
};

export const handleScanReceipt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const data = await analyzeReceipt(image, mimeType || 'image/jpeg');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const handleParseVoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, error: 'No transcript provided' });
    }

    const data = await analyzeVoiceTranscript(transcript);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const handleSortWaste = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { image, mimeType } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const data = await analyzeWasteImage(image, mimeType || 'image/jpeg');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const handleAnalyzeProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productName, category } = req.body;
    if (!productName) {
      return res.status(400).json({ success: false, error: 'Product name required' });
    }

    const data = await analyzeProductEco(productName, category || 'unknown');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const handleTimeMachine = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = UserInputSchema.parse(req.body);
    const letter = await generateTimeMachineLetter(validatedData);
    res.status(200).json({ success: true, data: letter });
  } catch (error) {
    next(error);
  }
};
