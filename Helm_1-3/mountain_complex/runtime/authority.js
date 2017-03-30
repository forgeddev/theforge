"use strict";

// Libraries
var Promise = require("promise")
  , mysql = require('mysql');


// Class
class Authority {

  constructor( mountainComplex) {
    var self = this;

    self.mountainComplex = mountainComplex;
  }

  getPermissions( user) {
    var permissions = {
      "user": {
        "email": null
        , "recordId": 0
      }
      , "disposition": [
      ]
      , "groups": [
      ]
    };

    if( user) {
      permissions.user.email = user.email;
      permissions.user.recordId = user.recordId;
      permissions.disposition.push("logged_in");

      if( user.admin == 'Y') {
        permissions.disposition.push("admin");
      }
    }

    return permissions;
  }

}

module.exports = Authority;
