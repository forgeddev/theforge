"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class BloodWork extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'bloodWork');
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
      , "cholestrol": null
      , "hdl": null
      , "ldl": null
      , "triglycerides": null
      , "glucose": null
      , "a1c": null
    };

    return model;
  }


  validate( formData) {
    // formData is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "Patient Record", model.parentId);
    self.mountainComplex.askCrud.required( "When", model.when);

  }


} // End Class

module.exports = BloodWork;
