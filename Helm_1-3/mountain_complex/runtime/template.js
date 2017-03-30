"use strict";

// Libraries
var Promise = require("promise")
  , moment = require('moment');


// Class
class Template {


  constructor() {
    var self = this;
    self.lists = undefined;
  }


  formatDate( theDate) {
    return moment(theDate).format("MM/DD/YYYY");
  }

  formatDateTime( theDate) {
    return moment(theDate).format("MM/DD/YYYY hh:mm:ss A");
  }


  setLists( lists) {
    var self = this;
    self.lists = lists;
  }


  getList( category, group) {
    var self = this
      , filteredList = [];

    filteredList = self.lists.filter(function( object){
      var found = false;

      if( object
        && object.category
        && object.group
        && object.category.toUpperCase() == category.toUpperCase()
        && object.group.toUpperCase() == group.toUpperCase()) {
        found = true;
      }

      return found;
    });

    return filteredList;
  }


  decodeListId( recordId) {
    var self = this
      , name = "Unknown"
      , filteredList = []
      , foundObject = undefined;

    filteredList = self.lists.filter(function( object){
      var found = false;

      if( object && object.recordId && object.recordId == recordId) {
        found = true;
      }

      return found;
    });

    if( filteredList[0]) {
      foundObject = filteredList[0];
      if( foundObject.name) {
        name = foundObject.name;
      }
    }

    return name;
  }


}

module.exports = Template;
