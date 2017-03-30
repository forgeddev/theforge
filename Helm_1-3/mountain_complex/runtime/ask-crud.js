"use strict";

// Libraries
var Promise = require("promise")
  , mysql = require('mysql');


// Class
class AskCrud {

  constructor( mountainComplex) {
    var self = this;

    self.mountainComplex = mountainComplex;
  }


  /*****************************************************************************
  Model Validation Helper Functions
  *****************************************************************************/

  required( name, value) {
    if( value == undefined || value == null || (value && value.length == 0)) {
      throw new Error(name + " is required");
    }
  }


  regularExpression( name, value, regex, example) {
    if( !regex.test(value)) {
      throw new Error(name + " is not valid. Example: " + example);
    }
  }




  /*****************************************************************************
  Persitance
  *****************************************************************************/

  add( table, model) {
    var self = this
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( !table || table.length == 0) {
          throw new Error("Missing Table Name");
        }

        self.mountainComplex.pool.getConnection( function( err,connection){
          if( err) {
            console.log( err);
            throw err;
          }

          if( self.mountainComplex.config.database.log) {
            console.log('connected as id ' + connection.threadId);
          }

          var query = connection.query('INSERT INTO ?? SET ?', [table, model], function( err, result){
            connection.release();
            if( !err) {
              var addMessageResponse = self.mountainComplex.buildMessageResponse( 'Saved', 'success', result);

              if( result.insertId > 0) {
                self.findById(table, { "recordId": result.insertId }).then(function( findResponse){
                  if( findResponse
                    && findResponse.message
                    && findResponse.message.messageType
                    && findResponse.message.messageType == 'success'
                    && findResponse.data
                    && findResponse.data.rows
                    && Array.isArray(findResponse.data.rows)
                    && findResponse.data.rows.length > 0 ) {

                    var addReferenceResponse = self.mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0]);

                    resolve(
                      self.mountainComplex.assembleResponses([
                        addMessageResponse
                        , addReferenceResponse
                      ])
                    );
                  } else {
                    resolve(
                      self.mountainComplex.assembleResponses([
                        self.mountainComplex.buildMessageResponse( 'Failed to Save', 'error', "Model not loaded after save")
                        , self.mountainComplex.buildReferenceResponse()
                      ])
                    );
                  }
                });
              } else {
                resolve(
                  self.mountainComplex.assembleResponses([
                    self.mountainComplex.buildMessageResponse( 'Failed to Save', 'error', "Model id not valid after save")
                    , self.mountainComplex.buildReferenceResponse()
                  ])
                );
              }

            } else {
              console.log( err);
              throw err;
            }
          });

          if( self.mountainComplex.config.database.log) {
            console.log( query.sql);
          }

          connection.on('error', function(err) {
            console.log( err);
            throw err;
          });
        });
      }).catch(function( error) {
        var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Failed to Save', error)
        resolve( self.mountainComplex.assembleResponses([
            errorMessageResponse
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


  update( table, model) {
    var self = this
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( !table || table.length == 0) {
          throw new Error("Missing Table Name");
        }

        if( model.recordId > 0) {
          // valid
        } else {
          throw new Error("Invalid recordId");
        }

        self.mountainComplex.pool.getConnection( function( err,connection){
          if( err) {
            throw err;
          }

          if( self.mountainComplex.config.database.log) {
            console.log('connected as id ' + connection.threadId);
          }

          // remove createdOn, updatedOn fields
          if( model.createdOn) {
            delete model['createdOn'];
          }
          if( model.updatedOn) {
            delete model['updatedOn'];
          }


          var query = connection.query('UPDATE ?? SET ? WHERE recordId = ?', [table, model, model.recordId], function( err, result){
            connection.release();
            if( !err) {
              var updateMessageResponse = self.mountainComplex.buildMessageResponse( 'Updated', 'success', result);

              self.findById(table, { "recordId": model.recordId }).then(function( findResponse){
                if( findResponse
                  && findResponse.message
                  && findResponse.message.messageType
                  && findResponse.message.messageType == 'success'
                  && findResponse.data
                  && findResponse.data.rows
                  && Array.isArray(findResponse.data.rows)
                  && findResponse.data.rows.length > 0 ) {

                  var updateReferenceResponse = self.mountainComplex.buildReferenceResponse( findResponse.data.rows[0].recordId, findResponse.data.rows[0]);

                  resolve(
                    self.mountainComplex.assembleResponses([
                      updateMessageResponse
                      , updateReferenceResponse
                    ])
                  );
                } else {
                  resolve(
                    self.mountainComplex.assembleResponses([
                      self.mountainComplex.buildMessageResponse( 'Failed to Save', 'error', "Model not loaded after save")
                      , self.mountainComplex.buildReferenceResponse()
                    ])
                  );
                }
              });

            } else {
              console.log( err);
              throw err;
            }
          });
          if( self.mountainComplex.config.database.log) {
            console.log( query.sql);
          }

          connection.on('error', function(err) {
            throw err;
          });
        });
      }).catch(function( error) {
        var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Failed to Update', error)
        resolve( self.mountainComplex.assembleResponses([
            errorMessageResponse
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


  delete( table, model) {
    var self = this
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( !table || table.length == 0) {
          throw new Error("Missing Table Name");
        }

        if( model.recordId > 0) {
          // valid
        } else {
          throw new Error("Invalid recordId");
        }

        self.mountainComplex.pool.getConnection( function( err,connection){
          if( err) {
            throw err;
          }

          if( self.mountainComplex.config.database.log) {
            console.log('connected as id ' + connection.threadId);
          }

          var query = connection.query('UPDATE ?? SET isDeleted = ? WHERE recordId = ?', [table, 'Y', model.recordId], function( err, result){
            connection.release();
            if( !err) {
              resolve(
                self.mountainComplex.assembleResponses([
                  self.mountainComplex.buildMessageResponse( 'Record Removed', 'success', result)
                  , self.mountainComplex.buildReferenceResponse(model.recordId, model)
                ])
              );
            }
          });
          if( self.mountainComplex.config.database.log) {
            console.log( query.sql);
          }

          connection.on('error', function(err) {
            throw err;
          });
        });
      }).catch(function( error) {
        var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Delete Failed', error)
        resolve( self.mountainComplex.assembleResponses([
            errorMessageResponse
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

  return promise;
}


  restore( table, model) {
    var self = this
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( !table || table.length == 0) {
          throw new Error("Missing Table Name");
        }

        if( model.recordId > 0) {
          // valid
        } else {
          throw new Error("Invalid recordId");
        }

        self.mountainComplex.pool.getConnection( function( err,connection){
          if( err) {
            throw err;
          }

          if( self.mountainComplex.config.database.log) {
            console.log('connected as id ' + connection.threadId);
          }

          var query = connection.query('UPDATE ?? SET isDeleted = ? WHERE recordId = ?', [table, 'N', model.recordId], function( err, result){
            connection.release();
            if( !err) {
              resolve(
                self.mountainComplex.assembleResponses([
                  self.mountainComplex.buildMessageResponse( 'Record Restored', 'success', result)
                  , self.mountainComplex.buildReferenceResponse(model.recordId, model)
                ])
              );
            }
          });
          if( self.mountainComplex.config.database.log) {
            console.log( query.sql);
          }

          connection.on('error', function(err) {
            throw err;
          });
        });
      }).catch(function( error) {
        var errorMessageResponse = self.mountainComplex.buildErrorMessageResponse( 'Restore Failed', error)
        resolve( self.mountainComplex.assembleResponses([
            errorMessageResponse
            , self.mountainComplex.buildReferenceResponse()
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

  return promise;
}


  findById( table, model) {
    var self = this
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( !table || table.length == 0) {
          throw new Error("Missing Table Name");
        }

        if( model.recordId > 0) {
          // valid
        } else {
          throw new Error("Invalid recordId");
        }

        self.mountainComplex.pool.getConnection( function( err,connection){
          if( err) {
            throw err;
          }

          if( self.mountainComplex.config.database.log) {
            console.log('connected as id ' + connection.threadId);
          }

          var query = connection.query('SELECT * FROM ?? WHERE recordId = ?', [table, model.recordId], function( err, rows, fields){
            connection.release();
            if(!rows) {
              rows = [];
            }

            if( !err) {
              resolve(
                self.mountainComplex.assembleResponses([
                  self.mountainComplex.buildMessageResponse( 'Records Found: '+rows.length, 'success')
                  , self.mountainComplex.buildDataResponse(rows)
                ])
              );
            }
          });
          if( self.mountainComplex.config.database.log) {
            console.log( query.sql);
          }

          connection.on('error', function(err) {
            throw err;
          });
        });
      }).catch(function( error) {
        resolve( self.mountainComplex.assembleResponses([
          self.mountainComplex.buildErrorMessageResponse( 'Find Failed', error)
          , self.mountainComplex.buildDataResponse([], filterModel, sortModel)
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


  findByParentId( table, model) {
    var self = this
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( !table || table.length == 0) {
          throw new Error("Missing Table Name");
        }

        if( model.parentId > 0) {
          // valid
        } else {
          throw new Error("Invalid parentId");
        }

        self.mountainComplex.pool.getConnection( function( err,connection){
          if( err) {
            throw err;
          }

          if( self.mountainComplex.config.database.log) {
            console.log('connected as id ' + connection.threadId);
          }

          var query = connection.query('SELECT * FROM ?? WHERE parentId = ?', [table, model.parentId], function( err, rows, fields){
            connection.release();
            if(!rows) {
              rows = [];
            }

            if( !err) {
              resolve(
                self.mountainComplex.assembleResponses([
                  self.mountainComplex.buildMessageResponse( 'Records Found: '+rows.length, 'success')
                  , self.mountainComplex.buildDataResponse(rows)
                ])
              );
            }
          });
          if( self.mountainComplex.config.database.log) {
            console.log( query.sql);
          }

          connection.on('error', function(err) {
            throw err;
          });
        });
      }).catch(function( error) {
        resolve( self.mountainComplex.assembleResponses([
          self.mountainComplex.buildErrorMessageResponse( 'Find Failed', error)
          , self.mountainComplex.buildDataResponse([], filterModel, sortModel)
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }



  convertFilterFormToFilterModel( filterModel) {
    var newFilterModel = filterModel
      , filter_field = undefined
      , filter_type = undefined
      , filter_value = undefined;

    if( filterModel && filterModel.filter_field && filterModel.filter_type && filterModel.filter_value) {
      newFilterModel={};

      if( Array.isArray(filterModel.filter_field)) {
        filter_field = filterModel.filter_field;
        filter_type = filterModel.filter_type;
        filter_value = filterModel.filter_value;
      } else {
        filter_field = [filterModel.filter_field];
        filter_type = [filterModel.filter_type];
        filter_value = [filterModel.filter_value];
      }

      newFilterModel['filter_field'] = filter_field;
      newFilterModel['filter_type'] = filter_type;
      newFilterModel['filter_value'] = filter_value;
    } else if( filterModel){
      newFilterModel={};

      var fields = Object.keys( filterModel)
        , fields_count = fields.length;

      if( fields && fields[0] && filterModel[fields[0]] && filterModel[fields[0]]['operator']) {
        newFilterModel = filterModel;

      } else {
        filter_field = []
        filter_type = []
        filter_value = [];

        fields.forEach( function(field) {
          if( filterModel[field]) {
            filter_field.push(field);
            filter_type.push('like');
            filter_value.push(filterModel[field]);
          }
        });

        newFilterModel['filter_field'] = filter_field;
        newFilterModel['filter_type'] = filter_type;
        newFilterModel['filter_value'] = filter_value;

      }
    }

    return newFilterModel;
  }


  objectifyFilterModel( filterModel) {
    var newFilterModel = filterModel
      , fields = undefined
      , operators = undefined
      , values = undefined;

    if( filterModel && filterModel.filter_field && filterModel.filter_type && filterModel.filter_value) {
      newFilterModel={};

      if( Array.isArray(filterModel.filter_field)) {
        fields = filterModel.filter_field;
        operators = filterModel.filter_type;
        values = filterModel.filter_value;
      } else {
        fields = [filterModel.filter_field];
        operators = [filterModel.filter_type];
        values = [filterModel.filter_value];
      }

      for( var i = 0; i < fields.length; i++) {
        var name = fields[i]
          , operator = operators[i]
          , value = values[i];

        if( operator == "in") {
          value = value.split(",");
        }
        newFilterModel[name] = {
          "operator": operator
          , "value": value
        };
      }
    }

    return newFilterModel;
  }


  makeWhereClause( filterModel) {
    var self = this;

    if( !filterModel) {
      return("1 = 1 AND isDeleted = 'N'");
    }

    console.log("=== Before ===");
    console.log(filterModel);
    filterModel = self.objectifyFilterModel( filterModel);
    console.log("=== Before ===");
    console.log(filterModel);

    var whereClause = "1 = 1"
      , searchFields = Object.keys( filterModel)
      , searchField = undefined
      , searchValue = undefined
      , betweenStartValue = undefined
      , betweenEndValue = undefined
      , values = undefined
      , operator = ""
      , operatorClause = ""
      , operatorClauses = []
      , isDeletedCriteriaFound = false;

    searchFields.forEach( function(field) {
      searchField = filterModel[field];

      if( field.toLowerCase() == 'isdeleted') {
        isDeletedCriteriaFound = true;
      }

      if( searchField['operator']) {
        var operator = searchField['operator'].toLowerCase().trim();
        console.log( searchField);

        switch( operator) {
          case "=":
          case "==":
          case "===":
          case "equal":
          case "equals":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " = " + mysql.escape(searchValue);
            operatorClauses.push( operatorClause);
          break;

          case ">":
          case "greater":
          case "greaterthan":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " > " + mysql.escape(searchValue);
            operatorClauses.push( operatorClause);
          break;

          case ">=":
          case "greaterorequal":
          case "greaterorequals":
          case "greaterthanorequal":
          case "greaterthanorequals":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " >= " + mysql.escape(searchValue);
            operatorClauses.push( operatorClause);
          break;

          case "<":
          case "less":
          case "lessthan":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " < '" + mysql.escape(searchValue) +"'";
            operatorClauses.push( operatorClause);
          break;

          case "<=":
          case "lessorequal":
          case "lessorequals":
          case "lessthanorequal":
          case "lessthanorequals":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " <= " + mysql.escape(searchValue) +"'";
            operatorClauses.push( operatorClause);
          break;

          case "~=":
          case "contain":
          case "contains":
          case "like":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " LIKE " + mysql.escape("%" + searchValue +"%");
            operatorClauses.push( operatorClause);
          break;

          case "start":
          case "starts":
          case "startswith":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " LIKE " + mysql.escape(searchValue + '%');
            operatorClauses.push( operatorClause);
          break;

          case "end":
          case "ends":
          case "endswith":
            if( !searchField['value']) {
              throw new Error("Missing search value");
            }
            searchValue = searchField['value'];
            operatorClause = "`" + field + "`" + " LIKE " + mysql.escape('%' + searchValue);
            operatorClauses.push( operatorClause);
          break;

          case "<>":
          case "between":
            if( !searchField['betweenStartValue']) {
              throw new Error("Missing start value");
            }
            if( !searchField['betweenEndValue']) {
              throw new Error("Missing end value");
            }
            betweenStartValue = searchField['betweenStartValue'];
            betweenEndValue = searchField['betweenEndValue'];
            operatorClause = "`" + field + "`" + " BETWEEN " + mysql.escape(betweenStartValue) +" AND " + mysql.escape(betweenEndValue);
            operatorClauses.push( operatorClause);
          break;

          case "[]":
          case "in":
            if( !searchField['values'] || searchField['values'].length == 0) {
              throw new Error("Missing or empty values array");
            }
            values = searchField['values'];
            operatorClause = "`" + field + "`" + " IN ('" + values.join("', '") +"')";
            operatorClauses.push( operatorClause);
          break;

          default:
            throw new Error("Bad operator: " + operator);
        } // end switch
      } // end operator check
    }); // end forEach

    if( !isDeletedCriteriaFound) {
      operatorClause = "`isDeleted` = 'N'";
      operatorClauses.push( operatorClause);
    }

    whereClause = operatorClauses.join(" AND ");

    return whereClause;
  }


  convertSortFormToSortModel( sortModel) {
    var newSortModel = sortModel;

    if( sortModel) {
      if( sortModel.sort_field && sortModel.sort_direction && Array.isArray(sortModel.sort_field)) {
        newSortModel = sortModel;
      } else if( sortModel.sort_field && sortModel.sort_direction) {
        newSortModel.sort_field = [sortModel.sort_field];
        newSortModel.sort_direction = [sortModel.sort_direction];
      } else {
        newSortModel.sort_field = [];
        newSortModel.sort_direction = [];
      }
    }

    return newSortModel;
  }


  makeOrderClause( sortModel) {
    var self = this
      , orderClause = " ORDER BY updatedOn, createdOn";

      if( sortModel && sortModel.sort_field && sortModel.sort_direction) {
        var fields = sortModel.sort_field
          , directions = sortModel.sort_direction;

        if( fields.length != directions.length) {
          throw new Error("Malformed sort object");
        }

        if( Array.isArray( fields) && fields.length > 0) {
          orderClause = "";
          for( var i = 0; i < fields.length; i++) {
            if( i > 0) {
              orderClause = orderClause + ", ";
            } else {
              orderClause = " ORDER BY ";
            }
            orderClause = orderClause + "`" + fields[i] + "`" + " " + directions[i];
          }
        }
      }

    return orderClause;
  }


  makeLimitClause( limitModel) {
    var self = this
      , limitClause = " LIMIT 0, 10";

    if( limitModel && limitModel.pageSize && limitModel.onPage) {
      var startAfterRow = (limitModel.onPage * limitModel.pageSize) - limitModel.pageSize;
      if( startAfterRow > 0) {
        startAfterRow = startAfterRow -1;
      }
      limitClause = " LIMIT " + startAfterRow + ", " + limitModel.pageSize;
    }

    return limitClause;
  }


  find( table, filterModel, sortModel, limitModel) {
    var self = this;

    filterModel = self.convertFilterFormToFilterModel( filterModel);
    sortModel = self.convertSortFormToSortModel( sortModel);

    filterModel = (filterModel) ? filterModel : {};
    sortModel = (sortModel) ? sortModel : {};
    limitModel = (limitModel) ? limitModel : {};

    if( self.mountainComplex.config.framework.log) {
      console.log("=== AskCrud: Find ===");
      console.log("Filter Model");
      console.log(filterModel);
      console.log("Sort Model");
      console.log(sortModel);
      console.log("Limit Model");
      console.log(limitModel);
    }

    var whereClause = ""
      , orderClause = ""
      , limitClause = ""
      , promise = new Promise( function( resolve, reject) {

      Promise.resolve().then(function(){
        if( !table || table.length == 0) {
          throw new Error("Missing Table Name");
        }

        whereClause = self.makeWhereClause( filterModel);
        orderClause = self.makeOrderClause( sortModel);
        limitClause = self.makeLimitClause( limitModel);

        var countQuery = self.mountainComplex.query( 'SELECT COUNT(*) AS CNT FROM ?? WHERE ' + whereClause, [table]);
        var selectQuery = self.mountainComplex.query( 'SELECT * FROM ?? WHERE ' + whereClause + orderClause + limitClause, [table]);
        Promise.all([countQuery, selectQuery, filterModel, sortModel, limitModel]).then( function(responses){
          var countQueryResponse = responses[0]
            , selectQueryResponse = responses[1]
            , filterModel = responses[2]
            , sortModel = responses[3]
            , limitModel = responses[4]
            , countRows = 0
            , pageSize = 10
            , onPage = (limitModel.onPage) ? limitModel.onPage : 1
            , pages = 0
            , data = [];

          if( limitModel && limitModel.pageSize) {
            pageSize = limitModel.pageSize;
          }

          if( countQueryResponse.result && countQueryResponse.result[0]['CNT']) {
            countRows = countQueryResponse.result[0]['CNT'];
          }

          if( pageSize < countRows) {
            pages = Math.round(countRows / pageSize);
          }

          if( countRows > 0) {
            data = selectQueryResponse.result;
          }

          resolve(
            self.mountainComplex.assembleResponses([
              self.mountainComplex.buildMessageResponse( 'Records Found: ' + countRows, 'success')
              , self.mountainComplex.buildDataResponse(
                data
                , filterModel
                , sortModel
                , self.mountainComplex.buildPagination(countRows, pageSize, onPage, pages)
              )
            ])
          );
        }).catch(function( error) {
          resolve( self.mountainComplex.assembleResponses([
            self.mountainComplex.buildErrorMessageResponse( 'Find Failed', error)
            , self.mountainComplex.buildDataResponse([], filterModel, sortModel)
            ])
          );
        });

      }).catch(function( error) {
        resolve( self.mountainComplex.assembleResponses([
          self.mountainComplex.buildErrorMessageResponse( 'Find Failed', error)
          , self.mountainComplex.buildDataResponse([], filterModel, sortModel)
          ])
        );
      }); // End Promise.resolve

    }); // End Promise Definition

    return promise;
  }


}

module.exports = AskCrud;
