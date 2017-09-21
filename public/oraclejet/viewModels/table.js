define(['ojs/ojcore', 'knockout', 'ojs/ojtable', 'ojs/ojarraytabledatasource'], 
  function (oj, ko) {
    function TableContentViewModel() {
        var self = this;
        self.data = ko.observableArray();
        // $.getJSON("//movieapp-sitepointdemos.rhcloud.com/api/movies").
        //         then(function (movies) {
        //             $.each(movies, function () {
        //                 self.data.push({
        //                     title: this.title,
        //                     director: this.director,
        //                     releaseYear: this.releaseYear,
        //                     genre: this.genre
        //                 });
        //             });
        //         });
        // self.dataSource = new oj.ArrayTableDataSource(
        //         self.data, 
        //         {idAttribute: 'title'}
        // );

        $.getJSON("/todos").
                  then(function (todos) {
                      $.each(todos.todos, function () {
                          self.data.push({
                              text: this.text,
                              completedAt: this.completedAt,
                              completed: this.completed,
                              isWeekly: this.isWeekly
                          });
                      });
                  });

        self.dataSource = new oj.ArrayTableDataSource(
                self.data, 
                {idAttribute: 'text'}
        );
      
        /* above is for testing oj-table featrue */
    }
    return TableContentViewModel;
});