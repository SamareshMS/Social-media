const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Finding the user and authenticating them
passport.use(new LocalStrategy({
        usernameField: 'email'          // In our case email is primary key i.e, unique for each and every user
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

// deserializing the user from the key in cookies i.e, to find out which user is there
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log(`Error in finding user --> Passport`);
            return done(err);
        }
        return done(null, user);
    });
});

// Check if the user is authenticated if the user is not authenticated he/she can't view the page
passport.checkAuthentication = function(req, res, next){
    // If the user is signed in then pass on the request to the controller's action
    if(req.isAuthenticated()){                // Checks whether the user is signed in or not
        return next();
    }
    // If the user is not signed in
    return res.redirect('/users/sign-in');
}

// To set the user for the views
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for views
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;