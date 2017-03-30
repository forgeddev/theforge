var MountainComplexModelView = class {

  constructor( config) {
    var self = this;
    self.config = config;

    if( self.config.model) {
      self.selectorPrefix = "#" + self.config.model;
      self.addListeners();
    }
  }


  load( model, lists) {
    var self = this;

    if( model) {
      var fields = Object.keys( model)
        , fields_count = fields.length
        , fields_processed = 0;

      fields.forEach( function(field) {
        fields_processed++;
        if( model[field]) {
          var domObject = $(self.selectorPrefix + "View" + " " + "#"+field);

          if( domObject[0] && domObject[0].tagName.startsWith("INPUT")) {
            domObject.val( model[field]);
          } else {
            if( domObject.data("type") == "date") {
              domObject.html( moment(model[field]).format('MM/DD/YYYY'));
            } else if( domObject.data("type") == "datetime") {
              domObject.html( moment(model[field]).format('MM/DD/YYYY hh:mm A'));
            } else if( domObject.data("list") == true) {
              domObject.html( MountainComplexBase.decodeListId(model[field], lists));
            } else {
              domObject.html( model[field]);
            }
          }
        }

        if( fields_processed == fields_count) {
          Materialize.updateTextFields();
        }
      });
    }
  }


  addListeners() {
    var self = this;

    $(self.selectorPrefix + "MetaDataToggle").click(function(){
      $(self.selectorPrefix + "View" + " > " + "fieldset.meta-data").toggle('slow');
    });
  }


}
