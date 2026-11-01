function validateInput({ file, filename, appName }) {
  const errors = [];

  if (!file) {
    errors.push("Hanya Menerima Foto Bukan URL");
  } else {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      errors.push("Hanya Menerima Foto Bukan URL");
    }
  }

  if (!filename || !filename.trim()) {
    errors.push("Nama File Tidak Boleh Kosong");
  }

  if (!appName || !appName.trim()) {
    errors.push("Nama Aplikasi Tidak Boleh Kosong");
  }

  return errors;
}

module.exports = {
  validateInput
};
