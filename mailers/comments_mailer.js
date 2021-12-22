const nodeMailer = require('../config/nodeMailer');

//This is another way of exporting a method
exports.newComment = (comment) => {
    // console.log('************', comment);
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');
    // console.log(`inside newComment mailer`, comment);
    // console.log('**************', htmlString);

    nodeMailer.transporter.sendMail({
        from: 'sodiaweb@gmail.com',
        to: comment.user.email,
        subject: "New comment published!",
        // text: comment.content, // plain text body
        html: htmlString,
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }else{
            // console.log('Message sent', info);
            return;
        }
    })
}