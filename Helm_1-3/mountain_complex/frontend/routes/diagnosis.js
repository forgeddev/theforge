module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;


  /*****************************************************************************
  Page Requests
  *****************************************************************************/

  app.get('/diagnosis/cards', [routeSecurity.userAuthenticated], function(req, res){

    var mountainComplex = req.app.locals.settings.mountainComplex
      , diagnosis = mountainComplex.getModel('diagnosis')
      , filterModel = {
        "filter_field": "parentId"
        , "filter_type": "="
        , "filter_value": req.session.selected_patient.recordId
      }
      , sortModel = {
        "sort_field": "diagnosisDate"
        , "sort_direction": "DESC"
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

    diagnosis.find( filterModel, sortModel, orderModel).then( function(findResponse){
      mountainComplex.buildPageResponse(req, [findResponse]).then(function(response){
        res.render('mc/diagnosis/cards', response);
      });
    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Card Listing failed!", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });
    });

  });


  app.get('/diagnosis/edit/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , diagnosis = mountainComplex.getModel('diagnosis');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      diagnosis.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_diagnosis = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0], req.session.selected_patient)
          ]).then(function(response){
            res.render('mc/diagnosis/form', response);
          });

        } else {
          req.session.selected_diagnosis = undefined;
          mountainComplex.buildPageResponse(req, [mountainComplex.buildMessageResponse( "Record not found", "warn")]).then(function(response){
            res.render('mc/diagnosis/form', response);
          });
        }
      }).catch(function( error) {
        req.session.selected_diagnosis = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new

      // clear session
      req.session.selected_diagnosis = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildReferenceResponse(undefined, undefined, req.session.selected_patient)
        , mountainComplex.buildMessageResponse( "New Record", "info")
      ]).then(function(response){
        res.render('mc/diagnosis/form', response);
      });

    }
  });


  app.get('/diagnosis/view/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , diagnosis = mountainComplex.getModel('diagnosis');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      diagnosis.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_diagnosis = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0], req.session.selected_patient)
          ]).then(function(response){
            res.render('mc/diagnosis/view', response);
          });

        } else {
          req.session.selected_diagnosis = undefined;
          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record not found", "warn")
          ]).then(function(response){
            res.render('mc/diagnosis/view', response);
          });

        }
      }).catch(function( error) {
        req.session.selected_diagnosis = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new
      req.session.selected_diagnosis = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildMessageResponse( "Record ID not specified", "warn")
      ]).then(function(response){
        res.render('mc/diagnosis/view', response);
      });

    }
  });


  /*****************************************************************************
  API Requests
  *****************************************************************************/


  app.post('/diagnosis/save', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , diagnosis = mountainComplex.getModel('diagnosis');

    diagnosis.save( req.body).then(function( saveResponse){
      req.session.selected_diagnosis = saveResponse.reference.model;
      res.json(  mountainComplex.buildApiResponse( req, [saveResponse]));
    }).catch(function( error) {
      req.session.selected_diagnosis = undefined;
      errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Save failed!", error);
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });


  app.post('/diagnosis/remove/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , diagnosis = mountainComplex.getModel('diagnosis');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      diagnosis.delete({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_diagnosis = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_diagnosis = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Remove failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_diagnosis = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


  app.post('/diagnosis/restore/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , diagnosis = mountainComplex.getModel('diagnosis');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      diagnosis.restore({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_diagnosis = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_diagnosis = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Restore failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_diagnosis = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


}
