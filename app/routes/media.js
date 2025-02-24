const { getFileStream } = require("../middlewares/gridfs");

app.get("/file/:fileId", (req, res) => {
  const { fileId } = req.params;

  const fileStream = getFileStream(fileId);

  fileStream.pipe(res);
});
