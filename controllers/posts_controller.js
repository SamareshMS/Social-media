const Post = require("../models/post");
const Comment = require("../models/comment");
const postMailer = require('../mailers/posts_mailer');

// module.exports.create = function (req, res) {
//   let ajaxPost;
//   Post.create(
//     {
//       content: req.body.content,
//       user: req.user._id,
//     },
//     function (err, post) {

//       if (err) {
//         console.log(`Error in creating a post`);
//         return;
//       }
//       ajaxPost = post;
//       if(req.xhr){
//         return res.status(200).json({
//           data: {
//             post: ajaxPost
//           },
//           message: "Post created!!"
//         });
//       }

//       let userPost = await post.populate('user').execPopulate();
//       postMailer.newPost(userPost);

//       return res.redirect("back");
//     }
//   );
// };

module.exports.create = async function (req, res) {

    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        let userPost = await post.populate('user');
        postMailer.newPost(userPost);

        if(req.xhr){
          return res.status(200).json({
            data: {
              post: post
            },
            message: "Post created!"
          })
        }

        return res.redirect("back");

    }catch(err){
        console.log('Error in creating a post -->> ', err);
        return res.redirect('back');
    }
};

module.exports.destroy = async function (req, res) {
  try{
    let post = await Post.findById(req.params.id)
      // .id converting the object id into string it is good while comparing
      if (post.user == req.user.id) {
        post.remove();
  
        await Comment.deleteMany({ post: req.params.id });
  
          if(req.xhr){
            return res.status(200).json({
              data: {
                post_id: req.params.id
              },
              message: "Post deleted"
            });
          }
  
          return res.redirect("back");
        }else{
          return res.redirect("back");
        }
        
      }catch(err){
        return res.redirect('back');
      }

};
