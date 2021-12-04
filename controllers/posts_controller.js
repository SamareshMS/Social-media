const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = function (req, res) {
  let ajaxPost;
  Post.create(
    {
      content: req.body.content,
      user: req.user._id,
    },
    function (err, post) {
      if (err) {
        console.log(`Error in creating a post`);
        return;
      }
      ajaxPost = post;
      if(req.xhr){
        return res.status(200).json({
          data: {
            post: ajaxPost
          },
          message: "Post created!!"
        });
      }

      return res.redirect("back");
    }
  );
};

module.exports.destroy = function (req, res) {
  Post.findById(req.params.id, function (err, post) {
    // .id converting the object id into string it is good while comparing
    if (post.user == req.user.id) {
      post.remove();

      Comment.deleteMany({ post: req.params.id }, function (err) {

        if(req.xhr){
          return res.status(200).json({
            data: {
              post_id: post.params.id
            },
            message: "Post deleted successfully"
          });
        }

        return res.redirect("back");
      });
    } else {

      if(req.xhr){
        return res.status(200).json({
          data: {
            post_id: post.params.id
          },
          message: "Post deleted successfully"
        });
      }
      return res.redirect("back");
    }
  });
};
