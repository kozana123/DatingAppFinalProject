import express from 'express'
import cors from 'cors'
import morgan from 'morgan'


import {errorHandler} from './middlewares/errorHandler.js';
import v1Router from './routers/v1.js'

const PORT = 5500;
const server = express();

server.use(cors())
server.use(morgan('tiny'))

server.use(express.json());
server.use(express.urlencoded())

server.use('/api/v1', v1Router);

server.use(errorHandler);


server.listen(PORT, () => {
    console.log(`Server run in: http://localhost:${PORT}`);
    
})