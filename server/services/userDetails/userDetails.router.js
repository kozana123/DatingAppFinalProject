import {Router} from 'express'
import {
    createNewUser,
    checkEmailExists,
    login,
    updateLocation,
    updateProfileImage,
    deleteUser,
    ChangePassword
  } from './userDetails.controller.js';
// import { auth } from '../../middlewares/auth.js';
import multer from 'multer';


function logger (req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
   };

const upload = multer()

const userDetailsRouter = Router()
userDetailsRouter.post('/register', upload.single('profileImageFile'), createNewUser);
userDetailsRouter.get('/check-email', checkEmailExists);
userDetailsRouter.post('/login', login);
userDetailsRouter.put('/location/:id', updateLocation);
userDetailsRouter.put('/profile-image/:userId', upload.single('profileImageFile'), updateProfileImage);
userDetailsRouter.delete('/delete/:id', deleteUser);
userDetailsRouter.put('/change-password/:id', ChangePassword);


export default userDetailsRouter;