// server.js - where your node app starts
// init project
var express = require('express');
var bodyParser = require('body-parser');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
var app = express();
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
// bodyParser, right now only takes json body
app.use(bodyParser.json());
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index-jet.html');
});
app.get('/todos', (req, res) => {
  var isWeekly = req.query.weekly === "true" ? true : false;  //req.query for query params, no pass will be {}, req.params for /:xxxxx in url, req.body need body parser, need to send json string from client side
  Todo.find({isWeekly}).then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  })
});
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    isWeekly: req.body.isWeekly
  });
  todo.save().then((todo) => { //if successful, will return that newly added todo doc
    res.send(todo);
  }, (e) => {
    res.status(400).send(e);
  });
});
app.delete('/todos/:text', (req, res) => {
  var text = req.params.text;

  Todo.findOneAndRemove({text}).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send(todo); //automaticalyl send status 200
  }).catch((e) => {
    res.status(400).send();
  });
});
app.delete('/todos/', (req, res) => { 
  Todo.remove({isWeekly:false}).then(() => { 
    res.send(); //automaticalyl send status 200
  }).catch((e) => {
    res.status(400).send();
  });
});
app.patch('/todos/:text', (req, res) => {
  var text = req.params.text;
  var body = req.body;

  Todo.findOneAndUpdate({text}, {$set: body}, {new: true}).then((todo) => { //new: true means reaturning the object you just updated. findOneAndUpdate is similar to mongodb native library way
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
