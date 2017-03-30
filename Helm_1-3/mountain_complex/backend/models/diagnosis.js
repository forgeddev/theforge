"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class Diagnosis extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'diagnosis');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "parentId": null
      , "diagnosisConditionType": null
      , "diagnosisOutcomeType": null
      , "diagnosisDate": null
      , "treatmentPlan": null
      , "medicalHistory": null

    };

    return model;
  }


  validate( formData) {
    // formData is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "Patient Record", model.parentId);
    self.mountainComplex.askCrud.required( "Diagnosis", model.diagnosisConditionType);
    self.mountainComplex.askCrud.required( "Diagnosis Date", model.diagnosisDate);

  }


} // End Class

module.exports = Diagnosis;
