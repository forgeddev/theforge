var MountainComplexSortForm = class {

  constructor( config) {
    var self = this;
    self.config = config;

    if( self.config.model) {
      self.selectorPrefix = "#" + self.config.model;
      self.addListeners();
    }
  }

  addSortRow() {
    var self = this;

    if( self.config.sortRow) {
      $(self.config.sortRow).appendTo(self.selectorPrefix + "SortForm");
    }
  }

  addListeners() {
    var self = this;

    $(self.selectorPrefix + "SortClose").click( function(event){
      event.preventDefault();
      $(self.selectorPrefix + "SortCard").toggle('slow');
    });

    $(self.selectorPrefix + "SortFormToggle").click(function(){
      $(self.selectorPrefix + "SortCard").toggle('slow');
    });

    $(self.selectorPrefix + "SortClear").click( function(event){
      event.preventDefault();
      $(self.selectorPrefix + "SortForm").empty();
    });

    // add remove handler, dynamically added so document listener is needed
    $(document).on('click', self.selectorPrefix + "SortRemove", function( event) {
      event.preventDefault();
      $(this).closest("div.row").remove();
    });

    $(self.selectorPrefix + "SortAdd").click( function(event){
      event.preventDefault();

      self.addSortRow();

      $(self.selectorPrefix + "SortForm" + ' ' + 'select').material_select();
    });

    $(self.selectorPrefix + "SortSave").click( function(event){
      event.preventDefault();

      var actionUrl = "/" + self.config.model + "/listing_sort"
        , data = $(self.selectorPrefix + "SortForm").serialize();

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
        if( response.message && response.message.messageText && response.message.messageType){
          Materialize.toast( response.message.messageText, 1000, 'toast-'+response.message.messageType);
        } else {
          Materialize.toast( "Server Failure", 4000, 'toast-fail');
        }
      });
    });

  } // end addListeners


  update( data) {
    var self = this;

    if( data && data.sort) {
      var sort = data.sort
        , numberOfSortFields = 0;

      if( sort.sort_field && sort.sort_field.length > 0) {
        numberOfSortFields = sort.sort_field.length
      }

      // add sort rows
      for( var i = 0; i < numberOfSortFields; i++) {
        self.addSortRow();
      }

      // populate sort rows
      for( var i = 0; i < numberOfSortFields; i++) {
        var divRow = $(self.selectorPrefix + "SortForm").children().eq(i);
        divRow.find("select[name=sort_field]").val( sort.sort_field[i]);
        divRow.find("select[name=sort_direction]").val( sort.sort_direction[i]);
      }

      // apply drop down changes
      if( numberOfSortFields > 0) {
        $(self.selectorPrefix + "SortForm" + ' ' + 'select').material_select();
      }
    }
  } // end update


}
