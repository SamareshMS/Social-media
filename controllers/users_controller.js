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