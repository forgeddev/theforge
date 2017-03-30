module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;


  /*****************************************************************************
  Page Requests
  *****************************************************************************/

  app.get('/medication/cards', [routeSecurity.userAuthenticated], function(req, res){

    var mountainComplex = req.app.locals.settings.mountainComplex
      , medication = mountainComplex.getModel('medication')
      , filterModel = {
        "filter_field": "parentId"
        , "filter_type": "="
        , "filter_value": req.session.selected_patient.recordId
      }
      , sortModel = {
        "sort_field": "name"
        , "sort_direction": "ASC"
      }
      , orderModel = {
        "onPage": 1
        , "pageSize": 100
      };

    req.session.navigation = {
      "back_page": "/patient/view/" + req.session.selected_patient.recordId
    };

    if( !req.session.selected_patient) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Please select a patient");
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/patient/search', response);
      });
    }

    req.session.navigation = {
      "back_page": "/patient/view/"+req.session.selected_patient.recordId
    };

    medication.find( filterModel, sortModel, orderModel).then( function(findResponse){
      mountainComplex.buildPageResponse(req, [findResponse]).then(function(response){
        res.render('mc/medication/cards', response);
      });
    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Card Listing failed!", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });
    });

  });


  app.get('/medication/edit/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , medication = mountainComplex.getModel('medication');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      medication.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_medication = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0], req.session.selected_patient)
          ]).then(function(response){
            res.render('mc/medication/form', response);
          });

        } else {
          req.session.selected_medication = undefined;
          mountainComplex.buildPageResponse(req, [mountainComplex.buildMessageResponse( "Record not found", "warn")]).then(function(response){
            res.render('mc/medication/form', response);
          });
        }
      }).catch(function( error) {
        req.session.selected_medication = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new

      // clear session
      req.session.selected_medication = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildReferenceResponse(undefined, undefined, req.session.selected_patient)
        , mountainComplex.buildMessageResponse( "New Record", "info")
      ]).then(function(response){
        res.render('mc/medication/form', response);
      });

    }
  });


  app.get('/medication/view/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , medication = mountainComplex.getModel('medication');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      medication.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_medication = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0], req.session.selected_patient)
          ]).then(function(response){
            res.render('mc/medication/view', response);
          });

        } else {
          req.session.selected_medication = undefined;
          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record not found", "warn")
          ]).then(function(response){
            res.render('mc/medication/view', response);
          });

        }
      }).catch(function( error) {
        req.session.selected_medication = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new
      req.session.selected_medication = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildMessageResponse( "Record ID not specified", "warn")
      ]).then(function(response){
        res.render('mc/medication/view', response);
      });

    }
  });


  /*****************************************************************************
  API Requests
  *****************************************************************************/


  app.post('/medication/save', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , medication = mountainComplex.getModel('medication');

    medication.save( req.body).then(function( saveResponse){
      req.session.selected_medication = saveResponse.reference.model;
      res.json(  mountainComplex.buildApiResponse( req, [saveResponse]));
    }).catch(function( error) {
      req.session.selected_medication = undefined;
      errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Save failed!", error);
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });


  app.post('/medication/remove/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , medication = mountainComplex.getModel('medication');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      medication.delete({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_medication = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_medication = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Remove failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_medication = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


  app.post('/medication/restore/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , medication = mountainComplex.getModel('medication');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      medication.restore({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_medication = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_medication = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Restore failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_medication = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


}
