module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;


  /*****************************************************************************
  Page Requests
  *****************************************************************************/

  app.get('/response/cards', [routeSecurity.userAuthenticated], function(req, res){

    var mountainComplex = req.app.locals.settings.mountainComplex
      , response = mountainComplex.getModel('response')
      , filterModel = {
        "filter_field": "parentId"
        , "filter_type": "="
        , "filter_value": req.session.selected_resourceReferral.recordId
      }
      , sortModel = {
        "sort_field": "when"
        , "sort_direction": "DESC"
      }
      , orderModel = {
        "onPage": 1
        , "pageSize": 100
      };

    req.session.navigation = {
      "back_page": "/resourceReferral/view/" + req.session.selected_resourceReferral.recordId
    };

    if( !req.session.selected_resourceReferral) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Please select a resource");
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/resourceReferral/cards', response);
      });
    }

    req.session.navigation = {
      "back_page": "/resourceReferral/view/"+req.session.selected_resourceReferral.recordId
    };

    response.find( filterModel, sortModel, orderModel).then( function(findResponse){
      mountainComplex.buildPageResponse(req, [findResponse]).then(function(response){
        res.render('mc/response/cards', response);
      });
    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Card Listing failed!", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });
    });

  });


  app.get('/response/edit/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , response = mountainComplex.getModel('response');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      response.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_response = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0], req.session.selected_patient)
          ]).then(function(response){
            res.render('mc/response/form', response);
          });

        } else {
          req.session.selected_response = undefined;
          mountainComplex.buildPageResponse(req, [mountainComplex.buildMessageResponse( "Record not found", "warn")]).then(function(response){
            res.render('mc/response/form', response);
          });
        }
      }).catch(function( error) {
        req.session.selected_response = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new

      // clear session
      req.session.selected_response = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildReferenceResponse(undefined, undefined, req.session.selected_patient)
        , mountainComplex.buildMessageResponse( "New Record", "info")
      ]).then(function(response){
        res.render('mc/response/form', response);
      });

    }
  });


  app.get('/response/view/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , response = mountainComplex.getModel('response');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      response.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_response = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0], req.session.selected_patient)
          ]).then(function(response){
            res.render('mc/response/view', response);
          });

        } else {
          req.session.selected_response = undefined;
          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record not found", "warn")
          ]).then(function(response){
            res.render('mc/response/view', response);
          });

        }
      }).catch(function( error) {
        req.session.selected_response = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new
      req.session.selected_response = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildMessageResponse( "Record ID not specified", "warn")
      ]).then(function(response){
        res.render('mc/response/view', response);
      });

    }
  });


  /*****************************************************************************
  API Requests
  *****************************************************************************/


  app.post('/response/save', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , response = mountainComplex.getModel('response');

    response.save( req.body).then(function( saveResponse){
      req.session.selected_response = saveResponse.reference.model;
      res.json(  mountainComplex.buildApiResponse( req, [saveResponse]));
    }).catch(function( error) {
      req.session.selected_response = undefined;
      errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Save failed!", error);
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });


  app.post('/response/remove/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , response = mountainComplex.getModel('response');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      response.delete({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_response = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_response = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Remove failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_response = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


  app.post('/response/restore/:id?', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , response = mountainComplex.getModel('response');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      response.restore({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_response = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_response = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Restore failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_response = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });

  /*****************************************************************************
  Anonymous Remote Update
  *****************************************************************************/

  app.get('/response/add/:trackingId?', [], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , resourceReferral = mountainComplex.getModel('resourceReferral')
      , response = mountainComplex.getModel('response');

    if( req.params.trackingId && req.params.trackingId.length > 0) {
      resourceReferral.find({ "trackingId": req.params.trackingId }, {}, {}).then(function( findResponse){

        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          var resourceReferralModel = findResponse.data.rows[0]
            , emptyResponseModel = {
              "trackingId": req.params.trackingId
            }

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( "new", emptyResponseModel, resourceReferralModel)
          ]).then(function(response){
            res.render('mc/response/anonymous_form', response);
          });

        } else {
          throw new Error("Referral Not Found");
        }
      }).catch(function( error) {
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find referral failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Tracking ID required to find referral", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });

    }
  });


  app.get('/response/thankyou', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/response/thankyou', response);
    });
  });


  app.post('/response/add', [], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , resourceReferral = mountainComplex.getModel('resourceReferral')
      , response = mountainComplex.getModel('response')
      , resourceReferralModel = undefined
      , anonymousResponse = {};

    if( req.body.trackingId && req.body.trackingId.length > 0) {
      resourceReferral.find({ "trackingId": req.body.trackingId }, {}, {}).then(function( findResponse){

        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          resourceReferralModel = findResponse.data.rows[0];
          anonymousResponse = req.body;
          anonymousResponse.parentId = resourceReferralModel.recordId;
          return response.save( anonymousResponse);
        } else {
          throw new Error("Resource Referral not found");
        }
      }).then(function(saveResponse){
        res.json(  mountainComplex.buildApiResponse( req, [saveResponse]));
      }).catch(function( error) {
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Save failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Tracking ID required to find referral", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });
    }

  });


}
