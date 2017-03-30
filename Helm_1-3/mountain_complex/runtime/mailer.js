"use strict";

// Libraries
var Promise = require("promise")
  , moment = require("moment")
  , mysql = require('mysql')
  , nodemailer = require('nodemailer');


// Class
class Mailer {

  constructor( mountainComplex) {
    var self = this;

    self.mountainComplex = mountainComplex;
  }

  send( mailOptions) {
    var self = this;

    console.log(self.mountainComplex.config);

    var promise = new Promise( function( resolve, reject) {
      Promise.resolve().then(function(){

        if( mailOptions.from) {
          mailOptions.from = self.mountainComplex.config.email.user;
        }

        if( !mailOptions.to || mailOptions.to == "") {
          throw new Error("Missing Email Receiptient: (To)");
        }

        var transporter = nodemailer.createTransport({
          service: 'Gmail'
          , auth: {
            user: self.mountainComplex.config.email.user
            , pass: self.mountainComplex.config.email.password
          }
        });

        transporter.sendMail( mailOptions, function( error, info){
          if( error){
            throw error;
          } else {
            var messageResponse = self.mountainComplex.buildMessageResponse( 'Email sent!', 'success')
            resolve( self.mountainComplex.assembleResponses([messageResponse]));
          };
        });

      }).catch(function( error) {
        var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Failed to Save', error)
        resolve( self.mountainComplex.assembleResponses([errorMessageResponse]));

      }); // end catch
    }); // End Promise Definition

    return promise;
  }



}

module.exports = Mailer;
