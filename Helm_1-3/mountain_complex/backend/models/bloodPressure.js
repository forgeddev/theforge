"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class BloodPressure extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'bloodPressure');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "parentId": null
      , "when": null
      , "summary": null
      , "notes": null
      , "systolic": null
      , "diastolic": null
      , "heartRate": null
    };

    return model;
  }


  validate( formData) {
    // formData is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "Patient Record", model.parentId);
    self.mountainComplex.askCrud.required( "When", model.when);
    self.mountainComplex.askCrud.required( "Systolic", model.systolic);
    self.mountainComplex.askCrud.required( "Diastolic", model.diastolic);

  }


} // End Class

module.exports = BloodPressure;
