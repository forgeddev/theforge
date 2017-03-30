"use strict";

var fs = require("fs")
  , path = require("path")
  , process = require("process")
  , Promise = require("promise")
  , ObjectAssign = require('object-assign')
  , mysql = require('mysql')
  , AskCrud = require( path.join(__dirname,'ask-crud.js'))
  , Authority = require( path.join(__dirname,'authority.js'))
  , RandomData = require( path.join(__dirname,'random-data.js'))
  , Encryption = require( path.join(__dirname,'encryption.js'))
  , RouteSecurity = require( path.join(__dirname,'route-security.js'))
  , Template = require( path.join(__dirname,'template.js'))
  , Mailer = require( path.join(__dirname,'mailer.js'));


class MountainComplex {

  constructor( config_file) {
    var self = this;

    self.setDefaults();
    self.loadConfig( config_file);
    self.askCrud = new AskCrud(self);
    self.randomData = new RandomData();
    self.encryption = new Encryption( self);
    self.routeSecurity = new RouteSecurity();
    self.template = new Template();
    self.mailer = new Mailer( self);
  }


  /*****************************************************************************
  Configuration
  *****************************************************************************/


  setDefaults() {
    var self = this;

    self.routesDirectory = path.join(__dirname, 'routes', 'mc');
    self.routesRelativeDirectory = path.join('routes', 'mc');
  }


  loadConfig( config_file) {
    var self = this;

    var exists = fs.existsSync( config_file);
    if( exists) {
      var config = fs.readFileSync( config_file);
      self.config = JSON.parse( config);
    } else {
      self.config = {};
    }

    if( self.config.database) {
      self.setupDatabase();
    }
  }


  getConfig() {
    var self = this;
    return self.config;
  }


  getConstants() {
    var self = this
      , constants = {};
    if( self.config.constants) {
      constants = self.config.constants
    }
    return constants;
  }


  /*****************************************************************************
  Models
  *****************************************************************************/


  loadModels( modelPath) {
    var self = this;

    fs.readdirSync( modelPath).forEach(function(file) {
      if( !file.startsWith(".")) {
        var name = file.substr(0, file.indexOf('.'))
          , lib = require( path.join(modelPath, file));

        self[name+'Model'] = require( path.join(modelPath, file));
      }
    });
  }


  getModel( name) {
    var self = this;

    if( self[name+'Model']) {
      return new self[name+'Model'](self);
    } else {
      throw error("No Model found for: " + name);
    }
  }


  /*****************************************************************************
  Database
  *****************************************************************************/


  setupDatabase() {
    var self = this;

    self.pool = mysql.createPool({
      "connectionLimit": self.config.database.connectionLimit
      , "host": self.config.database.host
      , "user": self.config.database.user
      , "password": self.config.database.password
      , "database": self.config.database.database
      , "debug": self.config.database.debug
    });
  }


  query( sql, data) {
    var self = this
      , promise = new Promise( function( resolve, reject) {

      try {
        self.pool.getConnection( function( err,connection){
          if( err) {
            throw err;
          }

          if( self.config.database.log) {
            console.log('connected as id ' + connection.threadId);
          }

          var query = connection.query(sql, data, function( err, result, fields){
            connection.release();
            resolve( {
              "err": err
              , "result": result
              , "fields": fields
            });
          });
          if( self.config.database.log) {
            console.log( query.sql);
          }

          connection.on('error', function(err) {
            throw err;
          });
        });
      } catch( error) {
        reject({
          "err": error
        });
      }
    });

    return promise;
  }


  /*****************************************************************************
  Express Error Handling
  *****************************************************************************/

