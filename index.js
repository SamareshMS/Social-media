const express = require('express');
const port = 8000;
const cookieParser = require('cookie-parser');
const app = express();
const expressLayouts = require('express-ejs-layouts');
// While requiring it will run the file which is in that path
const db = require('./config/mongoose');
// Used for session cookies
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
// Cookie is getting reset every time after restarting the server. To avoid this we are using connect-mongo
const MongoStore = require('connect-mongo')(session);
const sassMiddleware = require('node-sass-middleware');

// To convert SCSS file to CSS
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

// To access req.body
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));
// making the upload path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// Set up layout
app.use(expressLayouts);

// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'sodia',
    // TODO change the secret before deployment in production mode
    secret: 'something',
    saveUninitialized: false,  //Even if user is not signed in the cookie stores info if the value is given true
    resave: false,
    cookie: {
        maxAge: (1000*60*100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    }, function(err){
        console.log(err || `connect-mongodb setup ok`);
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// By this function call the signed in user will be set in the locals
app.use(passport.setAuthenticatedUser);

// use express router
app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Server is running on the port : ${port}`);
});