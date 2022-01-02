const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    try{
          //Populate the user of each post
    let posts = await Post.find({})
    .sort('-createdAt')// It sorts in such a way that the latest post will be on the top
    .populate('user')  
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        },
        populate: {
            path: 'likes' // This is for the likes which are for comments
        }
    }).populate('likes'); // This is for the likes which belongs to posts

    let users = await User.find({});

    return res.render('home', {
        title: 'Sodia | Home',
        posts: posts,
        all_users: users
    })
    
    }catch(err){
        console.log('Error', err);
        return;
    }
}