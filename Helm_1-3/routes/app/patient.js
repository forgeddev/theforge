module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;


  /*****************************************************************************
  Page Requests
  *****************************************************************************/

  app.get('/patient/listing/:onPage?/:pageSize?', [routeSecurity.userAuthenticated], function(req, res){

    var mountainComplex = req.app.locals.settings.mountainComplex
      , filterModel = {}
      , sortModel = {}
      , patient = mountainComplex.getModel('patient');

    if( req.session.patient_listing_filter) {
      filterModel = req.session.patient_listing_filter;
    }

    if( req.session.patient_listing_sort) {
      sortModel = req.session.patient_listing_sort;
    }

    patient.find( filterModel, sortModel, req.params).then( function(findResponse){
      res.render('app/patient/listing', mountainComplex.buildPageResponse(req, [findResponse]));
    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Listing failed!", error);
      res.render('mc/app-error', mountainComplex.buildPageResponse(req, [errorResponse]));
    });

  });


  app.get('/patient/edit/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , patient = mountainComplex.getModel('patient');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      patient.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_patient = findResponse.data.rows[0];

          res.render(
            'app/patient/form'
            , mountainComplex.buildPageResponse( req, [
              mountainComplex.buildMessageResponse( "Record Found", "success")
              , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0])
            ])
          );

        } else {
          req.session.selected_patient = undefined;
          res.render(
            'app/patient/form'
            , mountainComplex.buildPageResponse( req, [
              mountainComplex.buildMessageResponse( "Record not found", "warn")
            ])
          );

        }
      }).catch(function( error) {
        req.session.selected_patient = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        res.render('mc/app-error', mountainComplex.buildPageResponse(req, [errorResponse]));
      });
    } else {
      // Behavior when no id passed or new

      // clear session
      req.session.selected_patient = undefined;

      res.render(
        'app/patient/form'
        , mountainComplex.buildPageResponse( req, [
          mountainComplex.buildReferenceResponse()
          , mountainComplex.buildMessageResponse( "New Record", "info")
        ])
      );

    }
  });


  app.get('/patient/view/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , patient = mountainComplex.getModel('patient');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      patient.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_patient = findResponse.data.rows[0];

          res.render(
            'app/patient/view'
            , mountainComplex.buildPageResponse( req, [
              mountainComplex.buildMessageResponse( "Record Found", "success")
              , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0])
            ])
          );

        } else {
          req.session.selected_patient = undefined;
          res.render(
            'app/patient/view'
            , mountainComplex.buildPageResponse( req, [
              mountainComplex.buildMessageResponse( "Record not found", "warn")
            ])
          );

        }
      }).catch(function( error) {
        req.session.selected_patient = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        res.render('mc/app-error', mountainComplex.buildPageResponse(req, [errorResponse]));
      });
    } else {
      // Behavior when no id passed or new
      req.session.selected_patient = undefined;
      res.render(
        'app/patient/form'
        , mountainComplex.buildPageResponse( req, [
          mountainComplex.buildMessageResponse( "Record ID not specified", "warn")
        ])
      );

    }
  });


  /*****************************************************************************
  API Requests
  *****************************************************************************/


  app.post('/patient/save', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , patient = mountainComplex.getModel('patient');

    patient.save( req.body).then(function( saveResponse){
      req.session.selected_patient = saveResponse.reference.model;
      res.json(  mountainComplex.buildApiResponse( req, [saveResponse]));
    }).catch(function( error) {
      req.session.selected_patient = undefined;
      errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Save failed!", error);
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });


  app.post('/patient/remove/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , patient = mountainComplex.getModel('patient');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      patient.delete({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_patient = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_patient = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Remove failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_patient = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


  app.post('/patient/restore/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , patient = mountainComplex.getModel('patient');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      patient.restore({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_patient = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_patient = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Restore failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_patient = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


  app.post('/patient/listing_sort', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;

    req.session.patient_listing_sort = req.body;

    if( req.session.patient_listing_sort) {
      res.json(  mountainComplex.buildApiResponse( req, [
        mountainComplex.buildMessageResponse("Sort Set", "success")
      ]));
    } else {
      res.json(  mountainComplex.buildApiResponse( req, [
        mountainComplex.buildMessageResponse("Sort Not Set", "error")
      ]));
    }

  });


  app.post('/patient/listing_filter', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;

    req.session.patient_listing_filter = req.body;

    if( req.session.patient_listing_filter) {
      res.json(  mountainComplex.buildApiResponse( req, [
        mountainComplex.buildMessageResponse("Filter Set", "success")
      ]));
    } else {
      res.json(  mountainComplex.buildApiResponse( req, [
        mountainComplex.buildMessageResponse("Filter Not Set", "error")
      ]));
    }

  });


}
