const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){
         if(post){
             Comment.create({
                 content: req.body.content,
                 post: req.body.post,
                 user: req.user._id
             },function(err, comment){
                 post.comments.push(comment);
                 // Whenever I am updating i need to save
                 post.save();
                 return res.redirect('/');
             })
         }   
    })
}