const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  photoType: {
    type: String,
    enum: ['low-light', 'portrait', 'landscape', 'macro', 'other'],
    default: 'other',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  exifData: {
    iso: Number,
    aperture: Number,
    shutterSpeed: String,
    focalLength: String,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  flagged: {
    type: Boolean,
    default: false,
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
  }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    date: { type: Date, default: Date.now },
  }],
});

module.exports = mongoose.model('Photo', photoSchema);
