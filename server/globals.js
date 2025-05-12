import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';


export const __filename = fileURLToPath(import.meta.url); 
export const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './DB/uploads/'); // יעד תיקיית
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.originalname.split('.')[0]}-${uniqueSuffix}.${file.originalname.split('.').pop()}`)
  },
});

export const upload = multer({ storage });