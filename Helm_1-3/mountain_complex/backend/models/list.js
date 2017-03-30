"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class List extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'list');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "category": undefined
      , "group": undefined
      , "group_required": 'N'
      , "name": undefined
      , "order": 1
      , "default": 'N'
    };

    return model;
  }


  validate( object) {
    // object is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "Category", model.category);
    self.mountainComplex.askCrud.required( "Group", model.group);
    self.mountainComplex.askCrud.required( "Name", model.name);
  }


  getAllLists() {
    var self = this
      , promise = new Promise( function(resolve, reject) {

      Promise.resolve().then(function(){
        var filterModel = {

          }
          , sortModel = {
            "sort_field": ["category", "group", "order", "name"]
            , "sort_direction": ['ASC','ASC','ASC','ASC']
          }
          , limitModel = {
            "onPage": 1
            , "pageSize": 10000
          };


        self.mountainComplex.askCrud.find( self.table, filterModel, sortModel, limitModel).then(function( findResponse){
          resolve( findResponse);
        }).catch(function( error) {
          var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Find Failed', error)
          resolve( self.mountainComplex.assembleResponses([
              errorMessageResponse
              , self.mountainComplex.buildReferenceResponse()
            ])
          );
        });

      }).catch(function( error) {
        var exceptionMessage = self.mountainComplex.buildErrorMessageResponse( 'Find Failed', error)
        resolve( self.mountainComplex.assembleResponses([
            exceptionMessage
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }



} // End Class

module.exports = List;
