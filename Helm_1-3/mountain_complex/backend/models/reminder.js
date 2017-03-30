"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , moment = require("moment")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class Reminder extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'reminder');
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
      , "reminderType": null
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
    self.mountainComplex.askCrud.required( "Reminder Type", model.reminderType);
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
        }).then(function( reminders){
          var events = reminders.map(function( reminder){
            var endAppointment = moment(reminder.when).add(30, 'minutes').toDate();
            if( reminder.duration > 0) {
              endAppointment = moment(reminder.when).add( reminder.duration, 'minutes').toDate();
            }
            var title = reminder.summary;
            return {
              "title": title
              , "start": reminder.when
              , "end": endAppointment
              , "allDay": false
              , "url": "/reminder/view/" + reminder.recordId
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

module.exports = Reminder;
