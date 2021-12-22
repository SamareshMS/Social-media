const queue = require('../config/kue');

const commentsMailer = require('../mailers/comments_mailer');

// This sends the emails for us instead of sending emails via comments_controller
queue.process('emails', function(job, done){
    console.log('emails worker is processing a job ', job.data);
    commentsMailer.newComment(job.data);
    done();
})

// We are putting job inside the queue