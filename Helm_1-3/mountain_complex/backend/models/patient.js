"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class Patient extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'patient');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "firstName": null
      , "lastName": null
      , "middleName": null
      , "dateOfBirth": null
      , "internalId": null
      , "alternateId": null
      , "primaryPhone": null
      , "alternatePhone": null
      , "email": null
      , "address": null
      , "city": null
      , "state": null
      , "zip": null
      , "county": null
      , "township": null
    };

    return model;
  }




  validate( formData) {
    // formData is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "First Name", model.firstName);
    self.mountainComplex.askCrud.required( "Last Name", model.lastName);
    self.mountainComplex.askCrud.required( "Date of Birth", model.dateOfBirth);

  }


} // End Class

module.exports = Patient;
