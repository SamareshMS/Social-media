const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create = async function (req, res) {
  try{
    const post = await Post.findById(req.body.post) 
    if (post) {
      let comment = await Comment.create(
        {
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        });

        post.comments.push(comment);
        // Whenever I am updating i need to save
        post.save();
        
        comment = await comment.populate('user', 'name email');
        commentsMailer.newComment(comment);

        return res.redirect('/');
    }
  }catch(err){
    console.log('Error in creating comment', err);
    return;
  }
  
};


module.exports.destroy = (req,res) => {
    Comment.findById(req.params.id, (err, comment) => {
      let userId;
        Post.findById(comment.post, (err, post) => {
          userId = post.user;
          if(comment.user == req.user.id || userId == req.user.id){
            let postId = comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, (err, post) => {
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }
        });

    })
}
