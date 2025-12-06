export function validateTranscript(transcript) {
  const errors = [];
  
  if (!transcript) {
    errors.push('Transcript is required');
    return { valid: false, errors };
  }
  
  if (typeof transcript !== 'string') {
    errors.push('Transcript must be a string');
    return { valid: false, errors };
  }
  
  const length = transcript.trim().length;
  
  if (length < 50) {
    errors.push('Transcript must be at least 50 characters long');
  }
  
  if (length > 50000) {
    errors.push('Transcript must not exceed 50,000 characters');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
