import {Router} from 'express'
import {getAllUsers, getUsersById, createNewUser, updateUser, deleteUser, loginUser} from './user.controller.js'
import { auth } from '../../middlewares/auth.js';

function logger (req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
   };


const userRouter = Router()

userRouter
    .get('/',logger, getAllUsers)
    .get('/profile/:email', getUsersById)
    .post('/', createNewUser)
    .post('/login', loginUser)
    .put('/:email', updateUser)
    .delete('/:email', auth ,deleteUser)

export default userRouter 