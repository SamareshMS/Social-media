const { getMaxListeners } = require('process');
const nodeMailer = require('../config/nodemailer');

exports.newPost = (post) => {
    let htmlString = nodeMailer.renderTemplate({post: post}, '/posts/new_post.ejs');
    console.log('*****************',post);
    nodeMailer.transporter.sendMail({
        from: 'sodiaweb@gmail.com',
        to: post.user.email,
        subject: 'New post Published!!!',
        html: htmlString,
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }else{
            console.log('Message sent', info);
            return;
        }
    })
}