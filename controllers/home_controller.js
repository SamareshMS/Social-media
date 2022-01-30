const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    try{

        if(!req.user){
            return res.redirect('/users/sign-in');
        }

          //Populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')// It sorts in such a way that the latest post will be on the top
        .populate({
            path: 'user',
            populate: [
                {
                    path: 'friendships'
                }
            ]
        })  
        .populate({
            path: 'comments',
            populate: [
                {
                    path: 'user'
                },
                {
                    path: 'likes'
                }
            ]
        }).populate('likes'); // This is for the likes which belongs to posts

        console.log('!!!!!!!!!!!!!!',posts[0].user.friendships[0].to_user)

        let users = await User.find({});

        let loggedInUser;
        if(req.user){
            loggedInUser = await User.findById(req.user._id)
            .populate({
                path: 'friendships',
                populate: [
                    {
                        path: 'from_user'
                    },
                    {
                        path: 'to_user'
                    }
                ]
            })
        }

        

        return res.render('home', {
            title: 'Sodia | Home',
            posts: posts,
            all_users: users,
            logged_in_user: loggedInUser
    })
    
    }catch(err){
        console.log('Error', err);
        return;
    }
}