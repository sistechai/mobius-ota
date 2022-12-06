
const { verified } = require('../middleware/passport-upload')
const fileUpload = require('../middleware/file-upload')
const dataUpload = require('../middleware/data-upload')
const { Router } = require('express')
const { Versions, FileSize, ReadFirmware } = require('../helpers')
const router = Router()

/**
 * GET Request
 * URL: /fw/:aeid/version
 * QUERY: {
 *  aeid
 * }
 */
router.get('/:aeid/version', (req, res) => {
  const { aeid } = req.params
  const data = Versions(aeid)
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
router.post('/check', (req, res) => {
  const { aeid } = req.body
  const data = Versions(aeid)
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
