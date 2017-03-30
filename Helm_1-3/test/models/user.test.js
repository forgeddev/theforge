var assert = require('assert')
  , fs = require("fs")
  , path = require('path')
  , projectRoot = path.normalize( path.join(__dirname, '..', '..'))
  , MountainComplex = require(path.join(projectRoot, 'mountain_complex', 'runtime', 'mountain-complex.js'))
  , AskCrud = require(path.join(projectRoot, 'mountain_complex', 'runtime', 'ask-crud.js'))
  , AskCrudModel = require(path.join(projectRoot, 'mountain_complex', 'runtime', 'ask-crud-model.js'));


describe('User Model', function() {

  it('Find', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var user = mountainComplex.getModel('user')
      , form = {
        "email":  mountainComplex.randomData.getFirstName() + "." + mountainComplex.randomData.getLastName() + "@work.com"
        , "password": 'PASS'
        , "password_confirmation": 'PASS'
        , "admin": 'Y'
        , "locked": 'N'
        , "failed_attempts": '0'
      }

    var promiseSave = user.save( form);

    promiseSave.then(function(saveResponse){
      var filterModel = {
        "filter_field": "email"
        , "filter_type": "="
        , "filter_value": form.email
      };

      user.find( filterModel).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        assert.notEqual( findResponse.data.rows.length, 0);
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });


  });


  it('Authenticate - Correct Password', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var user = mountainComplex.getModel('user')
      , form = {
        "email": mountainComplex.randomData.getFirstName() + "." + mountainComplex.randomData.getLastName() + "@work.com"
        , "password": 'PASS'
        , "password_confirmation": 'PASS'
        , "admin": 'Y'
        , "locked": 'N'
        , "failed_attempts": '0'
      }

    var promiseSave = user.save( form);

    promiseSave.then(function(saveResponse){
      var filterModel = {
        "filter_field": "email"
        , "filter_type": "="
        , "filter_value": form.email
      };

      user.find( filterModel).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        assert.notEqual( findResponse.data.rows.length, 0);

        user.authenticate({
          "email": form.email
          , "password": 'PASS'
        }).then( function( authenticateResponse){
          assert.equal( authenticateResponse.message.messageType, 'success');
          done();

        }).catch(function( error){
          done(error);
        });

      }).catch(function( error){
        done(error);
      });

    });

  });


  it('Authenticate - Bad Password', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var user = mountainComplex.getModel('user')
      , form = {
        "email": mountainComplex.randomData.getFirstName() + "." + mountainComplex.randomData.getLastName() + "@work.com"
        , "password": 'PASS'
        , "password_confirmation": 'PASS'
        , "admin": 'Y'
        , "locked": 'N'
        , "failed_attempts": '0'
      }

    var promiseSave = user.save( form);

    promiseSave.then(function(saveResponse){
      var filterModel = {
        "filter_field": "email"
        , "filter_type": "="
        , "filter_value": form.email
      };

      user.find( filterModel).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        assert.notEqual( findResponse.data.rows.length, 0);


        user.authenticate({
          "email": form.email
          , "password": 'BAD'
        }).then( function( authenticateResponse){
          assert.notEqual( authenticateResponse.message.messageType, 'success');
          done();

        }).catch(function( error){
          done(error);
        });

      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });

  });


  it('Authenticate - Account not found', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var user = mountainComplex.getModel('user')
      , form = {
        "email": mountainComplex.randomData.getFirstName() + "." + mountainComplex.randomData.getLastName() + "_notreal@work.com"
        , "password": 'PASS'
        , "password_confirmation": 'PASS'
        , "admin": 'Y'
        , "locked": 'N'
        , "failed_attempts": '0'
      };

    user.authenticate({
      "email": form.email
      , "password": 'PASS'
    }).then( function( authenticateResponse){
      assert.equal( authenticateResponse.message.messageType, 'warn');
      done();
    }).catch(function( error){
      done(error);
    });

  });


  it('Register - New Account', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var user = mountainComplex.getModel('user')
      , form = {
        "email": mountainComplex.randomData.getFirstName() + "." + mountainComplex.randomData.getLastName() + "_new_account@work.com"
        , "password": 'PASS'
        , "password_confirmation": 'PASS'
      };

    user.register(form).then( function( registerResponse){
      assert.equal( registerResponse.message.messageType, 'success');
      done();
    }).catch(function( error){
      done(error);
    });

  });


  it('Register - Existing Account', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var user = mountainComplex.getModel('user')
      , form = {
        "email": mountainComplex.randomData.getFirstName() + "." + mountainComplex.randomData.getLastName() + "_new_account@work.com"
        , "password": 'PASS'
        , "password_confirmation": 'PASS'
      };

    user.register(form).then( function( registerResponse){
      assert.equal( registerResponse.message.messageType, 'success');

      user.register(form).then( function( secondRegisterResponse){
        assert.notEqual( secondRegisterResponse.message.messageType, 'success');
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });

  });


  it('Change Password - Valid User Password', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var user = mountainComplex.getModel('user')
      , form = {
        "email": mountainComplex.randomData.getFirstName() + "." + mountainComplex.randomData.getLastName() + "@work.com"
        , "password": 'PASS'
        , "password_confirmation": 'PASS'
      };

    user.register(form).then( function( registerResponse){
      assert.equal( registerResponse.message.messageType, 'success');

      user.changePassword({
        "email": form.email
        , "password": 'PASS'
        , "new_password": 'NEW_PASS'
        , "new_password_confirmation": 'NEW_PASS'
      }).then(function( changePasswordResponse){
        assert.equal( changePasswordResponse.message.messageType, 'success');

        user.authenticate({
          "email": form.email
          , "password": 'NEW_PASS'
        }).then( function( authenticateResponse){
          assert.equal( authenticateResponse.message.messageType, 'success');
          done();

        }).catch(function( error){
          done(error);
        });

      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });

  });




});
