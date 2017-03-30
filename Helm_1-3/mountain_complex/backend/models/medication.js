"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class Medication extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'medication');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "parentId": null
      , "name": null
      , "dosage": null
      , "prescriber": null
      , "pharmacy": null
      , "purpose": null
    };

    return model;
  }


  validate( formData) {
    // formData is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "Patient Record", model.parentId);
    self.mountainComplex.askCrud.required( "Name", model.name);
    self.mountainComplex.askCrud.required( "Dosage", model.dosage);

  }


} // End Class

module.exports = Medication;
