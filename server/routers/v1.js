import {Router} from 'express'
import userDetailsRouter from '../services/userDetails/userDetails.router.js'
import userPreferencesRouter from '../services/userPreferences/userPreferences.router.js'

const v1Router = new Router();

v1Router.use('/userDetails', userDetailsRouter)
v1Router.use('/upload', uploadRouter)
v1Router.use('/userPreferences', userPreferencesRouter)

export default v1Router 