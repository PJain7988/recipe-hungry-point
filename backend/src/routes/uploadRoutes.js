const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { protect } = require('../middlewares/authMiddleware');

const upload = multer({ storage });

// Upload single image
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  res.status(200).json({
    status: 'success',
    url: req.file.path,
  });
});

module.exports = router;
