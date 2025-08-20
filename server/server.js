import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import 'dotenv/config'
import { initIO } from './socket.js';
import { errorHandler } from './middlewares/errorHandler.js';
import v1Router from './routers/v1.js';
import { connectDB, closeDB } from './db.js';

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
const PORT = process.env.PORT || 3501;
initIO(httpServer);


async function startServer() {
  try {
    await connectDB(); // connect once at startup

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

    // Graceful shutdown (when Ctrl+C or kill signal is sent)
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down server...');
      await closeDB();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Shutting down server...');
      await closeDB();
      process.exit(0);
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// httpServer.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
//   // console.log(`🌐 Web client at      http://<your-ip>:${PORT}/webclient.html`);
// });