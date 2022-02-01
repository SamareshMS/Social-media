const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
    try{

        if(!req.user){
            return res.redirect('/users/sign-in');
        }

          //Populate the post of each user
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

        let displayedPosts=[];

        let presentUser = await User.findById(req.user._id).populate('friendships');
        
        let allFriends = presentUser.friendships;

        // Only those posts should be visible which are made by the current user's friends
        for(post of posts)
        {
            if(allFriends.length == 0)
            {
                if(req.user.id == post.user.id)
                {
                    displayedPosts.push(post);
                }
            }
            else
            {
                for(friend of allFriends)
                {
                    // console.log(friend.to_user ,post.content,post.user.id)
                    if(friend.to_user == post.user.id || friend.from_user == post.user.id)
                    {
                        displayedPosts.push(post);
                        break;
                    }
                }
            }
        }

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
            posts: displayedPosts,
            all_users: users,
            logged_in_user: loggedInUser
    })
    
    }catch(err){
        console.log('Error', err);
        return;
    }
}