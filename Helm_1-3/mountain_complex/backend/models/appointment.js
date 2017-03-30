"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , moment = require("moment")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class Appointment extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'appointment');
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
      , "appointmentType": null
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
    self.mountainComplex.askCrud.required( "Appointment Type", model.appointmentType);
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
        }).then(function( appointments){
          var events = appointments.map(function( appointment){
            var endAppointment = moment(appointment.when).add(30, 'minutes').toDate();
            if( appointment.duration > 0) {
              endAppointment = moment(appointment.when).add( appointment.duration, 'minutes').toDate();
            }
            var title = appointment.name;
            if( appointment.primaryPhone) {
              title = title + " (" + appointment.primaryPhone + ") ";
            }
            if( appointment.summary) {
              title = title + " " + appointment.summary + " ";
            }
            return {
              "title": title
              , "start": appointment.when
              , "end": endAppointment
              , "allDay": false
              , "url": "/appointment/view/" + appointment.recordId
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

module.exports = Appointment;
