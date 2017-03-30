module.exports = function(app){

  /*****************************************************************************
  Security Middleware
  *****************************************************************************/

  var routeSecurity = app.locals.settings.mountainComplex.routeSecurity;


  /*****************************************************************************
  Page Requests
  *****************************************************************************/

  app.get('/home', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/home/page', response);
    });
  });

  app.get('/admin', [routeSecurity.userAuthenticated, routeSecurity.userIsAdmin], function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/admin/page', response);
    });
  });

}
