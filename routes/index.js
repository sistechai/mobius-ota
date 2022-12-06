
const { Versions, FileSize, ReadFirmware } = require('../helpers')
const { verified } = require('../middleware/passport-upload')
const fileUpload = require('../middleware/file-upload')
const dataUpload = require('../middleware/data-upload')

const path = require('path')
const { Router } = require('express')
const router = Router()

/**
 * This function responding with the firmware version as character string
 * @route GET /fw/:aeid/version
 * @param { string } aeid.required - Application Entity ID
 */
router.get('/:aeid/version', async (req, res) => {
  const { aeid } = req.params
  const data = await Versions(aeid)
  if (data) {
    const { versions, nversion } = data
    res.json(versions[0])
  } else {
    res.status(403).send('AEID incorrect!')
  }
})

/**
 * This function responding with the firmware file size
 * @route GET /fw/:aeid/:version/size
 * @param { string } aeid.required - Application Entity ID
 * @param { string } version.required - Firmware version
 */
 router.get('/:aeid/:version/size', (req, res) => {
  const { aeid, version } = req.params
  const size = FileSize(aeid, version)
  res.json(size)
})

/**
 * This function responding with the firmware file
 * @route GET /fw/:aeid/:version/download
 * @param { string } aeid.required - Application Entity ID
 * @param { string } version.required - Firmware version
 */
router.get('/:aeid/:version/download', (req, res) => {
  const { aeid, version } = req.params
  const fileName = `${aeid}_${version}.bin`
  const filePath = path.resolve(__dirname, `../static/${aeid}/releases/${fileName}`)
  res.download(filePath, fileName)
})

/**
 * This function responding with the file contents of the k-th block of the firmware file
 * @route GET /fw/:aeid/:version/data/block
 * @param { string } aeid.required - Application Entity ID
 * @param { string } version.required - Firmware version
 * @param { string } seq.query.required - k-th block
 */
router.get('/:aeid/:version/data/block', (req, res) => {
  const { aeid, version } = req.params
  const { seq } = req.query
  console.log("Requesting firmware seq: " + seq)
  const firmware = ReadFirmware(aeid, version);
  if (seq <= firmware.length) {
    /*
    res.setHeader('Content-Type', 'application/octet-stream' )
    res.setHeader('Content-Disposition', 'attachment; filename=update.bin' )
    res.setHeader('Content-Length', data.length )
    res.writeHead(200)
    */
    res.end(firmware.slice(seq, firmware.length))
  }
  //, next next()
})

/**
 * This function saving the uploaded file into a data folder with the filename provided
 * @route POST /fw/rawfile
 * @headers { Authorization } - XPass password
 * @param { string } aeid.required - Application Entity ID
 * @property { file } file.required - Raw data file
 */
router.post('/rawfile', verified, (req, res) => {
  const upload = dataUpload.single('file')
  upload(req, res, function(err) {
    if (err) {
      res.status(401).send('Something went wrong!')
    }
    res.json({message: 'Successfully uploaded!'})
  })
})

/**
 * This function responding with the firmware versions and next version of firmware patch
 * @route POST /fw/check
 * @param { string } aeid.required - Application Entity ID
 */
router.post('/check', async (req, res) => {
  const { aeid } = req.body
  const data = await Versions(aeid)
  if (data) {
    res.json(data)
  } else {
    res.status(403).send('AEID incorrect!')
  }
})

/**
 * This function uploading firmware file
 * @route POST /fw/upload
 * @headers { Authorization } - XPass password
 * @property { file } file.required - Raw data file
 */
router.post('/upload', verified, function (req, res) {
  const upload = fileUpload.single('file')
  upload(req, res, function(err) {
    if (err) {
      res.status(401).send('Something went wrong!')
    }
    res.json({message: 'Successfully uploaded!'})
  })
})

module.exports = router
