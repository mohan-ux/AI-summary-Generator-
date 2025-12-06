import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createSummarizeRoute } from './routes/summarize.js';
import GeminiClient from './services/GeminiClient.js';
import TranscriptProcessor from './services/TranscriptProcessor.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';


app.use(express.json({ limit: '1mb' }));


app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));


const geminiClient = new GeminiClient(process.env.GEMINI_API_KEY);
const transcriptProcessor = new TranscriptProcessor(geminiClient);

app.use('/api', createSummarizeRoute(transcriptProcessor));


app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Accepting requests from ${FRONTEND_URL}`);
});
