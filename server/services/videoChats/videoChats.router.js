import { Router } from 'express';
import { addSession } from './videoChats.controller.js';

const router = Router();

router.post('/addSession', addSession);

export default router;
