
const { Versions, FileSize, ReadFirmware } = require('../helpers')
const { verified } = require('../middleware/passport-upload')
const fileUpload = require('../middleware/file-upload')
const dataUpload = require('../middleware/data-upload')

const path = require('path')
const { Router } = require('express')
const router = Router()

/**
 * GET Request
 * URL: /fw/:aeid/version
 * QUERY: {
 *  aeid
 * }
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
 * GET Request
 * URL: /fw/:aeid/:version/size
 * QUERY: {
 *  aeid,
 *  version
 * }
 */
 router.get('/:aeid/:version/size', (req, res) => {
  const { aeid, version } = req.params
  const size = FileSize(aeid, version)
  res.json(size)
})

/**
 * GET Request
 * URL: /fw/:aeid/:version/download
 * QUERY: {
 *  aeid,
 *  version
 * }
 */
router.get('/:aeid/:version/download', (req, res) => {
  const { aeid, version } = req.params
  const fileName = `${aeid}_${version}.bin`
  const filePath = path.resolve(__dirname, `../static/${aeid}/releases/${fileName}`)
  res.download(filePath, fileName)
})

/**
 * GET Request
 * URL: /fw/:aeid/:version/data/block
 * QUERY: {
 *  seq
 * }
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
    or
    res.download(file)
    */
    res.end(firmware.slice(seq, firmware.length))
  }
  //, next next()
})

/**
 * POST Request
 * URL: /fw/rawfile
 * Headers:
 *  Authorization: 'XPass password'
 * BODY: {
 *  aeid,
 *  file
 * }
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
 * POST Request
 * URL: /fw/check
 * BODY: {
 *  aeid
 * }
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
 * POST Request
 * URL: /fw/upload
 * Headers:
 *  Authorization: 'XPass password'
 * BODY: {
 *  file
 * }
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
