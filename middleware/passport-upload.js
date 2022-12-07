
module.exports.verified = function (req, res, next) {
  const { authorization } = req.headers
  if (authorization === `XPass ${process.env.PASSWORD_KEY}`) {
    next()
  } else {
    res.status(403).send('Password incorrect!')
  }
}
