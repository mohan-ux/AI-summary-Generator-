# Design Document

## Overview

The AI Meeting Summary Generator is a full-stack web application consisting of a React frontend, Node.js/Express backend, and integration with Google's Gemini 2.5 Flash AI model. The system processes meeting transcripts through a multi-stage pipeline: semantic chunking using embeddings, information extraction, and structured output generation. The architecture follows a clean separation of concerns with dedicated layers for presentation, API communication, business logic, and AI integration.

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Input        │  │ Results      │  │ Error        │      │
│  │ Component    │  │ Display      │  │ Handling     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Node.js/Express)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              API Layer (Express Routes)               │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │              Service Layer                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │ Transcript   │  │ Chunking     │  │ Summary   │  │   │
│  │  │ Processor    │  │ Service      │  │ Generator │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │                                      │
│  ┌────────────────────▼─────────────────────────────────┐   │
│  │           AI Integration Layer                        │   │
│  │  ┌──────────────┐  ┌──────────────┐                  │   │
│  │  │ Gemini       │  │ Embedding    │                  │   │
│  │  │ Client       │  │ Generator    │                  │   │
│  │  └──────────────┘  └──────────────┘                  │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ API Calls
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Google Gemini 2.5 Flash API                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.x
- Axios for HTTP requests
- CSS Modules or Tailwind CSS for styling
- React hooks for state management

**Backend:**
- Node.js 18.x or higher
- Express.js 4.x for API routing
- @google/generative-ai SDK for Gemini integration
- dotenv for environment configuration
- cors for cross-origin requests

**AI Services:**
- Google Gemini 2.5 Flash for text generation and analysis
- Gemini Embedding API for semantic vector generation

## Components and Interfaces

### Frontend Components

#### 1. TranscriptInput Component
**Purpose:** Accepts user input for meeting transcripts

**Props:**
```typescript
interface TranscriptInputProps {
  onSubmit: (transcript: string) => void;
  isLoading: boolean;
}
```

**Responsibilities:**
- Render textarea for transcript input
- Validate minimum character length (50 chars)
- Validate maximum character length (50,000 chars)
- Display character count
- Trigger submission to backend

#### 2. ResultsDisplay Component
**Purpose:** Shows processed meeting summary and extracted information

**Props:**
```typescript
interface ResultsDisplayProps {
  summary: string[];
  actionItems: ActionItem[];
  timeline: TimelineSummary;
  ambiguities: AmbiguousSegment[];
}
```

**Responsibilities:**
- Display summary as formatted bullet points
- Render action items table
- Show timeline in chronological sections
- Highlight ambiguous segments with warnings

#### 3. LoadingIndicator Component
**Purpose:** Provides visual feedback during processing

**Responsibilities:**
- Display spinner or progress animation
- Show processing status messages

#### 4. ErrorDisplay Component
**Purpose:** Shows user-friendly error messages

**Props:**
```typescript
interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}
```

### Backend Services

#### 1. TranscriptProcessor Service
**Purpose:** Orchestrates the entire transcript processing pipeline

**Interface:**
```typescript
class TranscriptProcessor {
  async process(transcript: string): Promise<ProcessedResult>;
}

interface ProcessedResult {
  summary: string[];
  actionItems: ActionItem[];
  timeline: TimelineSummary;
  ambiguities: AmbiguousSegment[];
}
```

**Responsibilities:**
- Validate input transcript
- Coordinate chunking, extraction, and summarization
- Aggregate results from all services

#### 2. ChunkingService
**Purpose:** Splits transcripts into semantic chunks using embeddings

**Interface:**
```typescript
class ChunkingService {
  async chunkTranscript(transcript: string): Promise<SemanticChunk[]>;
  private splitIntoSegments(text: string): string[];
  private generateEmbeddings(segments: string[]): Promise<number[][]>;
  private groupBySimilarity(segments: string[], embeddings: number[][]): SemanticChunk[];
}

interface SemanticChunk {
  id: string;
  text: string;
  topic: string;
  startPosition: number;
  endPosition: number;
}
```

**Responsibilities:**
- Split transcript into sentences/paragraphs
- Generate embeddings for each segment
- Group similar segments using cosine similarity
- Assign topic labels to chunks

#### 3. SummaryGenerator Service
**Purpose:** Generates summaries, extracts information, and identifies ambiguities

