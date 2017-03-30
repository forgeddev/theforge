"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , moment = require("moment")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class Response extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'response');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "parentId": null
      , "who": null
      , "summary": null
      , "notes": null
      , "responseType": null
      , "when": null
    };

    return model;
  }


  validate( formData) {
    // formData is for transient data from form
    var self = this
      , model = self.model;

    self.mountainComplex.askCrud.required( "Patient Record", model.parentId);
    self.mountainComplex.askCrud.required( "Summary", model.summary);
    self.mountainComplex.askCrud.required( "Response Type", model.responseType);
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
        }).then(function( responses){
          var events = responses.map(function( response){
            var endAppointment = moment(response.when).add(30, 'minutes').toDate();
            if( response.duration > 0) {
              endAppointment = moment(response.when).add( response.duration, 'minutes').toDate();
            }
            var title = response.summary;
            return {
              "title": title
              , "start": response.when
              , "end": endAppointment
              , "allDay": false
              , "url": "/response/view/" + response.recordId
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

module.exports = Response;
