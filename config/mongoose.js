const env = require('./environment')
const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost/${env.db}`);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to MongoDB'));

db.once('open', function(){
    console.log('Connected to the database :: MongoDB');
});

module.exports = db;