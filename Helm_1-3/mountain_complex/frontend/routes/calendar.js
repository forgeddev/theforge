// Libraries
var Promise = require("promise")
  , moment = require("moment");

module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;

  /*****************************************************************************
  Helper Functions
  *****************************************************************************/
  var getCalendarEntries = function( startDate, endDate) {

  }

  /*****************************************************************************
  Page Requests
  *****************************************************************************/

  app.get('/calendar/main/', [routeSecurity.userAuthenticated], function(req, res){

    var mountainComplex = req.app.locals.settings.mountainComplex;

    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/calendar/main', response);
    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Calendar view failed!", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });
    });

  });



  /*****************************************************************************
  Data Requests
  *****************************************************************************/

  app.post('/calendar/entries', [routeSecurity.userAuthenticated], function(req, res){

    var mountainComplex = req.app.locals.settings.mountainComplex
      , appointment = mountainComplex.getModel('appointment')
      , reminder = mountainComplex.getModel('reminder')
      , resourceReferral = mountainComplex.getModel('resourceReferral')
      , response = mountainComplex.getModel('response')
      , today = new Date()
      , startDateMoment = moment(req.body.startdate, "YYYY-MM-DD").add(-7,"days")
      , endDateMoment = moment(req.body.enddate, "YYYY-MM-DD").add(37,"days")
      , startDate = startDateMoment.toDate()
      , endDate = endDateMoment.toDate();

    var getCalendarPromises = [
      appointment.getCalendar(startDate, endDate)
      , reminder.getCalendar(startDate, endDate)
      , resourceReferral.getCalendar(startDate, endDate)
      , response.getCalendar(startDate, endDate)
    ];

    Promise.all(getCalendarPromises).then(function(results){
      var getCalendarAppointmentsResponse = results[0]
        , getCalendarRemindersResponse = results[1]
        , getCalendarResourceReferral = results[2]
        , getCalendarReferralResponse = results[3]
        , combinedCalendarEntries = []
        , combinedDataResponse = undefined;

      if( getCalendarAppointmentsResponse
        && getCalendarAppointmentsResponse.data
        && getCalendarAppointmentsResponse.data.rows
      ) {
        combinedCalendarEntries = combinedCalendarEntries.concat( getCalendarAppointmentsResponse.data.rows);
      }

      if( getCalendarRemindersResponse
        && getCalendarRemindersResponse.data
        && getCalendarRemindersResponse.data.rows
      ) {
        combinedCalendarEntries = combinedCalendarEntries.concat( getCalendarRemindersResponse.data.rows);
      }

      if( getCalendarResourceReferral
        && getCalendarResourceReferral.data
        && getCalendarResourceReferral.data.rows
      ) {
        combinedCalendarEntries = combinedCalendarEntries.concat( getCalendarResourceReferral.data.rows);
      }

      if( getCalendarReferralResponse
        && getCalendarReferralResponse.data
        && getCalendarReferralResponse.data.rows
      ) {
        combinedCalendarEntries = combinedCalendarEntries.concat( getCalendarReferralResponse.data.rows);
      }

      dataResponse = mountainComplex.buildDataResponse(combinedCalendarEntries, {}, {});
      return dataResponse;

    }).then(function( dataResponse){
      res.json(  mountainComplex.buildApiResponse( req, [dataResponse]));

    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Failed to get calendar entries!", error);
      res.json(  mountainComplex.buildApiResponse( req, [errorResponse]));

    });

  });

}
