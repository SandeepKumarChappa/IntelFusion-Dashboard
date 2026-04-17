const mongoose = require('mongoose');

const IntelligenceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  sourceType: {
    type: String,
    enum: ['OSINT', 'HUMINT', 'IMINT'],
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  imageUrl: {
    type: String,
    default: null,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // AI Enhanced Fields
  sentimentScore: {
    type: Number,
    default: 0,
  },
  keywords: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Intelligence', IntelligenceSchema);
