const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');

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
        // commentsMailer.newComment(comment);
        // creating a job queue for sending emails
        // If queue is already present then the job is pushed inside the queue
        let job = queue.create('emails', comment).save((err)=>{
          if(err){
            console.log('error in sending to the queue', err);
            return;
          }
          console.log('job enqueued', job.id);
        });

        if (req.xhr){
          return res.status(200).json({
              data: {
                  comment: comment
              },
              message: "Post created!"
          });
      }
      res.redirect('/');
    }
  }catch(err){
    console.log('Error in creating comment', err);
    return;
  }
};


module.exports.destroy = async function(req,res){
    try{
      let comment = await Comment.findById(req.params.id);
      // console.log('Request.params',req.params.id);
      console.log('Comment is :s',comment);
      
        let userId;
          let post = await Post.findById(comment.post);
            userId = post.user;
            if(comment.user == req.user.id || userId == req.user.id){
              let postId = comment.post;
              comment.remove();
              post = await Post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}});
              await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
              // send the comment id which was deleted back to the views
            if (req.xhr){
              return res.status(200).json({
                  data: {
                      comment_id: req.params.id
                  },
                  message: "Post deleted"
              });
          }
          return res.redirect('back');
              
          }else{
              return res.redirect('back');
          }
    }catch(err){
      console.log('Error in deleting comment ',err);
      return;
    }
}
