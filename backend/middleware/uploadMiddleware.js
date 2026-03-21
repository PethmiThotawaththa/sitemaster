const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
const inventoryUploadsDir = path.join(uploadsDir, 'inventory');
const projectsUploadsDir = path.join(uploadsDir, 'projects');

[uploadsDir, inventoryUploadsDir, projectsUploadsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination based on the route
    const isProjectRoute = req.originalUrl.includes('/projects');
    const uploadPath = isProjectRoute ? projectsUploadsDir : inventoryUploadsDir;
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images and documents for projects
  const isProjectRoute = req.originalUrl.includes('/projects');
  const allowedMimes = isProjectRoute
    ? ['image/', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    : ['image/'];

  if (allowedMimes.some(mime => file.mimetype.startsWith(mime))) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB limit
  }
});

module.exports = upload; 