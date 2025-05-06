import { Router } from "express";
import { upload } from "../../globals.js";
import {uploadUserPic, updateUserPic, getAllUsersPic, getUserPic} from './upload.controller.js'


const uploadRouter = Router();


uploadRouter
    .get('/pic/',getAllUsersPic)
    .get('/pic/:email',getUserPic)
    .post('/pic/profile/:email', upload.single('pic') ,uploadUserPic)
    .put('/pic/:email', updateUserPic)
    

export default uploadRouter;