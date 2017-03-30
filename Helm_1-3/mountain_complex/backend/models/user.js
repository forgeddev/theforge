"use strict";

// Libraries
var fs = require("fs")
  , path = require("path")
  , AskCrudModel = require( path.join(__dirname,'..', '..', 'runtime', 'ask-crud-model.js'));

class User extends AskCrudModel {

  constructor( mountainComplex) {
    super( mountainComplex, 'user');
  }


  getBlank() {
    var model = {
      "recordId": null
      , "createdOn": null
      , "updatedOn": null
      , "isDeleted": 'N'
      , "email": undefined
      , "password": undefined
      , "locked": 'N'
      , "admin": 'N'
      , "failed_attempts": 0
      , "password_reset_token": undefined
    };

    return model;
  }


  validate( object) {
    // object is for transient data from form
    var self = this
      , model = self.model;

      self.mountainComplex.askCrud.regularExpression( "Email", model.email, /\S+@\S+\.\S+/, "bob@work.com");

      if( object.password && object.password_confirmation && object.password != object.password_confirmation) {
        throw new Error("Password and confirmation password must match!");
      }

      if( object.new_password && object.new_password_confirmation && object.new_password != object.new_password_confirmation) {
        throw new Error("New Password and confirmation password must match!");
      }
  }


  beforeAdd( object) {
    var self = this
      , model = self.model;

    if( object.password && object.password_confirmation && object.password == object.password_confirmation) {
      model.password = self.mountainComplex.encryption.encrypt(object.password);
    }

    return;
  }


  beforeUpdate( object) {
    var self = this
      , model = self.model;

    if( object.new_password && object.new_password_confirmation && object.new_password == object.new_password_confirmation) {
      model.password = self.mountainComplex.encryption.encrypt(object.new_password);
    } else {
      // remove property to prevent password update
      delete model['password'];
    }

    return;
  }



