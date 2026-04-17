const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const Intelligence = require('../models/Intelligence');
const { analyzeText } = require('../services/aiService');

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Helper to save formatted data to DB
const processAndSaveData = async (dataArray) => {
  const processed = dataArray.map(item => {
    const aiData = analyzeText(item.description || '');
    return {
      title: item.title || 'Untitled',
      description: item.description || '',
      sourceType: item.sourceType || 'OSINT',
      location: {
        lat: parseFloat(item.lat || item.location?.lat || (Math.random() * 180 - 90).toFixed(4)),
        lng: parseFloat(item.lng || item.location?.lng || (Math.random() * 360 - 180).toFixed(4))
      },
      imageUrl: item.imageUrl || null,
      sentimentScore: aiData.sentimentScore,
      keywords: aiData.keywords
    };
  });
  await Intelligence.insertMany(processed);
  return processed;
};


// @route POST /api/upload
// @desc Upload CSV, JSON, or images (multipurpose endpoint)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      // If no file but there's a JSON body (single point submission)
      if (req.body.title && req.body.location) {
        await processAndSaveData([req.body]);
        return res.status(201).json({ message: 'Data saved successfully' });
      }
      return res.status(400).json({ error: 'No file or data provided' });
    }

    const fileExt = path.extname(file.originalname).toLowerCase();

    if (fileExt === '.csv') {
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          await processAndSaveData(results);
          res.status(201).json({ message: 'CSV parsed and saved successfully' });
        });
    } else if (fileExt === '.json') {
      const rawData = fs.readFileSync(file.path);
      const jsonData = JSON.parse(rawData);
      // Assume jsonData is an array of entries
      const arrayData = Array.isArray(jsonData) ? jsonData : [jsonData];
      await processAndSaveData(arrayData);
      res.status(201).json({ message: 'JSON parsed and saved successfully' });
    } else if (fileExt === '.jpg' || fileExt === '.jpeg' || fileExt === '.png') {
      // For images, we can save a single point using body fields
      const { title, description, lat, lng, sourceType } = req.body;
      const imageUrl = `/uploads/${file.filename}`;
      
      const aiData = analyzeText(description || '');
      
      const newPoint = new Intelligence({
        title: title || 'Image Upload',
        description: description || '',
        sourceType: sourceType || 'IMINT',
        location: {
          lat: parseFloat(lat || (Math.random() * 180 - 90).toFixed(4)),
          lng: parseFloat(lng || (Math.random() * 360 - 180).toFixed(4))
        },
        imageUrl,
        sentimentScore: aiData.sentimentScore,
        keywords: aiData.keywords
      });
      await newPoint.save();
      res.status(201).json({ message: 'Image and data saved successfully', data: newPoint });
    } else {
      res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server validation error on upload' });
  }
});


// @route GET /api/data
// @desc Get all intelligence points
router.get('/data', async (req, res) => {
  try {
    const { sourceType, search } = req.query;
    let query = {};
    
    if (sourceType) {
      query.sourceType = sourceType;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { keywords: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const data = await Intelligence.find(query).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching data' });
  }
});


// @route GET /api/data/:id
// @desc Get single intelligence point
router.get('/data/:id', async (req, res) => {
  try {
    const data = await Intelligence.findById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching point' });
  }
});

// @route DELETE /api/data/:id
// @desc Delete an intelligence point
router.delete('/data/:id', async (req, res) => {
  try {
    const data = await Intelligence.findByIdAndDelete(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error deleting point' });
  }
});

module.exports = router;
