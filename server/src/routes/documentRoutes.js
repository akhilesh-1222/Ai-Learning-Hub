import express from 'express';
import multer from 'multer';
import { protect } from '../middlewares/authMiddleware.js';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/documentController.js';

const router = express.Router();

// Configure multer for memory storage with 4MB safety limit to protect Render free RAM
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit (prevents 512MB RAM OOM crash on Render)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Middleware wrapper to return clean errors on file size or format mismatch
const uploadMiddleware = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'PDF size exceeds the 4MB limit for the free tier.' });
      }
      return res.status(400).json({ message: err.message || 'File upload error' });
    }
    next();
  });
};

router.route('/')
  .get(protect, getDocuments);

router.route('/upload')
  .post(protect, uploadMiddleware, uploadDocument);

router.route('/:id')
  .delete(protect, deleteDocument);

export default router;
