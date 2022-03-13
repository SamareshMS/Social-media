
{
    // Method to submit the form data for new post using AJAX
    let createPost = () => {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(), // This converts the form data into json format
                success: function(data) {
                    let newPost = newPostDom(data.data.post);
                    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!',newPost)
                    // To display the post at the topmost part of posts list we prepend to posts-list
                    $('#posts-list-container>ul').prepend(newPost);


                    deletePost($(' .delete-post-button', newPost)); // since the delete button has to be inside the new post
                  
                    // Call the created comment class
                    new PostComments(data.data.post._id);
                    
                    // Enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));
                  },
                error: err => {
                    console.log(err.responseText);
                },
            });
        });
    }

    // Method to create a post in DOM
    let newPostDom = function(post) {
        return $(`<li id="post-${post._id}" class="displayed-post">
        <p>
          
          <small>
            <a class="delete-post-button" href="/posts/destroy/${post._id}"><i class="far fa-trash-alt"></i></a>
          </small>
          <span id="posted-content">${ post.content }</span>
          <br>
          <small class="post-user-name"> <a href="/users/profile/${ post.user._id }">${ post.user.name }</a> </small>
          <br>
          <small>
            <a class="toggle-like-button" data-likes="${ post.likes.length }" href="/likes/toggle/?id=${post._id}&type=Post">
            ${ post.likes.length } <span class="like"><i class="fas fa-heart"></i></span>
          </a>
          </small>

        </p>
        <div class="post-comments"> 

        <form id="post-${post._id }-comments-form" class="form-for-comments" action="/comments/create" method="POST">
        <input type="text" style="margin-top: 9px;" class="form-control" name="content" id=" inputPassword2" placeholder="Type Here to add comment..." required>
        <input type="hidden" name="post" value="${post._id}" />
        <input type="submit" id="comment-submit" value= ">" />
      </form>
    
                
            <div class="post-comments-list">
            <ul id="post-comments-${ post._id }">
            </ul>
          </div>
        </div>
      </li>`);
    } 


    //method to delete post from DOM
    let deletePost = function(deleteLink) {
      // console.log('deleteLink', deleteLink);
      // console.log('delete link', $(deleteLink).prop('href'))
      $(deleteLink).click(function(e) {
          e.preventDefault();   // Blocks natural behavior of delete link (X)

          $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: data => {
              $(`#post-${data.data.post_id}`).remove(); // Since data as an object contains the post._id
            },
            error: function(error){
              console.log(error.responseText);
            }
          });
      });
    }

    


    

    let postToAjax=function()
    {
        // console.log("post to ajax");
        $("#posts-list-container>ul>li").each(function()
        {
            let self=$(this);
            // console.log('self',self)
            let deletebutton = $(".delete-post-button", self);
            // let editbutton = $(" .edit-post-btn",self);
            console.log('Delete button is:', deletebutton);
            deletePost(deletebutton);
            // editPost(editbutton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1];
            // console.log(postId)
            new PostComments(postId);
        })
    }

    createPost();

    postToAjax();

    
}

