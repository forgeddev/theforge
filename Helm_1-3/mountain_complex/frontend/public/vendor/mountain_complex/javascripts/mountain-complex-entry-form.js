var MountainComplexEntryForm = class {

  constructor( config) {
    var self = this;
    self.config = config;

    if( self.config.model) {
      self.selectorPrefix = "#" + self.config.model;
      self.addListeners();
    }
  }


  load( model) {
    var self = this;

    if( model) {
      var fields = Object.keys( model)
        , fields_count = fields.length
        , fields_processed = 0
        , $field = undefined
        , $label = undefined
        , original_value = undefined
        , modified_value = undefined
        , $fieldTime = undefined
        , $labelTime = undefined
        , time_value = undefined;

      fields.forEach( function(field) {
        fields_processed++;
        if( model[field]) {
          $field = $(self.selectorPrefix + "Form" + " " + "#"+field);
          $label = $(self.selectorPrefix + "Form" + " " + "label[for='"+field+"']");

          if( $field.attr('type') == 'date') {
            original_value = new Date(model[field]);

            if( typeof original_value.getMonth === 'function') {
              modified_value = original_value.getFullYear() + "-" + ('0'+(original_value.getMonth()+1)).slice(-2) + "-" + ('0'+original_value.getDate()).slice(-2);
              $field.val( modified_value);
              $label.addClass("active");

              $fieldTime = $(self.selectorPrefix + "Form" + " " + "#"+field+"Time");
              $labelTime = $(self.selectorPrefix + "Form" + " " + "label[for='"+field+"Time"+"']");
              if( $fieldTime) {
                time_value = ('0'+original_value.getHours()).slice(-2) + ":" + ('0'+original_value.getMinutes()).slice(-2);
                $fieldTime.val( time_value);
                $labelTime.addClass("active");
              }
            }

          } else if( $field.is("textarea")) {
            $field.val( model[field]);
            $field.trigger('autoresize');
          } else {
            $field.val( model[field]);
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
      $(self.selectorPrefix + "Form" + " > " + "fieldset.meta-data").toggle('slow');
    });


    $(self.selectorPrefix + "Form").on({
      submit: function( event){
        event.preventDefault();

        var actionUrl = event.currentTarget.action
          , formData = $(self.selectorPrefix + "Form").serialize();

        $.ajax({
          url: actionUrl
          , type: 'post'
          , dataType: 'json'
          , data: formData
          , encode: true
        }).done( function(response){
          if( response.message && response.message.messageType){
            if( response.message.messageType == 'error') {
              $('#error_modal > div.modal-content > h4').html(response.message.messageText);
              $('#error_modal > div.modal-content > p').html(response.message.details);
              $('#error_modal').modal('open');
            } else {
              if( self.config.redirect_after_submit && self.config.redirect_after_submit == true && self.config.redirect_url) {
                Materialize.toast( response.message.messageText, 4000, 'toast-'+response.message.messageType, function() {
                  location = "/response/thankyou";
                });
              } else {
                Materialize.toast( response.message.messageText, 4000, 'toast-'+response.message.messageType);
              }

            }
            self.load( response.model);
          }
        }).fail( function(response){
          if( response.message && response.message.messageType){
            if( response.message.messageType == 'error') {
              $('#error_modal > div.modal-content > h4').val(response.message.messageText);
              $('#error_modal > div.modal-content > p').val(response.message.details);
              $('#error_modal').modal('open');
            } else {
              Materialize.toast( response.message.messageText + ": " + response.details, 4000, 'toast-'+response.message.messageType);
            }
          } else {
            Materialize.toast( "Server Failure", 4000, 'toast-fail');
          }
        });
      }
    });

  }


}
