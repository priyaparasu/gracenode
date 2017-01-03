 function authenticationMiddleware () {
    return function (req, res, next) {
    if (req.isAuthenticated()) {
      console.log("authed")
      return next()
    }
    console.log("not authed")
    res.redirect('/login')
    }
}

module.exports = authenticationMiddleware
