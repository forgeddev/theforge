"use strict";

var Promise = require("promise");
var mysql = require('mysql');


var RouteSecurity = class {

  constructor() {
    var self = this;
  }


  userAuthenticated(req, res, next) {
    var self = this;

    if( req.session.authenticated_user && req.session.authenticated_user.recordId > 0) {
      return next();
    } else {
      var mountainComplex = req.app.locals.settings.mountainComplex
        , errorResponse = mountainComplex.buildMessageResponse( "Login Required", 'error');
        
      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/standard/login', response);
      });
    };
  }


  userIsAdmin(req, res, next) {
    var self = this;

    if( req.session.authenticated_user && req.session.authenticated_user.admin && req.session.authenticated_user.admin == 'Y' ) {
      return next();
    } else {
      var mountainComplex = req.app.locals.settings.mountainComplex
        , errorResponse = mountainComplex.buildMessageResponse( "Login Required", 'error');

      mountainComplex.buildPageResponse(req, [errorResponse]).then(function(response){
        res.render('mc/standard/login', response);
      });
    };
  }

}

module.exports = RouteSecurity;