  handleErrors( app) {

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
      var mountainComplex = req.app.locals.settings.mountainComplex;

      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      mountainComplex.buildPageResponse(req, []).then(function(response){
        res.render('mc/error', response);
      });

    });
  }


  /*****************************************************************************
  Response Management - Route: Page & Api
  *****************************************************************************/

  getUserAuthority( req) {
    var self = this
      , authority = new Authority( this)
      , user_authority = undefined;

    if( req && req.session && req.session.authenticated_user && req.session.user_authority) {
      user_authority = req.session.user_authority;

    } else if( req && req.session && req.session.authenticated_user) {
      user_authority = authority.getPermissions( req.session.authenticated_user);
      req.session.user_authority = user_authority;

    }

    if( self.config.framework.log) {
      console.log( " -- user authority -- ");
      console.log( user_authority);
    }

    return user_authority;
  }


  getNavigation( req) {
    var self = this
      , navigation = {};

    if( req && req.session && req.session.navigation) {
      navigation = req.session.navigation;
    }

    if( self.config.framework.log) {
      console.log( " -- navigation -- ");
      console.log( navigation);
    }

    return navigation;
  }


  getLists( req) {
    var self = this
      , lists = []
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( self.config.framework.log) {
          console.log( " -- getLists -- ");
        }

        if( req && req.session && req.session.lists) {
          if( self.config.framework.log) {
            console.log( "List has " + req.session.lists.length + " entries");
          }
          self.template.setLists(req.session.lists);
          resolve(req.session.lists);
        } else {
          var listModel = self.getModel('list');
          listModel.getAllLists().then(function(getAllResponse){
            if( self.config.framework.log) {
              console.log( getAllResponse.message);
            }
            req.session.lists = getAllResponse.data.rows;
            self.template.setLists(getAllResponse.data.rows);
            resolve(getAllResponse);
          });
        }

      }).catch(function(error){
        resolve(lists);
      });

    }).catch(function(error){
      resolve(lists);
    });


    return promise;
  }


  buildMessageResponse( messageText, messageType, details) {
    var response = {
      "message": {
        "messageType": messageType
        , "messageText": messageText
        , "details": details
      }
    };

    return response;
  }


  buildErrorMessageResponse( message, error) {
    var response = {
      "message": {
        "messageType": 'error'
        , "messageText": message
        , "details": (error.message) ? error.message : error
      }
    };

    return response;
  }


  buildReferenceResponse( id, model, parent) {
    var response = {
      "reference": {
        "id": id
        , "model": model
        , "parent": parent
      }
    };

    return response;
  }


  buildPagination( count, page_size, on_page, pages) {
    var response = {
        "count": (count) ? count : 0
        , "page_size": (page_size) ? page_size : 0
        , "on_page": (on_page) ? on_page : 0
        , "pages": (pages) ? pages : 0
    };

    return response;
  }


  buildDataResponse( rows, filter, sort, pagination) {
    var response = {
      "data": {
        "rows": rows
        , 'pagination': pagination
        , 'filter': filter
        , 'sort': sort
      }
    };

    return response;
  }


  buildFormResponse( formData) {
    var response = {
      "form": formData
    };

    return response;
  }


  buildPageResponse( req, responses) {
    var self = this
      , combinedResponses = undefined
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){

        if( self.config.framework.log) {
          console.log("=== buildPageResponse ===");
        }

        responses.push({
          "constants": self.getConstants()
          , "authority": self.getUserAuthority( req)
          , "navigation": self.getNavigation( req)
          , "site": {
            "base_url": req.protocol + '://' + req.get('host')
          }
        });

        self.getLists( req).then(function(listResponse){
          var lists = [];
          if( listResponse.data && listResponse.data.rows){
            lists = listResponse.data.rows;
          } else {
            lists = listResponse;
          }

          responses.push({
            "lists": lists
          });

          combinedResponses = self.assembleResponses(responses);

          resolve(combinedResponses);
        });

      }).catch(function(error){
        responses.push(self.buildErrorMessageResponse('Error building page response', error));
        combinedResponses = self.assembleResponses(responses);
        resolve(combinedResponses);
      });

    }).catch(function(error){
      responses.push(self.buildErrorMessageResponse('Error building page response', error));
      combinedResponses = self.assembleResponses(responses);
      resolve(combinedResponses);
    });

    return promise;
  }


  buildApiResponse( req, responses) {
    var self = this
      , combinedResponses = undefined;

    if( self.config.framework.log) {
      console.log("=== buildApiResponse ===");
    }

    // future placeholder for request specific API content injection
    // keeps the page and api pattern the same
    //responses.push({});

    combinedResponses = self.assembleResponses(responses);

    if( self.config.framework.log) {
      console.log(combinedResponses);
    }

    return combinedResponses;
  }


  assembleResponses( responses) {
    var self = this
      , combinedResponse = {};

    responses.forEach( function(response) {
      ObjectAssign(combinedResponse, response);
    });

    return combinedResponse;
  }


}

module.exports = MountainComplex;
