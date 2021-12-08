const nodemailer = require('../config/nodemailer');

//This is another way of exporting a method
exports.newComment = (comment) => {
    console.log('Inside nodemailer', comment);

    nodemailer.transporter.sendMail({
        from: 'samareshms34@gmail.com',
        to: comment.user.email,
        subject: "New comment published!",
        html: "<h1>Your comment is now published</h1>"
    }, (err, info) => {
        if(err){
            console.log('Error in sending mail', err);
            return;
        }else{
            console.log(`Message sent ${info}`);
            return;
        }
    })
}