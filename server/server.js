import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';

import { initIO } from './socket.js';
import { errorHandler } from './middlewares/errorHandler.js';
import v1Router from './routers/v1.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static file serving for the web client ---
app.use('/', express.static(path.join(__dirname, 'static')));

// --- API routes ---
app.use('/api/v1', v1Router);

// --- Error handling ---
app.use(errorHandler);

// --- Create server and initialize Socket.IO ---
const httpServer = createServer(app);
const PORT = process.env.PORT || 3500;
initIO(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  // console.log(`🌐 Web client at      http://<your-ip>:${PORT}/webclient.html`);
});