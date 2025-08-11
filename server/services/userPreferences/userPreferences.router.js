

import {Router} from 'express'
import {getAllUsers, getUsersById, createNewUserPreferences, updateUser, deleteUser, loginUser} from './userPreferences.controller.js'
import { auth } from '../../middlewares/auth.js';

function logger (req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
   };


const userPreferencesRouter = Router()

userPreferencesRouter
    .post('/register', createNewUserPreferences)
    .get('/',logger, getAllUsers)
    .get('/profile/:email', getUsersById)
    
    .post('/login', loginUser)
    .put('/:email', updateUser)
    .delete('/:email', auth ,deleteUser)

export default userPreferencesRouter 