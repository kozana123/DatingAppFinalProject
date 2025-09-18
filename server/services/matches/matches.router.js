import { Router } from 'express';
import { addMatch, getMatchedUsers, unMatchUser } from './matches.controller.js';

const router = Router();

router.post('/add', addMatch);
router.get('/matched-users/:userId', getMatchedUsers);
router.delete('/unmatch/:userId', unMatchUser)

export default router;
