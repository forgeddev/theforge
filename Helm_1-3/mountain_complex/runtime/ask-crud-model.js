"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , process = require("process")
  , Promise = require("promise");


// Class
class AskCrudModel {

  constructor( mountainComplex, table) {
    var self = this;

    self.mountainComplex = mountainComplex;
    self.table = table;
    self.model = {};
  }

  /*****************************************************************************
  Overdide Method with Model Implementation
  *****************************************************************************/

  getBlank() {
    var model = {};

    return model;
  }


  validate( object) {
    // object is for transient data from form
    var self = this
      , model = self.model;

    return;
  }

  /*****************************************************************************
  Standard Methods
  *****************************************************************************/

  set( object) {
    var self = this
      , blank = self.getBlank()
      , fields = Object.keys( blank);

    fields.forEach( function(field) {
      if( object[field] || object[field] === 0) {
        if( object[field] && object[field+"Time"]) {
          self.model[field] = object[field] + " " + object[field+"Time"];
          console.log(self.model[field]);
        } else {
          self.model[field] = object[field];
        }
      }
    });

    return;
  }


  beforeAdd( object) {
    var self = this
      , model = self.model;

    return;
  }


  beforeUpdate( object) {
    var self = this
      , model = self.model;

    return;
  }


  save( object) {
    var self = this;

    if( object) {
      self.set( object);
    }

    var promise = new Promise( function(resolve, reject) {
      Promise.resolve().then(function(){
        self.validate( object);
        if( self.model.recordId > 0) {
          self.beforeUpdate( object);
          self.mountainComplex.askCrud.update( self.table, self.model).then(function( saveResponse){
            resolve( saveResponse);
          }, function( errorResponse){
            resolve( errorResponse);
          }).catch(function( error){
            resolve(
              self.mountainComplex.assembleResponses([
                self.mountainComplex.buildErrorMessageResponse( 'Save Failed', 'error')
                , self.mountainComplex.buildReferenceResponse()
              ])
            );
          });
        } else {
          self.beforeAdd( object);
          self.mountainComplex.askCrud.add( self.table, self.model).then(function( saveResponse){
            resolve( saveResponse);
          }, function( errorResponse){
            resolve( errorResponse);
          }).catch(function( error){
            resolve(
              self.mountainComplex.assembleResponses([
                self.mountainComplex.buildErrorMessageResponse( 'Save Failed', 'error')
                , self.mountainComplex.buildReferenceResponse()
              ])
            );
          });
        }
      }).catch(function( error) {
        var exceptionMessage = self.mountainComplex.buildErrorMessageResponse( 'Save Failed', error)
        resolve( self.mountainComplex.assembleResponses([
            exceptionMessage
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve
    }); // End Promise Definition

    return promise;
  }


  delete( object) {
    var self = this;

    var promise = new Promise( function(resolve, reject) {
      Promise.resolve().then(function(){
        if( object) {
          self.set( object);
        }

        self.mountainComplex.askCrud.delete( self.table, self.model).then(function( deleteResponse){
          resolve( deleteResponse);
        }).catch(function( error) {
          var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Failed to Delete', error)
          resolve( self.mountainComplex.assembleResponses([
              errorMessageResponse
              , self.mountainComplex.buildReferenceResponse()
            ])
          );
        });

      }).catch(function( error) {
        var exceptionMessage = self.mountainComplex.buildErrorMessageResponse( 'Failed to Delete', error)
        resolve( self.mountainComplex.assembleResponses([
            exceptionMessage
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


  restore( object) {
    var self = this;

    var promise = new Promise( function(resolve, reject) {
      Promise.resolve().then(function(){
        if( object) {
          self.set( object);
        }

        self.mountainComplex.askCrud.restore( self.table, self.model).then(function( restoreResponse){
          resolve( restoreResponse);
        }).catch(function( error) {
          var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Failed to Restore', error)
          resolve( self.mountainComplex.assembleResponses([
              errorMessageResponse
              , self.mountainComplex.buildReferenceResponse()
            ])
          );
        });

      }).catch(function( error) {
        var exceptionMessage = self.mountainComplex.buildErrorMessageResponse( 'Failed to Restore', error)
        resolve( self.mountainComplex.assembleResponses([
            exceptionMessage
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


  findById( model) {
    var self = this
      , promise = new Promise( function(resolve, reject) {

      Promise.resolve().then(function(){
        if( !model.recordId) {
          throw new Error("Missing recordId")
        }

        self.mountainComplex.askCrud.findById( self.table, model).then(function( findResponse){
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


  findByParentId( model) {
    var self = this
      , promise = new Promise( function(resolve, reject) {

      Promise.resolve().then(function(){
        if( !model.parentId) {
          throw new Error("Missing parentId")
        }

        self.mountainComplex.askCrud.findByParentId( self.table, model).then(function( findResponse){
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


  find( filterModel, sortModel, limitModel) {
    var self = this
      , promise = new Promise( function(resolve, reject) {

      Promise.resolve().then(function(){
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


}

module.exports = AskCrudModel;
