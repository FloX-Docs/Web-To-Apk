const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;

    cb(null, `${name}${ext}`);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE || 5242880)
  },

  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg"
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(null, false);
    }

    cb(null, true);
  }
});

module.exports = upload;
