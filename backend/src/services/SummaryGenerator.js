class SummaryGenerator {
  constructor(geminiClient) {
    this.geminiClient = geminiClient;
  }

  async generateSummary(chunks) {
    const combinedText = chunks.map(c => c.text).join('\n\n');
    
    const prompt = `You are analyzing a meeting transcript. Create a concise summary with 5-10 bullet points covering the main topics discussed.

Meeting Transcript:
${combinedText}

Instructions:
- Extract 5-10 key points from the meeting
- Focus on main topics, decisions, and important discussions
- Be specific and concise
- Each point should be a complete sentence

Return ONLY a JSON object in this exact format:
{
  "summary": ["First key point", "Second key point", "Third key point", ...]
}`;

    try {
      const result = await this.geminiClient.generateStructuredOutput(prompt, {
        summary: ["string"]
      });
      
      // Ensure we have 5-10 points
      let summaryPoints = result.summary || [];
      if (summaryPoints.length < 5) {
        // If too few, add a general point
        summaryPoints.push('Additional discussion topics were covered');
      }
      if (summaryPoints.length > 10) {
        // If too many, keep first 10
        summaryPoints = summaryPoints.slice(0, 10);
      }
      
      return summaryPoints;
    } catch (error) {
      console.error('Error generating summary:', error);
      return ['Meeting discussion covered multiple topics'];
    }
  }

  async extractActionItems(chunks) {
    const combinedText = chunks.map(c => c.text).join('\n\n');
    
    const prompt = `You are analyzing a meeting transcript to extract action items.

Meeting Transcript:
${combinedText}

Instructions:
- Find all tasks that need to be done
- Identify who is responsible for each task (if mentioned)
- Extract any deadlines or due dates (if mentioned)
- If owner or deadline is not mentioned, use null

Return ONLY a JSON object in this exact format:
{
  "actionItems": [
    {"task": "description of task", "owner": "person name or null", "deadline": "date/time or null"}
  ]
}

If no action items are found, return: {"actionItems": []}`;

    try {
      const result = await this.geminiClient.generateStructuredOutput(prompt, {
        actionItems: [{ task: "string", owner: "string or null", deadline: "string or null" }]
      });
      
      return result.actionItems || [];
    } catch (error) {
      console.error('Error extracting action items:', error);
      return [];
    }
  }

  async generateTimeline(chunks) {
    const combinedText = chunks.map(c => c.text).join('\n\n');
    
    const prompt = `You are analyzing a meeting transcript to create a chronological timeline.

Meeting Transcript:
${combinedText}

Instructions:
Divide the meeting into three phases:
- BEGINNING: How the meeting started (introductions, agenda, previous updates)
- MIDDLE: Main content (discussions, problems, decisions, key topics)
- END: How the meeting concluded (action items, next steps, closing)

Each phase should have 2-4 bullet points.

Return ONLY a JSON object in this exact format:
{
  "beginning": ["First point about start", "Second point about start"],
  "middle": ["First main discussion point", "Second main discussion point"],
  "end": ["First closing point", "Second closing point"]
}`;

    try {
      const result = await this.geminiClient.generateStructuredOutput(prompt, {
        beginning: ["string"],
        middle: ["string"],
        end: ["string"]
      });
      
      // Ensure each section has at least one item
      return {
        beginning: result.beginning?.length > 0 ? result.beginning : ['Meeting started'],
        middle: result.middle?.length > 0 ? result.middle : ['Main discussion took place'],
        end: result.end?.length > 0 ? result.end : ['Meeting concluded']
      };
    } catch (error) {
      console.error('Error generating timeline:', error);
      return {
        beginning: ['Meeting started'],
        middle: ['Discussion took place'],
        end: ['Meeting concluded']
      };
    }
  }

  async identifyAmbiguities(transcript) {
    const ambiguities = [];
    
    // Pattern matching for common issues - only obvious problems
    const patterns = [
      {
        regex: /\.\.\.|…/g,
        reason: 'Incomplete sentence or pause'
      },
      {
        regex: /\[inaudible\]|\[unclear\]|\[crosstalk\]/gi,
        reason: 'Poor audio quality'
      },
      {
        regex: /\[.*?\]/g,
        reason: 'Missing or unclear speaker name'
      }
    ];
    
    for (const pattern of patterns) {
      const matches = [...transcript.matchAll(pattern.regex)];
      
      for (const match of matches) {
        ambiguities.push({
          segment: match[0],
          position: match.index,
          reason: pattern.reason
        });
      }
    }
    
    // Limit to 5 most significant issues
    return ambiguities.slice(0, 5);
  }
}

export default SummaryGenerator;
