var assert = require('assert')
  , fs = require("fs")
  , path = require('path')
  , projectRoot = path.normalize( path.join(__dirname, '..', '..'))
  , MountainComplex = require(path.join(projectRoot, 'mountain_complex', 'runtime', 'mountain-complex.js'))
  , AskCrud = require(path.join(projectRoot, 'mountain_complex', 'runtime', 'ask-crud.js'))
  , AskCrudModel = require(path.join(projectRoot, 'mountain_complex', 'runtime', 'ask-crud-model.js'));


describe('Item Model', function() {

  it('Load Model', function( done) {

    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));
    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": "Test lastName"
        , "purchased": new Date()
        , "outOfStock": "N"
        , "quantity": 6
        , "cost": 15.99
      };

    item.set( form);

    assert.notEqual( item, undefined);
    assert.notEqual( item, null);

    assert.equal( item.model.name, form.name);
    assert.equal( item.model.purchased, form.purchased);
    assert.equal( item.model.outOfStock, form.outOfStock);
    assert.equal( item.model.quantity, form.quantity);
    assert.equal( item.model.cost, form.cost);

    done();
  });


  it('Validate Model, Good Values', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": "Item Name"
        , "purchased": new Date()
        , "outOfStock": "N"
        , "quantity": 6
        , "cost": 15.99
      };
    item.set( form);

    assert.doesNotThrow( function() { item.validate(); }, Error);

    done();
  });



  it('Validate Model, Name Required, undefined Check', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": undefined
        , "purchased": new Date()
        , "outOfStock": "N"
        , "quantity": 6
        , "cost": 15.99
      };
    item.set( form);

    assert.throws( function() { item.validate(); }, Error);

    done();
  });


  it('Validate Model, Name Required, null Check', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": null
        , "purchased": new Date()
        , "outOfStock": "N"
        , "quantity": 6
        , "cost": 15.99
      };
    item.set( form);

    assert.throws( function() { item.validate(); }, Error);

    done();
  });


  it('Validate Model, Name Required, blank Check', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": ""
        , "purchased": new Date()
        , "outOfStock": "N"
        , "quantity": 6
        , "cost": 15.99
      };
    item.set( form);

    assert.throws( function() { item.validate(); }, Error);

    done();
  });


  it('Save Model', function() {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": mountainComplex.randomData.getThingName()
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      };
    item.set( form);

    return item.save( form).then(function(saveResponse){
      assert.equal( saveResponse.message.messageType, 'success');
    });

  });


  it('Delete Model', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": mountainComplex.randomData.getThingName()
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      }

    var promiseSave =  item.save( form);

    promiseSave.then(function(saveResponse){
      var model = {
        "recordId": saveResponse.reference.id
      };

      item.delete( model).then( function(deleteResponse){
        assert.equal( deleteResponse.message.messageType, 'success');
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });


  });


  it('Update Model', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": mountainComplex.randomData.getThingName()
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      }

    var promiseSave =  item.save( form);

    promiseSave.then(function(saveResponse){
      var model = {
        "recordId": saveResponse.id
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      };

      item.save( model).then( function(updateResponse){
        assert.equal( updateResponse.message.messageType, 'success');
        assert.equal( updateResponse.message.details.affectedRows, 1);
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });


  });


  it('Find By Id', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": mountainComplex.randomData.getThingName()
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      }

    var promiseSave =  item.save( form);

    promiseSave.then(function(saveResponse){
      var model = {
        "recordId": saveResponse.reference.id
      };

      item.findById( model).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        //assert.equal( findResponse.data.length, 1);
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });


  });


  it('Find - Contains, Starts With', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": "Helicopter"
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      }

    var promiseSave = item.save( form);

    promiseSave.then(function(saveResponse){
      var searchModel = {
        "name": {
          "operator": "contains"
          , "value": "Heli"
        }
      };

      item.find( searchModel).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        assert.notEqual( findResponse.data.length, 0);
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });

  });


  it('Find - Starts With', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": "Truck"
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      }

    var promiseSave = item.save( form);

    promiseSave.then(function(saveResponse){
      var searchModel = {
        "name": {
          "operator": "startsWith"
          , "value": "Tr"
        }
      };

      item.find( searchModel).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        assert.notEqual( findResponse.data.length, 0);
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });


  });


  it('Find - Ends With', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": "Semi Truck"
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      }

    var promiseSave = item.save( form);

    promiseSave.then(function(saveResponse){
      var searchModel = {
        "name": {
          "operator": "endsWith"
          , "value": "Truck"
        }
      };

      item.find( searchModel).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        assert.notEqual( findResponse.data.length, 0);
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });


  });


  it('Find - IN', function( done) {
    var mountainComplex = new MountainComplex( path.join(projectRoot, 'mountain-complex.json'));

    mountainComplex.loadModels( path.join(projectRoot, 'mountain_complex', 'backend', 'models'));

    var item = mountainComplex.getModel('item')
      , form = {
        "name": "Chair"
        , "purchased": new Date()
        , "outOfStock": mountainComplex.randomData.getYesNoFlag()
        , "quantity": mountainComplex.randomData.getInteger(1, 99)
        , "cost": mountainComplex.randomData.getCost(1, 999)
      }

    var promiseSave = item.save( form);

    promiseSave.then(function(saveResponse){
      var searchModel = {
        "outOfStock": {
          "operator": "IN"
          , "values": [
            'U', 'Y'
          ]
        }
      };

      item.find( searchModel).then( function(findResponse){
        assert.equal( findResponse.message.messageType, 'success');
        assert.notEqual( findResponse.data.length, 0);
        done();
      }).catch(function( error){
        done(error);
      });

    }).catch(function( error){
      done(error);
    });

  });


});
