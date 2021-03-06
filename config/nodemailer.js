const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

// This is the part which sends the emails and defines how this communication is going to take place
let transporter = nodemailer.createTransport(env.smpt);

// It defines the html mail to be sent where the file will be placed in mailers folder
let renderTemplate = function(data, relativePath){
    let mailHTML;
    ejs.renderFile(path.join(__dirname, '../views/mailers', relativePath),data,
            function(err, template){
            if(err){
                console.log('Error in rendering template', err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}