import {Router} from 'express'
import {createNewUser} from './userDetails.controller.js'
// import { auth } from '../../middlewares/auth.js';
import multer from 'multer';


function logger (req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
   };

const upload = multer()
const userDetailsRouter = Router()

userDetailsRouter
    .post('/register', upload.single('profileImageFile') ,createNewUser)

    // .get('/',logger, getAllUsers)
    // .get('/profile/:email', getUsersById)
    // .post('/login', loginUser)
    // .put('/:email', updateUser)
    // .delete('/:email', auth ,deleteUser)

export default userDetailsRouter 