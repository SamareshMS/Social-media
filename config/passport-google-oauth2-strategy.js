const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

passport.use(new googleStrategy({
        clientID: "1061920155402-urllnvh1la4vc6qh6sfmvaol3bai16ot.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/users/auth/google/callback"
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
                //If the user is not found we create the user and set it as req.user (sign in that user)
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