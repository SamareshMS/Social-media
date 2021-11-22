const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Finding the user and authenticating them
passport.use(new LocalStrategy({
        usernameField: email          // In our case email is primary key i.e, unique for each and every user
    },function(email, password, done){
        User.findOne({email: email}, function(err, user){
            if(err){
                console.log(`Error in finding the user --> Passport`);
                return done(err);
            }
            if(!user || user.password!=password){
                console.log(`Invalid Username/Password`);
                return done(null, false);
            }
            return done(null, user);
        });
    }    
));

// Serializing the user to decide which key is to be kept on the cookies
passport.serializeUser(function(user, done){
    return done(null, user.id);
});

// deserializing the user from the key in cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log(`Error in finding user --> Passport`);
            return done(err);
        }
        return done(null, user);
    });
});