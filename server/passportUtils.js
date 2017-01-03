import passport from 'passport';
import {Strategy as LocalStrategy}  from 'passport-local';
import authenticationMiddleware from './authenticationMiddleware';
import crypto from 'crypto';

const user = {
  username: 'admin',
  password: 'e594a3c14ff39ea89a2cd2e822fecb30b5642f745fc9d0741e5b24d4d2c3d5ff',
  id: 1
}

passport.serializeUser(function (user, cb) {
  cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
  findUser(username, cb)
})

function findUser (username, callback) {
  if (username === user.username) {
      console.log('found user ... ' )
    return callback(null, user)
  }
  return callback(null)
}
function getHash(clearPwd) {
  return crypto.createHmac('sha256', clearPwd).update(clearPwd).digest('hex');
}
function initPassportUtils(){
  console.log('configuring local strategy');
  passport.use(new LocalStrategy(

      function(username, password, done) {
        console.log('testing password ... ' )
        findUser(username, function (err, user) {
          if (err) {
            return done(err)
          }
          if (!user) {
            return done(null, false,  {message: 'Oops! Bad user.'})
          }
          if (getHash(password) !== user.password  ) {

            return done(null, false,  {message: 'Oops! Bad password.'})
          }
          else   console.log(' found password ... ', password, user.password )

          return done(null, user)
        })
      }
    ))
   passport.authenticationMiddleware = authenticationMiddleware
}
module.exports = initPassportUtils
