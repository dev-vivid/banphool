import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";

const createUploader = (folder: string) => {
  // Use import.meta.url or __dirname. Under CommonJS target, __dirname is still available.
  // Since we compile TS to CommonJS, __dirname is perfectly safe. Let's use path.resolve.
  const uploadPath = path.join(__dirname, "../../uploads", folder);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: any) => {
      cb(null, uploadPath);
    },

    filename: (req: Request, file: Express.Multer.File, cb: any) => {
      const ext = path.extname(file.originalname);
      const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

      cb(null, name);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
    const allowed = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP and PDF files are allowed."));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  });
};

export default createUploader;
export { createUploader };