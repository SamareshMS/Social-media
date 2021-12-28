
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
                success: data => {
                    let newPost = newPostDom(data.data.post);
                    // To display the post at the topmost part of posts list we prepend to posts-list
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost)); // since the delete button has to be inside the new post
                },
                error: err => {
                    console.log(err.responseText);
                },
            })
        });
    }

    // Method to create a post in DOM
    let newPostDom = (post) => {
        return $(`<li id="post-${post._id}">
        <p>
          
          <small>
            <a class="delete-post-button" href="/posts/destroy/${ post._id }">X</a>
          </small>
          ${ post.content }
          <br />
          <small> ${ post.user.name } </small>
        </p>
        <div class="post-comments"> 

          <form action="/comments/create" method="POST">
            <input
              type="text"
              name="content"
              placeholder="Type Here to add comment..."
              required
            />
            <input type="hidden" name="post" value="${ post._id }" />
            <input type="submit" value="Add Comment" />
          </form>
    

    
          <div class="post-comments-list">
            <ul id="post-comments-${ post._id }">
                
            </ul>
          </div>
        </div>
      </li>`);
    } 


    //method to delete post from DOM
    let deletePost = deleteLink => {
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
          })
      })
    }


    createPost();
}