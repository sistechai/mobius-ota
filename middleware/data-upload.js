const fs = require('fs')
const path = require('path')
const semver = require('semver')
const multer = require('multer')
const { ParsedData } = require('../helpers')

const storage = multer.diskStorage({
  destination(_, file, cb) {
    const { aeid } = ParsedData(file.originalname)
    const resolveDir = path.resolve(__dirname, `../static/${aeid}/data`)
    if (!fs.existsSync(resolveDir)) {
      fs.mkdirSync(resolveDir, { recursive: true });
    }
    cb(null, resolveDir)
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
