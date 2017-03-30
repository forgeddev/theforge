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

    req.session.navigation = {
      "back_page": "/patient/listing/"
    };

    if( req.session.patient_listing_filter) {
      filterModel = req.session.patient_listing_filter;
    }

    if( req.session.patient_listing_sort) {
      sortModel = req.session.patient_listing_sort;
    }

    patient.find( filterModel, sortModel, req.params).then( function(findResponse){
      mountainComplex.buildPageResponse(req, [findResponse]).then(function(response){
        res.render('mc/patient/listing', response);
      });
    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Listing failed!", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });
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

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0])
          ]).then(function(response){
            res.render('mc/patient/form', response);
          });

        } else {
          req.session.selected_patient = undefined;
          mountainComplex.buildPageResponse(req, [mountainComplex.buildMessageResponse( "Record not found", "warn")]).then(function(response){
            res.render('mc/patient/form', response);
          });
        }
      }).catch(function( error) {
        req.session.selected_patient = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new

      // clear session
      req.session.selected_patient = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildReferenceResponse()
        , mountainComplex.buildMessageResponse( "New Record", "info")
      ]).then(function(response){
        res.render('mc/patient/form', response);
      });

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

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0])
          ]).then(function(response){
            res.render('mc/patient/view', response);
          });

        } else {
          req.session.selected_patient = undefined;
          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record not found", "warn")
          ]).then(function(response){
            res.render('mc/patient/view', response);
          });

        }
      }).catch(function( error) {
        req.session.selected_patient = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new
      req.session.selected_patient = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildMessageResponse( "Record ID not specified", "warn")
      ]).then(function(response){
        res.render('mc/patient/view', response);
      });

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


  /*****************************************************************************
  Custom Pages & API
  *****************************************************************************/

  app.all('/patient/search/', [routeSecurity.userAuthenticated], function(req, res){

    var mountainComplex = req.app.locals.settings.mountainComplex
      , filterModel = {}
      , sortModel = {}
      , limitModel = {}
      , patient = mountainComplex.getModel('patient');

    req.session.navigation = {
      "back_page": "/patient/search/"
    };

    var form = undefined;
    if( req.session.patient_search_filter){
      filterModel = req.session.patient_search_filter;
      form = mountainComplex.buildFormResponse( filterModel);
    }


    if( req.body && req.method == 'POST') {
      req.session.patient_search_filter = req.body;

      patient.find( filterModel, sortModel, limitModel).then( function(findResponse){

        mountainComplex.buildPageResponse(req, [findResponse,form]).then(function(response){
          res.render('mc/patient/search', response);
        });
      }).catch(function( error) {
        var errorResponse = mountainComplex.buildErrorMessageResponse( "Search failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });

    } else {
      var messageResponse = mountainComplex.buildMessageResponse( "Ready for Search Criteria", "info")
        , dataResponse = mountainComplex.buildDataResponse([]);

      mountainComplex.buildPageResponse(req, [messageResponse, dataResponse, form]).then(function(response){
        res.render('mc/patient/search', response);
      });
    }

  });


}
