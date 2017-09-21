define(['ojs/ojcore' ,'knockout', 'ojs/ojselectcombobox'
   ], function(oj, ko ) {
  function ViewModel() {
      var self = this;
      self.val = ko.observableArray(["North America"]);
      self.regions = [
        {name: "EMEA"},
        {name: "South America"},
        {name: "North America"},
        {name: "Asia"},
        {name: "Africa"}
      ];
  }
  return ViewModel;
});