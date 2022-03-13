const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./environment');

passport.use(new googleStrategy({
        
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url
    },

    function(accessToken, refreshToken, profile, done){
        // find a user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log(`error in google strategy password ${err}`);
                return;
            }
            console.log(profile);

            if(user){
                // if found, set this user as req.user (sign in that user)
                return done(null, user);
            }else{ 
                //If the user is not found we create the user and set it as req.user (sign up that user)
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log(`error in creating user in google strategy password ${err}`);
                        return;
                    }else{
                        return done(null,user);
                    }
                })
            }
        })
    }
    
))

module.exports = passport;