import axios from 'axios';


const apiClient = axios.create({
  baseURL: '/api',
  timeout: 65000, // 65 seconds (slightly more than backend timeout)
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Sends transcript to backend for analysis
 * @param {string} transcript - The meeting transcript text
 * @returns {Promise<Object>} - Processed results with summary, action items, timeline, ambiguities
 */
export async function summarizeTranscript(transcript) {
  try {
    const response = await apiClient.post('/summarize', {
      transcript
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to process transcript');
    }
  } catch (error) {
   
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try with a shorter transcript.');
    }

    if (error.response) {
      
      const errorMessage = error.response.data?.error || 'Server error occurred';
      throw new Error(errorMessage);
    }

    if (error.request) {
      
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }


    throw new Error(error.message || 'An unexpected error occurred');
  }
}
