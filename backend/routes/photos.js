const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const exifParser = require('exif-parser');
const { body, validationResult } = require('express-validator');
const Photo = require('../models/Photo');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// AWS S3 setup
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    acl: 'public-read',
    key: function (req, file, cb) {
      const fileName = Date.now().toString() + '-' + file.originalname;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only images allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Upload photo route
router.post('/upload', authenticateJWT,
  upload.single('photo'),
  body('brand').notEmpty(),
  body('model').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !req.file) {
      return res.status(400).json({ errors: errors.array(), message: 'Missing required fields or file' });
    }

    try {
      // Compress image to WebP using sharp
      const buffer = await sharp(req.file.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      // Upload compressed image to S3 (overwrite original)
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: req.file.key,
        Body: buffer,
        ContentType: 'image/webp',
        ACL: 'public-read',
      };
      await s3.putObject(params).promise();

      // Extract EXIF data
      let exifData = {};
      try {
        const parser = exifParser.create(buffer);
        const result = parser.parse();
        exifData = {
          iso: result.tags.ISO,
          aperture: result.tags.FNumber,
          shutterSpeed: result.tags.ShutterSpeedValue,
          focalLength: result.tags.FocalLength,
        };
      } catch (exifErr) {
        console.warn('EXIF extraction failed:', exifErr);
      }

      // Create photo document
      const photo = new Photo({
        user: req.user.id,
        brand: req.body.brand,
        model: req.body.model,
        photoType: req.body.photoType || 'other',
        imageUrl: req.file.location,
        exifData,
      });
      await photo.save();

      res.json({ message: 'Photo uploaded successfully', photo });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// Search photos route
router.get('/search', async (req, res) => {
  const { brand, model, photoType } = req.query;
  const filter = {};
  if (brand) filter.brand = brand;
  if (model) filter.model = model;
  if (photoType) filter.photoType = photoType;

  try {
    const photos = await Photo.find(filter).sort({ uploadDate: -1 }).limit(50);
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
