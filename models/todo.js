var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {  
  //mongodb the collection name will be todos, if you put 'Todos', collection name will be todoses
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  isWeekly: {
    type: Boolean,
    default: false
  }
});

module.exports = {Todo};