**Interface:**
```typescript
class SummaryGenerator {
  async generateSummary(chunks: SemanticChunk[]): Promise<string[]>;
  async extractActionItems(chunks: SemanticChunk[]): Promise<ActionItem[]>;
  async generateTimeline(chunks: SemanticChunk[]): Promise<TimelineSummary>;
  async identifyAmbiguities(transcript: string): Promise<AmbiguousSegment[]>;
}
```

**Responsibilities:**
- Use Gemini to create concise summaries
- Extract action items with owners and deadlines
- Generate timeline-based summary
- Detect low-quality transcript segments

#### 4. GeminiClient Service
**Purpose:** Handles all interactions with Gemini API

**Interface:**
```typescript
class GeminiClient {
  async generateText(prompt: string, options?: GenerationOptions): Promise<string>;
  async generateEmbedding(text: string): Promise<number[]>;
  async generateStructuredOutput<T>(prompt: string, schema: Schema): Promise<T>;
}
```

**Responsibilities:**
- Initialize Gemini SDK with API key
- Send prompts and receive responses
- Handle rate limiting and retries
- Parse and validate AI responses

### API Endpoints

#### POST /api/summarize
**Purpose:** Process a meeting transcript and return structured results

**Request:**
```json
{
  "transcript": "string (50-50000 characters)"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "summary": ["string", "string", ...],
    "actionItems": [
      {
        "task": "string",
        "owner": "string | null",
        "deadline": "string | null"
      }
    ],
    "timeline": {
      "beginning": ["string", ...],
      "middle": ["string", ...],
      "end": ["string", ...]
    },
    "ambiguities": [
      {
        "segment": "string",
        "position": "number",
        "reason": "string"
      }
    ]
  }
}
```

**Response (Error - 400/500):**
```json
{
  "success": false,
  "error": "string"
}
```

## Data Models

### ActionItem
```typescript
interface ActionItem {
  task: string;           // Description of the action item
  owner: string | null;   // Person responsible (null if unassigned)
  deadline: string | null; // Deadline (null if not specified)
}
```

### TimelineSummary
```typescript
interface TimelineSummary {
  beginning: string[];  // Introductions, previous task reviews
  middle: string[];     // Main discussions, problems, decisions
  end: string[];        // Final action items, closing statements
}
```

### AmbiguousSegment
```typescript
interface AmbiguousSegment {
  segment: string;   // The unclear text segment
  position: number;  // Character position in original transcript
  reason: string;    // Why it's ambiguous (e.g., "incomplete sentence", "missing speaker")
}
```

### SemanticChunk
```typescript
interface SemanticChunk {
  id: string;          // Unique identifier
  text: string;        // Chunk content
  topic: string;       // Inferred topic label
  startPosition: number; // Start position in original transcript
  endPosition: number;   // End position in original transcript
}
```

### ProcessingRequest
```typescript
interface ProcessingRequest {
  transcript: string;
}
```

