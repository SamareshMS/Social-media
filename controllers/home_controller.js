const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    //Populate the user of each post
    let posts = Post.find({}).sort('-createdAt')  // It sorts in such a way that the latest post will be on the top
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