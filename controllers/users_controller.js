const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id, (err, user) => {
        res.render('user_profile', {
            title: "profile",
            profile_user: user
        });
    })
}

// module.exports.update = (req,res) => {
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id, {name: req.body.name, email: req.body.email}, (err, user) => {
//             return res.redirect('back');
//         })
//     }else{
//         return res.status(401).send('Unauthorized');
//     }
// }

module.exports.update = async (req,res) => {
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,err => {   //Since the form data is encrypted so we are using this function to decrypt and access the data
                if(err){
                    console.log(`Multer err: ${err}`);
                    return;
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    
                    if(user.avatar){
                        // remove the link from the path and the image so that more than one avatar won't be stored
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }
                    

                    // This is saving the path of the uploaded file into field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            console.log(err);
            return res.redirect('back');
        }
    }
}

// Render the sign up page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    res.render('user_sign_up', {
        title: "Sodia | Sign Up"
    });
}

// Render the sign in page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

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

module.exports.destroySession = function(req, res){
    req.logout();
    return res.redirect('/users/sign-in');
}
