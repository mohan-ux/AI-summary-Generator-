# 🤖 AI Meeting Summarizer

> Transform your meeting transcripts into actionable insights with AI-powered analysis

A modern, full-stack web application that uses Google's Gemini 2.5 Flash AI to automatically analyze meeting transcripts and extract key information including summaries, action items, timeline breakdowns, and quality warnings.

![Landing Page](Screenshot%202025-12-06%20164154.png)

---

## ✨ Features

### 🎯 Core Functionality
- **Semantic Chunking** - Intelligently segments transcripts into topic-based sections using embedding vectors
- **Smart Extraction** - Identifies key discussion points, decisions, and action items automatically
- **Action Items Table** - Displays tasks with assigned owners and deadlines in an organized format
- **Timeline Summary** - Chronological breakdown showing beginning, middle, and end of meetings
- **Quality Detection** - Highlights ambiguous or unclear transcript segments for review

### 🎨 Modern UI/UX
- **Pastel Gradient Design** - Beautiful white to pink to purple gradient background
- **Glassmorphism Effects** - Frosted glass cards with backdrop blur
- **Smooth Animations** - Fluid transitions and hover effects throughout
- **Fully Responsive** - Works perfectly on mobile, tablet, and desktop devices
- **Real-time Validation** - Character counter with instant feedback

---

## 📸 Screenshots

### Landing Page
![Landing Page](Screenshot%202025-12-06%20164154.png)
*Clean, modern interface with gradient background and animated bot icon*

### Input Interface with Sample Transcript
![Input Interface](Screenshot%202025-12-06%20164306.png)
*Intuitive text area with character counter and validation*

### Loading State
![Loading State](Screenshot%202025-12-06%20164422.png)
*Beautiful loading animation with progress indicators*

### Results Display - Complete Analysis
![Results Display](Screenshot%202025-12-06%20164454.png)
*Comprehensive results showing summary, action items, timeline, and quality warnings*

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js 4** - Web application framework
- **Google Gemini 2.5 Flash** - AI model for text analysis
- **@google/generative-ai** - Official Gemini SDK
- **dotenv** - Environment variable management
- **cors** - Cross-origin resource sharing

### AI & Algorithms
- **Gemini 2.5 Flash** - Text generation and summarization
- **Text Embedding 004** - Semantic vector generation
- **Cosine Similarity** - Custom algorithm for semantic chunking
- **Exponential Backoff** - Retry logic for rate limiting

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-meeting-summarizer
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on `http://localhost:3001` ✅

6. **Start Frontend (New Terminal)**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:3000` ✅

7. **Open Browser**
   Navigate to `http://localhost:3000` and start analyzing! 🎉

---

## 📖 Usage Guide

### Step 1: Input Transcript
Paste your meeting transcript (50-50,000 characters) into the text area. The system accepts:
- Zoom transcripts
- Google Meet transcripts
- Manual meeting notes
- Any text format

### Step 2: Analyze
Click the "🚀 Analyze Meeting" button. The system will:
1. Validate your input
2. Chunk the transcript semantically
3. Generate embeddings
4. Extract key information
5. Create structured output

### Step 3: Review Results
View four comprehensive sections:
- **📝 Summary** - 5-10 key bullet points
- **✅ Action Items** - Tasks with owners and deadlines
- **⏱️ Timeline** - Beginning, middle, and end phases
- **⚠️ Quality Warnings** - Ambiguous segments detected

### Step 4: Analyze Another
Click "Analyze Another Transcript" to process a new meeting.

---

## 🏗️ Project Structure

```
ai-meeting-summarizer/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── summarize.js          # API endpoint
│   │   ├── services/
│   │   │   ├── GeminiClient.js       # AI integration
│   │   │   ├── ChunkingService.js    # Semantic segmentation
│   │   │   ├── SummaryGenerator.js   # Information extraction
│   │   │   └── TranscriptProcessor.js # Main orchestrator
│   │   ├── utils/
│   │   │   └── validation.js         # Input validation
│   │   └── server.js                 # Express server
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TranscriptInput.jsx   # Input component
│   │   │   ├── ResultsDisplay.jsx    # Results component
│   │   │   ├── LoadingIndicator.jsx  # Loading state
│   │   │   └── ErrorDisplay.jsx      # Error handling
│   │   ├── services/
│   │   │   └── api.js                # API client
│   │   ├── App.jsx                   # Main app
│   │   └── index.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── screenshots/                       # Application screenshots
├── README.md
└── .gitignore
```

