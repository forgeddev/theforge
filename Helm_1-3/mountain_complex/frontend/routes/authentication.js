module.exports = function(app){

  /*****************************************************************************
  Pages
  *****************************************************************************/

  app.get('/register', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/standard/register', response);
    });
  });

  app.get('/login', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/standard/login', response);
    });
  });

  app.get('/forgotPassword', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/standard/forgotPassword', response);
    });
  });

  app.get('/changePassword', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/standard/changePassword', response);
    });
  });

  app.get('/logout', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      req.session.destroy();
      res.render('mc/standard/login', response);
    });

  });


  /*****************************************************************************
  API
  *****************************************************************************/


  app.post('/registerRequest', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    user.register( req.body).then(function( response){
      req.session.authenticated_user = response.reference.model;
      res.json(  mountainComplex.buildApiResponse( req, [response]));
    }).catch(function( error) {
      req.session.authenticated_user = undefined;
      errorMessageResponse = self.mountainComplex.buildMessageResponse( "Register request failed!", 'error');
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });

  app.post('/authenticate', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    user.authenticate( req.body).then(function( response){
      req.session.authenticated_user = response.reference.model;
      res.json( mountainComplex.buildApiResponse( req, [response]));
    }).catch(function( error) {
      req.session.authenticated_user = undefined;
      errorMessageResponse = self.mountainComplex.buildMessageResponse( "Authenticate request failed!", 'error');
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });


  });


  app.post('/passwordResetRequest', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    user.requestPasswordReset( req.body).then(function( response){
      res.json( mountainComplex.buildApiResponse( req, [response]));
    }).catch(function( error) {
      req.session.authenticated_user = undefined;
      errorMessageResponse = self.mountainComplex.buildMessageResponse( "Password Reset request failed!", 'error');
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });


  app.post('/changePasswordRequest', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex
      , user = mountainComplex.getModel('user');

    user.changePassword( req.body).then(function( response){
      req.session.authenticated_user = response.reference.model;
      res.json( mountainComplex.buildApiResponse( req, [response]));
    }).catch(function( error) {
      req.session.authenticated_user = undefined;
      errorMessageResponse = self.mountainComplex.buildMessageResponse( "Change Password request failed!", 'error');
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });

  });


}
