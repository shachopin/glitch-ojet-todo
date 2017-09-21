define(['ojs/ojcore', 'knockout', 'ojs/ojselectcombobox'], 
  function (oj, ko) {
    function homeContentViewModel() {
        var self = this;
        self.weeklyTodos = ko.observableArray();
        self.weeklyTodosArray = ko.observableArray();
        self.val = ko.observableArray();
        self.numOfTodos = ko.observable();
        self.weeklyTodoChecked = ko.observable(false);
        self.handleAddButtonClick = function() {
          $("#todoText").css("border", "");  //to undo the css change added before by jquery
          
          var todoText = $('#todoText').val();
          if (todoText.length === 0) {
            $("#todoText").css("border", "2px solid red");
            return; //breaks the normal button action flow, here just return works,
            //not have to say return false like jquery button inside a form submission scenario
            //reason being that the button is by default type button, not submit outside a form
          }
          //if ($("#cbox1").is(":checked")) { //use jquery to do it, good
          if (self.weeklyTodoChecked()) { //use knockout checked binidng
            addTodo(todoText, false, true); 
          } else {
            addTodo(todoText); 
          }
          $('#todoText').val('');
        };
        self.handleClearButtonClick = function() {
            deleteTodo();
        };
        self.optionChangeHandler = function(event, data){
          if (data && data.option === "value" && 
              data.value && data.previousValue && 
              data.previousValue.length > data.value.length &&
              data.optionMetadata.writeback !== 'shouldNotWrite') {
            //for clicking the x sign and delete the todo
            var deletedTodoText = figureOutWhichTodoInDifference(data.previousValue, data.value);
            //var deletedTodoText = data.previousValue[data.previousValue.length - 1]; //wrong way， because I might delete the one in the middle, not the last one
            deleteTodo(deletedTodoText);
          } else if (data && data.option === "value" && 
                     data.optionMetadata && data.optionMetadata.trigger && 
                     (data.optionMetadata.trigger === "enter_pressed" || data.optionMetadata.trigger === "blur" || data.optionMetadata.trigger === "option_selected") && 
                     data.value && data.previousValue && data.previousValue.length < data.value.length) {
            var lastTodoText = data.value[data.value.length - 1]; //grab the last one in the array
            if (data.optionMetadata.trigger === "option_selected") {
              updateTodo(lastTodoText); //if select item in the dropdown, the self.val() will already have the new item, inside the dropdown will lose one automatically),  no need to push, same for press enter,
            } else {
              //for writing new entry directly and press enter
              //or
              //write some stuff and then tab out
              //self.val.pop(); //need to popup the last one temporarily, otherwise the new todo will already exist in self.val()
              addTodo(lastTodoText, true);
            }
          }
        }
        displayAllTodos({weekly: true}, showTodosInDropdown);
        displayAllTodos({}, showTodosInBox);
        
        //utility functions
        
        function showTodosInDropdown(todos) {
          var init = [{
                      label: "Weekly Todos (click to promote it to daily todo)", 
                      children: []
                      }];        
          self.weeklyTodos(init); //to refresh the weeklyTodo dropdown in case I deleted the one from weeklyTodo
          self.weeklyTodosArray([]);
          $.each(todos.todos, function () {
              self.weeklyTodos()[0].children.push({value: this.text, label: this.text});  
              self.weeklyTodosArray.push(this.text);
          });
        }
      
        function showTodosInBox(todos) {
          $.each(todos.todos, function () {
              self.val.push(this.text);
          });
          self.numOfTodos(self.val().length);
        }
      
        function displayAllTodos(option, showWhere) {
          if (option.weekly) {
            $.getJSON("/todos?weekly=true").
            then(showWhere);
          } else {
            $.getJSON("/todos").
            then(showWhere);
          }
        }
      
        function addTodo(text, addedByPressEnter, isWeekly) {
          if (addedByPressEnter || todoNotExistingYet(text)) {
            $.ajax({
              type: 'POST',
              url: '/todos',
              data: JSON.stringify({text, isWeekly: isWeekly? true : false }),
              success: function(data) {
                if (!isWeekly) {
                  if(!addedByPressEnter) { //if addedbyPressEnter, the self.val() will already have the new item inside,  no need to push, same for select item in the dropdown
                    self.val.push(data.text);
                  } 
                  self.numOfTodos(self.val().length); 
                } else {
                  self.weeklyTodos()[0].children.push({value: data.text, label: data.text}); 
                  self.weeklyTodosArray.push(data.text);
                }
              },
              contentType: "application/json"
            }); 
          }           
        }
      
        function updateTodo(text) {
          $.ajax({
            type: 'PATCH',
            url: `/todos/${text}`,
            data: JSON.stringify({isWeekly: false}),
            success: function(data) {
              self.numOfTodos(self.val().length);
              // standard array removing specific item, not working here because the array is array of objects
              // var index = self.weeklyTodos().indexOf(deletedTodoText);
              // self.weelyTodos().splice(index, 1);
              displayAllTodos({weekly: true}, showTodosInDropdown); //need to refresh the weeklyTodo dropdown in case I deleted the one from weeklyTodo
              // if not, the deleted one will still go back to the dropdown from the UI, even it was actually deleted fro mongodb
            },
            contentType: "application/json"
          }); 
                   
        }
      
        function deleteTodo(text) {
          if (text) {
            if (text.includes("?")) {  //url encoding here, as ? will be consided as the start of query string, notice javascript string use includes, not contains
              //replace ? with %3F
                text = text.split("?").join("%3F");
              // Regular Expression Based Implementation

              // String.prototype.replaceAll = function(search, replacement) {
              //     var target = this;
              //     return target.replace(new RegExp(search, 'g'), replacement);
              // };
              // Split and Join (Functional) Implementation

              // String.prototype.replaceAll = function(search, replacement) {
              //     var target = this;
              //     return target.split(search).join(replacement);
              // };
            }
            
            $.ajax({
              type: 'DELETE',
              url: `/todos/${text}`,
              success: function(data) {
                self.numOfTodos(self.val().length);
              }
            }); 
          } else {  //will delete all the daily todos, leaving your weekly todos in tact
            $.ajax({
              type: 'DELETE',
              url: `/todos`,
              success: function(data) {
                self.numOfTodos(0);
                self.val([]);
              }
            });
            
          }
        }
      
        function todoNotExistingYet(text) {
          var currentTodo = text;
          return (self.val().concat(self.weeklyTodosArray())).filter(function(todo){
            return todo === currentTodo;
          }).length === 0;
        }
       
        function figureOutWhichTodoInDifference(longerArray, shorterArray) {
          var dict = {};
          for (var i = 0; i < shorterArray.length; i++) {
            dict[shorterArray[i]] = 1;
          }
          for (var i = 0; i < longerArray.length; i++) {
            if (dict[longerArray[i]] === undefined) {
              return longerArray[i];
            }
          }     
        }   
    }
    return homeContentViewModel;
});