### ProcessingResponse
```typescript
interface ProcessingResponse {
  success: boolean;
  data?: {
    summary: string[];
    actionItems: ActionItem[];
    timeline: TimelineSummary;
    ambiguities: AmbiguousSegment[];
  };
  error?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Input length validation
*For any* transcript input, if the length is less than 50 characters or greater than 50,000 characters, the system should reject it with an appropriate error message
**Validates: Requirements 1.2, 1.4, 1.5**

### Property 2: API request-response integrity
*For any* valid transcript submitted to the API, the response should contain all four required fields: summary, actionItems, timeline, and ambiguities
**Validates: Requirements 1.3, 4.3, 8.3**

### Property 3: Semantic chunking produces output
*For any* valid transcript, the chunking process should produce at least one semantic chunk with a non-empty topic label
**Validates: Requirements 2.1, 2.5**

### Property 4: Embedding generation completeness
*For any* set of text segments, the number of generated embeddings should equal the number of input segments
**Validates: Requirements 2.2**

### Property 5: Chunk size constraints
*For any* transcript that allows it, semantic chunks should contain between 100 and 1000 characters
**Validates: Requirements 2.4**

### Property 6: Summary length constraint
*For any* processed transcript, the generated summary should contain between 5 and 10 bullet points
**Validates: Requirements 4.1**

### Property 7: Action item structure completeness
*For any* extracted action item, it should have three fields: task (non-empty string), owner (string or null), and deadline (string or null)
**Validates: Requirements 5.1, 5.2**

### Property 8: Frontend null value handling
*For any* action item with null owner or null deadline, the frontend should display "Unassigned" for null owners and "Not specified" for null deadlines
**Validates: Requirements 5.4, 5.5**

### Property 9: Timeline structure completeness
*For any* processed transcript, the timeline should contain all three sections: beginning, middle, and end, each with at least one item
**Validates: Requirements 6.1**

### Property 10: Ambiguity detection with position tracking
*For any* identified ambiguous segment, it should include the segment text, position in the original transcript, and a reason for the ambiguity
**Validates: Requirements 7.1, 7.2, 7.3, 7.4**

### Property 11: API error handling
*For any* request that causes an error, the API should return a non-200 HTTP status code and a response containing an error message
**Validates: Requirements 8.4**

### Property 12: CORS header presence
*For any* API response, it should include appropriate CORS headers to allow cross-origin requests
**Validates: Requirements 8.5**

### Property 13: Gemini embedding output format
*For any* text segment processed for embeddings, the output should be a numeric array (vector) with consistent dimensionality
**Validates: Requirements 9.2**

### Property 14: Retry logic on rate limits
*For any* rate limit error from the Gemini API, the system should retry the request with exponential backoff
**Validates: Requirements 9.5**

### Property 15: Frontend loading state
*For any* transcript submission, the frontend should display a loading indicator until the API response is received
**Validates: Requirements 10.2**

### Property 16: Frontend error display
*For any* error that occurs, the frontend should display a user-friendly error message
**Validates: Requirements 10.5**

## Error Handling

### Input Validation Errors
- **Empty or too short transcript**: Return 400 Bad Request with message "Transcript must be at least 50 characters"
- **Transcript too long**: Return 400 Bad Request with message "Transcript must not exceed 50,000 characters"
- **Missing transcript field**: Return 400 Bad Request with message "Transcript field is required"

### AI Service Errors
- **Gemini API unavailable**: Return 503 Service Unavailable with message "AI service temporarily unavailable, please try again"
- **Rate limit exceeded**: Implement exponential backoff (1s, 2s, 4s, 8s) up to 3 retries, then return 429 Too Many Requests
- **Invalid API key**: Return 500 Internal Server Error with message "Configuration error" (log actual error server-side)
- **Malformed AI response**: Retry once, if still fails return 500 with message "Failed to process transcript"

### Processing Errors
- **Chunking failure**: Return 500 Internal Server Error with message "Failed to analyze transcript structure"
- **Extraction failure**: Return partial results with warning flag indicating incomplete processing
- **Timeout**: Set 60-second timeout for entire processing pipeline, return 504 Gateway Timeout if exceeded

### Frontend Error Handling
- **Network errors**: Display "Unable to connect to server. Please check your internet connection."
- **Server errors (5xx)**: Display "Server error occurred. Please try again later."
- **Client errors (4xx)**: Display specific error message from API response
- **Timeout**: Display "Request timed out. Please try with a shorter transcript."

## Testing Strategy

### Unit Testing

The system will use **Jest** as the primary testing framework for both frontend and backend unit tests.

**Backend Unit Tests:**
- Input validation functions (character length, required fields)
- Text segmentation logic (sentence/paragraph splitting)
- Cosine similarity calculations for chunk grouping
- API endpoint request/response handling
- Error handling and status code generation
- CORS configuration

**Frontend Unit Tests:**
- Component rendering with different props
- Form validation logic
- State management during submission
- Error message display logic
- Default value rendering ("Unassigned", "Not specified")

**Test Coverage Goals:**
- Minimum 80% code coverage for business logic
- 100% coverage for validation and error handling functions
- Focus on edge cases: empty inputs, boundary values, malformed data

### Property-Based Testing

The system will use **fast-check** (for JavaScript/TypeScript) as the property-based testing library.

**Configuration:**
- Each property-based test MUST run a minimum of 100 iterations
- Each test MUST be tagged with a comment referencing the correctness property from this design document
- Tag format: `// Feature: ai-meeting-summarizer, Property {number}: {property_text}`

**Property-Based Tests:**

Each correctness property listed in the Correctness Properties section will be implemented as a single property-based test:

