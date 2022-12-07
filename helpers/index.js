const fs = require('fs')
const path = require('path')
const moment = require('moment')
const mime = require('mime-types')

module.exports.ReadFirmware = (aeid, version) => {
  /**
   * Return the firmware file as Buffer and mime type
   * /static/AEID/releases/AEID_VERSION.bin
  */
  const filePath = path.resolve(__dirname, `../static/${aeid}/releases/${aeid}_${version}.bin`)
  const firmware = fs.readFileSync(filePath)
  const mimetype = mime.lookup(filePath)
  return { firmware, mimetype }
}

module.exports.FileSize = (aeid, version) => {
  /**
   * Return the firmware file size
   * /static/AEID/releases/AEID_VERSION.bin
  */
  const filePath = path.resolve(__dirname, `../static/${aeid}/releases/${aeid}_${version}.bin`)
  if (fs.existsSync(filePath)) {
    return fs.statSync(filePath).size
  }
  return 0
}

module.exports.Versions = async (aeId) => {
  /**
   * Return AEID/releases folder file 
   * versions list by sort and next patch version:
   * /static/AEID/releases/*.bin
  */
  var versions = []
  const resolveDir = path.resolve(__dirname, `../static/${aeId}/releases`)
  if (fs.existsSync(resolveDir)) {
    const files = await fs.readdirSync(resolveDir);
    files.forEach(file => {
      if (path.extname(file) == ".bin") {
        const { aeid, version } = getParsedAeidVersion(file)
        if (aeId == aeid) {
          versions.push(version)
        }
      }
    })
    versions = versions.sort(rcompare)
    return {
      versions: versions
    }
  }
  return null
}

function rcompare(a, b) {
  am = a.trim().match(/(\d+)\.(\d+)\.(\d+).(\d+)/)
  bm = b.trim().match(/(\d+)\.(\d+)\.(\d+).(\d+)/)
  for (let i = 1; i < 5; i++) {
    if (parseInt(am[i]) !== parseInt(bm[i])) {
      return parseInt(am[i]) > parseInt(bm[i]) ? -1 : 1
    }
  }
  return 0
}

const getParsedAeidVersion = (filename) => {
  /**
   * Return file AEID, VERSION, EXTENSION
   * Files are of this format:
   * filename: <AEID>_<VERSION>.bin
  */
  const [name, ext] = (filename.match(/(.+)+\.(.+)/) || ['', filename]).slice(1)
  const [aeid, version] = (name.match(/(.+)+\_(.+)/) || ['', name]).slice(1)
  return { aeid, version, ext }
}
module.exports.ParsedAeidVersion = getParsedAeidVersion

const getParsedData = (filename) => {
  /**
   * Return file Name, AEID
   * Files are of this format:
   * filename: YYYY.MM.DD-HH.MM.SS-AEID
  */
  const [fname, ext] = (filename.match(/(.+)+\.(.+)/) || ['', filename]).slice(1)
  const [name, aeid] = (fname.match(/(.+)+\-(.+)/) || ['', fname]).slice(1)
  return { name, aeid, ext }
}
module.exports.ParsedData = getParsedData
