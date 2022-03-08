

class PostComments{
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // CHANGE :: show the count of zero likes on this comment

        return $(`<li id="comment-${ comment._id }">
                        <p>
                            
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}"><i class="far fa-trash-alt"></i></a>
                            </small>
                            
                            <span id="displayed-comment">${comment.content}</span>
                            
                            <br>
                            <small>
                            <small id="displayed-comment-writer"> <a href="/users/profile/${ comment.user._id }">${comment.user.name}</a> </small>
                                
                            </small>

                            <br>
                            <small>
                            
                            <a class="toggle-like-button" data-likes="${ comment.likes.length }" href="/likes/toggle/?id=${comment._id}&type=Comment">
                            ${ comment.likes.length } <span class="like"><i class="fas fa-heart"></i></span>
                          </a>
                            
                            </small>

                        </p>    

                </li>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            console.log($(deleteLink).prop('href'))
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}