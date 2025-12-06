class ChunkingService {
  constructor(geminiClient) {
    this.geminiClient = geminiClient;
    this.similarityThreshold = 0.7;
    this.minChunkSize = 100;
    this.maxChunkSize = 1000;
  }

  async chunkTranscript(transcript) {
    const segments = this.splitIntoSegments(transcript);
    
    if (segments.length === 0) {
      return [];
    }
    
    const embeddings = await this.generateEmbeddings(segments);
    const chunks = this.groupBySimilarity(segments, embeddings, transcript);
    
    return chunks;
  }

  splitIntoSegments(text) {
    const segments = [];
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    for (const para of paragraphs) {
      if (para.length > this.maxChunkSize) {
        const sentences = para.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
        segments.push(...sentences);
      } else {
        segments.push(para);
      }
    }
    
    if (segments.length === 0) {
      const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
      segments.push(...sentences);
    }
    
    return segments.map(s => s.trim());
  }

  async generateEmbeddings(segments) {
    const embeddings = [];
    
    for (const segment of segments) {
      try {
        const embedding = await this.geminiClient.generateEmbedding(segment);
        embeddings.push(embedding);
      } catch (error) {
        console.error('Error generating embedding:', error);
        embeddings.push(new Array(768).fill(0));
      }
    }
    
    return embeddings;
  }

  groupBySimilarity(segments, embeddings, originalTranscript) {
    if (segments.length === 0) {
      return [];
    }
    
    const chunks = [];
    const used = new Set();
    let chunkId = 1;
    
    for (let i = 0; i < segments.length; i++) {
      if (used.has(i)) continue;
      
      const currentChunk = {
        id: `chunk-${chunkId++}`,
        segments: [segments[i]],
        indices: [i],
        text: '',
        topic: '',
        startPosition: 0,
        endPosition: 0
      };
      
      used.add(i);
      
      for (let j = i + 1; j < segments.length; j++) {
        if (used.has(j)) continue;
        
        const similarity = this.cosineSimilarity(embeddings[i], embeddings[j]);
        const combinedLength = currentChunk.segments.join(' ').length + segments[j].length;
        
        if (similarity >= this.similarityThreshold && combinedLength <= this.maxChunkSize) {
          currentChunk.segments.push(segments[j]);
          currentChunk.indices.push(j);
          used.add(j);
        }
      }
      
      currentChunk.text = currentChunk.segments.join(' ');
      
      const firstSegment = currentChunk.segments[0];
      currentChunk.startPosition = originalTranscript.indexOf(firstSegment);
      currentChunk.endPosition = currentChunk.startPosition + currentChunk.text.length;
      
      currentChunk.topic = this.generateTopicLabel(currentChunk.text);
      
      chunks.push(currentChunk);
    }
    
    return chunks;
  }

  cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
      return 0;
    }
    
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      mag1 += vec1[i] * vec1[i];
      mag2 += vec2[i] * vec2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    if (mag1 === 0 || mag2 === 0) {
      return 0;
    }
    
    return dotProduct / (mag1 * mag2);
  }

  generateTopicLabel(text) {
    const words = text.split(/\s+/).filter(w => w.length > 3);
    const topicWords = words.slice(0, 3).join(' ');
    return topicWords || 'General Discussion';
  }
}

export default ChunkingService;
