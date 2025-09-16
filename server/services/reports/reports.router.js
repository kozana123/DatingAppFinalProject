import { Router } from 'express';
import { addReport, } from './reports.controller.js';

const router = Router();

router.post('/report', addReport);


export default router;
