const express = require("express");
const fs = require("fs");
const path = require("path");

const upload = require("../middleware/upload");
const { validateInput } = require("../utils/validator");

const router = express.Router();

router.post(
  "/build",
  upload.single("photo"),
  async (req, res) => {
    try {
      const {
        filename,
        appName,
        websiteUrl
      } = req.body;

const errors = validateInput({
  file: req.file,
  filename,
  appName,
  websiteUrl
});

      if (errors.length > 0) {
        if (req.file?.path) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(403).json({
          status: 403,
          errors
        });
      }

      if (!websiteUrl || !websiteUrl.trim()) {
        if (req.file?.path) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(403).json({
          status: 403,
          errors: [
            "URL Website Tidak Boleh Kosong"
          ]
        });
      }

      const safeFilename = filename
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "");

      const apkFilename = `${safeFilename}.apk`;

      return res.status(200).json({
        status: 200,
        message:
          "Pembuatan Website Menuju Aplikasi Berhasil",
        filename: apkFilename,
        appName: appName.trim()
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        status: 500,
        message: "Terjadi Kesalahan Pada Server"
      });
    }
  }
);

module.exports = router;
