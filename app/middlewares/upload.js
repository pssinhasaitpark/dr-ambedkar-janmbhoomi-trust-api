const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const imageConversionMiddleware = (req, res, next) => {
  const BASE_PATH = path.join(__dirname, "../uploads");

  if (!fs.existsSync(BASE_PATH)) {
    fs.mkdirSync(BASE_PATH, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, BASE_PATH);
    },
    filename: function (req, file, cb) {
      const fileNameWithoutExt = path.parse(file.originalname).name;
      cb(null, fileNameWithoutExt + Date.now() + ".webp");
    },
  });

  const fileFilter = (req, file, cb) => {
    cb(null, true);
  };

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 * 5 },
    fileFilter: fileFilter,
  });



  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: "File upload failed." });
    }

    if (!req.file) {
      return res.status(400).send({ message: "No file was uploaded." });
    }

    const uploadedFilePath = path.join(__dirname, "../uploads", req.file.filename);
    const webpFileName = Date.now() + ".webp";
    const webpFilePath = path.join(__dirname, "../uploads", webpFileName);


    try {
      await sharp(uploadedFilePath)
        .webp({ quality: 80 })
        .toFile(webpFilePath);

      fs.unlinkSync(uploadedFilePath);


      req.file.webpPath = webpFilePath;

      next();
    } catch (error) {
      console.error("Error converting image to webp:", error);
      return res.status(500).send({ message: "Failed to convert image." });
    }
  });
};

const imageConversionMiddlewareMultiple = (req, res, next) => {
  const BASE_PATH = path.join(__dirname, "../uploads");

  if (!fs.existsSync(BASE_PATH)) {
    fs.mkdirSync(BASE_PATH, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, BASE_PATH);
    },
    filename: function (req, file, cb) {
      const fileNameWithoutExt = path.parse(file.originalname).name;
      cb(null, fileNameWithoutExt + Date.now() + path.extname(file.originalname));
    },
  });

  const fileFilter = (req, file, cb) => {
    cb(null, true); // You can add logic to filter file types if needed
  };

  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 * 5 }, // File size limit (5 MB)
    fileFilter: fileFilter,
  });

  upload.fields([
    { name: "birthplace_media", maxCount: 10 },
    { name: "events_media", maxCount: 10 },
    { name: "exhibitions_media", maxCount: 10 },
    { name: "online_media", maxCount: 10 },
    { name: "cover_image", maxCount: 10 },
    { name: "images", maxCount: 10 },
    { name: "image", maxCount: 10 },
    { name: "cover_image", maxCount: 10 },
    { name: "case_studies", maxCount: 10 },
    { name: "stories", maxCount: 10 }
  ])(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: "File upload failed." });
    }

    if (!req.files) {
      return res.status(400).send({ message: "No files were uploaded." });
    }

    const fileKeys = Object.keys(req.files);
    let convertedFiles = {};

    try {
      for (const key of fileKeys) {
        const files = req.files[key];
        const convertedFilePaths = [];

        for (const file of files) {
          const uploadedFilePath = path.join(BASE_PATH, file.filename);
          const webpFileName = Date.now() + "-" + file.originalname.split('.')[0] + ".webp";
          const webpFilePath = path.join(BASE_PATH, webpFileName);

          await sharp(uploadedFilePath)
            .webp({ quality: 80 })
            .toFile(webpFilePath);

          fs.unlinkSync(uploadedFilePath);

          const convertedFileUrl = `http://192.168.0.128:8080/media/${webpFileName}`;


          convertedFilePaths.push(convertedFileUrl);
        }

        convertedFiles[key] = convertedFilePaths;
      }


      req.convertedFiles = convertedFiles;

      next();
    } catch (error) {
      console.error("Error converting images to webp:", error);
      return res.status(500).send({ message: "Failed to convert images." });
    }
  });
};

module.exports = { imageConversionMiddleware, imageConversionMiddlewareMultiple };
