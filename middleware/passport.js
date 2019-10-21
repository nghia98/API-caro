const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const bcrypt = require('bcrypt');
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('../models/user');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT

        User.findOneEmail(email)
           .then(user => {
               if (!user) {
                   return cb(null, false, {message: 'Incorrect email or password.'});
               }

               bcrypt.compare(password, user.password, (err, result) => {
                    if(err){
                        return cb(null, false, {message: err})
                    }

                    if(!result){
                        return cb(null, false, {message: 'Incorrect password'})
                    }

                    return cb(null, user, {message: 'Logged In Successfully'});
               })
          })
          .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'dang-ngoc-nghia'
},
function (jwtPayload, cb) {

    //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    console.log(jwtPayload);
    return User.findOneEmail(jwtPayload.email)
        .then(user => {
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        });
}
));