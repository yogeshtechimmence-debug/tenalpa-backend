import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * ✅ Reusable Multer Setup
 * @param {string} mainFolder - Main folder name (e.g. 'UserImage', 'VenderImage')
 * @param {string} subFolder - Optional subfolder name (e.g. 'profileImage', 'previousImage')
 * @returns {multer} - Configured multer instance
 */
const createMulter = (mainFolder, subFolder = "") => {
  // 🔹 Build the upload path
  const uploadPath = subFolder
    ? path.join(process.cwd(), "uploads", mainFolder, subFolder)
    : path.join(process.cwd(), "uploads", mainFolder);

  // 🔹 Ensure upload directory exists
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`📁 Created folder: uploads/${mainFolder}/${subFolder}`);
  }

  // 🔹 Storage configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const now = new Date();
      const timestamp = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
      const cleanName = file.originalname.replace(/\s+/g, "_"); // replace spaces
      const uniqueName = `${mainFolder.toUpperCase()}-${timestamp}_${cleanName}`;
      cb(null, uniqueName);
    },
  });

  // 🔹 File filter (allow only images)
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"));
  };

  // 🔹 Return multer instance
  return multer({ storage, fileFilter });
};

export default createMulter;
