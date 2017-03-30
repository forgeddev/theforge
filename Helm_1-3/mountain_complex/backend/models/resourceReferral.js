"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , moment = require("moment")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class ResourceReferral extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'resourceReferral');
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
      , "focusType": null
      , "progressType": null
      , "outcomeType": null
      , "trackingId": null
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
    self.mountainComplex.askCrud.required( "Focus", model.focusType);
    self.mountainComplex.askCrud.required( "When", model.when);

  }


  getCalendar( startDate, endDate) {
    var self = this
      , filterModel = {
        "when": {
          "operator": "between"
          , "betweenStartValue": moment(startDate).format('YYYY-MM-DD')
          , "betweenEndValue": moment(endDate).format('YYYY-MM-DD')
        }
      }
      , sortModel = {
        "sort_field": "when"
        , "sort_direction": "DESC"
      };

    var promise = new Promise( function(resolve, reject) {
      Promise.resolve().then(function(){

        self.find( filterModel, sortModel).then(function( findResponse){
          return findResponse.data.rows;
        }).then(function( resourceReferrals){
          var events = resourceReferrals.map(function( resourceReferral){
            var endResourceReferral = moment(resourceReferral.when).add(30, 'minutes').toDate();
            if( resourceReferral.duration > 0) {
              endResourceReferral = moment(resourceReferral.when).add( resourceReferral.duration, 'minutes').toDate();
            }
            var title = resourceReferral.name;
            if( resourceReferral.primaryPhone) {
              title = title + " (" + resourceReferral.primaryPhone + ") ";
            }
            if( resourceReferral.summary) {
              title = title + " " + resourceReferral.summary + " ";
            }
            return {
              "title": title
              , "start": resourceReferral.when
              , "end": endResourceReferral
              , "allDay": false
              , "url": "/resourceReferral/view/" + resourceReferral.recordId
            };
          });
          console.log(events);

          var dataResponse = self.mountainComplex.buildDataResponse(events, {}, {});
          console.log(dataResponse);

          resolve(dataResponse);

        }).catch(function( error){
          console.log( error);
          var exceptionMessage = self.mountainComplex.buildErrorMessageResponse( 'Calendar Failed', error)
          resolve( self.mountainComplex.assembleResponses([
              exceptionMessage
              , self.mountainComplex.buildReferenceResponse()
            ])
          );
        });
      }); // End Starter then
    }); // End Promise Definition

    return promise;
  }


} // End Class

module.exports = ResourceReferral;
