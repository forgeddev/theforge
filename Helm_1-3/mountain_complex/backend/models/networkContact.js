"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class NetworkContact extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'networkContact');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "parentId": null
      , "networkContactType": null
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
    self.mountainComplex.askCrud.required( "Name", model.name);
    self.mountainComplex.askCrud.required( "Primary Phone", model.primaryPhone);

  }


} // End Class

module.exports = NetworkContact;
