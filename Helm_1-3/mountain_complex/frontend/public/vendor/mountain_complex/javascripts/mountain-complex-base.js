var MountainComplexBase = class {

  constructor() {
    var self = this;
  }

  static decodeListId( recordId, list) {
    var filteed
    if( list && Array.isArray(list) && list.length > 0) {

    }
  }

  static decodeListId( recordId, lists) {
    var self = this
      , name = "Unknown"
      , filteredList = []
      , foundObject = undefined;

    if( lists && Array.isArray(lists) && lists.length > 0) {

      filteredList = lists.filter(function( object){
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
    }

    return name;
  }


  static generateUUID() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }



  static sendMail( mailOptions) {
    if( mailOptions) {
      $.ajax({
        url: '/mailer/email'
        , type: 'post'
        , dataType: 'json'
        , data: mailOptions
        , encode: true
      }).done( function(response){
        if( response.message && response.message.messageType){
          if( response.message.messageType == 'error') {
            $('#error_modal > div.modal-content > h4').html(response.message.messageText);
            $('#error_modal > div.modal-content > p').html(response.message.details);
            $('#error_modal').modal('open');
          } else {
            Materialize.toast( response.message.messageText, 4000, 'toast-'+response.message.messageType);
          }
        }
      }).fail( function(response){
        if( response.message && response.message.messageType){
          if( response.message.messageType == 'error') {
            $('#error_modal > div.modal-content > h4').val(response.message.messageText);
            $('#error_modal > div.modal-content > p').val(response.message.details);
            $('#error_modal').modal('open');
          } else {
            Materialize.toast( response.message.messageText + ": " + response.message.details, 4000, 'toast-'+response.message.messageType);
          }
        } else {
          Materialize.toast( "Server Failure", 4000, 'toast-fail');
        }
      });

    }
  }


  static addSubmitHandler( formSelector, successPageUrl) {

    $(formSelector).on("submit", function(event){
      event.preventDefault();

      var $form = $(formSelector)
        , actionUrl = $form.attr('action')
        , data = $form.serialize();

      $.ajax({
        url: actionUrl
        , type: 'post'
        , dataType: 'json'
        , data: data
        , encode: true
      }).done( function(response){
        if( response.message && response.message.messageType){
          if( response.message.messageType == 'error') {
            $('#error_modal > div.modal-content > h4').html(response.message.messageText);
            $('#error_modal > div.modal-content > p').html(response.message.details);
            $('#error_modal').modal('open');
          } else {
            Materialize.toast( response.message.messageText, 4000, 'toast-'+response.message.messageType, function() {
              // change location
              if( response.message.messageType == 'success') {
                window.location.replace( successPageUrl);
              }
            });
          }
        }
      }).fail( function(response){
        if( response.message && response.message.messageType){
          if( response.message.messageType == 'error') {
            $('#error_modal > div.modal-content > h4').val(response.message.messageText);
            $('#error_modal > div.modal-content > p').val(response.message.details);
            $('#error_modal').modal('open');
          } else {
            Materialize.toast( response.message.messageText + ": " + response.message.details, 4000, 'toast-'+response.message.messageType);
          }
        } else {
          Materialize.toast( "Server Failure", 4000, 'toast-fail');
        }
      });
    });

  } // end addListeners


  static loadForm( formId, formData) {
    var fields = Object.keys( formData)
      , fields_count = fields.length
      , fields_processed = 0
      , $field = undefined
      , $label = undefined
      , original_value = undefined
      , modified_value = undefined;

    fields.forEach( function(field) {
      fields_processed++;
      if( formData[field]) {
        $field = $("#" + formId + " " + "#"+field);
        $label = $("#" + formId + " " + "label[for='"+field+"']");

        if( $field.attr('type') == 'date') {
          original_value = formData[field];
          modified_value = original_value.substr(0, 10);
          $field.val( modified_value);
          $label.addClass("active");
        } else {
          $field.val( formData[field]);
        }
      }

      if( fields_processed == fields_count) {
        Materialize.updateTextFields();
      }
    });
  }


  static modalActionHandler( trigger, action_url, action_title, title, message) {
    var self = this
      , modal_selector = '#action_modal'
      , action_button_selector = '#action_button'
      , action_button_title_selector = '#action_button_title'
      , modal_title = $(modal_selector + ' > div.modal-content > h4')
      , modal_message = $(modal_selector + ' > div.modal-content > p')
      , modal_action = $(action_button_title_selector);

    if( message == undefined) {
      message = "Are you sure?";
    }

    modal_title.html(title);
    modal_message.html(message);
    modal_action.html(action_title);

    $(modal_selector).modal('open');

    $(action_button_selector).click(function(event){
      event.preventDefault();

      $.ajax({
        url: action_url
        , type: 'post'
        , dataType: 'json'
        , data: {}
        , encode: true
      }).done( function(response){
        if( response.message && response.message.messageType){
          if( response.message.messageType == 'error') {
            $('#error_modal > div.modal-content > h4').html(response.message.messageText);
            $('#error_modal > div.modal-content > p').html(response.details);
            $('#error_modal').modal('open');
          } else {
            Materialize.toast( response.message.messageText, 4000, 'toast-'+response.message.messageType, function() {
              location.reload();
            });
          }

        }
      }).fail( function(response){
        if( response.message && response.message.messageType){
          if( response.message.messageType == 'error') {
            $('#error_modal > div.modal-content > h4').val(response.message.messageText);
            $('#error_modal > div.modal-content > p').val(response.details);
            $('#error_modal').modal('open');
          } else {
            Materialize.toast( response.message.messageText + ": " + response.details, 4000, 'toast-'+response.message.messageType, function() {
              location.reload();
            });
          }
        } else {
          Materialize.toast( "Server Failure", 4000, 'toast-fail');
        }
      });
    });

  }

}
