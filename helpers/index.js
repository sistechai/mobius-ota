const fs = require('fs')
const path = require('path')
const semver = require('semver')
const moment = require('moment')

module.exports.ReadFirmware = (aeid, version) => {
  /**
   * Return the firmware file as Buffer
   * /static/AEID/releases/AEID_VERSION.bin
  */
  const filePath = path.resolve(__dirname, `../static/${aeid}/releases/${aeid}_${version}.bin`)
  return fs.readFileSync(filePath)
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
    versions = versions.sort(semver.rcompare)
    nversion = semver.inc(versions[0], 'patch')
    return {
      versions: versions,
      nversion: nversion
    }
  }
  return null
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

/**
semver.diff('3.4.5', '4.3.7') //'major'
semver.diff('3.4.5', '3.3.7') //'minor'
semver.gte('3.4.8', '3.4.7') //true
semver.ltr('3.4.8', '3.4.7') //false

semver.valid('1.2.3') // '1.2.3'
semver.valid('a.b.c') // null
semver.clean(' =v1.2.3 ') // '1.2.3'
semver.satisfies('1.2.3', '1.x || >=2.5.0 || 5.0.0 - 7.2.3') // true
semver.gt('1.2.3', '9.8.7') // false
semver.lt('1.2.3', '9.8.7') // true

var versions = [ '1.2.3', '3.4.5', '1.0.2' ]
var max = versions.sort(semver.rcompare)[0]
var min = versions.sort(semver.compare)[0]
var max = semver.maxSatisfying(versions, '*')
*/