import {Router} from 'express'
import userDetailsRouter from '../services/userDetails/userDetails.router.js'
import userPreferencesRouter from '../services/userPreferences/userPreferences.router.js'
import matchRouter from '../services/matches/matches.router.js'; 
import videoChatsRouter from '../services/videoChats/videoChats.router.js'; 
import reportRouter from '../services/reports/reports.router.js'; 


const v1Router = new Router();

v1Router.use('/userDetails', userDetailsRouter)
v1Router.use('/videoChats', videoChatsRouter)
v1Router.use('/matches', matchRouter);  
v1Router.use('/userPreferences', userPreferencesRouter)
v1Router.use('/reports', reportRouter)


export default v1Router 