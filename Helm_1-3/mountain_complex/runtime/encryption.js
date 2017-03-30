"use strict";

var crypto = require('crypto');


var Encryption = class {

  constructor( mountainComplex) {
    var self = this;

    self.mountainComplex = mountainComplex;
  }


  encrypt( text){
    try {
      var self = this
        , cipher = crypto.createCipher( self.mountainComplex.config.crypto.algorithm, self.mountainComplex.config.crypto.password)
        , crypted = cipher.update(text,'utf8','hex');

      crypted += cipher.final('hex');
    } catch( error) {
      console.log( error);
    }

    return crypted;
  }


  decrypt( text){
    var self = this
      , decipher = crypto.createDecipher( self.mountainComplex.config.crypto.algorithm, self.mountainComplex.config.crypto.password)
      , dec = decipher.update(text,'hex','utf8');

    dec += decipher.final('utf8');
    return dec;
  }

}

module.exports = Encryption;
