import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * Reusable multer setup
 * @param {String} mainFolder - Main folder (e.g. 'UserImage' or 'VendorImage')
 * @param {String} subFolder - Optional subfolder inside main folder (e.g. 'profileImage')
 */
const createMulter = (mainFolder, subFolder = "") => {
  // Build full upload path
  const uploadPath = subFolder
    ? path.join(process.cwd(), "uploads", mainFolder, subFolder)
    : path.join(process.cwd(), "uploads", mainFolder);

  // Ensure folders exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
    console.log(`Created folder: uploads/${mainFolder}/${subFolder}`);
  }

  //  Storage config
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const now = new Date();
      const timestamp = `${now.getDate()}-${
        now.getMonth() + 1
      }-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
      const cleanName = file.originalname.replace(/\s+/g, "_"); // remove spaces
      const uniqueName = `${mainFolder.toUpperCase()}-${timestamp}_${cleanName}`;
      cb(null, uniqueName);
    },
  });

  //  File filter (only image types)
  const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) cb(null, true);
    else cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  };

  return multer({ storage, fileFilter });
};

export default createMulter;
