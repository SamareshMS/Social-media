const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = function(req,res){
    //Populate the user of each post
    Post.find({}).sort('-createdAt')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    })
    .populate('user').exec(function(err,posts){

        User.find({}, (err, user) => {

            return res.render('home', {
                title: 'Sodia | Home',
                posts: posts,
                all_users: user
            });
        })

    });
}