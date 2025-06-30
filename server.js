const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { mergePdfs } = require('./merge');

const app = express();
const port = 3000;

// Create required folders if they don't exist
['uploads', 'public', 'templates'].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Serve static files
app.use('/public', express.static('public'));

// Set up multer for PDF upload
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'));
  }
});

// Serve the front-end UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates/index.html'));
});

// Handle merge POST route
app.post('/merge', upload.array('pdfs', 2), async (req, res) => {
  console.log('📥 Files received:', req.files);

  if (!req.files || req.files.length !== 2) {
    return res.status(400).send('Please upload exactly 2 PDF files.');
  }

  const [file1, file2] = req.files.map(f => path.join(__dirname, f.path));

  try {
    await mergePdfs(file1, file2);

    // Optional cleanup
    req.files.forEach(f => fs.unlink(f.path, () => {}));

    res.redirect('/public/merged.pdf');
  } catch (err) {
    console.error('❌ Merge failed:', err.message);
    res.status(500).send('Merge failed');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});


 