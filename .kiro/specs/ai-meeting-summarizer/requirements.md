# Requirements Document

## Introduction

The AI Meeting Summary Generator is a web-based system that transforms raw meeting transcripts (from Zoom, Google Meet, or other sources) into structured, actionable summaries. The system uses AI-powered semantic analysis to extract key discussion points, decisions, action items with owners, and generates timeline-based summaries while identifying ambiguous or low-quality transcript segments.

## Glossary

- **Meeting Transcript**: Raw text input containing conversation logs, voice-to-text output, or meeting notes from video conferencing platforms
- **Semantic Chunk**: A logically grouped segment of the transcript based on topic similarity using embedding vectors
- **Embedding**: A numerical vector representation of text that captures semantic meaning
- **Action Item**: A specific task that must be completed, typically assigned to a person with an optional deadline
- **Task Owner**: The person responsible for completing an action item
- **Ambiguous Segment**: A portion of the transcript that is unclear, incomplete, or of low quality
- **Frontend**: The React-based user interface component of the system
- **Backend**: The Node.js server component that processes requests and interfaces with AI services
- **API Layer**: The Express.js REST API that connects the frontend to backend services
- **Gemini Model**: Google's Gemini 2.5 Flash AI model used for text analysis and summarization

## Requirements

### Requirement 1

**User Story:** As a meeting participant, I want to input raw meeting transcripts into the system, so that I can process them for summarization.

#### Acceptance Criteria

1. WHEN a user accesses the application THEN the Frontend SHALL display an input interface with a text area for transcript entry
2. WHEN a user pastes text into the input area THEN the Frontend SHALL accept transcripts up to 50,000 characters in length
3. WHEN a user submits a transcript THEN the Frontend SHALL send the transcript data to the Backend via the API Layer
4. WHEN the Backend receives a transcript THEN the Backend SHALL validate that the transcript contains at least 50 characters before processing
5. WHEN transcript validation fails THEN the Backend SHALL return an error message to the Frontend indicating the validation failure reason

### Requirement 2

**User Story:** As a meeting participant, I want the system to split long transcripts into semantic chunks, so that related topics are grouped together for better analysis.

#### Acceptance Criteria

1. WHEN the Backend receives a valid transcript THEN the Backend SHALL split the transcript into individual sentences or paragraphs
2. WHEN text segments are created THEN the Backend SHALL generate Embedding vectors for each segment using the Gemini Model
3. WHEN Embedding vectors are generated THEN the Backend SHALL group similar vectors into Semantic Chunks based on cosine similarity thresholds
4. WHEN Semantic Chunks are created THEN the Backend SHALL ensure each chunk contains between 100 and 1000 characters where possible
5. WHEN chunking is complete THEN the Backend SHALL label each Semantic Chunk with a topic identifier for reference

### Requirement 3

**User Story:** As a meeting participant, I want the system to extract key information from each semantic chunk, so that I can understand what was discussed, decided, and assigned.

#### Acceptance Criteria

1. WHEN a Semantic Chunk is processed THEN the Backend SHALL use the Gemini Model to identify key discussion points within that chunk
2. WHEN a Semantic Chunk is processed THEN the Backend SHALL use the Gemini Model to extract decisions made within that chunk
3. WHEN a Semantic Chunk is processed THEN the Backend SHALL use the Gemini Model to identify Action Items within that chunk
4. WHEN an Action Item is identified THEN the Backend SHALL extract the Task Owner name if present in the text
5. WHEN an Action Item is identified THEN the Backend SHALL extract the deadline if present in the text

### Requirement 4

**User Story:** As a meeting participant, I want the system to generate a clean, concise meeting summary, so that I can quickly understand the meeting outcomes without reading the full transcript.

#### Acceptance Criteria

1. WHEN all Semantic Chunks are processed THEN the Backend SHALL use the Gemini Model to generate a summary containing 5 to 10 bullet points
2. WHEN generating the summary THEN the Backend SHALL ensure each bullet point is concise and captures a distinct aspect of the meeting
3. WHEN the summary is generated THEN the Backend SHALL return the summary to the Frontend via the API Layer
4. WHEN the Frontend receives the summary THEN the Frontend SHALL display the summary in a formatted, readable section
5. WHEN displaying the summary THEN the Frontend SHALL present bullet points in a clear, hierarchical structure

### Requirement 5

