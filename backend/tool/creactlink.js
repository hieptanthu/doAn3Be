const multer = require('multer');
const path = require('path');

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Rename uploaded files
  }
});

// Initialize multer upload with storage
const upload = multer({ storage });

module.exports = upload;
