module.exports = function(app){
  app.get('/', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/static-pages/landing', response);
    });
  });


  app.get('/terms', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/static-pages/terms', response);
    });
  });


  app.get('/privacy', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/static-pages/privacy', response);
    });
  });


  app.get('/about', function(req, res){
    var mountainComplex = req.app.locals.settings.mountainComplex;
    mountainComplex.buildPageResponse(req, []).then(function(response){
      res.render('mc/static-pages/about', response);
    });
  });

}
