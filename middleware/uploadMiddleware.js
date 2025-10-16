import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const createDirectories = () => {
  const directories = [
    "./uploads/UserImage/profileImage",
    "./uploads/VenderImage/previousImage"
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createDirectories();

// Storage configuration for User profile images
const userProfileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/UserImage/profileImage");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

// Storage configuration for Vendor images (profile + previous jobs)
const vendorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/VenderImage/previousImage");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create multer instances
const uploadUserProfile = multer({
  storage: userProfileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

const uploadVendorFiles = multer({
  storage: vendorStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: fileFilter,
});

// Dynamic middleware that chooses configuration based on user type
const dynamicUpload = (req, res, next) => {
  const { type } = req.query;
  
  if (type === "VENDOR") {
    // For vendors - multiple files (first file is profile, rest are previous jobs)
    uploadVendorFiles.array('files', 10)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: "1",
          message: err.message
        });
      }
      next();
    });
  } else {
    // For users - single profile image
    uploadUserProfile.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          status: "2",
          message: err.message
        });
      }
      next();
    });
  }
};

// Alternative: Separate middlewares for different use cases
const uploadSingle = uploadUserProfile.single("file");
const uploadMultiple = uploadVendorFiles.array("files", 10);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "3",
        message: "File too large. Please upload a smaller file.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        status: "4",
        message: "Too many files. Please upload fewer files.",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        status: "5",
        message: "Unexpected field. Please check your file upload field.",
      });
    }
  } else if (err) {
    return res.status(400).json({
      status: "6",
      message: err.message,
    });
  }
  next();
};

export {
  uploadUserProfile,
  uploadVendorFiles,
  dynamicUpload,
  uploadSingle,
  uploadMultiple,
  handleMulterError
};

export default dynamicUpload;