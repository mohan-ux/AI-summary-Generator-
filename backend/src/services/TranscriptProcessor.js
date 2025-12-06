import ChunkingService from './ChunkingService.js';
import SummaryGenerator from './SummaryGenerator.js';

class TranscriptProcessor {
  constructor(geminiClient) {
    this.chunkingService = new ChunkingService(geminiClient);
    this.summaryGenerator = new SummaryGenerator(geminiClient);
    this.processingTimeout = 60000; 
  }

  async process(transcript) {
    
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Processing timeout exceeded')), this.processingTimeout);
    });

    
    const processingPromise = this._processInternal(transcript);

    
    try {
      return await Promise.race([processingPromise, timeoutPromise]);
    } catch (error) {
      if (error.message.includes('timeout')) {
        throw new Error('Request timed out. Please try with a shorter transcript.');
      }
      throw error;
    }
  }

  async _processInternal(transcript) {
    try {
      // Step 1: Chunk the transcript into semantic segments
      console.log('Starting semantic chunking...');
      const chunks = await this.chunkingService.chunkTranscript(transcript);
      console.log(`Created ${chunks.length} semantic chunks`);

      // Step 2: Generate summary
      console.log('Generating summary...');
      const summary = await this.summaryGenerator.generateSummary(chunks);

      // Step 3: Extract action items
      console.log('Extracting action items...');
      const actionItems = await this.summaryGenerator.extractActionItems(chunks);

      // Step 4: Generate timeline
      console.log('Creating timeline...');
      const timeline = await this.summaryGenerator.generateTimeline(chunks);

      // Step 5: Identify ambiguities
      console.log('Identifying ambiguities...');
      const ambiguities = await this.summaryGenerator.identifyAmbiguities(transcript);

      console.log('Processing complete!');

      // Return structured result
      return {
        summary,
        actionItems,
        timeline,
        ambiguities
      };

    } catch (error) {
      console.error('Error in transcript processing:', error);
      throw new Error(`Failed to process transcript: ${error.message}`);
    }
  }
}

export default TranscriptProcessor;
