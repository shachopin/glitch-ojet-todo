define(function(){  //implicit baseUrl is where main.js is.  Here you do ['lib/calculator']. If right in oraclejet (which is baseUrl now), then just say 'calculator', Cannot say './calculator'.
  function Calculator(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.displayFullName = function() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
  return Calculator;
});