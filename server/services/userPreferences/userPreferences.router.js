

import {Router} from 'express'
import { createNewUserPreferences, getPreferences, updateSearchingPreferences, updateUserPreferences} from './userPreferences.controller.js'
import { auth } from '../../middlewares/auth.js';

function logger (req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
   };


const userPreferencesRouter = Router()

userPreferencesRouter
    .post('/register', createNewUserPreferences)
    .get('/getUserById/:userId', getPreferences)
    .put('/updateSearching/:userId', updateSearchingPreferences)
    .put('/updateUser/:userId', updateUserPreferences)



    // .get('/',logger, getAllUsers)
    
    // .put('/:email', updateUser)
    // .delete('/:email', auth ,deleteUser)

export default userPreferencesRouter 