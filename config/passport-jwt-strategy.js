const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');

const User = require('../models/user');
console.log(env );
let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),  // it finds jwt from header
    secretOrKey: env.jwt_secret   // decrypting
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){ // User information is encrypted and is present in payload
    User.findById(jwtPayLoad._id, function(err, user){
        if(err){
            console.log(`Error in finding user from JWT`);
            return;
        }
        if(user){
            return done(null, user);
        }else{
            return done(null, false); //Here false means the user is not found
        }
    });
}));


module.exports = passport;