module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;


  /*****************************************************************************
  API Requests
  *****************************************************************************/


  app.post('/mailer/email', [routeSecurity.userAuthenticated], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;

    mountainComplex.mailer.send( req.body).then(function( mailResponse){
      res.json(  mountainComplex.buildApiResponse( req, [mailResponse]));
    }).catch(function( error) {
      errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( "Failed to send email!", error);
      res.json( mountainComplex.buildApiResponse( req, [errorMessageResponse]));
    });
  });


}
