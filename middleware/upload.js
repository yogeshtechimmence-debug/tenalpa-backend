import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Reusable multer setup
 * @param {String} folderName - folder inside /uploads (e.g. 'banner', 'user', 'product')
 */
const createMulter = (folderName) => {
  // Ensure folder exists
  const uploadPath = path.join(process.cwd(), "uploads", folderName);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`✅ uploads/${folderName} folder created automatically`);
  }

  // Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  });

  // Optional file filter
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    }
  };

  return multer({ storage, fileFilter });
};

export default createMulter;
