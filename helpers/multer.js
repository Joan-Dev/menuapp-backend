import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    
    const storage = multer.diskStorage({
        destination: path.join(__dirname, '../public/uploads'),
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    })

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Este archivo no es jpeg/png image'), false);
        }
    }

    const upload = multer({

        storage,
        dest: path.join(__dirname, 'public/uploads'),
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter
    })

export { upload };