1. **Property 1 Test**: Generate random strings of various lengths, verify rejection of invalid lengths
2. **Property 2 Test**: Generate random valid transcripts, verify all four response fields are present
3. **Property 3 Test**: Generate random valid transcripts, verify at least one chunk with topic is produced
4. **Property 4 Test**: Generate random segment arrays, verify embedding count matches segment count
5. **Property 5 Test**: Generate random transcripts, verify chunk sizes fall within 100-1000 character range
6. **Property 6 Test**: Generate random valid transcripts, verify summary has 5-10 bullet points
7. **Property 7 Test**: Generate random action items, verify all have task, owner, and deadline fields
8. **Property 8 Test**: Generate action items with null values, verify frontend displays correct defaults
9. **Property 9 Test**: Generate random valid transcripts, verify timeline has all three sections
10. **Property 10 Test**: Generate transcripts with ambiguities, verify detected segments have text, position, and reason
11. **Property 11 Test**: Generate error conditions, verify non-200 status and error message
12. **Property 12 Test**: Generate random API requests, verify CORS headers in all responses
13. **Property 13 Test**: Generate random text segments, verify embeddings are numeric arrays
14. **Property 14 Test**: Simulate rate limit errors, verify retry attempts with exponential backoff
15. **Property 15 Test**: Generate random submissions, verify loading indicator appears
16. **Property 16 Test**: Generate random errors, verify error messages are displayed

**Generator Strategies:**
- **Transcript generator**: Create strings with varying lengths, speaker patterns, and content types
- **Ambiguous text generator**: Include incomplete sentences, missing speakers, fragmented phrases
- **Action item generator**: Create text with task descriptions, names, and date patterns
- **Error condition generator**: Simulate various failure scenarios (network, API, validation)

### Integration Testing

**API Integration Tests:**
- End-to-end flow: submit transcript → receive complete results
- Error scenarios: invalid input → appropriate error response
- Timeout handling: long processing → timeout response

**Frontend-Backend Integration:**
- Full user flow: input → submit → loading → results display
- Error flow: invalid input → error message display
- Network failure: connection error → user-friendly message

### Testing Approach

The system follows **implementation-first development**:
1. Implement the feature or component
2. Write unit tests to verify specific behaviors
3. Write property-based tests to verify universal properties
4. Run integration tests to verify end-to-end flows

This approach ensures that tests validate real, working functionality rather than mocked behavior.

## Performance Considerations

### Backend Performance
- **Chunking optimization**: Process segments in batches to reduce API calls
- **Caching**: Cache embeddings for identical text segments (optional enhancement)
- **Parallel processing**: Process independent chunks concurrently where possible
- **Timeout management**: Set reasonable timeouts (60s total) to prevent hanging requests

### Frontend Performance
- **Lazy loading**: Load results sections progressively as they become available
- **Debouncing**: Debounce character count updates to reduce re-renders
- **Optimistic UI**: Show immediate feedback on submission before API response

### API Rate Limiting
- **Exponential backoff**: Implement retry logic with 1s, 2s, 4s, 8s delays
- **Request queuing**: Queue multiple requests if needed (future enhancement)
- **Error recovery**: Gracefully handle rate limit errors with user feedback

## Security Considerations

### API Key Management
- Store Gemini API key in environment variables (`.env` file)
- Never expose API key in frontend code
- Use `.gitignore` to prevent committing `.env` files

### Input Sanitization
- Validate transcript length before processing
- Sanitize user input to prevent injection attacks
- Limit request size to prevent DoS attacks

### CORS Configuration
- Configure CORS to allow only trusted frontend origins in production
- Use wildcard (`*`) only in development environment

### Error Message Safety
- Never expose internal error details to frontend
- Log detailed errors server-side only
- Return generic error messages to users

## Deployment Considerations

### Environment Variables
```
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development|production
FRONTEND_URL=http://localhost:3000
```

### Folder Structure
```
ai-meeting-summarizer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TranscriptInput.jsx
│   │   │   ├── ResultsDisplay.jsx
│   │   │   ├── LoadingIndicator.jsx
│   │   │   └── ErrorDisplay.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── summarize.js
│   │   ├── services/
│   │   │   ├── TranscriptProcessor.js
│   │   │   ├── ChunkingService.js
│   │   │   ├── SummaryGenerator.js
│   │   │   └── GeminiClient.js
│   │   ├── utils/
│   │   │   └── validation.js
│   │   └── server.js
│   ├── tests/
│   │   ├── unit/
│   │   └── property/
│   ├── .env
│   └── package.json
└── README.md
```

### Development Workflow
1. Start backend server: `cd backend && npm run dev`
2. Start frontend dev server: `cd frontend && npm start`
3. Backend runs on `http://localhost:3001`
4. Frontend runs on `http://localhost:3000`
5. Frontend proxies API requests to backend

### Production Deployment
- Build frontend: `npm run build` (creates optimized static files)
- Serve frontend static files from backend or separate CDN
- Use process manager (PM2) for backend Node.js process
- Set `NODE_ENV=production` for production optimizations
- Use reverse proxy (nginx) for SSL and load balancing
