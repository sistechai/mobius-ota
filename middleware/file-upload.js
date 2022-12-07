const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { ParsedAeidVersion } = require('../helpers')

const storage = multer.diskStorage({
  destination(_, file, cb) {
    const { aeid } = ParsedAeidVersion(file.originalname)
    const resolveDir = path.resolve(__dirname, `../static/${aeid}/releases`)
    if (!fs.existsSync(resolveDir)) {
      fs.mkdirSync(resolveDir, { recursive: true });
    }
    cb(null, resolveDir)
  },
  filename(_, file, cb) {
    /*
    const { aeid, version, ext } = ParsedAeidVersion(file.originalname)
    const resolveDir = path.resolve(__dirname, `../static/${aeid}/releases`)
    if (fs.existsSync(path.join(resolveDir, file.originalname))) {
      const nversion = NextVersion(version)
      cb(null, `${aeid}_${nversion}.${ext}`)
    } else {
      cb(null, file.originalname)
    }*/
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
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
}

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 64
  }
})
