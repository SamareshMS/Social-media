const User = require('../models/user');

module.exports.profile = function(req,res){
    res.render('user_profile', {
        title: "profile"
    });
}

// Render the sign up page
module.exports.signUp = function(req,res){
    res.render('user_sign_up', {
        title: "Sodia | Sign Up"
    });
}

// Render the sign in page
module.exports.signIn = function(req,res){
    res.render('user_sign_in', {
        title: "Sodia | Sign In"
    });
}

// Get the sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err,user){
        if(err){
            console.log(`Error in finding user in signing up`);
            return;
        }
        if(!user){
            User.create(req.body, function(err,user){
                if(err){
                    console.log(`Error in creating user while signing up`);
                    return;
                }
                return res.redirect('/users/sign-in');
            });
        }
        else{
            return res.redirect('back');
        }
    })
    
}

// Sign in and create a session for user
module.exports.createSession = function(req,res){
    return res.redirect('/');
}