**User Story:** As a meeting participant, I want to see action items in a structured table format with owners and deadlines, so that I can track who is responsible for what tasks.

#### Acceptance Criteria

1. WHEN Action Items are extracted THEN the Backend SHALL structure them as records containing task description, Task Owner, and deadline fields
2. WHEN Action Items are structured THEN the Backend SHALL return them to the Frontend in a standardized JSON format
3. WHEN the Frontend receives Action Items THEN the Frontend SHALL display them in a table with columns for task, owner, and deadline
4. WHEN an Action Item lacks a Task Owner THEN the Frontend SHALL display "Unassigned" in the owner column
5. WHEN an Action Item lacks a deadline THEN the Frontend SHALL display "Not specified" in the deadline column

### Requirement 6

**User Story:** As a meeting participant, I want to see a timeline-based summary of the meeting, so that I can understand how the discussion progressed chronologically.

#### Acceptance Criteria

1. WHEN generating outputs THEN the Backend SHALL use the Gemini Model to create a timeline-based summary with beginning, middle, and end sections
2. WHEN creating the timeline summary THEN the Backend SHALL identify introductions and previous task reviews in the beginning section
3. WHEN creating the timeline summary THEN the Backend SHALL identify main discussions, problems, and decisions in the middle section
4. WHEN creating the timeline summary THEN the Backend SHALL identify final action items and closing statements in the end section
5. WHEN the Frontend receives the timeline summary THEN the Frontend SHALL display it in chronological sections with clear visual separation

### Requirement 7

**User Story:** As a meeting participant, I want the system to identify and highlight ambiguous or low-quality transcript segments, so that I can review unclear portions and improve future transcripts.

#### Acceptance Criteria

1. WHEN processing a transcript THEN the Backend SHALL use the Gemini Model to detect incomplete sentences or phrases indicating poor audio quality
2. WHEN processing a transcript THEN the Backend SHALL identify segments with missing or unclear speaker names
3. WHEN processing a transcript THEN the Backend SHALL detect very unclear or fragmented sentences
4. WHEN Ambiguous Segments are identified THEN the Backend SHALL record their position in the original transcript
5. WHEN the Frontend receives Ambiguous Segments THEN the Frontend SHALL display them with warning indicators and descriptive messages

### Requirement 8

**User Story:** As a developer, I want a well-structured API layer, so that the frontend and backend can communicate efficiently and the system is maintainable.

#### Acceptance Criteria

1. WHEN the Backend starts THEN the API Layer SHALL expose a POST endpoint at /api/summarize for transcript processing
2. WHEN the API Layer receives a request THEN the API Layer SHALL validate the request body contains a transcript field
3. WHEN processing is complete THEN the API Layer SHALL return a JSON response containing summary, action items, timeline, and ambiguous segments
4. WHEN an error occurs during processing THEN the API Layer SHALL return an appropriate HTTP status code and error message
5. WHEN the API Layer handles requests THEN the API Layer SHALL implement CORS headers to allow Frontend requests from different origins

### Requirement 9

**User Story:** As a developer, I want to integrate the Gemini 2.5 Flash model for AI processing, so that the system can perform intelligent text analysis and summarization.

#### Acceptance Criteria

1. WHEN the Backend initializes THEN the Backend SHALL configure the Gemini Model client with valid API credentials
2. WHEN generating embeddings THEN the Backend SHALL use the Gemini Model embedding API to create vector representations
3. WHEN extracting information THEN the Backend SHALL send structured prompts to the Gemini Model specifying the required output format
4. WHEN the Gemini Model returns results THEN the Backend SHALL parse and validate the response before further processing
5. WHEN API rate limits are encountered THEN the Backend SHALL implement retry logic with exponential backoff

### Requirement 10

**User Story:** As a user, I want a responsive and intuitive frontend interface, so that I can easily input transcripts and view results on any device.

#### Acceptance Criteria

1. WHEN the Frontend loads THEN the Frontend SHALL display a clean, section-by-section interface for input and results
2. WHEN a user submits a transcript THEN the Frontend SHALL display a loading indicator during processing
3. WHEN results are received THEN the Frontend SHALL display them in separate, clearly labeled sections for summary, action items, timeline, and ambiguities
4. WHEN displaying results THEN the Frontend SHALL ensure the interface is responsive and works on mobile, tablet, and desktop devices
5. WHEN an error occurs THEN the Frontend SHALL display user-friendly error messages with guidance on how to resolve the issue
