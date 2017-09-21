define(['ojs/ojcore' ,'knockout', 'lib/calculator' //implicit baseUrl is where main.js is. Here you do ['lib/calculator']. If right in oraclejet (which is baseUrl now), then just say 'calculator'. Cannot say './calculator'
   ], function(oj, ko, Calc) {
  function HeaderViewModel() {
      var self = this;
      //self.result = new Calc(100, 200).addition();
      var rootViewModel = ko.dataFor(document.getElementById('mainContent'));
      var fullName = new Calc(rootViewModel.firstName, rootViewModel.lastName).displayFullName();
      self.welcomeMessage = `Welcome ${fullName} !`;
  }
  return HeaderViewModel;
});