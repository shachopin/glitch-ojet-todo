var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://shachopin:davidnight@ds147599.mlab.com:47599/todos'); //database name is todos
//for mlab, you still have to create a database and create a user first, 
//for your own mongodb or heroku hosted mongodb, no need to even create a database first

//for mlab, can even wipe out all the collections on this database, no worry
module.exports = {mongoose};