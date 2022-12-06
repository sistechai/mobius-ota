
module.exports.verified = function (req, res, next) {
  const { authorization } = req.headers
  if (authorization === 'XPass 123456') {
    next()
  } else {
    res.status(403).send('Password incorrect!')
  }
}