---

## 🔌 API Documentation

### POST `/api/summarize`

Processes a meeting transcript and returns structured analysis.

**Request:**
```json
{
  "transcript": "John: Good morning team..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": [
      "Team discussed project status",
      "Decided to use AWS for backend",
      "Identified bugs in payment flow"
    ],
    "actionItems": [
      {
        "task": "Create UI mockups",
        "owner": "John",
        "deadline": "Next Monday"
      }
    ],
    "timeline": {
      "beginning": ["Meeting started with introductions"],
      "middle": ["Main discussion about features"],
      "end": ["Action items assigned"]
    },
    "ambiguities": [
      {
        "segment": "...",
        "position": 123,
        "reason": "Incomplete sentence"
      }
    ]
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": "Transcript must be at least 50 characters"
}
```

---

## 🧠 How It Works

### 1. Semantic Chunking Algorithm
```
Input Transcript
    ↓
Split into Segments (sentences/paragraphs)
    ↓
Generate Embeddings (768-dimensional vectors)
    ↓
Calculate Cosine Similarity
    ↓
Group Similar Segments (threshold: 0.7)
    ↓
Create Semantic Chunks (100-1000 chars)
```

### 2. Information Extraction
- **Gemini 2.5 Flash** analyzes each chunk
- Structured prompts ensure consistent output
- JSON parsing with fallback handling
- Retry logic with exponential backoff

### 3. Quality Detection
- Pattern matching for incomplete sentences
- Detection of missing speaker names
- Identification of unclear segments
- Position tracking in original transcript

---

## 🎨 Design Philosophy

### Color Palette
- **Primary**: Purple (#8b5cf6)
- **Secondary**: Pink (#ec4899)
- **Accent**: Orange (#f97316)
- **Background**: White → Pink (#ffdfef) → Purple (#d2b4f0)

### Design Principles
- **Minimalism** - Clean, uncluttered interface
- **Accessibility** - High contrast, readable fonts
- **Responsiveness** - Mobile-first approach
- **Performance** - Optimized animations and transitions

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
GEMINI_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Customization

**Adjust Chunk Size:**
```javascript
// backend/src/services/ChunkingService.js
this.minChunkSize = 100;  // Minimum characters
this.maxChunkSize = 1000; // Maximum characters
```

**Change Similarity Threshold:**
```javascript
// backend/src/services/ChunkingService.js
this.similarityThreshold = 0.7; // 0.0 to 1.0
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: "Gemini API key is required"**
- Ensure `.env` file exists in `backend/` directory
- Verify `GEMINI_API_KEY` is set correctly
- Check for typos in the key

**Error: "Port 3001 already in use"**
- Change `PORT` in `.env` to another number (e.g., 3002)
- Update proxy in `frontend/vite.config.js` to match

### Frontend Issues

**Error: "Cannot connect to server"**
- Ensure backend is running on port 3001
- Check proxy configuration in `vite.config.js`
- Verify CORS settings in backend

**Slow Processing**
- Normal for long transcripts (20-40 seconds)
- Check internet connection
- Verify Gemini API quota

---

## 🚢 Deployment

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
```
Output in `frontend/dist/`

**Backend:**
```bash
cd backend
NODE_ENV=production node src/server.js
```

### Deployment Options
- **Vercel** - Frontend hosting
- **Heroku** - Backend hosting
- **Railway** - Full-stack hosting
- **AWS** - EC2 or Lambda
- **DigitalOcean** - Droplets

---

## 📝 License

ISC License - Feel free to use for educational purposes.

---

## 👨‍💻 Author

Created as an assessment project demonstrating:
- Full-stack development skills
- AI integration expertise
- Modern UI/UX design
- Clean code architecture

---

## 🙏 Acknowledgments

- **Google Gemini** - AI model and API
- **React Team** - Frontend framework
- **Express.js** - Backend framework
- **Vite** - Build tool

---


**Made with ❤️ using React, Node.js, and Google Gemini AI**
