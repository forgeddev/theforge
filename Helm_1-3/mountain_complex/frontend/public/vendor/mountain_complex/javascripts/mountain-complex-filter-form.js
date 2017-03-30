var MountainComplexFilterForm = class {

  constructor( config) {
    var self = this;
    self.config = config;

    if( self.config.model) {
      self.selectorPrefix = "#" + self.config.model;
      self.addListeners();
    }
  }

  addFilterRow() {
    var self = this;

    if( self.config.filterRow) {
      $(self.config.filterRow).appendTo(self.selectorPrefix + "FilterForm");
    }
  }

  addListeners() {
    var self = this;

    $(self.selectorPrefix + "FilterClose").click( function(event){
      event.preventDefault();
      $(self.selectorPrefix + "FilterCard").toggle('slow');
    });

    $(self.selectorPrefix + "FilterFormToggle").click(function(){
      $(self.selectorPrefix + "FilterCard").toggle('slow');
    });

    $(self.selectorPrefix + "FilterClear").click( function(event){
      event.preventDefault();
      $(self.selectorPrefix + "FilterForm").empty();
    });

    // add remove handler, dynamically added so document listener is needed
    $(document).on('click', self.selectorPrefix + "FilterRemove", function( event) {
      event.preventDefault();
      $(this).closest("div.row").remove();
    });

    $(self.selectorPrefix + "FilterAdd").click( function(event){
      event.preventDefault();

      self.addFilterRow();

      $(self.selectorPrefix + "FilterForm" + ' ' + 'select').material_select();
    });

    $(self.selectorPrefix + "FilterSave").click( function(event){
      event.preventDefault();

      var actionUrl = "/" + self.config.model + "/listing_filter"
        , data = $(self.selectorPrefix + "FilterForm").serialize();

      $.ajax({
        url: actionUrl
        , type: 'post'
        , dataType: 'json'
        , data: data
        , encode: true
      }).done( function(response){
        if( response.message && response.message.messageText && response.message.messageType){
          Materialize.toast( response.message.messageText, 1000, 'toast-'+response.message.messageType, function() {
            location.reload();
          });
        }
      }).fail( function(response){
        if( response.message && response.message.message && response.message.messageType){
          Materialize.toast( response.message.messageText, 1000, 'toast-'+response.message.messageType);
        } else {
          Materialize.toast( "Server Failure", 4000, 'toast-fail');
        }
      });
    });

  } // end addListeners


  update( data) {
    var self = this;

    if( data && data.filter) {
      var filter = data.filter
        , numberOfFilterFields = 0;

      if( filter.filter_field && filter.filter_field.length > 0) {
        numberOfFilterFields = filter.filter_field.length
      }

      // add filter rows
      for( var i = 0; i < numberOfFilterFields; i++) {
        self.addFilterRow();
      }

      // populate filter rows
      for( var i = 0; i < numberOfFilterFields; i++) {
        var divRow = $(self.selectorPrefix + "FilterForm").children().eq(i);
        divRow.find("select[name=filter_field]").val( filter.filter_field[i]);
        divRow.find("select[name=filter_type]").val( filter.filter_type[i]);
        divRow.find("input[name=filter_value]").val( filter.filter_value[i]);
      }

      // apply drop down changes
      if( numberOfFilterFields > 0) {
        $(self.selectorPrefix + "FilterForm" + ' ' + 'select').material_select();
      }
    }
  } // end update


}
