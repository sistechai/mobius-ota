const fs = require('fs')
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination(req, _, cb) {
    const { aeid } = req.params
    const resolveDir = path.resolve(__dirname, `../static/${aeid}/data`)
    if (!fs.existsSync(resolveDir)) {
      fs.mkdirSync(resolveDir, { recursive: true });
    }
    cb(null, resolveDir)
  },
  filename(_, file, cb) {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  /*
  if (
    file.mimetype === 'application/x-binary' || 
    file.mimetype === 'application/x-macbinary' || 
    file.mimetype === 'application/octet-stream' || 
    file.mimetype === 'application/mac-binary' || 
    file.mimetype === 'application/macbinary'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
  */
  cb(null, true)
}

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 64
  }
})
