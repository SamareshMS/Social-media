const Comment = require("../models/comment");
const Post = require("../models/post");

module.exports.create = function (req, res) {
  Post.findById(req.body.post, function (err, post) {
    if (post) {
      Comment.create(
        {
          content: req.body.content,
          post: req.body.post,
          user: req.user._id,
        },
        function (err, comment) {
          post.comments.push(comment);
          // Whenever I am updating i need to save
          post.save();
          return res.redirect("/");
        }
      );
    }
  });
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
