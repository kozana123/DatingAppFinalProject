import { Router } from "express";
import { upload } from "../../globals.js";
import {uploadUserPic, updateUserPic, getAllUsersPic, getUserPic, uplaodCloudinary} from './upload.controller.js'



const uploadRouter = Router();


uploadRouter
    .get('/pic/',getAllUsersPic)
    .get('/pic/:email',getUserPic)
    .post('/pic/profile/:email', upload.single('pic') ,uploadUserPic)
    .post('/cloud', upload.single('pic') ,uplaodCloudinary)
    .put('/pic/:email', updateUserPic)

    

export default uploadRouter;