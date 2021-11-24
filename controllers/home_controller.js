const Post = require('../models/post');

module.exports.home = function(req,res){
    //Populate the user of each post
    Post.find({}).populate('user').exec(function(err,posts){
        return res.render('home', {
            title: 'Sodia | Home',
            posts: posts
        });
    });
}