import {Router} from 'express'
import userRouter from '../services/users/user.router.js'
import uploadRouter from '../services/upload/upload.router.js'

const v1Router = new Router();

v1Router.use('/users', userRouter)
v1Router.use('/upload', uploadRouter)

export default v1Router 