  register( formData) {
    var self = this
      , promise = new Promise( function(resolve, reject) {

      Promise.resolve(formData).then(function( formData){
        self.set( formData);
        self.validate( formData);

        // Response Management
        var messageResponse = undefined
          , errorMessageresponse = undefined
          , referenceResponse = undefined;

        self.find({
          "filter_field": "email"
          , "filter_type": "="
          , "filter_value": formData.email
        }).then(function( findResponse) {
          if( findResponse && findResponse.data && findResponse.data.rows && Array.isArray(findResponse.data.rows) && findResponse.data.rows.length > 0) {
            errorMessageresponse = self.mountainComplex.buildMessageResponse( formData.email + " already exists!", 'warn');
            throw new Error( errorMessageResponse.message.messageText);
          } else {
            if( self.mountainComplex.config.authentication.self_register_as_admin == true) {
              formData.admin = "Y";
            }
            return self.save( formData);
          }

        }).then(function( saveResponse) {
          if( saveResponse && saveResponse.reference) {
            messageResponse = self.mountainComplex.buildMessageResponse( "Account created!", 'success');
            referenceResponse = self.mountainComplex.buildReferenceResponse( saveResponse.reference.id, saveResponse.reference.model);
            resolve(
              self.mountainComplex.assembleResponses([
                messageResponse
                , referenceResponse
              ])
            );

          } else if(saveResponse && saveResponse.messageType) {
            errorMessageresponse = saveResponse;
            referenceResponse = self.mountainComplex.buildReferenceResponse();
            throw new Error( errorMessageResponse.message.messageText);

          } else {
            errorMessageresponse = self.mountainComplex.buildMessageResponse( "Registration Issue", 'warn');
            referenceResponse = self.mountainComplex.buildReferenceResponse();
            throw new Error( errorMessageResponse.message.messageText);

          }

        }).catch( function( error) {
          if( !errorMessageresponse) {
            errorMessageresponse = self.mountainComplex.buildErrorMessageResponse( 'Registration Failed', error)
          }
          resolve(
            self.mountainComplex.assembleResponses([
              errorMessageresponse
              , self.mountainComplex.buildReferenceResponse()
            ])
          );
        });

      }).catch(function( error) {
        var exceptionMessage = self.mountainComplex.buildMessageResponse( error.message, 'error');
        resolve( self.mountainComplex.assembleResponses([
            exceptionMessage
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise Resolve


    }); // End Promise Definition

    return promise;
  }



  authenticate( formData) {
    var self = this
      , promise = new Promise( function(resolve, reject) {

      Promise.resolve(formData).then(function( formData){

        self.set( formData);
        self.validate( formData);

        // Response Management
        var assembledResponse = undefined
           , messageResponse = undefined
           , errorMessageResponse = undefined
           , referenceResponse = undefined
           , userModel = undefined;

        self.find({
          "filter_field": "email"
          , "filter_type": "="
          , "filter_value": formData.email
        }).then(function( findResponse) {

          if( findResponse && findResponse.data && findResponse.data.rows && Array.isArray(findResponse.data.rows) && findResponse.data.rows.length > 0) {
            userModel = findResponse.data.rows[0];
            referenceResponse = self.mountainComplex.buildReferenceResponse( userModel.recordId, userModel);
            return true;
          } else {
            errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account could not be found.", 'warn');
            throw new Error( errorMessageResponse.message.messageText);
          }

        }).then(function( accountFound) {
          if( accountFound && referenceResponse) {
            if( referenceResponse.reference
              && referenceResponse.reference.model
              && referenceResponse.reference.model.locked
              && referenceResponse.reference.model.locked == 'Y') {
              errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account is locked.", 'warn');
              throw new Error( errorMessageResponse.message.messageText);

            } else if( referenceResponse.reference
              && referenceResponse.reference.model
              && referenceResponse.reference.model.locked
              && referenceResponse.reference.model.locked == 'N') {
              if( self.mountainComplex.encryption.encrypt(formData.password) == referenceResponse.reference.model.password) {
                messageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account logged in.", 'success');
                return true;
              } else {
                errorMessageResponse = self.mountainComplex.buildMessageResponse( "Incorrect credentials", 'warn');
                return false;
              }
            } else {
              errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " lock status is unknown", 'error');
              throw new Error( errorMessageResponse.message.messageText);
            }

          } else {
            errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account not found.", 'error');
            throw new Error( errorMessageResponse.message.messageText);
          }

        }).then(function( loggedIn) {
          if( loggedIn) {
            return self.save({
              "recordId": referenceResponse.reference.model.recordId
              , "locked": 'N'
              , "failed_attempts": 0
            });

          } else if( errorMessageResponse.message.messageType == 'warn') {
            var locked = 'N'
              , failed_attempts = referenceResponse.reference.model.failed_attempts +1;

            if( failed_attempts > 5) {
              locked = 'Y';
            }

            var updateUserModel = {
              "recordId": referenceResponse.reference.model.recordId
              , "locked": locked
              , "failed_attempts": failed_attempts
            };
            return self.save(updateUserModel);

          } else {
            return false;
          }

        }).then(function( userSaveResponse) {
          if( errorMessageResponse) {
            resolve( self.mountainComplex.assembleResponses([
                errorMessageResponse
                , self.mountainComplex.buildReferenceResponse()
              ])
            );
          } else {
            resolve( self.mountainComplex.assembleResponses([
                messageResponse
                , referenceResponse
              ])
            );
          }

        }).catch(function( error) {
          resolve( self.mountainComplex.assembleResponses([
              errorMessageResponse
              , self.mountainComplex.buildReferenceResponse()
            ])
          );
        });

      }).catch(function( error) {
        var exceptionMessage = self.mountainComplex.buildErrorMessageResponse( 'Authentication Failed', error)
        resolve( self.mountainComplex.assembleResponses([
            exceptionMessage
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


  changePassword( formData) {
    var self = this
      , promise = new Promise( function(resolve, reject) {

      Promise.resolve(formData).then(function( formData){
        self.set( formData);
        self.validate( formData);


        // Response Management
        var assembledResponse = undefined
           , messageResponse = undefined
           , errorMessageResponse = undefined
           , referenceResponse = undefined
           , userModel = undefined
           , changingPassword = false;

        self.find({
          "filter_field": "email"
          , "filter_type": "="
          , "filter_value": formData.email
        }).then(function( findResponse) {
          if( findResponse && findResponse.data && findResponse.data.rows && Array.isArray(findResponse.data.rows) && findResponse.data.rows.length > 0) {
            userModel = findResponse.data.rows[0];
            referenceResponse = self.mountainComplex.buildReferenceResponse( userModel.recordId, userModel);
            return true;
          } else {
            errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account could not be found.", 'warn');
            throw new Error( errorMessageResponse.message.messageText);
          }

        }).then(function( accountFound) {
          if( accountFound && referenceResponse) {
            if( referenceResponse.reference
              && referenceResponse.reference.model
              && referenceResponse.reference.model.locked
              && referenceResponse.reference.model.locked == 'Y') {
              errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account is locked.", 'warn');
              throw new Error( errorMessageResponse.message.messageText);

            } else if( referenceResponse.reference
              && referenceResponse.reference.model
              && referenceResponse.reference.model.locked
              && referenceResponse.reference.model.locked == 'N') {
              if( self.mountainComplex.encryption.encrypt(formData.password) == referenceResponse.reference.model.password) {
                messageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account logged in.", 'success');
                return true;
              } else {
                errorMessageResponse = self.mountainComplex.buildMessageResponse( "Incorrect credentials", 'warn');
                return false;
              }
            } else {
              console.log(referenceResponse);
              errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " lock status is unknown", 'error');
              throw new Error( errorMessageResponse.message.messageText);
            }

          } else {
            errorMessageResponse = self.mountainComplex.buildMessageResponse( formData.email + " account not found.", 'error');
            throw new Error( errorMessageResponse.message.messageText);
          }

        }).then(function( loggedIn) {
          if( loggedIn) {
            return self.save({
              "recordId": referenceResponse.reference.model.recordId
              , "password": formData.password
              , "new_password": formData.new_password
              , "new_password_confirmation": formData.new_password_confirmation
              , "failed_attempts": 0
            });

          } else if( errorMessageResponse.message.messageType == 'warn') {
            failedToAuthenticate = true;

            var locked = 'N'
              , failed_attempts = referenceResponse.reference.model.failed_attempts +1;

            if( failed_attempts > 5) {
              locked = 'Y';
            }

            var updateUserModel = {
              "recordId": referenceResponse.reference.model.recordId
              , "locked": locked
              , "failed_attempts": failed_attempts
            };
            return self.save(updateUserModel);

          } else {
            return false;
          }

        }).then(function( userSaveResponse) {
          if( userSaveResponse && userSaveResponse.message && userSaveResponse.message.messageType && userSaveResponse.message.messageType == 'success') {
            messageResponse = self.mountainComplex.buildMessageResponse( "Password changed!", 'success');
          }
          if( errorMessageResponse) {
            resolve( self.mountainComplex.assembleResponses([
                errorMessageResponse
                , self.mountainComplex.buildReferenceResponse()
              ])
            );
          } else {
            resolve( self.mountainComplex.assembleResponses([
                messageResponse
                , referenceResponse
              ])
            );
          }

        }).catch(function( error) {
          resolve( self.mountainComplex.assembleResponses([
              errorMessageResponse
              , self.mountainComplex.buildReferenceResponse()
            ])
          );
        });

      }).catch(function( error) {
        var exceptionMessage = self.mountainComplex.buildErrorMessageResponse( 'Change Password Failed', error)
        resolve( self.mountainComplex.assembleResponses([
            exceptionMessage
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


} // End Class

module.exports = User;
