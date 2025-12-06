import express from 'express';
import { validateTranscript } from '../utils/validation.js';

const router = express.Router();

export function createSummarizeRoute(transcriptProcessor) {
  router.post('/summarize', async (req, res) => {
    try {
      const { transcript } = req.body;
      
      // Validate input
      const validation = validateTranscript(transcript);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: validation.errors.join(', ')
        });
      }
      
      // Process transcript
      const result = await transcriptProcessor.process(transcript.trim());
      
      // Return successful response
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      console.error('Error processing transcript:', error);
      
      // Handle specific error types
      if (error.message?.includes('timeout')) {
        return res.status(504).json({
          success: false,
          error: 'Request timed out. Please try with a shorter transcript.'
        });
      }
      
      if (error.message?.includes('API key')) {
        return res.status(500).json({
          success: false,
          error: 'Configuration error. Please contact support.'
        });
      }
      
      // Generic error response
      res.status(500).json({
        success: false,
        error: 'Failed to process transcript. Please try again.'
      });
    }
  });
  
  return router;
}
