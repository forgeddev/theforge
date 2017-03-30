module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;


  /*****************************************************************************
  Page Requests
  *****************************************************************************/

  app.get('/user/listing/:onPage?/:pageSize?', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , filterModel = {}
      , sortModel = {}
      , user = mountainComplex.getModel('user');

    if( req.session.user_listing_filter) {
      filterModel = req.session.user_listing_filter;
    }

    if( req.session.user_listing_sort) {
      sortModel = req.session.user_listing_sort;
    }

    user.find( filterModel, sortModel, req.params).then( function(findResponse){
      mountainComplex.buildPageResponse(req, [findResponse]).then(function(response){
        res.render('mc/user/listing', response);
      });

    }).catch(function( error) {
      var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Listing failed!", error);
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/app-error', response);
      });
    });

  });


  app.get('/user/edit/:id?', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      user.findById({ "recordId": req.params.id }).then(function( findResponse){
        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_user = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0])
          ]).then(function(response){
            res.render('mc/user/form', response);
          });

        } else {
          req.session.selected_user = undefined;
          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record not found", "warn")
          ]).then(function(response){
            res.render('mc/user/form', response);
          });

        }
      }).catch(function( error) {
        req.session.selected_user = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });
      });
    } else {
      // Behavior when no id passed or new

      // clear session
      req.session.selected_user = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildReferenceResponse()
        , mountainComplex.buildMessageResponse( "New Record", "info")
      ]).then(function(response){
        res.render('mc/user/form', response);
      });

    }
  });


  app.get('/user/view/:id?', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      user.findById({ "recordId": req.params.id }).then(function( findResponse){

        if( findResponse
          && findResponse.data
          && findResponse.data.rows
          && Array.isArray(findResponse.data.rows)
          && findResponse.data.rows.length > 0) {

          // save in session
          req.session.selected_user = findResponse.data.rows[0];

          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record Found", "success")
            , mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0])
          ]).then(function(response){
            res.render('mc/user/view', response);
          });

        } else {
          req.session.selected_user = undefined;
          mountainComplex.buildPageResponse(req, [
            mountainComplex.buildMessageResponse( "Record not found", "warn")
          ]).then(function(response){
            res.render('mc/user/view', response);
          });

        }
      }).catch(function( error) {
        req.session.selected_user = undefined;
        var errorResponse = self.mountainComplex.buildErrorMessageResponse( "Find record failed!", error);
        mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
          res.render('mc/app-error', response);
        });

      });
    } else {
      // Behavior when no id passed or new
      req.session.selected_user = undefined;
      mountainComplex.buildPageResponse(req, [
        mountainComplex.buildMessageResponse( "Record ID not specified", "warn")
      ]).then(function(response){
        res.render('mc/user/view', response);
      });

    }
  });


  /*****************************************************************************
  API Requests
  *****************************************************************************/


  app.post('/user/save', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    user.save( req.body).then(function( saveResponse){
      req.session.selected_user = saveResponse.model;
      res.json( saveResponse);
    }).catch(function( error) {
      req.session.selected_user = undefined;
      errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Save failed!", error);
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });


  app.post('/user/remove/:id?', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      user.delete({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_user = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_user = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Remove failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_user = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


  app.post('/user/restore/:id?', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    if( req.params.id && req.params.id > 0 && req.params.id != "new") {
      user.restore({"recordId": req.params.id}).then(function( deleteResponse){
        req.session.selected_user = undefined;
        res.json(  mountainComplex.buildApiResponse( req, [deleteResponse]));
      }).catch(function( error) {
        req.session.selected_user = undefined;
        errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Restore failed!", error);
        res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
      });
    } else {
      req.session.selected_user = undefined;
      var missingIdResponse = self.mountainComplex.buildMessageResponse( 'Not Removed, missing id', 'warn', result);
      res.json(  mountainComplex.buildApiResponse( req, [missingIdResponse]));
    }
  });


  app.post('/user/listing_sort', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;

    req.session.user_listing_sort = req.body;

    if( req.session.user_listing_sort) {
      res.json(  mountainComplex.buildApiResponse( req, [
        mountainComplex.buildMessageResponse("Sort Set", "success")
      ]));
    } else {
      res.json(  mountainComplex.buildApiResponse( req, [
        mountainComplex.buildMessageResponse("Sort Not Set", "error")
      ]));
    }

  });


  app.post('/user/listing_filter', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;

    req.session.user_listing_filter = req.body;

    if( req.session.user_listing_filter) {
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
