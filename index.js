const express = require('express');
const port = 8000;
const app = express();
const expressLayouts = require('express-ejs-layouts');


app.use(express.static('./assets'));

// Extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Set up layout
app.use(expressLayouts);

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