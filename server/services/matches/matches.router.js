import { Router } from 'express';
import { addMatch, getMatchedUsers } from './matches.controller.js';

const router = Router();

router.post('/add', addMatch);
router.get('/matched-users/:userId', getMatchedUsers);

export default router;
