"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class ProgramReferral extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'programReferral');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "parentId": null
      , "summary": null
      , "notes": null
      , "referralSourceType": null
      , "referralOutcomeType": null
      , "when": null
      , "duration": 0
      , "name": null
      , "primaryPhone": null
      , "alternatePhone": null
      , "email": null
      , "address": null
      , "city": null
      , "state": null
      , "zip": null
    };

    return model;
  }


  validate( formData) {
    // formData is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "Patient Record", model.parentId);
    self.mountainComplex.askCrud.required( "Summary", model.summary);
    self.mountainComplex.askCrud.required( "Name", model.name);
    self.mountainComplex.askCrud.required( "Referral Source Type", model.referralSourceType);
    self.mountainComplex.askCrud.required( "When", model.when);

  }


} // End Class

module.exports = ProgramReferral;
