const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

// it is a variable which defines where the log is stored
const logDirectory = path.join(__dirname, '../production_logs');
// if the production_logs file exists otherwise logDirectory will be created 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'something',
    db: 'sodia_development',
    smpt: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'studysamaresh',
            pass: 'placement@10+'
        }
    },
    google_client_id: "1061920155402-urllnvh1la4vc6qh6sfmvaol3bai16ot.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'tY6cm3EHfH56y0PCwGdhUyAODrdUjqqu',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.SODIA_ASSET_PATH,
    session_cookie_key: process.env.SODIA_SESSION_COOKIE_KEY,
    db: process.env.SODIA_DB,
    smpt: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SODIA_GMAIL_USERNAME,
            pass: process.env.SODIA_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.SODIA_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.SODIA_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.SODIA_GOOGLE_CALL_BACK_URL,
    jwt_secret: process.env.SODIA_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}

module.exports = eval(process.env.SODIA_ENVIRONMENT) == undefined ? development : eval(process.env.SODIA_ENVIRONMENT);
// module.exports = development