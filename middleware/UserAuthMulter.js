import multer from "multer";
import path from "path";
import fs from "fs";

// const createMulter = () => {
//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       const type = req.body.type?.toUpperCase();
//       let uploadPath = "";

//       if (type === "USER" && file.fieldname === "image") {
//         uploadPath = path.join(process.cwd(), "uploads/UserImage/profileImage");
//       } else if (type === "VENDOR" && file.fieldname === "image") {
//         uploadPath = path.join(
//           process.cwd(),
//           "uploads/VenderImage/profileImage"
//         );
//       } else if (type === "VENDOR" && file.fieldname === "previous_job") {
//         uploadPath = path.join(
//           process.cwd(),
//           "uploads/VenderImage/previousImage"
//         );
//       } else {
//         return cb(new Error("Invalid upload type or field"), false);
//       }

//       if (!fs.existsSync(uploadPath))
//         fs.mkdirSync(uploadPath, { recursive: true });
//       cb(null, uploadPath);
//     },

//     filename: (req, file, cb) => {
//       const now = new Date();
//       const timestamp = `${now.getDate()}-${
//         now.getMonth() + 1
//       }-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
//       const cleanName = file.originalname.replace(/\s+/g, "_");
//       cb(null, `${timestamp}_${cleanName}`);
//     },
//   });

//   const fileFilter = (req, file, cb) => {
//     const allowed = /jpeg|jpg|png|webp/;
//     const ext = path.extname(file.originalname).toLowerCase();
//     allowed.test(ext) ? cb(null, true) : cb(new Error(" jpeg, jpg, png, webp"));
//   };

//   return multer({ storage, fileFilter }).fields([
//     { name: "image", maxCount: 1 },
//     { name: "previous_job", maxCount: 5 },
//   ]);
// };

const createMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      //  Support type from query as well as body
      const type = (req.body.type || req.query.type || "").toUpperCase();
      let uploadPath = "";

      if (type === "USER" && file.fieldname === "image") {
        uploadPath = path.join(process.cwd(), "uploads/UserImage/profileImage");
      } else if (type === "VENDOR" && file.fieldname === "image") {
        uploadPath = path.join(
          process.cwd(),
          "uploads/VenderImage/profileImage"
        );
      } else if (type === "VENDOR" && file.fieldname === "previous_job") {
        uploadPath = path.join(
          process.cwd(),
          "uploads/VenderImage/previousImage"
        );
      } else {
        return cb(new Error("Invalid upload type or field"), false);
      }

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
      const now = new Date();
      const timestamp = `${now.getDate()}-${
        now.getMonth() + 1
      }-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
      const cleanName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${timestamp}_${cleanName}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.test(ext)
      ? cb(null, true)
      : cb(new Error("Only jpeg, jpg, png, webp allowed"));
  };

  return multer({ storage, fileFilter }).fields([
    { name: "image", maxCount: 1 },
    { name: "previous_job", maxCount: 5 },
  ]);
};

export default createMulter;
