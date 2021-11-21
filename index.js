const express = require('express');
const port = 8000;
const cookieParser = require('cookie-parser');
const app = express();
const expressLayouts = require('express-ejs-layouts');
// While requiring it will the run the file which is in that path
const db = require('./config/mongoose');

// To access req.body
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static('./assets'));

// Set up layout
app.use(expressLayouts);

// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// use express router
app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Server is running on the port : ${port}`);
});